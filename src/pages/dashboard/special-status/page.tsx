import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/pages/dashboard/components/DashboardLayout";
import { useDashboardDarkMode } from "@/pages/dashboard/context/DashboardDarkModeContext";
import {
  mockClients,
  specialStatusLabels,
  specialStatusColors,
  specialStatusStats,
  type ClientSpecialStatus,
} from "@/mocks/dashboardData";

const statusOptions: { value: ClientSpecialStatus | "all"; label: string; icon: string }[] = [
  { value: "all", label: "جميع الحالات", icon: "ri-list-check-3" },
  { value: "rejected", label: "مرفوض", icon: "ri-close-circle-line" },
  { value: "cancelled", label: "ملغي", icon: "ri-forbid-line" },
  { value: "completed", label: "منتهي", icon: "ri-checkbox-circle-line" },
  { value: "defaulted", label: "متعثر", icon: "ri-error-warning-line" },
  { value: "partial_default", label: "متعثر جزئي", icon: "ri-alert-line" },
];

const statCards = [
  { key: "rejected" as ClientSpecialStatus, label: "مرفوض", icon: "ri-close-circle-line", color: "text-red-600", bg: "bg-red-50", border: "border-red-100", darkBg: "bg-red-900/20", darkBorder: "border-red-800/40" },
  { key: "cancelled" as ClientSpecialStatus, label: "ملغي", icon: "ri-forbid-line", color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200", darkBg: "bg-gray-800", darkBorder: "border-gray-700" },
  { key: "completed" as ClientSpecialStatus, label: "منتهي", icon: "ri-checkbox-circle-line", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", darkBg: "bg-emerald-900/20", darkBorder: "border-emerald-800/40" },
  { key: "defaulted" as ClientSpecialStatus, label: "متعثر", icon: "ri-error-warning-line", color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-100", darkBg: "bg-rose-900/20", darkBorder: "border-rose-800/40" },
  { key: "partial_default" as ClientSpecialStatus, label: "متعثر جزئي", icon: "ri-alert-line", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100", darkBg: "bg-orange-900/20", darkBorder: "border-orange-800/40" },
];

export default function SpecialStatusPage() {
  const navigate = useNavigate();
  const { isDark } = useDashboardDarkMode();
  const [statusFilter, setStatusFilter] = useState<ClientSpecialStatus | "all">("all");
  const [search, setSearch] = useState("");

  const specialClients = mockClients.filter((c) => c.specialStatus);

  const filtered = specialClients.filter((c) => {
    const matchStatus = statusFilter === "all" || c.specialStatus === statusFilter;
    const matchSearch =
      c.fullName.includes(search) ||
      c.phone.includes(search) ||
      c.id.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <DashboardLayout title="حالات العملاء الخاصة">
      <div className="mb-5">
        <h2 className={`text-lg font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>حالات العملاء الخاصة</h2>
        <p className={`text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>متابعة الملفات المرفوضة والملغاة والمنتهية والمتعثرة</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {statCards.map((s) => (
          <button
            key={s.key}
            onClick={() => setStatusFilter(statusFilter === s.key ? "all" : s.key)}
            className={`${isDark ? s.darkBg : s.bg} border ${isDark ? s.darkBorder : s.border} rounded-xl p-4 text-right transition-all cursor-pointer hover:opacity-90 ${statusFilter === s.key ? "ring-2 ring-offset-1 ring-current" : ""}`}
          >
            <div className={`w-8 h-8 flex items-center justify-center rounded-lg mb-2 ${isDark ? "bg-gray-800" : "bg-white"}`}>
              <i className={`${s.icon} text-sm ${s.color}`}></i>
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{specialStatusStats[s.key]}</p>
            <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{s.label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <i className="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            placeholder="بحث بالاسم أو الجوال أو رقم الملف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pr-9 pl-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:border-brand-400 transition-colors ${isDark ? "bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-500" : "bg-white border-gray-200"}`}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((o) => (
            <button
              key={o.value}
              onClick={() => setStatusFilter(o.value)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === o.value
                  ? isDark ? "bg-gray-200 text-gray-900 border-gray-200" : "bg-gray-800 text-white border-gray-800"
                  : isDark ? "bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              <i className={`${o.icon} text-sm`}></i>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-xl border overflow-hidden transition-colors ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${isDark ? "bg-gray-800/60 border-gray-700" : "bg-gray-50 border-gray-100"}`}>
                {["رقم الملف", "العميل", "الخدمة", "المدينة", "الحالة", "السبب / الملاحظة", "تاريخ الحالة", "المسؤول", "إجراءات"].map((h) => (
                  <th key={h} className={`text-right px-4 py-3 text-xs font-semibold whitespace-nowrap ${isDark ? "text-gray-400" : "text-gray-500"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-gray-800" : "divide-gray-50"}`}>
              {filtered.map((client) => (
                <tr
                  key={client.id}
                  className={`transition-colors cursor-pointer ${isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50/60"}`}
                  onClick={() => navigate(`/dashboard/clients/${client.id}`)}
                >
                  <td className="px-4 py-3.5">
                    <span className={`font-mono text-xs px-2 py-0.5 rounded ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-500"}`}>{client.id}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div>
                      <p className={`font-semibold text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}>{client.fullName}</p>
                      <p className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{client.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>{client.serviceType}</span></td>
                  <td className="px-4 py-3.5"><span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>{client.city}</span></td>
                  <td className="px-4 py-3.5">
                    {client.specialStatus && (
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${specialStatusColors[client.specialStatus]}`}>
                        {specialStatusLabels[client.specialStatus]}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 max-w-[200px]">
                    <span className={`text-xs line-clamp-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{client.specialStatusReason || "—"}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {client.specialStatusDate
                        ? new Date(client.specialStatusDate).toLocaleDateString("ar-SA", { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5"><span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>{client.assignedTo || "—"}</span></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={`https://wa.me/966${client.phone.replace(/^0/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors cursor-pointer"
                        title="واتساب"
                      >
                        <i className="ri-whatsapp-line text-sm"></i>
                      </a>
                      <button
                        className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                        title="فتح الملف"
                        onClick={() => navigate(`/dashboard/clients/${client.id}`)}
                      >
                        <i className="ri-eye-line text-sm"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className={`px-4 py-12 text-center text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    <i className="ri-search-line text-2xl block mb-2"></i>
                    لا توجد نتائج مطابقة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className={`px-4 py-3 border-t ${isDark ? "border-gray-700" : "border-gray-100"}`}>
          <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>إجمالي النتائج: {filtered.length} ملف</span>
        </div>
      </div>
    </DashboardLayout>
  );
}
