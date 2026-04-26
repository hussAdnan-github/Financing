import { Link } from "react-router-dom";

export default function FooterSection() {
  return (
    <footer className="relative bg-brand-600 text-white pt-16 pb-6 overflow-hidden" dir="rtl">
      {/* Pattern Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/e2774022-76a7-49e8-916b-72f32e1e2c0c_Artboard-1.png?v=ad08040ef9ec013ea405455f2fc72042')",
          backgroundSize: "380px auto",
          backgroundRepeat: "repeat",
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <img
              src="https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/3fa99e41-3181-42f3-b65d-33c71c7fce19_-02.png?v=dd9a6d7162ba41ac3085905187c795fd"
              alt="الشعار"
              className="h-14 w-auto object-contain mb-5"
            />
            <p className="text-white/70 text-sm leading-relaxed mb-5">
              نظام متكامل لإدارة العملاء وتقديم أفضل الحلول التمويلية في المملكة العربية السعودية.
            </p>
            <div className="flex gap-3">
              {["ri-twitter-x-line","ri-instagram-line","ri-linkedin-box-line","ri-whatsapp-line"].map((ic, i) => (
                <a key={i} href="#" className="w-9 h-9 flex items-center justify-center bg-white/15 hover:bg-white/25 rounded-lg transition-colors cursor-pointer">
                  <i className={`${ic} text-base`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4">خدماتنا</h4>
            <ul className="space-y-2.5">
              {["قروض شخصية","تمويل عقاري","تمويل المركبات","تمويل الأعمال","إعادة التمويل","خدمات التأمين"].map(s => (
                <li key={s}><a href="#services" className="text-white/65 text-sm hover:text-white transition-colors cursor-pointer">{s}</a></li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4">روابط مفيدة</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/about" className="text-white/65 text-sm hover:text-white transition-colors cursor-pointer">من نحن</Link>
              </li>
              {["الأسئلة الشائعة","الشروط والأحكام","اتصل بنا"].map(l => (
                <li key={l}><a href="#" className="text-white/65 text-sm hover:text-white transition-colors cursor-pointer">{l}</a></li>
              ))}
              <li>
                <Link to="/privacy" className="text-white/65 text-sm hover:text-white transition-colors cursor-pointer">
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              {[
                { icon: "ri-phone-line", text: "920 000 000" },
                { icon: "ri-mail-line", text: "info@company.sa" },
                { icon: "ri-map-pin-line", text: "الرياض، المملكة العربية السعودية" },
                { icon: "ri-time-line", text: "الأحد - الخميس: 8ص – 5م" }
              ].map((c, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <i className={`${c.icon} text-white/80 text-sm`}></i>
                  </div>
                  <span className="text-white/65 text-sm">{c.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider + bottom bar */}
        <div className="border-t border-white/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/50 text-xs">
            © {new Date().getFullYear()} جميع الحقوق محفوظة — مرخصة من مؤسسة النقد العربي السعودي
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <Link to="/privacy" className="text-white/50 text-xs hover:text-white/80 transition-colors cursor-pointer whitespace-nowrap">
              سياسة الخصوصية
            </Link>
            <a href="#" className="text-white/50 text-xs hover:text-white/80 transition-colors cursor-pointer whitespace-nowrap">الشروط والأحكام</a>
            <a href="#" className="text-white/50 text-xs hover:text-white/80 transition-colors cursor-pointer whitespace-nowrap">ملفات تعريف الارتباط</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
