export const services = [
  {
    id: 1,
    icon: "ri-bank-line",
    title: "قروض شخصية",
    description: "حلول تمويلية مرنة تناسب احتياجاتك الشخصية بأفضل الشروط",
    features: ["موافقة سريعة خلال 24 ساعة", "نسب ربح تنافسية", "فترات سداد مرنة"],
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50"
  },
  {
    id: 2,
    icon: "ri-home-4-line",
    title: "تمويل عقاري",
    description: "حقق حلمك في امتلاك منزلك بتمويل عقاري ميسّر وشروط واضحة",
    features: ["تمويل يصل إلى 90%", "مدة تصل إلى 25 سنة", "بدون رسوم خفية"],
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50"
  },
  {
    id: 3,
    icon: "ri-car-line",
    title: "تمويل المركبات",
    description: "احصل على سيارتك المفضلة بتمويل سهل وإجراءات مبسطة",
    features: ["صفر مقدم لبعض الموديلات", "تغطية شاملة للتأمين", "خدمة توصيل المركبة"],
    color: "from-sky-500 to-cyan-600",
    bg: "bg-sky-50"
  },
  {
    id: 4,
    icon: "ri-briefcase-line",
    title: "تمويل الأعمال",
    description: "ادعم نمو مشروعك بحلول تمويلية مصممة خصيصاً للشركات الصغيرة والمتوسطة",
    features: ["تمويل يبدأ من 50,000 ريال", "مرونة في السداد", "استشارة مجانية"],
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50"
  },
  {
    id: 5,
    icon: "ri-refresh-line",
    title: "إعادة التمويل",
    description: "أعد جدولة التزاماتك المالية للحصول على شروط أفضل وراتب أخف",
    features: ["تخفيض القسط الشهري", "دمج الالتزامات المتعددة", "فترة إجازة من الأقساط"],
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-50"
  },
  {
    id: 6,
    icon: "ri-shield-check-line",
    title: "خدمات التأمين",
    description: "حماية شاملة لك ولأصولك بمنتجات تأمينية متنوعة ومعتمدة",
    features: ["تأمين على الحياة", "تأمين ضد الحوادث", "تسوية سريعة للمطالبات"],
    color: "from-teal-500 to-green-600",
    bg: "bg-teal-50"
  }
];

export const stats = [
  { value: "+15,000", label: "عميل راضٍ", icon: "ri-user-smile-line" },
  { value: "98%", label: "نسبة الرضا", icon: "ri-thumb-up-line" },
  { value: "+500M", label: "ريال ممول", icon: "ri-money-dollar-circle-line" },
  { value: "24h", label: "متوسط وقت الموافقة", icon: "ri-time-line" }
];

export const saudiBanks = [
  "بنك الراجحي", "البنك الأهلي السعودي", "بنك الرياض", "بنك البلاد",
  "بنك الجزيرة", "بنك سامبا", "البنك السعودي الفرنسي", "البنك السعودي للاستثمار",
  "بنك الإنماء", "البنك العربي الوطني", "بنك الخليج الدولي", "بنك عوده"
];

export const employerTypes = [
  { value: "civil", label: "مدني" },
  { value: "military", label: "عسكري" },
  { value: "semi_gov", label: "شبه حكومي" },
  { value: "private", label: "قطاع خاص" },
  { value: "retired", label: "متقاعد" }
];

export const serviceTypes = [
  "سداد متعثرات",
  "استخراج تمويل شخصي",
  "تمويل ناجيري",
  "تمويل عقاري",
  "فك رهن"
];

// Landing page form configuration stored in localStorage key: "landingFormConfig"
export type LandingFieldType =
  | "text"
  | "tel"
  | "email"
  | "number"
  | "date"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "checkbox_group"
  | "whatsapp"
  | "file";

export interface LandingFormField {
  id: string;
  key: string;
  label: string;
  type: LandingFieldType;
  required: boolean;
  enabled: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
  order: number;
}

export interface LandingBranding {
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  textColor: string;
  buttonText: string;
  formTitle: string;
  formSubtitle: string;
}

export const defaultLandingBranding: LandingBranding = {
  logoUrl: "",
  primaryColor: "#FF6039",
  secondaryColor: "#FF8C69",
  bgColor: "#F9FAFB",
  textColor: "#111827",
  buttonText: "أرسل طلبك الآن",
  formTitle: "نموذج التسجيل",
  formSubtitle: "أرسل بياناتك وسيتواصل معك أحد مستشارينا في أقرب وقت",
};

export const defaultLandingFormFields: LandingFormField[] = [
  { id: "f1", key: "name", label: "الاسم", type: "text", required: true, enabled: true, placeholder: "أدخل اسمك الكامل", order: 1 },
  { id: "f2", key: "phone", label: "رقم الجوال", type: "tel", required: true, enabled: true, placeholder: "05xxxxxxxx", order: 2 },
  { id: "f3", key: "city", label: "المدينة", type: "select", required: true, enabled: true, options: ["الرياض","جدة","مكة المكرمة","المدينة المنورة","الدمام","الخبر","الطائف","أبها","تبوك","نجران","حائل","القصيم","جازان"], order: 3 },
  { id: "f4", key: "employer_type", label: "جهة العمل", type: "select", required: true, enabled: true, options: ["مدني","عسكري","شبه حكومي","قطاع خاص","متقاعد"], order: 4 },
  { id: "f5", key: "employer_name", label: "اسم جهة العمل", type: "text", required: false, enabled: true, placeholder: "مثال: وزارة التعليم، أرامكو...", order: 5 },
  { id: "f6", key: "service_type", label: "نوع الخدمة", type: "select", required: true, enabled: true, options: ["سداد متعثرات","استخراج تمويل شخصي","تمويل ناجيري","تمويل عقاري","فك رهن"], order: 6 },
  { id: "f7", key: "whatsapp", label: "رابط واتساب (تواصل)", type: "whatsapp", required: false, enabled: true, placeholder: "05xxxxxxxx", order: 7 },
  { id: "f8", key: "privacy_consent", label: "الموافقة على التواصل عبر واتساب", type: "checkbox", required: true, enabled: true, order: 8 },
];

export const testimonials = [
  {
    name: "أحمد الغامدي",
    role: "مهندس - القطاع الحكومي",
    text: "تجربة رائعة من البداية للنهاية. الفريق محترف والإجراءات سريعة وشفافة. حصلت على موافقة القرض في أقل من 48 ساعة.",
    avatar: "https://readdy.ai/api/search-image?query=professional%20Saudi%20Arab%20man%20portrait%20headshot%20smiling%20business%20casual%20attire%20neutral%20background&width=80&height=80&seq=t1&orientation=squarish",
    rating: 5
  },
  {
    name: "منى الشهري",
    role: "معلمة - وزارة التعليم",
    text: "كنت قلقة من التعقيدات البيروقراطية لكن الفريق أرشدني خطوة بخطوة. الآن أملك منزلي وأنا في غاية السعادة.",
    avatar: "https://readdy.ai/api/search-image?query=professional%20Saudi%20Arab%20woman%20portrait%20headshot%20smiling%20business%20attire%20neutral%20background&width=80&height=80&seq=t2&orientation=squarish",
    rating: 5
  },
  {
    name: "خالد العتيبي",
    role: "ضابط - القوات المسلحة",
    text: "خدمة ممتازة وتعامل راقي. قدموا لي أفضل عرض تمويلي وكانوا صادقين في كل التفاصيل. أنصح بهم بشدة.",
    avatar: "https://readdy.ai/api/search-image?query=professional%20Arab%20man%20portrait%20military%20background%20smiling%20confident%20neutral&width=80&height=80&seq=t3&orientation=squarish",
    rating: 5
  }
];
