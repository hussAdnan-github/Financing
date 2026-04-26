import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useDarkModeContext } from "../context/DarkModeContext";

const PATTERN_URL =
  "https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/04764a59-afee-476b-ac3c-f34c711f7334_Artboard-2.png?v=33456a03348b5a87fd5047387c68671a";

const services = [
  {
    id: 1,
    icon: "ri-bank-line",
    title: "قروض شخصية",
    description: "حلول تمويلية مرنة تناسب احتياجاتك الشخصية بأفضل الشروط وأسرع الإجراءات.",
    features: ["موافقة سريعة خلال 24 ساعة", "نسب ربح تنافسية", "فترات سداد مرنة تصل لـ 5 سنوات", "بدون كفيل لبعض الحالات"],
    image: "https://readdy.ai/api/search-image?query=professional%20Saudi%20man%20signing%20personal%20loan%20documents%20at%20modern%20bank%20desk%20elegant%20dark%20office%20financial%20advisor%20smiling%20warm%20lighting&width=500&height=320&seq=svc1&orientation=landscape",
  },
  {
    id: 2,
    icon: "ri-home-4-line",
    title: "تمويل عقاري",
    description: "حقق حلمك في امتلاك منزلك بتمويل عقاري ميسّر وشروط واضحة ومعتمدة.",
    features: ["تمويل يصل إلى 90% من قيمة العقار", "مدة تصل إلى 25 سنة", "بدون رسوم خفية", "استشارة مجانية مع خبير عقاري"],
    image: "https://readdy.ai/api/search-image?query=modern%20luxury%20Saudi%20Arabian%20villa%20house%20exterior%20architecture%20elegant%20design%20palm%20trees%20sunset%20warm%20golden%20light%20real%20estate&width=500&height=320&seq=svc2&orientation=landscape",
  },
  {
    id: 3,
    icon: "ri-car-line",
    title: "تمويل المركبات",
    description: "احصل على سيارتك المفضلة بتمويل سهل وإجراءات مبسطة في أقل من يوم.",
    features: ["صفر مقدم لبعض الموديلات", "تغطية شاملة للتأمين", "خدمة توصيل المركبة", "تمويل جميع الماركات"],
    image: "https://readdy.ai/api/search-image?query=luxury%20modern%20car%20showroom%20Saudi%20Arabia%20elegant%20dark%20interior%20lighting%20premium%20vehicles%20display%20professional%20automotive%20dealership&width=500&height=320&seq=svc3&orientation=landscape",
  },
  {
    id: 4,
    icon: "ri-briefcase-line",
    title: "تمويل الأعمال",
    description: "ادعم نمو مشروعك بحلول تمويلية مصممة خصيصاً للشركات الصغيرة والمتوسطة.",
    features: ["تمويل يبدأ من 50,000 ريال", "مرونة في السداد", "استشارة مجانية", "دراسة جدوى مجانية"],
    image: "https://readdy.ai/api/search-image?query=Saudi%20business%20team%20meeting%20modern%20office%20dark%20elegant%20interior%20professional%20entrepreneurs%20discussing%20growth%20strategy%20charts&width=500&height=320&seq=svc4&orientation=landscape",
  },
  {
    id: 5,
    icon: "ri-refresh-line",
    title: "إعادة التمويل",
    description: "أعد جدولة التزاماتك المالية للحصول على شروط أفضل وراتب أخف.",
    features: ["تخفيض القسط الشهري", "دمج الالتزامات المتعددة", "فترة إجازة من الأقساط", "توفير فوري في الراتب"],
    image: "https://readdy.ai/api/search-image?query=financial%20advisor%20Saudi%20Arabia%20reviewing%20debt%20consolidation%20documents%20calculator%20modern%20office%20professional%20consultation%20warm%20lighting&width=500&height=320&seq=svc5&orientation=landscape",
  },
  {
    id: 6,
    icon: "ri-shield-check-line",
    title: "سداد المتعثرات",
    description: "نساعدك في تسوية التزاماتك المتعثرة وإعادة بناء ملفك الائتماني.",
    features: ["تفاوض مع البنوك نيابةً عنك", "خطط سداد مرنة", "حماية من الإجراءات القانونية", "استعادة الأهلية الائتمانية"],
    image: "https://readdy.ai/api/search-image?query=financial%20recovery%20consultation%20Saudi%20Arabia%20professional%20advisor%20helping%20client%20debt%20settlement%20modern%20office%20supportive%20atmosphere&width=500&height=320&seq=svc6&orientation=landscape",
  },
];

export default function WebsiteServices() {
  const [active, setActive] = useState(0);
  const { dark } = useDarkModeContext();
  const { ref, visible } = useScrollAnimation(0.1);

  const bg = dark ? "#161616" : "#faf8f6";
  const textPrimary = dark ? "white" : "#161616";
  const textSecondary = dark ? "rgba(255,255,255,0.5)" : "rgba(22,22,22,0.55)";
  const cardBg = dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.9)";
  const cardBorder = dark ? "rgba(255,96,57,0.15)" : "rgba(255,96,57,0.2)";

  return (
    <section
      id="services"
      ref={ref as React.RefObject<HTMLElement>}
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

      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #FF6039, transparent)" }}
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
            <i className="ri-service-line"></i>
            خدماتنا
          </div>
          <h2
            className="text-4xl md:text-5xl font-black mb-4"
            style={{ fontFamily: "'Tajawal', sans-serif", color: textPrimary }}
          >
            حلول تمويلية
            <span style={{ color: "#FF6039" }}> متكاملة</span>
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: textSecondary }}>
            نقدم طيفاً واسعاً من الخدمات المالية المصممة لتلبية احتياجاتك في كل مرحلة من مراحل حياتك
          </p>
        </div>

        {/* Service tabs */}
        <div
          className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "150ms" }}
        >
          {services.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap hover:scale-105"
              style={
                active === i
                  ? { backgroundColor: "#FF6039", color: "#161616" }
                  : {
                      backgroundColor: dark ? "rgba(255,255,255,0.05)" : "rgba(22,22,22,0.06)",
                      color: dark ? "rgba(255,255,255,0.6)" : "rgba(22,22,22,0.6)",
                      border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(22,22,22,0.1)"}`,
                    }
              }
            >
              <i className={`${s.icon} text-base`}></i>
              {s.title}
            </button>
          ))}
        </div>

        {/* Active service detail */}
        <div
          className={`rounded-2xl border overflow-hidden transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ backgroundColor: cardBg, borderColor: cardBorder, transitionDelay: "250ms" }}
        >
          <div className="flex flex-col lg:flex-row">
            {/* Image */}
            <div className="lg:w-1/2 h-64 lg:h-auto overflow-hidden">
              <img
                src={services[active].image}
                alt={services[active].title}
                className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="lg:w-1/2 p-8 md:p-10 flex flex-col justify-center">
              <div
                className="w-14 h-14 flex items-center justify-center rounded-2xl mb-6"
                style={{ backgroundColor: "rgba(255,96,57,0.12)" }}
              >
                <i className={`${services[active].icon} text-2xl`} style={{ color: "#FF6039" }}></i>
              </div>

              <h3
                className="text-2xl md:text-3xl font-black mb-4"
                style={{ fontFamily: "'Tajawal', sans-serif", color: textPrimary }}
              >
                {services[active].title}
              </h3>

              <p className="text-base leading-relaxed mb-6" style={{ color: textSecondary }}>
                {services[active].description}
              </p>

              <ul className="space-y-3 mb-8">
                {services[active].features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0"
                      style={{ backgroundColor: "rgba(255,96,57,0.15)" }}
                    >
                      <i className="ri-check-line text-xs" style={{ color: "#FF6039" }}></i>
                    </div>
                    <span className="text-sm" style={{ color: dark ? "rgba(255,255,255,0.7)" : "rgba(22,22,22,0.7)" }}>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap self-start text-[#161616] hover:-translate-y-0.5 hover:scale-105"
                style={{ backgroundColor: "#FF6039" }}
              >
                تقدم بطلب الآن
                <i className="ri-arrow-left-line"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
