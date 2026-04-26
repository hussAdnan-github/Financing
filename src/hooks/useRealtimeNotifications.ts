import { useState, useEffect, useCallback, useRef } from "react";
import { useNotificationSound } from "@/hooks/useNotificationSound";

export interface ToastNotification {
  id: string;
  type: "new_submission" | "manager_approval_request" | "info" | "success" | "warning";
  title: string;
  message: string;
  clientId?: string;
  clientName?: string;
  serviceType?: string;
  urgency?: "normal" | "urgent";
  requestedBy?: string;
  timestamp: number;
  read: boolean;
}

const STORAGE_KEY = "landing_submissions_log";
const LAST_CHECK_KEY = "last_notif_check";

interface SubmissionEntry {
  id: string;
  clientId: string;
  clientName: string;
  serviceType: string;
  city: string;
  submittedAt: string;
  notified: boolean;
}

function loadSubmissions(): SubmissionEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as SubmissionEntry[];
  } catch { /* ignore */ }
  return [];
}

function saveSubmissions(entries: SubmissionEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// ── Manager Approval Request ─────────────────────────────────────────────────
const MANAGER_APPROVAL_KEY = "manager_approval_requests_log";

interface ApprovalRequestEntry {
  id: string;
  clientId: string;
  clientName: string;
  serviceType: string;
  urgency: "normal" | "urgent";
  reason: string;
  requestedBy: string;
  requestedAt: string;
}

function loadApprovalRequests(): ApprovalRequestEntry[] {
  try {
    const raw = localStorage.getItem(MANAGER_APPROVAL_KEY);
    if (raw) return JSON.parse(raw) as ApprovalRequestEntry[];
  } catch { /* ignore */ }
  return [];
}

function saveApprovalRequests(entries: ApprovalRequestEntry[]) {
  localStorage.setItem(MANAGER_APPROVAL_KEY, JSON.stringify(entries));
}

export function logManagerApprovalRequest(
  clientId: string,
  clientName: string,
  serviceType: string,
  urgency: "normal" | "urgent",
  reason: string,
  requestedBy: string
) {
  const entries = loadApprovalRequests();
  const entry: ApprovalRequestEntry = {
    id: `apr_${Date.now()}`,
    clientId,
    clientName,
    serviceType,
    urgency,
    reason,
    requestedBy,
    requestedAt: new Date().toISOString(),
  };
  entries.unshift(entry);
  saveApprovalRequests(entries.slice(0, 50));
  // Dispatch event so DashboardLayout picks it up
  window.dispatchEvent(new CustomEvent("manager_approval_request", { detail: entry }));
}

export function logNewSubmission(clientId: string, clientName: string, serviceType: string, city: string) {
  const entries = loadSubmissions();
  const entry: SubmissionEntry = {
    id: `sub_${Date.now()}`,
    clientId,
    clientName,
    serviceType,
    city,
    submittedAt: new Date().toISOString(),
    notified: false,
  };
  entries.unshift(entry);
  // Keep only last 50
  saveSubmissions(entries.slice(0, 50));
  // Dispatch custom event so dashboard picks it up
  window.dispatchEvent(new CustomEvent("new_landing_submission", { detail: entry }));
}

export function useRealtimeNotifications() {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [unreadToastCount, setUnreadToastCount] = useState(0);
  const listenerRef = useRef(false);
  const { play } = useNotificationSound();

  const addToast = useCallback((toast: Omit<ToastNotification, "id" | "timestamp" | "read">) => {
    const newToast: ToastNotification = {
      ...toast,
      id: `toast_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      timestamp: Date.now(),
      read: false,
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 10));
    setUnreadToastCount((c) => c + 1);

    // Play sound based on urgency
    const urgency = toast.urgency === "urgent" ? "urgent" : "normal";
    play(urgency);

    // Auto-dismiss after 6s (urgent: 10s)
    const dismissDelay = toast.urgency === "urgent" ? 10000 : 6000;
    setTimeout(() => {
      dismissToast(newToast.id);
    }, dismissDelay);
  }, [play]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const markToastRead = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => t.id === id ? { ...t, read: true } : t));
    setUnreadToastCount((c) => Math.max(0, c - 1));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
    setUnreadToastCount(0);
  }, []);

  // Listen for new submissions from landing page
  useEffect(() => {
    if (listenerRef.current) return;
    listenerRef.current = true;

    const submissionHandler = (e: Event) => {
      const detail = (e as CustomEvent).detail as SubmissionEntry;
      addToast({
        type: "new_submission",
        title: "طلب جديد وصل!",
        message: `${detail.clientName} — ${detail.serviceType} — ${detail.city}`,
        clientId: detail.clientId,
        clientName: detail.clientName,
      });
    };

    const approvalHandler = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        clientId: string;
        clientName: string;
        serviceType: string;
        urgency: "normal" | "urgent";
        reason: string;
        requestedBy: string;
      };
      addToast({
        type: "manager_approval_request",
        title: detail.urgency === "urgent" ? "طلب اعتماد عاجل!" : "طلب اعتماد جديد",
        message: `${detail.clientName} — ${detail.serviceType}`,
        clientId: detail.clientId,
        clientName: detail.clientName,
        serviceType: detail.serviceType,
        urgency: detail.urgency,
        requestedBy: detail.requestedBy,
      });
    };

    window.addEventListener("new_landing_submission", submissionHandler);
    window.addEventListener("manager_approval_request", approvalHandler);
    return () => {
      window.removeEventListener("new_landing_submission", submissionHandler);
      window.removeEventListener("manager_approval_request", approvalHandler);
      listenerRef.current = false;
    };
  }, [addToast]);

  // Simulate periodic check for demo (every 30s, random chance)
  useEffect(() => {
    const demoNames = [
      { name: "عبدالله المطيري", service: "سداد متعثرات", city: "الرياض" },
      { name: "نورة الشمري", service: "تمويل عقاري", city: "جدة" },
      { name: "فهد العتيبي", service: "استخراج تمويل شخصي", city: "الدمام" },
      { name: "سارة الزهراني", service: "فك رهن", city: "مكة المكرمة" },
      { name: "خالد الحربي", service: "تمويل ناجيري", city: "الطائف" },
    ];

    let demoIdx = 0;
    const interval = setInterval(() => {
      // 30% chance every 45 seconds for demo purposes
      if (Math.random() < 0.3) {
        const demo = demoNames[demoIdx % demoNames.length];
        demoIdx++;
        const clientId = `CLT-DEMO-${Date.now()}`;
        addToast({
          type: "new_submission",
          title: "طلب جديد وصل!",
          message: `${demo.name} — ${demo.service} — ${demo.city}`,
          clientId,
          clientName: demo.name,
        });
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [addToast]);

  return { toasts, unreadToastCount, dismissToast, markToastRead, clearAllToasts, addToast };
}
