import { useState } from "react";
import DashboardLayout from "@/pages/dashboard/components/DashboardLayout";
import { reportsData, specialStatusStats } from "@/mocks/dashboardData";

type ReportTab = "operational" | "financial";
type DateRange = "this_month" | "last_month" | "last_3_months" | "this_year";

const dateRangeLabels: Record<DateRange, string> = {
  this_month: "هذا الشهر",
  last_month: "الشهر الماضي",
  last_3_months: "آخر 3 أشهر",
  this_year: "هذا العام",
};

function BarChart({ data, labelKey, valueKey, color = "bg-brand-400" }: {
  data: Record<string, string | number>[];
  labelKey: string;
  valueKey: string;
  color?: string;
}) {
  const max = Math.max(...data.map((d) => Number(d[valueKey])));
  return (
    <div className="space-y-2.5">
      {data.map((item, i) => {
        const pct = max > 0 ? (Number(item[valueKey]) / max) * 100 : 0;
        return (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-gray-600 dark:text-gray-400 w-28 text-right flex-shrink-0 truncate">{String(item[labelKey])}</span>
            <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }}></div>
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-10 text-left flex-shrink-0">{item[valueKey]}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>("operational");
  const [dateRange, setDateRange] = useState<DateRange>("this_month");

  const op = reportsData.operational;
  const fin = reportsData.financial;
  const totalSpecial = Object.values(specialStatusStats).reduce((a, b) => a + b, 0);

  return (
    <DashboardLayout title="التقارير">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">التقارير</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">تقارير تشغيلية ومالية شاملة</p>
      </div>

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {(["operational", "financial"] as ReportTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {tab === "operational" ? "تشغيلية" : "مالية"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <i className="ri-calendar-line text-gray-400 text-sm"></i>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRange)}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 cursor-pointer"
          >
            {(Object.keys(dateRangeLabels) as DateRange[]).map((k) => (
              <option key={k} value={k}>{dateRangeLabels[k]}</option>
            ))}
          </select>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-download-line text-gray-500 dark:text-gray-400"></i>
            تصدير
          </button>
        </div>
      </div>

      {/* Operational Reports */}
      {activeTab === "operational" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "إجمالي الطلبات", value: 127, icon: "ri-file-list-3-line", color: "text-gray-700 dark:text-gray-200", bg: "bg-gray-50 dark:bg-gray-800" },
              { label: "ملفات نشطة", value: 89, icon: "ri-folder-open-line", color: "text-brand-600 dark:text-brand-400", bg: "bg-brand-50 dark:bg-brand-900/30" },
              { label: "بانتظار الاعتماد", value: 14, icon: "ri-time-line", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30" },
              { label: "حالات خاصة", value: totalSpecial, icon: "ri-alert-line", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/30" },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
                <div className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg mb-2">
                  <i className={`${s.icon} text-sm ${s.color}`}></i>
                </div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4">عدد الطلبات حسب الفترة</h3>
              <BarChart data={op.byPeriod} labelKey="period" valueKey="count" color="bg-brand-400" />
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4">توزيع الطلبات حسب المدينة</h3>
              <BarChart data={op.byCity} labelKey="city" valueKey="count" color="bg-teal-400" />
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4">توزيع حسب جهة العمل</h3>
              <BarChart data={op.byEmployerType} labelKey="type" valueKey="count" color="bg-amber-400" />
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4">توزيع حسب نوع الخدمة</h3>
              <BarChart data={op.byServiceType} labelKey="service" valueKey="count" color="bg-sky-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4">حالات الملفات الحالية</h3>
              <div className="space-y-2">
                {op.stageStatus.map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{s.stage}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-400 rounded-full" style={{ width: `${(s.count / 127) * 100}%` }}></div>
                      </div>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-6 text-left">{s.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4">أسباب الرفض الأكثر تكراراً</h3>
              <div className="space-y-3">
                {op.rejectionReasons.map((r, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-[10px] font-bold flex-shrink-0">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-700 dark:text-gray-300">{r.reason}</span>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{r.count}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-400 rounded-full" style={{ width: `${(r.count / op.rejectionReasons[0].count) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-3">ملخص الحالات الخاصة</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "مرفوض", value: specialStatusStats.rejected, color: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400" },
                    { label: "ملغي", value: specialStatusStats.cancelled, color: "text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400" },
                    { label: "منتهي", value: specialStatusStats.completed, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400" },
                    { label: "متعثر", value: specialStatusStats.defaulted, color: "text-rose-700 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-400" },
                    { label: "متعثر جزئي", value: specialStatusStats.partial_default, color: "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400" },
                  ].map((s) => {
                    const parts = s.color.split(" ");
                    const textColor = parts[0];
                    const bgColor = parts.slice(1).join(" ");
                    return (
                      <div key={s.label} className={`flex items-center justify-between px-3 py-2 rounded-lg ${bgColor}`}>
                        <span className={`text-xs font-medium ${textColor}`}>{s.label}</span>
                        <span className={`text-sm font-bold ${textColor}`}>{s.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Reports */}
      {activeTab === "financial" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "إجمالي المدفوعات", value: `${(fin.totalPayments / 1000000).toFixed(2)}M`, icon: "ri-money-dollar-circle-line", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/30", sub: "ريال سعودي" },
              { label: "المبالغ المتبقية", value: `${(fin.pendingAmounts / 1000).toFixed(0)}K`, icon: "ri-wallet-3-line", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/30", sub: "ريال سعودي" },
              { label: "إجمالي المصروفات", value: `${(fin.totalExpenses / 1000).toFixed(0)}K`, icon: "ri-receipt-line", color: "text-red-500 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/30", sub: "ريال سعودي" },
              { label: "الأرباح الصافية", value: `${(fin.totalProfit / 1000).toFixed(0)}K`, icon: "ri-line-chart-line", color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-900/30", sub: "ريال سعودي" },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
                <div className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg mb-2">
                  <i className={`${s.icon} text-sm ${s.color}`}></i>
                </div>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-5">التفصيل الشهري</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="text-right pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400">الشهر</th>
                    <th className="text-right pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400">المدفوعات</th>
                    <th className="text-right pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400">المصروفات</th>
                    <th className="text-right pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400">الأرباح</th>
                    <th className="text-right pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400">هامش الربح</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {fin.byMonth.map((m, i) => {
                    const margin = m.payments > 0 ? ((m.profit / m.payments) * 100).toFixed(1) : "0";
                    return (
                      <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                        <td className="py-3 text-sm font-medium text-gray-800 dark:text-gray-200">{m.month}</td>
                        <td className="py-3 text-sm text-green-600 dark:text-green-400 font-semibold">{m.payments.toLocaleString("ar-SA")} ر.س</td>
                        <td className="py-3 text-sm text-red-500 dark:text-red-400">{m.expenses.toLocaleString("ar-SA")} ر.س</td>
                        <td className="py-3 text-sm text-teal-600 dark:text-teal-400 font-semibold">{m.profit.toLocaleString("ar-SA")} ر.س</td>
                        <td className="py-3">
                          <span className="text-xs bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded-full font-medium">{margin}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-200 dark:border-gray-700">
                    <td className="pt-3 text-xs font-bold text-gray-700 dark:text-gray-300">الإجمالي</td>
                    <td className="pt-3 text-sm font-bold text-green-600 dark:text-green-400">{fin.totalPayments.toLocaleString("ar-SA")} ر.س</td>
                    <td className="pt-3 text-sm font-bold text-red-500 dark:text-red-400">{fin.totalExpenses.toLocaleString("ar-SA")} ر.س</td>
                    <td className="pt-3 text-sm font-bold text-teal-600 dark:text-teal-400">{fin.totalProfit.toLocaleString("ar-SA")} ر.س</td>
                    <td className="pt-3">
                      <span className="text-xs bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded-full font-medium">
                        {((fin.totalProfit / fin.totalPayments) * 100).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4">المدفوعات الشهرية</h3>
              <BarChart data={fin.byMonth.map((m) => ({ month: m.month, payments: m.payments / 1000 }))} labelKey="month" valueKey="payments" color="bg-green-400" />
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 text-left">القيم بالآلاف (ر.س)</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4">الأرباح الشهرية</h3>
              <BarChart data={fin.byMonth.map((m) => ({ month: m.month, profit: m.profit / 1000 }))} labelKey="month" valueKey="profit" color="bg-teal-400" />
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 text-left">القيم بالآلاف (ر.س)</p>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-orange-100 dark:bg-orange-900/40 rounded-lg flex-shrink-0">
              <i className="ri-alarm-warning-line text-orange-600 dark:text-orange-400 text-sm"></i>
            </div>
            <div>
              <p className="text-sm font-semibold text-orange-800 dark:text-orange-300">تنبيه: مبالغ متبقية</p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">
                يوجد {fin.pendingAmounts.toLocaleString("ar-SA")} ر.س مبالغ متبقية بانتظار التحصيل.
              </p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
