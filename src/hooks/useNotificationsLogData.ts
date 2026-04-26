/**
 * Read-only helpers to load realtime notification logs from localStorage.
 * Used by NotificationsLogTab to display a unified history.
 */

// ── Submission entries ────────────────────────────────────────────────────────
export interface SubmissionLogEntry {
  id: string;
  clientId: string;
  clientName: string;
  serviceType: string;
  city: string;
  submittedAt: string;
  notified: boolean;
}

export function loadSubmissions(): SubmissionLogEntry[] {
  try {
    const raw = localStorage.getItem("landing_submissions_log");
    if (raw) return JSON.parse(raw) as SubmissionLogEntry[];
  } catch { /* ignore */ }
  return [];
}

// ── Approval request entries ──────────────────────────────────────────────────
export interface ApprovalRequestLogEntry {
  id: string;
  clientId: string;
  clientName: string;
  serviceType: string;
  urgency: "normal" | "urgent";
  reason: string;
  requestedBy: string;
  requestedAt: string;
}

export function loadApprovalRequests(): ApprovalRequestLogEntry[] {
  try {
    const raw = localStorage.getItem("manager_approval_requests_log");
    if (raw) return JSON.parse(raw) as ApprovalRequestLogEntry[];
  } catch { /* ignore */ }
  return [];
}
