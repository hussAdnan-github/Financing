import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, type UserRole } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** الأدوار المسموح لها بالوصول — إذا فارغة يُسمح لأي مستخدم مسجّل */
  allowedRoles?: UserRole[];
  /** مفتاح الصلاحية المطلوب (اختياري) */
  permissionKey?: string;
}

/**
 * يحمي الصفحة من الوصول غير المصرّح به.
 * - إذا لم يكن المستخدم مسجّلاً → يُعاد توجيهه لصفحة تسجيل الدخول
 * - إذا لم يكن دوره ضمن allowedRoles → يُعرض له شاشة "غير مصرّح"
 */
export default function ProtectedRoute({
  children,
  allowedRoles,
  permissionKey,
}: ProtectedRouteProps) {
  const { user, isLoading, hasPermission } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // التحقق من الدور
  const roleAllowed =
    !allowedRoles || allowedRoles.length === 0 || allowedRoles.includes(user.role);

  // التحقق من الصلاحية المحددة
  const permAllowed = !permissionKey || hasPermission(permissionKey);

  if (!roleAllowed || !permAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950" dir="rtl">
        <div className="text-center max-w-sm px-6">
          <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-5">
            <i className="ri-shield-keyhole-line text-4xl text-red-400 dark:text-red-500"></i>
          </div>
          <h1 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-2">
            غير مصرّح بالوصول
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
            ليس لديك صلاحية للوصول إلى هذه الصفحة.
            <br />
            تواصل مع المدير لطلب الصلاحية المناسبة.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-2.5 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 cursor-pointer transition-colors"
            >
              <i className="ri-dashboard-line ml-1.5"></i>
              العودة للوحة التحكم
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            >
              <i className="ri-arrow-right-line ml-1.5"></i>
              الصفحة السابقة
            </button>
          </div>
          <div className="mt-5 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 inline-flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-user-line text-xs text-gray-500 dark:text-gray-400"></i>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              دورك الحالي: <strong className="text-gray-700 dark:text-gray-300">{user.name}</strong>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
