import { useState, useCallback, useEffect, useRef } from "react";
import { ToastContext, type ToastItem, type ToastType } from "@/hooks/useToast";

let _nextId = 1;

const toastIcons: Record<ToastType, string> = {
  success: "ri-checkbox-circle-line",
  error:   "ri-close-circle-line",
  warning: "ri-alert-line",
  info:    "ri-information-2-line",
};

const toastStyles: Record<ToastType, { bar: string; icon: string; bg: string; border: string; text: string }> = {
  success: { bar: "bg-emerald-500", icon: "text-emerald-500", bg: "bg-white", border: "border-emerald-100", text: "text-gray-800" },
  error:   { bar: "bg-red-500",     icon: "text-red-500",     bg: "bg-white", border: "border-red-100",     text: "text-gray-800" },
  warning: { bar: "bg-amber-500",   icon: "text-amber-500",   bg: "bg-white", border: "border-amber-100",   text: "text-gray-800" },
  info:    { bar: "bg-sky-500",     icon: "text-sky-500",     bg: "bg-white", border: "border-sky-100",     text: "text-gray-800" },
};

interface ToastCardProps {
  item: ToastItem;
  onDismiss: (id: number) => void;
}

function ToastCard({ item, onDismiss }: ToastCardProps) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const duration = item.duration ?? 4000;
  const style = toastStyles[item.type];

  useEffect(() => {
    // Enter animation
    const enterTimer = setTimeout(() => setVisible(true), 10);
    // Auto dismiss
    timerRef.current = setTimeout(() => handleDismiss(), duration);
    return () => {
      clearTimeout(enterTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleDismiss = () => {
    setLeaving(true);
    setTimeout(() => onDismiss(item.id), 300);
  };

  return (
    <div
      className={`relative flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-lg min-w-72 max-w-sm overflow-hidden transition-all duration-300 cursor-pointer ${style.bg} ${style.border} ${
        visible && !leaving
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-8"
      }`}
      onClick={handleDismiss}
      dir="rtl"
    >
      {/* Colored left bar */}
      <div className={`absolute right-0 top-0 bottom-0 w-1 rounded-r-xl ${style.bar}`}></div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-1 h-0.5 bg-gray-100 overflow-hidden">
        <div
          className={`h-full ${style.bar} opacity-40`}
          style={{
            animation: `toast-progress ${duration}ms linear forwards`,
          }}
        ></div>
      </div>

      {/* Icon */}
      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
        <i className={`${toastIcons[item.type]} text-lg ${style.icon}`}></i>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-1">
        <p className={`text-sm font-semibold leading-snug ${style.text}`}>{item.message}</p>
        {item.detail && (
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.detail}</p>
        )}
      </div>

      {/* Close */}
      <button
        onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
        className="w-5 h-5 flex items-center justify-center text-gray-300 hover:text-gray-500 flex-shrink-0 mt-0.5 cursor-pointer"
      >
        <i className="ri-close-line text-sm"></i>
      </button>
    </div>
  );
}

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const toast = useCallback((
    message: string,
    options?: { detail?: string; type?: ToastType; duration?: number }
  ) => {
    const id = _nextId++;
    const item: ToastItem = {
      id,
      message,
      detail: options?.detail,
      type: options?.type ?? "info",
      duration: options?.duration ?? 4000,
    };
    setToasts((prev) => [...prev.slice(-4), item]); // max 5 toasts
  }, []);

  const success = useCallback((message: string, detail?: string) => {
    toast(message, { type: "success", detail });
  }, [toast]);

  const error = useCallback((message: string, detail?: string) => {
    toast(message, { type: "error", detail, duration: 5000 });
  }, [toast]);

  const warning = useCallback((message: string, detail?: string) => {
    toast(message, { type: "warning", detail });
  }, [toast]);

  const info = useCallback((message: string, detail?: string) => {
    toast(message, { type: "info", detail });
  }, [toast]);

  return (
    <ToastContext.Provider value={{ toasts, toast, success, error, warning, info, dismiss, dismissAll }}>
      {children}

      {/* Toast Container — fixed bottom-left */}
      <div
        className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-2.5 items-end pointer-events-none"
        dir="rtl"
      >
        {toasts.map((item) => (
          <div key={item.id} className="pointer-events-auto">
            <ToastCard item={item} onDismiss={dismiss} />
          </div>
        ))}
      </div>

      {/* Progress animation keyframes */}
      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
