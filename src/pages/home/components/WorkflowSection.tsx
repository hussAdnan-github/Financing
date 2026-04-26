const stages = [
  { num: 1, title: "طلب جديد", desc: "صورة الهوية — البيانات المالية — تفاصيل الكفيل", color: "bg-brand-50 text-brand-700 border-brand-200" },
  { num: 2, title: "تحت الدراسة", desc: "حسبة التمويل — عرض السعر", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { num: 3, title: "بانتظار موافقة العميل", desc: "حسبة التمويل — عرض السعر", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { num: 4, title: "مراجعة نهائية", desc: "حسبة التمويل — عرض السعر", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { num: 5, title: "توقيع العقود", desc: "العقود الرسمية", color: "bg-teal-100 text-teal-700 border-teal-200" },
  { num: 6, title: "تنفيذ المدفوعات", desc: "المدفوعات — تحديث السجل الائتماني", color: "bg-green-100 text-green-700 border-green-200" },
  { num: 7, title: "التحصيل", desc: "المدفوعات — تحديث السجل — التحصيل", color: "bg-brand-100 text-brand-700 border-brand-200" },
  { num: 8, title: "الأرشفة", desc: "كافة المرفقات + ملاحظات + فلترة", color: "bg-stone-100 text-stone-700 border-stone-200" }
];

export default function WorkflowSection() {
  return (
    <section id="workflow" className="py-20 bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <i className="ri-flow-chart"></i>
            مسار العمل المتسلسل
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4" style={{fontFamily:"'Tajawal', sans-serif"}}>
            ٨ مراحل واضحة لكل ملف
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            كل ملف يسير عبر مراحل متسلسلة ومضبوطة، تتحكم فيها المرفقات والبيانات الظاهرة في كل مرحلة
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stages.map((stage) => (
            <div
              key={stage.num}
              className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4"
            >
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl border text-sm font-black flex-shrink-0 ${stage.color}`} style={{fontFamily:"'Cairo', sans-serif"}}>
                {stage.num}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1" style={{fontFamily:"'Tajawal', sans-serif"}}>
                  {stage.title}
                </h4>
                <p className="text-gray-500 text-xs leading-relaxed">{stage.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
