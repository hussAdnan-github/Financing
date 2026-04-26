import DashboardLayout from "@/pages/dashboard/components/DashboardLayout";
import PermissionsTab from "@/pages/dashboard/settings/components/PermissionsTab";
import { useDashboardDarkMode } from "@/pages/dashboard/context/DashboardDarkModeContext";

export default function PermissionsPage() {
  const { isDark } = useDashboardDarkMode();
  return (
    <DashboardLayout title="الأدوار والصلاحيات">
      <div className="space-y-5" dir="rtl">
        <div>
          <h2 className={`text-lg font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>الأدوار والصلاحيات</h2>
          <p className={`text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>إدارة صلاحيات كل دور في النظام</p>
        </div>
        <PermissionsTab />
      </div>
    </DashboardLayout>
  );
}
