import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/useToast";
import {
  mockClients,
  employees,
  stageColors,
  stageLabels,
  type Client,
} from "@/mocks/dashboardData";

interface ApprovalTabProps {
  onToast?: (msg: string, type?: "success" | "error") => void;
}

export default function ApprovalTab({ onToast }: ApprovalTabProps) {
  const { success, error: toastError } = useToast();
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"approve" | "reject">("approve");
  const [selectedExecutor, setSelectedExecutor] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const pendingClients = useMemo(
    () =>
      mockClients.filter(
        (c) => c.stage === "final_review" && !c.specialStatus
      ),
    []
  );

  const executors = employees.filter((e) => e.role === "employee");

  const filtered = useMemo(
    () =>
      pendingClients.filter(
        (c) =>
          c.fullName.includes(search) ||
          c.id.includes(search) ||
          c.phone.includes(search)
      ),
    [pendingClients, search]
  );

  const openModal = (client: Client, action: "approve" | "reject") => {
    setSelectedClient(client);
    setModalAction(action);
    setSelectedExecutor("");
    setRejectReason("");
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!selectedClient) return;
    if (modalAction === "approve" && !selectedExecutor) {
      toastError("يرجى اختيار المنفذ");
      return;
    }
    if (modalAction === "reject" && !rejectReason.trim()) {
      toastError("يرجى كتابة سبب الرفض");
      return;
    }
    const exec = executors.find((e) => e.id === selectedExecutor);
    if (modalAction === "approve") {
      success(
        `تم اعتماد ملف ${selectedClient.fullName}`,
        `تم تعيين ${exec?.name ?? ""} منفذاً للملف`
      );
    } else {
      toastError(
        `تم رفض ملف ${selectedClient.fullName}`,
        rejectReason
      );
    }
    setShowModal(false);
  };

  return (
    <>
      {/* Modal */}
      {showModal && selectedClient && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  {modalAction === "approve" ? "اعتماد الملف واختيار المنفذ" : "رفض الملف"}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {selectedClient.fullName} — {selectedClient.id}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">مبلغ التمويل</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    {selectedClient.financingCalc?.approvedAmount?.toLocaleString("ar-SA") ?? "—"} ر.س
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">القسط الشهري</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    {selectedClient.financingCalc?.monthlyInstallment?.toLocaleString("ar-SA") ?? "—"} ر.س
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">نسبة الربح</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    {selectedClient.financingCalc?.profitRate ?? "—"}%
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">مدة التمويل</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    {selectedClient.financingCalc?.months ?? "—"} شهر
                  </p>
                </div>
              </div>

              {modalAction === "approve" ? (
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 block">
                    اختيار المنفذ <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {executors.map((emp) => (
                      <button
                        key={emp.id}
                        onClick={() => setSelectedExecutor(emp.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-right transition-all cursor-pointer ${
                          selectedExecutor === emp.id
                            ? "border-brand-400 bg-brand-50 dark:bg-brand-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-brand-700 dark:text-brand-400 text-[10px] font-bold">
                            {emp.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                          </span>
                        </div>
                        <div className="flex-1 text-right">
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">{emp.name}</p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500">{emp.assignedCount} ملف حالي</p>
                        </div>
                        {selectedExecutor === emp.id && (
                          <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
                            <i className="ri-check-line text-white text-xs"></i>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 block">
                    سبب الرفض <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="اكتب سبب رفض الملف بوضوح..."
                    rows={4}
                    maxLength={500}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 resize-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                  />
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 text-left">{rejectReason.length}/500</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleSubmit}
                className={`flex-1 px-4 py-2.5 rounded-lg text-white text-sm font-medium cursor-pointer flex items-center justify-center gap-2 ${
                  modalAction === "approve"
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                <i className={modalAction === "approve" ? "ri-check-double-line" : "ri-close-circle-line"}></i>
                {modalAction === "approve" ? "اعتماد الملف" : "تأكيد الرفض"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-sm">
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
            <i className="ri-search-line text-gray-400 text-sm"></i>
          </div>
          <input
            type="text"
            placeholder="بحث بالاسم أو رقم الملف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-9 pl-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
            <i className="ri-inbox-line text-gray-300 dark:text-gray-600 text-2xl"></i>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">لا توجد ملفات بانتظار الاعتماد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((client) => (
            <div key={client.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-700 dark:text-brand-400 text-xs font-bold">
                      {client.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{client.fullName}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{client.id} · {client.serviceType}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${stageColors[client.stage]}`}>
                  {stageLabels[client.stage]}
                </span>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">مبلغ التمويل</p>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-100 mt-0.5">
                    {client.financingCalc?.approvedAmount?.toLocaleString("ar-SA") ?? "—"}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">القسط</p>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-100 mt-0.5">
                    {client.financingCalc?.monthlyInstallment?.toLocaleString("ar-SA") ?? "—"}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">نسبة الربح</p>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-100 mt-0.5">
                    {client.financingCalc?.profitRate ?? "—"}%
                  </p>
                </div>
              </div>

              {/* Info Row */}
              <div className="flex items-center gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <i className="ri-map-pin-line"></i>
                  {client.city}
                </span>
                <span className="flex items-center gap-1">
                  <i className="ri-building-line"></i>
                  {client.employerName}
                </span>
                <span className="flex items-center gap-1">
                  <i className="ri-user-line"></i>
                  {client.assignedTo}
                </span>
              </div>

              {/* Auditor note */}
              {client.reviewNote && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50 rounded-lg px-3 py-2 mb-4">
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                    <i className="ri-shield-check-line ml-1"></i>
                    {client.reviewNote}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal(client, "approve")}
                  className="flex-1 px-3 py-2 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <i className="ri-check-double-line"></i>
                  اعتماد واختيار منفذ
                </button>
                <button
                  onClick={() => openModal(client, "reject")}
                  className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/30 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <i className="ri-close-circle-line"></i>
                  رفض
                </button>
                <Link
                  to={`/dashboard/clients/${client.id}`}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all"
                >
                  <i className="ri-external-link-line text-sm"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}