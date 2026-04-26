import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/pages/dashboard/components/DashboardLayout";
import {
  mockClients,
  stageLabels,
  stageColors,
  specialStatusLabels,
  specialStatusColors,
  type ClientStage,
  type ClientSpecialStatus,
} from "@/mocks/dashboardData";

const fileIcons: Record<string, string> = {
  image: "ri-image-line",
  pdf: "ri-file-pdf-line",
  doc: "ri-file-word-line",
  default: "ri-file-line",
};

const categoryColors: Record<string, string> = {
  "هوية": "bg-sky-100 text-sky-700",
  "راتب": "bg-emerald-100 text-emerald-700",
  "ائتماني": "bg-amber-100 text-amber-700",
  "مالي": "bg-brand-100 text-brand-700",
  "عقود": "bg-violet-100 text-violet-700",
  "وثائق أخرى": "bg-gray-100 text-gray-600",
};

const stageOptions: { value: ClientStage | "all"; label: string }[] = [
  { value: "all", label: "جميع المراحل" },
  { value: "new_request", label: "طلب جديد" },
  { value: "under_study", label: "تحت الدراسة" },
  { value: "awaiting_approval", label: "بانتظار موافقة العميل" },
  { value: "final_review", label: "مراجعة نهائية" },
  { value: "signing", label: "توقيع العقود" },
  { value: "execution", label: "تنفيذ" },
  { value: "collection", label: "التحصيل" },
  { value: "archived", label: "أرشفة" },
];

const categoryOptions = ["الكل", "هوية", "راتب", "ائتماني", "مالي", "عقود", "وثائق أخرى"];

interface DeleteConfirm {
  clientId: string;
  attachmentId: string;
  attachmentName: string;
}

export default function ArchivePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<ClientStage | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("الكل");
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirm | null>(null);
  const [deletedAttachments, setDeletedAttachments] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"clients" | "documents">("clients");

  // All clients with their attachments
  const allClients = useMemo(() => {
    return mockClients.filter((c) => {
      const matchSearch =
        c.fullName.includes(search) ||
        c.phone.includes(search) ||
        c.id.includes(search) ||
        c.city.includes(search) ||
        c.serviceType.includes(search);
      const matchStage = stageFilter === "all" || c.stage === stageFilter;
      return matchSearch && matchStage;
    });
  }, [search, stageFilter]);

  // All documents across all clients
  const allDocuments = useMemo(() => {
    const docs: Array<{
      clientId: string;
      clientName: string;
      clientPhone: string;
      clientStage: ClientStage;
      clientSpecialStatus?: ClientSpecialStatus;
      attachment: (typeof mockClients)[0]["attachments"][0];
    }> = [];

    mockClients.forEach((client) => {
      const matchSearch =
        client.fullName.includes(search) ||
        client.phone.includes(search) ||
        client.id.includes(search) ||
        client.attachments.some(
          (a) => a.name.includes(search) || a.category.includes(search)
        );
      const matchStage = stageFilter === "all" || client.stage === stageFilter;

      if (matchSearch && matchStage) {
        client.attachments.forEach((att) => {
          if (!deletedAttachments.has(`${client.id}-${att.id}`)) {
            const matchCat = categoryFilter === "الكل" || att.category === categoryFilter;
            if (matchCat) {
              docs.push({
                clientId: client.id,
                clientName: client.fullName,
                clientPhone: client.phone,
                clientStage: client.stage,
                clientSpecialStatus: client.specialStatus,
                attachment: att,
              });
            }
          }
        });
      }
    });
    return docs;
  }, [search, stageFilter, categoryFilter, deletedAttachments]);

  const totalAttachments = useMemo(() => {
    return mockClients.reduce((sum, c) => sum + c.attachments.length, 0);
  }, []);

  const toggleExpand = (clientId: string) => {
    setExpandedClients((prev) => {
      const next = new Set(prev);
      if (next.has(clientId)) {
        next.delete(clientId);
      } else {
        next.add(clientId);
      }
      return next;
    });
  };

  const handleDeleteAttachment = (clientId: string, attachmentId: string, attachmentName: string) => {
    setDeleteConfirm({ clientId, attachmentId, attachmentName });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setDeletedAttachments((prev) => new Set(prev).add(`${deleteConfirm.clientId}-${deleteConfirm.attachmentId}`));
      setDeleteConfirm(null);
    }
  };

  const getClientAttachments = (clientId: string) => {
    const client = mockClients.find((c) => c.id === clientId);
    if (!client) return [];
    return client.attachments.filter(
      (a) =>
        !deletedAttachments.has(`${clientId}-${a.id}`) &&
        (categoryFilter === "الكل" || a.category === categoryFilter)
    );
  };

  return (
    <DashboardLayout title="الأرشيف">
      {/* Header */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">أرشيف العملاء والمستندات</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            جميع ملفات العملاء ومستنداتهم المرفوعة — {mockClients.length} عميل · {totalAttachments} مستند
          </p>
        </div>
        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode("clients")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              viewMode === "clients"
                ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <i className="ri-folder-user-line text-sm"></i>
            عرض العملاء
          </button>
          <button
            onClick={() => setViewMode("documents")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              viewMode === "documents"
                ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <i className="ri-file-list-3-line text-sm"></i>
            عرض المستندات
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "إجمالي العملاء", value: mockClients.length, icon: "ri-group-line", color: "text-gray-700 dark:text-gray-200", bg: "bg-gray-50 dark:bg-gray-800" },
          { label: "إجمالي المستندات", value: totalAttachments, icon: "ri-file-list-3-line", color: "text-brand-600 dark:text-brand-400", bg: "bg-brand-50 dark:bg-brand-900/30" },
          { label: "عملاء بمستندات", value: mockClients.filter((c) => c.attachments.length > 0).length, icon: "ri-attachment-line", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
          { label: "عملاء بدون مستندات", value: mockClients.filter((c) => c.attachments.length === 0).length, icon: "ri-folder-open-line", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-4 border border-gray-100 dark:border-gray-800`}>
            <div className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg mb-2">
              <i className={`${stat.icon} text-sm ${stat.color}`}></i>
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 mb-5 space-y-3">
        {/* Search */}
        <div className="relative">
          <i className="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            placeholder="بحث بالاسم أو الجوال أو رقم الملف أو المدينة أو الخدمة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-9 pl-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Stage Filter */}
          <div className="flex-1">
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block font-medium">المرحلة</label>
            <div className="flex flex-wrap gap-1.5">
              {stageOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setStageFilter(o.value)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                    stageFilter === o.value
                      ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border-gray-800 dark:border-gray-200"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="sm:w-64">
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block font-medium">تصنيف المستند</label>
            <div className="flex flex-wrap gap-1.5">
              {categoryOptions.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                    categoryFilter === cat
                      ? "bg-brand-500 text-white border-brand-500"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== VIEW: CLIENTS ===== */}
      {viewMode === "clients" && (
        <div className="space-y-3">
          {allClients.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 py-16 text-center">
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <i className="ri-search-line text-3xl text-gray-200 dark:text-gray-700"></i>
              </div>
              <p className="text-gray-400 dark:text-gray-500 text-sm">لا توجد نتائج مطابقة</p>
            </div>
          ) : (
            allClients.map((client) => {
              const clientAttachments = getClientAttachments(client.id);
              const isExpanded = expandedClients.has(client.id);

              return (
                <div key={client.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                  {/* Client Row */}
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    {/* Expand Toggle */}
                    <button
                      onClick={() => toggleExpand(client.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer flex-shrink-0"
                    >
                      {isExpanded ? <i className="ri-arrow-up-s-line text-sm"></i> : <i className="ri-arrow-down-s-line text-sm"></i>}
                    </button>

                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-700 dark:text-brand-300 text-xs font-bold">
                        {client.fullName.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{client.fullName}</span>
                        <span className="font-mono text-[10px] text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{client.id}</span>
                        {client.specialStatus && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${specialStatusColors[client.specialStatus]}`}>
                            {specialStatusLabels[client.specialStatus]}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="text-xs text-gray-400 dark:text-gray-500">{client.phone}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{client.city}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{client.serviceType}</span>
                      </div>
                    </div>

                    {/* Stage Badge */}
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium whitespace-nowrap hidden sm:inline-flex ${stageColors[client.stage]}`}>
                      {stageLabels[client.stage]}
                    </span>

                    {/* Attachment Count */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-attachment-line text-sm text-gray-400 dark:text-gray-500"></i>
                      </div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{clientAttachments.length}</span>
                      <span className="hidden sm:inline">مستند</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <a
                        href={`https://wa.me/966${client.phone.replace(/^0/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors cursor-pointer"
                        title="واتساب"
                      >
                        <i className="ri-whatsapp-line text-sm"></i>
                      </a>
                      <button
                        onClick={() => navigate(`/dashboard/clients/${client.id}`)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        title="فتح الملف"
                      >
                        <i className="ri-eye-line text-sm"></i>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Attachments */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-800/30 px-4 py-4">
                      {clientAttachments.length === 0 ? (
                        <div className="text-center py-6">
                          <div className="w-8 h-8 flex items-center justify-center mx-auto mb-2">
                            <i className="ri-folder-open-line text-xl text-gray-200 dark:text-gray-700"></i>
                          </div>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {categoryFilter !== "الكل" ? `لا توجد مستندات من تصنيف "${categoryFilter}"` : "لا توجد مستندات مرفوعة"}
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                          {clientAttachments.map((att) => (
                            <div
                              key={att.id}
                              className="flex items-center gap-2.5 p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-brand-200 dark:hover:border-brand-700 transition-all group"
                            >
                              <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                                <i className={`${fileIcons[att.fileType] ?? fileIcons.default} text-gray-500 dark:text-gray-400 text-base`}></i>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">{att.name}</p>
                                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${categoryColors[att.category] ?? "bg-gray-100 text-gray-500"}`}>
                                    {att.category}
                                  </span>
                                  <span className="text-[10px] text-gray-400 dark:text-gray-500">{att.fileSize}</span>
                                </div>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                                  {att.uploadedBy} · {new Date(att.uploadedAt).toLocaleDateString("ar-SA")}
                                </p>
                              </div>
                              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                <button
                                  className="w-6 h-6 flex items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 hover:bg-brand-100 cursor-pointer"
                                  title="تحميل"
                                >
                                  <i className="ri-download-line text-xs"></i>
                                </button>
                                <button
                                  onClick={() => handleDeleteAttachment(client.id, att.id, att.name)}
                                  className="w-6 h-6 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-100 cursor-pointer"
                                  title="حذف"
                                >
                                  <i className="ri-delete-bin-line text-xs"></i>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Footer count */}
          {allClients.length > 0 && (
            <div className="text-xs text-gray-400 dark:text-gray-500 text-center py-2">
              عرض {allClients.length} من {mockClients.length} عميل
            </div>
          )}
        </div>
      )}

      {/* ===== VIEW: DOCUMENTS ===== */}
      {viewMode === "documents" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-file-list-3-line text-brand-500 text-sm"></i>
              </div>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-100">جميع المستندات</span>
              <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">{allDocuments.length}</span>
            </div>
          </div>

          {allDocuments.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <i className="ri-file-search-line text-3xl text-gray-200 dark:text-gray-700"></i>
              </div>
              <p className="text-gray-400 dark:text-gray-500 text-sm">لا توجد مستندات مطابقة</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">المستند</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">التصنيف</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">العميل</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">المرحلة</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">رُفع بواسطة</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">تاريخ الرفع</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">الحجم</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {allDocuments.map((doc) => (
                    <tr key={`${doc.clientId}-${doc.attachment.id}`} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/60 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                            <i className={`${fileIcons[doc.attachment.fileType] ?? fileIcons.default} text-gray-500 dark:text-gray-400 text-sm`}></i>
                          </div>
                          <span className="text-xs font-semibold text-gray-800 dark:text-gray-100 max-w-[160px] truncate">{doc.attachment.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${categoryColors[doc.attachment.category] ?? "bg-gray-100 text-gray-500"}`}>
                          {doc.attachment.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`/dashboard/clients/${doc.clientId}`)}
                          className="text-left cursor-pointer hover:text-brand-600 transition-colors"
                        >
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">{doc.clientName}</p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">{doc.clientId}</p>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${stageColors[doc.clientStage]}`}>
                          {stageLabels[doc.clientStage]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600 dark:text-gray-400">{doc.attachment.uploadedBy}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(doc.attachment.uploadedAt).toLocaleDateString("ar-SA", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-400 dark:text-gray-500">{doc.attachment.fileSize}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 hover:bg-brand-100 transition-colors cursor-pointer"
                            title="تحميل"
                          >
                            <i className="ri-download-line text-xs"></i>
                          </button>
                          <button
                            onClick={() => navigate(`/dashboard/clients/${doc.clientId}`)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            title="فتح ملف العميل"
                          >
                            <i className="ri-eye-line text-xs"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteAttachment(doc.clientId, doc.attachment.id, doc.attachment.name)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-100 transition-colors cursor-pointer"
                            title="حذف"
                          >
                            <i className="ri-delete-bin-line text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {allDocuments.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-500 dark:text-gray-400">إجمالي المستندات: {allDocuments.length}</span>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm">
            <div className="w-12 h-12 flex items-center justify-center bg-red-100 dark:bg-red-900/40 rounded-full mx-auto mb-4">
              <i className="ri-delete-bin-line text-red-500 dark:text-red-400 text-xl"></i>
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 text-center mb-2">تأكيد الحذف</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-1">
              هل أنت متأكد من حذف المستند:
            </p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 text-center mb-5 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
              &ldquo;{deleteConfirm.attachmentName}&rdquo;
            </p>
            <p className="text-xs text-red-500 dark:text-red-400 text-center mb-5">لا يمكن التراجع عن هذا الإجراء</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 cursor-pointer transition-colors"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
