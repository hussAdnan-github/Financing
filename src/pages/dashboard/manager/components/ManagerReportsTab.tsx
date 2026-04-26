import { useState } from "react";
import { mockClients, reportsData, stageLabels, specialStatusLabels } from "@/mocks/dashboardData";

type Period = "week" | "month" | "quarter" | "year";

export default function ManagerReportsTab() {
  const [period, setPeriod] = useState<Period>("month");
  const [activeSection, setActiveSection] = useState<"operational" | "financial">("operational");

  const totalClients = mockClients.length;
  const activeClients = mockClients.filter((c) => !c.specialStatus).length;
  const specialClients = mockClients.filter((c) => c.specialStatus).length;
  const finalReviewClients = mockClients.filter((c) => c.stage === "final_review").length;

  const totalFinancing = mockClients.reduce(
    (sum, c) => sum + (c.financingCalc?.approvedAmount ?? 0),
    0
  );
  const totalProfit = mockClients.reduce(
    (sum, c) => sum + (c.financingOffer?.providerProfit ?? 0),
    0
  );

  const stageDistribution = Object.entries(stageLabels).map(([key, label]) => ({
    key,
    label,
    count: mockClients.filter((c) => c.stage === key && !c.specialStatus).length,
  }));

  const maxStageCount = Math.max(...stageDistribution.map((s) => s.count), 1);

  const specialDistribution = Object.entries(specialStatusLabels).map(([key, label]) => ({
    key,
    label,
    count: mockClients.filter((c) => c.specialStatus === key).length,
  }));

  const cityDistribution = reportsData.operational.byCity;
  const maxCityCount = Math.max(...cityDistribution.map((c) => c.count), 1);

  const serviceDistribution = reportsData.operational.byServiceType;
  const maxServiceCount = Math.max(...serviceDistribution.map((s) => s.count), 1);

  const monthlyData = reportsData.financial.byMonth;
  const maxMonthlyPayment = Math.max(...monthlyData.map((m) => m.payments), 1);

  const periodLabels: Record<Period, string> = {
    week: "هذا الأسبوع",
    month: "هذا الشهر",
    quarter: "هذا الربع",
    year: "هذا العام",
  };

  return (
    <div className="space-y-5">
      {/* Period + Section Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-1">
          {(["operational", "financial"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeSection === s ? "bg-brand-500 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {s === "operational" ? "تشغيلية" : "مالية"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-1">
          {(["week", "month", "quarter", "year"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                period === p ? "bg-brand-500 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {activeSection === "operational" ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "إجمالي الملفات", value: totalClients, icon: "ri-folder-line", color: "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400" },
              { label: "ملفات نشطة", value: activeClients, icon: "ri-folder-open-line", color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" },
              { label: "بانتظار الاعتماد", value: finalReviewClients, icon: "ri-time-line", color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" },
              { label: "حالات خاصة", value: specialClients, icon: "ri-alert-line", color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{kpi.label}</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${kpi.color}`}>
                    <i className={`${kpi.icon} text-sm`}></i>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{kpi.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Stage Distribution */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4">توزيع الملفات حسب المرحلة</h4>
              <div className="space-y-2.5">
                {stageDistribution.map((s) => (
                  <div key={s.key} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 dark:text-gray-400 w-36 flex-shrink-0 text-right">{s.label}</span>
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-400 rounded-full transition-all" style={{ width: `${(s.count / maxStageCount) * 100}%` }}></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-6 text-left">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* City Distribution */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4">توزيع الطلبات حسب المدينة</h4>
              <div className="space-y-2.5">
                {cityDistribution.map((c) => (
                  <div key={c.city} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 dark:text-gray-400 w-28 flex-shrink-0 text-right">{c.city}</span>
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-400 rounded-full transition-all" style={{ width: `${(c.count / maxCityCount) * 100}%` }}></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-6 text-left">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Distribution */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4">توزيع الطلبات حسب نوع الخدمة</h4>
              <div className="space-y-3">
                {serviceDistribution.map((s) => (
                  <div key={s.service} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 dark:text-gray-400 w-32 flex-shrink-0 text-right">{s.service}</span>
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${(s.count / maxServiceCount) * 100}%` }}></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-6 text-left">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Status */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4">ملخص الحالات الخاصة</h4>
              <div className="space-y-2">
                {specialDistribution.map((s) => (
                  <div key={s.key} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <span className="text-xs text-gray-700 dark:text-gray-300">{s.label}</span>
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rejection Reasons */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4">أسباب الرفض الأكثر تكراراً</h4>
            <div className="space-y-2">
              {reportsData.operational.rejectionReasons.map((r, i) => (
                <div key={r.reason} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-xs text-gray-700 dark:text-gray-300">{r.reason}</span>
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{r.count}</span>
                  <div className="w-20 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 rounded-full" style={{ width: `${(r.count / reportsData.operational.rejectionReasons[0].count) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Financial KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "إجمالي التمويل الممنوح", value: totalFinancing, icon: "ri-money-dollar-circle-line", color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400", suffix: "ر.س" },
              { label: "إجمالي الأرباح", value: totalProfit, icon: "ri-line-chart-line", color: "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400", suffix: "ر.س" },
              { label: "المدفوعات المستلمة", value: reportsData.financial.totalPayments, icon: "ri-bank-card-line", color: "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400", suffix: "ر.س" },
              { label: "المبالغ المتبقية", value: reportsData.financial.pendingAmounts, icon: "ri-time-line", color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400", suffix: "ر.س" },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{kpi.label}</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${kpi.color}`}>
                    <i className={`${kpi.icon} text-sm`}></i>
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {kpi.value.toLocaleString("ar-SA")}
                  <span className="text-xs font-normal text-gray-400 dark:text-gray-500 mr-1">{kpi.suffix}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Monthly Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-5">المدفوعات الشهرية</h4>
            <div className="flex items-end gap-4 h-40">
              {monthlyData.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    {(m.payments / 1000).toFixed(0)}k
                  </span>
                  <div className="w-full flex flex-col gap-0.5">
                    <div className="w-full bg-brand-400 rounded-t-md transition-all" style={{ height: `${(m.payments / maxMonthlyPayment) * 100}px` }}></div>
                    <div className="w-full bg-emerald-300 rounded-b-md transition-all" style={{ height: `${(m.profit / maxMonthlyPayment) * 100}px` }}></div>
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">{m.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-brand-400"></div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">المدفوعات</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-emerald-300"></div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">الأرباح</span>
              </div>
            </div>
          </div>

          {/* Monthly Table */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100">التفاصيل الشهرية</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/60 dark:bg-gray-800/60">
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400">الشهر</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400">المدفوعات</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400">المصروفات</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400">الأرباح</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400">هامش الربح</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((m) => (
                    <tr key={m.month} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-xs font-medium text-gray-800 dark:text-gray-200">{m.month}</td>
                      <td className="px-4 py-3 text-xs text-gray-700 dark:text-gray-300">{m.payments.toLocaleString("ar-SA")} ر.س</td>
                      <td className="px-4 py-3 text-xs text-gray-700 dark:text-gray-300">{m.expenses.toLocaleString("ar-SA")} ر.س</td>
                      <td className="px-4 py-3 text-xs text-emerald-600 dark:text-emerald-400 font-medium">{m.profit.toLocaleString("ar-SA")} ر.س</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {((m.profit / m.payments) * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Export */}
      <div className="flex justify-end">
        <button className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-2 whitespace-nowrap">
          <i className="ri-download-line"></i>
          تصدير التقرير
        </button>
      </div>
    </div>
  );
}