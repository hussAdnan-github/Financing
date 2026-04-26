import { useState } from "react";
import DashboardLayout from "@/pages/dashboard/components/DashboardLayout";
import UsersTab from "./components/UsersTab";
import PermissionsTab from "./components/PermissionsTab";
import SystemSettingsTab from "./components/SystemSettingsTab";
import StaticDataTab from "./components/StaticDataTab";
import LandingPageTab from "./components/LandingPageTab";
import NotificationsLogTab from "./components/NotificationsLogTab";

type SettingsTab = "users" | "permissions" | "system" | "static" | "landing" | "notif_log";

const tabs: { id: SettingsTab; label: string; icon: string; description: string }[] = [
  { id: "users", label: "المستخدمون", icon: "ri-team-line", description: "إدارة حسابات المستخدمين وأدوارهم" },
  { id: "permissions", label: "الأدوار والصلاحيات", icon: "ri-shield-keyhole-line", description: "التحكم في صلاحيات كل دور" },
  { id: "landing", label: "صفحة الهبوط", icon: "ri-pages-line", description: "تخصيص نموذج التسجيل وحقوله" },
  { id: "static", label: "البيانات الثابتة", icon: "ri-database-2-line", description: "بنوك ، خدمات ، مدن وقوائم الاختيار" },
  { id: "system", label: "إعدادات النظام", icon: "ri-settings-3-line", description: "التنبيهات ومسار العمل والنظام" },
  { id: "notif_log", label: "سجل الإشعارات", icon: "ri-history-line", description: "تاريخ جميع الإشعارات والتنبيهات" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("users");

  return (
    <DashboardLayout title="الإعدادات">
      <div className="space-y-5" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">إعدادات النظام</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">إدارة المستخدمين والصلاحيات وإعدادات النظام</p>
          </div>
        </div>

        {/* Tab Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-right p-4 rounded-xl border transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "border-brand-400 bg-brand-50 dark:bg-brand-900/20 ring-1 ring-brand-300"
                  : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  activeTab === tab.id ? "bg-brand-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                }`}>
                  <i className={`${tab.icon} text-base`}></i>
                </div>
                <div>
                  <p className={`text-sm font-semibold ${activeTab === tab.id ? "text-brand-700 dark:text-brand-400" : "text-gray-700 dark:text-gray-200"}`}>
                    {tab.label}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{tab.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "users" && <UsersTab />}
          {activeTab === "permissions" && <PermissionsTab />}
          {activeTab === "landing" && <LandingPageTab />}
          {activeTab === "static" && <StaticDataTab />}
          {activeTab === "system" && <SystemSettingsTab />}
          {activeTab === "notif_log" && <NotificationsLogTab />}
        </div>
      </div>
    </DashboardLayout>
  );
}
