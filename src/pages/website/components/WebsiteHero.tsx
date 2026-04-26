import { useEffect, useRef, useState } from "react";
import { useDarkModeContext } from "../context/DarkModeContext";

const PATTERN_URL =
  "https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/04764a59-afee-476b-ac3c-f34c711f7334_Artboard-2.png?v=33456a03348b5a87fd5047387c68671a";

const LOGO_ICON_URL =
  "https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/820133cd-4a0c-452f-b662-b06701724b7d_-01.png?v=b2bfc75afceae2a1fe14bb1170d72133";

export default function WebsiteHero() {
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const { dark } = useDarkModeContext();
  const [mounted, setMounted] = useState(false);

  const counters = [
    { value: 15000, suffix: "+", label: "عميل راضٍ" },
    { value: 98, suffix: "%", label: "نسبة الرضا" },
    { value: 500, suffix: "M+", label: "ريال ممول" },
    { value: 24, suffix: "h", label: "وقت الموافقة" },
  ];

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    counterRefs.current.forEach((el, i) => {
      if (!el) return;
      const target = counters[i].value;
      let current = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current.toLocaleString("ar-SA");
        if (current >= target) clearInterval(timer);
      }, 25);
    });
  }, []);

  const bg = dark ? "#161616" : "#f5f0ec";
  const textPrimary = dark ? "white" : "#161616";
  const textSecondary = dark ? "rgba(255,255,255,0.6)" : "rgba(22,22,22,0.6)";
  const cardBg = dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)";
  const cardBorder = dark ? "rgba(255,96,57,0.15)" : "rgba(255,96,57,0.2)";
  const badgeBg = dark ? "rgba(255,96,57,0.08)" : "rgba(255,96,57,0.1)";

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: bg }}
    >
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: `url('${PATTERN_URL}')`,
          backgroundSize: "340px auto",
          backgroundRepeat: "repeat",
          opacity: dark ? 0.07 : 0.04,
        }}
      />

      {/* Gradient accent */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none transition-opacity duration-500"
        style={{
          background: "radial-gradient(circle, #FF6039 0%, transparent 70%)",
          opacity: dark ? 0.1 : 0.06,
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none transition-opacity duration-500"
        style={{
          background: "radial-gradient(circle, #FF6039 0%, transparent 70%)",
          opacity: dark ? 0.08 : 0.05,
          filter: "blur(60px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-32 text-right">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left text */}
          <div className="lg:w-7/12 w-full">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full mb-8 border transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{
                borderColor: "rgba(255,96,57,0.4)",
                color: "#FF6039",
                backgroundColor: badgeBg,
                transitionDelay: "0ms",
              }}
            >
              <i className="ri-verified-badge-line"></i>
              <span>معتمد من مؤسسة النقد العربي السعودي</span>
            </div>

            <h1
              className={`text-5xl md:text-7xl font-black leading-tight mb-6 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{
                fontFamily: "'Tajawal', sans-serif",
                color: textPrimary,
                transitionDelay: "100ms",
              }}
            >
              حلول تمويلية
              <br />
              <span style={{ color: "#FF6039" }}>تناسب طموحك</span>
            </h1>

            <p
              className={`text-lg mb-10 leading-relaxed max-w-xl transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ color: textSecondary, transitionDelay: "200ms" }}
            >
              نقدم أفضل خيارات التمويل الشخصي والعقاري والتجاري بإجراءات مبسطة وموافقة سريعة —
              فريقنا معك في كل خطوة حتى تصل لهدفك.
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "300ms" }}
            >
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 font-bold text-base px-8 py-4 rounded-xl transition-all hover:-translate-y-1 hover:scale-105 cursor-pointer whitespace-nowrap text-[#161616]"
                style={{ backgroundColor: "#FF6039" }}
              >
                <span>ابدأ طلبك الآن</span>
                <i className="ri-arrow-left-line"></i>
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 font-semibold text-base px-8 py-4 rounded-xl transition-all cursor-pointer whitespace-nowrap border hover:-translate-y-0.5"
                style={{
                  borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(22,22,22,0.2)",
                  color: dark ? "rgba(255,255,255,0.8)" : "#161616",
                }}
              >
                <i className="ri-play-circle-line"></i>
                <span>تعرف على خدماتنا</span>
              </a>
            </div>

            {/* Trust badges */}
            <div
              className={`flex flex-wrap items-center gap-6 mt-12 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "400ms" }}
            >
              {[
                { icon: "ri-shield-check-line", text: "بيانات محمية" },
                { icon: "ri-timer-line", text: "رد خلال 24 ساعة" },
                { icon: "ri-customer-service-2-line", text: "دعم متواصل" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className={`${b.icon} text-base`} style={{ color: "#FF6039" }}></i>
                  </div>
                  <span className="text-sm" style={{ color: textSecondary }}>{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — stats card */}
          <div
            className={`lg:w-5/12 w-full transition-all duration-700 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}
            style={{ transitionDelay: "200ms" }}
          >
            <div
              className="rounded-2xl p-8 border relative overflow-hidden"
              style={{ backgroundColor: cardBg, borderColor: cardBorder }}
            >
              {/* Pattern inside card */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: `url('${PATTERN_URL}')`,
                  backgroundSize: "200px auto",
                  backgroundRepeat: "repeat",
                }}
              />

              <div className="relative z-10">
                {/* Logo icon */}
                <div className="flex justify-center mb-8">
                  <img
                    src={LOGO_ICON_URL}
                    alt="أيقونة الشعار"
                    className="h-16 w-auto object-contain opacity-90 transition-all duration-500"
                    style={{ filter: dark ? "none" : "invert(1) brightness(0)" }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {counters.map((c, i) => (
                    <div key={i} className="text-center">
                      <div
                        className="text-3xl font-black mb-1"
                        style={{ color: "#FF6039", fontFamily: "'Cairo', sans-serif" }}
                      >
                        <span ref={(el) => { counterRefs.current[i] = el; }}>0</span>
                        {c.suffix}
                      </div>
                      <div className="text-sm" style={{ color: textSecondary }}>{c.label}</div>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-8 pt-6 border-t"
                  style={{ borderColor: dark ? "rgba(255,96,57,0.15)" : "rgba(255,96,57,0.2)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: "#FF6039" }}
                    />
                    <span className="text-sm" style={{ color: textSecondary }}>نظام تشغيل حي ومتكامل</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 ${mounted ? "opacity-30" : "opacity-0"}`}
        style={{ transitionDelay: "600ms" }}
      >
        <span className="text-xs" style={{ color: textSecondary }}>اسحب للأسفل</span>
        <div
          className="w-5 h-8 border-2 rounded-full flex items-start justify-center pt-1.5"
          style={{ borderColor: dark ? "rgba(255,255,255,0.2)" : "rgba(22,22,22,0.2)" }}
        >
          <div className="w-1 h-2 rounded-full animate-bounce" style={{ backgroundColor: "#FF6039" }}></div>
        </div>
      </div>
    </section>
  );
}
