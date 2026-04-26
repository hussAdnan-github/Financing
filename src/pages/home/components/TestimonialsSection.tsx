import { testimonials } from "@/mocks/landingData";

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <i className="ri-star-line"></i>
            آراء عملائنا
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4" style={{fontFamily:"'Tajawal', sans-serif"}}>
            ماذا يقول عملاؤنا؟
          </h2>
          <p className="text-gray-500 text-lg">
            آلاف العملاء وثقوا بنا وحققوا أهدافهم المالية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({length: t.rating}).map((_, s) => (
                  <div key={s} className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-star-fill text-amber-400 text-base"></i>
                  </div>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover object-top flex-shrink-0"
                />
                <div>
                  <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-gray-500 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
