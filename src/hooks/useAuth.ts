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

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // تحميل الجلسة الحالية عند البداية
  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
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

      // تحديث last_active
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
