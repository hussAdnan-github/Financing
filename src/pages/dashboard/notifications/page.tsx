import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/pages/dashboard/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications, type NotificationType } from "@/hooks/useNotifications";

const typeLabels: Record<NotificationType, string> = {
  new_request: "طلب جديد",
  data_complete: "اكتمال البيانات",
  pending_review: "بانتظار المراجعة",
  review_returned: "مردود للتصحيح",
  review_approved: "موافقة المدقق",
  pending_approval: "بانتظار الاعتماد",
  manager_approved: "اعتماد المدير",
  file_rejected: "ملف مرفوض",
  payment_due: "متأخرات مالية",
  special_status: "حالة خاصة",
};

const typeConfig: Record<NotificationType, { icon: string; iconColor: string; bgColor: string; badgeColor: string }> = {
  new_request:      { icon: "ri-user-add-line",           iconColor: "text-sky-600",    bgColor: "bg-sky-50",    badgeColor: "bg-sky-100 text-sky-700" },
  data_complete:    { icon: "ri-checkbox-circle-line",     iconColor: "text-green-600",  bgColor: "bg-green-50",  badgeColor: "bg-green-100 text-green-700" },
  pending_review:   { icon: "ri-eye-line",                 iconColor: "text-amber-600",  bgColor: "bg-amber-50",  badgeColor: "bg-amber-100 text-amber-700" },
  review_returned:  { icon: "ri-arrow-go-back-line",       iconColor: "text-orange-600", bgColor: "bg-orange-50", badgeColor: "bg-orange-100 text-orange-700" },
  review_approved:  { icon: "ri-shield-check-line",        iconColor: "text-teal-600",   bgColor: "bg-teal-50",   badgeColor: "bg-teal-100 text-teal-700" },
  pending_approval: { icon: "ri-time-line",                iconColor: "text-amber-600",  bgColor: "bg-amber-50",  badgeColor: "bg-amber-100 text-amber-700" },
  manager_approved: { icon: "ri-check-double-line",        iconColor: "text-teal-600",   bgColor: "bg-teal-50",   badgeColor: "bg-teal-100 text-teal-700" },
  file_rejected:    { icon: "ri-close-circle-line",        iconColor: "text-red-600",    bgColor: "bg-red-50",    badgeColor: "bg-red-100 text-red-700" },
  payment_due:      { icon: "ri-money-dollar-circle-line", iconColor: "text-rose-600",   bgColor: "bg-rose-50",   badgeColor: "bg-rose-100 text-rose-700" },
  special_status:   { icon: "ri-alert-line",               iconColor: "text-red-600",    bgColor: "bg-red-50",    badgeColor: "bg-red-100 text-red-700" },
};

const priorityConfig = {
  high:   { label: "عالي",    color: "bg-red-100 text-red-600",    dot: "bg-red-500" },
  medium: { label: "متوسط",   color: "bg-amber-100 text-amber-600", dot: "bg-amber-500" },
  low:    { label: "منخفض",   color: "bg-gray-100 text-gray-500",  dot: "bg-gray-400" },
};

type PeriodFilter = "all" | "today" | "week" | "month";
type ReadFilter = "all" | "unread" | "read";

const NOW = new Date("2026-04-24T12:00:00");

function isInPeriod(timeStr: string, period: PeriodFilter): boolean {
  if (period === "all") return true;
  // timeStr is relative like "منذ 5 دقائق" — we need raw date
  // We'll use the raw date from the notification's raw timestamp
  return true; // handled via rawDate below
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(user);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<NotificationType | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [readFilter, setReadFilter] = useState<ReadFilter>("all");
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("all");

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (searchQuery && !n.message.includes(searchQuery) && !n.clientName.includes(searchQuery) && !n.clientId.includes(searchQuery)) return false;
      if (typeFilter !== "all" && n.type !== typeFilter) return false;
      if (priorityFilter !== "all" && n.priority !== priorityFilter) return false;
      if (readFilter === "unread" && n.read) return false;
      if (readFilter === "read" && !n.read) return false;
      return true;
    });
  }, [notifications, searchQuery, typeFilter, priorityFilter, readFilter, periodFilter]);

  const stats = useMemo(() => ({
    total: notifications.length,
    unread: unreadCount,
    high: notifications.filter((n) => n.priority === "high").length,
    today: notifications.filter((n) => n.time.includes("دقيقة") || n.time.includes("ساعة") || n.time === "الآن").length,
  }), [notifications, unreadCount]);

  const handleNotifClick = (id: string, clientId: string) => {
    markAsRead(id);
    navigate(`/dashboard/clients/${clientId}`);
  };

  return (
    <DashboardLayout title="سجل التنبيهات">
      <div className="space-y-5" dir="rtl">

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "إجمالي التنبيهات", value: stats.total, icon: "ri-notification-3-line", color: "text-gray-600 dark:text-gray-300", bg: "bg-gray-100 dark:bg-gray-800" },
            { label: "غير مقروء", value: stats.unread, icon: "ri-mail-unread-line", color: "text-brand-600 dark:text-brand-400", bg: "bg-brand-100 dark:bg-brand-900/40" },
            { label: "أولوية عالية", value: stats.high, icon: "ri-alarm-warning-line", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40" },
            { label: "اليوم", value: stats.today, icon: "ri-calendar-check-line", color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-100 dark:bg-teal-900/40" },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <i className={`${s.icon} text-lg ${s.color}`}></i>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400">
                <i className="ri-search-line text-sm"></i>
              </div>
              <input
                type="text"
                placeholder="بحث بالاسم أو رقم الملف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-9 pl-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as NotificationType | "all")}
              className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-brand-400 cursor-pointer"
            >
              <option value="all">كل الأنواع</option>
              {(Object.keys(typeLabels) as NotificationType[]).map((t) => (
                <option key={t} value={t}>{typeLabels[t]}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as "all" | "high" | "medium" | "low")}
              className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-brand-400 cursor-pointer"
            >
              <option value="all">كل الأولويات</option>
              <option value="high">عالية</option>
              <option value="medium">متوسطة</option>
              <option value="low">منخفضة</option>
            </select>

            {/* Read Filter */}
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {([["all", "الكل"], ["unread", "غير مقروء"], ["read", "مقروء"]] as [ReadFilter, string][]).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setReadFilter(val)}
                  className={`px-3 py-2 text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                    readFilter === val
                      ? "bg-brand-500 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Mark all read */}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-brand-600 hover:text-brand-700 font-medium whitespace-nowrap cursor-pointer flex items-center gap-1"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-check-double-line"></i>
                </div>
                تحديد الكل كمقروء
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            عرض <span className="font-semibold text-gray-700 dark:text-gray-200">{filtered.length}</span> تنبيه
            {filtered.length !== notifications.length && ` من أصل ${notifications.length}`}
          </p>
        </div>

        {/* Notifications List */}
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 py-16 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
            <div className="w-14 h-14 flex items-center justify-center mb-3">
              <i className="ri-notification-off-line text-4xl"></i>
            </div>
            <p className="text-sm font-medium">لا توجد تنبيهات تطابق الفلتر</p>
            <p className="text-xs mt-1">جرّب تغيير معايير البحث</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((n) => {
              const cfg = typeConfig[n.type];
              const pri = priorityConfig[n.priority];
              return (
                <div
                  key={n.id}
                  onClick={() => handleNotifClick(n.id, n.clientId)}
                  className={`bg-white dark:bg-gray-900 rounded-xl border cursor-pointer transition-all hover:border-brand-200 dark:hover:border-brand-700 ${
                    !n.read
                      ? "border-brand-100 dark:border-brand-800 bg-brand-50/20 dark:bg-brand-900/10"
                      : "border-gray-100 dark:border-gray-800"
                  }`}
                >
                  <div className="p-4 flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl ${cfg.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <i className={`${cfg.icon} text-lg ${cfg.iconColor}`}></i>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${cfg.badgeColor}`}>
                              {typeLabels[n.type]}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${pri.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${pri.dot}`}></span>
                              {pri.label}
                            </span>
                            {!n.read && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400">
                                جديد
                              </span>
                            )}
                          </div>
                          <p className={`text-sm leading-relaxed ${!n.read ? "font-semibold text-gray-800 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"}`}>
                            {n.message}
                          </p>
                          {n.detail && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.detail}</p>
                          )}
                        </div>

                        {/* Right side */}
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{n.time}</span>
                          <span className="text-xs font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-md">
                            {n.clientId}
                          </span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400 dark:text-gray-500">{n.clientName}</span>
                        <span className="text-gray-200 dark:text-gray-700">|</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                          className={`text-xs cursor-pointer transition-colors ${
                            n.read ? "text-gray-300 dark:text-gray-600 cursor-default" : "text-brand-500 hover:text-brand-700"
                          }`}
                        >
                          {n.read ? "مقروء" : "تحديد كمقروء"}
                        </button>
                        <span className="text-gray-200 dark:text-gray-700">|</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/clients/${n.clientId}`); }}
                          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer flex items-center gap-1"
                        >
                          <div className="w-3 h-3 flex items-center justify-center">
                            <i className="ri-external-link-line text-xs"></i>
                          </div>
                          فتح الملف
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
