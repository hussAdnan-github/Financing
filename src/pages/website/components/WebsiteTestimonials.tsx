import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useDarkModeContext } from "../context/DarkModeContext";

const PATTERN_URL =
  "https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/04764a59-afee-476b-ac3c-f34c711f7334_Artboard-2.png?v=33456a03348b5a87fd5047387c68671a";

const testimonials = [
  {
    name: "أحمد الغامدي",
    role: "مهندس — القطاع الحكومي",
    city: "الرياض",
    service: "قرض شخصي",
    text: "تجربة رائعة من البداية للنهاية. الفريق محترف والإجراءات سريعة وشفافة. حصلت على موافقة القرض في أقل من 48 ساعة دون أي تعقيدات.",
    rating: 5,
    avatar: "https://readdy.ai/api/search-image?query=professional%20Saudi%20Arab%20man%20portrait%20headshot%20smiling%20business%20casual%20attire%20clean%20neutral%20dark%20background%20confident&width=80&height=80&seq=rev1&orientation=squarish",
  },
  {
    name: "منى الشهري",
    role: "معلمة — وزارة التعليم",
    city: "جدة",
    service: "تمويل عقاري",
    text: "كنت قلقة من التعقيدات البيروقراطية لكن الفريق أرشدني خطوة بخطوة. الآن أملك منزلي وأنا في غاية السعادة. شكراً جزيلاً.",
    rating: 5,
    avatar: "https://readdy.ai/api/search-image?query=professional%20Saudi%20Arab%20woman%20portrait%20headshot%20smiling%20business%20attire%20clean%20neutral%20dark%20background%20confident%20hijab&width=80&height=80&seq=rev2&orientation=squarish",
  },
  {
    name: "خالد العتيبي",
    role: "ضابط — القوات المسلحة",
    city: "الدمام",
    service: "إعادة تمويل",
    text: "خدمة ممتازة وتعامل راقي. قدموا لي أفضل عرض تمويلي وكانوا صادقين في كل التفاصيل. وفّروا لي أكثر من 800 ريال شهرياً.",
    rating: 5,
    avatar: "https://readdy.ai/api/search-image?query=professional%20Arab%20man%20portrait%20military%20background%20smiling%20confident%20neutral%20dark%20background%20Saudi%20officer&width=80&height=80&seq=rev3&orientation=squarish",
  },
  {
    name: "سارة القحطاني",
    role: "محاسبة — شركة خاصة",
    city: "الرياض",
    service: "سداد متعثرات",
    text: "كنت في وضع صعب جداً مع البنوك. الفريق تعامل مع ملفي باحترافية عالية وحل المشكلة في وقت قياسي. أنصح بهم بشدة.",
    rating: 5,
    avatar: "https://readdy.ai/api/search-image?query=professional%20Saudi%20Arab%20woman%20accountant%20portrait%20headshot%20smiling%20business%20attire%20clean%20neutral%20background%20confident&width=80&height=80&seq=rev4&orientation=squarish",
  },
  {
    name: "فهد الدوسري",
    role: "صاحب مشروع تجاري",
    city: "الطائف",
    service: "تمويل الأعمال",
    text: "حصلت على تمويل مشروعي في وقت قياسي. الفريق فهم احتياجاتي وقدّم لي الحل الأمثل. مشروعي الآن ينمو بشكل ممتاز.",
    rating: 5,
    avatar: "https://readdy.ai/api/search-image?query=professional%20Saudi%20Arab%20businessman%20portrait%20headshot%20smiling%20casual%20attire%20clean%20neutral%20dark%20background%20entrepreneur&width=80&height=80&seq=rev5&orientation=squarish",
  },
  {
    name: "نورة المطيري",
    role: "طبيبة — القطاع الصحي",
    city: "مكة المكرمة",
    service: "تمويل مركبة",
    text: "إجراءات سريعة جداً وفريق متعاون. حصلت على سيارتي في نفس اليوم تقريباً. الخدمة تستحق أكثر من 5 نجوم.",
    rating: 5,
    avatar: "https://readdy.ai/api/search-image?query=professional%20Saudi%20Arab%20woman%20doctor%20portrait%20headshot%20smiling%20medical%20attire%20clean%20neutral%20background%20confident%20hijab&width=80&height=80&seq=rev6&orientation=squarish",
  },
];

export default function WebsiteTestimonials() {
  const [current, setCurrent] = useState(0);
  const { dark } = useDarkModeContext();
  const { ref, visible } = useScrollAnimation(0.1);

  const perPage = 3;
  const pages = Math.ceil(testimonials.length / perPage);
  const visible2 = testimonials.slice(current * perPage, current * perPage + perPage);

  const bg = dark ? "#161616" : "#faf8f6";
  const textPrimary = dark ? "white" : "#161616";
  const textSecondary = dark ? "rgba(255,255,255,0.5)" : "rgba(22,22,22,0.55)";
  const cardBg = dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.9)";
  const cardBorder = dark ? "rgba(255,255,255,0.07)" : "rgba(22,22,22,0.08)";

  return (
    <section
      id="testimonials"
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
            <i className="ri-star-line"></i>
            آراء العملاء
          </div>
          <h2
            className="text-4xl md:text-5xl font-black mb-4"
            style={{ fontFamily: "'Tajawal', sans-serif", color: textPrimary }}
          >
            ماذا يقول
            <span style={{ color: "#FF6039" }}> عملاؤنا؟</span>
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: textSecondary }}>
            آلاف العملاء وثقوا بنا وحققوا أهدافهم المالية — هذه قصصهم
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {visible2.map((t, i) => (
            <div
              key={`${current}-${i}`}
              className={`p-6 rounded-2xl border flex flex-col gap-4 transition-all duration-500 hover:border-[#FF6039]/25 hover:-translate-y-1 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{
                backgroundColor: cardBg,
                borderColor: cardBorder,
                transitionDelay: `${i * 100}ms`,
              }}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <div key={si} className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-star-fill text-sm" style={{ color: "#FF6039" }}></i>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm leading-relaxed flex-1" style={{ color: dark ? "rgba(255,255,255,0.7)" : "rgba(22,22,22,0.7)" }}>
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Service tag */}
              <div
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full self-start"
                style={{ backgroundColor: "rgba(255,96,57,0.1)", color: "#FF6039" }}
              >
                <i className="ri-service-line text-xs"></i>
                {t.service}
              </div>

              {/* Author */}
              <div
                className="flex items-center gap-3 pt-4 border-t"
                style={{ borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(22,22,22,0.08)" }}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: textPrimary }}>{t.name}</p>
                  <p className="text-xs" style={{ color: textSecondary }}>{t.role}</p>
                </div>
                <div className="mr-auto flex items-center gap-1 text-xs" style={{ color: textSecondary }}>
                  <i className="ri-map-pin-line text-xs"></i>
                  {t.city}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setCurrent((p) => Math.max(0, p - 1))}
            disabled={current === 0}
            className="w-10 h-10 flex items-center justify-center rounded-xl border transition-all cursor-pointer disabled:opacity-30 hover:border-[#FF6039]/40"
            style={{ borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(22,22,22,0.15)", color: textPrimary }}
          >
            <i className="ri-arrow-right-line"></i>
          </button>
          {Array.from({ length: pages }).map((_, pi) => (
            <button
              key={pi}
              onClick={() => setCurrent(pi)}
              className="w-2.5 h-2.5 rounded-full transition-all cursor-pointer"
              style={{ backgroundColor: current === pi ? "#FF6039" : dark ? "rgba(255,255,255,0.2)" : "rgba(22,22,22,0.2)" }}
            />
          ))}
          <button
            onClick={() => setCurrent((p) => Math.min(pages - 1, p + 1))}
            disabled={current === pages - 1}
            className="w-10 h-10 flex items-center justify-center rounded-xl border transition-all cursor-pointer disabled:opacity-30 hover:border-[#FF6039]/40"
            style={{ borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(22,22,22,0.15)", color: textPrimary }}
          >
            <i className="ri-arrow-left-line"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
