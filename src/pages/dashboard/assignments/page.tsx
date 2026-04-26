import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/pages/dashboard/components/DashboardLayout";
import { useToast } from "@/hooks/useToast";
import { useClients } from "@/hooks/useClients";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardDarkMode } from "@/pages/dashboard/context/DashboardDarkModeContext";
import { employees, stageLabels, roleLabels, type UserRole } from "@/mocks/dashboardData";

export default function AssignmentsPage() {
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const { success, error: toastError } = useToast();
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [assignMode, setAssignMode] = useState<"auto" | "manual">("manual");
  const { isDark } = useDashboardDarkMode();

  const { user } = useAuth();
  const { clients, unassignedClients, assignedClients, assignClient, autoDistribute } = useClients();

  const availableEmployees = employees.filter((e) => e.role === "employee");

  const filteredClients = useMemo(() => {
    return unassignedClients.filter((c) => {
      const matchSearch =
        c.fullName.includes(search) ||
        c.phone.includes(search) ||
        c.id.includes(search);
      const matchCity = cityFilter === "all" || c.city === cityFilter;
      const matchService = serviceFilter === "all" || c.serviceType === serviceFilter;
      return matchSearch && matchCity && matchService;
    });
  }, [unassignedClients, search, cityFilter, serviceFilter]);

  const cities = useMemo(() => [...new Set(unassignedClients.map((c) => c.city))], [unassignedClients]);
  const services = useMemo(() => [...new Set(unassignedClients.map((c) => c.serviceType))], [unassignedClients]);

  const employeeWorkload = useMemo(() => {
    return availableEmployees.map((emp) => {
      const count = clients.filter(
        (c) => c.assignedTo === emp.name && !c.specialStatus
      ).length;
      const capacity = 25;
      const percentage = Math.round((count / capacity) * 100);
      return { ...emp, count, capacity, percentage };
    });
  }, [availableEmployees, clients]);

  const recentFromLanding = useMemo(() => {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    return unassignedClients.filter(
      (c) =>
        c.source === "صفحة الهبوط" &&
        new Date(c.submittedAt).getTime() > cutoff
    ).length;
  }, [unassignedClients]);

  const toggleClient = (id: string) => {
    const next = new Set(selectedClients);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedClients(next);
  };

  const toggleAll = () => {
    if (selectedClients.size === filteredClients.length) {
      setSelectedClients(new Set());
    } else {
      setSelectedClients(new Set(filteredClients.map((c) => c.id)));
    }
  };

  const handleAssign = () => {
    if (selectedClients.size === 0) {
      toastError("يرجى اختيار عميل واحد على الأقل");
      return;
    }
    if (!selectedEmployee && assignMode === "manual") {
      toastError("يرجى اختيار موظف من القائمة");
      return;
    }
    setShowConfirm(true);
  };

  const confirmAssign = () => {
    const performedBy = user?.name ?? "المشرف";
    if (assignMode === "manual") {
      const emp = availableEmployees.find((e) => e.id === selectedEmployee);
      if (!emp) return;
      selectedClients.forEach((clientId) => {
        assignClient(clientId, emp.name, emp.role as UserRole, performedBy);
      });
      success(`تم تعيين ${selectedClients.size} عميل بنجاح`, `تم التعيين لـ ${emp.name}`);
    } else {
      const assignments = autoDistribute([...selectedClients], performedBy);
      const uniqueEmployees = [...new Set(Object.values(assignments))];
      success(`تم توزيع ${selectedClients.size} عميل تلقائياً`, `على ${uniqueEmployees.length} موظف حسب الحمل`);
    }
    setSelectedClients(new Set());
    setSelectedEmployee("");
    setShowConfirm(false);
  };

  const getWorkloadColor = (percentage: number) => {
    if (percentage < 50) return "bg-emerald-500";
    if (percentage < 80) return "bg-amber-500";
    return "bg-red-500";
  };

  const getWorkloadText = (percentage: number) => {
    if (percentage < 50) return "text-emerald-600";
    if (percentage < 80) return "text-amber-600";
    return "text-red-600";
  };

  const isNewFromLanding = (submittedAt: string, source: string) => {
    const cutoff = Date.now() - 60 * 60 * 1000;
    return source === "صفحة الهبوط" && new Date(submittedAt).getTime() > cutoff;
  };

  return (
    <DashboardLayout title="توزيع العملاء">
      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className={`rounded-xl w-full max-w-md p-6 transition-colors ${isDark ? "bg-gray-900 border border-gray-700" : "bg-white"}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? "bg-brand-900/40" : "bg-brand-50"}`}>
              <i className="ri-user-add-line text-brand-600 text-xl"></i>
            </div>
            <h3 className={`text-lg font-bold text-center mb-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>تأكيد التعيين</h3>
            <p className={`text-sm text-center mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {assignMode === "manual"
                ? `هل أنت متأكد من تعيين ${selectedClients.size} عميل للموظف المختار؟`
                : `هل أنت متأكد من التوزيع التلقائي لـ ${selectedClients.size} عميل على الموظفين حسب الحمل؟`}
            </p>
            {assignMode === "auto" && (
              <div className={`rounded-lg px-4 py-3 mb-4 text-right ${isDark ? "bg-brand-900/30 border border-brand-800/50" : "bg-brand-50/60"}`}>
                <p className={`text-xs font-medium mb-1 ${isDark ? "text-brand-300" : "text-brand-700"}`}>
                  <i className="ri-magic-line ml-1"></i>آلية التوزيع التلقائي
                </p>
                <p className={`text-xs ${isDark ? "text-brand-400" : "text-brand-600"}`}>
                  يتم توزيع العملاء على الموظف الأقل حملاً في كل مرة، لضمان التوازن بين الفريق.
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium cursor-pointer transition-colors ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
              >
                إلغاء
              </button>
              <button
                onClick={confirmAssign}
                className="flex-1 px-4 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 cursor-pointer"
              >
                تأكيد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {[
          { label: "غير مسندين", value: unassignedClients.length, sub: "بانتظار التوزيع", icon: "ri-user-unfollow-line", iconBg: isDark ? "bg-amber-900/30" : "bg-amber-50", iconColor: "text-amber-600" },
          { label: "مسندين", value: assignedClients.length, sub: "قيد المتابعة", icon: "ri-user-follow-line", iconBg: isDark ? "bg-emerald-900/30" : "bg-emerald-50", iconColor: "text-emerald-600" },
          { label: "الموظفين النشطين", value: availableEmployees.length, sub: "متاحين للتعيين", icon: "ri-team-line", iconBg: isDark ? "bg-sky-900/30" : "bg-sky-50", iconColor: "text-sky-600" },
          { label: "من صفحة الهبوط", value: recentFromLanding, sub: "آخر 24 ساعة", icon: "ri-global-line", iconBg: isDark ? "bg-brand-900/30" : "bg-brand-50", iconColor: "text-brand-600", pulse: recentFromLanding > 0 },
        ].map((card, i) => (
          <div key={i} className={`rounded-xl border p-4 relative overflow-hidden transition-colors ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{card.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.iconBg}`}>
                <i className={`${card.icon} ${card.iconColor} text-sm`}></i>
              </div>
            </div>
            <p className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>{card.value}</p>
            <p className={`text-[10px] mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{card.sub}</p>
            {card.pulse && <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Unassigned Clients */}
        <div className="xl:col-span-2 space-y-4">
          <div className={`rounded-xl border transition-colors ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
            {/* Header */}
            <div className={`px-5 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isDark ? "border-gray-700" : "border-gray-100"}`}>
              <div>
                <h3 className={`text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>العملاء غير المسندين</h3>
                <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>اختر العملاء وعيّنهم للموظفين</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAssignMode("manual")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                    assignMode === "manual" ? "bg-brand-500 text-white" : isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <i className="ri-hand-coin-line ml-1"></i>تعيين يدوي
                </button>
                <button
                  onClick={() => setAssignMode("auto")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                    assignMode === "auto" ? "bg-brand-500 text-white" : isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <i className="ri-magic-line ml-1"></i>توزيع تلقائي
                </button>
              </div>
            </div>

            {/* Auto mode banner */}
            {assignMode === "auto" && (
              <div className={`px-5 py-3 border-b flex items-center gap-2 ${isDark ? "bg-brand-900/20 border-brand-800/40" : "bg-brand-50/60 border-brand-100"}`}>
                <i className="ri-magic-line text-brand-500 text-sm"></i>
                <p className={`text-xs ${isDark ? "text-brand-300" : "text-brand-700"}`}>
                  وضع التوزيع التلقائي — سيتم توزيع العملاء المحددين على الموظف الأقل حملاً تلقائياً
                </p>
              </div>
            )}

            {/* Filters */}
            <div className={`px-5 py-3 border-b flex flex-col sm:flex-row gap-2 ${isDark ? "border-gray-700" : "border-gray-100"}`}>
              <div className="relative flex-1">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                  <i className="ri-search-line text-gray-400 text-sm"></i>
                </div>
                <input
                  type="text"
                  placeholder="بحث بالاسم أو الجوال أو رقم الملف..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full pr-9 pl-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300 transition-colors ${isDark ? "bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-500" : "bg-white border-gray-200 text-gray-800"}`}
                />
              </div>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className={`px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 transition-colors ${isDark ? "bg-gray-800 border-gray-600 text-gray-200" : "bg-white border-gray-200"}`}
              >
                <option value="all">كل المدن</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className={`px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 transition-colors ${isDark ? "bg-gray-800 border-gray-600 text-gray-200" : "bg-white border-gray-200"}`}
              >
                <option value="all">كل الخدمات</option>
                {services.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={isDark ? "bg-gray-800/60" : "bg-gray-50/60"}>
                    <th className="px-4 py-3 text-right">
                      <button
                        onClick={toggleAll}
                        className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer hover:border-brand-400 transition-colors ${isDark ? "border-gray-600" : "border-gray-300"}`}
                      >
                        {selectedClients.size === filteredClients.length && filteredClients.length > 0 && (
                          <i className="ri-check-line text-brand-600 text-xs"></i>
                        )}
                      </button>
                    </th>
                    {["العميل", "الخدمة", "المدينة", "جهة العمل", "المصدر", "تاريخ الطلب", ""].map((h) => (
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
                        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>لا يوجد عملاء غير مسندين</p>
                        <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>ستظهر هنا الطلبات الجديدة من صفحة الهبوط</p>
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((client) => (
                      <tr key={client.id} className={`border-b transition-colors ${isDark ? "border-gray-800 hover:bg-gray-800/50" : "border-gray-50 hover:bg-gray-50/50"}`}>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleClient(client.id)}
                            className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-all ${
                              selectedClients.has(client.id)
                                ? "bg-brand-500 border-brand-500"
                                : isDark ? "border-gray-600 hover:border-brand-400" : "border-gray-300 hover:border-brand-400"
                            }`}
                          >
                            {selectedClients.has(client.id) && <i className="ri-check-line text-white text-xs"></i>}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="relative">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? "bg-brand-900/40" : "bg-brand-100"}`}>
                                <span className="text-brand-700 text-[10px] font-bold">
                                  {client.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                                </span>
                              </div>
                              {isNewFromLanding(client.submittedAt, client.source) && (
                                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-brand-500 border-2 border-white"></span>
                              )}
                            </div>
                            <div>
                              <p className={`text-xs font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>{client.fullName}</p>
                              <p className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>{client.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>{client.serviceType}</span></td>
                        <td className="px-4 py-3"><span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>{client.city}</span></td>
                        <td className="px-4 py-3"><span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>{client.employerName || client.employerType}</span></td>
                        <td className="px-4 py-3">
                          {client.source === "صفحة الهبوط" ? (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${isDark ? "bg-brand-900/40 text-brand-400" : "bg-brand-50 text-brand-600"}`}>
                              <i className="ri-global-line text-[10px]"></i>الهبوط
                            </span>
                          ) : (
                            <span className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>{client.source}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            {new Date(client.submittedAt).toLocaleDateString("ar-SA")}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/dashboard/clients/${client.id}`}
                            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${isDark ? "text-gray-500 hover:text-brand-400 hover:bg-brand-900/30" : "text-gray-400 hover:text-brand-600 hover:bg-brand-50"}`}
                          >
                            <i className="ri-external-link-line text-sm"></i>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Bulk Actions */}
            {selectedClients.size > 0 && (
              <div className={`px-5 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${isDark ? "border-gray-700 bg-brand-900/20" : "border-gray-100 bg-brand-50/40"}`}>
                <span className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  تم اختيار <span className="font-bold text-brand-600">{selectedClients.size}</span> عميل
                </span>
                <div className="flex items-center gap-2">
                  {assignMode === "manual" && (
                    <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className={`px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 transition-colors ${isDark ? "bg-gray-800 border-gray-600 text-gray-200" : "bg-white border-gray-200"}`}
                    >
                      <option value="">اختر موظف...</option>
                      {availableEmployees.map((emp) => {
                        const wl = employeeWorkload.find((e) => e.id === emp.id);
                        return <option key={emp.id} value={emp.id}>{emp.name} ({wl?.count ?? 0} ملف)</option>;
                      })}
                    </select>
                  )}
                  <button
                    onClick={handleAssign}
                    className="px-4 py-2 rounded-lg bg-brand-500 text-white text-xs font-medium hover:bg-brand-600 cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                  >
                    <i className={assignMode === "auto" ? "ri-magic-line" : "ri-user-add-line"}></i>
                    {assignMode === "manual" ? "تعيين" : "توزيع تلقائي"}
                  </button>
                  <button
                    onClick={() => setSelectedClients(new Set())}
                    className={`px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${isDark ? "border-gray-600 text-gray-400 hover:bg-gray-800" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Recently Assigned */}
          <div className={`rounded-xl border transition-colors ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
            <div className={`px-5 py-4 border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}>
              <h3 className={`text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>آخر التعيينات</h3>
              <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>العملاء المسندين مؤخراً</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={isDark ? "bg-gray-800/60" : "bg-gray-50/60"}>
                    {["العميل", "الخدمة", "الموظف", "المرحلة", "تاريخ التعيين", ""].map((h) => (
                      <th key={h} className={`px-4 py-3 text-right text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-600"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {assignedClients.slice(0, 6).map((client) => (
                    <tr key={client.id} className={`border-b transition-colors ${isDark ? "border-gray-800 hover:bg-gray-800/50" : "border-gray-50 hover:bg-gray-50/50"}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                            <span className={`text-[10px] font-bold ${isDark ? "text-gray-300" : "text-gray-600"}`}>
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
                      <td className="px-4 py-3"><span className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>{client.assignedTo}</span></td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                          {stageLabels[client.stage]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          {client.actionLogs.find((l) => l.action.includes("تعيين"))?.timestamp
                            ? new Date(client.actionLogs.find((l) => l.action.includes("تعيين"))!.timestamp).toLocaleDateString("ar-SA")
                            : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/dashboard/clients/${client.id}`}
                          className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${isDark ? "text-gray-500 hover:text-brand-400 hover:bg-brand-900/30" : "text-gray-400 hover:text-brand-600 hover:bg-brand-50"}`}
                        >
                          <i className="ri-external-link-line text-sm"></i>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Employees Workload */}
        <div className="space-y-4">
          <div className={`rounded-xl border transition-colors ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
            <div className={`px-5 py-4 border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}>
              <h3 className={`text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>حمل الموظفين</h3>
              <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>توزيع الملفات حسب الموظف</p>
            </div>
            <div className="p-4 space-y-3">
              {employeeWorkload.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => assignMode === "manual" && setSelectedEmployee(emp.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedEmployee === emp.id
                      ? isDark ? "border-brand-600 bg-brand-900/30" : "border-brand-300 bg-brand-50/50"
                      : isDark ? "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                      {emp.avatar ? (
                        <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className={`text-xs font-bold ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                          {emp.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>{emp.name}</p>
                      <p className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>{roleLabels[emp.role as UserRole]}</p>
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-bold ${getWorkloadText(emp.percentage)}`}>{emp.count}</p>
                      <p className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>/ {emp.capacity}</p>
                    </div>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                    <div
                      className={`h-full rounded-full transition-all ${getWorkloadColor(emp.percentage)}`}
                      style={{ width: `${Math.min(emp.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className={`text-[10px] mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    {emp.percentage < 50 ? "حمل منخفض — متاح" : emp.percentage < 80 ? "حمل متوسط" : "حمل مرتفع — مكتظ"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className={`rounded-xl border p-4 transition-colors ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>
            <h4 className={`text-xs font-bold mb-3 ${isDark ? "text-gray-200" : "text-gray-800"}`}>ملخص التوزيع</h4>
            <div className="space-y-2">
              {[
                { label: "أقل حمل", value: employeeWorkload.reduce((min, e) => (e.count < min.count ? e : min), employeeWorkload[0])?.name, color: "text-emerald-600" },
                { label: "أكثر حمل", value: employeeWorkload.reduce((max, e) => (e.count > max.count ? e : max), employeeWorkload[0])?.name, color: "text-red-600" },
                { label: "متوسط الحمل", value: `${Math.round(employeeWorkload.reduce((sum, e) => sum + e.count, 0) / employeeWorkload.length)} ملف`, color: isDark ? "text-gray-300" : "text-gray-700" },
                { label: "السعة المتاحة", value: `${employeeWorkload.reduce((sum, e) => sum + (e.capacity - e.count), 0)} ملف`, color: isDark ? "text-gray-300" : "text-gray-700" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{item.label}</span>
                  <span className={`text-xs font-medium ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Auto-assign info */}
          <div className={`rounded-xl border p-4 transition-colors ${isDark ? "bg-brand-900/20 border-brand-800/40" : "bg-gradient-to-br from-brand-50 to-brand-100/50 border-brand-100"}`}>
            <div className="flex items-center gap-2 mb-2">
              <i className="ri-magic-line text-brand-600 text-sm"></i>
              <h4 className={`text-xs font-bold ${isDark ? "text-brand-300" : "text-brand-800"}`}>التوزيع التلقائي</h4>
            </div>
            <p className={`text-[11px] leading-relaxed ${isDark ? "text-brand-400" : "text-brand-700"}`}>
              عند وصول عميل من صفحة الهبوط، يُعيَّن تلقائياً للموظف الأقل حملاً لضمان التوازن بين الفريق.
            </p>
            <div className={`mt-3 pt-3 border-t ${isDark ? "border-brand-800/40" : "border-brand-200/50"}`}>
              <p className={`text-[10px] font-medium ${isDark ? "text-brand-400" : "text-brand-600"}`}>الموظف الأنسب الآن:</p>
              <p className={`text-xs font-bold mt-0.5 ${isDark ? "text-brand-300" : "text-brand-800"}`}>
                {employeeWorkload.length > 0
                  ? employeeWorkload.reduce((min, e) => (e.count < min.count ? e : min), employeeWorkload[0])?.name
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
