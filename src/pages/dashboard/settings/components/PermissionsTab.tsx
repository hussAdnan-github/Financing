import { useState } from "react";
import { roleLabels, type UserRole } from "@/mocks/dashboardData";
import { usePermissions } from "@/hooks/usePermissions";

const roleColors: Record<UserRole, string> = {
  employee: "bg-sky-500",
  supervisor: "bg-emerald-500",
  auditor: "bg-amber-500",
  manager: "bg-rose-500",
};

const roleBadgeColors: Record<UserRole, string> = {
  employee: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/40 dark:text-sky-400 dark:border-sky-800",
  supervisor: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800",
  auditor: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800",
  manager: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-400 dark:border-rose-800",
};

const roleDescriptions: Record<UserRole, string> = {
  employee: "يعمل على ملفات العملاء المسندة إليه",
  supervisor: "يراقب الموظفين ويعتمد الطلبات",
  auditor: "يراجع الوثائق ويتحقق من صحتها",
  manager: "صلاحيات كاملة على جميع أقسام النظام",
};

const roles: UserRole[] = ["employee", "supervisor", "auditor", "manager"];

export default function PermissionsTab() {
  const {
    groups,
    totalPerms,
    togglePermission,
    resetToDefaults,
    getRolePermCount,
  } = usePermissions();

  const [activeRole, setActiveRole] = useState<UserRole | "matrix">("matrix");
  const [hasChanges, setHasChanges] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggle = (gi: number, pi: number, role: UserRole) => {
    if (role === "manager") return;
    togglePermission(gi, pi, role);
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
    showToast("تم حفظ إعدادات الصلاحيات بنجاح");
  };

  const handleReset = () => {
    resetToDefaults();
    setHasChanges(false);
    showToast("تم إعادة تعيين الصلاحيات للإعدادات الافتراضية");
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gray-800 dark:bg-gray-700 text-white text-sm px-5 py-2.5 rounded-xl flex items-center gap-2">
          <i className="ri-check-line text-green-400"></i>
          {toast}
        </div>
      )}

      {/* Role Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {roles.map((role) => {
          const count = getRolePermCount(role);
          const pct = Math.round((count / totalPerms) * 100);
          const isActive = activeRole === role;
          return (
            <div
              key={role}
              onClick={() => setActiveRole(isActive ? "matrix" : role)}
              className={`bg-white dark:bg-gray-900 rounded-xl p-4 border cursor-pointer transition-all ${
                isActive ? "border-brand-400 ring-1 ring-brand-300 dark:ring-brand-800" : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${roleBadgeColors[role]}`}>
                  {roleLabels[role]}
                </span>
                {role === "manager" && (
                  <i className="ri-shield-star-line text-rose-400 text-sm"></i>
                )}
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mb-2">
                <div
                  className={`h-1.5 rounded-full transition-all ${roleColors[role]}`}
                  style={{ width: `${pct}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">{count}/{totalPerms} صلاحية</p>
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{pct}%</p>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 leading-tight">{roleDescriptions[role]}</p>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveRole("matrix")}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeRole === "matrix" ? "bg-gray-800 dark:bg-gray-700 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <i className="ri-table-line"></i>
              مصفوفة الصلاحيات
            </button>
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRole(r)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeRole === r ? `${roleColors[r]} text-white` : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {roleLabels[r]}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <i className="ri-refresh-line"></i>
              إعادة تعيين
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`text-xs px-4 py-1.5 rounded-lg font-semibold cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                hasChanges
                  ? "bg-brand-500 text-white hover:bg-brand-600"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
              }`}
            >
              <i className="ri-save-line"></i>
              حفظ التغييرات
            </button>
          </div>
        </div>
      </div>

      {/* ─── Matrix View ─── */}
      {activeRole === "matrix" && (
        <div className="space-y-4">
          {groups.map((group, gi) => {
            const isExpanded = expandedGroups[group.group] !== false;
            return (
              <div key={group.group} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleGroup(group.group)}
                  className="w-full flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 flex items-center justify-center">
                    <i className={`${group.icon} text-gray-500 dark:text-gray-400`}></i>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{group.group}</h3>
                  <span className="text-xs text-gray-400 dark:text-gray-500 mr-auto">{group.permissions.length} صلاحية</span>
                  <i className={`text-gray-400 dark:text-gray-500 text-sm transition-transform ${isExpanded ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}`}></i>
                </button>

                {isExpanded && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/30">
                          <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-2.5 w-1/2">الصلاحية</th>
                          {roles.map((r) => (
                            <th key={r} className="text-center text-xs font-medium px-3 py-2.5 min-w-[80px]">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${roleBadgeColors[r]}`}>
                                {roleLabels[r]}
                              </span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {group.permissions.map((perm, pi) => (
                          <tr key={perm.key} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                            <td className="px-4 py-3">
                              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{perm.label}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{perm.description}</p>
                            </td>
                            {roles.map((r) => (
                              <td key={r} className="px-3 py-3 text-center">
                                <button
                                  onClick={() => handleToggle(gi, pi, r)}
                                  disabled={r === "manager"}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center mx-auto transition-all ${
                                    perm.roles[r]
                                      ? `${roleColors[r]} text-white`
                                      : "bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
                                  } ${r === "manager" ? "cursor-not-allowed opacity-80" : "cursor-pointer hover:opacity-80"}`}
                                >
                                  {perm.roles[r] ? (
                                    <i className="ri-check-line text-xs"></i>
                                  ) : (
                                    <i className="ri-close-line text-xs"></i>
                                  )}
                                </button>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Single Role View ─── */}
      {activeRole !== "matrix" && (
        <div className="space-y-4">
          {/* Role Header */}
          <div className={`rounded-xl p-5 text-white ${roleColors[activeRole]}`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="ri-user-settings-line text-xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{roleLabels[activeRole]}</h3>
                <p className="text-sm opacity-80 mt-0.5">{roleDescriptions[activeRole]}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{getRolePermCount(activeRole)}</p>
                <p className="text-xs opacity-70">من {totalPerms} صلاحية</p>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-4">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="h-2 bg-white rounded-full transition-all"
                  style={{ width: `${Math.round((getRolePermCount(activeRole) / totalPerms) * 100)}%` }}
                ></div>
              </div>
            </div>

            {activeRole === "manager" && (
              <div className="mt-3 bg-white/20 rounded-lg px-3 py-2 inline-flex items-center gap-2">
                <i className="ri-shield-star-line text-sm"></i>
                <p className="text-xs font-semibold">صلاحيات كاملة — لا يمكن تعديلها</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {activeRole !== "manager" && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3 flex-wrap">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">إجراءات سريعة:</span>
              <button
                onClick={() => {
                  groups.forEach((g, gi) => g.permissions.forEach((_, pi) => {
                    if (!groups[gi].permissions[pi].roles[activeRole]) {
                      handleToggle(gi, pi, activeRole);
                    }
                  }));
                }}
                className="text-xs px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 cursor-pointer font-medium whitespace-nowrap"
              >
                <i className="ri-check-double-line ml-1"></i>
                تفعيل الكل
              </button>
              <button
                onClick={() => {
                  groups.forEach((g, gi) => g.permissions.forEach((_, pi) => {
                    if (groups[gi].permissions[pi].roles[activeRole]) {
                      handleToggle(gi, pi, activeRole);
                    }
                  }));
                }}
                className="text-xs px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 cursor-pointer font-medium whitespace-nowrap"
              >
                <i className="ri-close-circle-line ml-1"></i>
                إلغاء الكل
              </button>
            </div>
          )}

          {/* Permission Groups */}
          {groups.map((group, gi) => {
            const groupEnabled = group.permissions.filter((p) =>
              activeRole === "manager" ? true : p.roles[activeRole]
            ).length;

            return (
              <div key={group.group} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="w-7 h-7 flex items-center justify-center">
                    <i className={`${group.icon} text-gray-500 dark:text-gray-400`}></i>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{group.group}</h3>
                  <div className="mr-auto flex items-center gap-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500">{groupEnabled}/{group.permissions.length}</span>
                    <div className="w-16 bg-gray-100 dark:bg-gray-800 rounded-full h-1">
                      <div
                        className={`h-1 rounded-full ${roleColors[activeRole]}`}
                        style={{ width: `${Math.round((groupEnabled / group.permissions.length) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                  {group.permissions.map((perm, pi) => (
                    <div key={perm.key} className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex-1 min-w-0 ml-4">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{perm.label}</p>
                          {activeRole !== "manager" && perm.roles[activeRole] && (
                            <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded font-medium">مفعّل</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{perm.description}</p>
                      </div>
                      <button
                        onClick={() => handleToggle(gi, pi, activeRole)}
                        disabled={activeRole === "manager"}
                        className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 ${
                          (activeRole === "manager" || perm.roles[activeRole])
                            ? roleColors[activeRole]
                            : "bg-gray-200 dark:bg-gray-700"
                        } ${activeRole === "manager" ? "cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                            (activeRole === "manager" || perm.roles[activeRole]) ? "left-1" : "right-1"
                          }`}
                        ></span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
