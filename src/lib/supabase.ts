import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          role: "employee" | "supervisor" | "auditor" | "manager";
          status: "active" | "inactive" | "suspended";
          initials: string | null;
          assigned_count: number;
          joined_at: string;
          last_active: string;
          created_at: string;
          updated_at: string;
        };
      };
      clients: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          stage: string;
          assigned_to: string | null;
          special_status: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          type: string;
          message: string;
          target_role: string | null;
          target_user_id: string | null;
          client_id: string | null;
          read: boolean;
          priority: string;
          created_at: string;
        };
      };
      static_data: {
        Row: {
          id: string;
          category_key: string;
          category_title: string;
          category_icon: string | null;
          category_description: string | null;
          category_color: string | null;
          items: unknown;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};
