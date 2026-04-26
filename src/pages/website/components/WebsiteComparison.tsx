import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useDarkModeContext } from "../context/DarkModeContext";

const plans = [
  {
    id: "personal",
    name: "التمويل الشخصي",
    icon: "ri-user-line",
    badge: "الأكثر طلباً",
    highlight: true,
    features: {
      "مبلغ التمويل": "حتى 500,000 ريال",
      "مدة السداد": "حتى 5 سنوات",
      "نسبة الفائدة": "تبدأ من 3.99%",
      "وقت الموافقة": "24 – 48 ساعة",
      "الضمانات المطلوبة": "بدون ضمانات",
      "الراتب الأدنى": "3,000 ريال",
      "التأمين": "اختياري",
      "السداد المبكر": "متاح بدون رسوم",
    },
  },
  {
    id: "real-estate",
    name: "التمويل العقاري",
    icon: "ri-building-2-line",
    badge: null,
    highlight: false,
    features: {
      "مبلغ التمويل": "حتى 5,000,000 ريال",
      "مدة السداد": "حتى 30 سنة",
      "نسبة الفائدة": "تبدأ من 2.99%",
      "وقت الموافقة": "5 – 10 أيام عمل",
      "الضمانات المطلوبة": "رهن العقار",
      "الراتب الأدنى": "8,000 ريال",
      "التأمين": "إلزامي",
      "السداد المبكر": "متاح بعد سنة",
    },
  },
  {
    id: "vehicle",
    name: "تمويل المركبات",
    icon: "ri-car-line",
    badge: null,
    highlight: false,
    features: {
      "مبلغ التمويل": "حتى 300,000 ريال",
      "مدة السداد": "حتى 7 سنوات",
      "نسبة الفائدة": "تبدأ من 3.49%",
      "وقت الموافقة": "48 – 72 ساعة",
      "الضمانات المطلوبة": "رهن المركبة",
      "الراتب الأدنى": "4,000 ريال",
      "التأمين": "إلزامي",
      "السداد المبكر": "متاح بدون رسوم",
    },
  },
  {
    id: "business",
    name: "تمويل الأعمال",
    icon: "ri-briefcase-line",
    badge: "للشركات",
    highlight: false,
    features: {
      "مبلغ التمويل": "حتى 10,000,000 ريال",
      "مدة السداد": "حتى 10 سنوات",
      "نسبة الفائدة": "تبدأ من 4.49%",
      "وقت الموافقة": "7 – 14 يوم عمل",
      "الضمانات المطلوبة": "ضمانات تجارية",
      "الراتب الأدنى": "إيرادات ثابتة",
      "التأمين": "اختياري",
      "السداد المبكر": "متاح بعد 6 أشهر",
    },
  },
];

const featureKeys = [
  "مبلغ التمويل",
  "مدة السداد",
  "نسبة الفائدة",
  "وقت الموافقة",
  "الضمانات المطلوبة",
  "الراتب الأدنى",
  "التأمين",
  "السداد المبكر",
];

const PATTERN_URL =
  "https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/04764a59-afee-476b-ac3c-f34c711f7334_Artboard-2.png?v=33456a03348b5a87fd5047387c68671a";

export default function WebsiteComparison() {
  const [activeTab, setActiveTab] = useState<string>("personal");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const { dark } = useDarkModeContext();
  const { ref, visible } = useScrollAnimation(0.1);

  const activePlan = plans.find((p) => p.id === activeTab)!;

  const bg = dark ? "#161616" : "#fafafa";
  const textPrimary = dark ? "white" : "#161616";
  const textSecondary = dark ? "rgba(255,255,255,0.5)" : "rgba(22,22,22,0.55)";
  const tableBg = dark ? "#1a1a1a" : "#fff";
  const tableAltBg = dark ? "#1e1e1e" : "#fafafa";
  const tableHeaderBg = dark ? "#0e0e0e" : "#161616";
  const tableBorder = dark ? "rgba(255,255,255,0.06)" : "rgba(22,22,22,0.08)";
  const toggleBg = dark ? "rgba(255,255,255,0.08)" : "#ebebeb";
  const toggleInactive = dark ? "rgba(255,255,255,0.5)" : "rgba(22,22,22,0.6)";

  return (
    <section
      id="comparison"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-20 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: bg }}
    >
      {/* Subtle pattern */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: `url('${PATTERN_URL}')`,
          backgroundSize: "280px auto",
          backgroundRepeat: "repeat",
          opacity: dark ? 0.04 : 0.03,
        }}
      />

      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,96,57,0.4), transparent)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div
          className={`text-center mb-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4 tracking-wider"
            style={{ backgroundColor: "#FF6039", color: "#fff" }}
          >
            مقارنة الخدمات
          </span>
          <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: textPrimary }}>
            اختر التمويل المناسب لك
          </h2>
          <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: textSecondary }}>
            قارن بين خيارات التمويل المختلفة واختر الأنسب لاحتياجاتك وظروفك المالية
          </p>
        </div>

        {/* View Toggle */}
        <div
          className={`flex justify-center mb-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "100ms" }}
        >
          <div className="inline-flex rounded-xl p-1 gap-1" style={{ backgroundColor: toggleBg }}>
            <button
              onClick={() => setViewMode("table")}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap"
              style={
                viewMode === "table"
                  ? { backgroundColor: "#FF6039", color: "#fff" }
                  : { color: toggleInactive }
              }
            >
              <i className="ri-table-line ml-1.5"></i>
              جدول المقارنة
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap"
              style={
                viewMode === "cards"
                  ? { backgroundColor: "#FF6039", color: "#fff" }
                  : { color: toggleInactive }
              }
            >
              <i className="ri-layout-grid-line ml-1.5"></i>
              عرض البطاقات
            </button>
          </div>
        </div>

        {/* TABLE VIEW */}
        {viewMode === "table" && (
          <div
            className={`overflow-x-auto rounded-2xl border transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ borderColor: tableBorder, transitionDelay: "200ms" }}
          >
            <table className="w-full min-w-[700px]">
              <thead>
                <tr style={{ backgroundColor: tableHeaderBg }}>
                  <th className="text-right px-6 py-5 text-white/60 text-sm font-medium w-44">
                    المميزات
                  </th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="px-4 py-5 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-10 h-10 flex items-center justify-center rounded-xl"
                          style={{
                            backgroundColor: plan.highlight ? "#FF6039" : "rgba(255,255,255,0.1)",
                          }}
                        >
                          <i className={`${plan.icon} text-white text-lg`}></i>
                        </div>
                        <span className="text-white font-bold text-sm whitespace-nowrap">{plan.name}</span>
                        {plan.badge && (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                            style={{ backgroundColor: "#FF6039", color: "#fff" }}
                          >
                            {plan.badge}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureKeys.map((key, idx) => (
                  <tr
                    key={key}
                    className="border-t transition-colors"
                    style={{
                      backgroundColor: idx % 2 === 0 ? tableBg : tableAltBg,
                      borderColor: tableBorder,
                    }}
                  >
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: textSecondary }}>{key}</td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="px-4 py-4 text-center">
                        <span
                          className="text-sm font-semibold"
                          style={plan.highlight ? { color: "#FF6039" } : { color: textPrimary }}
                        >
                          {plan.features[key as keyof typeof plan.features]}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
                {/* CTA Row */}
                <tr className="border-t" style={{ backgroundColor: tableBg, borderColor: tableBorder }}>
                  <td className="px-6 py-5 text-sm font-medium" style={{ color: textSecondary }}>ابدأ الآن</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-4 py-5 text-center">
                      <a
                        href="#contact"
                        className="inline-block px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap hover:scale-105"
                        style={
                          plan.highlight
                            ? { backgroundColor: "#FF6039", color: "#fff" }
                            : { backgroundColor: dark ? "rgba(255,255,255,0.1)" : "#161616", color: "#fff" }
                        }
                      >
                        اطلب الآن
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* CARDS VIEW */}
        {viewMode === "cards" && (
          <div
            className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: "200ms" }}
          >
            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setActiveTab(plan.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap border-2 hover:scale-105"
                  style={
                    activeTab === plan.id
                      ? { backgroundColor: "#FF6039", color: "#fff", borderColor: "#FF6039" }
                      : {
                          backgroundColor: dark ? "rgba(255,255,255,0.05)" : "#fff",
                          color: textPrimary,
                          borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(22,22,22,0.12)",
                        }
                  }
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className={`${plan.icon} text-base`}></i>
                  </div>
                  {plan.name}
                  {plan.badge && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={
                        activeTab === plan.id
                          ? { backgroundColor: "rgba(255,255,255,0.25)", color: "#fff" }
                          : { backgroundColor: "#FF6039", color: "#fff" }
                      }
                    >
                      {plan.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Active Plan Card */}
            <div className="max-w-3xl mx-auto">
              <div
                className="rounded-2xl overflow-hidden border"
                style={{ borderColor: tableBorder }}
              >
                {/* Card Header */}
                <div
                  className="px-8 py-7 flex items-center gap-4"
                  style={{ backgroundColor: tableHeaderBg }}
                >
                  <div
                    className="w-14 h-14 flex items-center justify-center rounded-2xl flex-shrink-0"
                    style={{ backgroundColor: "#FF6039" }}
                  >
                    <i className={`${activePlan.icon} text-white text-2xl`}></i>
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-black">{activePlan.name}</h3>
                    {activePlan.badge && (
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full mt-1 inline-block"
                        style={{ backgroundColor: "#FF6039", color: "#fff" }}
                      >
                        {activePlan.badge}
                      </span>
                    )}
                  </div>
                  <div className="mr-auto">
                    <span className="text-white/40 text-sm">نسبة الفائدة تبدأ من</span>
                    <p className="text-2xl font-black" style={{ color: "#FF6039" }}>
                      {activePlan.features["نسبة الفائدة"].replace("تبدأ من ", "")}
                    </p>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0" style={{ backgroundColor: tableBg }}>
                  {featureKeys.map((key, idx) => (
                    <div
                      key={key}
                      className="px-6 py-4 flex items-center justify-between border-b"
                      style={{
                        backgroundColor: idx % 2 === 0 ? tableBg : tableAltBg,
                        borderColor: tableBorder,
                      }}
                    >
                      <span className="text-sm" style={{ color: textSecondary }}>{key}</span>
                      <span className="text-sm font-bold" style={{ color: textPrimary }}>
                        {activePlan.features[key as keyof typeof activePlan.features]}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Card Footer */}
                <div
                  className="px-8 py-6 flex flex-col sm:flex-row items-center gap-4 border-t"
                  style={{ backgroundColor: tableBg, borderColor: tableBorder }}
                >
                  <a
                    href="#contact"
                    className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold text-center transition-all cursor-pointer whitespace-nowrap text-white hover:-translate-y-0.5"
                    style={{ backgroundColor: "#FF6039" }}
                  >
                    <i className="ri-arrow-left-line ml-2"></i>
                    اطلب {activePlan.name} الآن
                  </a>
                  <a
                    href="#contact"
                    className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold text-center transition-all cursor-pointer whitespace-nowrap border-2 hover:-translate-y-0.5"
                    style={{
                      borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(22,22,22,0.15)",
                      color: textSecondary,
                    }}
                  >
                    <i className="ri-question-line ml-2"></i>
                    استشارة مجانية
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom note */}
        <p className="text-center text-xs mt-8" style={{ color: dark ? "rgba(255,255,255,0.3)" : "rgba(22,22,22,0.4)" }}>
          * جميع النسب والأرقام تقريبية وتخضع للموافقة الائتمانية وشروط البنوك الشريكة
        </p>
      </div>
    </section>
  );
}
