import { createContext, useContext } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: number;
  message: string;
  detail?: string;
  type: ToastType;
  duration?: number;
}

export interface ToastContextValue {
  toasts: ToastItem[];
  toast: (message: string, options?: { detail?: string; type?: ToastType; duration?: number }) => void;
  success: (message: string, detail?: string) => void;
  error: (message: string, detail?: string) => void;
  warning: (message: string, detail?: string) => void;
  info: (message: string, detail?: string) => void;
  dismiss: (id: number) => void;
  dismissAll: () => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
