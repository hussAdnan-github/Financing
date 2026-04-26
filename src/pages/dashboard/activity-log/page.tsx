import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/pages/dashboard/components/DashboardLayout";
import { useActivityExport } from "@/hooks/useActivityExport";
import {
  mockClients,
  roleLabels,
  stageLabels,
  stageColors,
  type UserRole,
  type ClientStage,
} from "@/mocks/dashboardData";

interface ActivityEntry {
  id: string;
  clientId: string;
  clientName: string;
  clientService: string;
  clientCity: string;
  action: string;
  performedBy: string;
  role: UserRole;
  timestamp: string;
  note?: string;
  fromStage?: ClientStage;
  toStage?: ClientStage;
}

function buildActivityLog(): ActivityEntry[] {
  const entries: ActivityEntry[] = [];
  mockClients.forEach((client) => {
    client.actionLogs.forEach((log) => {
      entries.push({
        id: `${client.id}_${log.id}`,
        clientId: client.id,
        clientName: client.fullName,
        clientService: client.serviceType,
        clientCity: client.city,
        action: log.action,
        performedBy: log.performedBy,
        role: log.role,
        timestamp: log.timestamp,
        note: log.note,
        fromStage: log.fromStage,
        toStage: log.toStage,
      });
    });
  });
  return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

const roleColors: Record<UserRole, string> = {
  employee: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  supervisor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  auditor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  manager: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

const actionConfig: Record<string, { icon: string; color: string; bg: string }> = {
  "إنشاء الملف":        { icon: "ri-file-add-line",         color: "text-sky-600",    bg: "bg-sky-100" },
  "تعيين الموظف":       { icon: "ri-user-add-line",          color: "text-teal-600",   bg: "bg-teal-100" },
  "تحديث البيانات":     { icon: "ri-edit-line",              color: "text-amber-600",  bg: "bg-amber-100" },
  "تغيير المرحلة":      { icon: "ri-arrow-right-circle-line", color: "text-brand-600",  bg: "bg-brand-100" },
  "موافقة العميل":      { icon: "ri-thumb-up-line",          color: "text-green-600",  bg: "bg-green-100" },
  "اعتماد المدير":      { icon: "ri-vip-crown-line",         color: "text-rose-600",   bg: "bg-rose-100" },
  "موافقة المدقق":      { icon: "ri-shield-check-line",      color: "text-teal-600",   bg: "bg-teal-100" },
  "ردّ الملف للموظف":   { icon: "ri-arrow-go-back-line",     color: "text-orange-600", bg: "bg-orange-100" },
  "رفض الملف":          { icon: "ri-close-circle-line",      color: "text-red-600",    bg: "bg-red-100" },
  "إلغاء الملف":        { icon: "ri-forbid-line",            color: "text-gray-600",   bg: "bg-gray-100" },
  "تصنيف متعثر":        { icon: "ri-alert-line",             color: "text-red-600",    bg: "bg-red-100" },
  "تصنيف متعثر جزئي":   { icon: "ri-error-warning-line",    color: "text-orange-600", bg: "bg-orange-100" },
  "اكتمال التحصيل":     { icon: "ri-checkbox-circle-line",   color: "text-green-600",  bg: "bg-green-100" },
};

function getActionConfig(action: string) {
  return actionConfig[action] ?? { icon: "ri-history-line", color: "text-gray-500", bg: "bg-gray-100" };
}

function formatDate(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric" });
}

function formatTime(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
}

type PeriodFilter = "all" | "today" | "week" | "month";

const NOW = new Date("2026-04-24T12:00:00");

function inPeriod(ts: string, period: PeriodFilter): boolean {
  if (period === "all") return true;
  const d = new Date(ts);
  const diffMs = NOW.getTime() - d.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (period === "today") return diffDays < 1;
  if (period === "week") return diffDays < 7;
  if (period === "month") return diffDays < 30;
  return true;
}

const ALL_ACTIONS = Array.from(new Set(buildActivityLog().map((e) => e.action)));
const ALL_PERFORMERS = Array.from(new Set(buildActivityLog().map((e) => e.performedBy)));

export default function ActivityLogPage() {
  const allEntries = useMemo(() => buildActivityLog(), []);
  const { exportExcel, exportPDF } = useActivityExport();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [performerFilter, setPerformerFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("all");
  const [stageFilter, setStageFilter] = useState<ClientStage | "all">("all");
  const [page, setPage] = useState(1);
  const [exportLoading, setExportLoading] = useState<"excel" | "pdf" | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const PAGE_SIZE = 20;

  const filtered = useMemo(() => {
    return allEntries.filter((e) => {
      if (search && !e.clientName.includes(search) && !e.clientId.includes(search) && !e.performedBy.includes(search) && !e.action.includes(search)) return false;
      if (roleFilter !== "all" && e.role !== roleFilter) return false;
      if (actionFilter !== "all" && e.action !== actionFilter) return false;
      if (performerFilter !== "all" && e.performedBy !== performerFilter) return false;
      if (!inPeriod(e.timestamp, periodFilter)) return false;
      if (stageFilter !== "all" && e.toStage !== stageFilter && e.fromStage !== stageFilter) return false;
      return true;
    });
  }, [allEntries, search, roleFilter, actionFilter, performerFilter, periodFilter, stageFilter]);

  const paginated = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);

  const stats = useMemo(() => {
    const today = allEntries.filter((e) => inPeriod(e.timestamp, "today"));
    const byRole: Record<string, number> = {};
    allEntries.forEach((e) => { byRole[e.role] = (byRole[e.role] ?? 0) + 1; });
    return {
      total: allEntries.length,
      today: today.length,
      stageChanges: allEntries.filter((e) => e.action === "تغيير المرحلة").length,
      rejections: allEntries.filter((e) => e.action === "رفض الملف" || e.action === "ردّ الملف للموظف").length,
      byRole,
    };
  }, [allEntries]);

  const resetFilters = () => {
    setSearch(""); setRoleFilter("all"); setActionFilter("all");
    setPerformerFilter("all"); setPeriodFilter("all"); setStageFilter("all");
    setPage(1);
  };

  const hasFilters = search || roleFilter !== "all" || actionFilter !== "all" || performerFilter !== "all" || periodFilter !== "all" || stageFilter !== "all";

  const filterSummary = [
    search ? `بحث: ${search}` : "",
    roleFilter !== "all" ? `الدور: ${roleLabels[roleFilter as UserRole]}` : "",
    actionFilter !== "all" ? `الإجراء: ${actionFilter}` : "",
    performerFilter !== "all" ? `المنفذ: ${performerFilter}` : "",
    periodFilter !== "all" ? `الفترة: ${periodFilter}` : "",
    stageFilter !== "all" ? `المرحلة: ${stageLabels[stageFilter as ClientStage]}` : "",
  ].filter(Boolean).join(" | ") || "بدون فلاتر";

  const handleExport = async (type: "excel" | "pdf") => {
    setExportLoading(type);
    setExportMenuOpen(false);
    try {
      if (type === "excel") await exportExcel(filtered, filterSummary);
      else await exportPDF(filtered, filterSummary);
    } finally {
      setExportLoading(null);
    }
  };

  return (
    <DashboardLayout title="سجل الأنشطة">
      <div className="space-y-5" dir="rtl">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "إجمالي الأنشطة", value: stats.total, icon: "ri-history-line", color: "text-gray-600 dark:text-gray-300", bg: "bg-gray-100 dark:bg-gray-800" },
            { label: "أنشطة اليوم", value: stats.today, icon: "ri-calendar-check-line", color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-100 dark:bg-teal-900/40" },
            { label: "تغييرات المراحل", value: stats.stageChanges, icon: "ri-arrow-right-circle-line", color: "text-brand-600 dark:text-brand-400", bg: "bg-brand-100 dark:bg-brand-900/40" },
            { label: "ردود ورفض", value: stats.rejections, icon: "ri-close-circle-line", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40" },
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

        {/* Role breakdown */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">توزيع الأنشطة حسب الدور</p>
          <div className="flex flex-wrap gap-3">
            {(["employee", "supervisor", "auditor", "manager"] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => { setRoleFilter(roleFilter === role ? "all" : role); setPage(1); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                  roleFilter === role
                    ? "border-brand-400 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${roleColors[role]}`}>
                  {stats.byRole[role] ?? 0}
                </span>
                {roleLabels[role]}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-52">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400">
                <i className="ri-search-line text-sm"></i>
              </div>
              <input
                type="text"
                placeholder="بحث بالاسم، رقم الملف، المنفذ..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pr-9 pl-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            {/* Period */}
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {([["all", "الكل"], ["today", "اليوم"], ["week", "الأسبوع"], ["month", "الشهر"]] as [PeriodFilter, string][]).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => { setPeriodFilter(val); setPage(1); }}
                  className={`px-3 py-2 text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                    periodFilter === val
                      ? "bg-brand-500 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Action filter */}
            <select
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
              className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-brand-400 cursor-pointer"
            >
              <option value="all">كل الإجراءات</option>
              {ALL_ACTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>

            {/* Performer filter */}
            <select
              value={performerFilter}
              onChange={(e) => { setPerformerFilter(e.target.value); setPage(1); }}
              className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-brand-400 cursor-pointer"
            >
              <option value="all">كل المنفذين</option>
              {ALL_PERFORMERS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>

            {/* Stage filter */}
            <select
              value={stageFilter}
              onChange={(e) => { setStageFilter(e.target.value as ClientStage | "all"); setPage(1); }}
              className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-brand-400 cursor-pointer"
            >
              <option value="all">كل المراحل</option>
              {(Object.keys(stageLabels) as ClientStage[]).map((s) => (
                <option key={s} value={s}>{stageLabels[s]}</option>
              ))}
            </select>

            {hasFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer flex items-center gap-1 whitespace-nowrap"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-filter-off-line"></i>
                </div>
                مسح الفلاتر
              </button>
            )}
          </div>
        </div>

        {/* Results count + Export */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            عرض <span className="font-semibold text-gray-700 dark:text-gray-200">{Math.min(paginated.length, filtered.length)}</span> من{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-200">{filtered.length}</span> نشاط
          </p>

          <div className="relative">
            <button
              onClick={() => setExportMenuOpen((o) => !o)}
              disabled={filtered.length === 0 || exportLoading !== null}
              className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 disabled:opacity-50 cursor-pointer transition-colors whitespace-nowrap"
            >
              {exportLoading ? (
                <>
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-loader-4-line text-sm animate-spin"></i>
                  </div>
                  جاري التصدير...
                </>
              ) : (
                <>
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-download-2-line text-sm"></i>
                  </div>
                  تصدير ({filtered.length})
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-arrow-down-s-line text-sm"></i>
                  </div>
                </>
              )}
            </button>

            {exportMenuOpen && (
              <div className="absolute left-0 top-11 w-52 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 z-30 overflow-hidden">
                <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">تصدير {filtered.length} سجل</p>
                </div>
                <button
                  onClick={() => handleExport("excel")}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors text-right"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                    <i className="ri-file-excel-2-line text-emerald-600 dark:text-emerald-400 text-base"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">تصدير Excel</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">صيغة .xlsx قابلة للتعديل</p>
                  </div>
                </button>
                <button
                  onClick={() => handleExport("pdf")}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors text-right border-t border-gray-50 dark:border-gray-800"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
                    <i className="ri-file-pdf-2-line text-red-600 dark:text-red-400 text-base"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">تصدير PDF</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">تقرير جاهز للطباعة</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 py-16 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
            <div className="w-14 h-14 flex items-center justify-center mb-3">
              <i className="ri-history-line text-4xl"></i>
            </div>
            <p className="text-sm font-medium">لا توجد أنشطة تطابق الفلتر</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400">
              <div className="col-span-1">الوقت</div>
              <div className="col-span-2">العميل</div>
              <div className="col-span-2">الإجراء</div>
              <div className="col-span-2">المنفذ</div>
              <div className="col-span-2">التغيير</div>
              <div className="col-span-3">الملاحظة</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {paginated.map((entry, idx) => {
                const cfg = getActionConfig(entry.action);
                const showDateSep = idx === 0 || formatDate(entry.timestamp) !== formatDate(paginated[idx - 1].timestamp);
                return (
                  <div key={entry.id}>
                    {showDateSep && (
                      <div className="px-4 py-2 bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <div className="w-4 h-4 flex items-center justify-center">
                            <i className="ri-calendar-line text-xs"></i>
                          </div>
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>
                    )}
                    <div className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors items-start">
                      {/* Time */}
                      <div className="col-span-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{formatTime(entry.timestamp)}</span>
                      </div>

                      {/* Client */}
                      <div className="col-span-2">
                        <Link
                          to={`/dashboard/clients/${entry.clientId}`}
                          className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline block"
                        >
                          {entry.clientName}
                        </Link>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">{entry.clientId}</span>
                          <span className="text-gray-300 dark:text-gray-700">·</span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">{entry.clientService}</span>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-md ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                            <i className={`${cfg.icon} text-xs ${cfg.color}`}></i>
                          </div>
                          <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">{entry.action}</span>
                        </div>
                      </div>

                      {/* Performer */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                            <span className="text-[9px] font-bold text-gray-600 dark:text-gray-300">
                              {entry.performedBy.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-700 dark:text-gray-300">{entry.performedBy}</p>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${roleColors[entry.role]}`}>
                              {roleLabels[entry.role]}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stage change */}
                      <div className="col-span-2">
                        {entry.fromStage && entry.toStage ? (
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${stageColors[entry.fromStage]}`}>
                              {stageLabels[entry.fromStage]}
                            </span>
                            <div className="w-3 h-3 flex items-center justify-center text-gray-400">
                              <i className="ri-arrow-left-line text-[10px]"></i>
                            </div>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${stageColors[entry.toStage]}`}>
                              {stageLabels[entry.toStage]}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-300 dark:text-gray-600">—</span>
                        )}
                      </div>

                      {/* Note */}
                      <div className="col-span-3">
                        {entry.note ? (
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{entry.note}</p>
                        ) : (
                          <span className="text-xs text-gray-300 dark:text-gray-600">—</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load more */}
            {paginated.length < filtered.length && (
              <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-center">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="text-sm text-brand-600 hover:text-brand-700 font-medium cursor-pointer flex items-center gap-2"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-arrow-down-line"></i>
                  </div>
                  تحميل المزيد ({filtered.length - paginated.length} متبقي)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
