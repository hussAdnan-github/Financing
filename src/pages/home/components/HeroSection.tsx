export default function HeroSection() {
  return (
    <section
      id="overview"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=modern%20Saudi%20Arabian%20financial%20office%20interior%20with%20tall%20glass%20windows%20city%20skyline%20view%20elegant%20desk%20marble%20floor%20professional%20business%20environment%20warm%20sophisticated%20lighting&width=1440&height=900&seq=hero1&orientation=landscape"
          alt="خلفية"
          className="w-full h-full object-cover object-top"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/75 via-black/55 to-black/40"></div>

        {/* Pattern Overlay — Artboard 1 */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/e2774022-76a7-49e8-916b-72f32e1e2c0c_Artboard-1.png?v=ad08040ef9ec013ea405455f2fc72042')",
            backgroundSize: "420px auto",
            backgroundRepeat: "repeat",
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-32 text-right" dir="rtl">
        <div className="max-w-2xl">
          {/* Logo badge */}
          <div className="mb-8">
            <img
              src="https://storage.readdy-site.link/project_files/a3385325-dc38-4414-8435-8299a91285e3/3fa99e41-3181-42f3-b65d-33c71c7fce19_-02.png?v=dd9a6d7162ba41ac3085905187c795fd"
              alt="الشعار"
              className="h-16 w-auto object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full mb-6">
            <i className="ri-verified-badge-line text-brand-200"></i>
            <span>معتمد من مؤسسة النقد العربي السعودي</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6" style={{fontFamily:"'Tajawal', sans-serif"}}>
            حلول تمويلية
            <br />
            <span className="text-brand-300">تناسب طموحك</span>
          </h1>

          <p className="text-lg md:text-xl text-white/85 mb-8 leading-relaxed" style={{fontFamily:"'Tajawal', sans-serif"}}>
            نقدم لك أفضل خيارات التمويل الشخصي والعقاري والتجاري بإجراءات مبسطة وموافقة سريعة —
            فريقنا معك في كل خطوة حتى تصل لهدفك.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#register"
              className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              <span>ابدأ طلبك الآن</span>
              <i className="ri-arrow-left-line"></i>
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 bg-white/15 border border-white/30 backdrop-blur-sm text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all hover:bg-white/25 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-play-circle-line"></i>
              <span>تعرف على خدماتنا</span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
        <span className="text-xs">اسحب للأسفل</span>
        <div className="w-5 h-8 border-2 border-white/40 rounded-full flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}
