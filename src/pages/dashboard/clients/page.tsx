import DashboardLayout from "@/pages/dashboard/components/DashboardLayout";
import ClientsTable from "@/pages/dashboard/components/ClientsTable";
import { dashboardStats } from "@/mocks/dashboardData";

export default function ClientsListPage() {
  return (
    <DashboardLayout title="ملفات العملاء">
      <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">ملفات العملاء</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">إدارة جميع ملفات العملاء ومتابعة مراحلها</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
              {dashboardStats.totalClients} ملف إجمالي
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
            <i className="ri-user-add-line text-blue-500 dark:text-blue-400 text-sm"></i>
            <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
              +{dashboardStats.newToday} اليوم
            </span>
          </div>
        </div>
      </div>
      <ClientsTable />
    </DashboardLayout>
  );
}
