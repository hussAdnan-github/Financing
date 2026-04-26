import { services } from "@/mocks/landingData";

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <i className="ri-service-line"></i>
            خدماتنا المالية
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4" style={{fontFamily:"'Tajawal', sans-serif"}}>
            حلول تمويلية متكاملة
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            نقدم طيفاً واسعاً من الخدمات المالية المصممة لتلبية احتياجاتك في كل مرحلة من مراحل حياتك
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="group rounded-2xl border border-gray-100 bg-white p-6 hover:border-brand-100 transition-all duration-300 cursor-pointer"
            >
              <div className={`w-16 h-16 flex items-center justify-center rounded-2xl ${service.bg} mb-5`}>
                <i className={`${service.icon} text-2xl text-brand-500`}></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2" style={{fontFamily:"'Tajawal', sans-serif"}}>
                {service.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-check-line text-brand-500 text-base"></i>
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t border-gray-50">
                <a href="#register" className="inline-flex items-center gap-1 text-brand-600 text-sm font-semibold hover:gap-2 transition-all cursor-pointer">
                  تقدم بطلب
                  <i className="ri-arrow-left-line text-xs"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
