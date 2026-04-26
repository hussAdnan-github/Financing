import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const PATTERN_URL =
  "https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/04764a59-afee-476b-ac3c-f34c711f7334_Artboard-2.png?v=33456a03348b5a87fd5047387c68671a";

const stats = [
  { value: "+15,000", label: "عميل راضٍ", icon: "ri-user-smile-line", desc: "في مختلف مناطق المملكة" },
  { value: "98%", label: "نسبة الرضا", icon: "ri-thumb-up-line", desc: "وفق استطلاعات العملاء" },
  { value: "+500M", label: "ريال ممول", icon: "ri-money-dollar-circle-line", desc: "إجمالي التمويلات المنجزة" },
  { value: "24h", label: "وقت الموافقة", icon: "ri-time-line", desc: "متوسط وقت الرد على الطلبات" },
];

export default function WebsiteStats() {
  const { ref, visible } = useScrollAnimation(0.1);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-20 overflow-hidden"
      style={{ backgroundColor: "#FF6039" }}
    >
      {/* Pattern */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `url('${PATTERN_URL}')`,
          backgroundSize: "300px auto",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`text-center transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div
                className="w-14 h-14 flex items-center justify-center rounded-2xl mx-auto mb-4 transition-transform hover:scale-110"
                style={{ backgroundColor: "rgba(22,22,22,0.15)" }}
              >
                <i className={`${s.icon} text-2xl text-[#161616]`}></i>
              </div>
              <div
                className="text-4xl md:text-5xl font-black text-[#161616] mb-1"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                {s.value}
              </div>
              <div className="text-[#161616] font-bold text-base mb-1">{s.label}</div>
              <div className="text-[#161616]/60 text-xs">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
