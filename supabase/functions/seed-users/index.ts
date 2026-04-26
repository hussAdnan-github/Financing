import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SeedUser {
  email: string;
  password: string;
  name: string;
  role: string;
  initials: string;
}

const users: SeedUser[] = [
  { email: "faisal@company.sa", password: "123456", name: "فيصل العتيبي", role: "manager", initials: "فع" },
  { email: "ahmed@company.sa", password: "123456", name: "أحمد الشمري", role: "supervisor", initials: "أش" },
  { email: "mona@company.sa", password: "123456", name: "منى القحطاني", role: "auditor", initials: "مق" },
  { email: "sara@company.sa", password: "123456", name: "سارة الحربي", role: "employee", initials: "سح" },
  { email: "khalid@company.sa", password: "123456", name: "خالد الزهراني", role: "employee", initials: "كز" },
  { email: "noura@company.sa", password: "123456", name: "نورة الدوسري", role: "employee", initials: "ند" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const results: { email: string; status: string; error?: string }[] = [];

    for (const user of users) {
      try {
        // 1. Create auth user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: { name: user.name },
        });

        if (authError) {
          // If user already exists, try to get their ID
          if (authError.message?.includes("already been registered")) {
            const { data: existing } = await supabaseAdmin.auth.admin.listUsers();
            const existingUser = existing?.users?.find((u) => u.email === user.email);
            if (existingUser) {
              // Update profile
              const { error: profileError } = await supabaseAdmin
                .from("profiles")
                .upsert({
                  id: existingUser.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  initials: user.initials,
                  status: "active",
                  joined_at: new Date().toISOString(),
                }, { onConflict: "id" });

              results.push({
                email: user.email,
                status: profileError ? `profile_error: ${profileError.message}` : "updated",
              });
            } else {
              results.push({ email: user.email, status: "exists_no_id", error: authError.message });
            }
            continue;
          }
          results.push({ email: user.email, status: "auth_error", error: authError.message });
          continue;
        }

        if (!authData.user) {
          results.push({ email: user.email, status: "no_user" });
          continue;
        }

        // 2. Insert profile
        const { error: profileError } = await supabaseAdmin
          .from("profiles")
          .upsert({
            id: authData.user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            initials: user.initials,
            status: "active",
            joined_at: new Date().toISOString(),
          }, { onConflict: "id" });

        results.push({
          email: user.email,
          status: profileError ? `profile_error: ${profileError.message}` : "created",
        });
      } catch (err: any) {
        results.push({ email: user.email, status: "exception", error: err.message });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
