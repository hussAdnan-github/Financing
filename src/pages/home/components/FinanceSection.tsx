const financeItems = [
  { icon: "ri-hand-coin-line", title: "قيمة الاتفاق", desc: "المبلغ الإجمالي المتفق عليه مع العميل", color: "bg-brand-50 text-brand-600" },
  { icon: "ri-receipt-line", title: "المصروفات", desc: "تُسجَّل كبنود تفصيلية أو مبلغ إجمالي مع دعم المرفقات", color: "bg-amber-50 text-amber-700" },
  { icon: "ri-money-dollar-circle-line", title: "المدفوعات", desc: "كل دفعة بمبلغها وتاريخها وطريقة سدادها", color: "bg-brand-100 text-brand-700" },
  { icon: "ri-calculator-line", title: "المتبقي", desc: "يُحسب تلقائياً: قيمة الاتفاق − إجمالي المدفوع", color: "bg-orange-50 text-orange-700" },
  { icon: "ri-bar-chart-box-line", title: "الربح", desc: "يُحسب تلقائياً: قيمة الاتفاق − المصروفات", color: "bg-stone-100 text-stone-700" },
  { icon: "ri-calendar-schedule-line", title: "فترة السداد", desc: "نص واضح أو جدول استحقاقات تفصيلي", color: "bg-teal-50 text-teal-700" }
];

export default function FinanceSection() {
  return (
    <section id="finance" className="py-20 bg-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Image */}
          <div className="lg:w-5/12 w-full">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="https://readdy.ai/api/search-image?query=modern%20financial%20dashboard%20interface%20on%20laptop%20screen%20showing%20charts%20graphs%20revenue%20analytics%20minimalist%20clean%20design%20light%20background%20professional%20business&width=700&height=500&seq=fin1&orientation=landscape"
                alt="الإدارة المالية"
                className="w-full h-72 md:h-96 object-cover object-top rounded-2xl"
              />
              {/* Floating card */}
              <div className="absolute bottom-4 right-4 bg-white rounded-xl p-4 border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">إجمالي الأرباح</div>
                <div className="text-2xl font-black text-brand-500" style={{fontFamily:"'Cairo', sans-serif"}}>+2.4M ريال</div>
                <div className="flex items-center gap-1 text-xs text-brand-500 mt-1">
                  <div className="w-3 h-3 flex items-center justify-center"><i className="ri-arrow-up-s-line text-xs"></i></div>
                  <span>+18% عن الشهر الماضي</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:w-7/12">
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 text-sm font-semibold px-4 py-2 rounded-full mb-5">
              <i className="ri-wallet-3-line"></i>
              الإدارة المالية
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4" style={{fontFamily:"'Tajawal', sans-serif"}}>
              كل الأرقام في مكان واحد
            </h2>
            <p className="text-gray-500 text-base mb-8 leading-relaxed">
              كل ملف يحتوي على قسم مالي متكامل يحسب تلقائياً الأرباح والمصروفات والمتبقيات — بدون أخطاء، بدون تعقيدات.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {financeItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 ${item.color}`}>
                    <i className={`${item.icon} text-lg`}></i>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm mb-0.5">{item.title}</div>
                    <div className="text-gray-500 text-xs leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
