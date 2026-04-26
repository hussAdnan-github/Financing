import { useState } from "react";
import {
  systemUsers,
  permissionGroups,
  roleLabels,
  type SystemUser,
  type UserRole,
  type UserStatus,
} from "@/mocks/dashboardData";
import { usePermissions } from "@/hooks/usePermissions";

const roleColors: Record<UserRole, string> = {
  employee: "bg-sky-100 text-sky-700",
  supervisor: "bg-emerald-100 text-emerald-700",
  auditor: "bg-amber-100 text-amber-700",
  manager: "bg-rose-100 text-rose-700",
};

const roleIconColors: Record<UserRole, string> = {
  employee: "bg-sky-500",
  supervisor: "bg-emerald-500",
  auditor: "bg-amber-500",
  manager: "bg-rose-500",
};

const statusLabels: Record<UserStatus, string> = {
  active: "نشط",
  inactive: "غير نشط",
  suspended: "موقوف",
};

const statusColors: Record<UserStatus, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  inactive: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  suspended: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

const avatarColors = [
  "bg-rose-400", "bg-emerald-400", "bg-amber-400", "bg-sky-400",
  "bg-violet-400", "bg-teal-400", "bg-orange-400", "bg-pink-400",
];

// ─── User Form Modal ──────────────────────────────────────────────────────────
interface UserModalProps {
  user?: SystemUser | null;
  onClose: () => void;
  onSave: (user: Partial<SystemUser>) => void;
}

function UserModal({ user, onClose, onSave }: UserModalProps) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || ("employee" as UserRole),
    status: user?.status || ("active" as UserStatus),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
              <i className="ri-user-add-line text-brand-500 text-sm"></i>
            </div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">{user ? "تعديل المستخدم" : "إضافة مستخدم جديد"}</h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
            <i className="ri-close-line text-gray-500 dark:text-gray-400"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">الاسم الكامل <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                placeholder="أدخل الاسم الكامل"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">البريد الإلكتروني <span className="text-red-400">*</span></label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                placeholder="example@company.sa"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">رقم الجوال</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                placeholder="05XXXXXXXX"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">الدور الوظيفي</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 cursor-pointer bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                >
                  {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                    <option key={r} value={r}>{roleLabels[r]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">الحالة</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as UserStatus })}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 cursor-pointer bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                >
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                  <option value="suspended">موقوف</option>
                </select>
              </div>
            </div>
          </div>

          {/* Role description */}
          <div className={`rounded-xl px-4 py-3 ${roleIconColors[form.role]} bg-opacity-10`} style={{ backgroundColor: `${form.role === "employee" ? "#e0f2fe" : form.role === "supervisor" ? "#d1fae5" : form.role === "auditor" ? "#fef3c7" : "#ffe4e6"}` }}>
            <p className="text-xs font-semibold text-gray-700 mb-1">
              {form.role === "employee" && "موظف — يعمل على ملفات العملاء المسندة إليه"}
              {form.role === "supervisor" && "مشرف — يراقب الموظفين ويعتمد الطلبات"}
              {form.role === "auditor" && "مدقق — يراجع الوثائق ويتحقق من صحتها"}
              {form.role === "manager" && "مدير — صلاحيات كاملة على جميع أقسام النظام"}
            </p>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 bg-brand-500 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-brand-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              {user ? "حفظ التعديلات" : "إضافة المستخدم"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── User Permissions Drawer ──────────────────────────────────────────────────
interface UserPermissionsDrawerProps {
  user: SystemUser;
  onClose: () => void;
}

function UserPermissionsDrawer({ user, onClose }: UserPermissionsDrawerProps) {
  const { groups, checkPermission, setRolePermission, totalPerms, getRolePermCount } = usePermissions();
  const [localOverrides, setLocalOverrides] = useState<Record<string, boolean>>(() => {
    const overrides: Record<string, boolean> = {};
    groups.forEach((g) => g.permissions.forEach((p) => {
      overrides[p.key] = checkPermission(user.role, p.key);
    }));
    return overrides;
  });
  const [saved, setSaved] = useState(false);

  const toggleOverride = (key: string) => {
    if (user.role === "manager") return;
    setLocalOverrides((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = () => {
    Object.entries(localOverrides).forEach(([key, val]) => {
      setRolePermission(key, user.role, val);
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const enabledCount = Object.values(localOverrides).filter(Boolean).length;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-900 w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${avatarColors[0]}`}>
              {user.initials}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">{user.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${roleColors[user.role]}`}>
                  {roleLabels[user.role]}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{enabledCount}/{totalPerms} صلاحية</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
            <i className="ri-close-line text-gray-500 dark:text-gray-400"></i>
          </button>
        </div>

        {user.role === "manager" && (
          <div className="mx-5 mt-4 flex items-center gap-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-xl px-4 py-3">
            <i className="ri-shield-star-line text-rose-500 text-lg"></i>
            <p className="text-sm text-rose-700 dark:text-rose-400 font-medium">المدير يملك صلاحيات كاملة — لا يمكن تعديلها</p>
          </div>
        )}

        {/* Permissions List */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {groups.map((group) => (
            <div key={group.group} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50/60 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className={`${group.icon} text-gray-500 dark:text-gray-400 text-sm`}></i>
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{group.group}</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 mr-auto">
                  {group.permissions.filter((p) => localOverrides[p.key]).length}/{group.permissions.length}
                </span>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {group.permissions.map((perm) => (
                  <div key={perm.key} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                    <div className="flex-1 min-w-0 ml-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{perm.label}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{perm.description}</p>
                    </div>
                    <button
                      onClick={() => toggleOverride(perm.key)}
                      disabled={user.role === "manager"}
                      className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 ${
                        localOverrides[perm.key] ? roleIconColors[user.role] : "bg-gray-200 dark:bg-gray-700"
                      } ${user.role === "manager" ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                        localOverrides[perm.key] ? "left-0.5" : "right-0.5"
                      }`}></span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {user.role !== "manager" && (
          <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3 flex-shrink-0">
            {saved && (
              <span className="text-xs text-green-600 flex items-center gap-1">
                <i className="ri-check-line"></i>
                تم الحفظ
              </span>
            )}
            <button
              onClick={handleSave}
              className="mr-auto flex items-center gap-2 bg-brand-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-600 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-save-line"></i>
              حفظ الصلاحيات
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function UsersTab() {
  const [users, setUsers] = useState<SystemUser[]>(systemUsers);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<UserRole | "all">("all");
  const [filterStatus, setFilterStatus] = useState<UserStatus | "all">("all");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<SystemUser | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [permissionsUser, setPermissionsUser] = useState<SystemUser | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.name.includes(search) || u.email.includes(search) || u.phone.includes(search);
    const matchRole = filterRole === "all" || u.role === filterRole;
    const matchStatus = filterStatus === "all" || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const handleSave = (data: Partial<SystemUser>) => {
    if (editUser) {
      setUsers((prev) => prev.map((u) => (u.id === editUser.id ? { ...u, ...data } : u)));
      showToast("تم تحديث بيانات المستخدم بنجاح");
    } else {
      const newUser: SystemUser = {
        id: `usr${Date.now()}`,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        role: data.role || "employee",
        status: data.status || "active",
        assignedCount: 0,
        joinedAt: new Date().toISOString().split("T")[0],
        lastActive: new Date().toISOString(),
        initials: (data.name || "").slice(0, 2),
      };
      setUsers((prev) => [newUser, ...prev]);
      showToast("تم إضافة المستخدم بنجاح");
    }
    setEditUser(null);
  };

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setConfirmDelete(null);
    showToast("تم حذف المستخدم");
  };

  const toggleStatus = (id: string, current: UserStatus) => {
    const next: UserStatus = current === "active" ? "suspended" : "active";
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: next } : u)));
    showToast(next === "active" ? "تم تفعيل المستخدم" : "تم إيقاف المستخدم");
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  };

  const roleCounts = (Object.keys(roleLabels) as UserRole[]).reduce((acc, r) => {
    acc[r] = users.filter((u) => u.role === r).length;
    return acc;
  }, {} as Record<UserRole, number>);

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gray-800 dark:bg-gray-700 text-white text-sm px-5 py-2.5 rounded-xl flex items-center gap-2">
          <i className="ri-check-line text-green-400"></i>
          {toast}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.keys(roleLabels) as UserRole[]).map((r, i) => (
          <div
            key={r}
            onClick={() => setFilterRole(filterRole === r ? "all" : r)}
            className={`bg-white dark:bg-gray-900 rounded-xl p-4 border cursor-pointer transition-all ${
              filterRole === r ? "border-brand-400 ring-1 ring-brand-200 dark:ring-brand-800" : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{roleLabels[r]}</span>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${avatarColors[i]}`}>
                <i className="ri-user-line text-white text-xs"></i>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{roleCounts[r]}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {users.filter((u) => u.role === r && u.status === "active").length} نشط
            </p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-2 flex-1 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <i className="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث بالاسم أو البريد..."
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg pr-9 pl-3 py-2 text-sm focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as UserRole | "all")}
              className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400 cursor-pointer bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            >
              <option value="all">كل الأدوار</option>
              {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                <option key={r} value={r}>{roleLabels[r]}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as UserStatus | "all")}
              className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400 cursor-pointer bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            >
              <option value="all">كل الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="suspended">موقوف</option>
            </select>
          </div>
          <button
            onClick={() => { setEditUser(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-brand-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-user-add-line"></i>
            إضافة مستخدم
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-3">المستخدم</th>
                <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-3">الدور</th>
                <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-3">الحالة</th>
                <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-3">الملفات</th>
                <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-3">تاريخ الانضمام</th>
                <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-3">آخر نشاط</th>
                <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-3">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, idx) => (
                <tr key={user.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${avatarColors[idx % avatarColors.length]}`}>
                        <span className="text-white text-xs font-bold">{user.initials}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{user.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{user.email}</p>
                        {user.phone && <p className="text-xs text-gray-400 dark:text-gray-500">{user.phone}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleColors[user.role]}`}>
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[user.status]}`}>
                      {statusLabels[user.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{user.assignedCount}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(user.joinedAt)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(user.lastActive)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {/* صلاحيات */}
                      <button
                        onClick={() => setPermissionsUser(user)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/30 text-brand-500 cursor-pointer"
                        title="إدارة الصلاحيات"
                      >
                        <i className="ri-shield-keyhole-line text-sm"></i>
                      </button>
                      {/* تعديل */}
                      <button
                        onClick={() => { setEditUser(user); setShowModal(true); }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-pointer"
                        title="تعديل"
                      >
                        <i className="ri-edit-line text-sm"></i>
                      </button>
                      {/* تفعيل/إيقاف */}
                      <button
                        onClick={() => toggleStatus(user.id, user.status)}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer ${
                          user.status === "active"
                            ? "hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400"
                            : "hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-500"
                        }`}
                        title={user.status === "active" ? "إيقاف" : "تفعيل"}
                      >
                        <i className={`text-sm ${user.status === "active" ? "ri-forbid-line" : "ri-check-line"}`}></i>
                      </button>
                      {/* حذف */}
                      <button
                        onClick={() => setConfirmDelete(user.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 cursor-pointer"
                        title="حذف"
                      >
                        <i className="ri-delete-bin-line text-sm"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="w-10 h-10 flex items-center justify-center mx-auto mb-2">
                      <i className="ri-user-search-line text-2xl text-gray-200 dark:text-gray-700"></i>
                    </div>
                    <p className="text-sm text-gray-400 dark:text-gray-500">لا توجد نتائج مطابقة</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <UserModal
          user={editUser}
          onClose={() => { setShowModal(false); setEditUser(null); }}
          onSave={handleSave}
        />
      )}

      {permissionsUser && (
        <UserPermissionsDrawer
          user={permissionsUser}
          onClose={() => setPermissionsUser(null)}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-delete-bin-line text-red-500 text-xl"></i>
            </div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 text-center mb-2">تأكيد الحذف</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-5">هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 bg-red-500 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-red-600 cursor-pointer whitespace-nowrap"
              >
                حذف
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer whitespace-nowrap"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
