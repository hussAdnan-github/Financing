import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const LOGO_WHITE =
  "https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/3fa99e41-3181-42f3-b65d-33c71c7fce19_-02.png?v=dd9a6d7162ba41ac3085905187c795fd";

const LOGO_DARK =
  "https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/820133cd-4a0c-452f-b662-b06701724b7d_-01.png?v=b2bfc75afceae2a1fe14bb1170d72133";

const sections = [
  {
    id: "intro",
    icon: "ri-shield-check-line",
    title: "مقدمة",
    content: `نحن في شركتنا نلتزم بحماية خصوصيتك وأمان بياناتك الشخصية. تصف سياسة الخصوصية هذه كيفية جمع معلوماتك واستخدامها وحمايتها عند استخدامك لخدماتنا أو زيارتك لموقعنا الإلكتروني.

تسري هذه السياسة على جميع المعلومات التي نجمعها من خلال موقعنا الإلكتروني، وتطبيقاتنا، وخدماتنا المالية المقدمة في المملكة العربية السعودية. باستخدامك لخدماتنا، فإنك توافق على الشروط الواردة في هذه السياسة.`,
  },
  {
    id: "collect",
    icon: "ri-database-2-line",
    title: "المعلومات التي نجمعها",
    items: [
      {
        subtitle: "المعلومات الشخصية",
        text: "الاسم الكامل، رقم الهوية الوطنية، تاريخ الميلاد، العنوان، رقم الجوال، البريد الإلكتروني.",
      },
      {
        subtitle: "المعلومات المالية",
        text: "بيانات الراتب، جهة العمل، الحسابات البنكية، السجل الائتماني، الالتزامات المالية القائمة.",
      },
      {
        subtitle: "معلومات الاستخدام",
        text: "بيانات التصفح، عنوان IP، نوع المتصفح، الصفحات التي تزورها، مدة الزيارة.",
      },
      {
        subtitle: "المستندات والوثائق",
        text: "صور الهوية الوطنية، كشوف الراتب، التقارير الائتمانية، وأي وثائق أخرى مطلوبة لإتمام الخدمة.",
      },
    ],
  },
  {
    id: "use",
    icon: "ri-settings-3-line",
    title: "كيف نستخدم معلوماتك",
    items: [
      { subtitle: "تقديم الخدمات", text: "معالجة طلبات التمويل وتقييم الأهلية الائتمانية وإتمام إجراءات التمويل." },
      { subtitle: "التواصل معك", text: "إرسال تحديثات حول طلبك، والإشعارات المتعلقة بالخدمة، والردود على استفساراتك." },
      { subtitle: "الامتثال القانوني", text: "الوفاء بالمتطلبات التنظيمية لمؤسسة النقد العربي السعودي (ساما) والجهات الرقابية الأخرى." },
      { subtitle: "تحسين الخدمات", text: "تحليل أنماط الاستخدام لتطوير خدماتنا وتحسين تجربة المستخدم." },
      { subtitle: "الأمن والحماية", text: "الكشف عن الاحتيال ومنعه، وحماية حقوق الشركة والعملاء." },
    ],
  },
  {
    id: "share",
    icon: "ri-share-line",
    title: "مشاركة المعلومات",
    content: `لا نبيع معلوماتك الشخصية لأطراف ثالثة. قد نشارك بياناتك في الحالات التالية:`,
    items: [
      { subtitle: "الجهات التمويلية", text: "البنوك وشركات التمويل المرخصة لمعالجة طلبات التمويل." },
      { subtitle: "الجهات الرقابية", text: "مؤسسة النقد العربي السعودي، الشركة السعودية للمعلومات الائتمانية (سمة)، وغيرها من الجهات الرقابية عند الاقتضاء." },
      { subtitle: "مزودو الخدمات", text: "شركاء تقنيون موثوقون يساعدوننا في تشغيل خدماتنا، مع إلزامهم بسرية المعلومات." },
      { subtitle: "المتطلبات القانونية", text: "عند الضرورة القانونية أو بأمر قضائي أو لحماية حقوقنا القانونية." },
    ],
  },
  {
    id: "security",
    icon: "ri-lock-2-line",
    title: "أمان البيانات",
    content: `نطبق معايير أمنية صارمة لحماية بياناتك:`,
    items: [
      { subtitle: "التشفير", text: "تشفير جميع البيانات المنقولة باستخدام بروتوكول SSL/TLS، وتشفير البيانات المخزنة." },
      { subtitle: "التحكم في الوصول", text: "تقييد الوصول إلى بياناتك على الموظفين المخولين فقط وفق مبدأ الحاجة إلى المعرفة." },
      { subtitle: "المراقبة المستمرة", text: "مراقبة الأنظمة على مدار الساعة للكشف عن أي نشاط مشبوه أو محاولات اختراق." },
      { subtitle: "النسخ الاحتياطي", text: "إجراء نسخ احتياطية منتظمة للبيانات لضمان استمرارية الخدمة وحماية المعلومات." },
    ],
  },
  {
    id: "rights",
    icon: "ri-user-settings-line",
    title: "حقوقك",
    content: `وفقاً للأنظمة المعمول بها في المملكة العربية السعودية، لديك الحقوق التالية:`,
    items: [
      { subtitle: "حق الاطلاع", text: "طلب الاطلاع على المعلومات الشخصية التي نحتفظ بها عنك." },
      { subtitle: "حق التصحيح", text: "طلب تصحيح أي معلومات غير دقيقة أو غير مكتملة." },
      { subtitle: "حق الحذف", text: "طلب حذف بياناتك في الحالات التي يسمح بها النظام، مع مراعاة متطلبات الاحتفاظ القانونية." },
      { subtitle: "حق الاعتراض", text: "الاعتراض على معالجة بياناتك لأغراض التسويق المباشر." },
      { subtitle: "حق نقل البيانات", text: "الحصول على نسخة من بياناتك بصيغة قابلة للقراءة الآلية." },
    ],
  },
  {
    id: "cookies",
    icon: "ri-file-list-3-line",
    title: "ملفات تعريف الارتباط (Cookies)",
    content: `نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا:`,
    items: [
      { subtitle: "ملفات ضرورية", text: "ضرورية لتشغيل الموقع وتذكر تفضيلاتك الأساسية." },
      { subtitle: "ملفات تحليلية", text: "تساعدنا على فهم كيفية استخدام الزوار للموقع لتحسين الأداء." },
      { subtitle: "ملفات تسويقية", text: "تُستخدم لعرض إعلانات ذات صلة باهتماماتك. يمكنك تعطيلها من إعدادات متصفحك." },
    ],
  },
  {
    id: "retention",
    icon: "ri-time-line",
    title: "مدة الاحتفاظ بالبيانات",
    content: `نحتفظ ببياناتك للمدة اللازمة لتقديم الخدمات وللامتثال للمتطلبات القانونية:

• بيانات العملاء النشطين: طوال فترة العلاقة التعاقدية وبعدها بـ 10 سنوات وفق متطلبات ساما.
• بيانات الطلبات المرفوضة: 5 سنوات من تاريخ الرفض.
• سجلات الاتصالات: 3 سنوات من تاريخ آخر تواصل.
• بيانات الموقع الإلكتروني: 12 شهراً من تاريخ الزيارة.`,
  },
  {
    id: "children",
    icon: "ri-parent-line",
    title: "خصوصية الأطفال",
    content: `خدماتنا موجهة للأفراد البالغين (18 سنة فأكثر). لا نجمع عن قصد أي معلومات شخصية من الأطفال دون سن 18 عاماً. إذا علمنا بجمع معلومات من قاصر، سنحذفها فوراً. إذا كنت تعتقد أن طفلاً قدّم لنا معلوماته، يرجى التواصل معنا فوراً.`,
  },
  {
    id: "updates",
    icon: "ri-refresh-line",
    title: "تحديثات السياسة",
    content: `قد نحدّث هذه السياسة من وقت لآخر لتعكس التغييرات في ممارساتنا أو المتطلبات القانونية. سنخطرك بأي تغييرات جوهرية عبر:

• إرسال إشعار بريد إلكتروني إلى عنوانك المسجل.
• نشر إشعار واضح على موقعنا الإلكتروني.
• تحديث تاريخ "آخر تعديل" في أعلى هذه الصفحة.

استمرارك في استخدام خدماتنا بعد نشر التحديثات يُعدّ موافقة على السياسة المحدّثة.`,
  },
  {
    id: "contact",
    icon: "ri-customer-service-2-line",
    title: "التواصل معنا",
    content: `لأي استفسارات أو طلبات تتعلق بخصوصيتك، يمكنك التواصل مع مسؤول حماية البيانات لدينا:`,
    contactInfo: [
      { icon: "ri-mail-line", label: "البريد الإلكتروني", value: "privacy@company.sa" },
      { icon: "ri-phone-line", label: "الهاتف", value: "920 000 000" },
      { icon: "ri-map-pin-line", label: "العنوان", value: "الرياض، المملكة العربية السعودية" },
      { icon: "ri-time-line", label: "ساعات العمل", value: "الأحد – الخميس: 8ص – 5م" },
    ],
  },
];

export default function PrivacyPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("intro");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8]" dir="rtl">
      {/* Navbar */}
      <nav
        className="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "#ffffff" : "transparent",
          boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.08)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
          <Link to="/website">
            <img
              src={scrolled ? LOGO_DARK : LOGO_WHITE}
              alt="الشعار"
              className="h-10 w-auto object-contain transition-all duration-300"
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/website"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border"
              style={{
                borderColor: scrolled ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.25)",
                color: scrolled ? "#161616" : "rgba(255,255,255,0.9)",
                backgroundColor: scrolled ? "transparent" : "rgba(255,255,255,0.08)",
              }}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-arrow-right-line text-sm"></i>
              </div>
              العودة للموقع
            </Link>
            <Link
              to="/"
              className="px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer text-[#161616] hover:opacity-90 whitespace-nowrap"
              style={{ backgroundColor: "#FF6039" }}
            >
              ابدأ الآن
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div
        className="relative pt-32 pb-20 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #161616 0%, #2a2a2a 50%, #1a1a1a 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: "#FF6039", filter: "blur(80px)", transform: "translate(-30%, -30%)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: "#FF6039", filter: "blur(60px)", transform: "translate(20%, 30%)" }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ backgroundColor: "rgba(255,96,57,0.15)", color: "#FF6039", border: "1px solid rgba(255,96,57,0.3)" }}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-shield-check-line text-sm"></i>
            </div>
            آخر تحديث: أبريل 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            سياسة الخصوصية
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
            نلتزم بحماية خصوصيتك وأمان بياناتك الشخصية. اقرأ هذه السياسة لفهم كيفية جمع معلوماتك واستخدامها وحمايتها.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar TOC */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="sticky top-28 bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">المحتويات</p>
              <nav className="space-y-1">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer text-right ${
                      activeSection === sec.id
                        ? "text-[#FF6039] bg-orange-50"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className={`w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 ${
                      activeSection === sec.id ? "bg-orange-100" : "bg-gray-100"
                    }`}>
                      <i className={`${sec.icon} text-sm ${activeSection === sec.id ? "text-[#FF6039]" : "text-gray-500"}`}></i>
                    </div>
                    {sec.title}
                  </button>
                ))}
              </nav>

              {/* Quick contact */}
              <div
                className="mt-6 p-4 rounded-xl"
                style={{ backgroundColor: "rgba(255,96,57,0.06)", border: "1px solid rgba(255,96,57,0.15)" }}
              >
                <p className="text-xs font-bold text-gray-700 mb-2">هل لديك سؤال؟</p>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">تواصل مع فريق حماية البيانات لدينا</p>
                <a
                  href="mailto:privacy@company.sa"
                  className="flex items-center gap-2 text-xs font-semibold text-[#FF6039] hover:underline cursor-pointer"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-mail-line text-sm"></i>
                  </div>
                  privacy@company.sa
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-10">
            {sections.map((sec, idx) => (
              <section
                key={sec.id}
                id={sec.id}
                className="bg-white rounded-2xl border border-gray-100 p-8 scroll-mt-28"
                onMouseEnter={() => setActiveSection(sec.id)}
              >
                {/* Section header */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{ backgroundColor: "rgba(255,96,57,0.1)" }}
                  >
                    <i className={`${sec.icon} text-xl`} style={{ color: "#FF6039" }}></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "rgba(255,96,57,0.1)", color: "#FF6039" }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-gray-900 mt-0.5">{sec.title}</h2>
                  </div>
                </div>

                {/* Content */}
                {sec.content && (
                  <p className="text-gray-600 leading-relaxed text-sm mb-5 whitespace-pre-line">{sec.content}</p>
                )}

                {sec.items && (
                  <div className="space-y-4">
                    {sec.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex gap-4 p-4 rounded-xl"
                        style={{ backgroundColor: "#fafaf8", border: "1px solid rgba(0,0,0,0.05)" }}
                      >
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                          style={{ backgroundColor: "#FF6039" }}
                        />
                        <div>
                          <p className="text-sm font-bold text-gray-800 mb-1">{item.subtitle}</p>
                          <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {sec.contactInfo && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {sec.contactInfo.map((info, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-4 rounded-xl"
                        style={{ backgroundColor: "#fafaf8", border: "1px solid rgba(0,0,0,0.05)" }}
                      >
                        <div
                          className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                          style={{ backgroundColor: "rgba(255,96,57,0.1)" }}
                        >
                          <i className={`${info.icon} text-base`} style={{ color: "#FF6039" }}></i>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">{info.label}</p>
                          <p className="text-sm font-semibold text-gray-800">{info.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}

            {/* Bottom note */}
            <div
              className="rounded-2xl p-8 text-center"
              style={{ background: "linear-gradient(135deg, #161616 0%, #2a2a2a 100%)" }}
            >
              <div
                className="w-14 h-14 flex items-center justify-center rounded-2xl mx-auto mb-4"
                style={{ backgroundColor: "rgba(255,96,57,0.2)" }}
              >
                <i className="ri-shield-star-line text-2xl" style={{ color: "#FF6039" }}></i>
              </div>
              <h3 className="text-xl font-black text-white mb-3">التزامنا بخصوصيتك</h3>
              <p className="text-white/60 text-sm leading-relaxed max-w-lg mx-auto mb-6">
                نحن ملتزمون بأعلى معايير حماية البيانات وفق أنظمة المملكة العربية السعودية ومتطلبات مؤسسة النقد العربي السعودي.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-[#161616] cursor-pointer hover:opacity-90 transition-all"
                style={{ backgroundColor: "#FF6039" }}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-home-line text-sm"></i>
                </div>
                العودة للصفحة الرئيسية
              </Link>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="py-8 border-t"
        style={{ backgroundColor: "#161616", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} جميع الحقوق محفوظة — مرخصة من مؤسسة النقد العربي السعودي
          </p>
          <div className="flex items-center gap-4">
            <Link to="/website" className="text-white/40 text-xs hover:text-white/70 transition-colors cursor-pointer whitespace-nowrap">
              الموقع الإلكتروني
            </Link>
            <Link to="/" className="text-white/40 text-xs hover:text-white/70 transition-colors cursor-pointer whitespace-nowrap">
              صفحة الهبوط
            </Link>
            <span className="text-white/40 text-xs whitespace-nowrap">سياسة الخصوصية</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
