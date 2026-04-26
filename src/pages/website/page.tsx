import { useState, useEffect } from "react";
import { DarkModeProvider, useDarkModeContext } from "./context/DarkModeContext";
import WebsiteNavbar from "./components/WebsiteNavbar";
import WebsiteHero from "./components/WebsiteHero";
import WebsiteAbout from "./components/WebsiteAbout";
import WebsiteServices from "./components/WebsiteServices";
import WebsiteStats from "./components/WebsiteStats";
import WebsiteProcess from "./components/WebsiteProcess";
import WebsiteTestimonials from "./components/WebsiteTestimonials";
import WebsiteComparison from "./components/WebsiteComparison";
import WebsiteFAQ from "./components/WebsiteFAQ";
import WebsiteContact from "./components/WebsiteContact";
import WebsiteFooter from "./components/WebsiteFooter";

const WHATSAPP_NUMBER = "966500000000";
const WHATSAPP_MESSAGE = "مرحبا، أريد الاستفسار عن خدمات التمويل";

function WebsiteContent() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [visible, setVisible] = useState(false);
  const { dark } = useDarkModeContext();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{ fontFamily: "'Tajawal', sans-serif", direction: "rtl" }}
    >
      <WebsiteNavbar />
      <WebsiteHero />
      <WebsiteAbout />
      <WebsiteStats />
      <WebsiteServices />
      <WebsiteComparison />
      <WebsiteProcess />
      <WebsiteTestimonials />
      <WebsiteFAQ />
      <WebsiteContact />
      <WebsiteFooter />

      {/* WhatsApp Floating Button */}
      <div
        className={`fixed bottom-8 left-8 z-50 flex flex-col items-end gap-3 transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Tooltip */}
        {showTooltip && (
          <div
            className="relative px-4 py-2.5 rounded-xl text-sm font-semibold text-white whitespace-nowrap"
            style={{ backgroundColor: "#161616" }}
          >
            <span>تواصل معنا عبر واتساب</span>
            <div
              className="absolute -bottom-1.5 left-6 w-3 h-3 rotate-45"
              style={{ backgroundColor: "#161616" }}
            />
          </div>
        )}

        {/* Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="relative w-14 h-14 flex items-center justify-center rounded-full cursor-pointer transition-transform hover:scale-110 active:scale-95"
          style={{ backgroundColor: "#25D366" }}
          aria-label="تواصل عبر واتساب"
        >
          {/* Pulse ring */}
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-30"
            style={{ backgroundColor: "#25D366" }}
          />
          <i className="ri-whatsapp-line text-white text-2xl relative z-10"></i>
        </a>
      </div>

      {/* Dark mode indicator (subtle) */}
      <div
        className={`fixed bottom-8 right-8 z-40 transition-all duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="text-xs px-3 py-1.5 rounded-full font-medium"
          style={{
            backgroundColor: dark ? "rgba(255,255,255,0.08)" : "rgba(22,22,22,0.08)",
            color: dark ? "rgba(255,255,255,0.4)" : "rgba(22,22,22,0.4)",
          }}
        >
          <i className={`${dark ? "ri-moon-fill" : "ri-sun-fill"} ml-1`}></i>
          {dark ? "الوضع الداكن" : "الوضع الفاتح"}
        </div>
      </div>
    </div>
  );
}

export default function WebsitePage() {
  return (
    <DarkModeProvider>
      <WebsiteContent />
    </DarkModeProvider>
  );
}
