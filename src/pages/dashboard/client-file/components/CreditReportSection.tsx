import { useState } from "react";
import { type CreditReport } from "@/mocks/dashboardData";

interface Props {
  title: string;
  icon: string;
  creditReport?: CreditReport;
  compact?: boolean;
}

function SectionToggle({ title, icon, children, defaultOpen = true }: {
  title: string; icon: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50/60 dark:bg-gray-800/60 hover:bg-gray-100/60 dark:hover:bg-gray-800 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className={`${icon} text-brand-500 text-sm`}></i>
          </div>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{title}</span>
        </div>
        {open ? <i className="ri-arrow-up-s-line text-gray-400 dark:text-gray-500"></i> : <i className="ri-arrow-down-s-line text-gray-400 dark:text-gray-500"></i>}
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
}

function EditableTable({
  rows,
  columns,
  onAdd,
}: {
  rows: Record<string, string | number>[];
  columns: { key: string; label: string; type?: string }[];
  onAdd?: () => void;
}) {
  const [data, setData] = useState(rows);
  const [adding, setAdding] = useState(false);
  const [newRow, setNewRow] = useState<Record<string, string>>({});

  const handleAdd = () => {
    setData([...data, newRow]);
    setNewRow({});
    setAdding(false);
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              {columns.map((c) => (
                <th key={c.key} className="text-right pb-2 pr-2 text-gray-500 dark:text-gray-400 font-semibold whitespace-nowrap">{c.label}</th>
              ))}
              <th className="pb-2 pr-2 text-gray-500 dark:text-gray-400 font-semibold w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                {columns.map((c) => (
                  <td key={c.key} className="py-2.5 pr-2 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {typeof row[c.key] === "number"
                      ? `${(row[c.key] as number).toLocaleString("ar-SA")} ريال`
                      : String(row[c.key] ?? "—")}
                  </td>
                ))}
                <td className="py-2.5 pr-2">
                  <button
                    onClick={() => setData(data.filter((_, idx) => idx !== i))}
                    className="w-6 h-6 flex items-center justify-center rounded text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                  >
                    <i className="ri-delete-bin-line text-xs"></i>
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && !adding && (
              <tr>
                <td colSpan={columns.length + 1} className="py-4 text-center text-xs text-gray-400 dark:text-gray-500">لا توجد بيانات</td>
              </tr>
            )}
            {adding && (
              <tr className="bg-brand-50/30 dark:bg-brand-900/10">
                {columns.map((c) => (
                  <td key={c.key} className="py-2 pr-2">
                    <input
                      type={c.type ?? "text"}
                      placeholder={c.label}
                      value={newRow[c.key] ?? ""}
                      onChange={(e) => setNewRow({ ...newRow, [c.key]: e.target.value })}
                      className="w-full px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 min-w-[80px]"
                    />
                  </td>
                ))}
                <td className="py-2 pr-2">
                  <button onClick={handleAdd} className="w-6 h-6 flex items-center justify-center rounded bg-brand-500 text-white cursor-pointer">
                    <i className="ri-check-line text-xs"></i>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {onAdd && (
        <button
          onClick={() => setAdding(true)}
          className="mt-2 flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 cursor-pointer"
        >
          <i className="ri-add-line"></i>
          إضافة صف
        </button>
      )}
    </div>
  );
}

export default function CreditReportSection({ title, icon, creditReport, compact = false }: Props) {
  const [enabled, setEnabled] = useState(!!creditReport);
  const [reportDate, setReportDate] = useState(creditReport?.reportDate ?? "");
  const [reportFile, setReportFile] = useState<string | null>(null);
  const [reportFileName, setReportFileName] = useState<string>("");
  const cr = creditReport;

  const formatDate = (d: string) => {
    if (!d) return "";
    const dt = new Date(d);
    return `${dt.getFullYear()}.${dt.getMonth() + 1}.${dt.getDate()}`;
  };

  const totalDefaultSummary = cr?.defaultSummary?.reduce((s, i) => s + i.amount, 0) ?? 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className={`${icon} text-brand-500 text-sm`}></i>
          </div>
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">{title}</h3>
        </div>
        <div className="flex items-center gap-3">
          {enabled && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">تاريخ التقرير:</span>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 focus:outline-none focus:border-brand-400 cursor-pointer bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
              />
              {reportDate && (
                <span className="text-xs font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded">
                  {formatDate(reportDate)}
                </span>
              )}
            </div>
          )}
          <button
            onClick={() => setEnabled(!enabled)}
            className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${enabled ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${enabled ? "right-0.5" : "left-0.5"}`}></span>
          </button>
        </div>
      </div>

      {!enabled ? (
        <div className="p-6 text-center">
          <div className="w-10 h-10 flex items-center justify-center mx-auto mb-2">
            <i className="ri-file-chart-line text-2xl text-gray-200 dark:text-gray-700"></i>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">فعّل هذا القسم لإدخال بيانات التقرير الائتماني</p>
        </div>
      ) : (
        <div className="p-5 space-y-1">

          {/* حقل رفع مرفق التقرير */}
          <div className="mb-4 p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/40 dark:bg-gray-800/30">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
              <i className="ri-attachment-2 text-brand-500"></i>
              مرفق التقرير الائتماني
            </p>
            {reportFile ? (
              <div className="flex items-center gap-3 p-3 border border-green-100 dark:border-green-900/50 rounded-xl bg-green-50/40 dark:bg-green-900/10">
                <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <i className="ri-file-pdf-line text-green-600 dark:text-green-400 text-sm"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{reportFileName}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">تم الرفع بتاريخ: {new Date().toLocaleDateString("ar-SA")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600 hover:bg-brand-100 dark:hover:bg-brand-900/30 cursor-pointer">
                    <i className="ri-download-line text-xs"></i>
                  </button>
                  <button
                    onClick={() => { setReportFile(null); setReportFileName(""); }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 cursor-pointer"
                  >
                    <i className="ri-delete-bin-line text-xs"></i>
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-brand-300 hover:bg-brand-50/20 dark:hover:bg-brand-900/10 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center flex-shrink-0">
                  <i className="ri-upload-cloud-2-line text-brand-500 text-sm"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">رفع ملف التقرير الائتماني</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">PDF, JPG, PNG — الحجم الأقصى 10MB</p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setReportFile(URL.createObjectURL(file));
                      setReportFileName(file.name);
                    }
                  }}
                />
              </label>
            )}
          </div>

          {/* Summary Cards */}
          {cr && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "إجمالي الالتزامات النشطة", value: `${cr.totalActiveObligations.toLocaleString("ar-SA")} ريال`, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
                { label: "إجمالي المتعثرات", value: `${cr.totalDefaulted.toLocaleString("ar-SA")} ريال`, color: cr.totalDefaulted > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400", bg: cr.totalDefaulted > 0 ? "bg-red-50 dark:bg-red-900/20" : "bg-green-50 dark:bg-green-900/20" },
                { label: "درجة الائتمان", value: cr.creditScore.toString(), color: cr.creditScore >= 700 ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400", bg: cr.creditScore >= 700 ? "bg-green-50 dark:bg-green-900/20" : "bg-amber-50 dark:bg-amber-900/20" },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} rounded-xl p-3`}>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">{s.label}</p>
                  <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* ملخص المنتجات النشطة */}
          <SectionToggle title="ملخص المنتجات النشطة" icon="ri-checkbox-circle-line" defaultOpen={!compact}>
            <EditableTable
              rows={(cr?.activeProducts ?? []).map(p => ({ "نوع المنتج": p.type, "الجهة المانحة": p.provider, "المبلغ المتبقي": p.remainingAmount, "حالة السداد": p.paymentStatus, "المبلغ بعد التحقق": p.verifiedAmount }))}
              columns={[
                { key: "نوع المنتج", label: "نوع المنتج" },
                { key: "الجهة المانحة", label: "الجهة المانحة" },
                { key: "المبلغ المتبقي", label: "المبلغ المتبقي", type: "number" },
                { key: "حالة السداد", label: "حالة السداد" },
                { key: "المبلغ بعد التحقق", label: "المبلغ بعد التحقق", type: "number" },
              ]}
              onAdd={() => {}}
            />
          </SectionToggle>

          <SectionToggle title="المنتجات النشطة المكفولة" icon="ri-shield-user-line" defaultOpen={false}>
            <EditableTable
              rows={(cr?.guaranteedProducts ?? []).map(p => ({ "نوع المنتج": p.type, "الجهة المانحة": p.provider, "المبلغ المتبقي": p.remainingAmount, "حالة السداد": p.paymentStatus, "المبلغ بعد التحقق": p.verifiedAmount }))}
              columns={[
                { key: "نوع المنتج", label: "نوع المنتج" },
                { key: "الجهة المانحة", label: "الجهة المانحة" },
                { key: "المبلغ المتبقي", label: "المبلغ المتبقي", type: "number" },
                { key: "حالة السداد", label: "حالة السداد" },
                { key: "المبلغ بعد التحقق", label: "المبلغ بعد التحقق", type: "number" },
              ]}
              onAdd={() => {}}
            />
          </SectionToggle>

          <SectionToggle title="منتجات اشتري الآن وادفع لاحقاً" icon="ri-shopping-cart-line" defaultOpen={false}>
            <EditableTable
              rows={(cr?.bnplProducts ?? []).map(p => ({ "حالة المنتج": p.status, "المبلغ المتبقي": p.remainingAmount }))}
              columns={[
                { key: "حالة المنتج", label: "حالة المنتج" },
                { key: "المبلغ المتبقي", label: "المبلغ المتبقي", type: "number" },
              ]}
              onAdd={() => {}}
            />
          </SectionToggle>

          <SectionToggle title="ملخص المنتجات المتعثرة" icon="ri-error-warning-line" defaultOpen={false}>
            <EditableTable
              rows={(cr?.defaultedProducts ?? []).map(p => ({ "نوع المنتج": p.type, "الجهة المانحة": p.provider, "المبلغ المتعثر": p.remainingAmount, "حالة التعثر": p.paymentStatus, "المبلغ بعد التحقق": p.verifiedAmount }))}
              columns={[
                { key: "نوع المنتج", label: "نوع المنتج" },
                { key: "الجهة المانحة", label: "الجهة المانحة" },
                { key: "المبلغ المتعثر", label: "المبلغ المتعثر", type: "number" },
                { key: "حالة التعثر", label: "حالة التعثر" },
                { key: "المبلغ بعد التحقق", label: "المبلغ بعد التحقق", type: "number" },
              ]}
              onAdd={() => {}}
            />
          </SectionToggle>

          <SectionToggle title="المنتجات المتعثرة المكفولة" icon="ri-shield-cross-line" defaultOpen={false}>
            <EditableTable
              rows={(cr?.guaranteedDefaulted ?? []).map(p => ({ "نوع المنتج": p.type, "الجهة المانحة": p.provider, "المبلغ المتعثر": p.remainingAmount, "حالة التعثر": p.paymentStatus, "المبلغ بعد التحقق": p.verifiedAmount }))}
              columns={[
                { key: "نوع المنتج", label: "نوع المنتج" },
                { key: "الجهة المانحة", label: "الجهة المانحة" },
                { key: "المبلغ المتعثر", label: "المبلغ المتعثر", type: "number" },
                { key: "حالة التعثر", label: "حالة التعثر" },
                { key: "المبلغ بعد التحقق", label: "المبلغ بعد التحقق", type: "number" },
              ]}
              onAdd={() => {}}
            />
          </SectionToggle>

          <SectionToggle title="الشيكات المرتجعة" icon="ri-bank-card-line" defaultOpen={false}>
            <EditableTable
              rows={(cr?.bouncedChecks ?? []).map(p => ({ "البنك": p.bank, "المبلغ المتبقي": p.remainingAmount, "حالة الشيك": p.status }))}
              columns={[
                { key: "البنك", label: "البنك" },
                { key: "المبلغ المتبقي", label: "المبلغ المتبقي", type: "number" },
                { key: "حالة الشيك", label: "حالة الشيك" },
              ]}
              onAdd={() => {}}
            />
          </SectionToggle>

          <SectionToggle title="الاستعلامات الأخيرة" icon="ri-search-eye-line" defaultOpen={false}>
            <EditableTable
              rows={(cr?.recentInquiries ?? []).map(p => ({ "تاريخ الاستعلام": p.date, "المستعلِم": p.inquirer, "نوع المنتج": p.productType, "المبلغ": p.amount }))}
              columns={[
                { key: "تاريخ الاستعلام", label: "تاريخ الاستعلام", type: "date" },
                { key: "المستعلِم", label: "المستعلِم" },
                { key: "نوع المنتج", label: "نوع المنتج" },
                { key: "المبلغ", label: "المبلغ", type: "number" },
              ]}
              onAdd={() => {}}
            />
          </SectionToggle>

          <SectionToggle title="قرارات محاكم التنفيذ" icon="ri-scales-3-line" defaultOpen={false}>
            <EditableTable
              rows={(cr?.executionDecisions ?? []).map(p => ({ "تاريخ القرار": p.decisionDate, "تاريخ الإدراج": p.registrationDate, "المبلغ المتبقي": p.remainingAmount, "حالة التنفيذ": p.executionStatus, "تاريخ التسوية": p.settlementDate ?? "—" }))}
              columns={[
                { key: "تاريخ القرار", label: "تاريخ القرار", type: "date" },
                { key: "تاريخ الإدراج", label: "تاريخ الإدراج", type: "date" },
                { key: "المبلغ المتبقي", label: "المبلغ المتبقي", type: "number" },
                { key: "حالة التنفيذ", label: "حالة التنفيذ" },
                { key: "تاريخ التسوية", label: "تاريخ التسوية", type: "date" },
              ]}
              onAdd={() => {}}
            />
          </SectionToggle>

          <SectionToggle title="ملخص متعثرات العميل" icon="ri-funds-line" defaultOpen={false}>
            <EditableTable
              rows={(cr?.defaultSummary ?? []).map(p => ({ "مسمى البند": p.title, "المبلغ": p.amount }))}
              columns={[
                { key: "مسمى البند", label: "مسمى البند" },
                { key: "المبلغ", label: "المبلغ", type: "number" },
              ]}
              onAdd={() => {}}
            />
            {(cr?.defaultSummary?.length ?? 0) > 0 && (
              <div className="mt-3 flex items-center justify-between bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-2.5">
                <span className="text-xs font-semibold text-red-700 dark:text-red-400">إجمالي السداد (محسوب تلقائياً)</span>
                <span className="text-sm font-bold text-red-700 dark:text-red-400">{totalDefaultSummary.toLocaleString("ar-SA")} ريال</span>
              </div>
            )}
          </SectionToggle>
        </div>
      )}
    </div>
  );
}
