import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { usePermissions } from "@/hooks/usePermissions";

export type UserRole = "employee" | "supervisor" | "auditor" | "manager";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  initials: string;
}

const roleLabels: Record<UserRole, string> = {
  employee: "موظف",
  supervisor: "مشرف",
  auditor: "مدقق",
  manager: "مدير",
};

// الحسابات التجريبية للمعاينة السريعة
const DEMO_USERS: Record<string, AuthUser> = {
  "faisal@company.sa": { id: "demo-1", name: "فيصل الزهراني", email: "faisal@company.sa", role: "manager", initials: "فز" },
  "ahmed@company.sa": { id: "demo-2", name: "أحمد الشمري", email: "ahmed@company.sa", role: "supervisor", initials: "أش" },
  "mona@company.sa": { id: "demo-3", name: "منى الزهراني", email: "mona@company.sa", role: "auditor", initials: "مز" },
  "sara@company.sa": { id: "demo-4", name: "سارة المطيري", email: "sara@company.sa", role: "employee", initials: "سم" },
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    // محاولة استعادة الجلسة التجريبية من التخزين المحلي
    const saved = localStorage.getItem("demo_session");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // تحميل الجلسة الحالية عند البداية
  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        // إذا كان هناك مستخدم تجريبي بالفعل، لا نحمل جلسة سوبابيز
        if (user?.id.startsWith("demo-")) {
          setIsLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          await fetchProfile(session.user.id, mounted);
        }
      } catch {
        // ignore
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        if (event === "SIGNED_IN" && session?.user) {
          await fetchProfile(session.user.id, mounted);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          localStorage.removeItem("demo_session");
        }
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string, mounted: boolean) => {
    try {
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, email, role, initials")
        .eq("id", userId)
        .maybeSingle();

      if (profileError || !data) return;

      if (mounted) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role as UserRole,
          initials: data.initials ?? data.name.slice(0, 2),
        });
      }
    } catch {
      // ignore
    }
  };

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    // التحقق من الحسابات التجريبية أولاً
    if (DEMO_USERS[email] && password === "123456") {
      const demoUser = DEMO_USERS[email];
      setUser(demoUser);
      localStorage.setItem("demo_session", JSON.stringify(demoUser));
      setIsLoading(false);
      return true;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !data.user) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        setIsLoading(false);
        return false;
      }

      // تحديث last_active (للحسابات الحقيقية فقط)
      await supabase
        .from("profiles")
        .update({ last_active: new Date().toISOString() })
        .eq("id", data.user.id);

      setIsLoading(false);
      return true;
    } catch {
      setError("حدث خطأ أثناء تسجيل الدخول");
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setError(null);
    localStorage.removeItem("demo_session");
  }, []);

  const { checkPermission } = usePermissions();

  const hasPermission = useCallback(
    (permissionKey: string): boolean => {
      if (!user) return false;
      if (user.role === "manager") return true;
      return checkPermission(user.role, permissionKey);
    },
    [user, checkPermission]
  );

  const isAuthenticated = !!user;

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    hasPermission,
    roleLabel: user ? roleLabels[user.role] : null,
  };
}
