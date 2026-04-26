import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useDarkModeContext } from "../context/DarkModeContext";

const PATTERN_URL =
  "https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/04764a59-afee-476b-ac3c-f34c711f7334_Artboard-2.png?v=33456a03348b5a87fd5047387c68671a";

const faqs = [
  {
    category: "التمويل الشخصي",
    icon: "ri-user-line",
    items: [
      {
        q: "ما هي الشروط الأساسية للحصول على قرض شخصي؟",
        a: "يشترط أن يكون المتقدم سعودي الجنسية أو مقيماً نظامياً، وأن يكون موظفاً في جهة حكومية أو شبه حكومية أو قطاع خاص معتمد، مع راتب لا يقل عن 3,000 ريال، وألا يتجاوز عمره 60 سنة عند انتهاء مدة القرض.",
      },
      {
        q: "كم تستغرق عملية الموافقة على القرض؟",
        a: "في الغالب يتم الرد المبدئي خلال 24 ساعة من تقديم الطلب، أما الموافقة النهائية وصرف المبلغ فتستغرق من 3 إلى 7 أيام عمل حسب اكتمال المستندات وسياسة البنك.",
      },
      {
        q: "هل يمكنني الحصول على قرض إذا كان لدي التزامات مالية أخرى؟",
        a: "نعم، يمكن ذلك بشرط ألا تتجاوز إجمالي الاستقطاعات الشهرية 33% من الراتب الأساسي (أو 45% لبعض الفئات). فريقنا يدرس وضعك المالي ويقترح الحل الأمثل.",
      },
    ],
  },
  {
    category: "التمويل العقاري",
    icon: "ri-home-4-line",
    items: [
      {
        q: "ما هي نسبة التمويل العقاري المتاحة؟",
        a: "يمكن الحصول على تمويل يصل إلى 90% من قيمة العقار للمسكن الأول، و85% للمسكن الثاني، وذلك وفق اشتراطات مؤسسة النقد العربي السعودي (ساما).",
      },
      {
        q: "هل يمكن تمويل الأراضي والمباني التجارية؟",
        a: "نعم، نقدم تمويلاً للأراضي السكنية والتجارية والمباني التجارية، وإن كانت الشروط والنسب تختلف عن التمويل السكني. تواصل معنا للحصول على تفاصيل دقيقة حسب حالتك.",
      },
      {
        q: "ما الفرق بين التمويل بالمرابحة والإجارة المنتهية بالتمليك؟",
        a: "في المرابحة يشتري البنك العقار ويبيعه لك بسعر أعلى مقسّط، أما الإجارة المنتهية بالتمليك فتدفع إيجاراً شهرياً يُحتسب جزء منه نحو التملك. كلاهما متوافق مع الشريعة الإسلامية وفريقنا يساعدك في اختيار الأنسب.",
      },
    ],
  },
  {
    category: "سداد المتعثرات",
    icon: "ri-refresh-line",
    items: [
      {
        q: "ما المقصود بسداد المتعثرات وكيف يمكنكم مساعدتي؟",
        a: "سداد المتعثرات هو تسوية الالتزامات المالية المتأخرة أو المتعثرة مع البنوك والجهات الممولة. نتفاوض نيابةً عنك للحصول على أفضل شروط التسوية، ونساعدك في إعادة بناء ملفك الائتماني.",
      },
      {
        q: "هل يمكن إيقاف الإجراءات القانونية أثناء التفاوض؟",
        a: "في كثير من الحالات نعم، يمكن تعليق الإجراءات القانونية أثناء مرحلة التفاوض والتسوية. يعتمد ذلك على طبيعة الدين والجهة الدائنة، وفريقنا القانوني يتولى هذا الجانب.",
      },
    ],
  },
  {
    category: "المستندات والإجراءات",
    icon: "ri-file-list-3-line",
    items: [
      {
        q: "ما المستندات المطلوبة بشكل عام للتقديم؟",
        a: "المستندات الأساسية هي: الهوية الوطنية، كشف الراتب لآخر 3 أشهر، كشف حساب بنكي لآخر 6 أشهر، خطاب العمل، وتقرير سمة الائتماني. قد تختلف المستندات حسب نوع التمويل.",
      },
      {
        q: "هل يمكن التقديم إلكترونياً دون الحضور الشخصي؟",
        a: "نعم، يمكن إرسال طلبك وجميع مستنداتك إلكترونياً عبر موقعنا أو واتساب. نحن نتولى كل الإجراءات نيابةً عنك ونتواصل معك عن بُعد طوال مراحل الملف.",
      },
      {
        q: "هل خدماتكم مجانية أم هناك رسوم؟",
        a: "الاستشارة الأولية مجانية تماماً. رسوم الخدمة تُحدد بعد دراسة الملف وتكون واضحة ومتفقاً عليها مسبقاً قبل البدء في أي إجراء، ولا توجد رسوم خفية.",
      },
    ],
  },
];

export default function WebsiteFAQ() {
  const [openItem, setOpenItem] = useState<string | null>("0-0");
  const [activeCategory, setActiveCategory] = useState(0);
  const { dark } = useDarkModeContext();
  const { ref, visible } = useScrollAnimation(0.1);

  const toggle = (key: string) => {
    setOpenItem((prev) => (prev === key ? null : key));
  };

  const bg = dark ? "#161616" : "#faf8f6";
  const textPrimary = dark ? "white" : "#161616";
  const textSecondary = dark ? "rgba(255,255,255,0.5)" : "rgba(22,22,22,0.55)";
  const cardBg = dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)";
  const cardBorder = dark ? "rgba(255,255,255,0.07)" : "rgba(22,22,22,0.08)";
  const sidebarBg = dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)";

  return (
    <section
      id="faq"
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
            <i className="ri-question-answer-line"></i>
            الأسئلة الشائعة
          </div>
          <h2
            className="text-4xl md:text-5xl font-black mb-4"
            style={{ fontFamily: "'Tajawal', sans-serif", color: textPrimary }}
          >
            كل ما تريد
            <span style={{ color: "#FF6039" }}> معرفته</span>
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: textSecondary }}>
            أجوبة واضحة وشاملة على أكثر الأسئلة التي يطرحها عملاؤنا حول خدمات التمويل
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Category sidebar */}
          <div
            className={`lg:w-72 flex-shrink-0 transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
            style={{ transitionDelay: "150ms" }}
          >
            <div
              className="rounded-2xl border p-4 sticky top-24"
              style={{ backgroundColor: sidebarBg, borderColor: cardBorder }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-4 px-2" style={{ color: textSecondary }}>
                التصنيفات
              </p>
              <div className="space-y-1">
                {faqs.map((cat, ci) => (
                  <button
                    key={ci}
                    onClick={() => {
                      setActiveCategory(ci);
                      setOpenItem(null);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer text-right hover:scale-[1.02]"
                    style={
                      activeCategory === ci
                        ? { backgroundColor: "#FF6039", color: "#161616" }
                        : { color: textSecondary }
                    }
                  >
                    <div
                      className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                      style={
                        activeCategory === ci
                          ? { backgroundColor: "rgba(22,22,22,0.2)" }
                          : { backgroundColor: "rgba(255,96,57,0.1)" }
                      }
                    >
                      <i className={`${cat.icon} text-base`} style={{ color: activeCategory === ci ? "#161616" : "#FF6039" }}></i>
                    </div>
                    <span className="flex-1 text-right">{cat.category}</span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={
                        activeCategory === ci
                          ? { backgroundColor: "rgba(22,22,22,0.2)", color: "#161616" }
                          : { backgroundColor: "rgba(255,96,57,0.1)", color: "#FF6039" }
                      }
                    >
                      {cat.items.length}
                    </span>
                  </button>
                ))}
              </div>

              {/* CTA inside sidebar */}
              <div
                className="mt-6 p-4 rounded-xl border"
                style={{ backgroundColor: "rgba(255,96,57,0.06)", borderColor: "rgba(255,96,57,0.2)" }}
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-lg mb-3" style={{ backgroundColor: "rgba(255,96,57,0.12)" }}>
                  <i className="ri-customer-service-2-line text-base" style={{ color: "#FF6039" }}></i>
                </div>
                <p className="text-sm font-bold mb-1" style={{ color: textPrimary }}>لم تجد إجابتك؟</p>
                <p className="text-xs mb-3 leading-relaxed" style={{ color: textSecondary }}>تواصل مع فريقنا مباشرة وسنجيبك فوراً</p>
                <a
                  href="#contact"
                  className="block text-center text-xs font-bold py-2 rounded-lg cursor-pointer whitespace-nowrap text-[#161616] hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#FF6039" }}
                >
                  تواصل معنا
                </a>
              </div>
            </div>
          </div>

          {/* FAQ accordion */}
          <div
            className={`flex-1 transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
            style={{ transitionDelay: "250ms" }}
          >
            {/* Category title */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 flex items-center justify-center rounded-xl"
                style={{ backgroundColor: "rgba(255,96,57,0.12)" }}
              >
                <i className={`${faqs[activeCategory].icon} text-lg`} style={{ color: "#FF6039" }}></i>
              </div>
              <div>
                <h3 className="font-black text-xl" style={{ fontFamily: "'Tajawal', sans-serif", color: textPrimary }}>
                  {faqs[activeCategory].category}
                </h3>
                <p className="text-xs" style={{ color: textSecondary }}>
                  {faqs[activeCategory].items.length} أسئلة في هذا التصنيف
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {faqs[activeCategory].items.map((item, qi) => {
                const key = `${activeCategory}-${qi}`;
                const isOpen = openItem === key;

                return (
                  <div
                    key={key}
                    className="rounded-2xl border overflow-hidden transition-all duration-300"
                    style={{
                      backgroundColor: isOpen ? (dark ? "rgba(255,96,57,0.05)" : "rgba(255,96,57,0.04)") : cardBg,
                      borderColor: isOpen ? "rgba(255,96,57,0.3)" : cardBorder,
                    }}
                  >
                    {/* Question */}
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-right cursor-pointer"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div
                          className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 text-xs font-black transition-all duration-300"
                          style={{
                            backgroundColor: isOpen ? "#FF6039" : "rgba(255,96,57,0.1)",
                            color: isOpen ? "#161616" : "#FF6039",
                            fontFamily: "'Cairo', sans-serif",
                          }}
                        >
                          {String(qi + 1).padStart(2, "0")}
                        </div>
                        <span
                          className="text-sm font-bold text-right leading-relaxed"
                          style={{ color: isOpen ? textPrimary : dark ? "rgba(255,255,255,0.8)" : "rgba(22,22,22,0.8)" }}
                        >
                          {item.q}
                        </span>
                      </div>
                      <div
                        className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 transition-all duration-300"
                        style={{
                          backgroundColor: isOpen ? "#FF6039" : dark ? "rgba(255,255,255,0.06)" : "rgba(22,22,22,0.06)",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      >
                        <i
                          className="ri-arrow-down-s-line text-base"
                          style={{ color: isOpen ? "#161616" : textSecondary }}
                        ></i>
                      </div>
                    </button>

                    {/* Answer */}
                    {isOpen && (
                      <div
                        className="px-6 pb-5"
                        style={{ borderTop: "1px solid rgba(255,96,57,0.15)" }}
                      >
                        <div className="flex gap-4 pt-4">
                          <div
                            className="w-1 rounded-full flex-shrink-0 self-stretch"
                            style={{ backgroundColor: "#FF6039", minHeight: "20px" }}
                          />
                          <p className="text-sm leading-relaxed" style={{ color: textSecondary }}>{item.a}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <div
              className="mt-8 p-6 rounded-2xl border flex flex-col sm:flex-row items-center gap-5"
              style={{ backgroundColor: cardBg, borderColor: cardBorder }}
            >
              <div
                className="w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ backgroundColor: "rgba(255,96,57,0.12)" }}
              >
                <i className="ri-chat-smile-3-line text-xl" style={{ color: "#FF6039" }}></i>
              </div>
              <div className="flex-1 text-center sm:text-right">
                <p className="font-bold text-base mb-1" style={{ color: textPrimary }}>هل لديك سؤال آخر؟</p>
                <p className="text-sm" style={{ color: textSecondary }}>فريقنا متاح للإجابة على جميع استفساراتك خلال ساعات العمل</p>
              </div>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-xl cursor-pointer whitespace-nowrap flex-shrink-0 text-[#161616] hover:-translate-y-0.5 transition-transform"
                style={{ backgroundColor: "#FF6039" }}
              >
                <i className="ri-send-plane-line"></i>
                اسألنا الآن
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
