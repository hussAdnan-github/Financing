import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "نظرة عامة", href: "#overview" },
  { label: "خدماتنا", href: "#services" },
  { label: "كيف يعمل؟", href: "#how-it-works" },
  { label: "التقييمات", href: "#testimonials" },
  { label: "سجّل الآن", href: "#register" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <img
            src={scrolled
              ? "https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/820133cd-4a0c-452f-b662-b06701724b7d_-01.png?v=b2bfc75afceae2a1fe14bb1170d72133"
              : "https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/3fa99e41-3181-42f3-b65d-33c71c7fce19_-02.png?v=dd9a6d7162ba41ac3085905187c795fd"
            }
            alt="شعار الشركة"
            className="h-12 w-auto object-contain"
          />
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1" dir="rtl">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                scrolled
                  ? "text-gray-700 hover:text-brand-600 hover:bg-brand-50"
                  : "text-white/90 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Dashboard Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/dashboard"
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              scrolled
                ? "bg-brand-500 text-white hover:bg-brand-600"
                : "bg-white/15 text-white border border-white/30 hover:bg-white/25"
            }`}
          >
            <i className="ri-dashboard-line ml-1.5"></i>
            لوحة التحكم
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className={`md:hidden w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer ${
            scrolled ? "text-gray-700" : "text-white"
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={`text-xl ${menuOpen ? "ri-close-line" : "ri-menu-3-line"}`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg px-4 pb-4" dir="rtl">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-gray-700 hover:text-brand-600 hover:bg-brand-50 rounded-lg text-sm font-medium cursor-pointer"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/dashboard"
            className="block mt-2 px-4 py-3 bg-brand-500 text-white rounded-lg text-sm font-semibold text-center cursor-pointer"
          >
            لوحة التحكم
          </Link>
        </div>
      )}
    </nav>
  );
}
