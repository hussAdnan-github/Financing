import { useState, FormEvent } from "react";
import {
  employerTypes,
  defaultLandingFormFields,
  defaultLandingBranding,
  type LandingFormField,
  type LandingBranding,
} from "@/mocks/landingData";
import { useClients } from "@/hooks/useClients";
import { logNewSubmission } from "@/hooks/useRealtimeNotifications";

function getLandingFormFields(): LandingFormField[] {
  try {
    const saved = localStorage.getItem("landingFormConfig");
    if (saved) return JSON.parse(saved) as LandingFormField[];
  } catch { /* ignore */ }
  return defaultLandingFormFields;
}

function getLandingBranding(): LandingBranding {
  try {
    const saved = localStorage.getItem("landingBranding");
    if (saved) return JSON.parse(saved) as LandingBranding;
  } catch { /* ignore */ }
  return { ...defaultLandingBranding };
}

export default function RegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [assignedEmployee, setAssignedEmployee] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  const fields = getLandingFormFields()
    .filter((f) => f.enabled)
    .sort((a, b) => a.order - b.order);

  const branding = getLandingBranding();
  const { createClientFromLanding } = useClients();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = new URLSearchParams();
    const inputs = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "input, select, textarea"
    );
    inputs.forEach((el) => {
      if (el.name) {
        if (el.type === "checkbox") {
          if ((el as HTMLInputElement).checked) data.append(el.name, el.value);
        } else {
          data.append(el.name, el.value);
        }
      }
    });

    const formData = Object.fromEntries(Array.from(data.entries()));

    try {
      await fetch("https://readdy.ai/api/form/d7le3uh6pfkeslelbf1g", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data.toString(),
      });

      const { client, assignedTo } = createClientFromLanding({
        fullName: (formData["name"] as string) || "",
        phone: (formData["phone"] as string) || "",
        whatsapp: (formData["whatsapp"] as string) || undefined,
        city: (formData["city"] as string) || "",
        employerType: (formData["employer_type"] as string) || "",
        employerName: (formData["employer_name"] as string) || "",
        serviceType: (formData["service_type"] as string) || "",
        salaryTransfer: false,
        source: "صفحة الهبوط",
      });

      // Fire realtime notification to dashboard
      logNewSubmission(
        client.id,
        (formData["name"] as string) || "عميل جديد",
        (formData["service_type"] as string) || "غير محدد",
        (formData["city"] as string) || "غير محدد"
      );

      setClientId(client.id);
      setAssignedEmployee(assignedTo);
      setSubmitted(true);
    } catch {
      setError("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="register" className="py-20" style={{ backgroundColor: branding.bgColor }} dir="rtl">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Info */}
          <div className="lg:w-5/12">
            {branding.logoUrl && (
              <div className="mb-6">
                <img src={branding.logoUrl} alt="logo" className="h-14 object-contain" />
              </div>
            )}
            <div
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full mb-5"
              style={{ backgroundColor: `${branding.primaryColor}15`, color: branding.primaryColor }}
            >
              <i className="ri-user-add-line"></i>
              التسجيل
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: branding.textColor, fontFamily: "'Tajawal', sans-serif" }}>
              ابدأ رحلتك المالية<br />
              <span style={{ color: branding.primaryColor }}>معنا اليوم</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8">
              {branding.formSubtitle}
            </p>
            <div className="space-y-4">
              {[
                { icon: "ri-shield-check-line", text: "بياناتك محمية بالكامل وسرية تامة" },
                { icon: "ri-timer-line", text: "رد خلال ساعات العمل الرسمية" },
                { icon: "ri-customer-service-2-line", text: "مستشار مخصص لمتابعة ملفك" },
                { icon: "ri-whatsapp-line", text: "تواصل مباشر عبر واتساب" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{ backgroundColor: `${branding.primaryColor}15` }}
                  >
                    <i className={`${item.icon} text-lg`} style={{ color: branding.primaryColor }}></i>
                  </div>
                  <span className="text-gray-600 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:w-7/12 w-full">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
              {submitted ? (
                <SuccessView clientId={clientId} assignedEmployee={assignedEmployee} primaryColor={branding.primaryColor} />
              ) : (
                <form
                  id="landing-registration-form"
                  data-readdy-form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <h3 className="text-xl font-bold mb-2" style={{ color: branding.textColor, fontFamily: "'Tajawal', sans-serif" }}>
                    {branding.formTitle}
                  </h3>

                  <DynamicFields fields={fields} primaryColor={branding.primaryColor} />

                  {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full disabled:opacity-60 text-white font-bold text-base rounded-xl transition-all cursor-pointer whitespace-nowrap py-3.5"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <i className="ri-loader-4-line animate-spin"></i>
                        جارٍ الإرسال...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <i className="ri-send-plane-line"></i>
                        {branding.buttonText || "أرسل طلبك الآن"}
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Dynamic Fields Renderer ─────────────────────────────────────────────────
function DynamicFields({ fields, primaryColor }: { fields: LandingFormField[]; primaryColor: string }) {
  const [whatsappNum, setWhatsappNum] = useState("");

  return (
    <>
      {fields.map((f) => (
        <FieldRenderer key={f.id} field={f} primaryColor={primaryColor} whatsappNum={whatsappNum} onWhatsappChange={setWhatsappNum} />
      ))}
    </>
  );
}

function FieldRenderer({
  field,
  primaryColor,
  whatsappNum,
  onWhatsappChange,
}: {
  field: LandingFormField;
  primaryColor: string;
  whatsappNum: string;
  onWhatsappChange: (v: string) => void;
}) {
  const inputClass = "w-full h-11 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none transition-colors";
  const labelEl = (
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {field.label} {field.required && <span className="text-red-500">*</span>}
    </label>
  );

  const helpEl = field.helpText ? (
    <p className="text-xs text-gray-400 mt-1">{field.helpText}</p>
  ) : null;

  if (field.type === "select") {
    const isEmployerType = field.key === "employer_type";
    return (
      <div>
        {labelEl}
        <select
          name={field.key}
          required={field.required}
          className={`${inputClass} bg-white cursor-pointer`}
        >
          <option value="">اختر...</option>
          {isEmployerType
            ? employerTypes.map((et) => <option key={et.value} value={et.label}>{et.label}</option>)
            : (field.options || []).map((opt) => <option key={opt} value={opt}>{opt}</option>)
          }
        </select>
        {helpEl}
      </div>
    );
  }

  if (field.type === "radio") {
    return (
      <div>
        {labelEl}
        <div className="space-y-2">
          {(field.options || []).map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={field.key}
                value={opt}
                required={field.required}
                className="w-4 h-4 cursor-pointer"
                style={{ accentColor: primaryColor }}
              />
              <span className="text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
        {helpEl}
      </div>
    );
  }

  if (field.type === "checkbox_group") {
    return (
      <div>
        {labelEl}
        <div className="space-y-2">
          {(field.options || []).map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name={field.key}
                value={opt}
                className="w-4 h-4 cursor-pointer"
                style={{ accentColor: primaryColor }}
              />
              <span className="text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
        {helpEl}
      </div>
    );
  }

  if (field.type === "checkbox") {
    return (
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          name={field.key}
          id={field.key}
          required={field.required}
          value="موافق"
          className="mt-0.5 w-4 h-4 cursor-pointer"
          style={{ accentColor: primaryColor }}
        />
        <label htmlFor={field.key} className="text-sm text-gray-600 cursor-pointer leading-relaxed">
          {field.key === "privacy_consent"
            ? <><span>أوافق على </span><a href="#" className="underline" style={{ color: primaryColor }}>سياسة الخصوصية</a><span> والتواصل عبر واتساب</span></>
            : field.label}
        </label>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div>
        {labelEl}
        <textarea
          name={field.key}
          required={field.required}
          placeholder={field.placeholder}
          rows={3}
          maxLength={500}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors resize-none"
        />
        {helpEl}
      </div>
    );
  }

  if (field.type === "whatsapp") {
    return (
      <div>
        {labelEl}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
              <i className="ri-whatsapp-line text-green-500 text-base"></i>
            </div>
            <input
              type="tel"
              name={field.key}
              required={field.required}
              placeholder={field.placeholder || "05xxxxxxxx"}
              value={whatsappNum}
              onChange={(e) => onWhatsappChange(e.target.value)}
              className="w-full h-11 border border-gray-200 rounded-xl pr-9 pl-4 text-sm focus:outline-none transition-colors"
            />
          </div>
          {whatsappNum && (
            <a
              href={`https://wa.me/966${whatsappNum.replace(/^0/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 h-11 px-4 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-whatsapp-line"></i>
              تواصل
            </a>
          )}
        </div>
        {helpEl}
      </div>
    );
  }

  if (field.type === "file") {
    return (
      <div>
        {labelEl}
        <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-200 rounded-xl p-5 cursor-pointer hover:border-gray-300 transition-colors bg-gray-50">
          <div className="w-8 h-8 flex items-center justify-center mb-2">
            <i className="ri-upload-2-line text-gray-400 text-xl"></i>
          </div>
          <span className="text-sm text-gray-500">اضغط لرفع ملف</span>
          <span className="text-xs text-gray-400 mt-1">PDF, JPG, PNG</span>
          <input type="file" name={field.key} required={field.required} className="hidden" />
        </label>
        {helpEl}
      </div>
    );
  }

  // Default: text, tel, email, number, date
  return (
    <div>
      {labelEl}
      <input
        type={field.type}
        name={field.key}
        required={field.required}
        placeholder={field.placeholder}
        className={inputClass}
      />
      {helpEl}
    </div>
  );
}

// ─── Success View ─────────────────────────────────────────────────────────────
function SuccessView({
  clientId,
  assignedEmployee,
  primaryColor,
}: {
  clientId: string | null;
  assignedEmployee: string | null;
  primaryColor: string;
}) {
  return (
    <div className="text-center py-10">
      <div
        className="w-20 h-20 flex items-center justify-center rounded-full mx-auto mb-5"
        style={{ backgroundColor: `${primaryColor}20` }}
      >
        <i className="ri-check-double-line text-4xl" style={{ color: primaryColor }}></i>
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
        تم استلام طلبك!
      </h3>
      <p className="text-gray-500 text-sm mb-6">
        شكراً لك. تم تسجيل طلبك بنجاح وسيتواصل معك مستشارنا قريباً.
      </p>
      <div className="bg-gray-50 rounded-xl p-4 text-right space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">رقم الملف</span>
          <span className="text-sm font-bold text-gray-800 font-mono">{clientId}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">حالة الطلب</span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            قيد المراجعة
          </span>
        </div>
        {assignedEmployee && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">المستشار المعيّن</span>
            <span className="text-sm font-semibold" style={{ color: primaryColor }}>{assignedEmployee}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">وقت الاستلام</span>
          <span className="text-xs text-gray-600">
            {new Date().toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" })}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
        <i className="ri-information-line text-amber-500 text-base flex-shrink-0"></i>
        <p className="text-xs text-amber-700 text-right">
          احتفظ برقم الملف للمتابعة. سيتواصل معك المستشار على رقم الجوال المسجّل.
        </p>
      </div>
    </div>
  );
}
