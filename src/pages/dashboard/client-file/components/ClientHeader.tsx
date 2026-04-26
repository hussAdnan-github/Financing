import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { logManagerApprovalRequest } from "@/hooks/useRealtimeNotifications";
import {
  type Client,
  stageLabels,
  stageColors,
  type ClientStage,
} from "@/mocks/dashboardData";

const stageOrder: ClientStage[] = [
  "new_request", "under_study", "awaiting_approval", "final_review",
  "signing", "execution", "collection", "archived",
];

interface Props {
  client: Client;
  onStageChange: (stage: ClientStage) => void;
}

export default function ClientHeader({ client, onStageChange }: Props) {
  const navigate = useNavigate();
  const { success, error: toastError, info } = useToast();
  const { user } = useAuth();
  const [showStageMenu, setShowStageMenu] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Manager approval request state
  const [showManagerApprovalModal, setShowManagerApprovalModal] = useState(false);
  const [approvalReason, setApprovalReason] = useState("");
  const [approvalUrgency, setApprovalUrgency] = useState<"normal" | "urgent">("normal");
  const [approvalRequested, setApprovalRequested] = useState(
    client.managerApprovalRequested ?? false
  );

  const currentIndex = stageOrder.indexOf(client.stage);
  const nextStage = stageOrder[currentIndex + 1];
  const whatsappUrl = `https://wa.me/966${client.phone.replace(/^0/, "")}`;

  const isSupervisor = user?.role === "supervisor";
  const isManager = user?.role === "manager";
  const isEmployee = user?.role === "employee";
  const isAuditor = user?.role === "auditor";
  // الموظف العادي والمدقق لا يمكنهم رفع المرحلة أو الرفض
  const canAdvanceStage = isSupervisor || isManager;
  const canReject = isSupervisor || isManager;

  const handleRequestManagerApproval = () => {
    if (!approvalReason.trim()) return;

    // Fire realtime notification to manager
    logManagerApprovalRequest(
      client.id,
      client.fullName,
      client.serviceType,
      approvalUrgency,
      approvalReason,
      user?.name ?? "المشرف"
    );

    setApprovalRequested(true);
    setShowManagerApprovalModal(false);
    info(
      "تم إرسال طلب اعتماد المدير",
      `سيتم إشعار المدير بطلبك على ملف ${client.fullName}`
    );
    setApprovalReason("");
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 mb-5">

        {/* Manager Approval Request Banner */}
        {(approvalRequested || client.managerApprovalRequested) && !client.managerApprovalDecision && (
          <div className="mb-4 flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="ri-vip-crown-line text-amber-600 dark:text-amber-400 text-sm"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">بانتظار اعتماد المدير</p>
              {client.managerApprovalRequest && (
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                  {client.managerApprovalRequest.reason}
                </p>
              )}
              <div className="flex items-center gap-3 mt-1.5">
                {client.managerApprovalRequest?.urgency === "urgent" && (
                  <span className="text-[10px] bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 font-bold px-2 py-0.5 rounded-full">
                    عاجل
                  </span>
                )}
                {client.managerApprovalRequest?.requestedBy && (
                  <span className="text-[10px] text-amber-600 dark:text-amber-400">
                    طلب بواسطة: {client.managerApprovalRequest.requestedBy}
                  </span>
                )}
                {client.managerApprovalRequest?.requestedAt && (
                  <span className="text-[10px] text-amber-500 dark:text-amber-500">
                    {new Date(client.managerApprovalRequest.requestedAt).toLocaleDateString("ar-SA")}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Manager Approval Decision Banner */}
        {client.managerApprovalDecision && (
          <div className={`mb-4 flex items-start gap-3 rounded-xl px-4 py-3 border ${
            client.managerApprovalDecision === "approved"
              ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              client.managerApprovalDecision === "approved" ? "bg-emerald-100 dark:bg-emerald-900/40" : "bg-red-100 dark:bg-red-900/40"
            }`}>
              <i className={`text-sm ${
                client.managerApprovalDecision === "approved"
                  ? "ri-check-double-line text-emerald-600 dark:text-emerald-400"
                  : "ri-close-circle-line text-red-600 dark:text-red-400"
              }`}></i>
            </div>
            <div>
              <p className={`text-sm font-semibold ${
                client.managerApprovalDecision === "approved" ? "text-emerald-800 dark:text-emerald-300" : "text-red-800 dark:text-red-300"
              }`}>
                {client.managerApprovalDecision === "approved"
                  ? "تمت الموافقة من المدير"
                  : "تم رفض الطلب من المدير"}
              </p>
              {client.managerApprovalNote && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{client.managerApprovalNote}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Back + Info */}
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate("/dashboard/clients")}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex-shrink-0 mt-0.5"
            >
              <i className="ri-arrow-right-line text-base"></i>
            </button>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{client.fullName}</h2>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${stageColors[client.stage]}`}>
                  {stageLabels[client.stage]}
                </span>
                <span className="font-mono text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{client.id}</span>
                {(approvalRequested || client.managerApprovalRequested) && !client.managerApprovalDecision && (
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <i className="ri-vip-crown-line text-xs"></i>
                    بانتظار المدير
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <i className="ri-phone-line text-xs"></i>
                  {client.phone}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <i className="ri-map-pin-line text-xs"></i>
                  {client.city}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <i className="ri-briefcase-line text-xs"></i>
                  {client.serviceType}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <i className="ri-calendar-line text-xs"></i>
                  {new Date(client.submittedAt).toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-whatsapp-line text-base"></i>
              واتساب
            </a>

            {/* زر طلب اعتماد المدير — مشرف فقط */}
            {isSupervisor && !approvalRequested && !client.managerApprovalRequested && (
              <button
                onClick={() => setShowManagerApprovalModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-sm font-medium rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-vip-crown-line text-base"></i>
                طلب اعتماد المدير
              </button>
            )}

            {/* زر الرفض — مشرف ومدير فقط */}
            {canReject && (
              <button
                onClick={() => setShowRejectModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-close-circle-line text-base"></i>
                رفض
              </button>
            )}

            {/* زر رفع المرحلة — مشرف ومدير فقط */}
            {canAdvanceStage && nextStage && (
              <div className="relative">
                <button
                  onClick={() => setShowStageMenu(!showStageMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-arrow-left-line text-base"></i>
                  رفع للمرحلة التالية
                  <i className="ri-arrow-down-s-line text-base"></i>
                </button>
                {showStageMenu && (
                  <div className="absolute left-0 top-11 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 z-30 w-52 overflow-hidden">
                    <p className="px-3 py-2 text-xs text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">اختر المرحلة</p>
                    {stageOrder.slice(currentIndex + 1).map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          onStageChange(s);
                          setShowStageMenu(false);
                          success(
                            `تم رفع الملف لمرحلة: ${stageLabels[s]}`,
                            `ملف ${client.fullName} — ${client.id}`
                          );
                        }}
                        className="w-full text-right px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-700 dark:hover:text-brand-400 transition-colors cursor-pointer"
                      >
                        {stageLabels[s]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stage Progress Bar */}
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-0">
            {stageOrder.map((s, i) => {
              const done = i < currentIndex;
              const active = i === currentIndex;
              const isLast = i === stageOrder.length - 1;
              return (
                <div key={s} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      done ? "bg-brand-500 text-white" :
                      active ? "bg-brand-500 text-white ring-4 ring-brand-100 dark:ring-brand-900/40" :
                      "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600"
                    }`}>
                      {done ? <i className="ri-check-line text-xs"></i> : i + 1}
                    </div>
                    <span className={`text-[9px] mt-1 text-center leading-tight max-w-[60px] hidden sm:block ${
                      active ? "text-brand-600 dark:text-brand-400 font-semibold" : done ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-600"
                    }`}>
                      {stageLabels[s]}
                    </span>
                  </div>
                  {!isLast && (
                    <div className={`flex-1 h-0.5 mx-1 ${done ? "bg-brand-400" : "bg-gray-200 dark:bg-gray-700"}`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Manager Approval Request Modal ── */}
      {showManagerApprovalModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                  <i className="ri-vip-crown-line text-amber-600 dark:text-amber-400 text-base"></i>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">طلب اعتماد المدير</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{client.fullName} — {client.id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowManagerApprovalModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <i className="ri-close-line text-gray-500 dark:text-gray-400"></i>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-4 py-3">
                <div className="w-4 h-4 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <i className="ri-information-line text-amber-500 text-sm"></i>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                  هذا الطلب حالة استثنائية ونادرة. سيتم إشعار المدير مباشرةً لمراجعة الملف واتخاذ القرار.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 block">مستوى الأولوية</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setApprovalUrgency("normal")}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                      approvalUrgency === "normal"
                        ? "border-brand-400 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <i className="ri-time-line text-base"></i>
                    عادي
                  </button>
                  <button
                    onClick={() => setApprovalUrgency("urgent")}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                      approvalUrgency === "urgent"
                        ? "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <i className="ri-alarm-warning-line text-base"></i>
                    عاجل
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 block">
                  سبب طلب الاعتماد <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={approvalReason}
                  onChange={(e) => setApprovalReason(e.target.value)}
                  placeholder="اشرح سبب الحاجة لاعتماد المدير بوضوح..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200 dark:focus:ring-amber-800 resize-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                />
                <p className="text-[10px] text-gray-400 dark:text-gray-500 text-left mt-1">{approvalReason.length}/500</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
              <button
                onClick={() => setShowManagerApprovalModal(false)}
                className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer whitespace-nowrap"
              >
                إلغاء
              </button>
              <button
                disabled={!approvalReason.trim()}
                onClick={handleRequestManagerApproval}
                className="flex-1 px-4 py-2.5 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
              >
                <i className="ri-vip-crown-line"></i>
                إرسال الطلب للمدير
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reject Modal ── */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-6 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">رفض الملف</h3>
              <button onClick={() => setShowRejectModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                <i className="ri-close-line text-gray-500 dark:text-gray-400"></i>
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">يرجى ذكر سبب الرفض بوضوح ليتمكن الموظف من المتابعة.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="اكتب سبب الرفض هنا..."
              rows={4}
              maxLength={500}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 resize-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            ></textarea>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-left mt-1">{rejectReason.length}/500</p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                disabled={!rejectReason.trim()}
                onClick={() => {
                  if (!rejectReason.trim()) return;
                  toastError(`تم رفض ملف ${client.fullName}`, rejectReason);
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="flex-1 py-2.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                تأكيد الرفض
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
