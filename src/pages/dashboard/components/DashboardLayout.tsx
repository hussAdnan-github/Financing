import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications, type NotificationType } from "@/hooks/useNotifications";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { useClients } from "@/hooks/useClients";
import RealtimeToast from "@/components/feature/RealtimeToast";
import { roleLabels, type UserRole } from "@/mocks/dashboardData";
import { DashboardDarkModeProvider, useDashboardDarkMode } from "@/pages/dashboard/context/DashboardDarkModeContext";
import GlobalSearch from "@/pages/dashboard/components/GlobalSearch";

const roleColors: Record<UserRole, string> = {
  employee: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  supervisor: "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300",
  auditor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  manager: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

const notifConfig: Record<NotificationType, { icon: string; iconColor: string; bgColor: string }> = {
  new_request:      { icon: "ri-user-add-line",              iconColor: "text-sky-600",    bgColor: "bg-sky-100" },
  data_complete:    { icon: "ri-checkbox-circle-line",        iconColor: "text-green-600",  bgColor: "bg-green-100" },
  pending_review:   { icon: "ri-eye-line",                    iconColor: "text-amber-600",  bgColor: "bg-amber-100" },
  review_returned:  { icon: "ri-arrow-go-back-line",          iconColor: "text-orange-600", bgColor: "bg-orange-100" },
  review_approved:  { icon: "ri-shield-check-line",           iconColor: "text-teal-600",   bgColor: "bg-teal-100" },
  pending_approval: { icon: "ri-time-line",                   iconColor: "text-amber-600",  bgColor: "bg-amber-100" },
  manager_approved: { icon: "ri-check-double-line",           iconColor: "text-teal-600",   bgColor: "bg-teal-100" },
  file_rejected:    { icon: "ri-close-circle-line",           iconColor: "text-red-600",    bgColor: "bg-red-100" },
  payment_due:      { icon: "ri-money-dollar-circle-line",    iconColor: "text-rose-600",   bgColor: "bg-rose-100" },
  special_status:   { icon: "ri-alert-line",                  iconColor: "text-red-600",    bgColor: "bg-red-100" },
};

const priorityBadge: Record<string, string> = {
  high:   "bg-red-100 text-red-600",
  medium: "bg-amber-100 text-amber-600",
  low:    "bg-gray-100 text-gray-500",
};

const priorityLabel: Record<string, string> = {
  high: "عالي",
  medium: "متوسط",
  low: "منخفض",
};

const allNavItems = [
  { icon: "ri-dashboard-3-line", label: "الرئيسية", path: "/dashboard", roles: ["employee", "supervisor", "auditor", "manager"] as UserRole[] },
  { icon: "ri-folder-user-line", label: "ملفات العملاء", path: "/dashboard/clients", roles: ["employee", "supervisor", "auditor", "manager"] as UserRole[] },
  { icon: "ri-user-add-line", label: "توزيع العملاء", path: "/dashboard/assignments", roles: ["supervisor", "manager"] as UserRole[] },
  { icon: "ri-shield-check-line", label: "مراجعة المدقق", path: "/dashboard/auditor-review", roles: ["auditor", "manager"] as UserRole[] },
  { icon: "ri-vip-crown-line", label: "لوحة المدير", path: "/dashboard/manager", roles: ["manager"] as UserRole[] },
  { icon: "ri-archive-line", label: "الأرشيف", path: "/dashboard/archive", roles: ["supervisor", "auditor", "manager"] as UserRole[] },
  { icon: "ri-bar-chart-2-line", label: "التقارير", path: "/dashboard/reports", roles: ["supervisor", "auditor", "manager"] as UserRole[] },
  { icon: "ri-search-2-line", label: "البحث المتقدم", path: "/dashboard/advanced-search", roles: ["employee", "supervisor", "auditor", "manager"] as UserRole[] },
  { icon: "ri-notification-3-line", label: "سجل التنبيهات", path: "/dashboard/notifications", roles: ["employee", "supervisor", "auditor", "manager"] as UserRole[] },
  { icon: "ri-history-line", label: "سجل الأنشطة", path: "/dashboard/activity-log", roles: ["manager"] as UserRole[] },
  { icon: "ri-shield-keyhole-line", label: "الأدوار والصلاحيات", path: "/dashboard/settings/permissions", roles: ["manager", "supervisor"] as UserRole[] },
  { icon: "ri-settings-3-line", label: "الإعدادات", path: "/dashboard/settings", roles: ["manager"] as UserRole[] },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

function DashboardLayoutInner({ children, title }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { dark, toggle } = useDashboardDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");
  const notifRef = useRef<HTMLDivElement>(null);

  const currentUser = user ?? { name: "زائر", role: "employee" as UserRole, initials: "ز", id: "", email: "" };
  const { clients } = useClients();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(user, clients);
  const { toasts, unreadToastCount, dismissToast, markToastRead } = useRealtimeNotifications();

  const totalUnread = unreadCount + unreadToastCount;

  const navItems = allNavItems.filter((item) =>
    item.roles.includes(currentUser.role)
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);

  const filteredNotifs = activeFilter === "unread"
    ? notifications.filter((n) => !n.read)
    : notifications;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-300" dir="rtl">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800 z-40 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-gray-100 dark:border-gray-800">
          <img
            src="https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/820133cd-4a0c-452f-b662-b06701724b7d_-01.png?v=b2bfc75afceae2a1fe14bb1170d72133"
            alt="الشعار"
            className="h-18 w-auto object-contain"
          />
        </div>

        {/* Role Badge */}
        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{currentUser.initials}</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">{currentUser.name}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${roleColors[currentUser.role]}`}>
                {roleLabels[currentUser.role]}
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path || (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  active
                    ? "bg-brand-500 text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className={`${item.icon} text-base`}></i>
                </div>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800">
          {/* معاينة صفحة الهبوط — مدير فقط */}
          {currentUser.role === "manager" && (
            <Link
              to="/dashboard/landing-preview"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-all cursor-pointer"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-layout-line text-base"></i>
              </div>
              معاينة صفحة الهبوط
            </Link>
          )}
          <Link
            to="/website"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-all cursor-pointer"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-global-line text-base"></i>
            </div>
            الموقع الإلكتروني
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer mt-1"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-logout-box-r-line text-base"></i>
            </div>
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main */}
      <div className="flex-1 md:mr-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            >
              <i className="ri-menu-3-line text-lg"></i>
            </button>
            {title && (
              <h1 className="text-base font-bold text-gray-800 dark:text-gray-100 hidden sm:block">{title}</h1>
            )}
          </div>

          {/* Global Search */}
          <div className="flex-1 flex justify-center px-4 max-w-sm mx-auto">
            <GlobalSearch />
          </div>

          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggle}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              title={dark ? "الوضع الفاتح" : "الوضع الداكن"}
            >
              <i className={`text-lg ${dark ? "ri-sun-line" : "ri-moon-line"}`}></i>
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer relative"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <i className="ri-notification-3-line text-lg"></i>
                {totalUnread > 0 && (
                  <span className={`absolute top-1 right-1 min-w-[16px] h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 ${
                    unreadToastCount > 0 ? "bg-amber-500" : "bg-red-500"
                  }`}>
                    {totalUnread > 9 ? "9+" : totalUnread}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute left-0 top-11 w-96 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden flex flex-col" style={{ maxHeight: "520px" }}>
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-100">التنبيهات</span>
                      {totalUnread > 0 && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          unreadToastCount > 0
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                            : "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                        }`}>
                          {totalUnread} جديد
                        </span>
                      )}
                    </div>
                    <button
                      className="text-xs text-brand-600 cursor-pointer hover:underline whitespace-nowrap"
                      onClick={markAllAsRead}
                    >
                      تحديد الكل كمقروء
                    </button>
                  </div>

                  {/* Realtime toasts section */}
                  {toasts.filter((t) => !t.read).length > 0 && (
                    <div className="border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
                      <div className="px-4 py-2 bg-amber-50/60 dark:bg-amber-900/20 flex items-center gap-2">
                        <div className="w-3 h-3 flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse block"></span>
                        </div>
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">إشعارات فورية</span>
                      </div>
                      {toasts.filter((t) => !t.read).slice(0, 3).map((t) => (
                        <div
                          key={t.id}
                          className={`px-4 py-2.5 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors flex items-start gap-3`}
                          onClick={() => {
                            markToastRead(t.id);
                            setNotifOpen(false);
                            if (t.type === "manager_approval_request") {
                              navigate("/dashboard/manager");
                            } else if (t.clientId) {
                              navigate(`/dashboard/clients/${t.clientId}`);
                            }
                          }}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            t.type === "manager_approval_request"
                              ? t.urgency === "urgent" ? "bg-red-100 dark:bg-red-900/40" : "bg-amber-100 dark:bg-amber-900/40"
                              : "bg-brand-100 dark:bg-brand-900/40"
                          }`}>
                            <i className={`text-xs ${
                              t.type === "manager_approval_request"
                                ? t.urgency === "urgent" ? "ri-vip-crown-line text-red-600" : "ri-vip-crown-line text-amber-600"
                                : "ri-user-add-line text-brand-600"
                            }`}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">{t.title}</p>
                              {t.urgency === "urgent" && (
                                <span className="text-[9px] bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">عاجل</span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">{t.message}</p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                              {new Date(t.timestamp).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Filter tabs */}
                  <div className="flex border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
                    <button
                      onClick={() => setActiveFilter("all")}
                      className={`flex-1 py-2 text-xs font-medium transition-colors cursor-pointer ${
                        activeFilter === "all"
                          ? "text-brand-600 border-b-2 border-brand-500"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      }`}
                    >
                      الكل ({notifications.length})
                    </button>
                    <button
                      onClick={() => setActiveFilter("unread")}
                      className={`flex-1 py-2 text-xs font-medium transition-colors cursor-pointer ${
                        activeFilter === "unread"
                          ? "text-brand-600 border-b-2 border-brand-500"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      }`}
                    >
                      غير مقروء ({unreadCount})
                    </button>
                  </div>

                  {/* List */}
                  <div className="overflow-y-auto flex-1">
                    {filteredNotifs.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-600">
                        <div className="w-10 h-10 flex items-center justify-center mb-2">
                          <i className="ri-notification-off-line text-2xl"></i>
                        </div>
                        <p className="text-xs">لا توجد تنبيهات</p>
                      </div>
                    ) : (
                      filteredNotifs.map((n) => {
                        const cfg = notifConfig[n.type];
                        return (
                          <div
                            key={n.id}
                            className={`px-4 py-3 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                              !n.read ? "bg-brand-50/30 dark:bg-brand-900/10" : ""
                            }`}
                            onClick={() => {
                              markAsRead(n.id);
                              setNotifOpen(false);
                              navigate(`/dashboard/clients/${n.clientId}`);
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bgColor}`}>
                                <i className={`${cfg.icon} text-sm ${cfg.iconColor}`}></i>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p className={`text-xs leading-relaxed ${!n.read ? "font-semibold text-gray-800 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"}`}>
                                    {n.message}
                                  </p>
                                  {!n.read && (
                                    <div className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0 mt-1"></div>
                                  )}
                                </div>
                                {n.detail && (
                                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{n.detail}</p>
                                )}
                                <div className="flex items-center gap-2 mt-1.5">
                                  <span className="text-[10px] text-gray-400 dark:text-gray-500">{n.time}</span>
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${priorityBadge[n.priority]}`}>
                                    {priorityLabel[n.priority]}
                                  </span>
                                  <span className="text-[10px] text-brand-500 font-medium">{n.clientId}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 flex-shrink-0 flex items-center justify-between">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">
                      مرتبطة بالأحداث الفعلية
                    </p>
                    <button
                      onClick={() => { setNotifOpen(false); navigate("/dashboard/notifications"); }}
                      className="text-xs text-brand-600 hover:text-brand-700 font-medium cursor-pointer flex items-center gap-1"
                    >
                      عرض الكل
                      <div className="w-3 h-3 flex items-center justify-center">
                        <i className="ri-arrow-left-line text-xs"></i>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Role badge in topbar */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">{currentUser.initials}</span>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 leading-none">{currentUser.name}</p>
                <span className={`text-[9px] font-medium ${roleColors[currentUser.role]}`}>{roleLabels[currentUser.role]}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Realtime Toast Notifications */}
      <RealtimeToast toasts={toasts} onDismiss={dismissToast} onRead={markToastRead} />
    </div>
  );
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <DashboardDarkModeProvider>
      <DashboardLayoutInner title={title}>{children}</DashboardLayoutInner>
    </DashboardDarkModeProvider>
  );
}
