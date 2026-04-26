import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailPayload {
  managerEmail: string;
  clientName: string;
  clientId: string;
  serviceType: string;
  city: string;
  requestedAmount: number;
  monthlyInstallment: number;
  profitRate: number;
  months: number;
  reason: string;
  requestedBy: string;
  requestedAt: string;
  urgency: "normal" | "urgent";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: EmailPayload = await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const formattedDate = new Date(payload.requestedAt).toLocaleString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const urgencyBadge = payload.urgency === "urgent"
      ? `<span style="background:#fee2e2;color:#dc2626;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">⚡ عاجل</span>`
      : `<span style="background:#fef3c7;color:#d97706;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">عادي</span>`;

    const htmlBody = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>طلب اعتماد عاجل</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Tahoma,Arial,sans-serif;direction:rtl;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;color:#94a3b8;font-size:12px;letter-spacing:1px;text-transform:uppercase;">نظام إدارة العملاء</p>
                    <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;font-weight:700;">طلب اعتماد ${payload.urgency === "urgent" ? "عاجل" : "استثنائي"}</h1>
                  </td>
                  <td align="left" style="vertical-align:top;">
                    ${urgencyBadge}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Alert Banner -->
          ${payload.urgency === "urgent" ? `
          <tr>
            <td style="background:#fef2f2;border-bottom:2px solid #fecaca;padding:14px 32px;">
              <p style="margin:0;color:#dc2626;font-size:13px;font-weight:600;">
                ⚠️ هذا الطلب يستلزم موافقتك الفورية — يرجى المراجعة في أقرب وقت
              </p>
            </td>
          </tr>` : ""}

          <!-- Body -->
          <tr>
            <td style="padding:28px 32px;">
              
              <!-- Client Info -->
              <h2 style="margin:0 0 16px;font-size:15px;color:#374151;font-weight:700;border-bottom:2px solid #f1f5f9;padding-bottom:10px;">
                📋 بيانات العميل
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td width="50%" style="padding:6px 0;">
                    <p style="margin:0;color:#6b7280;font-size:12px;">اسم العميل</p>
                    <p style="margin:4px 0 0;color:#111827;font-size:14px;font-weight:600;">${payload.clientName}</p>
                  </td>
                  <td width="50%" style="padding:6px 0;">
                    <p style="margin:0;color:#6b7280;font-size:12px;">رقم الملف</p>
                    <p style="margin:4px 0 0;color:#111827;font-size:14px;font-weight:600;">${payload.clientId}</p>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding:6px 0;">
                    <p style="margin:0;color:#6b7280;font-size:12px;">نوع الخدمة</p>
                    <p style="margin:4px 0 0;color:#111827;font-size:14px;font-weight:600;">${payload.serviceType}</p>
                  </td>
                  <td width="50%" style="padding:6px 0;">
                    <p style="margin:0;color:#6b7280;font-size:12px;">المدينة</p>
                    <p style="margin:4px 0 0;color:#111827;font-size:14px;font-weight:600;">${payload.city}</p>
                  </td>
                </tr>
              </table>

              <!-- Financial Summary -->
              <h2 style="margin:0 0 16px;font-size:15px;color:#374151;font-weight:700;border-bottom:2px solid #f1f5f9;padding-bottom:10px;">
                💰 ملخص التمويل
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;padding:16px;margin-bottom:24px;">
                <tr>
                  <td width="25%" align="center" style="padding:8px;">
                    <p style="margin:0;color:#6b7280;font-size:11px;">مبلغ التمويل</p>
                    <p style="margin:6px 0 0;color:#111827;font-size:16px;font-weight:700;">${payload.requestedAmount.toLocaleString("ar-SA")}</p>
                    <p style="margin:2px 0 0;color:#9ca3af;font-size:10px;">ر.س</p>
                  </td>
                  <td width="25%" align="center" style="padding:8px;border-right:1px solid #e5e7eb;">
                    <p style="margin:0;color:#6b7280;font-size:11px;">القسط الشهري</p>
                    <p style="margin:6px 0 0;color:#111827;font-size:16px;font-weight:700;">${payload.monthlyInstallment.toLocaleString("ar-SA")}</p>
                    <p style="margin:2px 0 0;color:#9ca3af;font-size:10px;">ر.س</p>
                  </td>
                  <td width="25%" align="center" style="padding:8px;border-right:1px solid #e5e7eb;">
                    <p style="margin:0;color:#6b7280;font-size:11px;">نسبة الربح</p>
                    <p style="margin:6px 0 0;color:#111827;font-size:16px;font-weight:700;">${payload.profitRate}%</p>
                    <p style="margin:2px 0 0;color:#9ca3af;font-size:10px;">&nbsp;</p>
                  </td>
                  <td width="25%" align="center" style="padding:8px;border-right:1px solid #e5e7eb;">
                    <p style="margin:0;color:#6b7280;font-size:11px;">مدة التمويل</p>
                    <p style="margin:6px 0 0;color:#111827;font-size:16px;font-weight:700;">${payload.months}</p>
                    <p style="margin:2px 0 0;color:#9ca3af;font-size:10px;">شهر</p>
                  </td>
                </tr>
              </table>

              <!-- Request Reason -->
              <h2 style="margin:0 0 12px;font-size:15px;color:#374151;font-weight:700;border-bottom:2px solid #f1f5f9;padding-bottom:10px;">
                📝 سبب الطلب
              </h2>
              <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px 16px;margin-bottom:24px;">
                <p style="margin:0;color:#92400e;font-size:13px;line-height:1.7;">${payload.reason}</p>
                <p style="margin:10px 0 0;color:#b45309;font-size:11px;">
                  بواسطة: <strong>${payload.requestedBy}</strong> — ${formattedDate}
                </p>
              </div>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 24px;">
                    <a href="#" style="display:inline-block;background:#1a1a2e;color:#ffffff;text-decoration:none;padding:13px 32px;border-radius:10px;font-size:14px;font-weight:600;letter-spacing:0.5px;">
                      مراجعة الطلب في لوحة التحكم
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 32px;">
              <p style="margin:0;color:#9ca3af;font-size:11px;text-align:center;">
                هذا البريد أُرسل تلقائياً من نظام إدارة العملاء — لا تردّ على هذا البريد
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "نظام إدارة العملاء <onboarding@resend.dev>",
        to: [payload.managerEmail],
        subject: `${payload.urgency === "urgent" ? "⚡ عاجل — " : ""}طلب اعتماد استثنائي: ${payload.clientName} (${payload.clientId})`,
        html: htmlBody,
      }),
    });

    const result = await emailResponse.json();

    if (!emailResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: result }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, emailId: result.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
