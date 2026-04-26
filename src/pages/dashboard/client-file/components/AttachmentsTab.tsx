import { useState } from "react";
import { type Client, type ActionLog, roleLabels } from "@/mocks/dashboardData";

interface Props {
  client: Client;
}

const categoryColors: Record<string, string> = {
  "هوية": "bg-blue-100 text-blue-700",
  "راتب": "bg-green-100 text-green-700",
  "ائتماني": "bg-amber-100 text-amber-700",
  "مالي": "bg-brand-100 text-brand-700",
  "عقود": "bg-purple-100 text-purple-700",
  "وثائق أخرى": "bg-gray-100 text-gray-600",
};

const fileIcons: Record<string, string> = {
  image: "ri-image-line",
  pdf: "ri-file-pdf-line",
  doc: "ri-file-word-line",
  default: "ri-file-line",
};

const actionIcons: Record<string, string> = {
  "إنشاء الملف": "ri-add-circle-line",
  "تعيين الموظف": "ri-user-add-line",
  "تحديث البيانات": "ri-edit-line",
  "تغيير المرحلة": "ri-arrow-left-right-line",
  "موافقة العميل": "ri-check-double-line",
  "اعتماد المدير": "ri-shield-check-line",
  "رفض الملف": "ri-close-circle-line",
};

function ActionLogItem({ log }: { log: ActionLog }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center flex-shrink-0">
          <i className={`${actionIcons[log.action] ?? "ri-information-line"} text-brand-500 text-sm`}></i>
        </div>
        <div className="w-0.5 bg-gray-100 dark:bg-gray-800 flex-1 mt-1"></div>
      </div>
      <div className="pb-5 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{log.action}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500 mr-2">بواسطة {log.performedBy}</span>
            <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded mr-1">{roleLabels[log.role]}</span>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
            {new Date(log.timestamp).toLocaleDateString("ar-SA", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        {log.fromStage && log.toStage && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded">{log.fromStage}</span>
            <i className="ri-arrow-left-line text-gray-400 dark:text-gray-500 text-xs"></i>
            <span className="text-xs bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 px-2 py-0.5 rounded">{log.toStage}</span>
          </div>
        )}
        {log.note && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">{log.note}</p>
        )}
      </div>
    </div>
  );
}

export default function AttachmentsTab({ client }: Props) {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showUpload, setShowUpload] = useState(false);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  const activeAttachments = client.attachments.filter((a) => !deletedIds.has(a.id));
  const categories = Array.from(new Set(activeAttachments.map((a) => a.category)));
  const filtered = categoryFilter === "all"
    ? activeAttachments
    : activeAttachments.filter((a) => a.category === categoryFilter);

  const handleDeleteConfirm = () => {
    if (deleteConfirm) {
      setDeletedIds((prev) => new Set(prev).add(deleteConfirm.id));
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Attachments */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-attachment-line text-brand-500 text-sm"></i>
            </div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">المرفقات</h3>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">{activeAttachments.length}</span>
          </div>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900/30 cursor-pointer font-medium"
          >
            <i className="ri-upload-2-line"></i>
            رفع مرفق
          </button>
        </div>

        {/* Upload Form */}
        {showUpload && (
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-800/30">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <input type="text" placeholder="اسم المرفق" className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100" />
              <select className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 cursor-pointer bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
                <option value="">اختر التصنيف</option>
                {["هوية", "راتب", "ائتماني", "مالي", "عقود", "وثائق أخرى"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 dark:hover:bg-brand-900/10 transition-colors">
                <i className="ri-upload-cloud-line text-gray-400 dark:text-gray-500 text-sm"></i>
                <span className="text-xs text-gray-400 dark:text-gray-500">اختر الملف</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-brand-500 text-white text-xs font-medium rounded-lg hover:bg-brand-600 cursor-pointer">رفع</button>
              <button onClick={() => setShowUpload(false)} className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">إلغاء</button>
            </div>
          </div>
        )}

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`text-xs px-3 py-1.5 rounded-full font-medium cursor-pointer transition-colors ${categoryFilter === "all" ? "bg-brand-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
            >
              الكل
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium cursor-pointer transition-colors ${categoryFilter === c ? "bg-brand-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Files Grid */}
        <div className="p-5">
          {filtered.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-10 h-10 flex items-center justify-center mx-auto mb-2">
                <i className="ri-folder-open-line text-2xl text-gray-200 dark:text-gray-700"></i>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">لا توجد مرفقات</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((att) => (
                <div key={att.id} className="flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-brand-200 dark:hover:border-brand-800 hover:bg-brand-50/20 dark:hover:bg-brand-900/10 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <i className={`${fileIcons[att.fileType] ?? fileIcons.default} text-gray-500 dark:text-gray-400 text-lg`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">{att.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${categoryColors[att.category] ?? "bg-gray-100 text-gray-500"}`}>
                        {att.category}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">{att.fileSize}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                      {att.uploadedBy} · {new Date(att.uploadedAt).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600 hover:bg-brand-100 dark:hover:bg-brand-900/30 cursor-pointer">
                      <i className="ri-download-line text-xs"></i>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ id: att.id, name: att.name })}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 cursor-pointer"
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm">
            <div className="w-12 h-12 flex items-center justify-center bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-4">
              <i className="ri-delete-bin-line text-red-500 text-xl"></i>
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 text-center mb-2">تأكيد الحذف</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-1">هل أنت متأكد من حذف المستند:</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 text-center mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">&ldquo;{deleteConfirm.name}&rdquo;</p>
            <p className="text-xs text-red-500 text-center mb-5">لا يمكن التراجع عن هذا الإجراء</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-400 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 cursor-pointer"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Log */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-history-line text-brand-500 text-sm"></i>
          </div>
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">سجل الإجراءات</h3>
          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">{client.actionLogs.length}</span>
        </div>
        <div className="p-5">
          {client.actionLogs.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-6">لا توجد إجراءات مسجلة</p>
          ) : (
            <div>
              {[...client.actionLogs].reverse().map((log) => (
                <ActionLogItem key={log.id} log={log} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
