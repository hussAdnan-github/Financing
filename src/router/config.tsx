import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/feature/ProtectedRoute";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import WebsitePage from "../pages/website/page";
import LoginPage from "../pages/auth/login/page";
import PrivacyPage from "../pages/privacy/page";
import AboutPage from "../pages/about/page";
import DashboardHomePage from "../pages/dashboard/home/page";
import ClientsListPage from "../pages/dashboard/clients/page";
import ClientFilePage from "../pages/dashboard/client-file/page";
import SpecialStatusPage from "../pages/dashboard/special-status/page";
import ArchivePage from "../pages/dashboard/archive/page";
import ReportsPage from "../pages/dashboard/reports/page";
import SettingsPage from "../pages/dashboard/settings/page";
import PermissionsPage from "../pages/dashboard/permissions/page";
import AssignmentsPage from "../pages/dashboard/assignments/page";
import AuditorReviewPage from "../pages/dashboard/auditor-review/page";
import ManagerPage from "../pages/dashboard/manager/page";
import NotificationsPage from "../pages/dashboard/notifications/page";
import ActivityLogPage from "../pages/dashboard/activity-log/page";
import AdvancedSearchPage from "../pages/dashboard/advanced-search/page";
import LandingPreviewPage from "../pages/dashboard/landing-preview/page";

// ─── صفحات عامة (بدون تسجيل دخول) ──────────────────────────────────────────
const publicRoutes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/website", element: <WebsitePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/privacy", element: <PrivacyPage /> },
  { path: "/about", element: <AboutPage /> },
];

// ─── صفحات لوحة التحكم (تتطلب تسجيل دخول) ──────────────────────────────────
const dashboardRoutes: RouteObject[] = [
  // الرئيسية — كل الأدوار
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["employee", "supervisor", "auditor", "manager"]}>
        <DashboardHomePage />
      </ProtectedRoute>
    ),
  },

  // ملفات العملاء — كل الأدوار
  {
    path: "/dashboard/clients",
    element: (
      <ProtectedRoute allowedRoles={["employee", "supervisor", "auditor", "manager"]}>
        <ClientsListPage />
      </ProtectedRoute>
    ),
  },

  // ملف العميل التفصيلي — كل الأدوار
  {
    path: "/dashboard/clients/:id",
    element: (
      <ProtectedRoute allowedRoles={["employee", "supervisor", "auditor", "manager"]}>
        <ClientFilePage />
      </ProtectedRoute>
    ),
  },

  // البحث المتقدم — كل الأدوار
  {
    path: "/dashboard/advanced-search",
    element: (
      <ProtectedRoute allowedRoles={["employee", "supervisor", "auditor", "manager"]}>
        <AdvancedSearchPage />
      </ProtectedRoute>
    ),
  },

  // سجل التنبيهات — كل الأدوار
  {
    path: "/dashboard/notifications",
    element: (
      <ProtectedRoute allowedRoles={["employee", "supervisor", "auditor", "manager"]}>
        <NotificationsPage />
      </ProtectedRoute>
    ),
  },

  // توزيع العملاء — مشرف ومدير فقط
  {
    path: "/dashboard/assignments",
    element: (
      <ProtectedRoute allowedRoles={["supervisor", "manager"]}>
        <AssignmentsPage />
      </ProtectedRoute>
    ),
  },

  // مراجعة المدقق — مدقق ومدير فقط
  {
    path: "/dashboard/auditor-review",
    element: (
      <ProtectedRoute allowedRoles={["auditor", "manager"]}>
        <AuditorReviewPage />
      </ProtectedRoute>
    ),
  },

  // لوحة المدير — مدير فقط
  {
    path: "/dashboard/manager",
    element: (
      <ProtectedRoute allowedRoles={["manager"]}>
        <ManagerPage />
      </ProtectedRoute>
    ),
  },

  // الأرشيف — مشرف ومدقق ومدير
  {
    path: "/dashboard/archive",
    element: (
      <ProtectedRoute allowedRoles={["supervisor", "auditor", "manager"]}>
        <ArchivePage />
      </ProtectedRoute>
    ),
  },

  // التقارير — مشرف ومدقق ومدير
  {
    path: "/dashboard/reports",
    element: (
      <ProtectedRoute allowedRoles={["supervisor", "auditor", "manager"]}>
        <ReportsPage />
      </ProtectedRoute>
    ),
  },

  // الحالات الخاصة — مشرف ومدير
  {
    path: "/dashboard/special-status",
    element: (
      <ProtectedRoute allowedRoles={["supervisor", "manager"]}>
        <SpecialStatusPage />
      </ProtectedRoute>
    ),
  },

  // سجل الأنشطة — مدير فقط
  {
    path: "/dashboard/activity-log",
    element: (
      <ProtectedRoute allowedRoles={["manager"]}>
        <ActivityLogPage />
      </ProtectedRoute>
    ),
  },

  // الإعدادات — مدير فقط
  {
    path: "/dashboard/settings",
    element: (
      <ProtectedRoute allowedRoles={["manager"]}>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },

  // الأدوار والصلاحيات — مدير ومشرف
  {
    path: "/dashboard/settings/permissions",
    element: (
      <ProtectedRoute allowedRoles={["manager", "supervisor"]}>
        <PermissionsPage />
      </ProtectedRoute>
    ),
  },

  // معاينة صفحة الهبوط — مدير فقط
  {
    path: "/dashboard/landing-preview",
    element: (
      <ProtectedRoute allowedRoles={["manager"]}>
        <LandingPreviewPage />
      </ProtectedRoute>
    ),
  },
];

const routes: RouteObject[] = [
  ...publicRoutes,
  ...dashboardRoutes,
  { path: "*", element: <NotFound /> },
];

export default routes;
