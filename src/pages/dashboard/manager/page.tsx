import { useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/pages/dashboard/components/DashboardLayout";
import ApprovalTab from "./components/ApprovalTab";
import ManagerReportsTab from "./components/ManagerReportsTab";
import ManagerApprovalRequestsTab from "./components/ManagerApprovalRequestsTab";
import ManagerEmailSettingsPanel from "./components/ManagerEmailSettingsPanel";
import { mockClients, dashboardStats, reportsData } from "@/mocks/dashboardData";
import { loadManagerEmailSettings } from "@/hooks/useManagerEmailSettings";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

type Tab = "approval" | "special_requests" | "reports";

export default function ManagerPage() {
  const [activeTab, setActiveTab] = useState<Tab>("approval");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showEmailSettings, setShowEmailSettings] = useState(false);
  const [emailSettings, setEmailSettings] = useState(loadManagerEmailSettings);
  const [seedLoading, setSeedLoading] = useState(false);

  const pendingApproval = mockClients.filter(
    (c) => c.stage === "final_review" && !c.specialStatus
  ).length;

  const pendingSpecialRequests = mockClients.filter(
    (c) => c.managerApprovalRequested && !c.managerApprovalDecision
  ).length;

  const addToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const handleSeedUsers = async () => {
    setSeedLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("seed-users");
      if (error) {
        addToast(`خطأ: ${error.message}`, "error");
      } else if (data?.success) {
        const created = data.results.filter((r: any) => r.status === "created").length;
        const updated = data.results.filter((r: any) => r.status === "updated").length;
        addToast(`تم إنشاء ${created} مستخدم وتحديث ${updated} مستخدم بنجاح`, "success");
      } else {
        addToast("حدث خطأ غير متوقع", "error");
      }
    } catch (err: any) {
      addToast(`خطأ: ${err.message}`, "error");
    } finally {
      setSeedLoading(false);
    }
  };

  const tabs = [
    { id: "approval" as Tab, label: "اعتماد الملفات", icon: "ri-check-double-line", badge: pendingApproval },
    { id: "special_requests" as Tab, label: "طلبات استثنائية", icon: "ri-vip-crown-line", badge: pendingSpecialRequests, badgeColor: "urgent" },
    { id: "reports" as Tab, label: "التقارير الشاملة", icon: "ri-bar-chart-2-line" },
  ];

  return (
    <DashboardLayout title="لوحة المدير">
      {/* Email Settings Panel */}
      {showEmailSettings && (
        <ManagerEmailSettingsPanel
          onClose={() => {
            setShowEmailSettings(false);
            setEmailSettings(loadManagerEmailSettings());
          }}
        />
      )}

      {/* Toasts */}
      <div className="fixed top-20 left-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
              t.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
            }`}
          >
            <i className={`${t.type === "success" ? "ri-check-line" : "ri-error-warning-line"} text-lg`}></i>
            {t.message}
          </div>
        ))}
      </div>

      {/* Page Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">لوحة المدير</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">اعتماد الملفات واختيار المنفذين ومتابعة التقارير الشاملة</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Seed Users Button */}
          <button
            onClick={handleSeedUsers}
            disabled={seedLoading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium cursor-pointer transition-all whitespace-nowrap border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/30 disabled:opacity-50"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              {seedLoading ? (
                <div className="w-3 h-3 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <i className="ri-user-add-line text-sm"></i>
              )}
            </div>
            إنشاء المستخدمين التجريبيين
          </button>
          <button
            onClick={() => setShowEmailSettings(true)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium cursor-pointer transition-all whitespace-nowrap ${
              emailSettings.email
              ? "border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30"
              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-mail-settings-line text-sm"></i>
            </div>
            {emailSettings.email ? (
              <span className="max-w-[160px] truncate">{emailSettings.email}</span>
            ) : (
              "إعداد إشعارات البريد"
            )}
            {emailSettings.email && emailSettings.sendOnUrgent && (
              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>
            )}
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">بانتظار اعتمادي</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
              <i className="ri-time-line text-amber-600 dark:text-amber-400 text-sm"></i>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pendingApproval}</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">ملف في المراجعة النهائية</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">إجمالي الملفات</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center">
              <i className="ri-folder-line text-sky-600 dark:text-sky-400 text-sm"></i>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{dashboardStats.totalClients}</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">في النظام</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">إجمالي المدفوعات</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
              <i className="ri-money-dollar-circle-line text-emerald-600 dark:text-emerald-400 text-sm"></i>
            </div>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {(reportsData.financial.totalPayments / 1000000).toFixed(1)}م
            <span className="text-xs font-normal text-gray-400 dark:text-gray-500 mr-1">ر.س</span>
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">مستلمة حتى الآن</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-amber-200 dark:border-amber-700 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">طلبات استثنائية</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
              <i className="ri-vip-crown-line text-amber-600 dark:text-amber-400 text-sm"></i>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pendingSpecialRequests}</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">بانتظار قرارك المباشر</p>
          {pendingSpecialRequests > 0 && (
            <div className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">إجمالي الأرباح</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
              <i className="ri-line-chart-line text-teal-600 dark:text-teal-400 text-sm"></i>
            </div>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {reportsData.financial.totalProfit.toLocaleString("ar-SA")}
            <span className="text-xs font-normal text-gray-400 dark:text-gray-500 mr-1">ر.س</span>
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">صافي الأرباح</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-1 mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-brand-500 text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className={`${tab.icon} text-sm`}></i>
            </div>
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id
                  ? "bg-white/20 text-white"
                  : tab.badgeColor === "urgent"
                  ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
                  : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "approval" && <ApprovalTab onToast={addToast} />}
      {activeTab === "special_requests" && <ManagerApprovalRequestsTab />}
      {activeTab === "reports" && <ManagerReportsTab />}
    </DashboardLayout>
  );
}