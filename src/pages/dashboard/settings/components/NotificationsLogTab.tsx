import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications, type NotificationType } from "@/hooks/useNotifications";
import { loadSubmissions, loadApprovalRequests } from "@/hooks/useNotificationsLogData";

// ─── Types ────────────────────────────────────────────────────────────────────
type LogSource = "system" | "realtime";
type LogCategory = "all" | "approval" | "submission" | "rejection" | "payment" | "review" | "other";

interface LogEntry {
  id: string;
  source: LogSource;
  type: NotificationType | "new_submission" | "manager_approval_request";
  title: string;
  detail: string;
  clientId?: string;
  clientName?: string;
  timestamp: string;
  read: boolean;
  priority: "high" | "medium" | "low";
  urgency?: "normal" | "urgent";
  requestedBy?: string;
  city?: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const typeConfig: Record<string, { icon: string; iconColor: string; bg: string; label: string; category: LogCategory }> = {
  new_request:              { icon: "ri-user-add-line",           iconColor: "text-sky-600",     bg: "bg-sky-100",     label: "طلب جديد",           category: "other" },
  data_complete:            { icon: "ri-checkbox-circle-line",    iconColor: "text-green-600",   bg: "bg-green-100",   label: "بيانات مكتملة",      category: "other" },
  pending_review:           { icon: "ri-eye-line",                iconColor: "text-amber-600",   bg: "bg-amber-100",   label: "بانتظار المراجعة",   category: "review" },
  review_returned:          { icon: "ri-arrow-go-back-line",      iconColor: "text-orange-600",  bg: "bg-orange-100",  label: "مردود للتصحيح",      category: "review" },
  review_approved:          { icon: "ri-shield-check-line",       iconColor: "text-teal-600",    bg: "bg-teal-100",    label: "اعتماد المدقق",      category: "review" },
  pending_approval:         { icon: "ri-time-line",               iconColor: "text-amber-600",   bg: "bg-amber-100",   label: "بانتظار الاعتماد",   category: "approval" },
  manager_approved:         { icon: "ri-check-double-line",       iconColor: "text-teal-600",    bg: "bg-teal-100",    label: "اعتماد المدير",      category: "approval" },
  file_rejected:            { icon: "ri-close-circle-line",       iconColor: "text-red-600",     bg: "bg-red-100",     label: "ملف مرفوض",          category: "rejection" },
  payment_due:              { icon: "ri-money-dollar-circle-line",iconColor: "text-rose-600",    bg: "bg-rose-100",    label: "متأخرات مالية",      category: "payment" },
  special_status:           { icon: "ri-alert-line",              iconColor: "text-red-600",     bg: "bg-red-100",     label: "حالة خاصة",          category: "other" },
  new_submission:           { icon: "ri-user-add-line",           iconColor: "text-brand-600",   bg: "bg-brand-100",   label: "طلب صفحة الهبوط",   category: "submission" },
  manager_approval_request: { icon: "ri-vip-crown-line",          iconColor: "text-amber-600",   bg: "bg-amber-100",   label: "طلب اعتماد استثنائي", category: "approval" },
};

const priorityConfig = {
  high:   { label: "عالي",    color: "bg-red-100 text-red-600" },
  medium: { label: "متوسط",   color: "bg-amber-100 text-amber-600" },
  low:    { label: "منخفض",   color: "bg-gray-100 text-gray-500" },
};

const categoryLabels: Record<LogCategory, string> = {
  all:        "الكل",
  approval:   "الاعتماد",
  submission: "الطلبات",
  rejection:  "الرفض",
  payment:    "المالية",
  review:     "المراجعة",
  other:      "أخرى",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function NotificationsLogTab() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, markAsRead, markAllAsRead } = useNotifications(user);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<LogCategory>("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | LogSource>("all");
  const [readFilter, setReadFilter] = useState<"all" | "read" | "unread">("all");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  // Load realtime logs from localStorage
  const realtimeSubmissions = useMemo(() => loadSubmissions(), []);
  const realtimeApprovals = useMemo(() => loadApprovalRequests(), []);

  // Build unified log entries
  const allEntries = useMemo<LogEntry[]>(() => {
    const entries: LogEntry[] = [];

    // System notifications
    notifications.forEach((n) => {
      entries.push({
        id: n.id,
        source: "system",
        type: n.type,
        title: n.message,
        detail: n.detail ?? "",
        clientId: n.clientId,
        clientName: n.clientName,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        read: n.read,
        priority: n.priority,
      });
    });

    // Realtime submissions
    realtimeSubmissions.forEach((s) => {
      entries.push({
        id: s.id,
        source: "realtime",
        type: "new_submission",
        title: `طلب جديد من ${s.clientName}`,
        detail: `${s.serviceType} — ${s.city}`,
        clientId: s.clientId,
        clientName: s.clientName,
        timestamp: s.submittedAt,
        read: s.notified,
        priority: "medium",
        city: s.city,
      });
    });

    // Realtime approval requests
    realtimeApprovals.forEach((a) => {
      entries.push({
        id: a.id,
        source: "realtime",
        type: "manager_approval_request",
        title: `طلب اعتماد استثنائي — ${a.clientName}`,
        detail: a.reason,
        clientId: a.clientId,
        clientName: a.clientName,
        timestamp: a.requestedAt,
        read: false,
        priority: a.urgency === "urgent" ? "high" : "medium",
        urgency: a.urgency,
        requestedBy: a.requestedBy,
      });
    });

    // Sort newest first
    return entries.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [notifications, realtimeSubmissions, realtimeApprovals]);

  // Stats
  const stats = useMemo(() => ({
    total: allEntries.length,
    unread: allEntries.filter((e) => !e.read).length,
    high: allEntries.filter((e) => e.priority === "high").length,
    urgent: allEntries.filter((e) => e.urgency === "urgent").length,
  }), [allEntries]);

  // Filtered entries
  const filtered = useMemo(() => {
    return allEntries.filter((e) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !e.title.includes(search) &&
          !e.detail.includes(search) &&
          !(e.clientName ?? "").includes(search) &&
          !(e.clientId ?? "").toLowerCase().includes(q)
        ) return false;
      }
      if (category !== "all") {
        const cfg = typeConfig[e.type];
        if (!cfg || cfg.category !== category) return false;
      }
      if (sourceFilter !== "all" && e.source !== sourceFilter) return false;
      if (readFilter === "read" && !e.read) return false;
      if (readFilter === "unread" && e.read) return false;
      return true;
    });
  }, [allEntries, search, category, sourceFilter, readFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleCategory = (v: LogCategory) => { setCategory(v); setPage(1); };
  const handleSource = (v: "all" | LogSource) => { setSourceFilter(v); setPage(1); };
  const handleReadFilter = (v: "all" | "read" | "unread") => { setReadFilter(v); setPage(1); };

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("ar-SA", { day: "numeric", month: "short", year: "numeric" });
  }
  function formatTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="space-y-4">

      {/* ── Stats Strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "إجمالي الإشعارات", value: stats.total, icon: "ri-notification-3-line", color: "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400" },
          { label: "غير مقروء", value: stats.unread, icon: "ri-mail-unread-line", color: "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400" },
          { label: "أولوية عالية", value: stats.high, icon: "ri-alarm-warning-line", color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" },
          { label: "طلبات عاجلة", value: stats.urgent, icon: "ri-vip-crown-line", color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${s.color}`}>
              <i className={`${s.icon} text-base`}></i>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3">

        {/* Search + actions row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full">
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
              <i className="ri-search-line text-gray-400 text-sm"></i>
            </div>
            <input
              type="text"
              placeholder="بحث بالاسم أو رقم الملف أو التفاصيل..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pr-9 pl-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => markAllAsRead()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-check-double-line text-sm"></i>
              تحديد الكل كمقروء
            </button>
            <button
              onClick={() => { setSearch(""); setCategory("all"); setSourceFilter("all"); setReadFilter("all"); setPage(1); }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-refresh-line text-sm"></i>
              إعادة ضبط
            </button>
          </div>
        </div>

        {/* Filter chips row */}
        <div className="flex flex-wrap gap-2">
          {/* Category */}
          <div className="flex items-center gap-1 flex-wrap">
            {(Object.keys(categoryLabels) as LogCategory[]).map((c) => (
              <button
                key={c}
                onClick={() => handleCategory(c)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  category === c
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {categoryLabels[c]}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 self-center hidden sm:block"></div>

          {/* Source */}
          <div className="flex items-center gap-1">
            {([["all", "الكل"], ["system", "النظام"], ["realtime", "فوري"]] as const).map(([v, l]) => (
              <button
                key={v}
                onClick={() => handleSource(v)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  sourceFilter === v
                    ? "bg-gray-700 dark:bg-gray-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 self-center hidden sm:block"></div>

          {/* Read status */}
          <div className="flex items-center gap-1">
            {([["all", "الكل"], ["unread", "غير مقروء"], ["read", "مقروء"]] as const).map(([v, l]) => (
              <button
                key={v}
                onClick={() => handleReadFilter(v)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  readFilter === v
                    ? "bg-gray-700 dark:bg-gray-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {filtered.length} نتيجة
          {search && ` لـ "${search}"`}
        </p>
      </div>

      {/* ── Table ── */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {paginated.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
              <i className="ri-notification-off-line text-gray-300 dark:text-gray-600 text-2xl"></i>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">لا توجد إشعارات تطابق الفلتر</p>
            <button
              onClick={() => { setSearch(""); setCategory("all"); setSourceFilter("all"); setReadFilter("all"); }}
              className="mt-3 text-xs text-brand-600 hover:underline cursor-pointer"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-gray-50/60 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400">
              <span>الإشعار</span>
              <span>التفاصيل</span>
              <span>النوع</span>
              <span>الأولوية</span>
              <span>التاريخ والوقت</span>
              <span>إجراء</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {paginated.map((entry) => {
                const cfg = typeConfig[entry.type] ?? typeConfig["new_request"];
                const pri = priorityConfig[entry.priority];
                return (
                  <div
                    key={entry.id}
                    className={`px-5 py-3.5 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors ${
                      !entry.read ? "bg-brand-50/20 dark:bg-brand-900/10" : ""
                    }`}
                  >
                    {/* Mobile layout */}
                    <div className="lg:hidden flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bg}`}>
                        <i className={`${cfg.icon} text-sm ${cfg.iconColor}`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm leading-snug ${!entry.read ? "font-semibold text-gray-800 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"}`}>
                            {entry.title}
                          </p>
                          {!entry.read && <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-1.5"></span>}
                        </div>
                        {entry.detail && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{entry.detail}</p>}
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${pri.color}`}>{pri.label}</span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">{formatDate(entry.timestamp)} {formatTime(entry.timestamp)}</span>
                          {entry.urgency === "urgent" && (
                            <span className="text-[9px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold px-1.5 py-0.5 rounded-full">عاجل</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 items-center">
                      {/* Title */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                          <i className={`${cfg.icon} text-sm ${cfg.iconColor}`}></i>
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm truncate ${!entry.read ? "font-semibold text-gray-800 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"}`}>
                            {entry.title}
                          </p>
                          {entry.clientId && (
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">{entry.clientId}</p>
                          )}
                        </div>
                        {!entry.read && <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0"></span>}
                      </div>

                      {/* Detail */}
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{entry.detail || "—"}</p>

                      {/* Type badge */}
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.iconColor}`}>
                          {cfg.label}
                        </span>
                        {entry.urgency === "urgent" && (
                          <span className="text-[9px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold px-1.5 py-0.5 rounded-full">عاجل</span>
                        )}
                      </div>

                      {/* Priority */}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium w-fit ${pri.color}`}>
                        {pri.label}
                      </span>

                      {/* Date */}
                      <div>
                        <p className="text-xs text-gray-700 dark:text-gray-300">{formatDate(entry.timestamp)}</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">{formatTime(entry.timestamp)}</p>
                      </div>

                      {/* Action */}
                      <div className="flex items-center gap-1.5">
                        {entry.clientId && (
                          <button
                            onClick={() => {
                              if (entry.source === "system") markAsRead(entry.id);
                              if (entry.type === "manager_approval_request") {
                                navigate("/dashboard/manager");
                              } else {
                                navigate(`/dashboard/clients/${entry.clientId}`);
                              }
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all cursor-pointer"
                            title="فتح الملف"
                          >
                            <i className="ri-external-link-line text-sm"></i>
                          </button>
                        )}
                        {!entry.read && entry.source === "system" && (
                          <button
                            onClick={() => markAsRead(entry.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all cursor-pointer"
                            title="تحديد كمقروء"
                          >
                            <i className="ri-check-line text-sm"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  صفحة {page} من {totalPages} — {filtered.length} إشعار
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <i className="ri-arrow-right-s-line text-base"></i>
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          page === p ? "bg-brand-500 text-white" : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <i className="ri-arrow-left-s-line text-base"></i>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
