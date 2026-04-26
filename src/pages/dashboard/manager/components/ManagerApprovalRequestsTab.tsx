import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/useToast";
import { mockClients, stageLabels, stageColors, type Client } from "@/mocks/dashboardData";
import { loadManagerEmailSettings } from "@/hooks/useManagerEmailSettings";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_PUBLIC_SUPABASE_URL,
  import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY
);

type Decision = "approved" | "rejected";

interface DecisionState {
  clientId: string;
  decision: Decision;
  note: string;
}

export default function ManagerApprovalRequestsTab() {
  const { success, error: toastError } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalDecision, setModalDecision] = useState<Decision>("approved");
  const [decisionNote, setDecisionNote] = useState("");
  const [decisions, setDecisions] = useState<DecisionState[]>([]);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Clients that have a pending manager approval request
  const pendingClients = mockClients.filter(
    (c) => c.managerApprovalRequested && !c.managerApprovalDecision
  );

  const getDecision = (clientId: string) =>
    decisions.find((d) => d.clientId === clientId);

  const openModal = (client: Client, decision: Decision) => {
    setSelectedClient(client);
    setModalDecision(decision);
    setDecisionNote("");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!selectedClient) return;
    setDecisions((prev) => [
      ...prev.filter((d) => d.clientId !== selectedClient.id),
      { clientId: selectedClient.id, decision: modalDecision, note: decisionNote },
    ]);
    if (modalDecision === "approved") {
      success(
        `تمت الموافقة على طلب ${selectedClient.fullName}`,
        "سيتم إشعار المشرف بالقرار"
      );
    } else {
      toastError(
        `تم رفض طلب ${selectedClient.fullName}`,
        decisionNote || "تم الرفض بدون ملاحظة"
      );
    }

    // Send email notification if configured
    const emailSettings = loadManagerEmailSettings();
    const req = selectedClient.managerApprovalRequest;
    const isUrgent = req?.urgency === "urgent";
    const shouldSend =
      emailSettings.email &&
      ((isUrgent && emailSettings.sendOnUrgent) ||
        (!isUrgent && emailSettings.sendOnNormal));

    if (shouldSend && selectedClient.financingCalc && req) {
      setSendingEmail(true);
      try {
        await supabase.functions.invoke("send-manager-email", {
          body: {
            managerEmail: emailSettings.email,
            clientName: selectedClient.fullName,
            clientId: selectedClient.id,
            serviceType: selectedClient.serviceType,
            city: selectedClient.city,
            requestedAmount: selectedClient.financingCalc.approvedAmount,
            monthlyInstallment: selectedClient.financingCalc.monthlyInstallment,
            profitRate: selectedClient.financingCalc.profitRate,
            months: selectedClient.financingCalc.months,
            reason: req.reason,
            requestedBy: req.requestedBy,
            requestedAt: req.requestedAt,
            urgency: req.urgency,
          },
        });
      } catch {
        // silent fail — don't block the UI
      } finally {
        setSendingEmail(false);
      }
    }

    setShowModal(false);
  };

  const pendingCount = pendingClients.filter((c) => !getDecision(c.id)).length;

  return (
    <>
      {/* Decision Modal */}
      {showModal && selectedClient && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  modalDecision === "approved" ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-red-100 dark:bg-red-900/30"
                }`}>
                  <i className={`text-base ${
                    modalDecision === "approved"
                      ? "ri-check-double-line text-emerald-600 dark:text-emerald-400"
                      : "ri-close-circle-line text-red-600 dark:text-red-400"
                  }`}></i>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {modalDecision === "approved" ? "الموافقة على الطلب" : "رفض الطلب"}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{selectedClient.fullName} — {selectedClient.id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <i className="ri-close-line text-gray-500 dark:text-gray-400"></i>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Request details */}
              {selectedClient.managerApprovalRequest && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl p-4">
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1.5">سبب الطلب من المشرف</p>
                  <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
                    {selectedClient.managerApprovalRequest.reason}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-amber-600 dark:text-amber-500">
                      بواسطة: {selectedClient.managerApprovalRequest.requestedBy}
                    </span>
                    {selectedClient.managerApprovalRequest.urgency === "urgent" && (
                      <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold px-2 py-0.5 rounded-full">
                        عاجل
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Financial summary */}
              {selectedClient.financingCalc && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">مبلغ التمويل المطلوب</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                      {selectedClient.financingCalc.approvedAmount.toLocaleString("ar-SA")} ر.س
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">القسط الشهري</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                      {selectedClient.financingCalc.monthlyInstallment.toLocaleString("ar-SA")} ر.س
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">نسبة الربح</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                      {selectedClient.financingCalc.profitRate}%
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">مدة التمويل</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                      {selectedClient.financingCalc.months} شهر
                    </p>
                  </div>
                </div>
              )}

              {/* Note */}
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 block">
                  ملاحظة القرار {modalDecision === "rejected" && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={decisionNote}
                  onChange={(e) => setDecisionNote(e.target.value)}
                  placeholder={
                    modalDecision === "approved"
                      ? "ملاحظة اختيارية للمشرف..."
                      : "اكتب سبب الرفض بوضوح..."
                  }
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 resize-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                />
                <p className="text-[10px] text-gray-400 dark:text-gray-500 text-left mt-1">{decisionNote.length}/500</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer whitespace-nowrap"
              >
                إلغاء
              </button>
              <button
                disabled={(modalDecision === "rejected" && !decisionNote.trim()) || sendingEmail}
                onClick={handleSubmit}
                className={`flex-1 px-4 py-2.5 rounded-lg text-white text-sm font-medium cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap ${
                  modalDecision === "approved"
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {sendingEmail ? (
                  <i className="ri-loader-4-line animate-spin"></i>
                ) : (
                  <i className={modalDecision === "approved" ? "ri-check-double-line" : "ri-close-circle-line"}></i>
                )}
                {sendingEmail ? "جاري الإرسال..." : modalDecision === "approved" ? "تأكيد الموافقة" : "تأكيد الرفض"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {pendingClients.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
            <i className="ri-vip-crown-line text-gray-300 dark:text-gray-600 text-2xl"></i>
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">لا توجد طلبات اعتماد استثنائية</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">ستظهر هنا عندما يرسل المشرف طلب اعتماد خاص</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header note */}
          <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
              <i className="ri-information-line text-amber-600 dark:text-amber-400 text-sm"></i>
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                {pendingCount} طلب{pendingCount !== 1 ? " استثنائي" : " استثنائي"} بانتظار قرارك
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">
                هذه حالات نادرة أحالها المشرف لاعتمادك المباشر
              </p>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pendingClients.map((client) => {
              const decision = getDecision(client.id);
              const req = client.managerApprovalRequest;
              const isUrgent = req?.urgency === "urgent";

              return (
                <div
                  key={client.id}
                  className={`bg-white dark:bg-gray-900 rounded-xl border p-5 transition-all ${
                    decision
                      ? "border-gray-100 dark:border-gray-800 opacity-70"
                      : isUrgent
                      ? "border-red-200 dark:border-red-800"
                      : "border-amber-200 dark:border-amber-800"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-700 dark:text-amber-400 text-xs font-bold">
                          {client.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{client.fullName}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{client.id} · {client.serviceType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isUrgent && (
                        <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <i className="ri-alarm-warning-line text-xs"></i>
                          عاجل
                        </span>
                      )}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${stageColors[client.stage]}`}>
                        {stageLabels[client.stage]}
                      </span>
                    </div>
                  </div>

                  {/* Request reason */}
                  {req && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2.5 mb-4">
                      <p className="text-[10px] text-amber-600 dark:text-amber-500 font-semibold mb-1">سبب الطلب</p>
                      <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{req.reason}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] text-amber-500 dark:text-amber-600">
                          <i className="ri-user-line ml-0.5"></i>
                          {req.requestedBy}
                        </span>
                        <span className="text-[10px] text-amber-500 dark:text-amber-600">
                          <i className="ri-calendar-line ml-0.5"></i>
                          {new Date(req.requestedAt).toLocaleDateString("ar-SA")}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Financial summary */}
                  {client.financingCalc && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">مبلغ التمويل</p>
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-100 mt-0.5">
                          {(client.financingCalc.approvedAmount / 1000).toFixed(0)}k
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">القسط</p>
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-100 mt-0.5">
                          {client.financingCalc.monthlyInstallment.toLocaleString("ar-SA")}
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">نسبة الربح</p>
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-100 mt-0.5">
                          {client.financingCalc.profitRate}%
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Decision result */}
                  {decision ? (
                    <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg ${
                      decision.decision === "approved"
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                        : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                    }`}>
                      <i className={`text-sm ${
                        decision.decision === "approved" ? "ri-check-double-line" : "ri-close-circle-line"
                      }`}></i>
                      <span className="text-xs font-semibold">
                        {decision.decision === "approved" ? "تمت الموافقة" : "تم الرفض"}
                      </span>
                      {decision.note && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">— {decision.note}</span>
                      )}
                    </div>
                  ) : (
                    /* Actions */
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(client, "approved")}
                        className="flex-1 px-3 py-2 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors"
                      >
                        <i className="ri-check-double-line"></i>
                        موافقة
                      </button>
                      <button
                        onClick={() => openModal(client, "rejected")}
                        className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/30 cursor-pointer flex items-center gap-1.5 whitespace-nowrap transition-colors"
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
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
