import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  mockClients,
  stageLabels,
  stageColors,
  specialStatusLabels,
  specialStatusColors,
  type Client,
  type ClientStage,
  type ClientSpecialStatus,
} from "@/mocks/dashboardData";
import NewClientModal from "@/pages/dashboard/clients/components/NewClientModal";

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

const specialStatusOptions: { value: ClientSpecialStatus | "all"; label: string }[] = [
  { value: "all", label: "كل الحالات" },
  { value: "rejected", label: "مرفوض" },
  { value: "cancelled", label: "ملغي" },
  { value: "completed", label: "منتهي" },
  { value: "defaulted", label: "متعثر" },
  { value: "partial_default", label: "متعثر جزئي" },
];

export default function ClientsTable() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<ClientStage | "all">("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [specialFilter, setSpecialFilter] = useState<ClientSpecialStatus | "all">("all");
  const [showSpecialOnly, setShowSpecialOnly] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [extraClients, setExtraClients] = useState<Client[]>([]);

  const allClients = [...extraClients, ...mockClients];

  const handleAddClient = (client: Client) => {
    setExtraClients((prev) => [client, ...prev]);
  };

  const filtered = allClients.filter((c) => {
    const matchSearch =
      c.fullName.includes(search) ||
      c.phone.includes(search) ||
      c.id.includes(search);
    const matchStage = stageFilter === "all" || c.stage === stageFilter;
    const matchService = serviceFilter === "all" || c.serviceType === serviceFilter;
    const matchSpecial = !showSpecialOnly
      ? true
      : specialFilter === "all"
      ? !!c.specialStatus
      : c.specialStatus === specialFilter;
    return matchSearch && matchStage && matchService && matchSpecial;
  });

  const serviceTypes = Array.from(new Set(allClients.map((c) => c.serviceType)));

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <i className="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              type="text"
              placeholder="بحث بالاسم أو الجوال أو رقم الملف..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-9 pl-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as ClientStage | "all")}
            className="px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 cursor-pointer"
          >
            {stageOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 cursor-pointer"
          >
            <option value="all">جميع الخدمات</option>
            {serviceTypes.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-user-add-line"></i>
            إضافة عميل جديد
          </button>
        </div>
        {/* Special Status Filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowSpecialOnly(!showSpecialOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
              showSpecialOnly
                ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border-gray-800 dark:border-gray-200"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <i className="ri-filter-3-line text-sm"></i>
            الحالات الخاصة
          </button>
          {showSpecialOnly && (
            <div className="flex gap-2 flex-wrap">
              {specialStatusOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setSpecialFilter(o.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                    specialFilter === o.value
                      ? "bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-900 border-gray-700 dark:border-gray-200"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">رقم الملف</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">العميل</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">الخدمة</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">المدينة</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">المرحلة</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">المسؤول</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">تاريخ الطلب</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filtered.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-gray-50/60 dark:hover:bg-gray-800/60 transition-colors cursor-pointer"
                  onClick={() => navigate(`/dashboard/clients/${client.id}`)}
                >
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{client.id}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{client.fullName}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{client.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{client.serviceType}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{client.city}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${stageColors[client.stage]}`}>
                        {stageLabels[client.stage]}
                      </span>
                      {client.specialStatus && (
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${specialStatusColors[client.specialStatus]}`}>
                          {specialStatusLabels[client.specialStatus]}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{client.assignedTo || "—"}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(client.submittedAt).toLocaleDateString("ar-SA", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={`https://wa.me/966${client.phone.replace(/^0/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors cursor-pointer"
                        title="واتساب"
                      >
                        <i className="ri-whatsapp-line text-sm"></i>
                      </a>
                      <button
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
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
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400 dark:text-gray-600 text-sm">
                    <i className="ri-search-line text-2xl block mb-2"></i>
                    لا توجد نتائج مطابقة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">إجمالي النتائج: {filtered.length} ملف</span>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
              <i className="ri-arrow-right-s-line text-sm"></i>
            </button>
            <span className="text-xs text-gray-600 dark:text-gray-400 px-2">1 / 1</span>
            <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
              <i className="ri-arrow-left-s-line text-sm"></i>
            </button>
          </div>
        </div>
      </div>

      <NewClientModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddClient}
      />
    </div>
  );
}
