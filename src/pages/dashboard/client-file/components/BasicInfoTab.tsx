import { useState } from "react";
import { type Client } from "@/mocks/dashboardData";
import { useStaticData } from "@/hooks/useStaticData";
import SelectField from "@/components/base/SelectField";
import CreditReportSection from "./CreditReportSection";

interface Props {
  client: Client;
}

export default function BasicInfoTab({ client }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [hasGuarantor, setHasGuarantor] = useState(client.hasGuarantor);
  const { getActiveItems } = useStaticData();

  // Editable landing-page fields
  const [city, setCity] = useState(client.city);
  const [employerType, setEmployerType] = useState(client.employerType);
  const [serviceType, setServiceType] = useState(client.serviceType);
  const [salaryTransfer, setSalaryTransfer] = useState(client.salaryTransfer);
  const [salaryBank, setSalaryBank] = useState(client.salaryBank ?? "");

  // Editable employee fields
  const [nationalIdNumber, setNationalIdNumber] = useState(client.nationalIdNumber ?? "");
  const [nationalIdExpiry, setNationalIdExpiry] = useState(client.nationalIdExpiry ?? "");
  const [salaryAmount, setSalaryAmount] = useState(client.salaryAmount?.toString() ?? "");
  const [salaryDate, setSalaryDate] = useState(client.salaryDate ?? "");
  const [joinDate, setJoinDate] = useState(client.joinDate ?? "");
  const [salaryDefIssueDate, setSalaryDefIssueDate] = useState(client.salaryDefinition?.issueDate ?? "");

  // Guarantor fields
  const [guarantorName, setGuarantorName] = useState(client.guarantor?.name ?? "");
  const [guarantorPhone, setGuarantorPhone] = useState(client.guarantor?.phone ?? "");
  const [guarantorNationalId, setGuarantorNationalId] = useState(client.guarantor?.nationalId ?? "");
  const [guarantorRelation, setGuarantorRelation] = useState(client.guarantor?.relation ?? "");

  const banks = getActiveItems("banks");
  const serviceTypes = getActiveItems("serviceTypes");
  const employerTypes = getActiveItems("employerTypes");
  const cities = getActiveItems("cities");

  const handleSave = () => {
    // In a real app, persist to backend here
    setEditMode(false);
  };

  return (
    <div className="space-y-5">

      {/* ===== أ) البيانات الواردة من صفحة الهبوط ===== */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-global-line text-brand-500 text-sm"></i>
            </div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">البيانات الواردة من صفحة الهبوط</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">المصدر: {client.source}</span>
            {editMode && (
              <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">
                وضع التعديل
              </span>
            )}
          </div>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* الاسم الكامل — نص ثابت */}
          <ReadField label="الاسم الكامل" value={client.fullName} icon="ri-user-line" />

          {/* رقم الجوال — نص ثابت */}
          <ReadField label="رقم الجوال" value={client.phone} icon="ri-phone-line" />

          {/* المدينة — قائمة اختيار */}
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium block mb-1.5 flex items-center gap-1.5">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-map-pin-line text-brand-400 text-xs"></i>
              </div>
              المدينة
            </label>
            <SelectField
              value={city}
              onChange={setCity}
              options={cities}
              placeholder="اختر المدينة..."
              disabled={!editMode}
              searchable
            />
          </div>

          {/* نوع جهة العمل — قائمة اختيار */}
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium block mb-1.5 flex items-center gap-1.5">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-building-line text-brand-400 text-xs"></i>
              </div>
              نوع جهة العمل
            </label>
            <SelectField
              value={employerType}
              onChange={setEmployerType}
              options={employerTypes}
              placeholder="اختر نوع جهة العمل..."
              disabled={!editMode}
              allowCustom
            />
          </div>

          {/* اسم جهة العمل — نص حر */}
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium block mb-1.5 flex items-center gap-1.5">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-briefcase-line text-brand-400 text-xs"></i>
              </div>
              اسم جهة العمل
            </label>
            {editMode ? (
              <input
                type="text"
                defaultValue={client.employerName}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
              />
            ) : (
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{client.employerName || "—"}</p>
            )}
          </div>

          {/* نوع الخدمة — قائمة اختيار */}
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium block mb-1.5 flex items-center gap-1.5">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-service-line text-brand-400 text-xs"></i>
              </div>
              نوع الخدمة
            </label>
            <SelectField
              value={serviceType}
              onChange={setServiceType}
              options={serviceTypes}
              placeholder="اختر نوع الخدمة..."
              disabled={!editMode}
            />
          </div>

          {/* رابط واتساب */}
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium block mb-1.5 flex items-center gap-1.5">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-whatsapp-line text-green-500 text-xs"></i>
              </div>
              رقم واتساب
            </label>
            {editMode ? (
              <input
                type="tel"
                defaultValue={client.whatsapp ?? client.phone}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                placeholder="05xxxxxxxx"
              />
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{client.whatsapp ?? client.phone}</p>
                {(client.whatsapp ?? client.phone) && (
                  <a
                    href={`https://wa.me/966${(client.whatsapp ?? client.phone).replace(/^0/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-whatsapp-line text-sm"></i>
                    تواصل
                  </a>
                )}
              </div>
            )}
          </div>

          {/* موافقة الخصوصية */}
          <ReadField
            label="موافقة الخصوصية"
            value={client.privacyConsent ? "موافق" : "غير موافق"}
            icon="ri-shield-check-line"
          />

          {/* تاريخ التقديم */}
          <ReadField
            label="تاريخ التقديم"
            value={new Date(client.submittedAt).toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}
            icon="ri-calendar-line"
          />
        </div>
      </div>

      {/* ===== ب) البيانات التي يستكملها الموظف ===== */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-user-settings-line text-brand-500 text-sm"></i>
            </div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">البيانات التي يستكملها الموظف</h3>
          </div>
          <button
            onClick={() => (editMode ? handleSave() : setEditMode(true))}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors whitespace-nowrap ${
              editMode ? "bg-brand-500 text-white" : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className={editMode ? "ri-save-line text-sm" : "ri-edit-line text-sm"}></i>
            </div>
            {editMode ? "حفظ التعديلات" : "تعديل"}
          </button>
        </div>
        <div className="p-5">
          {/* صورة الهوية */}
          <div className="mb-5">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2">صورة الهوية الوطنية</p>
            {client.nationalIdImage ? (
              <div className="relative w-full max-w-sm h-44 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <img src={client.nationalIdImage} alt="الهوية الوطنية" className="w-full h-full object-cover object-top" />
                {editMode && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white text-gray-800 text-xs font-medium rounded-lg cursor-pointer">
                      <i className="ri-upload-2-line"></i>تغيير الصورة
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full max-w-sm h-44 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-300 hover:bg-brand-50/30 dark:hover:bg-brand-900/10 transition-colors">
                <div className="w-10 h-10 flex items-center justify-center">
                  <i className="ri-id-card-line text-2xl text-gray-300 dark:text-gray-600"></i>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">اضغط لرفع صورة الهوية</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* رقم الهوية */}
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 font-medium block mb-1.5">رقم الهوية الوطنية</label>
              {editMode ? (
                <input
                  type="text"
                  value={nationalIdNumber}
                  onChange={(e) => setNationalIdNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                />
              ) : (
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 font-mono">
                  {nationalIdNumber || <span className="text-gray-300 dark:text-gray-600 font-sans">لم يُدخل بعد</span>}
                </p>
              )}
            </div>

            {/* تاريخ انتهاء الهوية */}
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 font-medium block mb-1.5">تاريخ انتهاء الهوية</label>
              {editMode ? (
                <input
                  type="date"
                  value={nationalIdExpiry}
                  onChange={(e) => setNationalIdExpiry(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                />
              ) : (
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {nationalIdExpiry ? new Date(nationalIdExpiry).toLocaleDateString("ar-SA") : <span className="text-gray-300 dark:text-gray-600">لم يُدخل بعد</span>}
                </p>
              )}
            </div>

            {/* الراتب */}
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 font-medium block mb-1.5">الراتب الشهري (ريال)</label>
              {editMode ? (
                <input
                  type="number"
                  value={salaryAmount}
                  onChange={(e) => setSalaryAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                />
              ) : (
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {salaryAmount ? `${Number(salaryAmount).toLocaleString("ar-SA")} ريال` : <span className="text-gray-300 dark:text-gray-600">لم يُدخل بعد</span>}
                </p>
              )}
            </div>

            {/* يوم الراتب */}
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 font-medium block mb-1.5">يوم استلام الراتب</label>
              {editMode ? (
                <SelectField
                  value={salaryDate ? `اليوم ${salaryDate}` : ""}
                  onChange={(v) => setSalaryDate(v.replace("اليوم ", ""))}
                  options={Array.from({ length: 31 }, (_, i) => `اليوم ${i + 1}`)}
                  placeholder="اختر اليوم..."
                  searchable={false}
                />
              ) : (
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {salaryDate ? `اليوم ${salaryDate}` : <span className="text-gray-300 dark:text-gray-600">لم يُدخل بعد</span>}
                </p>
              )}
            </div>

            {/* تاريخ الالتحاق */}
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 font-medium block mb-1.5">تاريخ الالتحاق بالعمل</label>
              {editMode ? (
                <input
                  type="date"
                  value={joinDate}
                  onChange={(e) => setJoinDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                />
              ) : (
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {joinDate ? new Date(joinDate).toLocaleDateString("ar-SA") : <span className="text-gray-300 dark:text-gray-600">لم يُدخل بعد</span>}
                </p>
              )}
            </div>

            {/* أرقام إضافية */}
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 font-medium block mb-1.5">أرقام التواصل الإضافية</label>
              {client.additionalPhones && client.additionalPhones.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {client.additionalPhones.map((p, i) => (
                    <span key={i} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg">{p}</span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-300 dark:text-gray-600">لا توجد أرقام إضافية</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== ج) تعريف الراتب ===== */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-file-text-line text-brand-500 text-sm"></i>
          </div>
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">مرفق تعريف الراتب</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* مرفق تعريف الراتب */}
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold block mb-2">مرفق تعريف الراتب</label>
              {client.salaryDefinition?.attachmentFile ? (
                <div className="flex items-center gap-3 p-3 border border-green-100 dark:border-green-900/50 rounded-xl bg-green-50/30 dark:bg-green-900/10">
                  <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <i className="ri-file-pdf-line text-green-600 dark:text-green-400 text-sm"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">تعريف الراتب.pdf</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">تم الرفع</p>
                  </div>
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600 hover:bg-brand-100 dark:hover:bg-brand-900/30 cursor-pointer">
                    <i className="ri-download-line text-xs"></i>
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-brand-300 hover:bg-brand-50/20 dark:hover:bg-brand-900/10 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center flex-shrink-0">
                    <i className="ri-upload-cloud-2-line text-brand-500 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">رفع مرفق تعريف الراتب</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">PDF, JPG, PNG</p>
                  </div>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                </label>
              )}
            </div>

            {/* تاريخ إصدار تعريف الراتب */}
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold block mb-2">تاريخ إصدار تعريف الراتب</label>
              {editMode ? (
                <input
                  type="date"
                  value={salaryDefIssueDate}
                  onChange={(e) => setSalaryDefIssueDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/40 dark:bg-gray-800/40">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center flex-shrink-0">
                    <i className="ri-calendar-check-line text-brand-500 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">تاريخ الإصدار</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {salaryDefIssueDate
                        ? new Date(salaryDefIssueDate).toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })
                        : <span className="text-gray-300 dark:text-gray-600 text-xs font-normal">لم يُدخل بعد</span>}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== د) التقرير الائتماني للعميل ===== */}
      <CreditReportSection
        title="التقرير الائتماني للعميل"
        creditReport={client.creditReport}
        icon="ri-file-chart-line"
      />

      {/* ===== هـ) الكفيل ===== */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-user-follow-line text-brand-500 text-sm"></i>
            </div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">بيانات الكفيل</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">يوجد كفيل؟</span>
            <button
              onClick={() => setHasGuarantor(!hasGuarantor)}
              className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${hasGuarantor ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${hasGuarantor ? "right-0.5" : "left-0.5"}`}></span>
            </button>
          </div>
        </div>

        {!hasGuarantor ? (
          <div className="p-5">
            <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-4 py-3">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-information-line text-amber-500 text-sm"></i>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-400">لا يوجد كفيل — سيُحوَّل الملف للمشرف مباشرةً للموافقة</p>
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              {/* اسم الكفيل */}
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">اسم الكفيل</p>
                {editMode ? (
                  <input type="text" value={guarantorName} onChange={(e) => setGuarantorName(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100" />
                ) : (
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{guarantorName || "—"}</p>
                )}
              </div>
              {/* رقم الجوال */}
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">رقم الجوال</p>
                {editMode ? (
                  <input type="text" value={guarantorPhone} onChange={(e) => setGuarantorPhone(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100" />
                ) : (
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{guarantorPhone || "—"}</p>
                )}
              </div>
              {/* رقم الهوية */}
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">رقم الهوية</p>
                {editMode ? (
                  <input type="text" value={guarantorNationalId} onChange={(e) => setGuarantorNationalId(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100" />
                ) : (
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 font-mono">{guarantorNationalId || "—"}</p>
                )}
              </div>
              {/* صلة القرابة */}
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">صلة القرابة</p>
                {editMode ? (
                  <SelectField value={guarantorRelation} onChange={setGuarantorRelation} options={["والد", "والدة", "أخ", "أخت", "زوج", "زوجة", "ابن", "ابنة", "عم", "خال"]} placeholder="اختر..." searchable={false} />
                ) : (
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{guarantorRelation || "—"}</p>
                )}
              </div>
            </div>

            {/* صورة هوية الكفيل */}
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">صورة هوية الكفيل</p>
              {client.guarantorIdImage ? (
                <div className="w-full max-w-sm h-36 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img src={client.guarantorIdImage} alt="هوية الكفيل" className="w-full h-full object-cover object-top" />
                </div>
              ) : (
                <div className="w-full max-w-sm h-36 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-300 hover:bg-brand-50/30 dark:hover:bg-brand-900/10 transition-colors">
                  <i className="ri-id-card-line text-2xl text-gray-300 dark:text-gray-600"></i>
                  <p className="text-xs text-gray-400 dark:text-gray-500">رفع صورة هوية الكفيل</p>
                </div>
              )}
            </div>

            {/* التقرير الائتماني للكفيل */}
            <CreditReportSection
              title="التقرير الائتماني للكفيل"
              creditReport={client.guarantorCreditReport}
              icon="ri-shield-user-line"
              compact
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Helper: Read-only field ──────────────────────────────────────────────────
function ReadField({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <i className={`${icon} text-brand-500 text-sm`}></i>
      </div>
      <div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{value || "—"}</p>
      </div>
    </div>
  );
}
