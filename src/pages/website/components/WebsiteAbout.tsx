import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useDarkModeContext } from "../context/DarkModeContext";

const PATTERN_URL =
  "https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/04764a59-afee-476b-ac3c-f34c711f7334_Artboard-2.png?v=33456a03348b5a87fd5047387c68671a";

const values = [
  {
    icon: "ri-shield-check-line",
    title: "الشفافية والأمانة",
    desc: "نؤمن بالوضوح التام في كل تعاملاتنا — لا رسوم خفية ولا شروط مبهمة.",
  },
  {
    icon: "ri-speed-line",
    title: "السرعة والكفاءة",
    desc: "نحترم وقتك. إجراءاتنا مبسطة وموافقاتنا سريعة لأن وقتك ثمين.",
  },
  {
    icon: "ri-user-heart-line",
    title: "العميل أولاً",
    desc: "كل قرار نتخذه يبدأ بسؤال واحد: ما الأفضل لعميلنا؟",
  },
  {
    icon: "ri-award-line",
    title: "الجودة والاحترافية",
    desc: "فريقنا من المتخصصين المعتمدين يضمن لك أعلى مستويات الخدمة.",
  },
];

export default function WebsiteAbout() {
  const { dark } = useDarkModeContext();
  const { ref: sectionRef, visible } = useScrollAnimation(0.1);
  const imgRef = useRef<HTMLDivElement>(null);

  const bg = dark ? "#161616" : "#faf8f6";
  const textPrimary = dark ? "white" : "#161616";
  const textSecondary = dark ? "rgba(255,255,255,0.6)" : "rgba(22,22,22,0.6)";
  const cardBg = dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)";
  const cardBorder = dark ? "rgba(255,255,255,0.06)" : "rgba(22,22,22,0.08)";
  const badgeBg = dark ? "rgba(255,96,57,0.08)" : "rgba(255,96,57,0.08)";

  return (
    <section
      id="about"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="py-24 relative overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: bg }}
    >
      {/* Pattern */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: `url('${PATTERN_URL}')`,
          backgroundSize: "300px auto",
          backgroundRepeat: "repeat",
          opacity: dark ? 0.05 : 0.03,
        }}
      />

      {/* Accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #FF6039, transparent)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left — image */}
          <div
            className={`lg:w-5/12 w-full transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}
          >
            <div className="relative">
              <div className="w-full h-[480px] rounded-2xl overflow-hidden">
                <img
                  src="https://readdy.ai/api/search-image?query=modern%20Saudi%20Arabian%20financial%20consulting%20office%20interior%20elegant%20dark%20theme%20professional%20team%20meeting%20glass%20walls%20city%20view%20Riyadh%20sophisticated%20corporate%20environment%20warm%20lighting&width=600&height=480&seq=about1&orientation=portrait"
                  alt="من نحن"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(to top, rgba(22,22,22,0.7) 0%, transparent 50%)" }} />
              </div>

              {/* Floating badge */}
              <div
                className={`absolute -bottom-6 -right-6 rounded-2xl p-5 border transition-all duration-700 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
                style={{ backgroundColor: "#FF6039", borderColor: "rgba(255,96,57,0.3)", transitionDelay: "300ms" }}
              >
                <div className="text-3xl font-black text-[#161616]" style={{ fontFamily: "'Cairo', sans-serif" }}>+10</div>
                <div className="text-[#161616]/80 text-sm font-semibold">سنوات خبرة</div>
              </div>

              {/* Pattern accent */}
              <div
                className="absolute -top-4 -left-4 w-24 h-24 rounded-xl opacity-20"
                style={{
                  backgroundImage: `url('${PATTERN_URL}')`,
                  backgroundSize: "80px auto",
                  backgroundRepeat: "repeat",
                }}
              />
            </div>
          </div>

          {/* Right — content */}
          <div
            className={`lg:w-7/12 w-full transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}
            style={{ transitionDelay: "150ms" }}
          >
            <div
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full mb-6 border"
              style={{ borderColor: "rgba(255,96,57,0.3)", color: "#FF6039", backgroundColor: badgeBg }}
            >
              <i className="ri-building-line"></i>
              من نحن
            </div>

            <h2
              className="text-4xl md:text-5xl font-black mb-6 leading-tight"
              style={{ fontFamily: "'Tajawal', sans-serif", color: textPrimary }}
            >
              شركاؤك في
              <br />
              <span style={{ color: "#FF6039" }}>كل قرار مالي</span>
            </h2>

            <p className="text-base leading-relaxed mb-8" style={{ color: textSecondary }}>
              نحن شركة متخصصة في تقديم الحلول التمويلية المتكاملة للأفراد والشركات في المملكة العربية السعودية.
              بخبرة تمتد لأكثر من عشر سنوات، نفخر بثقة آلاف العملاء الذين حققوا أهدافهم المالية بمساعدتنا.
            </p>

            <p className="text-base leading-relaxed mb-10" style={{ color: textSecondary }}>
              نعمل بموجب ترخيص من مؤسسة النقد العربي السعودي (ساما)، ونلتزم بأعلى معايير الشفافية والمهنية
              في تقديم خدماتنا التمويلية المتنوعة.
            </p>

            {/* Values grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((v, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-500 hover:border-[#FF6039]/30 hover:-translate-y-0.5 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                  style={{
                    backgroundColor: cardBg,
                    borderColor: cardBorder,
                    transitionDelay: `${300 + i * 80}ms`,
                  }}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{ backgroundColor: "rgba(255,96,57,0.12)" }}
                  >
                    <i className={`${v.icon} text-lg`} style={{ color: "#FF6039" }}></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-1" style={{ color: textPrimary }}>{v.title}</h4>
                    <p className="text-xs leading-relaxed" style={{ color: textSecondary }}>{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
