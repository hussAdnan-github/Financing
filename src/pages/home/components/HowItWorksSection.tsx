const steps = [
  {
    step: "01",
    icon: "ri-file-text-line",
    title: "أرسل طلبك",
    desc: "املأ نموذج التسجيل بمعلوماتك الأساسية في أقل من 3 دقائق"
  },
  {
    step: "02",
    icon: "ri-phone-line",
    title: "يتواصل معك فريقنا",
    desc: "سيتصل بك أحد مستشارينا خلال ساعات عمل ليكمل معك البيانات المطلوبة"
  },
  {
    step: "03",
    icon: "ri-search-eye-line",
    title: "مراجعة ودراسة الطلب",
    desc: "نقوم بدراسة وضعك المالي وتقديم أنسب عرض تمويلي يناسبك"
  },
  {
    step: "04",
    icon: "ri-file-shield-2-line",
    title: "توقيع العقود",
    desc: "بعد موافقتك على العرض يتم استيفاء الأوراق وتوقيع العقود رسمياً"
  },
  {
    step: "05",
    icon: "ri-bank-card-line",
    title: "صرف التمويل",
    desc: "يُحوَّل المبلغ إلى حسابك أو يُسدَّد مباشرة للجهة المعنية في أسرع وقت"
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <i className="ri-route-line"></i>
            مسار العمل
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4" style={{fontFamily:"'Tajawal', sans-serif"}}>
            كيف يسير ملفك؟
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            نظام واضح ومتسلسل يضمن لك تجربة سلسة من أول لحظة حتى صرف التمويل
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-10 right-16 left-16 h-0.5 bg-gradient-to-l from-brand-200 via-brand-400 to-brand-200"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div className="w-20 h-20 flex items-center justify-center bg-white border-2 border-brand-200 rounded-2xl z-10 relative">
                    <i className={`${step.icon} text-2xl text-brand-500`}></i>
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-brand-500 text-white text-xs font-black rounded-full flex items-center justify-center" style={{fontFamily:"'Cairo', sans-serif"}}>
                    {i + 1}
                  </span>
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-2" style={{fontFamily:"'Tajawal', sans-serif"}}>
                  {step.title}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
