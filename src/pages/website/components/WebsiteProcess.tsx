import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useDarkModeContext } from "../context/DarkModeContext";

const PATTERN_URL =
  "https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/04764a59-afee-476b-ac3c-f34c711f7334_Artboard-2.png?v=33456a03348b5a87fd5047387c68671a";

const steps = [
  { num: "01", icon: "ri-file-text-line", title: "تقديم الطلب", desc: "أرسل بياناتك الأساسية عبر النموذج الإلكتروني في دقائق معدودة." },
  { num: "02", icon: "ri-user-search-line", title: "دراسة الملف", desc: "يقوم فريقنا المتخصص بدراسة ملفك وتحديد أفضل الخيارات المتاحة لك." },
  { num: "03", icon: "ri-phone-line", title: "التواصل والاستشارة", desc: "يتواصل معك مستشارك المخصص لمناقشة الخيارات والإجابة على استفساراتك." },
  { num: "04", icon: "ri-file-list-3-line", title: "تجهيز المستندات", desc: "نرشدك لتجهيز المستندات المطلوبة بأبسط طريقة ممكنة." },
  { num: "05", icon: "ri-bank-line", title: "التقديم للبنك", desc: "نتولى تقديم ملفك للبنك المناسب ومتابعة الطلب حتى الموافقة." },
  { num: "06", icon: "ri-check-double-line", title: "الإنجاز والصرف", desc: "بعد الموافقة، يُصرف التمويل مباشرة لحسابك أو لجهة الاستخدام." },
];

export default function WebsiteProcess() {
  const { dark } = useDarkModeContext();
  const { ref, visible } = useScrollAnimation(0.1);

  const bg = dark ? "#0e0e0e" : "#f0ede9";
  const textPrimary = dark ? "white" : "#161616";
  const textSecondary = dark ? "rgba(255,255,255,0.5)" : "rgba(22,22,22,0.55)";
  const cardBg = dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.7)";
  const cardBorder = dark ? "rgba(255,255,255,0.06)" : "rgba(22,22,22,0.08)";

  return (
    <section
      id="process"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 relative overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: bg }}
    >
      {/* Pattern */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: `url('${PATTERN_URL}')`,
          backgroundSize: "280px auto",
          backgroundRepeat: "repeat",
          opacity: dark ? 0.06 : 0.03,
        }}
      />

      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,96,57,0.5), transparent)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full mb-6 border"
            style={{ borderColor: "rgba(255,96,57,0.3)", color: "#FF6039", backgroundColor: "rgba(255,96,57,0.08)" }}
          >
            <i className="ri-route-line"></i>
            كيف نعمل
          </div>
          <h2
            className="text-4xl md:text-5xl font-black mb-4"
            style={{ fontFamily: "'Tajawal', sans-serif", color: textPrimary }}
          >
            رحلتك معنا
            <span style={{ color: "#FF6039" }}> خطوة بخطوة</span>
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: textSecondary }}>
            عملية واضحة وشفافة من أول تواصل حتى صرف التمويل
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`relative p-6 rounded-2xl border transition-all duration-500 group hover:border-[#FF6039]/40 hover:-translate-y-1 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{
                backgroundColor: cardBg,
                borderColor: cardBorder,
                transitionDelay: `${i * 80}ms`,
              }}
            >
              {/* Number */}
              <div
                className="absolute top-4 left-4 text-5xl font-black opacity-10 select-none"
                style={{ color: "#FF6039", fontFamily: "'Cairo', sans-serif" }}
              >
                {step.num}
              </div>

              {/* Icon */}
              <div
                className="w-12 h-12 flex items-center justify-center rounded-xl mb-5 transition-transform group-hover:scale-110"
                style={{ backgroundColor: "rgba(255,96,57,0.12)" }}
              >
                <i className={`${step.icon} text-xl`} style={{ color: "#FF6039" }}></i>
              </div>

              <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "'Tajawal', sans-serif", color: textPrimary }}>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: textSecondary }}>{step.desc}</p>

              {/* Connector arrow */}
              {i < steps.length - 1 && (i + 1) % 3 !== 0 && (
                <div className="hidden lg:flex absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 items-center justify-center z-10">
                  <i className="ri-arrow-left-line text-sm" style={{ color: "rgba(255,96,57,0.4)" }}></i>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`text-center mt-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "500ms" }}
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-3 font-bold text-base px-10 py-4 rounded-xl transition-all hover:-translate-y-1 hover:scale-105 cursor-pointer whitespace-nowrap text-[#161616]"
            style={{ backgroundColor: "#FF6039" }}
          >
            <i className="ri-rocket-line text-lg"></i>
            ابدأ رحلتك الآن
          </a>
        </div>
      </div>
    </section>
  );
}
