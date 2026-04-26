import { useState, useRef, useEffect } from "react";
import { useStaticData } from "@/hooks/useStaticData";
import type { StaticCategory, StaticItem } from "@/mocks/staticData";

// ─── Inline Edit Input ────────────────────────────────────────────────────────
function InlineEdit({
  value,
  onSave,
  onCancel,
}: {
  value: string;
  onSave: (v: string) => void;
  onCancel: () => void;
}) {
  const [val, setVal] = useState(value);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  return (
    <input
      ref={ref}
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && val.trim()) onSave(val.trim());
        if (e.key === "Escape") onCancel();
      }}
      onBlur={() => { if (val.trim() && val.trim() !== value) onSave(val.trim()); else onCancel(); }}
      className="flex-1 px-2 py-0.5 text-sm border border-brand-400 rounded-md focus:outline-none bg-white dark:bg-gray-800 dark:text-gray-100 min-w-0"
    />
  );
}

// ─── Category Panel ───────────────────────────────────────────────────────────
function CategoryPanel({
  category,
  onAdd,
  onToggle,
  onEdit,
  onDelete,
  onReset,
}: {
  category: StaticCategory;
  onAdd: (label: string) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string, label: string) => void;
  onDelete: (id: string) => void;
  onReset: () => void;
}) {
  const [newLabel, setNewLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);

  const activeItems = category.items.filter((i) => i.active).sort((a, b) => a.order - b.order);
  const inactiveItems = category.items.filter((i) => !i.active).sort((a, b) => a.order - b.order);

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    onAdd(newLabel.trim());
    setNewLabel("");
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center ${category.color}`}>
            <i className={`${category.icon} text-lg`}></i>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">{category.title}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{category.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full font-medium">
            {activeItems.length} نشط
          </span>
          {inactiveItems.length > 0 && (
            <span className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 px-2 py-0.5 rounded-full">
              {inactiveItems.length} معطّل
            </span>
          )}
          <button
            onClick={onReset}
            title="إعادة تعيين للافتراضي"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-pointer transition-colors"
          >
            <i className="ri-refresh-line text-sm"></i>
          </button>
        </div>
      </div>

      {/* Add new item */}
      <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder={`إضافة ${category.title.slice(0, -1) || "عنصر"} جديد...`}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          />
          <button
            onClick={handleAdd}
            disabled={!newLabel.trim()}
            className="px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 disabled:opacity-40 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-add-line text-sm"></i>
            </div>
            إضافة
          </button>
        </div>
      </div>

      {/* Active items */}
      <div className="divide-y divide-gray-50 dark:divide-gray-800">
        {activeItems.length === 0 && (
          <div className="px-5 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
            لا توجد عناصر نشطة — أضف عنصراً جديداً
          </div>
        )}
        {activeItems.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            isEditing={editingId === item.id}
            isDeleteConfirm={deleteConfirmId === item.id}
            onEdit={() => setEditingId(item.id)}
            onEditSave={(label) => { onEdit(item.id, label); setEditingId(null); }}
            onEditCancel={() => setEditingId(null)}
            onToggle={() => onToggle(item.id)}
            onDeleteRequest={() => setDeleteConfirmId(item.id)}
            onDeleteConfirm={() => { onDelete(item.id); setDeleteConfirmId(null); }}
            onDeleteCancel={() => setDeleteConfirmId(null)}
          />
        ))}
      </div>

      {/* Inactive items toggle */}
      {inactiveItems.length > 0 && (
        <div className="border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setShowInactive((v) => !v)}
            className="w-full px-5 py-2.5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className={showInactive ? "ri-eye-off-line" : "ri-eye-line"}></i>
            </div>
            {showInactive ? "إخفاء" : "عرض"} العناصر المعطّلة ({inactiveItems.length})
          </button>
          {showInactive && (
            <div className="divide-y divide-gray-50 dark:divide-gray-800 bg-gray-50/30 dark:bg-gray-800/20">
              {inactiveItems.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  isEditing={editingId === item.id}
                  isDeleteConfirm={deleteConfirmId === item.id}
                  onEdit={() => setEditingId(item.id)}
                  onEditSave={(label) => { onEdit(item.id, label); setEditingId(null); }}
                  onEditCancel={() => setEditingId(null)}
                  onToggle={() => onToggle(item.id)}
                  onDeleteRequest={() => setDeleteConfirmId(item.id)}
                  onDeleteConfirm={() => { onDelete(item.id); setDeleteConfirmId(null); }}
                  onDeleteCancel={() => setDeleteConfirmId(null)}
                  dimmed
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Item Row ─────────────────────────────────────────────────────────────────
function ItemRow({
  item,
  isEditing,
  isDeleteConfirm,
  onEdit,
  onEditSave,
  onEditCancel,
  onToggle,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
  dimmed = false,
}: {
  item: StaticItem;
  isEditing: boolean;
  isDeleteConfirm: boolean;
  onEdit: () => void;
  onEditSave: (label: string) => void;
  onEditCancel: () => void;
  onToggle: () => void;
  onDeleteRequest: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  dimmed?: boolean;
}) {
  if (isDeleteConfirm) {
    return (
      <div className="px-5 py-3 bg-red-50 dark:bg-red-900/20 flex items-center justify-between gap-3">
        <p className="text-sm text-red-700 dark:text-red-400">
          حذف <span className="font-semibold">{item.label}</span> نهائياً؟
        </p>
        <div className="flex gap-2">
          <button
            onClick={onDeleteCancel}
            className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
          >
            إلغاء
          </button>
          <button
            onClick={onDeleteConfirm}
            className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
          >
            حذف
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`px-5 py-3 flex items-center gap-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group ${dimmed ? "opacity-60" : ""}`}>
      {/* Status dot */}
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.active ? "bg-emerald-400" : "bg-gray-300 dark:bg-gray-600"}`}></div>

      {/* Label */}
      {isEditing ? (
        <InlineEdit value={item.label} onSave={onEditSave} onCancel={onEditCancel} />
      ) : (
        <span className={`flex-1 text-sm ${item.active ? "text-gray-800 dark:text-gray-200" : "text-gray-400 dark:text-gray-500 line-through"}`}>
          {item.label}
        </span>
      )}

      {/* Actions */}
      {!isEditing && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 cursor-pointer transition-colors"
            title="تعديل"
          >
            <i className="ri-pencil-line text-sm"></i>
          </button>
          <button
            onClick={onToggle}
            className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-colors ${
              item.active
                ? "text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            }`}
            title={item.active ? "تعطيل" : "تفعيل"}
          >
            <i className={item.active ? "ri-eye-off-line text-sm" : "ri-eye-line text-sm"}></i>
          </button>
          <button
            onClick={onDeleteRequest}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors"
            title="حذف"
          >
            <i className="ri-delete-bin-line text-sm"></i>
          </button>
        </div>
      )}

      {/* Active badge */}
      {!isEditing && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${
          item.active ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
        }`}>
          {item.active ? "نشط" : "معطّل"}
        </span>
      )}
    </div>
  );
}

// ─── Preview Dropdown ─────────────────────────────────────────────────────────
function PreviewDropdown({ categoryKey, label, getActiveItems }: {
  categoryKey: string;
  label: string;
  getActiveItems: (key: string) => string[];
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const items = getActiveItems(categoryKey);
  const filtered = items.filter((i) => i.includes(search));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm cursor-pointer hover:border-brand-400 transition-colors"
      >
        <span className={selected ? "text-gray-800 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"}>{selected || `اختر ${label}...`}</span>
        <div className="w-4 h-4 flex items-center justify-center text-gray-400">
          <i className={open ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}></i>
        </div>
      </button>
      {open && (
        <div className="absolute top-full mt-1 right-0 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl z-20 overflow-hidden">
          {items.length > 5 && (
            <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث..."
                className="w-full px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                autoFocus
              />
            </div>
          )}
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-xs text-gray-400 dark:text-gray-500 text-center">لا توجد نتائج</p>
            ) : (
              filtered.map((item) => (
                <button
                  key={item}
                  onClick={() => { setSelected(item); setOpen(false); setSearch(""); }}
                  className={`w-full text-right px-3 py-2.5 text-sm hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-700 dark:hover:text-brand-400 cursor-pointer transition-colors ${
                    selected === item ? "bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 font-medium" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {selected === item && (
                    <i className="ri-check-line text-xs ml-1 text-brand-500"></i>
                  )}
                  {item}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Tab ─────────────────────────────────────────────────────────────────
export default function StaticDataTab() {
  const { categories, addItem, toggleItem, editItem, deleteItem, resetCategory, getActiveItems } = useStaticData();
  const [activeCategory, setActiveCategory] = useState(categories[0]?.key ?? "banks");
  const [showPreview, setShowPreview] = useState(false);
  const [resetConfirmKey, setResetConfirmKey] = useState<string | null>(null);

  const currentCat = categories.find((c) => c.key === activeCategory);

  const handleReset = (key: string) => {
    if (resetConfirmKey === key) {
      resetCategory(key);
      setResetConfirmKey(null);
    } else {
      setResetConfirmKey(key);
      setTimeout(() => setResetConfirmKey(null), 3000);
    }
  };

  return (
    <div className="space-y-5" dir="rtl">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <div className="w-5 h-5 flex items-center justify-center text-brand-500">
                <i className="ri-database-2-line text-base"></i>
              </div>
              إدارة البيانات الثابتة
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              هذه القوائم تظهر في حقول الاختيار عند تعبئة ملفات العملاء. يمكنك إضافة وتعديل وتعطيل أي عنصر.
            </p>
          </div>
          <button
            onClick={() => setShowPreview((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap border ${
              showPreview
                ? "bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 border-brand-200 dark:border-brand-800"
                : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-eye-line text-sm"></i>
            </div>
            معاينة القوائم
          </button>
        </div>

        {/* Preview dropdowns */}
        {showPreview && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">معاينة — كيف تظهر القوائم عند التعبئة:</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <div key={cat.key}>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">{cat.title}</label>
                  <PreviewDropdown
                    categoryKey={cat.key}
                    label={cat.title}
                    getActiveItems={getActiveItems}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Tabs + Content */}
      <div className="flex gap-4">
        {/* Sidebar tabs */}
        <div className="w-52 flex-shrink-0 space-y-1">
          {categories.map((cat) => {
            const activeCount = cat.items.filter((i) => i.active).length;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`w-full text-right flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                  activeCategory === cat.key
                    ? "bg-brand-500 text-white"
                    : "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  activeCategory === cat.key ? "bg-white/20" : "bg-gray-100 dark:bg-gray-800"
                }`}>
                  <i className={`${cat.icon} text-sm ${activeCategory === cat.key ? "text-white" : cat.color}`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{cat.title}</p>
                  <p className={`text-[10px] ${activeCategory === cat.key ? "text-white/70" : "text-gray-400 dark:text-gray-500"}`}>
                    {activeCount} عنصر نشط
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {currentCat && (
            <CategoryPanel
              category={currentCat}
              onAdd={(label) => addItem(currentCat.key, label)}
              onToggle={(id) => toggleItem(currentCat.key, id)}
              onEdit={(id, label) => editItem(currentCat.key, id, label)}
              onDelete={(id) => deleteItem(currentCat.key, id)}
              onReset={() => handleReset(currentCat.key)}
            />
          )}

          {/* Reset confirm toast */}
          {resetConfirmKey === activeCategory && (
            <div className="mt-3 flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <div className="w-5 h-5 flex items-center justify-center text-amber-600">
                <i className="ri-alert-line text-sm"></i>
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-400 flex-1">
                اضغط مرة أخرى على زر الإعادة لتأكيد إعادة تعيين القائمة للقيم الافتراضية
              </p>
              <button
                onClick={() => setResetConfirmKey(null)}
                className="w-5 h-5 flex items-center justify-center text-amber-500 cursor-pointer"
              >
                <i className="ri-close-line text-sm"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
