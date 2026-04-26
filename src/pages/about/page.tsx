import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const PATTERN_URL =
  "https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/04764a59-afee-476b-ac3c-f34c711f7334_Artboard-2.png?v=33456a03348b5a87fd5047387c68671a";

const LOGO_WHITE =
  "https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/3fa99e41-3181-42f3-b65d-33c71c7fce19_-02.png?v=dd9a6d7162ba41ac3085905187c795fd";

const LOGO_ICON_URL =
  "https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/820133cd-4a0c-452f-b662-b06701724b7d_-01.png?v=b2bfc75afceae2a1fe14bb1170d72133";

/* ─── Team Data ─── */
const team = [
  {
    name: "فيصل العتيبي",
    role: "المدير التنفيذي",
    desc: "خبرة 15 عاماً في القطاع المالي والمصرفي، حاصل على شهادة CMA من معهد الإدارة المالية.",
    img: "https://readdy.ai/api/search-image?query=professional%20Saudi%20Arabian%20male%20executive%20portrait%20confident%20warm%20smile%20dark%20navy%20suit%20modern%20office%20background%20soft%20lighting%20high%20quality%20corporate%20headshot&width=400&height=400&seq=team1&orientation=squarish",
  },
  {
    name: "أحمد الشمري",
    role: "مدير العمليات",
    desc: "متخصص في تحسين العمليات المالية وإدارة المشاريع، خبرة 12 عاماً في تطوير الأنظمة التشغيلية.",
    img: "https://readdy.ai/api/search-image?query=professional%20Saudi%20Arabian%20male%20operations%20manager%20portrait%20confident%20expression%20modern%20office%20background%20warm%20lighting%20corporate%20headshot%20high%20quality&width=400&height=400&seq=team2&orientation=squarish",
  },
  {
    name: "منى القحطاني",
    role: "مديرة المراجعة الداخلية",
    desc: "خبيرة في الامتثال والمراجعة المالية، حاصلة على شهادة CIA وCPA مع خبرة 10 سنوات.",
    img: "https://readdy.ai/api/search-image?query=professional%20Saudi%20Arabian%20female%20auditor%20portrait%20confident%20elegant%20modern%20office%20background%20soft%20lighting%20corporate%20headshot%20high%20quality&width=400&height=400&seq=team3&orientation=squarish",
  },
  {
    name: "سارة الحربي",
    role: "مديرة علاقات العملاء",
    desc: "متخصصة في تجربة العملاء وإدارة العلاقات، خبرة 8 سنوات في خدمة العملاء المتميزة.",
    img: "https://readdy.ai/api/search-image?query=professional%20Saudi%20Arabian%20female%20customer%20relations%20manager%20portrait%20warm%20smile%20modern%20office%20background%20soft%20lighting%20corporate%20headshot%20high%20quality&width=400&height=400&seq=team4&orientation=squarish",
  },
];

/* ─── Timeline Data ─── */
const timeline = [
  { year: "2014", title: "التأسيس", desc: "انطلاقتنا من الرياض بفريق صغير وطموح كبير لتقديم حلول تمويلية مبتكرة." },
  { year: "2016", title: "أول 1000 عميل", desc: "حققنا أول ألف عميل راضٍ ووسعنا نطاق خدماتنا لتشمل التمويل العقاري." },
  { year: "2018", title: "ترخيص ساما", desc: "حصلنا على الترخيص الكامل من مؤسسة النقد العربي السعودي كشركة تمويل مرخصة." },
  { year: "2020", title: "التوسع الرقمي", desc: "أطلقنا منصتنا الرقمية لتسريع الإجراءات وتحسين تجربة العملاء." },
  { year: "2022", title: "+10,000 عميل", desc: "تجاوزنا عشرة آلاف عميل ووسعنا فريقنا ليشمل خبراء في مختلف المجالات." },
  { year: "2024", title: "نظام تشغيل متكامل", desc: "أطلقنا نظامنا التشغيلي الداخلي المتكامل لإدارة دورة حياة العميل كاملاً." },
];

/* ─── Values Data ─── */
const values = [
  {
    icon: "ri-shield-check-line",
    title: "الشفافية والأمانة",
    desc: "نؤمن بالوضوح التام في كل تعاملاتنا — لا رسوم خفية ولا شروط مبهمة. نبني الثقة من خلال الصراحة في كل خطوة.",
  },
  {
    icon: "ri-speed-line",
    title: "السرعة والكفاءة",
    desc: "نحترم وقتك. إجراءاتنا مبسطة وموافقاتنا سريعة لأن وقتك ثمين ونحن ندرك ذلك تماماً.",
  },
  {
    icon: "ri-user-heart-line",
    title: "العميل أولاً",
    desc: "كل قرار نتخذه يبدأ بسؤال واحد: ما الأفضل لعميلنا؟ نضع مصلحتك في صلب كل ما نقوم به.",
  },
  {
    icon: "ri-award-line",
    title: "الجودة والاحترافية",
    desc: "فريقنا من المتخصصين المعتمدين يضمن لك أعلى مستويات الخدمة والدقة في كل تفصيل.",
  },
  {
    icon: "ri-lightbulb-flash-line",
    title: "الابتكار المستمر",
    desc: "نستثمر في التقنية والتطوير المستمر لتقديم حلول تمويلية متقدمة تلبي احتياجات السوق المتغيرة.",
  },
  {
    icon: "ri-hand-heart-line",
    title: "المسؤولية المجتمعية",
    desc: "نؤمن بأن نجاحنا مرتبط بنجاح مجتمعنا. نساهم في تمكين الأفراد والشركات لتحقيق أهدافهم المالية.",
  },
];

/* ─── Certifications ─── */
const certs = [
  { icon: "ri-shield-star-line", title: "ترخيص ساما", desc: "مرخصون من مؤسسة النقد العربي السعودي" },
  { icon: "ri-award-line", title: "ISO 27001", desc: "معتمدون بمعيار أمن المعلومات الدولي" },
  { icon: "ri-verified-badge-line", title: "عضوية الاتحاد", desc: "أعضاء في الاتحاد السعودي للتمويل" },
  { icon: "ri-file-shield-line", title: "حماية البيانات", desc: "متوافقون مع نظام حماية البيانات الشخصية" },
];

/* ─── Scroll Animation Hook ─── */
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ─── Navbar ─── */
function AboutNavbar({ dark, toggle }: { dark: boolean; toggle: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBg = scrolled ? (dark ? "#161616" : "#ffffff") : "transparent";
  const textColor = scrolled && !dark ? "#161616" : "rgba(255,255,255,0.85)";
  const textHover = scrolled && !dark ? "#161616" : "#ffffff";
  const hoverBg = scrolled && !dark ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.1)";

  const navLinks = [
    { label: "الرئيسية", href: "/website" },
    { label: "من نحن", href: "/about" },
    { label: "خدماتنا", href: "/website#services" },
    { label: "تواصل معنا", href: "/website#contact" },
  ];

  return (
    <nav
      className="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: navBg,
        boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.15)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={LOGO_WHITE}
            alt="الشعار"
            className="h-36 w-auto object-contain transition-all duration-300"
            style={{ filter: scrolled && !dark ? "invert(1) brightness(0)" : "none" }}
          />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer"
              style={{ color: textColor }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = textHover;
                (e.currentTarget as HTMLElement).style.backgroundColor = hoverBg;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = textColor;
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggle}
            className="w-10 h-10 flex items-center justify-center rounded-xl border transition-all cursor-pointer"
            style={{
              borderColor: scrolled && !dark ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.2)",
              color: scrolled && !dark ? "#161616" : "rgba(255,255,255,0.8)",
              backgroundColor: scrolled && !dark ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)",
            }}
            title={dark ? "الوضع الفاتح" : "الوضع الداكن"}
          >
            <i className={`text-base ${dark ? "ri-sun-line" : "ri-moon-line"}`}></i>
          </button>
          <Link
            to="/website#contact"
            className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap cursor-pointer text-[#161616] hover:opacity-90"
            style={{ backgroundColor: "#FF6039" }}
          >
            ابدأ الآن
          </Link>
        </div>

        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer"
          style={{ color: scrolled && !dark ? "#161616" : "white" }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={`text-xl ${menuOpen ? "ri-close-line" : "ri-menu-3-line"}`}></i>
        </button>
      </div>

      {menuOpen && (
        <div
          className="md:hidden border-t px-4 pb-4"
          style={{
            backgroundColor: dark ? "#161616" : "#ffffff",
            borderColor: "rgba(255,96,57,0.2)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm font-medium cursor-pointer transition-colors"
              style={{ color: dark ? "rgba(255,255,255,0.8)" : "#161616" }}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 mt-2">
            <Link
              to="/website#contact"
              className="flex-1 block px-4 py-3 text-center text-[#161616] font-bold rounded-lg text-sm cursor-pointer"
              style={{ backgroundColor: "#FF6039" }}
            >
              ابدأ الآن
            </Link>
            <button
              onClick={toggle}
              className="w-12 h-12 flex items-center justify-center rounded-lg border cursor-pointer"
              style={{
                borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
                color: dark ? "white" : "#161616",
              }}
            >
              <i className={`text-lg ${dark ? "ri-sun-line" : "ri-moon-line"}`}></i>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── Footer ─── */
function AboutFooter({ dark }: { dark: boolean }) {
  return (
    <footer className="relative overflow-hidden pt-16 pb-6" style={{ backgroundColor: "#FF6039" }}>
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `url('${PATTERN_URL}')`,
          backgroundSize: "320px auto",
          backgroundRepeat: "repeat",
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px" style={{ backgroundColor: "rgba(22,22,22,0.2)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <img src={LOGO_WHITE} alt="الشعار" className="h-14 w-auto object-contain mb-5" style={{ filter: "invert(1) brightness(0)" }} />
            <p className="text-[#161616]/70 text-sm leading-relaxed mb-5">
              نظام متكامل لإدارة العملاء وتقديم أفضل الحلول التمويلية في المملكة العربية السعودية.
            </p>
            <div className="flex gap-3">
              {["ri-twitter-x-line", "ri-instagram-line", "ri-linkedin-box-line", "ri-whatsapp-line"].map((ic, i) => (
                <a key={i} href="#" className="w-9 h-9 flex items-center justify-center rounded-lg transition-all cursor-pointer hover:scale-110" style={{ backgroundColor: "rgba(22,22,22,0.15)" }}>
                  <i className={`${ic} text-base text-[#161616]`}></i>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#161616] mb-4">خدماتنا</h4>
            <ul className="space-y-2.5">
              {["قروض شخصية", "تمويل عقاري", "تمويل المركبات", "تمويل الأعمال", "إعادة التمويل", "سداد المتعثرات"].map((s) => (
                <li key={s}>
                  <a href="/website#services" className="text-[#161616]/65 text-sm hover:text-[#161616] transition-colors cursor-pointer">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#161616] mb-4">روابط مفيدة</h4>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-[#161616]/65 text-sm hover:text-[#161616] transition-colors cursor-pointer">من نحن</Link></li>
              <li><a href="/website#services" className="text-[#161616]/65 text-sm hover:text-[#161616] transition-colors cursor-pointer">خدماتنا</a></li>
              <li><a href="/website#process" className="text-[#161616]/65 text-sm hover:text-[#161616] transition-colors cursor-pointer">كيف نعمل</a></li>
              <li><Link to="/privacy" className="text-[#161616]/65 text-sm hover:text-[#161616] transition-colors cursor-pointer">سياسة الخصوصية</Link></li>
              <li><a href="#" className="text-[#161616]/65 text-sm hover:text-[#161616] transition-colors cursor-pointer">الشروط والأحكام</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#161616] mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              {[
                { icon: "ri-phone-line", text: "920 000 000" },
                { icon: "ri-whatsapp-line", text: "0500000000" },
                { icon: "ri-mail-line", text: "info@company.sa" },
                { icon: "ri-map-pin-line", text: "الرياض، المملكة العربية السعودية" },
              ].map((c, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <i className={`${c.icon} text-[#161616]/80 text-sm`}></i>
                  </div>
                  <span className="text-[#161616]/65 text-sm">{c.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: "rgba(22,22,22,0.2)" }}>
          <p className="text-[#161616]/55 text-xs">
            © {new Date().getFullYear()} جميع الحقوق محفوظة — مرخصة من مؤسسة النقد العربي السعودي
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <Link to="/privacy" className="text-[#161616]/55 text-xs hover:text-[#161616]/80 transition-colors cursor-pointer whitespace-nowrap">سياسة الخصوصية</Link>
            <a href="#" className="text-[#161616]/55 text-xs hover:text-[#161616]/80 transition-colors cursor-pointer whitespace-nowrap">الشروط والأحكام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function AboutPage() {
  const [dark, setDark] = useState(false);
  const toggleDark = () => setDark((d) => !d);

  const bg = dark ? "#161616" : "#f5f0ec";
  const textPrimary = dark ? "white" : "#161616";
  const textSecondary = dark ? "rgba(255,255,255,0.6)" : "rgba(22,22,22,0.6)";
  const cardBg = dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)";
  const cardBorder = dark ? "rgba(255,255,255,0.06)" : "rgba(22,22,22,0.08)";
  const badgeBg = dark ? "rgba(255,96,57,0.08)" : "rgba(255,96,57,0.08)";

  const heroReveal = useScrollReveal(0.1);
  const storyReveal = useScrollReveal(0.1);
  const valuesReveal = useScrollReveal(0.1);
  const timelineReveal = useScrollReveal(0.1);
  const teamReveal = useScrollReveal(0.1);
  const certsReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen transition-colors duration-500" style={{ fontFamily: "'Tajawal', sans-serif", direction: "rtl", backgroundColor: bg }}>
      <AboutNavbar dark={dark} toggle={toggleDark} />

      {/* ═══ Hero ═══ */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20" style={{ backgroundColor: bg }}>
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            backgroundImage: `url('${PATTERN_URL}')`,
            backgroundSize: "340px auto",
            backgroundRepeat: "repeat",
            opacity: dark ? 0.07 : 0.04,
          }}
        />
        <div
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, #FF6039 0%, transparent 70%)", opacity: dark ? 0.1 : 0.06, filter: "blur(80px)" }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
          <div
            className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full mb-6 border transition-all duration-700 ${heroReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ borderColor: "rgba(255,96,57,0.4)", color: "#FF6039", backgroundColor: badgeBg }}
          >
            <i className="ri-building-line"></i>
            تعرف علينا
          </div>

          <h1
            className={`text-5xl md:text-7xl font-black leading-tight mb-6 transition-all duration-700 ${heroReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ fontFamily: "'Tajawal', sans-serif", color: textPrimary, transitionDelay: "100ms" }}
          >
            شركاؤك في
            <br />
            <span style={{ color: "#FF6039" }}>كل قرار مالي</span>
          </h1>

          <p
            className={`text-lg max-w-2xl mx-auto leading-relaxed mb-10 transition-all duration-700 ${heroReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ color: textSecondary, transitionDelay: "200ms" }}
          >
            نحن شركة متخصصة في تقديم الحلول التمويلية المتكاملة للأفراد والشركات في المملكة العربية السعودية.
            بخبرة تمتد لأكثر من عشر سنوات، نفخر بثقة آلاف العملاء.
          </p>

          <div
            className={`flex items-center justify-center gap-6 transition-all duration-700 ${heroReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: "300ms" }}
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
      </section>

      {/* ═══ Story / Vision / Mission ═══ */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: dark ? "#161616" : "#faf8f6" }}>
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            backgroundImage: `url('${PATTERN_URL}')`,
            backgroundSize: "300px auto",
            backgroundRepeat: "repeat",
            opacity: dark ? 0.05 : 0.03,
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #FF6039, transparent)" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div
              ref={storyReveal.ref}
              className={`transition-all duration-700 ${storyReveal.visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}
            >
              <div className="relative">
                <div className="w-full h-[520px] rounded-2xl overflow-hidden">
                  <img
                    src="https://readdy.ai/api/search-image?query=modern%20Saudi%20Arabian%20financial%20company%20headquarters%20elegant%20glass%20building%20Riyadh%20skyline%20sunset%20warm%20golden%20light%20professional%20corporate%20architecture%20sophisticated%20design&width=600&height=520&seq=about-building&orientation=portrait"
                    alt="مقر الشركة"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(to top, rgba(22,22,22,0.6) 0%, transparent 50%)" }} />
                </div>
                <div
                  className={`absolute -bottom-6 -right-6 rounded-2xl p-5 border transition-all duration-700 ${storyReveal.visible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
                  style={{ backgroundColor: "#FF6039", borderColor: "rgba(255,96,57,0.3)", transitionDelay: "300ms" }}
                >
                  <div className="text-3xl font-black text-[#161616]" style={{ fontFamily: "'Cairo', sans-serif" }}>+10</div>
                  <div className="text-[#161616]/80 text-sm font-semibold">سنوات خبرة</div>
                </div>
                <div
                  className="absolute -top-4 -left-4 w-24 h-24 rounded-xl opacity-20"
                  style={{ backgroundImage: `url('${PATTERN_URL}')`, backgroundSize: "80px auto", backgroundRepeat: "repeat" }}
                />
              </div>
            </div>

            {/* Content */}
            <div
              className={`transition-all duration-700 ${storyReveal.visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}
              style={{ transitionDelay: "150ms" }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight" style={{ fontFamily: "'Tajawal', sans-serif", color: textPrimary }}>
                قصتنا تبدأ من
                <br />
                <span style={{ color: "#FF6039" }}>طموح واحد</span>
              </h2>

              <p className="text-base leading-relaxed mb-6" style={{ color: textSecondary }}>
                تأسست شركتنا في عام 2014 من الرياض بفريق صغير وطموح كبير — هدفنا كان واضحاً: تقديم حلول تمويلية
                شفافة وعادلة للأفراد والشركات في المملكة العربية السعودية. منذ ذلك اليوم، نمونا بخطى ثابتة
                مدفوعة بثقة عملائنا وإيماننا بأن التمويل يجب أن يكون متاحاً للجميع.
              </p>

              <p className="text-base leading-relaxed mb-10" style={{ color: textSecondary }}>
                اليوم، نفخر بأننا نخدم أكثر من 15,000 عميل في مختلف مناطق المملكة، ونقدم مجموعة متكاملة
                من الخدمات التمويلية بإجراءات مبسطة وموافقات سريعة. نعمل بموجب ترخيص من مؤسسة النقد العربي السعودي (ساما)،
                ونلتزم بأعلى معايير الشفافية والمهنية.
              </p>

              {/* Vision & Mission cards */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 rounded-xl border" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0" style={{ backgroundColor: "rgba(255,96,57,0.12)" }}>
                    <i className="ri-eye-line text-xl" style={{ color: "#FF6039" }}></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-1" style={{ color: textPrimary }}>رؤيتنا</h4>
                    <p className="text-sm leading-relaxed" style={{ color: textSecondary }}>
                      أن نكون الخيار الأول للحلول التمويلية في المملكة العربية السعودية من خلال الابتكار والتميز في الخدمة.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-xl border" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0" style={{ backgroundColor: "rgba(255,96,57,0.12)" }}>
                    <i className="ri-send-plane-line text-xl" style={{ color: "#FF6039" }}></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-1" style={{ color: textPrimary }}>رسالتنا</h4>
                    <p className="text-sm leading-relaxed" style={{ color: textSecondary }}>
                      تمكين الأفراد والشركات من تحقيق أهدافهم المالية من خلال حلول تمويلية مبتكرة، شفافة، وعادلة.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Values ═══ */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: bg }}>
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            backgroundImage: `url('${PATTERN_URL}')`,
            backgroundSize: "300px auto",
            backgroundRepeat: "repeat",
            opacity: dark ? 0.05 : 0.03,
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <div
              className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full mb-4 border transition-all duration-700 ${valuesReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ borderColor: "rgba(255,96,57,0.3)", color: "#FF6039", backgroundColor: badgeBg }}
            >
              <i className="ri-heart-3-line"></i>
              قيمنا
            </div>
            <h2
              className={`text-4xl md:text-5xl font-black mb-4 transition-all duration-700 ${valuesReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ fontFamily: "'Tajawal', sans-serif", color: textPrimary, transitionDelay: "100ms" }}
            >
              المبادئ التي <span style={{ color: "#FF6039" }}>نؤمن بها</span>
            </h2>
            <p
              className={`text-base max-w-xl mx-auto transition-all duration-700 ${valuesReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ color: textSecondary, transitionDelay: "200ms" }}
            >
              هذه القيم ليست مجرد كلمات — هي الأساس الذي نبني عليه كل علاقة وكل قرار
            </p>
          </div>

          <div ref={valuesReveal.ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <div
                key={i}
                className={`p-6 rounded-xl border transition-all duration-500 hover:border-[#FF6039]/30 hover:-translate-y-1 ${valuesReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{
                  backgroundColor: cardBg,
                  borderColor: cardBorder,
                  transitionDelay: `${300 + i * 80}ms`,
                }}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl mb-4" style={{ backgroundColor: "rgba(255,96,57,0.12)" }}>
                  <i className={`${v.icon} text-xl`} style={{ color: "#FF6039" }}></i>
                </div>
                <h4 className="text-base font-bold mb-2" style={{ color: textPrimary }}>{v.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: textSecondary }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Timeline ═══ */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: dark ? "#161616" : "#faf8f6" }}>
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            backgroundImage: `url('${PATTERN_URL}')`,
            backgroundSize: "300px auto",
            backgroundRepeat: "repeat",
            opacity: dark ? 0.05 : 0.03,
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #FF6039, transparent)" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <div
              className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full mb-4 border transition-all duration-700 ${timelineReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ borderColor: "rgba(255,96,57,0.3)", color: "#FF6039", backgroundColor: badgeBg }}
            >
              <i className="ri-time-line"></i>
              رحلتنا
            </div>
            <h2
              className={`text-4xl md:text-5xl font-black mb-4 transition-all duration-700 ${timelineReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ fontFamily: "'Tajawal', sans-serif", color: textPrimary, transitionDelay: "100ms" }}
            >
              محطات <span style={{ color: "#FF6039" }}>نجاحنا</span>
            </h2>
          </div>

          <div ref={timelineReveal.ref} className="relative">
            {/* Center line */}
            <div className="absolute top-0 bottom-0 right-1/2 w-px -translate-x-1/2 hidden md:block" style={{ backgroundColor: "rgba(255,96,57,0.2)" }}></div>

            <div className="space-y-12">
              {timeline.map((t, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <div
                    key={i}
                    className={`relative flex flex-col md:flex-row items-center gap-6 transition-all duration-700 ${timelineReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{ transitionDelay: `${200 + i * 100}ms` }}
                  >
                    {/* Content */}
                    <div className={`flex-1 ${isLeft ? "md:text-left" : "md:text-right"} text-right w-full`}>
                      <div
                        className="inline-block p-5 rounded-xl border max-w-md"
                        style={{ backgroundColor: cardBg, borderColor: cardBorder }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl font-black" style={{ color: "#FF6039", fontFamily: "'Cairo', sans-serif" }}>{t.year}</span>
                          <h4 className="text-base font-bold" style={{ color: textPrimary }}>{t.title}</h4>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: textSecondary }}>{t.desc}</p>
                      </div>
                    </div>

                    {/* Dot */}
                    <div className="hidden md:flex w-4 h-4 rounded-full flex-shrink-0 items-center justify-center" style={{ backgroundColor: "#FF6039" }}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dark ? "#161616" : "#faf8f6" }}></div>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1 hidden md:block"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Team ═══ */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: bg }}>
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            backgroundImage: `url('${PATTERN_URL}')`,
            backgroundSize: "300px auto",
            backgroundRepeat: "repeat",
            opacity: dark ? 0.05 : 0.03,
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <div
              className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full mb-4 border transition-all duration-700 ${teamReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ borderColor: "rgba(255,96,57,0.3)", color: "#FF6039", backgroundColor: badgeBg }}
            >
              <i className="ri-team-line"></i>
              فريقنا
            </div>
            <h2
              className={`text-4xl md:text-5xl font-black mb-4 transition-all duration-700 ${teamReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ fontFamily: "'Tajawal', sans-serif", color: textPrimary, transitionDelay: "100ms" }}
            >
              نخبة من <span style={{ color: "#FF6039" }}>الخبراء</span>
            </h2>
            <p
              className={`text-base max-w-xl mx-auto transition-all duration-700 ${teamReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ color: textSecondary, transitionDelay: "200ms" }}
            >
              فريقنا يجمع بين الخبرة العميقة والشغف بالتميز — كل عضو يضيف قيمة حقيقية لنجاح عملائنا
            </p>
          </div>

          <div ref={teamReveal.ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div
                key={i}
                className={`group rounded-2xl border overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-[#FF6039]/30 ${teamReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{
                  backgroundColor: cardBg,
                  borderColor: cardBorder,
                  transitionDelay: `${300 + i * 100}ms`,
                }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(22,22,22,0.7) 0%, transparent 60%)" }} />
                  <div className="absolute bottom-4 right-4 left-4">
                    <h4 className="text-lg font-bold text-white mb-0.5">{member.name}</h4>
                    <p className="text-sm text-white/70">{member.role}</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm leading-relaxed" style={{ color: textSecondary }}>{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Certifications ═══ */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: "#FF6039" }}>
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `url('${PATTERN_URL}')`,
            backgroundSize: "300px auto",
            backgroundRepeat: "repeat",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <div ref={certsReveal.ref} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {certs.map((c, i) => (
              <div
                key={i}
                className={`text-center transition-all duration-600 ${certsReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl mx-auto mb-4 transition-transform hover:scale-110" style={{ backgroundColor: "rgba(22,22,22,0.15)" }}>
                  <i className={`${c.icon} text-2xl text-[#161616]`}></i>
                </div>
                <div className="text-[#161616] font-bold text-base mb-1">{c.title}</div>
                <div className="text-[#161616]/60 text-xs">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: dark ? "#161616" : "#faf8f6" }}>
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            backgroundImage: `url('${PATTERN_URL}')`,
            backgroundSize: "300px auto",
            backgroundRepeat: "repeat",
            opacity: dark ? 0.05 : 0.03,
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl mx-auto mb-6" style={{ backgroundColor: "rgba(255,96,57,0.12)" }}>
            <i className="ri-service-line text-3xl" style={{ color: "#FF6039" }}></i>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: "'Tajawal', sans-serif", color: textPrimary }}>
            كن شريكاً في <span style={{ color: "#FF6039" }}>النجاح</span>
          </h2>
          <p className="text-base max-w-xl mx-auto leading-relaxed mb-8" style={{ color: textSecondary }}>
            سواء كنت فرداً تبحث عن تمويل شخصي أو شركة تسعى لتوسيع أعمالك، نحن هنا لنساعدك في تحقيق أهدافك.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/website#contact"
              className="inline-flex items-center justify-center gap-2 font-bold text-base px-8 py-4 rounded-xl transition-all hover:-translate-y-1 hover:scale-105 cursor-pointer whitespace-nowrap text-[#161616]"
              style={{ backgroundColor: "#FF6039" }}
            >
              <span>ابدأ طلبك الآن</span>
              <i className="ri-arrow-left-line"></i>
            </Link>
            <Link
              to="/website"
              className="inline-flex items-center justify-center gap-2 font-semibold text-base px-8 py-4 rounded-xl transition-all cursor-pointer whitespace-nowrap border hover:-translate-y-0.5"
              style={{
                borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(22,22,22,0.2)",
                color: dark ? "rgba(255,255,255,0.8)" : "#161616",
              }}
            >
              <i className="ri-global-line"></i>
              <span>تصفح الموقع</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <AboutFooter dark={dark} />
    </div>
  );
}
