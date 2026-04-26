import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/pages/dashboard/components/DashboardLayout";
import { useToast } from "@/hooks/useToast";
import { useDashboardDarkMode } from "@/pages/dashboard/context/DashboardDarkModeContext";
import {
  mockClients,
  stageLabels,
  stageColors,
  type ReviewStatus,
  type ReviewDeficiency,
  type Client,
} from "@/mocks/dashboardData";

const reviewStatusLabels: Record<ReviewStatus, string> = {
  pending: "بانتظار المراجعة",
  approved: "تمت الموافقة",
  rejected: "مرفوض",
  returned: "مردود للتصحيح",
};

const reviewStatusColors: Record<ReviewStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  returned: "bg-orange-100 text-orange-700",
};

const severityLabels = { high: "عالي", medium: "متوسط", low: "منخفض" };
const severityColors = { high: "bg-red-100 text-red-700", medium: "bg-amber-100 text-amber-700", low: "bg-sky-100 text-sky-700" };

export default function AuditorReviewPage() {
  const { success, error: toastError, warning } = useToast();
  const { isDark } = useDashboardDarkMode();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | "all">("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | "return">("approve");
  const [reviewNote, setReviewNote] = useState("");
  const [deficiencies, setDeficiencies] = useState<ReviewDeficiency[]>([]);
  const [newDefCategory, setNewDefCategory] = useState("");
  const [newDefDesc, setNewDefDesc] = useState("");
  const [newDefSeverity, setNewDefSeverity] = useState<"high" | "medium" | "low">("medium");
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

  const reviewableClients = useMemo(() => {
    return mockClients.filter((c) => c.reviewStatus !== undefined && !c.specialStatus);
  }, []);

  const filteredClients = useMemo(() => {
    return reviewableClients.filter((c) => {
      const matchSearch =
        c.fullName.includes(search) || c.phone.includes(search) || c.id.includes(search);
      const matchStatus = statusFilter === "all" || c.reviewStatus === statusFilter;
      const matchTab = activeTab === "pending"
        ? (c.reviewStatus === "pending" || c.reviewStatus === "returned")
        : (c.reviewStatus === "approved" || c.reviewStatus === "rejected");
      return matchSearch && matchStatus && matchTab;
    });
  }, [reviewableClients, search, statusFilter, activeTab]);

  const stats = useMemo(() => {
    const pending = reviewableClients.filter((c) => c.reviewStatus === "pending").length;
    const returned = reviewableClients.filter((c) => c.reviewStatus === "returned").length;
    const approved = reviewableClients.filter((c) => c.reviewStatus === "approved").length;
    const rejected = reviewableClients.filter((c) => c.reviewStatus === "rejected").length;
    return { pending, returned, approved, rejected, total: reviewableClients.length };
  }, [reviewableClients]);

  const openReviewModal = (client: Client, action: "approve" | "reject" | "return") => {
    setSelectedClient(client);
    setReviewAction(action);
    setReviewNote("");
    setDeficiencies(client.reviewDeficiencies || []);
    setShowReviewModal(true);
  };

  const addDeficiency = () => {
    if (!newDefCategory || !newDefDesc) return;
    const newDef: ReviewDeficiency = {
      id: `d${Date.now()}`,
      category: newDefCategory,
      description: newDefDesc,
      severity: newDefSeverity,
      resolved: false,
    };
    setDeficiencies((prev) => [...prev, newDef]);
    setNewDefCategory("");
    setNewDefDesc("");
    setNewDefSeverity("medium");
  };

  const removeDeficiency = (id: string) => {
    setDeficiencies((prev) => prev.filter((d) => d.id !== id));
  };

  const submitReview = () => {
    if (!selectedClient) return;
    if (reviewAction === "return" && deficiencies.length === 0) {
      toastError("يرجى إضافة نقص واحد على الأقل قبل الردّ");
      return;
    }
    if (reviewAction === "reject" && !reviewNote.trim()) {
      toastError("يرجى كتابة سبب الرفض");
      return;
    }
    if (reviewAction === "approve") {
      success(`تمت الموافقة على ملف ${selectedClient.fullName}`, "سيُحوَّل الملف لاعتماد المدير");
    } else if (reviewAction === "return") {
      warning(`تم ردّ ملف ${selectedClient.fullName} للتصحيح`, `${deficiencies.length} نواقص مطلوبة`);
    } else {
      toastError(`تم رفض ملف ${selectedClient.fullName}`, reviewNote);
    }
    setShowReviewModal(false);
    setSelectedClient(null);
    setReviewNote("");
    setDeficiencies([]);
  };

  const getDocumentStatus = (client: Client, category: string) => {
    const hasDoc = client.attachments.some((a) => a.category === category);
    return hasDoc ? "موجود" : "مفقود";
  };

  const getDocumentStatusColor = (client: Client, category: string) => {
    const hasDoc = client.attachments.some((a) => a.category === category);
    return hasDoc ? "text-emerald-600" : "text-red-500";
  };

  const inputCls = `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300 transition-colors ${isDark ? "bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-500" : "bg-white border-gray-200"}`;
  const selectCls = `px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 transition-colors ${isDark ? "bg-gray-800 border-gray-600 text-gray-200" : "bg-white border-gray-200"}`;

  return (
    <DashboardLayout title="مراجعة المدقق">
      {/* Review Modal */}
      {showReviewModal && selectedClient && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className={`rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-colors ${isDark ? "bg-gray-900 border border-gray-700" : "bg-white shadow-xl"}`}>
            <div className={`px-6 py-4 border-b flex items-center justify-between sticky top-0 rounded-t-xl transition-colors ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
              <div>
                <h3 className={`text-base font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                  {reviewAction === "approve" && "الموافقة على الملف"}
                  {reviewAction === "reject" && "رفض الملف"}
                  {reviewAction === "return" && "ردّ الملف للتصحيح"}
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{selectedClient.fullName} — {selectedClient.id}</p>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors ${isDark ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Document Checklist */}
              <div>
                <h4 className={`text-xs font-bold mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>قائمة الوثائق المطلوبة</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "صورة الهوية الوطنية", category: "هوية" },
                    { label: "كشف الراتب / تعريف الراتب", category: "راتب" },
                    { label: "التقرير الائتماني", category: "ائتماني" },
                    { label: "حسبة التمويل", category: "مالي" },
                  ].map((doc) => (
                    <div key={doc.category} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                      <i className={`ri-checkbox-circle-line ${getDocumentStatusColor(selectedClient, doc.category)}`}></i>
                      <span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>{doc.label}</span>
                      <span className={`text-[10px] mr-auto ${getDocumentStatusColor(selectedClient, doc.category)}`}>
                        {getDocumentStatus(selectedClient, doc.category)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deficiencies */}
              {(reviewAction === "return" || reviewAction === "reject") && (
                <div>
                  <h4 className={`text-xs font-bold mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {reviewAction === "return" ? "النواقص المطلوب تصحيحها" : "أسباب الرفض"}
                  </h4>
                  {deficiencies.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {deficiencies.map((def) => (
                        <div key={def.id} className={`flex items-start gap-2 px-3 py-2 rounded-lg border ${isDark ? "bg-red-900/20 border-red-800/40" : "bg-red-50 border-red-100"}`}>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${severityColors[def.severity]}`}>
                            {severityLabels[def.severity]}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>{def.description}</p>
                            <p className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>{def.category}</p>
                          </div>
                          <button
                            onClick={() => removeDeficiency(def.id)}
                            className="w-5 h-5 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer flex-shrink-0"
                          >
                            <i className="ri-close-line text-sm"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className={`text-[10px] mb-1 block ${isDark ? "text-gray-400" : "text-gray-500"}`}>الفئة</label>
                      <select
                        value={newDefCategory}
                        onChange={(e) => setNewDefCategory(e.target.value)}
                        className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 transition-colors ${isDark ? "bg-gray-800 border-gray-600 text-gray-200" : "border-gray-200"}`}
                      >
                        <option value="">اختر...</option>
                        <option value="هوية">هوية</option>
                        <option value="راتب">راتب</option>
                        <option value="ائتماني">ائتماني</option>
                        <option value="مالي">مالي</option>
                        <option value="عقود">عقود</option>
                        <option value="بيانات">بيانات</option>
                      </select>
                    </div>
                    <div className="flex-[2]">
                      <label className={`text-[10px] mb-1 block ${isDark ? "text-gray-400" : "text-gray-500"}`}>الوصف</label>
                      <input
                        type="text"
                        value={newDefDesc}
                        onChange={(e) => setNewDefDesc(e.target.value)}
                        placeholder="وصف النقص..."
                        className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 transition-colors ${isDark ? "bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-500" : "border-gray-200"}`}
                      />
                    </div>
                    <div>
                      <label className={`text-[10px] mb-1 block ${isDark ? "text-gray-400" : "text-gray-500"}`}>الأهمية</label>
                      <select
                        value={newDefSeverity}
                        onChange={(e) => setNewDefSeverity(e.target.value as "high" | "medium" | "low")}
                        className={`px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 transition-colors ${isDark ? "bg-gray-800 border-gray-600 text-gray-200" : "border-gray-200"}`}
                      >
                        <option value="high">عالي</option>
                        <option value="medium">متوسط</option>
                        <option value="low">منخفض</option>
                      </select>
                    </div>
                    <button
                      onClick={addDeficiency}
                      className="px-3 py-1.5 rounded-lg bg-brand-500 text-white text-xs font-medium hover:bg-brand-600 cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-add-line ml-1"></i>إضافة
                    </button>
                  </div>
                </div>
              )}

              {/* Review Note */}
              <div>
                <label className={`text-xs font-bold mb-2 block ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  {reviewAction === "approve" ? "ملاحظات الموافقة (اختياري)" :
                   reviewAction === "reject" ? "سبب الرفض" : "ملاحظات الردّ (اختياري)"}
                </label>
                <textarea
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder={
                    reviewAction === "approve" ? "أضف ملاحظاتك على الملف..." :
                    reviewAction === "reject" ? "اكتب سبب رفض الملف..." :
                    "أضف ملاحظات توجيهية للموظف..."
                  }
                  rows={3}
                  maxLength={500}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300 resize-none transition-colors ${isDark ? "bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-500" : "border-gray-200"}`}
                />
                <p className={`text-[10px] mt-1 text-left ${isDark ? "text-gray-500" : "text-gray-400"}`}>{reviewNote.length}/500</p>
              </div>
            </div>

            <div className={`px-6 py-4 border-t flex gap-3 ${isDark ? "border-gray-700" : "border-gray-100"}`}>
              <button
                onClick={() => setShowReviewModal(false)}
                className={`px-4 py-2.5 rounded-lg border text-sm font-medium cursor-pointer transition-colors ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
              >
                إلغاء
              </button>
              <button
                onClick={submitReview}
                className={`px-4 py-2.5 rounded-lg text-white text-sm font-medium cursor-pointer flex-1 flex items-center justify-center gap-2 ${
                  reviewAction === "approve" ? "bg-emerald-500 hover:bg-emerald-600" :
                  reviewAction === "reject" ? "bg-red-500 hover:bg-red-600" :
                  "bg-amber-500 hover:bg-amber-600"
                }`}
              >
                <i className={`${reviewAction === "approve" ? "ri-check-line" : reviewAction === "reject" ? "ri-close-line" : "ri-arrow-go-back-line"}`}></i>
                {reviewAction === "approve" && "تأكيد الموافقة"}
                {reviewAction === "reject" && "تأكيد الرفض"}
                {reviewAction === "return" && "تأكيد الردّ للتصحيح"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
        {[
          { label: "بانتظار المراجعة", value: stats.pending, sub: "ملفات جديدة", icon: "ri-time-line", iconBg: isDark ? "bg-amber-900/30" : "bg-amber-50", iconColor: "text-amber-600" },
          { label: "مردودة للتصحيح", value: stats.returned, sub: "بانتظار التصحيح", icon: "ri-arrow-go-back-line", iconBg: isDark ? "bg-orange-900/30" : "bg-orange-50", iconColor: "text-orange-600" },
          { label: "تمت الموافقة", value: stats.approved, sub: "ملفات معتمدة", icon: "ri-check-double-line", iconBg: isDark ? "bg-emerald-900/30" : "bg-emerald-50", iconColor: "text-emerald-600" },
          { label: "مرفوضة", value: stats.rejected, sub: "ملفات مرفوضة", icon: "ri-close-circle-line", iconBg: isDark ? "bg-red-900/30" : "bg-red-50", iconColor: "text-red-600" },
          { label: "إجمالي الملفات", value: stats.total, sub: "تحت مسؤولية المدقق", icon: "ri-folder-line", iconBg: isDark ? "bg-sky-900/30" : "bg-sky-50", iconColor: "text-sky-600" },
        ].map((card, i) => (
          <div key={i} className={`rounded-xl border p-4 transition-colors ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{card.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.iconBg}`}>
                <i className={`${card.icon} ${card.iconColor} text-sm`}></i>
              </div>
            </div>
            <p className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>{card.value}</p>
            <p className={`text-[10px] mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={`flex items-center gap-1 rounded-xl border p-1 mb-5 w-fit transition-colors ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
        {[
          { key: "pending", label: "بانتظار المراجعة", icon: "ri-time-line" },
          { key: "history", label: "سجل المراجعات", icon: "ri-history-line" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as "pending" | "history")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.key ? "bg-brand-500 text-white" : isDark ? "text-gray-400 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <i className={`${tab.icon} ml-1.5`}></i>{tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className={`rounded-xl border mb-5 transition-colors ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
        <div className="px-5 py-3 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
              <i className="ri-search-line text-gray-400 text-sm"></i>
            </div>
            <input
              type="text"
              placeholder="بحث بالاسم أو الجوال أو رقم الملف..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pr-9 pl-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 transition-colors ${isDark ? "bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-500" : "bg-white border-gray-200"}`}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ReviewStatus | "all")}
            className={`${selectCls}`}
          >
            <option value="all">كل الحالات</option>
            <option value="pending">بانتظار المراجعة</option>
            <option value="returned">مردود للتصحيح</option>
            <option value="approved">تمت الموافقة</option>
            <option value="rejected">مرفوض</option>
          </select>
        </div>
      </div>

      {/* Clients Table */}
      <div className={`rounded-xl border overflow-hidden transition-colors ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={isDark ? "bg-gray-800/60" : "bg-gray-50/60"}>
                {["العميل", "الخدمة", "المرحلة", "حالة المراجعة", "الوثائق", "الموظف", "تاريخ التقديم", "الإجراءات"].map((h) => (
                  <th key={h} className={`px-4 py-3 text-right text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-600"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                      <i className={`ri-inbox-line text-2xl ${isDark ? "text-gray-600" : "text-gray-300"}`}></i>
                    </div>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>لا يوجد ملفات في هذه الفئة</p>
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const docCount = client.attachments.length;
                  const requiredDocs = 4;
                  const docProgress = Math.min((docCount / requiredDocs) * 100, 100);

                  return (
                    <tr key={client.id} className={`border-b transition-colors ${isDark ? "border-gray-800 hover:bg-gray-800/50" : "border-gray-50 hover:bg-gray-50/50"}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? "bg-brand-900/40" : "bg-brand-100"}`}>
                            <span className="text-brand-700 text-[10px] font-bold">
                              {client.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                            </span>
                          </div>
                          <div>
                            <p className={`text-xs font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>{client.fullName}</p>
                            <p className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>{client.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>{client.serviceType}</span></td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${stageColors[client.stage]}`}>
                          {stageLabels[client.stage]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${reviewStatusColors[client.reviewStatus!]}`}>
                          {reviewStatusLabels[client.reviewStatus!]}
                        </span>
                        {client.reviewDeficiencies && client.reviewDeficiencies.length > 0 && (
                          <span className="text-[10px] text-red-500 mr-1">({client.reviewDeficiencies.length} نقص)</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-16 h-1.5 rounded-full overflow-hidden ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                            <div
                              className={`h-full rounded-full ${docProgress >= 75 ? "bg-emerald-500" : docProgress >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                              style={{ width: `${docProgress}%` }}
                            ></div>
                          </div>
                          <span className={`text-[10px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>{docCount}/{requiredDocs}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>{client.assignedTo}</span></td>
                      <td className="px-4 py-3">
                        <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          {new Date(client.submittedAt).toLocaleDateString("ar-SA")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {client.reviewStatus === "pending" && (
                            <>
                              <button onClick={() => openReviewModal(client, "approve")} className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 cursor-pointer" title="موافقة">
                                <i className="ri-check-line text-sm"></i>
                              </button>
                              <button onClick={() => openReviewModal(client, "return")} className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 cursor-pointer" title="ردّ للتصحيح">
                                <i className="ri-arrow-go-back-line text-sm"></i>
                              </button>
                              <button onClick={() => openReviewModal(client, "reject")} className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer" title="رفض">
                                <i className="ri-close-line text-sm"></i>
                              </button>
                            </>
                          )}
                          {client.reviewStatus === "returned" && (
                            <>
                              <button onClick={() => openReviewModal(client, "approve")} className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 cursor-pointer" title="موافقة بعد التصحيح">
                                <i className="ri-check-line text-sm"></i>
                              </button>
                              <button onClick={() => openReviewModal(client, "return")} className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 cursor-pointer" title="ردّ مرة أخرى">
                                <i className="ri-arrow-go-back-line text-sm"></i>
                              </button>
                            </>
                          )}
                          <Link
                            to={`/dashboard/clients/${client.id}`}
                            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${isDark ? "text-gray-500 hover:text-brand-400 hover:bg-brand-900/30" : "text-gray-400 hover:text-brand-600 hover:bg-brand-50"}`}
                            title="فتح الملف"
                          >
                            <i className="ri-external-link-line text-sm"></i>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
