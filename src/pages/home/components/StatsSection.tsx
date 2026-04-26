import { stats } from "@/mocks/landingData";

export default function StatsSection() {
  return (
    <section className="relative bg-brand-600 py-14 overflow-hidden">
      {/* Pattern Background */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: "url('https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/04764a59-afee-476b-ac3c-f34c711f7334_Artboard-2.png?v=33456a03348b5a87fd5047387c68671a')",
          backgroundSize: "360px auto",
          backgroundRepeat: "repeat",
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6" dir="rtl">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-2xl mb-3">
                <i className={`${stat.icon} text-2xl text-white`}></i>
              </div>
              <div className="text-3xl md:text-4xl font-black text-white mb-1" style={{fontFamily:"'Cairo', sans-serif"}}>
                {stat.value}
              </div>
              <div className="text-brand-100 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
