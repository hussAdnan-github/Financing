import { useState } from "react";
import { type Client, type CollectionAttachment } from "@/mocks/dashboardData";

interface Props {
  client: Client;
}

export default function CollectionTab({ client }: Props) {
  const [collectionAttachments, setCollectionAttachments] = useState<CollectionAttachment[]>(client.collectionAttachments ?? []);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", date: "", collectionAmount: 0 });
  const [status, setStatus] = useState<"active" | "completed" | "defaulted">(client.collectionStatus ?? "active");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<"completed" | "defaulted" | null>(null);

  // تحديث السجل الائتماني
  const [creditReportDate, setCreditReportDate] = useState("");
  const [creditReportFile, setCreditReportFile] = useState<string | null>(null);
  const [creditReportFileName, setCreditReportFileName] = useState("");
  const [creditReportHistory, setCreditReportHistory] = useState<{name: string; date: string; uploadedAt: string}[]>([]);

  const handleUploadCreditReport = () => {
    if (!creditReportDate || !creditReportFile) return;
    setCreditReportHistory(prev => [
      { name: creditReportFileName, date: creditReportDate, uploadedAt: new Date().toISOString() },
      ...prev,
    ]);
    setCreditReportFile(null);
    setCreditReportFileName("");
    setCreditReportDate("");
  };

  // حساب مبلغ التحصيل = مبلغ السداد + عرض السعر
  const paymentAmount = client.clientPaymentAmount ?? client.financial?.agreementValue ?? 0;
  const offerAmount = client.financingOffer?.netFinancingAmount ?? client.financingCalc?.approvedAmount ?? 0;
  const systemCollectionAmount = paymentAmount + offerAmount;

  const totalCollected = collectionAttachments.reduce((s, c) => s + c.collectionAmount, 0);

  const handleAdd = () => {
    if (!newItem.name || !newItem.collectionAmount) return;
    setCollectionAttachments([...collectionAttachments, {
      id: `ca${Date.now()}`,
      name: newItem.name,
      date: newItem.date,
      collectionAmount: Number(newItem.collectionAmount),
    }]);
    setNewItem({ name: "", date: "", collectionAmount: 0 });
    setShowAdd(false);
  };

  const handleStatusChange = (s: "completed" | "defaulted") => {
    setPendingStatus(s);
    setShowStatusModal(true);
  };

  const confirmStatusChange = () => {
    if (pendingStatus) setStatus(pendingStatus);
    setShowStatusModal(false);
    setPendingStatus(null);
  };

  return (
    <div className="space-y-5">
      {/* حالة التحصيل */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-funds-line text-brand-500 text-sm"></i>
            </div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">حالة التحصيل</h3>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
            status === "completed" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
            status === "defaulted" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" :
            "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400"
          }`}>
            {status === "completed" ? "منتهي" : status === "defaulted" ? "متعثر" : "نشط"}
          </span>
        </div>
        <div className="p-5">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "مبلغ التحصيل (من النظام)", value: systemCollectionAmount, color: "text-gray-800 dark:text-gray-100", bg: "bg-gray-50 dark:bg-gray-800", note: "مبلغ السداد + عرض السعر" },
              { label: "إجمالي المحصّل", value: totalCollected, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20", note: "" },
              { label: "المتبقي", value: systemCollectionAmount - totalCollected, color: (systemCollectionAmount - totalCollected) > 0 ? "text-amber-600 dark:text-amber-400" : "text-green-600 dark:text-green-400", bg: (systemCollectionAmount - totalCollected) > 0 ? "bg-amber-50 dark:bg-amber-900/20" : "bg-green-50 dark:bg-green-900/20", note: "" },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl p-3`}>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">{s.label}</p>
                {s.note && <p className="text-[9px] text-gray-400 dark:text-gray-500 mb-1">{s.note}</p>}
                <p className={`text-sm font-bold ${s.color}`}>{s.value.toLocaleString("ar-SA")} ريال</p>
              </div>
            ))}
          </div>

          {/* Status Actions */}
          {status === "active" && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleStatusChange("completed")}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 cursor-pointer transition-colors"
              >
                <i className="ri-check-double-line"></i>
                تحديد كـ منتهي
              </button>
              <button
                onClick={() => handleStatusChange("defaulted")}
                className="flex items-center gap-2 px-4 py-2.5 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors"
              >
                <i className="ri-error-warning-line"></i>
                تحديد كـ متعثر
              </button>
            </div>
          )}

          {status !== "active" && (
            <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${status === "completed" ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
              <div className="w-5 h-5 flex items-center justify-center">
                <i className={`text-sm ${status === "completed" ? "ri-check-double-line text-green-600 dark:text-green-400" : "ri-error-warning-line text-red-600 dark:text-red-400"}`}></i>
              </div>
              <p className={`text-sm font-medium ${status === "completed" ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                {status === "completed" ? "تم إغلاق ملف التحصيل بنجاح" : "تم تصنيف الملف كمتعثر"}
              </p>
              <button
                onClick={() => setStatus("active")}
                className="mr-auto text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer underline"
              >
                تراجع
              </button>
            </div>
          )}
        </div>
      </div>

      {/* مرفقات التحصيل */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-folder-received-line text-brand-500 text-sm"></i>
            </div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">مرفقات التحصيل</h3>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">{collectionAttachments.length}</span>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900/30 cursor-pointer font-medium"
          >
            <i className="ri-add-line"></i>
            إضافة مرفق
          </button>
        </div>

        {showAdd && (
          <div className="mx-5 mt-4 p-4 border border-dashed border-brand-200 dark:border-brand-800 rounded-xl bg-brand-50/20 dark:bg-brand-900/10">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">إضافة مرفق تحصيل جديد</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">مسمى المرفق</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="مثال: ملف تحصيل مايو"
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">التاريخ</label>
                <input
                  type="date"
                  value={newItem.date}
                  onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">مبلغ التحصيل الحالي (ريال)</label>
                <input
                  type="number"
                  value={newItem.collectionAmount || ""}
                  onChange={(e) => setNewItem({ ...newItem, collectionAmount: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2.5 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-brand-300 hover:bg-brand-50/30 dark:hover:bg-brand-900/10 transition-colors mb-3">
              <i className="ri-upload-cloud-line text-gray-400 dark:text-gray-500 text-sm"></i>
              <span className="text-xs text-gray-400 dark:text-gray-500">رفع ملف التحصيل</span>
            </div>
            <div className="flex gap-2">
              <button onClick={handleAdd} className="px-4 py-2 bg-brand-500 text-white text-xs font-medium rounded-lg hover:bg-brand-600 cursor-pointer">حفظ</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">إلغاء</button>
            </div>
          </div>
        )}

        <div className="p-5">
          {collectionAttachments.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-10 h-10 flex items-center justify-center mx-auto mb-2">
                <i className="ri-folder-received-line text-2xl text-gray-200 dark:text-gray-700"></i>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">لا توجد مرفقات تحصيل بعد</p>
            </div>
          ) : (
            <div className="space-y-2">
              {collectionAttachments.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3.5 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center">
                      <i className="ri-folder-received-line text-cyan-500 text-sm"></i>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{c.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{c.date ? new Date(c.date).toLocaleDateString("ar-SA") : "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{c.collectionAmount.toLocaleString("ar-SA")} ريال</span>
                    <button
                      onClick={() => setCollectionAttachments(collectionAttachments.filter(x => x.id !== c.id))}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 cursor-pointer"
                    >
                      <i className="ri-delete-bin-line text-xs"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== تحديث السجل الائتماني ===== */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-refresh-line text-brand-500 text-sm"></i>
          </div>
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">تحديث السجل الائتماني</h3>
          <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">يُرفع كل 3 أيام</span>
        </div>
        <div className="p-5">
          <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-4 py-3 mb-4">
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="ri-information-line text-amber-500 text-sm"></i>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              عند رفع تقرير جديد يُلغى السابق تلقائياً ويظهر تاريخ الرفع الحالي. يجب رفع تقرير جديد كل 3 أيام.
            </p>
          </div>

          {/* نموذج رفع تقرير جديد */}
          <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 mb-4">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">رفع تقرير جديد</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 font-medium block mb-1.5">تاريخ التقرير</label>
                <input
                  type="date"
                  value={creditReportDate}
                  onChange={(e) => setCreditReportDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 font-medium block mb-1.5">ملف التقرير</label>
                {creditReportFile ? (
                  <div className="flex items-center gap-2 px-3 py-2 border border-green-200 dark:border-green-900/50 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <i className="ri-file-pdf-line text-green-600 dark:text-green-400 text-sm"></i>
                    <span className="text-xs text-green-700 dark:text-green-400 flex-1 truncate">{creditReportFileName}</span>
                    <button
                      onClick={() => { setCreditReportFile(null); setCreditReportFileName(""); }}
                      className="w-5 h-5 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer flex-shrink-0"
                    >
                      <i className="ri-close-line text-xs"></i>
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 px-3 py-2.5 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-brand-300 hover:bg-brand-50/20 dark:hover:bg-brand-900/10 transition-colors">
                    <i className="ri-upload-cloud-line text-gray-400 dark:text-gray-500 text-sm"></i>
                    <span className="text-xs text-gray-400 dark:text-gray-500">اختر الملف (PDF, JPG)</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCreditReportFile(URL.createObjectURL(file));
                          setCreditReportFileName(file.name);
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
            <button
              onClick={handleUploadCreditReport}
              disabled={!creditReportDate || !creditReportFile}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <i className="ri-upload-2-line"></i>
              رفع التقرير
            </button>
          </div>

          {/* سجل التقارير السابقة */}
          {creditReportHistory.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">سجل التقارير السابقة</p>
              <div className="space-y-2">
                {creditReportHistory.map((r, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 border rounded-xl transition-colors ${
                    i === 0 ? "border-green-100 dark:border-green-900/50 bg-green-50/40 dark:bg-green-900/10" : "border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/30 opacity-60"
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      i === 0 ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-800"
                    }`}>
                      <i className={`ri-file-chart-line text-sm ${
                        i === 0 ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"
                      }`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{r.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">تاريخ التقرير: {r.date} · رُفع بتاريخ: {new Date(r.uploadedAt).toLocaleDateString("ar-SA")}</p>
                    </div>
                    {i === 0 ? (
                      <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">نشط</span>
                    ) : (
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">ملغى</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Confirmation Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${pendingStatus === "completed" ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
                <i className={`text-lg ${pendingStatus === "completed" ? "ri-check-double-line text-green-600 dark:text-green-400" : "ri-error-warning-line text-red-600 dark:text-red-400"}`}></i>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                {pendingStatus === "completed" ? "تأكيد إغلاق الملف" : "تأكيد تصنيف المتعثر"}
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
              {pendingStatus === "completed"
                ? "هل أنت متأكد من إغلاق ملف التحصيل وتصنيفه كـ منتهي؟"
                : "هل أنت متأكد من تصنيف هذا الملف كـ متعثر؟ سيتم إشعار المشرف."}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowStatusModal(false)} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">إلغاء</button>
              <button
                onClick={confirmStatusChange}
                className={`flex-1 py-2.5 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors ${pendingStatus === "completed" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
              >
                تأكيد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
