import { useMemo, useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Client, UserRole } from "@/mocks/dashboardData";
import type { AuthUser } from "@/hooks/useAuth";

export type NotificationType =
  | "new_request"
  | "data_complete"
  | "pending_review"
  | "review_returned"
  | "review_approved"
  | "pending_approval"
  | "manager_approved"
  | "file_rejected"
  | "payment_due"
  | "special_status";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  detail?: string;
  clientId: string;
  clientName: string;
  time: string;
  read: boolean;
  targetRoles: UserRole[];
  priority: "high" | "medium" | "low";
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "الآن";
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays === 1) return "منذ يوم";
  if (diffDays < 7) return `منذ ${diffDays} أيام`;
  return date.toLocaleDateString("ar-SA");
}

function generateNotificationsFromClients(clients: Client[]): Notification[] {
  const notifs: Notification[] = [];

  clients.forEach((client) => {
    const lastLog = client.actionLogs[client.actionLogs.length - 1];
    const lastLogTime = lastLog?.timestamp ?? client.submittedAt;

    if (client.stage === "new_request" && !client.assignedTo) {
      notifs.push({
        id: `new_unassigned_${client.id}`,
        type: "new_request",
        message: `طلب جديد من ${client.fullName}`,
        detail: `${client.serviceType} — ${client.city} — بانتظار التعيين`,
        clientId: client.id,
        clientName: client.fullName,
        time: formatRelativeTime(client.submittedAt),
        read: false,
        targetRoles: ["supervisor", "manager"],
        priority: "high",
      });
    }

    if (client.stage === "new_request" && client.assignedTo) {
      notifs.push({
        id: `new_assigned_${client.id}`,
        type: "new_request",
        message: `تم تعيينك على ملف ${client.fullName}`,
        detail: `${client.serviceType} — ${client.city}`,
        clientId: client.id,
        clientName: client.fullName,
        time: formatRelativeTime(lastLogTime),
        read: false,
        targetRoles: ["employee"],
        priority: "high",
      });
    }

    if (client.reviewStatus === "returned" && client.reviewDeficiencies && client.reviewDeficiencies.length > 0) {
      const highCount = client.reviewDeficiencies.filter((d) => d.severity === "high").length;
      notifs.push({
        id: `review_returned_${client.id}`,
        type: "review_returned",
        message: `ملف ${client.fullName} مردود للتصحيح`,
        detail: `${client.reviewDeficiencies.length} نواقص${highCount > 0 ? ` (${highCount} عالية الأهمية)` : ""}`,
        clientId: client.id,
        clientName: client.fullName,
        time: formatRelativeTime(client.reviewedAt ?? lastLogTime),
        read: false,
        targetRoles: ["employee", "supervisor"],
        priority: "high",
      });
    }

    if (client.stage === "under_study" && client.reviewStatus === "pending") {
      notifs.push({
        id: `pending_review_${client.id}`,
        type: "pending_review",
        message: `ملف ${client.fullName} بانتظار مراجعتك`,
        detail: `${client.serviceType} — ${client.attachments.length} مرفق`,
        clientId: client.id,
        clientName: client.fullName,
        time: formatRelativeTime(lastLogTime),
        read: false,
        targetRoles: ["auditor"],
        priority: "medium",
      });
    }

    if (client.stage === "final_review" && client.reviewStatus === "approved") {
      notifs.push({
        id: `pending_approval_${client.id}`,
        type: "pending_approval",
        message: `ملف ${client.fullName} بانتظار اعتمادك`,
        detail: `اعتمده المدقق ${client.reviewedBy ?? ""} — ${client.serviceType}`,
        clientId: client.id,
        clientName: client.fullName,
        time: formatRelativeTime(client.reviewedAt ?? lastLogTime),
        read: false,
        targetRoles: ["manager"],
        priority: "high",
      });
    }

    if (client.stage === "signing") {
      const approvalLog = client.actionLogs.find((l) => l.action === "اعتماد المدير");
      if (approvalLog) {
        notifs.push({
          id: `manager_approved_${client.id}`,
          type: "manager_approved",
          message: `اعتمد المدير ملف ${client.fullName}`,
          detail: "يرجى متابعة توقيع العقود",
          clientId: client.id,
          clientName: client.fullName,
          time: formatRelativeTime(approvalLog.timestamp),
          read: false,
          targetRoles: ["employee", "supervisor"],
          priority: "medium",
        });
      }
    }

    if (client.specialStatus === "rejected") {
      const rejLog = client.actionLogs.find((l) => l.action === "رفض الملف");
      if (rejLog) {
        notifs.push({
          id: `file_rejected_${client.id}`,
          type: "file_rejected",
          message: `تم رفض ملف ${client.fullName}`,
          detail: client.specialStatusReason ?? "لم يُذكر السبب",
          clientId: client.id,
          clientName: client.fullName,
          time: formatRelativeTime(client.specialStatusDate ?? rejLog.timestamp),
          read: false,
          targetRoles: ["employee", "supervisor"],
          priority: "medium",
        });
      }
    }

    if (client.specialStatus === "defaulted" || client.specialStatus === "partial_default") {
      notifs.push({
        id: `special_status_${client.id}`,
        type: "special_status",
        message: `${client.specialStatus === "defaulted" ? "تعثّر" : "تعثّر جزئي"}: ${client.fullName}`,
        detail: client.specialStatusReason ?? "",
        clientId: client.id,
        clientName: client.fullName,
        time: formatRelativeTime(client.specialStatusDate ?? lastLogTime),
        read: false,
        targetRoles: ["supervisor", "manager"],
        priority: client.specialStatus === "defaulted" ? "high" : "medium",
      });
    }

    const studyLog = client.actionLogs.find(
      (l) => l.toStage === "under_study" && l.fromStage === "new_request"
    );
    if (studyLog) {
      notifs.push({
        id: `data_complete_${client.id}`,
        type: "data_complete",
        message: `اكتملت بيانات ${client.fullName}`,
        detail: `${client.attachments.length} مرفق — جاهز للدراسة`,
        clientId: client.id,
        clientName: client.fullName,
        time: formatRelativeTime(studyLog.timestamp),
        read: false,
        targetRoles: ["supervisor", "auditor"],
        priority: "low",
      });
    }

    if (client.stage === "collection" && client.financial?.paymentSchedule) {
      const now = new Date();
      const overdue = client.financial.paymentSchedule.filter((p) => {
        const due = new Date(p.dueDate);
        return due < now && p.status !== "مدفوع";
      });
      if (overdue.length > 0) {
        notifs.push({
          id: `payment_due_${client.id}`,
          type: "payment_due",
          message: `متأخرات مالية: ${client.fullName}`,
          detail: `${overdue.length} قسط متأخر — إجمالي ${overdue.reduce((s, p) => s + p.amount, 0).toLocaleString("ar-SA")} ر.س`,
          clientId: client.id,
          clientName: client.fullName,
          time: formatRelativeTime(overdue[0].dueDate),
          read: false,
          targetRoles: ["employee", "supervisor", "manager"],
          priority: "high",
        });
      }
    }
  });

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return notifs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

export function useNotifications(user: AuthUser | null, clients: Client[] = []) {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // تحميل الإشعارات المقروءة من Supabase
  useEffect(() => {
    if (!user) return;
    let mounted = true;

    const fetchReadNotifications = async () => {
      try {
        const { data } = await supabase
          .from("notifications")
          .select("id")
          .eq("read", true)
          .eq("target_role", user.role);

        if (data && mounted) {
          setReadIds(new Set(data.map((n) => n.id)));
        }
      } catch {
        // ignore
      }
    };

    fetchReadNotifications();
    return () => { mounted = false; };
  }, [user]);

  const allNotifications = useMemo(
    () => generateNotificationsFromClients(clients),
    [clients]
  );

  const notifications = useMemo(() => {
    if (!user) return [];
    return allNotifications
      .filter((n) => n.targetRoles.includes(user.role))
      .map((n) => ({ ...n, read: readIds.has(n.id) }));
  }, [allNotifications, user, readIds]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markAsRead = useCallback(async (id: string) => {
    setReadIds((prev) => new Set([...prev, id]));
    if (user) {
      try {
        await supabase
          .from("notifications")
          .upsert({ id, read: true, target_role: user.role, type: "system", message: "" });
      } catch {
        // ignore
      }
    }
  }, [user]);

  const markAllAsRead = useCallback(async () => {
    const ids = notifications.map((n) => n.id);
    setReadIds((prev) => new Set([...prev, ...ids]));
  }, [notifications]);

  return { notifications, unreadCount, markAsRead, markAllAsRead };
}
