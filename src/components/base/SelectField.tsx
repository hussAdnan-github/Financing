import { useState, useRef, useEffect } from "react";

interface SelectFieldProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  icon?: string;
  allowCustom?: boolean;
  searchable?: boolean;
  className?: string;
}

export default function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "اختر...",
  disabled = false,
  icon,
  allowCustom = false,
  searchable = true,
  className = "",
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [customInput, setCustomInput] = useState(false);
  const [customVal, setCustomVal] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase()) ||
    o.includes(search)
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Focus search on open
  useEffect(() => {
    if (open && searchable && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open, searchable]);

  if (disabled) {
    return (
      <div className={className}>
        {label && <label className="text-xs text-gray-500 font-medium block mb-1.5">{label}</label>}
        <div className="flex items-center gap-2">
          {icon && (
            <div className="w-4 h-4 flex items-center justify-center text-gray-400 flex-shrink-0">
              <i className={`${icon} text-sm`}></i>
            </div>
          )}
          <p className="text-sm font-medium text-gray-800">{value || <span className="text-gray-300">—</span>}</p>
        </div>
      </div>
    );
  }

  if (customInput) {
    return (
      <div className={className}>
        {label && <label className="text-xs text-gray-500 font-medium block mb-1.5">{label}</label>}
        <div className="flex gap-2">
          <input
            type="text"
            value={customVal}
            onChange={(e) => setCustomVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && customVal.trim()) {
                onChange(customVal.trim());
                setCustomInput(false);
                setCustomVal("");
              }
              if (e.key === "Escape") {
                setCustomInput(false);
                setCustomVal("");
              }
            }}
            placeholder="أدخل قيمة مخصصة..."
            className="flex-1 px-3 py-2 text-sm border border-brand-400 rounded-lg focus:outline-none bg-white"
            autoFocus
          />
          <button
            onClick={() => {
              if (customVal.trim()) { onChange(customVal.trim()); }
              setCustomInput(false);
              setCustomVal("");
            }}
            className="px-3 py-2 bg-brand-500 text-white text-xs rounded-lg cursor-pointer hover:bg-brand-600 whitespace-nowrap"
          >
            تأكيد
          </button>
          <button
            onClick={() => { setCustomInput(false); setCustomVal(""); }}
            className="px-3 py-2 border border-gray-200 text-gray-600 text-xs rounded-lg cursor-pointer hover:bg-gray-50 whitespace-nowrap"
          >
            إلغاء
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={ref}>
      {label && <label className="text-xs text-gray-500 font-medium block mb-1.5">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-2 px-3 py-2 border rounded-lg text-sm cursor-pointer transition-colors text-right ${
          open ? "border-brand-400 ring-1 ring-brand-200" : "border-gray-200 hover:border-gray-300"
        } bg-white`}
      >
        {icon && (
          <div className="w-4 h-4 flex items-center justify-center text-gray-400 flex-shrink-0">
            <i className={`${icon} text-sm`}></i>
          </div>
        )}
        <span className={`flex-1 text-right truncate ${value ? "text-gray-800" : "text-gray-400"}`}>
          {value || placeholder}
        </span>
        <div className="w-4 h-4 flex items-center justify-center text-gray-400 flex-shrink-0">
          <i className={open ? "ri-arrow-up-s-line text-sm" : "ri-arrow-down-s-line text-sm"}></i>
        </div>
      </button>

      {open && (
        <div className="absolute top-full mt-1 right-0 left-0 bg-white border border-gray-200 rounded-xl z-30 overflow-hidden">
          {/* Search */}
          {searchable && options.length > 4 && (
            <div className="px-3 py-2 border-b border-gray-100">
              <div className="relative">
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 flex items-center justify-center text-gray-400">
                  <i className="ri-search-line text-xs"></i>
                </div>
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="بحث..."
                  className="w-full pr-7 pl-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-brand-400"
                />
              </div>
            </div>
          )}

          {/* Options */}
          <div className="max-h-52 overflow-y-auto">
            {/* Clear option */}
            {value && (
              <button
                onClick={() => { onChange(""); setOpen(false); setSearch(""); }}
                className="w-full text-right px-3 py-2 text-xs text-gray-400 hover:bg-gray-50 cursor-pointer flex items-center gap-2 border-b border-gray-50"
              >
                <div className="w-3 h-3 flex items-center justify-center">
                  <i className="ri-close-line text-xs"></i>
                </div>
                مسح الاختيار
              </button>
            )}

            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-xs text-gray-400 text-center">لا توجد نتائج</p>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt}
                  onClick={() => { onChange(opt); setOpen(false); setSearch(""); }}
                  className={`w-full text-right px-3 py-2.5 text-sm cursor-pointer transition-colors flex items-center gap-2 ${
                    value === opt
                      ? "bg-brand-50 text-brand-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {value === opt && (
                    <div className="w-3 h-3 flex items-center justify-center flex-shrink-0">
                      <i className="ri-check-line text-xs text-brand-500"></i>
                    </div>
                  )}
                  <span className={value === opt ? "" : "mr-5"}>{opt}</span>
                </button>
              ))
            )}
          </div>

          {/* Custom input option */}
          {allowCustom && (
            <div className="border-t border-gray-100">
              <button
                onClick={() => { setOpen(false); setSearch(""); setCustomInput(true); }}
                className="w-full text-right px-3 py-2.5 text-xs text-brand-600 hover:bg-brand-50 cursor-pointer flex items-center gap-2"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-add-line text-sm"></i>
                </div>
                إدخال قيمة مخصصة
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
