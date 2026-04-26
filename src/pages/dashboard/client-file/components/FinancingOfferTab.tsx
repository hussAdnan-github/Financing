import { useState } from "react";
import { type Client } from "@/mocks/dashboardData";

interface Props {
  client: Client;
}

interface FinancingEntry {
  id: string;
  installment: number;
  netFinancingAmount: number;
  financingType: string;
  profitRate: number;
  providerName: string;
  providerProfit: number;
}

interface PriceOffer {
  initialFile: string | null;
  initialFileName: string;
  finalFile: string | null;
  finalFileName: string;
}

const contractTypes = [
  "عرض قرض حسن",
  "مخالصة",
  "سند لأمر",
  "سند قبض",
  "سند استلام",
];

function FinancingEntryCard({
  entry,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: {
  entry: FinancingEntry;
  index: number;
  onUpdate: (id: string, data: Partial<FinancingEntry>) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}) {
  const [editMode, setEditMode] = useState(!entry.installment && !entry.netFinancingAmount);

  const fields: { label: string; key: keyof FinancingEntry; type: string; suffix?: string }[] = [
    { label: "القسط الشهري", key: "installment", type: "number", suffix: "ريال" },
    { label: "مبلغ صافي التمويل", key: "netFinancingAmount", type: "number", suffix: "ريال" },
    { label: "نوع التمويل", key: "financingType", type: "text" },
    { label: "نسبة الربح", key: "profitRate", type: "number", suffix: "%" },
    { label: "مسمى الجهة المانحة", key: "providerName", type: "text" },
    { label: "ربح الجهة المانحة", key: "providerProfit", type: "number", suffix: "ريال" },
  ];

  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50/60 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{index + 1}</span>
          </div>
          <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100">عرض التمويل الأساسي {index + 1}</h4>
          {index === 0 && (
            <span className="text-[10px] bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 px-2 py-0.5 rounded-full font-medium">الرئيسي</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors whitespace-nowrap ${
              editMode ? "bg-brand-500 text-white" : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <i className={editMode ? "ri-save-line" : "ri-edit-line"}></i>
            {editMode ? "حفظ" : "تعديل"}
          </button>
          {canRemove && (
            <button
              onClick={() => onRemove(entry.id)}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 cursor-pointer"
            >
              <i className="ri-delete-bin-line text-xs"></i>
            </button>
          )}
        </div>
      </div>

      {/* Fields */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium block mb-1.5">{f.label}</label>
            {editMode ? (
              <div className="relative">
                <input
                  type={f.type}
                  value={entry[f.key] as string | number}
                  onChange={(e) =>
                    onUpdate(entry.id, {
                      [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value,
                    })
                  }
                  className={`w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 ${f.suffix ? "pl-12" : ""}`}
                />
                {f.suffix && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500">{f.suffix}</span>
                )}
              </div>
            ) : (
              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {f.type === "number"
                    ? `${Number(entry[f.key]).toLocaleString("ar-SA")} ${f.suffix ?? ""}`
                    : String(entry[f.key]) || <span className="text-gray-300 dark:text-gray-600 font-normal text-xs">لم يُدخل</span>}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary bar when not editing */}
      {!editMode && entry.installment > 0 && (
        <div className="mx-4 mb-4 grid grid-cols-3 gap-2">
          {[
            { label: "القسط", value: `${entry.installment.toLocaleString("ar-SA")} ريال`, color: "text-brand-700 dark:text-brand-400", bg: "bg-brand-50 dark:bg-brand-900/20" },
            { label: "صافي التمويل", value: `${entry.netFinancingAmount.toLocaleString("ar-SA")} ريال`, color: "text-green-700 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
            { label: "نسبة الربح", value: `${entry.profitRate}%`, color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-lg px-3 py-2 text-center`}>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">{s.label}</p>
              <p className={`text-xs font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FinancingOfferTab({ client }: Props) {
  // عروض التمويل المتعددة
  const [financingEntries, setFinancingEntries] = useState<FinancingEntry[]>(() => {
    if (client.financingOffer) {
      return [{
        id: "entry-1",
        installment: client.financingOffer.installment,
        netFinancingAmount: client.financingOffer.netFinancingAmount,
        financingType: client.financingOffer.financingType,
        profitRate: client.financingOffer.profitRate,
        providerName: client.financingOffer.providerName,
        providerProfit: client.financingOffer.providerProfit,
      }];
    }
    return [{ id: "entry-1", installment: 0, netFinancingAmount: 0, financingType: "", profitRate: 0, providerName: "", providerProfit: 0 }];
  });

  // عرض السعر
  const [priceOffer, setPriceOffer] = useState<PriceOffer>({
    initialFile: client.financingOffer?.initialOfferFile ?? null,
    initialFileName: client.financingOffer?.initialOfferFile ? "عرض_سعر_مبدئي.pdf" : "",
    finalFile: client.financingOffer?.finalOfferFile ?? null,
    finalFileName: client.financingOffer?.finalOfferFile ? "عرض_سعر_نهائي.pdf" : "",
  });

  // العقود
  const [contracts, setContracts] = useState(
    client.contracts ?? contractTypes.map((t, i) => ({
      id: `c${i}`,
      type: t,
      status: "pending_upload" as const,
    }))
  );

  const addFinancingEntry = () => {
    setFinancingEntries([
      ...financingEntries,
      { id: `entry-${Date.now()}`, installment: 0, netFinancingAmount: 0, financingType: "", profitRate: 0, providerName: "", providerProfit: 0 },
    ]);
  };

  const updateEntry = (id: string, data: Partial<FinancingEntry>) => {
    setFinancingEntries(financingEntries.map((e) => (e.id === id ? { ...e, ...data } : e)));
  };

  const removeEntry = (id: string) => {
    setFinancingEntries(financingEntries.filter((e) => e.id !== id));
  };

  const handleContractStatusChange = (id: string, status: "pending_upload" | "uploaded" | "signed") => {
    setContracts(contracts.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const effectiveOffer = priceOffer.finalFile ?? priceOffer.initialFile;

  return (
    <div className="space-y-5">

      {/* ===== عروض التمويل ===== */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-calculator-line text-brand-500 text-sm"></i>
            </div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">عروض التمويل (الحسبة)</h3>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">{financingEntries.length} عرض</span>
          </div>
          <button
            onClick={addFinancingEntry}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900/30 cursor-pointer font-medium whitespace-nowrap"
          >
            <i className="ri-add-line"></i>
            إضافة عرض تمويل
          </button>
        </div>
        <div className="p-5 space-y-4">
          {financingEntries.map((entry, index) => (
            <FinancingEntryCard
              key={entry.id}
              entry={entry}
              index={index}
              onUpdate={updateEntry}
              onRemove={removeEntry}
              canRemove={financingEntries.length > 1}
            />
          ))}
        </div>
      </div>

      {/* ===== عرض السعر ===== */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-price-tag-3-line text-brand-500 text-sm"></i>
          </div>
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">عرض السعر</h3>
          {!priceOffer.finalFile && priceOffer.initialFile && (
            <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">يُعتمد المبدئي تلقائياً</span>
          )}
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* عرض السعر المبدئي */}
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-2 flex items-center gap-1.5">
                <i className="ri-file-list-2-line text-gray-400 dark:text-gray-500"></i>
                عرض السعر المبدئي
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal">(يُستخدم عند غياب النهائي)</span>
              </p>
              {priceOffer.initialFile ? (
                <div className="flex items-center gap-3 p-3 border border-brand-100 dark:border-brand-900/50 rounded-xl bg-brand-50/30 dark:bg-brand-900/10">
                  <div className="w-9 h-9 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                    <i className="ri-file-pdf-line text-brand-600 dark:text-brand-400 text-sm"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{priceOffer.initialFileName}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">عرض السعر المبدئي</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600 hover:bg-brand-100 dark:hover:bg-brand-900/30 cursor-pointer">
                      <i className="ri-download-line text-xs"></i>
                    </button>
                    <button
                      onClick={() => setPriceOffer({ ...priceOffer, initialFile: null, initialFileName: "" })}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 cursor-pointer"
                    >
                      <i className="ri-delete-bin-line text-xs"></i>
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-brand-300 hover:bg-brand-50/20 dark:hover:bg-brand-900/10 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <i className="ri-upload-cloud-2-line text-gray-400 dark:text-gray-500 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">رفع عرض السعر المبدئي</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">PDF, JPG, PNG</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setPriceOffer({ ...priceOffer, initialFile: URL.createObjectURL(file), initialFileName: file.name });
                    }}
                  />
                </label>
              )}
            </div>

            {/* عرض السعر النهائي */}
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-2 flex items-center gap-1.5">
                <i className="ri-file-check-line text-green-500"></i>
                عرض السعر النهائي
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal">(يُعتمد عند توفره)</span>
              </p>
              {priceOffer.finalFile ? (
                <div className="flex items-center gap-3 p-3 border border-green-100 dark:border-green-900/50 rounded-xl bg-green-50/30 dark:bg-green-900/10">
                  <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <i className="ri-file-pdf-line text-green-600 dark:text-green-400 text-sm"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{priceOffer.finalFileName}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">عرض السعر النهائي</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600 hover:bg-brand-100 dark:hover:bg-brand-900/30 cursor-pointer">
                      <i className="ri-download-line text-xs"></i>
                    </button>
                    <button
                      onClick={() => setPriceOffer({ ...priceOffer, finalFile: null, finalFileName: "" })}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 cursor-pointer"
                    >
                      <i className="ri-delete-bin-line text-xs"></i>
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-green-300 hover:bg-green-50/20 dark:hover:bg-green-900/10 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <i className="ri-upload-cloud-2-line text-gray-400 dark:text-gray-500 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">رفع عرض السعر النهائي</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">PDF, JPG, PNG</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setPriceOffer({ ...priceOffer, finalFile: URL.createObjectURL(file), finalFileName: file.name });
                    }}
                  />
                </label>
              )}
            </div>
          </div>

          {/* العرض المعتمد */}
          {effectiveOffer && (
            <div className="mt-4 flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 rounded-xl px-4 py-3">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-check-double-line text-green-600 dark:text-green-400 text-sm"></i>
              </div>
              <span className="text-sm text-green-700 dark:text-green-400 font-semibold">
                العرض المعتمد: {priceOffer.finalFile ? "عرض السعر النهائي" : "عرض السعر المبدئي"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ===== العقود ===== */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-file-paper-2-line text-brand-500 text-sm"></i>
          </div>
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">العقود والمستندات</h3>
          <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
            {contracts.filter((c) => c.status === "signed").length}/{contracts.length} موقّع
          </span>
        </div>
        <div className="p-5">
          {/* التعبئة الآلية */}
          <div className="flex items-start gap-3 bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-900/50 rounded-xl px-4 py-3 mb-5">
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="ri-magic-line text-brand-500 text-sm"></i>
            </div>
            <div>
              <p className="text-xs font-semibold text-brand-800 dark:text-brand-300 mb-1">التعبئة الآلية للبيانات</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {[
                  { label: "اسم العميل", value: client.fullName },
                  { label: "رقم الهوية", value: client.nationalIdNumber ?? "—" },
                  { label: "رقم الجوال", value: client.phone },
                  { label: "التاريخ", value: new Date().toLocaleDateString("ar-SA") },
                ].map((item) => (
                  <span key={item.label} className="text-xs text-brand-700 dark:text-brand-400">
                    <span className="text-brand-400 dark:text-brand-500">{item.label}: </span>
                    <strong>{item.value}</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* قائمة العقود */}
          <div className="space-y-3">
            {contracts.map((contract) => (
              <div key={contract.id} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      contract.status === "signed" ? "bg-green-50 dark:bg-green-900/20" :
                      contract.status === "uploaded" ? "bg-brand-50 dark:bg-brand-900/20" : "bg-gray-100 dark:bg-gray-800"
                    }`}>
                      <i className={`text-base ${
                        contract.status === "signed" ? "ri-file-check-line text-green-500" :
                        contract.status === "uploaded" ? "ri-file-pdf-line text-brand-500" :
                        "ri-file-line text-gray-400 dark:text-gray-500"
                      }`}></i>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{contract.type}</p>
                      {contract.uploadedAt && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(contract.uploadedAt).toLocaleDateString("ar-SA")}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${
                      contract.status === "signed" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
                      contract.status === "uploaded" ? "bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400" :
                      "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                    }`}>
                      {contract.status === "signed" ? "موقّع" : contract.status === "uploaded" ? "مرفوع للتوقيع" : "بانتظار الرفع"}
                    </span>

                    {/* زر رفع للتوقيع */}
                    {contract.status === "pending_upload" && (
                      <label className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900/30 cursor-pointer font-medium whitespace-nowrap">
                        <i className="ri-upload-2-line"></i>
                        رفع للتوقيع
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={() => handleContractStatusChange(contract.id, "uploaded")}
                        />
                      </label>
                    )}

                    {/* زر رفع الموقّع */}
                    {contract.status === "uploaded" && (
                      <label className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 cursor-pointer font-medium whitespace-nowrap">
                        <i className="ri-check-line"></i>
                        رفع الموقّع
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={() => handleContractStatusChange(contract.id, "signed")}
                        />
                      </label>
                    )}

                    {/* تحميل الموقّع */}
                    {contract.status === "signed" && (
                      <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer font-medium whitespace-nowrap">
                        <i className="ri-download-line"></i>
                        تحميل
                      </button>
                    )}
                  </div>
                </div>

                {/* شريط التقدم للعقد */}
                <div className="px-4 pb-3">
                  <div className="flex items-center gap-2">
                    {["pending_upload", "uploaded", "signed"].map((s, i) => (
                      <div key={s} className="flex items-center gap-2 flex-1">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          (contract.status === "uploaded" && i <= 1) ||
                          (contract.status === "signed" && i <= 2) ||
                          (contract.status === "pending_upload" && i === 0)
                            ? "bg-brand-500"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}></div>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
                          {s === "pending_upload" ? "بانتظار الرفع" : s === "uploaded" ? "مرفوع" : "موقّع"}
                        </span>
                        {i < 2 && <div className={`flex-1 h-px ${
                          (contract.status === "uploaded" && i === 0) ||
                          (contract.status === "signed")
                            ? "bg-brand-300"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}></div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
