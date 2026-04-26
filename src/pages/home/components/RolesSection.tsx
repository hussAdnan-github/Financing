const roles = [
  {
    icon: "ri-user-line",
    title: "الموظف",
    color: "bg-brand-50 text-brand-600",
    border: "border-brand-100",
    responsibilities: [
      "استقبال العملاء المسنَدين",
      "التواصل عبر واتساب",
      "استكمال البيانات والمرفقات",
      "رفع الملف للمراجعة"
    ]
  },
  {
    icon: "ri-user-settings-line",
    title: "المشرف",
    color: "bg-amber-50 text-amber-700",
    border: "border-amber-100",
    responsibilities: [
      "توزيع العملاء على الموظفين",
      "مراجعة اكتمال البيانات",
      "قبول أو رفض مع ذكر السبب",
      "رفع الملف للاعتماد"
    ]
  },
  {
    icon: "ri-spy-line",
    title: "المدقق",
    color: "bg-stone-100 text-stone-700",
    border: "border-stone-200",
    responsibilities: [
      "مراجعة الوثائق والبيانات",
      "قبول أو ردّ مع بيان النواقص",
      "صلاحيات محصورة بالمراجعة"
    ]
  },
  {
    icon: "ri-vip-crown-line",
    title: "المدير",
    color: "bg-brand-500 text-white",
    border: "border-brand-200",
    responsibilities: [
      "اعتماد الملفات أو رفضها",
      "الاطلاع على التقارير الشاملة",
      "اختيار المنفذ",
      "التحكم في الإعدادات الحساسة"
    ]
  }
];

export default function RolesSection() {
  return (
    <section id="roles" className="py-20 bg-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <i className="ri-team-line"></i>
            الأدوار والصلاحيات
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4" style={{fontFamily:"'Tajawal', sans-serif"}}>
            فريق عمل منظّم بصلاحيات واضحة
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            كل دور له مسؤولياته وصلاحياته المحددة لضمان دقة العمل وسرعة اتخاذ القرار
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {roles.map((role, i) => (
            <div key={i} className={`rounded-2xl border ${role.border} p-6`}>
              <div className={`w-14 h-14 flex items-center justify-center rounded-2xl ${role.color} mb-4`}>
                <i className={`${role.icon} text-2xl`}></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3" style={{fontFamily:"'Tajawal', sans-serif"}}>
                {role.title}
              </h3>
              <ul className="space-y-2">
                {role.responsibilities.map((r, ri) => (
                  <li key={ri} className="flex items-start gap-2 text-sm text-gray-600">
                    <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="ri-arrow-left-s-line text-brand-400 text-sm"></i>
                    </div>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
