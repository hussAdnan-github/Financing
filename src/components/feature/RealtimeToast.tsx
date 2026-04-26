import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ToastNotification } from "@/hooks/useRealtimeNotifications";

interface RealtimeToastProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
  onRead: (id: string) => void;
}

export default function RealtimeToast({ toasts, onDismiss, onRead }: RealtimeToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full" dir="rtl">
      {toasts.slice(0, 4).map((toast) =>
        toast.type === "manager_approval_request" ? (
          <ManagerApprovalToastItem
            key={toast.id}
            toast={toast}
            onDismiss={onDismiss}
            onRead={onRead}
          />
        ) : (
          <SubmissionToastItem
            key={toast.id}
            toast={toast}
            onDismiss={onDismiss}
            onRead={onRead}
          />
        )
      )}
    </div>
  );
}

// ─── Submission Toast (existing style) ───────────────────────────────────────
function SubmissionToastItem({
  toast, onDismiss, onRead,
}: {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
  onRead: (id: string) => void;
}) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const start = Date.now();
    const duration = 6000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
    >
      <div className="h-0.5 bg-gray-100">
        <div
          className="h-full bg-brand-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="p-3.5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-brand-50 flex-shrink-0">
            <i className="ri-user-add-line text-brand-500 text-base"></i>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse flex-shrink-0"></span>
                  {toast.title}
                </p>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={handleDismiss}
                className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer flex-shrink-0 mt-0.5"
              >
                <i className="ri-close-line text-sm"></i>
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {toast.clientId && (
                <button
                  onClick={() => {
                    onRead(toast.id);
                    onDismiss(toast.id);
                    navigate(`/dashboard/clients/${toast.clientId}`);
                  }}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-lg text-white cursor-pointer whitespace-nowrap transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#FF6039" }}
                >
                  فتح الملف
                </button>
              )}
              <button
                onClick={() => { onRead(toast.id); navigate("/dashboard/clients"); }}
                className="text-[10px] text-gray-500 hover:text-gray-700 cursor-pointer whitespace-nowrap"
              >
                عرض العملاء
              </button>
              <span className="text-[10px] text-gray-400 mr-auto">
                {new Date(toast.timestamp).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Manager Approval Request Toast (special style) ───────────────────────────
function ManagerApprovalToastItem({
  toast, onDismiss, onRead,
}: {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
  onRead: (id: string) => void;
}) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const isUrgent = toast.urgency === "urgent";
  const DURATION = isUrgent ? 10000 : 8000;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setProgress(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [DURATION]);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  return (
    <div
      className={`rounded-xl overflow-hidden transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${isUrgent ? "border-2 border-red-300" : "border-2 border-amber-300"}`}
      style={{
        background: isUrgent
          ? "linear-gradient(135deg, #fff7ed 0%, #fff 60%)"
          : "linear-gradient(135deg, #fffbeb 0%, #fff 60%)",
        boxShadow: isUrgent
          ? "0 8px 32px rgba(239,68,68,0.18)"
          : "0 8px 32px rgba(245,158,11,0.18)",
      }}
    >
      {/* Progress bar */}
      <div className={`h-1 ${isUrgent ? "bg-red-100" : "bg-amber-100"}`}>
        <div
          className={`h-full transition-all duration-100 ${isUrgent ? "bg-red-500" : "bg-amber-500"}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Header strip */}
      <div className={`px-3.5 py-2 flex items-center justify-between ${
        isUrgent ? "bg-red-500" : "bg-amber-500"
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className={`ri-vip-crown-line text-white text-sm ${isUrgent ? "animate-pulse" : ""}`}></i>
          </div>
          <span className="text-xs font-bold text-white">
            {isUrgent ? "طلب اعتماد عاجل!" : "طلب اعتماد جديد"}
          </span>
          {isUrgent && (
            <span className="text-[9px] bg-white/20 text-white font-bold px-1.5 py-0.5 rounded-full">
              عاجل
            </span>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="w-5 h-5 flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
        >
          <i className="ri-close-line text-sm"></i>
        </button>
      </div>

      {/* Body */}
      <div className="p-3.5">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isUrgent ? "bg-red-100" : "bg-amber-100"
          }`}>
            <i className={`ri-user-star-line text-base ${isUrgent ? "text-red-600" : "text-amber-600"}`}></i>
          </div>

          <div className="flex-1 min-w-0">
            {/* Client name + service */}
            <p className="text-xs font-bold text-gray-900">{toast.clientName}</p>
            <p className="text-xs text-gray-500 mt-0.5">{toast.serviceType}</p>

            {/* Requested by */}
            {toast.requestedBy && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-user-line text-gray-400 text-xs"></i>
                </div>
                <span className="text-[10px] text-gray-500">
                  طلب بواسطة: <span className="font-semibold text-gray-700">{toast.requestedBy}</span>
                </span>
              </div>
            )}

            {/* Time */}
            <p className="text-[10px] text-gray-400 mt-1">
              {new Date(toast.timestamp).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-gray-100">
          <button
            onClick={() => {
              onRead(toast.id);
              onDismiss(toast.id);
              navigate("/dashboard/manager");
            }}
            className={`flex-1 text-[11px] font-bold py-2 rounded-lg text-white cursor-pointer whitespace-nowrap transition-opacity hover:opacity-90 flex items-center justify-center gap-1.5 ${
              isUrgent ? "bg-red-500" : "bg-amber-500"
            }`}
          >
            <i className="ri-vip-crown-line text-xs"></i>
            مراجعة الطلب
          </button>
          {toast.clientId && (
            <button
              onClick={() => {
                onRead(toast.id);
                onDismiss(toast.id);
                navigate(`/dashboard/clients/${toast.clientId}`);
              }}
              className="px-3 py-2 text-[11px] font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors"
            >
              فتح الملف
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
