// ─── Static Data — قوائم البيانات الثابتة ────────────────────────────────────
// هذه البيانات تُستخدم في قوائم الاختيار عند تعبئة ملفات العملاء

export interface StaticItem {
  id: string;
  label: string;
  active: boolean;
  order: number;
}

export interface StaticCategory {
  key: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  items: StaticItem[];
}

export const defaultStaticData: StaticCategory[] = [
  {
    key: "banks",
    title: "البنوك",
    icon: "ri-bank-line",
    description: "أسماء البنوك المعتمدة لتحويل الراتب والتمويل",
    color: "text-sky-600",
    items: [
      { id: "b1", label: "بنك الراجحي", active: true, order: 1 },
      { id: "b2", label: "البنك الأهلي السعودي", active: true, order: 2 },
      { id: "b3", label: "بنك الرياض", active: true, order: 3 },
      { id: "b4", label: "بنك الجزيرة", active: true, order: 4 },
      { id: "b5", label: "البنك السعودي الفرنسي", active: true, order: 5 },
      { id: "b6", label: "بنك البلاد", active: true, order: 6 },
      { id: "b7", label: "بنك الإنماء", active: true, order: 7 },
      { id: "b8", label: "البنك العربي الوطني", active: true, order: 8 },
      { id: "b9", label: "بنك ساب", active: true, order: 9 },
      { id: "b10", label: "مصرف الراجحي للاستثمار", active: false, order: 10 },
      { id: "b11", label: "بنك الخليج الدولي", active: true, order: 11 },
      { id: "b12", label: "بنك الاستثمار السعودي", active: false, order: 12 },
    ],
  },
  {
    key: "serviceTypes",
    title: "أنواع الخدمات",
    icon: "ri-service-line",
    description: "أنواع منتجات التمويل المقدمة للعملاء",
    color: "text-teal-600",
    items: [
      { id: "s1", label: "قرض شخصي", active: true, order: 1 },
      { id: "s2", label: "تمويل عقاري", active: true, order: 2 },
      { id: "s3", label: "تمويل مركبات", active: true, order: 3 },
      { id: "s4", label: "إعادة تمويل", active: true, order: 4 },
      { id: "s5", label: "تمويل تجاري", active: true, order: 5 },
      { id: "s6", label: "قرض حسن", active: false, order: 6 },
    ],
  },
  {
    key: "employerTypes",
    title: "أنواع جهات العمل",
    icon: "ri-building-line",
    description: "تصنيفات جهات عمل العملاء",
    color: "text-amber-600",
    items: [
      { id: "e1", label: "مدني", active: true, order: 1 },
      { id: "e2", label: "عسكري", active: true, order: 2 },
      { id: "e3", label: "شبه حكومي", active: true, order: 3 },
      { id: "e4", label: "قطاع خاص", active: true, order: 4 },
      { id: "e5", label: "متقاعد", active: true, order: 5 },
      { id: "e6", label: "عمل حر", active: false, order: 6 },
    ],
  },
  {
    key: "cities",
    title: "المدن",
    icon: "ri-map-pin-line",
    description: "المدن المتاحة لتسجيل العملاء",
    color: "text-rose-600",
    items: [
      { id: "c1", label: "الرياض", active: true, order: 1 },
      { id: "c2", label: "جدة", active: true, order: 2 },
      { id: "c3", label: "الدمام", active: true, order: 3 },
      { id: "c4", label: "مكة المكرمة", active: true, order: 4 },
      { id: "c5", label: "المدينة المنورة", active: true, order: 5 },
      { id: "c6", label: "الطائف", active: true, order: 6 },
      { id: "c7", label: "أبها", active: true, order: 7 },
      { id: "c8", label: "تبوك", active: true, order: 8 },
      { id: "c9", label: "بريدة", active: true, order: 9 },
      { id: "c10", label: "خميس مشيط", active: false, order: 10 },
      { id: "c11", label: "حائل", active: false, order: 11 },
      { id: "c12", label: "نجران", active: false, order: 12 },
    ],
  },
  {
    key: "sources",
    title: "مصادر الطلبات",
    icon: "ri-share-line",
    description: "قنوات التسويق ومصادر وصول العملاء",
    color: "text-indigo-600",
    items: [
      { id: "src1", label: "حملة إنستغرام", active: true, order: 1 },
      { id: "src2", label: "حملة جوجل", active: true, order: 2 },
      { id: "src3", label: "حملة تويتر", active: true, order: 3 },
      { id: "src4", label: "إحالة مباشرة", active: true, order: 4 },
      { id: "src5", label: "حملة سناب شات", active: true, order: 5 },
      { id: "src6", label: "الموقع الإلكتروني", active: true, order: 6 },
      { id: "src7", label: "تيك توك", active: false, order: 7 },
      { id: "src8", label: "واتساب", active: false, order: 8 },
    ],
  },
  {
    key: "rejectionReasons",
    title: "أسباب الرفض",
    icon: "ri-close-circle-line",
    description: "الأسباب المعتمدة لرفض ملفات العملاء",
    color: "text-red-600",
    items: [
      { id: "r1", label: "السجل الائتماني ضعيف", active: true, order: 1 },
      { id: "r2", label: "نقص في المستندات", active: true, order: 2 },
      { id: "r3", label: "الراتب لا يكفي", active: true, order: 3 },
      { id: "r4", label: "عدم استيفاء الشروط", active: true, order: 4 },
      { id: "r5", label: "طلب العميل الإلغاء", active: true, order: 5 },
      { id: "r6", label: "وجود التزامات مالية عالية", active: true, order: 6 },
      { id: "r7", label: "عدم انتظام الراتب", active: false, order: 7 },
    ],
  },
  {
    key: "contractTypes",
    title: "أنواع العقود",
    icon: "ri-file-text-line",
    description: "أنواع الوثائق والعقود المطلوبة في مرحلة التوقيع",
    color: "text-green-600",
    items: [
      { id: "ct1", label: "عرض قرض حسن", active: true, order: 1 },
      { id: "ct2", label: "مخالصة", active: true, order: 2 },
      { id: "ct3", label: "سند لأمر", active: true, order: 3 },
      { id: "ct4", label: "سند قبض", active: true, order: 4 },
      { id: "ct5", label: "سند استلام", active: true, order: 5 },
      { id: "ct6", label: "عقد التمويل", active: true, order: 6 },
      { id: "ct7", label: "وثيقة التأمين", active: false, order: 7 },
    ],
  },
];
