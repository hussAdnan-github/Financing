import { useState, FormEvent } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useDarkModeContext } from "../context/DarkModeContext";

const PATTERN_URL =
  "https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/04764a59-afee-476b-ac3c-f34c711f7334_Artboard-2.png?v=33456a03348b5a87fd5047387c68671a";

const serviceOptions = [
  "قرض شخصي",
  "تمويل عقاري",
  "تمويل مركبة",
  "تمويل الأعمال",
  "إعادة تمويل",
  "سداد متعثرات",
  "استشارة مجانية",
];

export default function WebsiteContact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const { dark } = useDarkModeContext();
  const { ref, visible } = useScrollAnimation(0.1);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = new URLSearchParams();
    const inputs = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "input, select, textarea"
    );
    inputs.forEach((el) => {
      if (el.name && el.value) data.append(el.name, el.value);
    });

    try {
      await fetch("https://readdy.ai/api/form/d7m2ifn5qk5pqai6c7bg", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data.toString(),
      });
      setSubmitted(true);
    } catch {
      setError("حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const bg = dark ? "#0e0e0e" : "#f0ede9";
  const textPrimary = dark ? "white" : "#161616";
  const textSecondary = dark ? "rgba(255,255,255,0.6)" : "rgba(22,22,22,0.6)";
  const cardBg = dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.9)";
  const cardBorder = dark ? "rgba(255,96,57,0.15)" : "rgba(255,96,57,0.2)";
  const inputBg = dark ? "rgba(255,255,255,0.05)" : "rgba(22,22,22,0.04)";
  const inputBorder = dark ? "rgba(255,255,255,0.1)" : "rgba(22,22,22,0.12)";
  const selectBg = dark ? "#1e1e1e" : "#f5f2ef";

  return (
    <section
      id="contact"
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
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left info */}
          <div
            className={`lg:w-5/12 w-full transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
          >
            <div
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full mb-6 border"
              style={{ borderColor: "rgba(255,96,57,0.3)", color: "#FF6039", backgroundColor: "rgba(255,96,57,0.08)" }}
            >
              <i className="ri-mail-send-line"></i>
              تواصل معنا
            </div>

            <h2
              className="text-4xl md:text-5xl font-black mb-6 leading-tight"
              style={{ fontFamily: "'Tajawal', sans-serif", color: textPrimary }}
            >
              ابدأ رحلتك
              <br />
              <span style={{ color: "#FF6039" }}>المالية اليوم</span>
            </h2>

            <p className="text-base leading-relaxed mb-10" style={{ color: textSecondary }}>
              أرسل بياناتك وسيتواصل معك أحد مستشارينا المتخصصين في أقرب وقت ممكن لمناقشة أفضل الخيارات المتاحة لك.
            </p>

            {/* Contact info */}
            <div className="space-y-4 mb-10">
              {[
                { icon: "ri-phone-line", label: "الهاتف", value: "920 000 000" },
                { icon: "ri-whatsapp-line", label: "واتساب", value: "0500000000" },
                { icon: "ri-mail-line", label: "البريد الإلكتروني", value: "info@company.sa" },
                { icon: "ri-map-pin-line", label: "العنوان", value: "الرياض، المملكة العربية السعودية" },
                { icon: "ri-time-line", label: "ساعات العمل", value: "الأحد – الخميس: 8ص – 5م" },
              ].map((c, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 transition-all duration-500 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}
                  style={{ transitionDelay: `${200 + i * 60}ms` }}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{ backgroundColor: "rgba(255,96,57,0.12)" }}
                  >
                    <i className={`${c.icon} text-base`} style={{ color: "#FF6039" }}></i>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: textSecondary }}>{c.label}</p>
                    <p className="text-sm font-medium" style={{ color: textPrimary }}>{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="flex gap-3">
              {[
                { icon: "ri-twitter-x-line", href: "#" },
                { icon: "ri-instagram-line", href: "#" },
                { icon: "ri-linkedin-box-line", href: "#" },
                { icon: "ri-whatsapp-line", href: "#" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border transition-all cursor-pointer hover:border-[#FF6039]/40 hover:scale-110"
                  style={{
                    borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(22,22,22,0.12)",
                    color: dark ? "rgba(255,255,255,0.6)" : "rgba(22,22,22,0.6)",
                  }}
                >
                  <i className={`${s.icon} text-base`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Right form */}
          <div
            className={`lg:w-7/12 w-full transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
            style={{ transitionDelay: "150ms" }}
          >
            <div
              className="rounded-2xl border p-8 md:p-10"
              style={{ backgroundColor: cardBg, borderColor: cardBorder }}
            >
              {submitted ? (
                <div className="text-center py-10">
                  <div
                    className="w-20 h-20 flex items-center justify-center rounded-full mx-auto mb-6"
                    style={{ backgroundColor: "rgba(255,96,57,0.12)" }}
                  >
                    <i className="ri-check-double-line text-4xl" style={{ color: "#FF6039" }}></i>
                  </div>
                  <h3 className="text-2xl font-black mb-3" style={{ fontFamily: "'Tajawal', sans-serif", color: textPrimary }}>
                    تم استلام رسالتك!
                  </h3>
                  <p className="text-sm mb-6" style={{ color: textSecondary }}>
                    شكراً لتواصلك معنا. سيتواصل معك أحد مستشارينا خلال ساعات العمل.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-xl cursor-pointer text-[#161616] hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#FF6039" }}
                  >
                    <i className="ri-refresh-line"></i>
                    إرسال رسالة أخرى
                  </button>
                </div>
              ) : (
                <form
                  id="website-contact-form"
                  data-readdy-form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <h3 className="text-xl font-black mb-6" style={{ fontFamily: "'Tajawal', sans-serif", color: textPrimary }}>
                    أرسل طلبك الآن
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: textSecondary }}>
                        الاسم الكامل <span style={{ color: "#FF6039" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="أدخل اسمك الكامل"
                        className="w-full h-11 rounded-xl px-4 text-sm focus:outline-none transition-colors border"
                        style={{
                          backgroundColor: inputBg,
                          borderColor: inputBorder,
                          color: textPrimary,
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: textSecondary }}>
                        رقم الجوال <span style={{ color: "#FF6039" }}>*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="05xxxxxxxx"
                        className="w-full h-11 rounded-xl px-4 text-sm focus:outline-none transition-colors border"
                        style={{
                          backgroundColor: inputBg,
                          borderColor: inputBorder,
                          color: textPrimary,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: textSecondary }}>
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="example@email.com"
                        className="w-full h-11 rounded-xl px-4 text-sm focus:outline-none transition-colors border"
                        style={{
                          backgroundColor: inputBg,
                          borderColor: inputBorder,
                          color: textPrimary,
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: textSecondary }}>
                        المدينة <span style={{ color: "#FF6039" }}>*</span>
                      </label>
                      <select
                        name="city"
                        required
                        className="w-full h-11 rounded-xl px-4 text-sm focus:outline-none transition-colors border cursor-pointer"
                        style={{ backgroundColor: selectBg, borderColor: inputBorder, color: textPrimary }}
                      >
                        <option value="">اختر مدينتك</option>
                        {["الرياض","جدة","مكة المكرمة","المدينة المنورة","الدمام","الخبر","الطائف","أبها","تبوك","نجران","حائل","القصيم","جازان"].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: textSecondary }}>
                      نوع الخدمة المطلوبة <span style={{ color: "#FF6039" }}>*</span>
                    </label>
                    <select
                      name="service_type"
                      required
                      className="w-full h-11 rounded-xl px-4 text-sm focus:outline-none transition-colors border cursor-pointer"
                      style={{ backgroundColor: selectBg, borderColor: inputBorder, color: textPrimary }}
                    >
                      <option value="">اختر الخدمة</option>
                      {serviceOptions.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: textSecondary }}>
                      جهة العمل
                    </label>
                    <select
                      name="employer_type"
                      className="w-full h-11 rounded-xl px-4 text-sm focus:outline-none transition-colors border cursor-pointer"
                      style={{ backgroundColor: selectBg, borderColor: inputBorder, color: textPrimary }}
                    >
                      <option value="">اختر جهة العمل</option>
                      {["مدني","عسكري","شبه حكومي","قطاع خاص","متقاعد"].map(e => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: textSecondary }}>
                      رسالتك أو استفسارك
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      maxLength={500}
                      placeholder="اكتب استفسارك أو أي تفاصيل إضافية..."
                      onChange={(e) => setCharCount(e.target.value.length)}
                      className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors border resize-none"
                      style={{
                        backgroundColor: inputBg,
                        borderColor: inputBorder,
                        color: textPrimary,
                      }}
                    />
                    <p className="text-xs mt-1 text-left" style={{ color: textSecondary }}>{charCount}/500</p>
                  </div>

                  {error && (
                    <div
                      className="text-sm px-4 py-3 rounded-xl border"
                      style={{ backgroundColor: "rgba(255,96,57,0.1)", borderColor: "rgba(255,96,57,0.3)", color: "#FF6039" }}
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full disabled:opacity-60 font-bold text-base rounded-xl transition-all cursor-pointer whitespace-nowrap py-3.5 text-[#161616] hover:-translate-y-0.5 hover:scale-[1.01]"
                    style={{ backgroundColor: "#FF6039" }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <i className="ri-loader-4-line animate-spin"></i>
                        جارٍ الإرسال...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <i className="ri-send-plane-line"></i>
                        أرسل طلبك الآن
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
