import { useState, useCallback } from "react";
import {
  loadSoundSettings,
  saveSoundSettings,
  type NotificationSoundSettings,
} from "@/hooks/useNotificationSoundSettings";
import { useNotificationSound } from "@/hooks/useNotificationSound";

interface SettingToggleProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

function SettingToggle({ label, description, value, onChange }: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 cursor-pointer ${
          value ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
            value ? "left-0.5" : "right-0.5"
          }`}
        ></span>
      </button>
    </div>
  );
}

export default function SystemSettingsTab() {
  const [toast, setToast] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const { preview } = useNotificationSound();

  // Sound settings — loaded from localStorage
  const [soundSettings, setSoundSettings] = useState<NotificationSoundSettings>(loadSoundSettings);

  const updateSound = useCallback(
    (key: keyof NotificationSoundSettings, val: boolean | number) => {
      setSoundSettings((prev) => {
        const updated = { ...prev, [key]: val };
        saveSoundSettings(updated);
        return updated;
      });
      setHasChanges(true);
    },
    []
  );

  const [notifSettings, setNotifSettings] = useState({
    newRequest: true,
    dataComplete: true,
    pendingApproval: true,
    rejection: true,
    managerApproval: true,
    paymentDue: true,
    emailNotif: false,
  });

  const [workflowSettings, setWorkflowSettings] = useState({
    autoAssign: false,
    requireGuarantor: false,
    allowSkipStage: false,
    requireRejectionReason: true,
    creditReportEvery3Days: true,
    autoArchiveCompleted: true,
  });

  const [systemSettings, setSystemSettings] = useState({
    landingFormActive: true,
    showServiceList: true,
    requirePrivacyConsent: true,
    allowMultipleServices: false,
    maintenanceMode: false,
  });

  const [companyInfo, setCompanyInfo] = useState({
    companyName: "شركة التمويل المتكامل",
    phone: "920001234",
    email: "info@company.sa",
    address: "الرياض، المملكة العربية السعودية",
    vatNumber: "300123456789003",
    crNumber: "1010123456",
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = () => setHasChanges(true);

  const handleSave = () => {
    saveSoundSettings(soundSettings);
    setHasChanges(false);
    showToast("تم حفظ الإعدادات بنجاح");
  };

  const updateNotif = (key: keyof typeof notifSettings, val: boolean) => {
    setNotifSettings((p) => ({ ...p, [key]: val }));
    handleChange();
  };

  const updateWorkflow = (key: keyof typeof workflowSettings, val: boolean) => {
    setWorkflowSettings((p) => ({ ...p, [key]: val }));
    handleChange();
  };

  const updateSystem = (key: keyof typeof systemSettings, val: boolean) => {
    setSystemSettings((p) => ({ ...p, [key]: val }));
    handleChange();
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gray-800 dark:bg-gray-700 text-white text-sm px-4 py-2.5 rounded-lg">
          {toast}
        </div>
      )}

      {/* Save Bar */}
      {hasChanges && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="ri-information-line text-amber-500"></i>
            <span className="text-sm text-amber-700 dark:text-amber-400 font-medium">لديك تغييرات غير محفوظة</span>
          </div>
          <button
            onClick={handleSave}
            className="bg-amber-500 text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-amber-600 cursor-pointer whitespace-nowrap"
          >
            حفظ الآن
          </button>
        </div>
      )}

      {/* Company Info */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="w-7 h-7 flex items-center justify-center">
            <i className="ri-building-2-line text-gray-500 dark:text-gray-400"></i>
          </div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">بيانات الشركة</h3>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "اسم الشركة", key: "companyName", placeholder: "اسم الشركة" },
            { label: "رقم الهاتف", key: "phone", placeholder: "920XXXXXXX" },
            { label: "البريد الإلكتروني", key: "email", placeholder: "info@company.sa" },
            { label: "العنوان", key: "address", placeholder: "المدينة، المملكة العربية السعودية" },
            { label: "الرقم الضريبي", key: "vatNumber", placeholder: "3XXXXXXXXXXX3" },
            { label: "السجل التجاري", key: "crNumber", placeholder: "10XXXXXXXX" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">{label}</label>
              <input
                type="text"
                value={companyInfo[key as keyof typeof companyInfo]}
                onChange={(e) => {
                  setCompanyInfo((p) => ({ ...p, [key]: e.target.value }));
                  handleChange();
                }}
                placeholder={placeholder}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="w-7 h-7 flex items-center justify-center">
            <i className="ri-notification-3-line text-gray-500 dark:text-gray-400"></i>
          </div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">إعدادات التنبيهات</h3>
        </div>
        <div className="px-4">
          <SettingToggle label="تنبيه وصول طلب جديد" description="إرسال تنبيه للموظف أو المشرف عند وصول طلب جديد" value={notifSettings.newRequest} onChange={(v) => updateNotif("newRequest", v)} />
          <SettingToggle label="تنبيه اكتمال البيانات" description="إرسال تنبيه للمشرف عند اكتمال بيانات العميل" value={notifSettings.dataComplete} onChange={(v) => updateNotif("dataComplete", v)} />
          <SettingToggle label="تنبيه بانتظار الاعتماد" description="إرسال تنبيه للمدير عند وجود ملف بانتظار الاعتماد" value={notifSettings.pendingApproval} onChange={(v) => updateNotif("pendingApproval", v)} />
          <SettingToggle label="تنبيه رفض الملف" description="إرسال تنبيه للموظف عند رفض الملف مع السبب" value={notifSettings.rejection} onChange={(v) => updateNotif("rejection", v)} />
          <SettingToggle label="تنبيه اعتماد المدير" description="إرسال تنبيه للمشرف بعد اعتماد المدير لتحويل الملف" value={notifSettings.managerApproval} onChange={(v) => updateNotif("managerApproval", v)} />
          <SettingToggle label="تنبيه المتأخرات المالية" description="إرسال تنبيه للمدير عند وجود متأخرات مالية" value={notifSettings.paymentDue} onChange={(v) => updateNotif("paymentDue", v)} />
          <SettingToggle label="تنبيهات البريد الإلكتروني" description="إرسال نسخة من التنبيهات عبر البريد الإلكتروني" value={notifSettings.emailNotif} onChange={(v) => updateNotif("emailNotif", v)} />
        </div>
      </div>

      {/* Sound Settings */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 flex items-center justify-center">
              <i className="ri-volume-up-line text-gray-500 dark:text-gray-400"></i>
            </div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">إعدادات صوت الإشعارات</h3>
          </div>
          {/* Master toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {soundSettings.enabled ? "مفعّل" : "معطّل"}
            </span>
            <button
              onClick={() => updateSound("enabled", !soundSettings.enabled)}
              className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 cursor-pointer ${
                soundSettings.enabled ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                soundSettings.enabled ? "left-0.5" : "right-0.5"
              }`}></span>
            </button>
          </div>
        </div>

        <div className={`px-4 transition-opacity ${
          soundSettings.enabled ? "opacity-100" : "opacity-40 pointer-events-none"
        }`}>

          {/* Normal sound toggle */}
          <div className="flex items-center justify-between py-3.5 border-b border-gray-50 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                <i className="ri-notification-3-line text-brand-500 text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">صوت الإشعارات العادية</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">نغمة لطيفة عند وصول طلبات صفحة الهبوط</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => preview("normal")}
                className="text-[10px] px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer whitespace-nowrap flex items-center gap-1"
              >
                <i className="ri-play-line text-xs"></i>
                تجربة
              </button>
              <button
                onClick={() => updateSound("normalEnabled", !soundSettings.normalEnabled)}
                className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 cursor-pointer ${
                  soundSettings.normalEnabled ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                  soundSettings.normalEnabled ? "left-0.5" : "right-0.5"
                }`}></span>
              </button>
            </div>
          </div>

          {/* Urgent sound toggle */}
          <div className="flex items-center justify-between py-3.5 border-b border-gray-50 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                <i className="ri-alarm-warning-line text-red-500 text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">صوت الإشعارات العاجلة</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">صوت حاد عند طلبات اعتماد المدير العاجلة</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => preview("urgent")}
                className="text-[10px] px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer whitespace-nowrap flex items-center gap-1"
              >
                <i className="ri-play-line text-xs"></i>
                تجربة
              </button>
              <button
                onClick={() => updateSound("urgentEnabled", !soundSettings.urgentEnabled)}
                className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 cursor-pointer ${
                  soundSettings.urgentEnabled ? "bg-red-500" : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                  soundSettings.urgentEnabled ? "left-0.5" : "right-0.5"
                }`}></span>
              </button>
            </div>
          </div>

          {/* Volume slider */}
          <div className="py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className={`text-sm ${
                    soundSettings.volume === 0
                      ? "ri-volume-mute-line text-gray-400"
                      : soundSettings.volume < 0.5
                      ? "ri-volume-down-line text-gray-500 dark:text-gray-400"
                      : "ri-volume-up-line text-gray-600 dark:text-gray-300"
                  }`}></i>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">مستوى الصوت</span>
              </div>
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg">
                {Math.round(soundSettings.volume * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <i className="ri-volume-mute-line text-gray-300 dark:text-gray-600 text-sm"></i>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={soundSettings.volume}
                onChange={(e) => updateSound("volume", parseFloat(e.target.value))}
                className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to left, #e5e7eb ${(1 - soundSettings.volume) * 100}%, #FF6039 ${(1 - soundSettings.volume) * 100}%)`,
                }}
              />
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <i className="ri-volume-up-line text-gray-400 dark:text-gray-500 text-sm"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Disabled overlay message */}
        {!soundSettings.enabled && (
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2.5">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-volume-mute-line text-gray-400 dark:text-gray-500 text-sm"></i>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">صوت الإشعارات معطّل حالياً — ستظل الإشعارات تعمل بدون صوت</p>
            </div>
          </div>
        )}
      </div>

      {/* Workflow */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="w-7 h-7 flex items-center justify-center">
            <i className="ri-flow-chart text-gray-500 dark:text-gray-400"></i>
          </div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">إعدادات مسار العمل</h3>
        </div>
        <div className="px-4">
          <SettingToggle label="التوزيع التلقائي للعملاء" description="توزيع الملفات الجديدة تلقائياً على الموظفين المتاحين" value={workflowSettings.autoAssign} onChange={(v) => updateWorkflow("autoAssign", v)} />
          <SettingToggle label="إلزامية الكفيل" description="اشتراط وجود كفيل لإكمال الملف" value={workflowSettings.requireGuarantor} onChange={(v) => updateWorkflow("requireGuarantor", v)} />
          <SettingToggle label="السماح بتخطي مرحلة" description="السماح للمشرف بتخطي مرحلة في مسار العمل" value={workflowSettings.allowSkipStage} onChange={(v) => updateWorkflow("allowSkipStage", v)} />
          <SettingToggle label="إلزامية سبب الرفض" description="اشتراط ذكر سبب عند رفض أي ملف" value={workflowSettings.requireRejectionReason} onChange={(v) => updateWorkflow("requireRejectionReason", v)} />
          <SettingToggle label="تحديث التقرير الائتماني كل 3 أيام" description="تذكير برفع تقرير ائتماني جديد كل 3 أيام في مرحلة التنفيذ" value={workflowSettings.creditReportEvery3Days} onChange={(v) => updateWorkflow("creditReportEvery3Days", v)} />
          <SettingToggle label="أرشفة تلقائية عند الاكتمال" description="نقل الملفات المكتملة تلقائياً للأرشيف" value={workflowSettings.autoArchiveCompleted} onChange={(v) => updateWorkflow("autoArchiveCompleted", v)} />
        </div>
      </div>

      {/* Landing Page */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="w-7 h-7 flex items-center justify-center">
            <i className="ri-pages-line text-gray-500 dark:text-gray-400"></i>
          </div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">إعدادات صفحة الهبوط</h3>
        </div>
        <div className="px-4">
          <SettingToggle label="تفعيل نموذج التسجيل" description="عرض نموذج التسجيل في صفحة الهبوط" value={systemSettings.landingFormActive} onChange={(v) => updateSystem("landingFormActive", v)} />
          <SettingToggle label="عرض قائمة الخدمات" description="إظهار قائمة الخدمات المتاحة في صفحة الهبوط" value={systemSettings.showServiceList} onChange={(v) => updateSystem("showServiceList", v)} />
          <SettingToggle label="إلزامية موافقة الخصوصية" description="اشتراط موافقة العميل على سياسة الخصوصية" value={systemSettings.requirePrivacyConsent} onChange={(v) => updateSystem("requirePrivacyConsent", v)} />
          <SettingToggle label="السماح بطلب خدمات متعددة" description="السماح للعميل باختيار أكثر من خدمة في نفس الطلب" value={systemSettings.allowMultipleServices} onChange={(v) => updateSystem("allowMultipleServices", v)} />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-red-100 dark:border-red-900/50 overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-red-100 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10">
          <div className="w-7 h-7 flex items-center justify-center">
            <i className="ri-error-warning-line text-red-500"></i>
          </div>
          <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">منطقة الخطر</h3>
        </div>
        <div className="px-4">
          <SettingToggle
            label="وضع الصيانة"
            description="تعطيل صفحة الهبوط مؤقتاً وعرض رسالة صيانة للزوار"
            value={systemSettings.maintenanceMode}
            onChange={(v) => updateSystem("maintenanceMode", v)}
          />
        </div>
        <div className="px-4 pb-4 pt-2">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 flex items-start gap-3">
            <i className="ri-information-line text-red-400 mt-0.5 flex-shrink-0"></i>
            <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed">
              تفعيل وضع الصيانة سيوقف استقبال الطلبات الجديدة من صفحة الهبوط. لوحة التحكم ستبقى تعمل بشكل طبيعي.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-brand-500 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-brand-600 transition-colors cursor-pointer whitespace-nowrap"
        >
          حفظ جميع الإعدادات
        </button>
      </div>
    </div>
  );
}
