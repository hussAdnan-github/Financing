import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  defaultLandingFormFields,
  defaultLandingBranding,
  type LandingFormField,
  type LandingBranding,
} from "@/mocks/landingData";
import { employerTypes } from "@/mocks/landingData";
import { useDashboardDarkMode } from "@/pages/dashboard/context/DashboardDarkModeContext";

const STORAGE_KEY = "landingFormConfig";
const BRANDING_KEY = "landingBranding";

function loadFields(): LandingFormField[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as LandingFormField[];
  } catch { /* ignore */ }
  return defaultLandingFormFields.map((f) => ({ ...f }));
}

function loadBranding(): LandingBranding {
  try {
    const saved = localStorage.getItem(BRANDING_KEY);
    if (saved) return JSON.parse(saved) as LandingBranding;
  } catch { /* ignore */ }
  return { ...defaultLandingBranding };
}

type ViewMode = "desktop" | "tablet" | "mobile";

const viewModes: { id: ViewMode; label: string; icon: string; width: string }[] = [
  { id: "desktop", label: "سطح المكتب", icon: "ri-computer-line", width: "100%" },
  { id: "tablet", label: "تابلت", icon: "ri-tablet-line", width: "768px" },
  { id: "mobile", label: "جوال", icon: "ri-smartphone-line", width: "390px" },
];

export default function LandingPreviewPage() {
  const { dark } = useDashboardDarkMode();
  const [fields, setFields] = useState<LandingFormField[]>(loadFields);
  const [branding, setBranding] = useState<LandingBranding>(loadBranding);
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);
  const [whatsappNum, setWhatsappNum] = useState("");

  const activeFields = fields.filter((f) => f.enabled).sort((a, b) => a.order - b.order);

  useEffect(() => {
    const saved = localStorage.getItem(BRANDING_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as LandingBranding;
        setBranding(parsed);
        setLastUpdated(new Date().toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" }));
      } catch { /* ignore */ }
    }
  }, []);

  const handleRefresh = () => {
    setFields(loadFields());
    setBranding(loadBranding());
    setLastUpdated(new Date().toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" }));
  };

  const currentMode = viewModes.find((v) => v.id === viewMode)!;

  return (
    <div className={`min-h-screen flex flex-col ${dark ? "bg-gray-950" : "bg-gray-100"}`} dir="rtl">
      {/* Preview Toolbar */}
      <div className={`border-b px-4 py-3 flex items-center justify-between gap-3 flex-wrap sticky top-0 z-50 ${dark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/settings"
            className={`flex items-center gap-1.5 text-sm cursor-pointer transition-colors ${dark ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-800"}`}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-arrow-right-line text-base"></i>
            </div>
            العودة للإعدادات
          </Link>
          <div className={`w-px h-5 ${dark ? "bg-gray-700" : "bg-gray-200"}`}></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className={`text-sm font-semibold ${dark ? "text-gray-100" : "text-gray-800"}`}>معاينة صفحة الهبوط</span>
          </div>
          {lastUpdated && (
            <span className={`text-xs hidden sm:block ${dark ? "text-gray-500" : "text-gray-400"}`}>آخر تحديث: {lastUpdated}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Device switcher */}
          <div className={`flex items-center gap-1 rounded-lg p-1 ${dark ? "bg-gray-800" : "bg-gray-100"}`}>
            {viewModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                title={mode.label}
                className={`w-8 h-8 flex items-center justify-center rounded-md cursor-pointer transition-all ${
                  viewMode === mode.id
                    ? dark ? "bg-gray-700 text-gray-100" : "bg-white text-gray-800 shadow-sm"
                    : dark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <i className={`${mode.icon} text-base`}></i>
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            className={`flex items-center gap-1.5 text-xs px-3 py-2 border rounded-lg cursor-pointer whitespace-nowrap transition-colors ${dark ? "border-gray-700 text-gray-400 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-refresh-line text-sm"></i>
            </div>
            تحديث
          </button>

          {/* Open in new tab */}
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs px-3 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 cursor-pointer whitespace-nowrap transition-colors"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-external-link-line text-sm"></i>
            </div>
            فتح الصفحة الحقيقية
          </Link>
        </div>
      </div>

      {/* Device size indicator */}
      <div className={`flex items-center justify-center py-2 border-b ${dark ? "bg-gray-950 border-gray-800" : "bg-gray-100 border-gray-200"}`}>
        <div className={`flex items-center gap-2 text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>
          <div className="w-4 h-4 flex items-center justify-center">
            <i className={`${currentMode.icon} text-sm`}></i>
          </div>
          <span>{currentMode.label}</span>
          <span className={dark ? "text-gray-600" : "text-gray-400"}>—</span>
          <span className="font-mono">{currentMode.width}</span>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="flex-1 overflow-auto py-6 px-4">
        <div
          className="mx-auto transition-all duration-300 bg-white overflow-hidden"
          style={{
            maxWidth: currentMode.width,
            minHeight: "600px",
            borderRadius: viewMode !== "desktop" ? "24px" : "12px",
            border: viewMode !== "desktop" ? "8px solid #1f2937" : dark ? "1px solid #374151" : "1px solid #e5e7eb",
            boxShadow: viewMode !== "desktop" ? "0 20px 60px rgba(0,0,0,0.3)" : dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          {/* Fake browser bar for desktop */}
          {viewMode === "desktop" && (
            <div className={`border-b px-4 py-2 flex items-center gap-3 ${dark ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"}`}>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className={`flex-1 rounded-md px-3 py-1 text-xs font-mono border ${dark ? "bg-gray-900 border-gray-700 text-gray-500" : "bg-white border-gray-200 text-gray-400"}`}>
                https://yoursite.com/#register
              </div>
            </div>
          )}

          {/* Fake status bar for mobile */}
          {viewMode === "mobile" && (
            <div className="bg-gray-900 px-4 py-1.5 flex items-center justify-between">
              <span className="text-white text-[10px] font-medium">9:41</span>
              <div className="flex items-center gap-1">
                <i className="ri-wifi-line text-white text-xs"></i>
                <i className="ri-battery-2-charge-line text-white text-xs"></i>
              </div>
            </div>
          )}

          {/* Actual landing page content — always light (it's a preview of the public page) */}
          <div style={{ backgroundColor: branding.bgColor }}>
            <PreviewNavbar branding={branding} />
            <PreviewHero branding={branding} />
            <PreviewFormSection
              fields={activeFields}
              branding={branding}
              showSubmitSuccess={showSubmitSuccess}
              whatsappNum={whatsappNum}
              onWhatsappChange={setWhatsappNum}
              onSubmit={() => setShowSubmitSuccess(true)}
              onReset={() => setShowSubmitSuccess(false)}
            />
            <PreviewFooter branding={branding} />
          </div>
        </div>
      </div>

      {/* Bottom info bar */}
      <div className={`border-t px-6 py-3 flex items-center justify-between flex-wrap gap-2 ${dark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className={`flex items-center gap-4 text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>
          <span className="flex items-center gap-1.5">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-list-check text-brand-500 text-sm"></i>
            </div>
            {activeFields.length} حقل مفعّل
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-palette-line text-brand-500 text-sm"></i>
            </div>
            اللون الرئيسي: <span className="font-mono">{branding.primaryColor}</span>
          </span>
          {branding.logoUrl && (
            <span className="flex items-center gap-1.5">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-image-line text-brand-500 text-sm"></i>
              </div>
              شعار مرفوع
            </span>
          )}
        </div>
        <Link
          to="/dashboard/settings"
          className="text-xs text-brand-600 hover:text-brand-700 font-medium cursor-pointer flex items-center gap-1"
        >
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-settings-3-line text-sm"></i>
          </div>
          تعديل الإعدادات
        </Link>
      </div>
    </div>
  );
}

// ─── Preview Navbar ───────────────────────────────────────────────────────────
function PreviewNavbar({ branding }: { branding: LandingBranding }) {
  return (
    <nav className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white">
      <div className="flex items-center gap-2">
        {branding.logoUrl ? (
          <img src={branding.logoUrl} alt="logo" className="h-8 object-contain" />
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: branding.primaryColor }}>
              <i className="ri-bank-line text-white text-sm"></i>
            </div>
            <span className="text-sm font-bold text-gray-800">شركتك</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <a href="#register" className="text-xs font-medium text-gray-600 hover:text-gray-800 cursor-pointer whitespace-nowrap">التسجيل</a>
        <button
          className="text-xs px-3 py-1.5 rounded-lg text-white font-medium whitespace-nowrap cursor-pointer"
          style={{ backgroundColor: branding.primaryColor }}
        >
          تواصل معنا
        </button>
      </div>
    </nav>
  );
}

// ─── Preview Hero ─────────────────────────────────────────────────────────────
function PreviewHero({ branding }: { branding: LandingBranding }) {
  return (
    <div
      className="relative py-16 px-6 text-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${branding.primaryColor}15 0%, ${branding.secondaryColor}10 100%)`,
      }}
    >
      <div className="relative z-10 max-w-2xl mx-auto">
        <div
          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
          style={{ backgroundColor: `${branding.primaryColor}15`, color: branding.primaryColor }}
        >
          <i className="ri-star-line text-xs"></i>
          خدمات تمويلية متميزة
        </div>
        <h1 className="text-2xl md:text-3xl font-black mb-3" style={{ color: branding.textColor, fontFamily: "'Tajawal', sans-serif" }}>
          حلول تمويلية تناسب<br />
          <span style={{ color: branding.primaryColor }}>احتياجاتك</span>
        </h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          {branding.formSubtitle}
        </p>
        <a
          href="#register"
          className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl text-white cursor-pointer"
          style={{ backgroundColor: branding.primaryColor }}
        >
          <i className="ri-arrow-down-line"></i>
          سجّل الآن
        </a>
      </div>
    </div>
  );
}

// ─── Preview Form Section ─────────────────────────────────────────────────────
function PreviewFormSection({
  fields, branding, showSubmitSuccess, whatsappNum, onWhatsappChange, onSubmit, onReset,
}: {
  fields: LandingFormField[];
  branding: LandingBranding;
  showSubmitSuccess: boolean;
  whatsappNum: string;
  onWhatsappChange: (v: string) => void;
  onSubmit: () => void;
  onReset: () => void;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <section id="register" className="py-12 px-6" style={{ backgroundColor: branding.bgColor }}>
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          {showSubmitSuccess ? (
            <div className="text-center py-8">
              <div
                className="w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4"
                style={{ backgroundColor: `${branding.primaryColor}20` }}
              >
                <i className="ri-check-double-line text-3xl" style={{ color: branding.primaryColor }}></i>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                تم استلام طلبك!
              </h3>
              <p className="text-sm text-gray-500 mb-5">سيتواصل معك مستشارنا قريباً على رقم الجوال المسجّل.</p>
              <button
                onClick={onReset}
                className="text-xs px-4 py-2 border border-gray-200 rounded-lg text-gray-600 cursor-pointer hover:bg-gray-50"
              >
                إعادة تعبئة النموذج
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-2">
                <h3 className="text-lg font-bold" style={{ color: branding.textColor, fontFamily: "'Tajawal', sans-serif" }}>
                  {branding.formTitle}
                </h3>
                {branding.formSubtitle && (
                  <p className="text-xs text-gray-500 mt-1">{branding.formSubtitle}</p>
                )}
              </div>

              {fields.map((f) => (
                <PreviewField
                  key={f.id}
                  field={f}
                  primaryColor={branding.primaryColor}
                  whatsappNum={whatsappNum}
                  onWhatsappChange={onWhatsappChange}
                />
              ))}

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-bold text-white cursor-pointer transition-opacity hover:opacity-90"
                style={{ backgroundColor: branding.primaryColor }}
              >
                <span className="flex items-center justify-center gap-2">
                  <i className="ri-send-plane-line"></i>
                  {branding.buttonText || "أرسل طلبك الآن"}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Preview Field ────────────────────────────────────────────────────────────
function PreviewField({
  field, primaryColor, whatsappNum, onWhatsappChange,
}: {
  field: LandingFormField;
  primaryColor: string;
  whatsappNum: string;
  onWhatsappChange: (v: string) => void;
}) {
  const inputClass = "w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none transition-colors bg-white";

  const label = (
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {field.label} {field.required && <span className="text-red-500">*</span>}
    </label>
  );
  const help = field.helpText ? <p className="text-[10px] text-gray-400 mt-1">{field.helpText}</p> : null;

  if (field.type === "select") {
    const isEmployerType = field.key === "employer_type";
    return (
      <div>
        {label}
        <select name={field.key} required={field.required} className={`${inputClass} cursor-pointer`}>
          <option value="">اختر...</option>
          {isEmployerType
            ? employerTypes.map((et) => <option key={et.value} value={et.label}>{et.label}</option>)
            : (field.options || []).map((opt) => <option key={opt} value={opt}>{opt}</option>)
          }
        </select>
        {help}
      </div>
    );
  }

  if (field.type === "radio") {
    return (
      <div>
        {label}
        <div className="space-y-2">
          {(field.options || []).map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name={field.key} value={opt} required={field.required} className="w-4 h-4 cursor-pointer" style={{ accentColor: primaryColor }} />
              <span className="text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
        {help}
      </div>
    );
  }

  if (field.type === "checkbox_group") {
    return (
      <div>
        {label}
        <div className="space-y-2">
          {(field.options || []).map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name={field.key} value={opt} className="w-4 h-4 cursor-pointer" style={{ accentColor: primaryColor }} />
              <span className="text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
        {help}
      </div>
    );
  }

  if (field.type === "checkbox") {
    return (
      <div className="flex items-start gap-3">
        <input type="checkbox" name={field.key} id={`prev_${field.key}`} required={field.required} value="موافق" className="mt-0.5 w-4 h-4 cursor-pointer" style={{ accentColor: primaryColor }} />
        <label htmlFor={`prev_${field.key}`} className="text-sm text-gray-600 cursor-pointer leading-relaxed">
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
        {label}
        <textarea name={field.key} required={field.required} placeholder={field.placeholder} rows={3} maxLength={500} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none transition-colors resize-none" />
        {help}
      </div>
    );
  }

  if (field.type === "whatsapp") {
    return (
      <div>
        {label}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
              <i className="ri-whatsapp-line text-green-500 text-sm"></i>
            </div>
            <input type="tel" name={field.key} required={field.required} placeholder={field.placeholder || "05xxxxxxxx"} value={whatsappNum} onChange={(e) => onWhatsappChange(e.target.value)} className="w-full h-10 border border-gray-200 rounded-xl pr-8 pl-3 text-sm focus:outline-none transition-colors" />
          </div>
          {whatsappNum && (
            <a href={`https://wa.me/966${whatsappNum.replace(/^0/, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 h-10 px-3 bg-green-500 text-white text-xs font-medium rounded-xl whitespace-nowrap cursor-pointer">
              <i className="ri-whatsapp-line"></i> تواصل
            </a>
          )}
        </div>
        {help}
      </div>
    );
  }

  if (field.type === "file") {
    return (
      <div>
        {label}
        <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-gray-300 transition-colors bg-gray-50">
          <div className="w-7 h-7 flex items-center justify-center mb-1">
            <i className="ri-upload-2-line text-gray-400 text-lg"></i>
          </div>
          <span className="text-xs text-gray-500">اضغط لرفع ملف</span>
          <input type="file" name={field.key} required={field.required} className="hidden" />
        </label>
        {help}
      </div>
    );
  }

  return (
    <div>
      {label}
      <input type={field.type} name={field.key} required={field.required} placeholder={field.placeholder} className={inputClass} />
      {help}
    </div>
  );
}

// ─── Preview Footer ───────────────────────────────────────────────────────────
function PreviewFooter({ branding }: { branding: LandingBranding }) {
  return (
    <footer className="py-6 px-6 border-t border-gray-100 bg-gray-50">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {branding.logoUrl ? (
            <img src={branding.logoUrl} alt="logo" className="h-6 object-contain" />
          ) : (
            <span className="text-sm font-bold text-gray-600">شركتك</span>
          )}
        </div>
        <p className="text-xs text-gray-400">جميع الحقوق محفوظة © 2026</p>
      </div>
    </footer>
  );
}
