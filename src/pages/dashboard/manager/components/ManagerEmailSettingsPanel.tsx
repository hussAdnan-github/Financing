import { useState, useCallback } from "react";
import {
  loadManagerEmailSettings,
  saveManagerEmailSettings,
  type ManagerEmailSettings,
} from "@/hooks/useManagerEmailSettings";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_PUBLIC_SUPABASE_URL,
  import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY
);

interface Props {
  onClose: () => void;
}

export default function ManagerEmailSettingsPanel({ onClose }: Props) {
  const [settings, setSettings] = useState<ManagerEmailSettings>(loadManagerEmailSettings);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);
  const [testMsg, setTestMsg] = useState("");

  const update = useCallback(
    <K extends keyof ManagerEmailSettings>(key: K, val: ManagerEmailSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: val }));
      setSaved(false);
    },
    []
  );

  const handleSave = () => {
    saveManagerEmailSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleTest = async () => {
    if (!settings.email) {
      setTestResult("error");
      setTestMsg("يرجى إدخال البريد الإلكتروني أولاً");
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const { error } = await supabase.functions.invoke("send-manager-email", {
        body: {
          managerEmail: settings.email,
          clientName: "محمد عبدالله الغامدي",
          clientId: "CLT-001",
          serviceType: "قرض شخصي",
          city: "الرياض",
          requestedAmount: 185000,
          monthlyInstallment: 2680,
          profitRate: 4.2,
          months: 84,
          reason: "هذا بريد تجريبي للتحقق من إعداد الإشعارات — مبلغ التمويل يتجاوز الحد المعتاد ويستلزم موافقة مباشرة من المدير",
          requestedBy: "أحمد الشمري",
          requestedAt: new Date().toISOString(),
          urgency: "urgent",
        },
      });
      if (error) throw error;
      setTestResult("success");
      setTestMsg("تم إرسال بريد تجريبي بنجاح — تحقق من صندوق الوارد");
    } catch (err) {
      setTestResult("error");
      setTestMsg("فشل الإرسال — تأكد من إعداد RESEND_API_KEY في Supabase");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <i className="ri-mail-settings-line text-amber-600 dark:text-amber-400 text-base"></i>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">إعداد إشعارات البريد</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">تلقّي إشعارات الطلبات العاجلة على إيميلك</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          >
            <i className="ri-close-line text-gray-500 dark:text-gray-400"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Email input */}
          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 block">
              البريد الإلكتروني للمدير
              <span className="text-red-500 mr-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                <i className="ri-mail-line text-gray-400 dark:text-gray-500 text-sm"></i>
              </div>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="manager@company.sa"
                className="w-full pr-9 pl-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                dir="ltr"
              />
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5">
              ستصلك إشعارات الطلبات العاجلة على هذا البريد
            </p>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300">متى يُرسل الإشعار؟</p>

            {/* Urgent toggle */}
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <i className="ri-alarm-warning-line text-red-500 text-sm"></i>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">الطلبات العاجلة</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">طلبات اعتماد المشرف المُعلّمة عاجلة</p>
                </div>
              </div>
              <button
                onClick={() => update("sendOnUrgent", !settings.sendOnUrgent)}
                className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 cursor-pointer ${
                  settings.sendOnUrgent ? "bg-red-500" : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                  settings.sendOnUrgent ? "left-0.5" : "right-0.5"
                }`}></span>
              </button>
            </div>

            {/* Normal toggle */}
            <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  <i className="ri-vip-crown-line text-amber-600 dark:text-amber-400 text-sm"></i>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">الطلبات العادية</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">جميع طلبات الاعتماد الاستثنائية</p>
                </div>
              </div>
              <button
                onClick={() => update("sendOnNormal", !settings.sendOnNormal)}
                className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 cursor-pointer ${
                  settings.sendOnNormal ? "bg-amber-500" : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                  settings.sendOnNormal ? "left-0.5" : "right-0.5"
                }`}></span>
              </button>
            </div>
          </div>

          {/* Test result */}
          {testResult && (
            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium ${
              testResult === "success"
                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
            }`}>
              <i className={testResult === "success" ? "ri-checkbox-circle-line" : "ri-error-warning-line"}></i>
              {testMsg}
            </div>
          )}

          {/* Resend API note */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex items-start gap-2.5">
            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="ri-information-line text-gray-400 dark:text-gray-500 text-sm"></i>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                يتطلب الإرسال إعداد <strong className="text-gray-700 dark:text-gray-300">RESEND_API_KEY</strong> في متغيرات Supabase Edge Functions.
                احصل على مفتاح مجاني من{" "}
                <a
                  href="https://resend.com"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="text-amber-600 dark:text-amber-400 underline"
                >
                  resend.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
          <button
            onClick={handleTest}
            disabled={testing || !settings.email}
            className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
          >
            {testing ? (
              <i className="ri-loader-4-line animate-spin text-sm"></i>
            ) : (
              <i className="ri-send-plane-line text-sm"></i>
            )}
            {testing ? "جاري الإرسال..." : "إرسال تجريبي"}
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 px-4 py-2.5 rounded-lg text-white text-sm font-medium cursor-pointer flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${
              saved ? "bg-emerald-500" : "bg-amber-500 hover:bg-amber-600"
            }`}
          >
            {saved ? (
              <>
                <i className="ri-check-line"></i>
                تم الحفظ
              </>
            ) : (
              <>
                <i className="ri-save-line"></i>
                حفظ الإعدادات
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
