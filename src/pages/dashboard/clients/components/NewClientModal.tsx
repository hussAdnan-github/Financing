import { useState, useEffect } from "react";
import type { Client, ClientStage } from "@/mocks/dashboardData";

interface NewClientModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (client: Client) => void;
}

const cities = [
  "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام",
  "الخبر", "الطائف", "أبها", "تبوك", "نجران", "حائل", "القصيم", "جازان",
];

const employerTypes = ["مدني", "عسكري", "شبه حكومي", "قطاع خاص", "متقاعد"];

const serviceTypes = [
  "قرض شخصي", "تمويل عقاري", "تمويل مركبات",
  "تمويل الأعمال", "إعادة تمويل", "سداد متعثرات",
];

const salaryBanks = [
  "بنك الراجحي", "البنك الأهلي السعودي", "بنك الرياض",
  "بنك الجزيرة", "البنك السعودي الفرنسي", "بنك البلاد",
  "بنك الإنماء", "البنك العربي الوطني", "بنك ساب",
];

const sources = [
  "حملة إنستغرام", "حملة جوجل", "حملة تويتر",
  "إحالة مباشرة", "واتساب", "الموقع الإلكتروني", "أخرى",
];

const steps = ["البيانات الأساسية", "بيانات العمل", "الخدمة المطلوبة", "مراجعة وتأكيد"];

function generateId(): string {
  const num = Math.floor(Math.random() * 900) + 100;
  return `CLT-${num}`;
}

export default function NewClientModal({ open, onClose, onAdd }: NewClientModalProps) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    whatsapp: "",
    city: "",
    nationalIdNumber: "",
    // Step 2
    employerType: "",
    employerName: "",
    salaryAmount: "",
    salaryDate: "",
    salaryTransfer: true,
    salaryBank: "",
    joinDate: "",
    // Step 3
    serviceType: "",
    source: "",
    notes: "",
    hasGuarantor: false,
    guarantorName: "",
    guarantorPhone: "",
    guarantorRelation: "",
  });

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep(0);
      setErrors({});
      setForm({
        fullName: "", phone: "", whatsapp: "", city: "", nationalIdNumber: "",
        employerType: "", employerName: "", salaryAmount: "", salaryDate: "",
        salaryTransfer: true, salaryBank: "", joinDate: "",
        serviceType: "", source: "", notes: "", hasGuarantor: false,
        guarantorName: "", guarantorPhone: "", guarantorRelation: "",
      });
    }
  }, [open]);

  const set = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validateStep = (s: number): boolean => {
    const errs: Record<string, string> = {};
    if (s === 0) {
      if (!form.fullName.trim()) errs.fullName = "الاسم مطلوب";
      if (!form.phone.trim()) errs.phone = "رقم الجوال مطلوب";
      else if (!/^05\d{8}$/.test(form.phone)) errs.phone = "رقم غير صحيح (05xxxxxxxx)";
      if (!form.city) errs.city = "المدينة مطلوبة";
    }
    if (s === 1) {
      if (!form.employerType) errs.employerType = "جهة العمل مطلوبة";
      if (!form.employerName.trim()) errs.employerName = "اسم جهة العمل مطلوب";
      if (!form.salaryAmount || isNaN(Number(form.salaryAmount))) errs.salaryAmount = "الراتب مطلوب";
      if (form.salaryTransfer && !form.salaryBank) errs.salaryBank = "بنك التحويل مطلوب";
    }
    if (s === 2) {
      if (!form.serviceType) errs.serviceType = "نوع الخدمة مطلوب";
      if (!form.source) errs.source = "مصدر العميل مطلوب";
      if (form.hasGuarantor) {
        if (!form.guarantorName.trim()) errs.guarantorName = "اسم الكفيل مطلوب";
        if (!form.guarantorPhone.trim()) errs.guarantorPhone = "جوال الكفيل مطلوب";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => s + 1);
  };

  const prev = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleSubmit = () => {
    if (!validateStep(2)) return;
    const now = new Date().toISOString();
    const newClient: Client = {
      id: generateId(),
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      whatsapp: form.whatsapp.trim() || undefined,
      city: form.city,
      employerType: form.employerType,
      employerName: form.employerName.trim(),
      serviceType: form.serviceType,
      salaryTransfer: form.salaryTransfer,
      salaryBank: form.salaryTransfer ? form.salaryBank : undefined,
      salaryAmount: form.salaryAmount ? Number(form.salaryAmount) : undefined,
      salaryDate: form.salaryDate || undefined,
      joinDate: form.joinDate || undefined,
      nationalIdNumber: form.nationalIdNumber || undefined,
      privacyConsent: true,
      submittedAt: now,
      source: form.source,
      hasGuarantor: form.hasGuarantor,
      guarantor: form.hasGuarantor
        ? { name: form.guarantorName, phone: form.guarantorPhone, nationalId: "", relation: form.guarantorRelation }
        : undefined,
      stage: "new_request" as ClientStage,
      attachments: [],
      actionLogs: [
        {
          id: "l1",
          action: "إنشاء الملف يدوياً",
          performedBy: "المستخدم الحالي",
          role: "employee",
          timestamp: now,
          note: form.notes || undefined,
        },
      ],
    };
    onAdd(newClient);
    onClose();
  };

  if (!open) return null;

  const inputCls = (field: string) =>
    `w-full h-10 rounded-lg px-3 text-sm border focus:outline-none focus:ring-1 focus:ring-brand-400 transition-colors ${
      errors[field]
        ? "border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-500"
        : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
    }`;

  const selectCls = (field: string) =>
    `w-full h-10 rounded-lg px-3 text-sm border focus:outline-none focus:ring-1 focus:ring-brand-400 transition-colors cursor-pointer ${
      errors[field]
        ? "border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-500"
        : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
    }`;

  const labelCls = "block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1";
  const errCls = "text-xs text-red-500 mt-0.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">إضافة عميل جديد</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">الخطوة {step + 1} من {steps.length}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        {/* Steps indicator */}
        <div className="px-6 pt-4 pb-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      i < step
                        ? "bg-brand-500 text-white"
                        : i === step
                        ? "bg-brand-500 text-white ring-2 ring-brand-200"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {i < step ? <i className="ri-check-line text-xs"></i> : i + 1}
                  </div>
                  <span
                    className={`text-xs font-medium whitespace-nowrap hidden sm:block ${
                      i === step ? "text-brand-600 dark:text-brand-400" : i < step ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-600"
                    }`}
                  >
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 rounded-full transition-all ${
                      i < step ? "bg-brand-400" : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">

          {/* Step 0 — البيانات الأساسية */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>الاسم الكامل <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                    placeholder="مثال: محمد عبدالله الغامدي"
                    className={inputCls("fullName")}
                  />
                  {errors.fullName && <p className={errCls}>{errors.fullName}</p>}
                </div>
                <div>
                  <label className={labelCls}>رقم الجوال <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="05xxxxxxxx"
                    className={inputCls("phone")}
                    dir="ltr"
                  />
                  {errors.phone && <p className={errCls}>{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>رقم واتساب (اختياري)</label>
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => set("whatsapp", e.target.value)}
                    placeholder="05xxxxxxxx"
                    className={inputCls("whatsapp")}
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className={labelCls}>المدينة <span className="text-red-500">*</span></label>
                  <select
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    className={selectCls("city")}
                  >
                    <option value="">اختر المدينة</option>
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.city && <p className={errCls}>{errors.city}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>رقم الهوية الوطنية (اختياري)</label>
                  <input
                    type="text"
                    value={form.nationalIdNumber}
                    onChange={(e) => set("nationalIdNumber", e.target.value)}
                    placeholder="10xxxxxxxx"
                    className={inputCls("nationalIdNumber")}
                    maxLength={10}
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1 — بيانات العمل */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>جهة العمل <span className="text-red-500">*</span></label>
                  <select
                    value={form.employerType}
                    onChange={(e) => set("employerType", e.target.value)}
                    className={selectCls("employerType")}
                  >
                    <option value="">اختر جهة العمل</option>
                    {employerTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.employerType && <p className={errCls}>{errors.employerType}</p>}
                </div>
                <div>
                  <label className={labelCls}>اسم جهة العمل <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.employerName}
                    onChange={(e) => set("employerName", e.target.value)}
                    placeholder="مثال: وزارة الصحة"
                    className={inputCls("employerName")}
                  />
                  {errors.employerName && <p className={errCls}>{errors.employerName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>الراتب الشهري (ريال) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={form.salaryAmount}
                    onChange={(e) => set("salaryAmount", e.target.value)}
                    placeholder="مثال: 12000"
                    className={inputCls("salaryAmount")}
                    min={0}
                  />
                  {errors.salaryAmount && <p className={errCls}>{errors.salaryAmount}</p>}
                </div>
                <div>
                  <label className={labelCls}>يوم نزول الراتب</label>
                  <input
                    type="number"
                    value={form.salaryDate}
                    onChange={(e) => set("salaryDate", e.target.value)}
                    placeholder="مثال: 27"
                    className={inputCls("salaryDate")}
                    min={1}
                    max={31}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>تاريخ الالتحاق بالعمل</label>
                  <input
                    type="date"
                    value={form.joinDate}
                    onChange={(e) => set("joinDate", e.target.value)}
                    className={inputCls("joinDate")}
                  />
                </div>
              </div>

              {/* Salary transfer */}
              <div
                className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
                style={{
                  backgroundColor: form.salaryTransfer ? "rgba(99,102,241,0.05)" : "transparent",
                  borderColor: form.salaryTransfer ? "rgba(99,102,241,0.3)" : "#e5e7eb",
                }}
                onClick={() => set("salaryTransfer", !form.salaryTransfer)}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                    form.salaryTransfer ? "bg-brand-500" : "border-2 border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {form.salaryTransfer && <i className="ri-check-line text-white text-xs"></i>}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">الراتب محوّل للبنك</span>
              </div>

              {form.salaryTransfer && (
                <div>
                  <label className={labelCls}>بنك التحويل <span className="text-red-500">*</span></label>
                  <select
                    value={form.salaryBank}
                    onChange={(e) => set("salaryBank", e.target.value)}
                    className={selectCls("salaryBank")}
                  >
                    <option value="">اختر البنك</option>
                    {salaryBanks.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {errors.salaryBank && <p className={errCls}>{errors.salaryBank}</p>}
                </div>
              )}
            </div>
          )}

          {/* Step 2 — الخدمة المطلوبة */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>نوع الخدمة <span className="text-red-500">*</span></label>
                  <select
                    value={form.serviceType}
                    onChange={(e) => set("serviceType", e.target.value)}
                    className={selectCls("serviceType")}
                  >
                    <option value="">اختر الخدمة</option>
                    {serviceTypes.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.serviceType && <p className={errCls}>{errors.serviceType}</p>}
                </div>
                <div>
                  <label className={labelCls}>مصدر العميل <span className="text-red-500">*</span></label>
                  <select
                    value={form.source}
                    onChange={(e) => set("source", e.target.value)}
                    className={selectCls("source")}
                  >
                    <option value="">اختر المصدر</option>
                    {sources.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.source && <p className={errCls}>{errors.source}</p>}
                </div>
              </div>

              <div>
                <label className={labelCls}>ملاحظات (اختياري)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="أي ملاحظات إضافية عن العميل أو الطلب..."
                  rows={3}
                  maxLength={300}
                  className="w-full rounded-lg px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-400 resize-none"
                />
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 text-left">{form.notes.length}/300</p>
              </div>

              {/* Guarantor */}
              <div
                className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
                style={{
                  backgroundColor: form.hasGuarantor ? "rgba(99,102,241,0.05)" : "transparent",
                  borderColor: form.hasGuarantor ? "rgba(99,102,241,0.3)" : "#e5e7eb",
                }}
                onClick={() => set("hasGuarantor", !form.hasGuarantor)}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                    form.hasGuarantor ? "bg-brand-500" : "border-2 border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {form.hasGuarantor && <i className="ri-check-line text-white text-xs"></i>}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">يوجد كفيل</span>
              </div>

              {form.hasGuarantor && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                  <div>
                    <label className={labelCls}>اسم الكفيل <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={form.guarantorName}
                      onChange={(e) => set("guarantorName", e.target.value)}
                      placeholder="الاسم الكامل"
                      className={inputCls("guarantorName")}
                    />
                    {errors.guarantorName && <p className={errCls}>{errors.guarantorName}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>جوال الكفيل <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      value={form.guarantorPhone}
                      onChange={(e) => set("guarantorPhone", e.target.value)}
                      placeholder="05xxxxxxxx"
                      className={inputCls("guarantorPhone")}
                      dir="ltr"
                    />
                    {errors.guarantorPhone && <p className={errCls}>{errors.guarantorPhone}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>صلة القرابة</label>
                    <input
                      type="text"
                      value={form.guarantorRelation}
                      onChange={(e) => set("guarantorRelation", e.target.value)}
                      placeholder="مثال: والد"
                      className={inputCls("guarantorRelation")}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3 — مراجعة وتأكيد */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Section: البيانات الأساسية */}
                <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <i className="ri-user-line text-brand-500"></i>
                    البيانات الأساسية
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-0 divide-x divide-x-reverse divide-gray-50 dark:divide-gray-800">
                  {[
                    { label: "الاسم", value: form.fullName },
                    { label: "الجوال", value: form.phone },
                    { label: "المدينة", value: form.city },
                    { label: "واتساب", value: form.whatsapp || "—" },
                    { label: "رقم الهوية", value: form.nationalIdNumber || "—" },
                  ].map((r, i) => (
                    <div key={i} className="px-4 py-3 border-b border-gray-50 dark:border-gray-800">
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">{r.label}</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mt-0.5">{r.value}</p>
                    </div>
                  ))}
                </div>

                {/* Section: بيانات العمل */}
                <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 border-t border-t-gray-100 dark:border-t-gray-700">
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <i className="ri-briefcase-line text-brand-500"></i>
                    بيانات العمل
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-0">
                  {[
                    { label: "جهة العمل", value: form.employerType },
                    { label: "اسم الجهة", value: form.employerName },
                    { label: "الراتب", value: form.salaryAmount ? `${Number(form.salaryAmount).toLocaleString("ar-SA")} ريال` : "—" },
                    { label: "يوم الراتب", value: form.salaryDate || "—" },
                    { label: "تحويل الراتب", value: form.salaryTransfer ? `نعم — ${form.salaryBank}` : "لا" },
                    { label: "تاريخ الالتحاق", value: form.joinDate || "—" },
                  ].map((r, i) => (
                    <div key={i} className="px-4 py-3 border-b border-gray-50 dark:border-gray-800">
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">{r.label}</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mt-0.5">{r.value}</p>
                    </div>
                  ))}
                </div>

                {/* Section: الخدمة */}
                <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 border-t border-t-gray-100 dark:border-t-gray-700">
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <i className="ri-service-line text-brand-500"></i>
                    الخدمة المطلوبة
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-0">
                  {[
                    { label: "نوع الخدمة", value: form.serviceType },
                    { label: "المصدر", value: form.source },
                    { label: "كفيل", value: form.hasGuarantor ? `نعم — ${form.guarantorName}` : "لا" },
                  ].map((r, i) => (
                    <div key={i} className="px-4 py-3 border-b border-gray-50 dark:border-gray-800">
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">{r.label}</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mt-0.5">{r.value}</p>
                    </div>
                  ))}
                </div>

                {form.notes && (
                  <div className="px-4 py-3">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">ملاحظات</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{form.notes}</p>
                  </div>
                )}
              </div>

              {/* Stage badge */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40 flex-shrink-0">
                  <i className="ri-information-line text-blue-600 dark:text-blue-400 text-base"></i>
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">سيتم إنشاء الملف في مرحلة "طلب جديد"</p>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-0.5">يمكن تعيين موظف وتغيير المرحلة لاحقاً من داخل الملف</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex-shrink-0 bg-gray-50/50 dark:bg-gray-800/50">
          <button
            onClick={step === 0 ? onClose : prev}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className={`text-sm ${step === 0 ? "ri-close-line" : "ri-arrow-right-line"}`}></i>
            {step === 0 ? "إلغاء" : "السابق"}
          </button>

          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all ${
                  i === step ? "w-4 h-1.5 bg-brand-500" : i < step ? "w-1.5 h-1.5 bg-brand-300" : "w-1.5 h-1.5 bg-gray-200 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>

          {step < steps.length - 1 ? (
            <button
              onClick={next}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold text-white transition-all cursor-pointer whitespace-nowrap hover:opacity-90"
              style={{ backgroundColor: "#6366f1" }}
            >
              التالي
              <i className="ri-arrow-left-line text-sm"></i>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold text-white transition-all cursor-pointer whitespace-nowrap hover:opacity-90"
              style={{ backgroundColor: "#6366f1" }}
            >
              <i className="ri-user-add-line text-sm"></i>
              إنشاء الملف
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
