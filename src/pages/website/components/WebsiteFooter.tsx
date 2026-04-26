import { Link } from "react-router-dom";
import { useDarkModeContext } from "../context/DarkModeContext";

const PATTERN_URL =
  "https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/04764a59-afee-476b-ac3c-f34c711f7334_Artboard-2.png?v=33456a03348b5a87fd5047387c68671a";

const LOGO_WHITE =
  "https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/3fa99e41-3181-42f3-b65d-33c71c7fce19_-02.png?v=dd9a6d7162ba41ac3085905187c795fd";

export default function WebsiteFooter() {
  const { dark } = useDarkModeContext();

  return (
    <footer className="relative overflow-hidden pt-16 pb-6" style={{ backgroundColor: "#FF6039" }}>
      {/* Pattern */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `url('${PATTERN_URL}')`,
          backgroundSize: "320px auto",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ backgroundColor: "rgba(22,22,22,0.2)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <img src={LOGO_WHITE} alt="الشعار" className="h-14 w-auto object-contain mb-5" style={{ filter: "invert(1) brightness(0)" }} />
            <p className="text-[#161616]/70 text-sm leading-relaxed mb-5">
              نظام متكامل لإدارة العملاء وتقديم أفضل الحلول التمويلية في المملكة العربية السعودية.
            </p>
            <div className="flex gap-3">
              {["ri-twitter-x-line","ri-instagram-line","ri-linkedin-box-line","ri-whatsapp-line"].map((ic, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center rounded-lg transition-all cursor-pointer hover:scale-110"
                  style={{ backgroundColor: "rgba(22,22,22,0.15)" }}
                >
                  <i className={`${ic} text-base text-[#161616]`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-sm text-[#161616] mb-4">خدماتنا</h4>
            <ul className="space-y-2.5">
              {["قروض شخصية","تمويل عقاري","تمويل المركبات","تمويل الأعمال","إعادة التمويل","سداد المتعثرات"].map(s => (
                <li key={s}>
                  <a href="#services" className="text-[#161616]/65 text-sm hover:text-[#161616] transition-colors cursor-pointer">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-sm text-[#161616] mb-4">روابط مفيدة</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/about" className="text-[#161616]/65 text-sm hover:text-[#161616] transition-colors cursor-pointer">
                  من نحن
                </Link>
              </li>
              {[
                { label: "كيف نعمل", href: "#process" },
                { label: "آراء العملاء", href: "#testimonials" },
                { label: "الأسئلة الشائعة", href: "#faq" },
              ].map(l => (
                <li key={l.label}>
                  <a href={l.href} className="text-[#161616]/65 text-sm hover:text-[#161616] transition-colors cursor-pointer">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/privacy" className="text-[#161616]/65 text-sm hover:text-[#161616] transition-colors cursor-pointer">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <a href="#" className="text-[#161616]/65 text-sm hover:text-[#161616] transition-colors cursor-pointer">
                  الشروط والأحكام
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm text-[#161616] mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              {[
                { icon: "ri-phone-line", text: "920 000 000" },
                { icon: "ri-whatsapp-line", text: "0500000000" },
                { icon: "ri-mail-line", text: "info@company.sa" },
                { icon: "ri-map-pin-line", text: "الرياض، المملكة العربية السعودية" },
                { icon: "ri-time-line", text: "الأحد – الخميس: 8ص – 5م" },
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

        {/* Bottom bar */}
        <div
          className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: "rgba(22,22,22,0.2)" }}
        >
          <p className="text-[#161616]/55 text-xs">
            © {new Date().getFullYear()} جميع الحقوق محفوظة — مرخصة من مؤسسة النقد العربي السعودي
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <Link to="/privacy" className="text-[#161616]/55 text-xs hover:text-[#161616]/80 transition-colors cursor-pointer whitespace-nowrap">
              سياسة الخصوصية
            </Link>
            <a href="#" className="text-[#161616]/55 text-xs hover:text-[#161616]/80 transition-colors cursor-pointer whitespace-nowrap">
              الشروط والأحكام
            </a>
            <a href="#" className="text-[#161616]/55 text-xs hover:text-[#161616]/80 transition-colors cursor-pointer whitespace-nowrap">
              ملفات تعريف الارتباط
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
