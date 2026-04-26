import { useState } from "react";
import { type Client, type PaymentAttachment } from "@/mocks/dashboardData";

interface Props {
  client: Client;
}

export default function ExecutionTab({ client }: Props) {
  const [paymentAttachments, setPaymentAttachments] = useState<PaymentAttachment[]>(client.paymentAttachments ?? []);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({ name: "", date: "", paymentAmount: 0, paymentDate: "" });
  const [creditReportDate, setCreditReportDate] = useState("");
  const [creditReportFile, setCreditReportFile] = useState<string | null>(null);
  const [creditReportFileName, setCreditReportFileName] = useState("");
  const [creditReportHistory, setCreditReportHistory] = useState<{name: string; date: string; uploadedAt: string}[]>([]);

  const clientPaymentAmount = client.clientPaymentAmount ?? client.financial?.agreementValue ?? 0;
  const totalPaid = paymentAttachments.reduce((s, p) => s + p.paymentAmount, 0);
  const remaining = clientPaymentAmount - totalPaid;

  const handleAddPayment = () => {
    if (!newPayment.name || !newPayment.paymentAmount) return;
    const entry: PaymentAttachment = {
      id: `pa${Date.now()}`,
      name: newPayment.name,
      date: newPayment.date,
      paymentAmount: Number(newPayment.paymentAmount),
      paymentDate: newPayment.paymentDate,
    };
    setPaymentAttachments([...paymentAttachments, entry]);
    setNewPayment({ name: "", date: "", paymentAmount: 0, paymentDate: "" });
    setShowAddPayment(false);
  };

  const handleUploadCreditReport = () => {
    if (!creditReportDate || !creditReportFile) return;
    // أضف التقرير الحالي للتاريخ
    if (creditReportFile && creditReportFileName) {
      setCreditReportHistory(prev => [
        { name: creditReportFileName, date: creditReportDate, uploadedAt: new Date().toISOString() },
        ...prev,
      ]);
    }
    setCreditReportFile(null);
    setCreditReportFileName("");
    setCreditReportDate("");
  };

  return (
    <div className="space-y-5">
      {/* ===== ح) مرفقات السداد ===== */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-money-dollar-circle-line text-brand-500 text-sm"></i>
            </div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">مرفقات السداد</h3>
          </div>
          <button
            onClick={() => setShowAddPayment(!showAddPayment)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900/30 cursor-pointer font-medium"
          >
            <i className="ri-add-line"></i>
            إضافة مرفق سداد
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 p-5 pb-0">
          {[
            { label: "مبلغ سداد العميل", value: clientPaymentAmount, color: "text-gray-800 dark:text-gray-100", bg: "bg-gray-50 dark:bg-gray-800" },
            { label: "إجمالي مبالغ السداد المرفوعة", value: totalPaid, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
            { label: "المبلغ المتبقي (محسوب تلقائياً)", value: remaining, color: remaining > 0 ? "text-amber-600 dark:text-amber-400" : "text-green-600 dark:text-green-400", bg: remaining > 0 ? "bg-amber-50 dark:bg-amber-900/20" : "bg-green-50 dark:bg-green-900/20" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-3`}>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">{s.label}</p>
              <p className={`text-sm font-bold ${s.color}`}>{s.value.toLocaleString("ar-SA")} ريال</p>
            </div>
          ))}
        </div>

        {/* Add Form */}
        {showAddPayment && (
          <div className="mx-5 mt-4 p-4 border border-dashed border-brand-200 dark:border-brand-800 rounded-xl bg-brand-50/20 dark:bg-brand-900/10">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">إضافة مرفق سداد جديد</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">مسمى المرفق</label>
                <input type="text" value={newPayment.name} onChange={(e) => setNewPayment({ ...newPayment, name: e.target.value })} placeholder="مثال: إيصال تحويل أبريل" className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100" />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">التاريخ</label>
                <input type="date" value={newPayment.date} onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100" />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">مبلغ السداد (ريال)</label>
                <input type="number" value={newPayment.paymentAmount || ""} onChange={(e) => setNewPayment({ ...newPayment, paymentAmount: Number(e.target.value) })} placeholder="0" className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100" />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">تاريخ السداد</label>
                <input type="date" value={newPayment.paymentDate} onChange={(e) => setNewPayment({ ...newPayment, paymentDate: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100" />
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2.5 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-brand-300 hover:bg-brand-50/30 dark:hover:bg-brand-900/10 transition-colors mb-3">
              <i className="ri-upload-cloud-line text-gray-400 dark:text-gray-500 text-sm"></i>
              <span className="text-xs text-gray-400 dark:text-gray-500">رفع صورة/ملف السداد</span>
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddPayment} className="px-4 py-2 bg-brand-500 text-white text-xs font-medium rounded-lg hover:bg-brand-600 cursor-pointer">حفظ</button>
              <button onClick={() => setShowAddPayment(false)} className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">إلغاء</button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="p-5">
          {paymentAttachments.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-10 h-10 flex items-center justify-center mx-auto mb-2">
                <i className="ri-file-list-line text-2xl text-gray-200 dark:text-gray-700"></i>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">لا توجد مرفقات سداد بعد</p>
            </div>
          ) : (
            <div className="space-y-2">
              {paymentAttachments.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3.5 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                      <i className="ri-receipt-line text-green-500 text-sm"></i>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{p.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400 dark:text-gray-500">{p.date ? new Date(p.date).toLocaleDateString("ar-SA") : "—"}</span>
                        <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">تاريخ السداد: {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString("ar-SA") : "—"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">{p.paymentAmount.toLocaleString("ar-SA")} ريال</span>
                    <button onClick={() => setPaymentAttachments(paymentAttachments.filter(x => x.id !== p.id))} className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 cursor-pointer">
                      <i className="ri-delete-bin-line text-xs"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== ط) تحديث السجل الائتماني ===== */}
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
                <input type="date" value={creditReportDate} onChange={(e) => setCreditReportDate(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100" />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 font-medium block mb-1.5">ملف التقرير</label>
                {creditReportFile ? (
                  <div className="flex items-center gap-2 px-3 py-2 border border-green-200 dark:border-green-900/50 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <i className="ri-file-pdf-line text-green-600 dark:text-green-400 text-sm"></i>
                    <span className="text-xs text-green-700 dark:text-green-400 flex-1 truncate">{creditReportFileName}</span>
                    <button onClick={() => { setCreditReportFile(null); setCreditReportFileName(""); }} className="w-5 h-5 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer flex-shrink-0">
                      <i className="ri-close-line text-xs"></i>
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 px-3 py-2.5 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-brand-300 hover:bg-brand-50/20 dark:hover:bg-brand-900/10 transition-colors">
                    <i className="ri-upload-cloud-line text-gray-400 dark:text-gray-500 text-sm"></i>
                    <span className="text-xs text-gray-400 dark:text-gray-500">اختر الملف (PDF, JPG)</span>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setCreditReportFile(URL.createObjectURL(file)); setCreditReportFileName(file.name); } }} />
                  </label>
                )}
              </div>
            </div>
            <button onClick={handleUploadCreditReport} disabled={!creditReportDate || !creditReportFile} className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors">
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
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${i === 0 ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-800"}`}>
                      <i className={`ri-file-chart-line text-sm ${i === 0 ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}`}></i>
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
    </div>
  );
}
