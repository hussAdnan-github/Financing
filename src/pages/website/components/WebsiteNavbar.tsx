import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDarkModeContext } from "../context/DarkModeContext";

const navLinks = [
  { label: "من نحن", href: "/about", isExternal: true },
  { label: "خدماتنا", href: "#services", isExternal: false },
  { label: "مقارنة الخدمات", href: "#comparison", isExternal: false },
  { label: "كيف نعمل", href: "#process", isExternal: false },
  { label: "الأسئلة الشائعة", href: "#faq", isExternal: false },
  { label: "تواصل معنا", href: "#contact", isExternal: false },
];

export default function WebsiteNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { dark, toggle } = useDarkModeContext();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBg = scrolled
    ? dark
      ? "#161616"
      : "#ffffff"
    : "transparent";

  const textColor = scrolled && !dark ? "#161616" : "rgba(255,255,255,0.85)";
  const textHover = scrolled && !dark ? "#161616" : "#ffffff";
  const hoverBg = scrolled && !dark ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.1)";

  return (
    <nav
      className="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: navBg,
        boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.15)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <img
            src="https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/3fa99e41-3181-42f3-b65d-33c71c7fce19_-02.png?v=dd9a6d7162ba41ac3085905187c795fd"
            alt="الشعار"
            className="h-36 w-auto object-contain transition-all duration-300"
            style={{ filter: scrolled && !dark ? "invert(1) brightness(0)" : "none" }}
          />
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) =>
            link.isExternal ? (
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
            ) : (
              <a
                key={link.href}
                href={link.href}
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
              </a>
            )
          )}
        </div>

        {/* CTA + Dark Mode */}
        <div className="hidden md:flex items-center gap-3">
          {/* Dark mode toggle */}
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

          <a
            href="#contact"
            className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap cursor-pointer text-[#161616] hover:opacity-90"
            style={{ backgroundColor: "#FF6039" }}
          >
            ابدأ الآن
          </a>
          <Link
            to="/dashboard"
            className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer border"
            style={{
              borderColor: scrolled && !dark ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.2)",
              color: scrolled && !dark ? "#161616" : "rgba(255,255,255,0.8)",
            }}
          >
            <i className="ri-dashboard-line ml-1.5"></i>
            لوحة التحكم
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer"
          style={{ color: scrolled && !dark ? "#161616" : "white" }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={`text-xl ${menuOpen ? "ri-close-line" : "ri-menu-3-line"}`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t px-4 pb-4"
          style={{
            backgroundColor: dark ? "#161616" : "#ffffff",
            borderColor: "rgba(255,96,57,0.2)",
          }}
        >
          {navLinks.map((link) =>
            link.isExternal ? (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                style={{ color: dark ? "rgba(255,255,255,0.8)" : "#161616" }}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                style={{ color: dark ? "rgba(255,255,255,0.8)" : "#161616" }}
              >
                {link.label}
              </a>
            )
          )}
          <div className="flex items-center gap-3 mt-2">
            <a
              href="#contact"
              className="flex-1 block px-4 py-3 text-center text-[#161616] font-bold rounded-lg text-sm cursor-pointer"
              style={{ backgroundColor: "#FF6039" }}
            >
              ابدأ الآن
            </a>
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
