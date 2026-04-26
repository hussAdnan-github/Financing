import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  defaultLandingFormFields,
  defaultLandingBranding,
  type LandingFormField,
  type LandingBranding,
  type LandingFieldType,
} from "@/mocks/landingData";
import LandingAnalyticsTab from "./LandingAnalyticsTab";

const STORAGE_KEY = "landingFormConfig";
const BRANDING_KEY = "landingBranding";

function loadFields(): LandingFormField[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as LandingFormField[];
  } catch { /* ignore */ }
  return defaultLandingFormFields.map((f) => ({ ...f }));
}

function loadBranding(): LandingBranding {
  try {
    const saved = localStorage.getItem(BRANDING_KEY);
    if (saved) return JSON.parse(saved) as LandingBranding;
  } catch { /* ignore */ }
  return { ...defaultLandingBranding };
}

type TabId = "branding" | "fields" | "analytics";

const FIELD_TYPE_OPTIONS: { value: LandingFieldType; label: string; icon: string; color: string }[] = [
  { value: "text", label: "نص قصير", icon: "ri-text", color: "bg-sky-50 text-sky-600" },
  { value: "textarea", label: "نص طويل", icon: "ri-align-left", color: "bg-indigo-50 text-indigo-600" },
  { value: "tel", label: "جوال", icon: "ri-phone-line", color: "bg-teal-50 text-teal-600" },
  { value: "email", label: "بريد إلكتروني", icon: "ri-mail-line", color: "bg-cyan-50 text-cyan-600" },
  { value: "number", label: "رقم", icon: "ri-hashtag", color: "bg-violet-50 text-violet-600" },
  { value: "date", label: "تاريخ", icon: "ri-calendar-line", color: "bg-pink-50 text-pink-600" },
  { value: "select", label: "قائمة منسدلة", icon: "ri-arrow-down-s-line", color: "bg-amber-50 text-amber-600" },
  { value: "radio", label: "اختيار واحد (Radio)", icon: "ri-radio-button-line", color: "bg-orange-50 text-orange-600" },
  { value: "checkbox", label: "موافقة (Checkbox)", icon: "ri-checkbox-line", color: "bg-emerald-50 text-emerald-600" },
  { value: "checkbox_group", label: "اختيار متعدد", icon: "ri-checkbox-multiple-line", color: "bg-lime-50 text-lime-600" },
  { value: "whatsapp", label: "واتساب", icon: "ri-whatsapp-line", color: "bg-green-50 text-green-600" },
  { value: "file", label: "رفع ملف", icon: "ri-upload-2-line", color: "bg-rose-50 text-rose-600" },
];

function getTypeInfo(type: LandingFieldType) {
  return FIELD_TYPE_OPTIONS.find((t) => t.value === type) ?? FIELD_TYPE_OPTIONS[0];
}

export default function LandingPageTab() {
  const [activeTab, setActiveTab] = useState<TabId>("fields");
  const [fields, setFields] = useState<LandingFormField[]>(loadFields);
  const [branding, setBranding] = useState<LandingBranding>(loadBranding);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingOption, setAddingOption] = useState<{ fieldId: string; value: string } | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showAddField, setShowAddField] = useState(false);
  const [newField, setNewField] = useState<Partial<LandingFormField>>({ type: "text", label: "", key: "", required: false, enabled: true });

  useEffect(() => { setHasChanges(false); }, []);

  const markChanged = () => { setHasChanges(true); setSaved(false); };

  // ── Fields handlers ──────────────────────────────────────────────────────
  const handleToggleField = (id: string) => { setFields((p) => p.map((f) => f.id === id ? { ...f, enabled: !f.enabled } : f)); markChanged(); };
  const handleToggleRequired = (id: string) => { setFields((p) => p.map((f) => f.id === id ? { ...f, required: !f.required } : f)); markChanged(); };
  const handleLabelChange = (id: string, label: string) => { setFields((p) => p.map((f) => f.id === id ? { ...f, label } : f)); markChanged(); };
  const handlePlaceholderChange = (id: string, placeholder: string) => { setFields((p) => p.map((f) => f.id === id ? { ...f, placeholder } : f)); markChanged(); };
  const handleHelpTextChange = (id: string, helpText: string) => { setFields((p) => p.map((f) => f.id === id ? { ...f, helpText } : f)); markChanged(); };
  const handleTypeChange = (id: string, type: LandingFieldType) => { setFields((p) => p.map((f) => f.id === id ? { ...f, type } : f)); markChanged(); };

  const handleMoveUp = (id: string) => {
    const idx = fields.findIndex((f) => f.id === id);
    if (idx <= 0) return;
    const nf = [...fields];
    [nf[idx - 1], nf[idx]] = [nf[idx], nf[idx - 1]];
    nf.forEach((f, i) => { f.order = i + 1; });
    setFields(nf); markChanged();
  };
  const handleMoveDown = (id: string) => {
    const idx = fields.findIndex((f) => f.id === id);
    if (idx >= fields.length - 1) return;
    const nf = [...fields];
    [nf[idx], nf[idx + 1]] = [nf[idx + 1], nf[idx]];
    nf.forEach((f, i) => { f.order = i + 1; });
    setFields(nf); markChanged();
  };

  const handleDeleteField = (id: string) => {
    setFields((p) => p.filter((f) => f.id !== id).map((f, i) => ({ ...f, order: i + 1 })));
    markChanged();
  };

  const handleAddOption = (fieldId: string) => {
    if (!addingOption || addingOption.fieldId !== fieldId || !addingOption.value.trim()) return;
    setFields((p) => p.map((f) => f.id === fieldId ? { ...f, options: [...(f.options || []), addingOption.value.trim()] } : f));
    setAddingOption(null); markChanged();
  };
  const handleRemoveOption = (fieldId: string, opt: string) => {
    setFields((p) => p.map((f) => f.id === fieldId ? { ...f, options: (f.options || []).filter((o) => o !== opt) } : f));
    markChanged();
  };

  const handleAddNewField = () => {
    if (!newField.label?.trim()) return;
    const key = newField.key?.trim() || `field_${Date.now()}`;
    const id = `custom_${Date.now()}`;
    const field: LandingFormField = {
      id,
      key,
      label: newField.label.trim(),
      type: newField.type as LandingFieldType || "text",
      required: newField.required || false,
      enabled: true,
      placeholder: newField.placeholder || "",
      helpText: newField.helpText || "",
      options: ["select", "radio", "checkbox_group"].includes(newField.type || "") ? [] : undefined,
      order: fields.length + 1,
    };
    setFields((p) => [...p, field]);
    setNewField({ type: "text", label: "", key: "", required: false, enabled: true });
    setShowAddField(false);
    setEditingId(id);
    markChanged();
  };

  // ── Branding handlers ────────────────────────────────────────────────────
  const handleBrandingChange = (key: keyof LandingBranding, value: string) => {
    setBranding((p) => ({ ...p, [key]: value }));
    markChanged();
  };

  // ── Save / Reset ─────────────────────────────────────────────────────────
  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
    localStorage.setItem(BRANDING_KEY, JSON.stringify(branding));
    setSaved(true); setHasChanges(false);
    setTimeout(() => setSaved(false), 3000);
  };
  const handleReset = () => {
    const df = defaultLandingFormFields.map((f) => ({ ...f }));
    const db = { ...defaultLandingBranding };
    setFields(df); setBranding(db);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(df));
    localStorage.setItem(BRANDING_KEY, JSON.stringify(db));
    markChanged();
  };

  return (
    <div className="space-y-5" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">إعدادات صفحة الهبوط</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">تحكم في الشعار والألوان وحقول النموذج — التغييرات تنعكس فوراً</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/landing-preview"
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer whitespace-nowrap font-medium transition-colors"
          >
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-layout-line text-sm"></i></div>
            معاينة الصفحة
          </Link>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border font-medium cursor-pointer whitespace-nowrap transition-colors ${previewMode ? "bg-brand-50 dark:bg-brand-900/20 border-brand-300 dark:border-brand-700 text-brand-600 dark:text-brand-400" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
          >
            <div className="w-4 h-4 flex items-center justify-center"><i className={previewMode ? "ri-eye-off-line text-sm" : "ri-eye-line text-sm"}></i></div>
            {previewMode ? "إخفاء المعاينة" : "معاينة"}
          </button>
          <button onClick={handleReset} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-refresh-line text-sm"></i></div>
            إعادة تعيين
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-semibold cursor-pointer whitespace-nowrap transition-colors ${hasChanges ? "bg-brand-500 text-white hover:bg-brand-600" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
            disabled={!hasChanges}
          >
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-save-line text-sm"></i></div>
            حفظ ونشر
          </button>
        </div>
      </div>

      {/* Alerts */}
      {saved && (
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3">
          <div className="w-5 h-5 flex items-center justify-center"><i className="ri-checkbox-circle-line text-emerald-500 text-base"></i></div>
          <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">تم حفظ الإعدادات ونشرها بنجاح</span>
        </div>
      )}
      {hasChanges && !saved && (
        <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center"><i className="ri-information-line text-amber-500 text-base"></i></div>
            <span className="text-sm text-amber-700 dark:text-amber-400 font-medium">لديك تغييرات غير محفوظة</span>
          </div>
          <button onClick={handleSave} className="text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap hover:bg-amber-600">حفظ الآن</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
        {([
          { id: "fields" as TabId, label: "الأسئلة والحقول", icon: "ri-list-settings-line" },
          { id: "branding" as TabId, label: "الألوان والشعار", icon: "ri-palette-line" },
          { id: "analytics" as TabId, label: "الإحصائيات", icon: "ri-bar-chart-2-line" },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-medium cursor-pointer whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
          >
            <div className="w-4 h-4 flex items-center justify-center"><i className={`${tab.icon} text-sm`}></i></div>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={`grid gap-5 ${previewMode && activeTab !== "analytics" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
        <div>
          {activeTab === "fields" && (
            <FieldsPanel
              fields={fields}
              editingId={editingId}
              addingOption={addingOption}
              showAddField={showAddField}
              newField={newField}
              onToggle={handleToggleField}
              onToggleRequired={handleToggleRequired}
              onEdit={(id) => setEditingId(editingId === id ? null : id)}
              onLabelChange={handleLabelChange}
              onPlaceholderChange={handlePlaceholderChange}
              onHelpTextChange={handleHelpTextChange}
              onTypeChange={handleTypeChange}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onDelete={handleDeleteField}
              onAddOptionChange={(v) => setAddingOption(v ? { fieldId: v.fieldId, value: v.value } : null)}
              onAddOptionConfirm={handleAddOption}
              onRemoveOption={handleRemoveOption}
              onShowAddField={() => setShowAddField(true)}
              onHideAddField={() => setShowAddField(false)}
              onNewFieldChange={(k, v) => setNewField((p) => ({ ...p, [k]: v }))}
              onAddNewField={handleAddNewField}
            />
          )}
          {activeTab === "branding" && (
            <BrandingPanel branding={branding} onChange={handleBrandingChange} />
          )}
          {activeTab === "analytics" && (
            <LandingAnalyticsTab />
          )}
        </div>

        {previewMode && activeTab !== "analytics" && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden sticky top-4">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60">
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-eye-line text-brand-500 text-sm"></i></div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">معاينة النموذج</h4>
              <span className="text-xs text-gray-400 dark:text-gray-500 mr-auto">كما يظهر للزوار</span>
            </div>
            <div className="p-5 max-h-[600px] overflow-y-auto" style={{ backgroundColor: branding.bgColor }}>
              <FormPreview
                fields={fields.filter((f) => f.enabled).sort((a, b) => a.order - b.order)}
                branding={branding}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Fields Panel ─────────────────────────────────────────────────────────────
interface FieldsPanelProps {
  fields: LandingFormField[];
  editingId: string | null;
  addingOption: { fieldId: string; value: string } | null;
  showAddField: boolean;
  newField: Partial<LandingFormField>;
  onToggle: (id: string) => void;
  onToggleRequired: (id: string) => void;
  onEdit: (id: string) => void;
  onLabelChange: (id: string, v: string) => void;
  onPlaceholderChange: (id: string, v: string) => void;
  onHelpTextChange: (id: string, v: string) => void;
  onTypeChange: (id: string, t: LandingFieldType) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onDelete: (id: string) => void;
  onAddOptionChange: (v: { fieldId: string; value: string } | null) => void;
  onAddOptionConfirm: (fieldId: string) => void;
  onRemoveOption: (fieldId: string, opt: string) => void;
  onShowAddField: () => void;
  onHideAddField: () => void;
  onNewFieldChange: (key: string, value: string | boolean) => void;
  onAddNewField: () => void;
}

function FieldsPanel({
  fields, editingId, addingOption, showAddField, newField,
  onToggle, onToggleRequired, onEdit, onLabelChange, onPlaceholderChange,
  onHelpTextChange, onTypeChange, onMoveUp, onMoveDown, onDelete,
  onAddOptionChange, onAddOptionConfirm, onRemoveOption,
  onShowAddField, onHideAddField, onNewFieldChange, onAddNewField,
}: FieldsPanelProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center"><i className="ri-list-settings-line text-brand-500 text-sm"></i></div>
          <h4 className="text-sm font-semibold text-gray-700">حقول النموذج</h4>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {fields.filter((f) => f.enabled).length} / {fields.length} مفعّل
          </span>
        </div>
        <button
          onClick={onShowAddField}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-brand-500 text-white rounded-lg cursor-pointer whitespace-nowrap hover:bg-brand-600 font-medium"
        >
          <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line text-sm"></i></div>
          إضافة سؤال
        </button>
      </div>

      {/* Add new field form */}
      {showAddField && (
        <AddFieldForm
          newField={newField}
          onChange={onNewFieldChange}
          onConfirm={onAddNewField}
          onCancel={onHideAddField}
        />
      )}

      {fields.map((field, idx) => (
        <FieldCard
          key={field.id}
          field={field}
          idx={idx}
          total={fields.length}
          isEditing={editingId === field.id}
          addingOption={addingOption}
          onToggle={() => onToggle(field.id)}
          onToggleRequired={() => onToggleRequired(field.id)}
          onEdit={() => onEdit(field.id)}
          onLabelChange={(v) => onLabelChange(field.id, v)}
          onPlaceholderChange={(v) => onPlaceholderChange(field.id, v)}
          onHelpTextChange={(v) => onHelpTextChange(field.id, v)}
          onTypeChange={(t) => onTypeChange(field.id, t)}
          onMoveUp={() => onMoveUp(field.id)}
          onMoveDown={() => onMoveDown(field.id)}
          onDelete={() => onDelete(field.id)}
          onAddOptionChange={(v) => onAddOptionChange(v ? { fieldId: field.id, value: v } : null)}
          onAddOptionConfirm={() => onAddOptionConfirm(field.id)}
          onRemoveOption={(opt) => onRemoveOption(field.id, opt)}
        />
      ))}
    </div>
  );
}

// ─── Add Field Form ───────────────────────────────────────────────────────────
function AddFieldForm({
  newField, onChange, onConfirm, onCancel,
}: {
  newField: Partial<LandingFormField>;
  onChange: (key: string, value: string | boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="rounded-xl border-2 border-brand-200 bg-brand-50/30 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-bold text-brand-700 flex items-center gap-1.5">
          <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-circle-line text-sm"></i></div>
          إضافة سؤال جديد
        </h5>
        <button onClick={onCancel} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer">
          <i className="ri-close-line text-sm"></i>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">نوع السؤال</label>
          <select
            value={newField.type || "text"}
            onChange={(e) => onChange("type", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400 bg-white cursor-pointer"
          >
            {FIELD_TYPE_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">تسمية السؤال <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={newField.label || ""}
            onChange={(e) => onChange("label", e.target.value)}
            placeholder="مثال: الراتب الشهري"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">المفتاح (key)</label>
          <input
            type="text"
            value={newField.key || ""}
            onChange={(e) => onChange("key", e.target.value)}
            placeholder="مثال: monthly_salary"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400 font-mono"
            dir="ltr"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">نص التلميح</label>
          <input
            type="text"
            value={newField.placeholder || ""}
            onChange={(e) => onChange("placeholder", e.target.value)}
            placeholder="نص يظهر داخل الحقل..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={newField.required || false}
            onChange={(e) => onChange("required", e.target.checked)}
            className="w-4 h-4 cursor-pointer"
            style={{ accentColor: "#FF6039" }}
          />
          <span className="text-sm text-gray-600">إلزامي</span>
        </label>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onConfirm}
          disabled={!newField.label?.trim()}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-500 text-white text-xs font-semibold rounded-lg cursor-pointer whitespace-nowrap hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line text-sm"></i></div>
          إضافة السؤال
        </button>
        <button onClick={onCancel} className="px-4 py-2 border border-gray-200 text-gray-600 text-xs rounded-lg cursor-pointer whitespace-nowrap hover:bg-gray-50">
          إلغاء
        </button>
      </div>
    </div>
  );
}

// ─── Field Card ───────────────────────────────────────────────────────────────
interface FieldCardProps {
  field: LandingFormField;
  idx: number;
  total: number;
  isEditing: boolean;
  addingOption: { fieldId: string; value: string } | null;
  onToggle: () => void;
  onToggleRequired: () => void;
  onEdit: () => void;
  onLabelChange: (v: string) => void;
  onPlaceholderChange: (v: string) => void;
  onHelpTextChange: (v: string) => void;
  onTypeChange: (t: LandingFieldType) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onAddOptionChange: (v: string | null) => void;
  onAddOptionConfirm: () => void;
  onRemoveOption: (opt: string) => void;
}

function FieldCard({
  field, idx, total, isEditing, addingOption,
  onToggle, onToggleRequired, onEdit, onLabelChange, onPlaceholderChange,
  onHelpTextChange, onTypeChange, onMoveUp, onMoveDown, onDelete,
  onAddOptionChange, onAddOptionConfirm, onRemoveOption,
}: FieldCardProps) {
  const typeInfo = getTypeInfo(field.type);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const hasOptions = ["select", "radio", "checkbox_group"].includes(field.type);
  const hasPlaceholder = ["text", "tel", "email", "number", "textarea", "whatsapp"].includes(field.type);

  return (
    <div className={`rounded-xl border transition-all ${field.enabled ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50/50 opacity-60"}`}>
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex flex-col gap-0.5 flex-shrink-0">
          <button onClick={onMoveUp} disabled={idx === 0} className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 disabled:opacity-30 cursor-pointer">
            <i className="ri-arrow-up-s-line text-gray-500 text-xs"></i>
          </button>
          <button onClick={onMoveDown} disabled={idx === total - 1} className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 disabled:opacity-30 cursor-pointer">
            <i className="ri-arrow-down-s-line text-gray-500 text-xs"></i>
          </button>
        </div>

        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500 flex-shrink-0">{idx + 1}</span>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{field.label}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1 ${typeInfo.color}`}>
              <i className={`${typeInfo.icon} text-[10px]`}></i>
              {typeInfo.label}
            </span>
            {field.required && <span className="text-[10px] text-red-500 font-medium">إلزامي</span>}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onToggleRequired}
            className={`text-[10px] px-2 py-1 rounded-lg border cursor-pointer whitespace-nowrap transition-colors ${field.required ? "border-red-200 bg-red-50 text-red-600" : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
          >
            {field.required ? "إلزامي" : "اختياري"}
          </button>
          <button
            onClick={onEdit}
            className={`w-7 h-7 flex items-center justify-center rounded-lg border cursor-pointer transition-colors ${isEditing ? "border-brand-300 bg-brand-50 text-brand-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
          >
            <i className={`${isEditing ? "ri-close-line" : "ri-edit-line"} text-sm`}></i>
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button onClick={onDelete} className="text-[10px] px-2 py-1 bg-red-500 text-white rounded-lg cursor-pointer whitespace-nowrap hover:bg-red-600">حذف</button>
              <button onClick={() => setConfirmDelete(false)} className="text-[10px] px-2 py-1 border border-gray-200 text-gray-500 rounded-lg cursor-pointer whitespace-nowrap">إلغاء</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 cursor-pointer transition-colors">
              <i className="ri-delete-bin-line text-sm"></i>
            </button>
          )}
          <button
            onClick={onToggle}
            className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0 ${field.enabled ? "bg-brand-500" : "bg-gray-200"}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${field.enabled ? "right-0.5" : "left-0.5"}`}></span>
          </button>
        </div>
      </div>

      {/* Edit panel */}
      {isEditing && (
        <div className="border-t border-gray-100 px-4 py-4 space-y-3 bg-gray-50/40">
          {/* Type change */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">نوع السؤال</label>
            <select
              value={field.type}
              onChange={(e) => onTypeChange(e.target.value as LandingFieldType)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400 bg-white cursor-pointer"
            >
              {FIELD_TYPE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Label */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">تسمية الحقل</label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => onLabelChange(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
            />
          </div>

          {/* Placeholder */}
          {hasPlaceholder && (
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">نص التلميح (placeholder)</label>
              <input
                type="text"
                value={field.placeholder || ""}
                onChange={(e) => onPlaceholderChange(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
              />
            </div>
          )}

          {/* Help text */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">نص المساعدة (اختياري)</label>
            <input
              type="text"
              value={field.helpText || ""}
              onChange={(e) => onHelpTextChange(e.target.value)}
              placeholder="نص توضيحي يظهر أسفل الحقل..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
            />
          </div>

          {/* Options (select / radio / checkbox_group) */}
          {hasOptions && (
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-2">الخيارات</label>
              <div className="space-y-1.5 mb-2">
                {(field.options || []).map((opt) => (
                  <div key={opt} className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-3 py-1.5">
                    <span className="flex-1 text-sm text-gray-700">{opt}</span>
                    <button onClick={() => onRemoveOption(opt)} className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 cursor-pointer">
                      <i className="ri-close-line text-xs"></i>
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="أضف خياراً جديداً..."
                  value={addingOption?.fieldId === field.id ? addingOption.value : ""}
                  onChange={(e) => onAddOptionChange(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAddOptionConfirm(); } }}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
                />
                <button
                  onClick={onAddOptionConfirm}
                  className="flex items-center gap-1 px-3 py-2 bg-brand-500 text-white text-xs font-medium rounded-lg cursor-pointer whitespace-nowrap hover:bg-brand-600"
                >
                  <i className="ri-add-line text-sm"></i>
                  إضافة
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Branding Panel ───────────────────────────────────────────────────────────
function BrandingPanel({ branding, onChange }: { branding: LandingBranding; onChange: (k: keyof LandingBranding, v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) onChange("logoUrl", ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const colorFields: { key: keyof LandingBranding; label: string; desc: string }[] = [
    { key: "primaryColor", label: "اللون الرئيسي", desc: "لون الأزرار والعناصر البارزة" },
    { key: "secondaryColor", label: "اللون الثانوي", desc: "للتدرجات والتأثيرات" },
    { key: "bgColor", label: "لون الخلفية", desc: "خلفية قسم النموذج" },
    { key: "textColor", label: "لون النص", desc: "لون النصوص الرئيسية" },
  ];

  const textFields: { key: keyof LandingBranding; label: string; placeholder: string }[] = [
    { key: "formTitle", label: "عنوان النموذج", placeholder: "نموذج التسجيل" },
    { key: "formSubtitle", label: "وصف النموذج", placeholder: "أرسل بياناتك وسيتواصل معك أحد مستشارينا..." },
    { key: "buttonText", label: "نص زر الإرسال", placeholder: "أرسل طلبك الآن" },
  ];

  return (
    <div className="space-y-5">
      {/* Logo */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center"><i className="ri-image-line text-brand-500 text-sm"></i></div>
          الشعار (Logo)
        </h4>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex-shrink-0 overflow-hidden">
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt="logo" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center">
                <div className="w-8 h-8 flex items-center justify-center mx-auto mb-1">
                  <i className="ri-image-add-line text-gray-300 text-2xl"></i>
                </div>
                <p className="text-[10px] text-gray-400">لا يوجد شعار</p>
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-3">ارفع شعار شركتك ليظهر في صفحة الهبوط</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1.5 text-xs px-3 py-2 bg-brand-500 text-white rounded-lg cursor-pointer whitespace-nowrap hover:bg-brand-600 font-medium"
              >
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-upload-2-line text-sm"></i></div>
                رفع شعار
              </button>
              {branding.logoUrl && (
                <button
                  onClick={() => onChange("logoUrl", "")}
                  className="flex items-center gap-1.5 text-xs px-3 py-2 border border-gray-200 text-gray-600 rounded-lg cursor-pointer whitespace-nowrap hover:bg-gray-50"
                >
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-delete-bin-line text-sm"></i></div>
                  حذف
                </button>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mt-2">PNG, JPG, SVG — الحد الأقصى 2MB</p>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
      </div>

      {/* Colors */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center"><i className="ri-palette-line text-brand-500 text-sm"></i></div>
          الألوان
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {colorFields.map(({ key, label, desc }) => (
            <div key={key} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
              <div className="relative flex-shrink-0">
                <div
                  className="w-10 h-10 rounded-lg border-2 border-white shadow-sm cursor-pointer"
                  style={{ backgroundColor: branding[key] as string }}
                  onClick={() => document.getElementById(`color-${key}`)?.click()}
                ></div>
                <input
                  id={`color-${key}`}
                  type="color"
                  value={branding[key] as string}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-700">{label}</p>
                <p className="text-[10px] text-gray-400">{desc}</p>
                <input
                  type="text"
                  value={branding[key] as string}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="mt-1 w-full border border-gray-200 rounded-md px-2 py-1 text-xs font-mono focus:outline-none focus:border-brand-400"
                  dir="ltr"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Color preview */}
        <div className="mt-4 rounded-xl overflow-hidden border border-gray-100">
          <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: branding.bgColor }}>
            <span className="text-sm font-bold" style={{ color: branding.textColor }}>معاينة الألوان</span>
            <button
              className="text-xs px-4 py-2 rounded-lg font-semibold text-white whitespace-nowrap"
              style={{ backgroundColor: branding.primaryColor }}
            >
              {branding.buttonText || "أرسل طلبك الآن"}
            </button>
          </div>
        </div>
      </div>

      {/* Text settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center"><i className="ri-text-wrap text-brand-500 text-sm"></i></div>
          النصوص
        </h4>
        <div className="space-y-3">
          {textFields.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-medium text-gray-600 block mb-1">{label}</label>
              <input
                type="text"
                value={branding[key] as string}
                onChange={(e) => onChange(key, e.target.value)}
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// ─── Form Preview ─────────────────────────────────────────────────────────────
function FormPreview({ fields, branding }: { fields: LandingFormField[]; branding: LandingBranding }) {
  if (fields.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <div className="w-10 h-10 flex items-center justify-center mx-auto mb-2"><i className="ri-file-list-3-line text-3xl"></i></div>
        <p className="text-sm">لا توجد حقول مفعّلة</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {branding.logoUrl && (
        <div className="flex justify-center mb-2">
          <img src={branding.logoUrl} alt="logo" className="h-12 object-contain" />
        </div>
      )}
      <h4 className="text-base font-bold mb-1" style={{ color: branding.textColor }}>{branding.formTitle}</h4>
      {branding.formSubtitle && <p className="text-xs text-gray-500 mb-3">{branding.formSubtitle}</p>}

      {fields.map((f) => (
        <div key={f.id}>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: branding.textColor }}>
            {f.label}
            {f.required && <span className="text-red-500 mr-1">*</span>}
          </label>

          {f.type === "select" && (
            <select disabled className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm bg-white text-gray-400 cursor-not-allowed">
              <option>اختر...</option>
              {(f.options || []).map((o) => <option key={o}>{o}</option>)}
            </select>
          )}
          {f.type === "radio" && (
            <div className="space-y-2">
              {(f.options || []).map((o) => (
                <label key={o} className="flex items-center gap-2 cursor-not-allowed">
                  <input type="radio" disabled className="w-4 h-4" />
                  <span className="text-sm text-gray-600">{o}</span>
                </label>
              ))}
            </div>
          )}
          {f.type === "checkbox_group" && (
            <div className="space-y-2">
              {(f.options || []).map((o) => (
                <label key={o} className="flex items-center gap-2 cursor-not-allowed">
                  <input type="checkbox" disabled className="w-4 h-4" />
                  <span className="text-sm text-gray-600">{o}</span>
                </label>
              ))}
            </div>
          )}
          {f.type === "checkbox" && (
            <div className="flex items-center gap-2">
              <input type="checkbox" disabled className="w-4 h-4" />
              <span className="text-sm text-gray-500">{f.label}</span>
            </div>
          )}
          {f.type === "textarea" && (
            <textarea disabled placeholder={f.placeholder} rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white text-gray-400 cursor-not-allowed resize-none" />
          )}
          {f.type === "whatsapp" && (
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                  <i className="ri-whatsapp-line text-green-400 text-sm"></i>
                </div>
                <input type="tel" disabled placeholder={f.placeholder || "05xxxxxxxx"} className="w-full h-10 border border-gray-200 rounded-xl pr-8 pl-3 text-sm bg-white text-gray-400 cursor-not-allowed" />
              </div>
              <div className="h-10 px-3 bg-green-100 text-green-600 text-xs font-medium rounded-xl flex items-center gap-1 whitespace-nowrap">
                <i className="ri-whatsapp-line"></i> تواصل
              </div>
            </div>
          )}
          {f.type === "file" && (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center bg-white cursor-not-allowed">
              <div className="w-8 h-8 flex items-center justify-center mx-auto mb-1">
                <i className="ri-upload-2-line text-gray-300 text-xl"></i>
              </div>
              <p className="text-xs text-gray-400">اضغط لرفع ملف</p>
            </div>
          )}
          {!["select","radio","checkbox_group","checkbox","textarea","whatsapp","file"].includes(f.type) && (
            <input type={f.type} disabled placeholder={f.placeholder} className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm bg-white text-gray-400 cursor-not-allowed" />
          )}

          {f.helpText && <p className="text-[10px] text-gray-400 mt-1">{f.helpText}</p>}
        </div>
      ))}

      <button
        disabled
        className="w-full h-11 rounded-xl text-sm font-bold text-white mt-2 cursor-not-allowed"
        style={{ backgroundColor: branding.primaryColor }}
      >
        {branding.buttonText || "أرسل طلبك الآن"}
      </button>
    </div>
  );
}
