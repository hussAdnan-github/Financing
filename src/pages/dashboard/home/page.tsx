import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/pages/dashboard/components/DashboardLayout";
import { dashboardStats, mockClients, stageLabels, stageColors } from "@/mocks/dashboardData";

const statCards = [
  { label: "إجمالي العملاء", value: dashboardStats.totalClients, icon: "ri-group-line", color: "text-gray-800 dark:text-gray-100", bg: "bg-gray-50 dark:bg-gray-800", sub: `+${dashboardStats.newToday} اليوم` },
  { label: "ملفات نشطة", value: dashboardStats.activeFiles, icon: "ri-folder-open-line", color: "text-brand-600 dark:text-brand-400", bg: "bg-brand-50 dark:bg-brand-900/30", sub: "قيد المعالجة" },
  { label: "بانتظار الاعتماد", value: dashboardStats.pendingApproval, icon: "ri-time-line", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30", sub: "تحتاج مراجعة" },
  { label: "إجمالي الإيرادات", value: `${(dashboardStats.totalRevenue / 1000000).toFixed(1)}M`, icon: "ri-money-dollar-circle-line", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/30", sub: "ريال سعودي" },
  { label: "المبالغ المتبقية", value: `${(dashboardStats.pendingPayments / 1000).toFixed(0)}K`, icon: "ri-wallet-3-line", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/30", sub: "ريال سعودي" },
  { label: "الأرباح الصافية", value: `${(dashboardStats.totalProfit / 1000).toFixed(0)}K`, icon: "ri-line-chart-line", color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-900/30", sub: "ريال سعودي" },
];

export default function DashboardHomePage() {
  const navigate = useNavigate();

  const recentClients = mockClients.slice(0, 5);

  const stageDistribution = [
    { stage: "new_request" as const, count: 3 },
    { stage: "under_study" as const, count: 8 },
    { stage: "awaiting_approval" as const, count: 5 },
    { stage: "final_review" as const, count: 4 },
    { stage: "signing" as const, count: 6 },
    { stage: "execution" as const, count: 12 },
    { stage: "collection" as const, count: 45 },
    { stage: "archived" as const, count: 44 },
  ];

  return (
    <DashboardLayout title="لوحة التحكم">
      {/* Welcome */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">مرحباً، أحمد الشمري</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {new Date().toLocaleDateString("ar-SA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {statCards.map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 transition-colors`}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg">
                <i className={`${s.icon} text-sm ${s.color}`}></i>
              </div>
            </div>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Clients */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">آخر الملفات</h3>
            <button
              onClick={() => navigate("/dashboard/clients")}
              className="text-xs text-brand-600 hover:text-brand-800 cursor-pointer"
            >
              عرض الكل
            </button>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {recentClients.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/dashboard/clients/${c.id}`)}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/60 dark:hover:bg-gray-800/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-700 dark:text-brand-300 text-xs font-bold">{c.fullName.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{c.fullName}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{c.serviceType} · {c.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${stageColors[c.stage]}`}>
                    {stageLabels[c.stage]}
                  </span>
                  <a
                    href={`https://wa.me/966${c.phone.replace(/^0/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors cursor-pointer"
                  >
                    <i className="ri-whatsapp-line text-sm"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stage Distribution */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">توزيع المراحل</h3>
          </div>
          <div className="p-5 space-y-3">
            {stageDistribution.map((s) => {
              const pct = Math.round((s.count / dashboardStats.totalClients) * 100);
              return (
                <div key={s.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{stageLabels[s.stage]}</span>
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{s.count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-400 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
