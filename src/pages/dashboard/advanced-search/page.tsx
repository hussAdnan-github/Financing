import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/pages/dashboard/components/DashboardLayout";
import {
  mockClients,
  stageLabels,
  stageColors,
  specialStatusLabels,
  specialStatusColors,
  roleLabels,
  employees,
  type ClientStage,
  type ClientSpecialStatus,
  type UserRole,
  type Client,
} from "@/mocks/dashboardData";

// ─── Filter State ────────────────────────────────────────────────────────────
interface FilterState {
  keyword: string;
  stages: ClientStage[];
  specialStatuses: ClientSpecialStatus[];
  serviceTypes: string[];
  cities: string[];
  employerTypes: string[];
  assignedTo: string[];
  salaryMin: string;
  salaryMax: string;
  financingMin: string;
  financingMax: string;
  salaryTransfer: "all" | "yes" | "no";
  hasGuarantor: "all" | "yes" | "no";
  reviewStatuses: string[];
  submittedFrom: string;
  submittedTo: string;
  creditScoreMin: string;
  creditScoreMax: string;
  sources: string[];
}

const defaultFilters: FilterState = {
  keyword: "",
  stages: [],
  specialStatuses: [],
  serviceTypes: [],
  cities: [],
  employerTypes: [],
  assignedTo: [],
  salaryMin: "",
  salaryMax: "",
  financingMin: "",
  financingMax: "",
  salaryTransfer: "all",
  hasGuarantor: "all",
  reviewStatuses: [],
  submittedFrom: "",
  submittedTo: "",
  creditScoreMin: "",
  creditScoreMax: "",
  sources: [],
};

// ─── Derived options from data ───────────────────────────────────────────────
const ALL_CITIES = [...new Set(mockClients.map((c) => c.city))].sort();
const ALL_SERVICES = [...new Set(mockClients.map((c) => c.serviceType))].sort();
const ALL_EMPLOYER_TYPES = [...new Set(mockClients.map((c) => c.employerType))].sort();
const ALL_SOURCES = [...new Set(mockClients.map((c) => c.source))].sort();
const ALL_STAGES = Object.keys(stageLabels) as ClientStage[];
const ALL_SPECIAL = Object.keys(specialStatusLabels) as ClientSpecialStatus[];
const ALL_EMPLOYEES = employees.filter((e) => e.role === "employee");

const REVIEW_STATUS_LABELS: Record<string, string> = {
  pending: "بانتظار المراجعة",
  approved: "موافقة المدقق",
  rejected: "مرفوض",
  returned: "مردود للتصحيح",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

function countActiveFilters(f: FilterState): number {
  let n = 0;
  if (f.keyword) n++;
  if (f.stages.length) n++;
  if (f.specialStatuses.length) n++;
  if (f.serviceTypes.length) n++;
  if (f.cities.length) n++;
  if (f.employerTypes.length) n++;
  if (f.assignedTo.length) n++;
  if (f.salaryMin || f.salaryMax) n++;
  if (f.financingMin || f.financingMax) n++;
  if (f.salaryTransfer !== "all") n++;
  if (f.hasGuarantor !== "all") n++;
  if (f.reviewStatuses.length) n++;
  if (f.submittedFrom || f.submittedTo) n++;
  if (f.creditScoreMin || f.creditScoreMax) n++;
  if (f.sources.length) n++;
  return n;
}

// ─── Filter Logic ─────────────────────────────────────────────────────────────
function applyFilters(clients: Client[], f: FilterState): Client[] {
  return clients.filter((c) => {
    // Keyword
    if (f.keyword) {
      const kw = f.keyword.toLowerCase();
      const match =
        c.fullName.includes(f.keyword) ||
        c.id.toLowerCase().includes(kw) ||
        c.phone.includes(f.keyword) ||
        (c.nationalIdNumber ?? "").includes(f.keyword) ||
        c.employerName.includes(f.keyword) ||
        c.city.includes(f.keyword);
      if (!match) return false;
    }
    // Stages
    if (f.stages.length && !f.stages.includes(c.stage)) return false;
    // Special statuses
    if (f.specialStatuses.length) {
      if (!c.specialStatus || !f.specialStatuses.includes(c.specialStatus)) return false;
    }
    // Service types
    if (f.serviceTypes.length && !f.serviceTypes.includes(c.serviceType)) return false;
    // Cities
    if (f.cities.length && !f.cities.includes(c.city)) return false;
    // Employer types
    if (f.employerTypes.length && !f.employerTypes.includes(c.employerType)) return false;
    // Assigned to
    if (f.assignedTo.length) {
      if (!c.assignedTo || !f.assignedTo.includes(c.assignedTo)) return false;
    }
    // Salary range
    if (f.salaryMin && (c.salaryAmount ?? 0) < Number(f.salaryMin)) return false;
    if (f.salaryMax && (c.salaryAmount ?? 0) > Number(f.salaryMax)) return false;
    // Financing range
    if (f.financingMin && (c.financingCalc?.approvedAmount ?? 0) < Number(f.financingMin)) return false;
    if (f.financingMax && (c.financingCalc?.approvedAmount ?? 0) > Number(f.financingMax)) return false;
    // Salary transfer
    if (f.salaryTransfer === "yes" && !c.salaryTransfer) return false;
    if (f.salaryTransfer === "no" && c.salaryTransfer) return false;
    // Guarantor
    if (f.hasGuarantor === "yes" && !c.hasGuarantor) return false;
    if (f.hasGuarantor === "no" && c.hasGuarantor) return false;
    // Review status
    if (f.reviewStatuses.length) {
      if (!c.reviewStatus || !f.reviewStatuses.includes(c.reviewStatus)) return false;
    }
    // Submitted date range
    if (f.submittedFrom && new Date(c.submittedAt) < new Date(f.submittedFrom)) return false;
    if (f.submittedTo && new Date(c.submittedAt) > new Date(f.submittedTo + "T23:59:59")) return false;
    // Credit score
    const score = c.creditReport?.creditScore ?? 0;
    if (f.creditScoreMin && score < Number(f.creditScoreMin)) return false;
    if (f.creditScoreMax && score > Number(f.creditScoreMax)) return false;
    // Sources
    if (f.sources.length && !f.sources.includes(c.source)) return false;
    return true;
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────
interface CheckGroupProps {
  label: string;
  icon: string;
  items: { value: string; label: string; color?: string }[];
  selected: string[];
  onToggle: (v: string) => void;
}

function CheckGroup({ label, icon, items, selected, onToggle }: CheckGroupProps) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center text-gray-400">
            <i className={`${icon} text-sm`}></i>
          </div>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{label}</span>
          {selected.length > 0 && (
            <span className="text-[10px] bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 font-bold px-1.5 py-0.5 rounded-full">
              {selected.length}
            </span>
          )}
        </div>
        <div className="w-4 h-4 flex items-center justify-center text-gray-400">
          <i className={open ? "ri-arrow-up-s-line text-sm" : "ri-arrow-down-s-line text-sm"}></i>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
          {items.map((item) => {
            const active = selected.includes(item.value);
            return (
              <button
                key={item.value}
                onClick={() => onToggle(item.value)}
                className={`text-[11px] px-2.5 py-1 rounded-full font-medium cursor-pointer transition-all border ${
                  active
                    ? item.color
                      ? `${item.color} border-transparent`
                      : "bg-brand-500 text-white border-transparent"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface RangeInputProps {
  label: string;
  icon: string;
  minVal: string;
  maxVal: string;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
  placeholder?: string;
  unit?: string;
}

function RangeInput({ label, icon, minVal, maxVal, onMinChange, onMaxChange, unit = "ر.س" }: RangeInputProps) {
  const [open, setOpen] = useState(true);
  const hasValue = minVal || maxVal;
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center text-gray-400">
            <i className={`${icon} text-sm`}></i>
          </div>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{label}</span>
          {hasValue && (
            <span className="text-[10px] bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 font-bold px-1.5 py-0.5 rounded-full">✓</span>
          )}
        </div>
        <div className="w-4 h-4 flex items-center justify-center text-gray-400">
          <i className={open ? "ri-arrow-up-s-line text-sm" : "ri-arrow-down-s-line text-sm"}></i>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-3 flex gap-2 items-center">
          <input
            type="number"
            value={minVal}
            onChange={(e) => onMinChange(e.target.value)}
            placeholder="من"
            className="flex-1 px-2.5 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <span className="text-xs text-gray-400">—</span>
          <input
            type="number"
            value={maxVal}
            onChange={(e) => onMaxChange(e.target.value)}
            placeholder="إلى"
            className="flex-1 px-2.5 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">{unit}</span>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type SortKey = "submittedAt" | "fullName" | "salaryAmount" | "financingAmount" | "creditScore";
type SortDir = "asc" | "desc";

export default function AdvancedSearchPage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sortKey, setSortKey] = useState<SortKey>("submittedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [savedSearches, setSavedSearches] = useState<{ name: string; filters: FilterState }[]>([
    { name: "طلبات الرياض الجديدة", filters: { ...defaultFilters, cities: ["الرياض"], stages: ["new_request"] } },
    { name: "ملفات بانتظار المراجعة", filters: { ...defaultFilters, reviewStatuses: ["pending"] } },
    { name: "قروض شخصية عالية", filters: { ...defaultFilters, serviceTypes: ["قرض شخصي"], financingMin: "50000" } },
  ]);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const PAGE_SIZE = 15;

  const activeCount = useMemo(() => countActiveFilters(filters), [filters]);

  const results = useMemo(() => {
    if (!hasSearched) return [];
    const filtered = applyFilters(mockClients, filters);
    return filtered.sort((a, b) => {
      let va: number | string = 0;
      let vb: number | string = 0;
      if (sortKey === "submittedAt") { va = a.submittedAt; vb = b.submittedAt; }
      else if (sortKey === "fullName") { va = a.fullName; vb = b.fullName; }
      else if (sortKey === "salaryAmount") { va = a.salaryAmount ?? 0; vb = b.salaryAmount ?? 0; }
      else if (sortKey === "financingAmount") { va = a.financingCalc?.approvedAmount ?? 0; vb = b.financingCalc?.approvedAmount ?? 0; }
      else if (sortKey === "creditScore") { va = a.creditReport?.creditScore ?? 0; vb = b.creditReport?.creditScore ?? 0; }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filters, hasSearched, sortKey, sortDir]);

  const paginated = useMemo(() => results.slice(0, page * PAGE_SIZE), [results, page]);

  const handleSearch = () => {
    setHasSearched(true);
    setPage(1);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setHasSearched(false);
    setPage(1);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const handleSaveSearch = () => {
    if (!saveName.trim()) return;
    setSavedSearches((prev) => [...prev, { name: saveName.trim(), filters: { ...filters } }]);
    setSaveName("");
    setSaveModalOpen(false);
  };

  const loadSavedSearch = (saved: { name: string; filters: FilterState }) => {
    setFilters(saved.filters);
    setHasSearched(true);
    setPage(1);
  };

  const update = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const SortIcon = ({ k }: { k: SortKey }) => (
    <div className="w-3 h-3 flex items-center justify-center">
      <i className={`text-[10px] ${
        sortKey === k
          ? sortDir === "asc" ? "ri-arrow-up-line text-brand-500" : "ri-arrow-down-line text-brand-500"
          : "ri-arrow-up-down-line text-gray-300"
      }`}></i>
    </div>
  );

  return (
    <DashboardLayout title="البحث المتقدم">
      <div className="flex gap-5" dir="rtl">

        {/* ── Sidebar Filters ── */}
        <aside className="w-72 flex-shrink-0 space-y-3">

          {/* Saved Searches */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center text-gray-400">
                  <i className="ri-bookmark-line text-sm"></i>
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">بحوثات محفوظة</span>
              </div>
              <button
                onClick={() => setSaveModalOpen(true)}
                className="text-[10px] text-brand-600 hover:text-brand-700 cursor-pointer font-medium"
              >
                + حفظ الحالي
              </button>
            </div>
            <div className="p-2 space-y-1">
              {savedSearches.map((s, i) => (
                <button
                  key={i}
                  onClick={() => loadSavedSearch(s)}
                  className="w-full text-right px-3 py-2 rounded-lg text-xs text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-700 dark:hover:text-brand-400 cursor-pointer transition-colors flex items-center gap-2"
                >
                  <div className="w-3 h-3 flex items-center justify-center text-gray-400">
                    <i className="ri-search-line text-xs"></i>
                  </div>
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Panel */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center text-gray-500">
                  <i className="ri-filter-3-line text-sm"></i>
                </div>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-100">الفلاتر</span>
                {activeCount > 0 && (
                  <span className="text-[10px] bg-brand-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                    {activeCount}
                  </span>
                )}
              </div>
              {activeCount > 0 && (
                <button
                  onClick={handleReset}
                  className="text-[10px] text-red-500 hover:text-red-700 cursor-pointer font-medium"
                >
                  مسح الكل
                </button>
              )}
            </div>

            {/* Keyword */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <div className="relative">
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400">
                  <i className="ri-search-line text-sm"></i>
                </div>
                <input
                  type="text"
                  value={filters.keyword}
                  onChange={(e) => update("keyword", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="اسم، جوال، هوية، رقم ملف..."
                  className="w-full pr-8 pl-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </div>

            <CheckGroup label="المرحلة" icon="ri-flow-chart" items={ALL_STAGES.map((s) => ({ value: s, label: stageLabels[s], color: stageColors[s] }))} selected={filters.stages} onToggle={(v) => update("stages", toggleItem(filters.stages, v as ClientStage))} />
            <CheckGroup label="الحالة الخاصة" icon="ri-alert-line" items={ALL_SPECIAL.map((s) => ({ value: s, label: specialStatusLabels[s], color: specialStatusColors[s] }))} selected={filters.specialStatuses} onToggle={(v) => update("specialStatuses", toggleItem(filters.specialStatuses, v as ClientSpecialStatus))} />
            <CheckGroup label="نوع الخدمة" icon="ri-service-line" items={ALL_SERVICES.map((s) => ({ value: s, label: s }))} selected={filters.serviceTypes} onToggle={(v) => update("serviceTypes", toggleItem(filters.serviceTypes, v))} />
            <CheckGroup label="المدينة" icon="ri-map-pin-line" items={ALL_CITIES.map((c) => ({ value: c, label: c }))} selected={filters.cities} onToggle={(v) => update("cities", toggleItem(filters.cities, v))} />
            <CheckGroup label="نوع جهة العمل" icon="ri-building-line" items={ALL_EMPLOYER_TYPES.map((e) => ({ value: e, label: e }))} selected={filters.employerTypes} onToggle={(v) => update("employerTypes", toggleItem(filters.employerTypes, v))} />
            <CheckGroup label="الموظف المسؤول" icon="ri-user-line" items={ALL_EMPLOYEES.map((e) => ({ value: e.name, label: e.name }))} selected={filters.assignedTo} onToggle={(v) => update("assignedTo", toggleItem(filters.assignedTo, v))} />
            <CheckGroup label="حالة المراجعة" icon="ri-shield-check-line" items={Object.entries(REVIEW_STATUS_LABELS).map(([k, v]) => ({ value: k, label: v }))} selected={filters.reviewStatuses} onToggle={(v) => update("reviewStatuses", toggleItem(filters.reviewStatuses, v))} />
            <RangeInput label="نطاق الراتب" icon="ri-money-dollar-circle-line" minVal={filters.salaryMin} maxVal={filters.salaryMax} onMinChange={(v) => update("salaryMin", v)} onMaxChange={(v) => update("salaryMax", v)} />
            <RangeInput label="مبلغ التمويل" icon="ri-bank-line" minVal={filters.financingMin} maxVal={filters.financingMax} onMinChange={(v) => update("financingMin", v)} onMaxChange={(v) => update("financingMax", v)} />
            <RangeInput label="التقييم الائتماني" icon="ri-bar-chart-line" minVal={filters.creditScoreMin} maxVal={filters.creditScoreMax} onMinChange={(v) => update("creditScoreMin", v)} onMaxChange={(v) => update("creditScoreMax", v)} unit="نقطة" />

            {/* Salary Transfer */}
            <div className="border-b border-gray-100 dark:border-gray-800 px-4 py-3">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center text-gray-400">
                  <i className="ri-bank-card-line text-sm"></i>
                </div>
                تحويل الراتب
              </p>
              <div className="flex gap-1.5">
                {([["all", "الكل"], ["yes", "نعم"], ["no", "لا"]] as const).map(([v, l]) => (
                  <button
                    key={v}
                    onClick={() => update("salaryTransfer", v)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium cursor-pointer transition-all border ${
                      filters.salaryTransfer === v
                        ? "bg-brand-500 text-white border-transparent"
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Has Guarantor */}
            <div className="border-b border-gray-100 dark:border-gray-800 px-4 py-3">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center text-gray-400">
                  <i className="ri-user-shared-line text-sm"></i>
                </div>
                كفيل
              </p>
              <div className="flex gap-1.5">
                {([["all", "الكل"], ["yes", "يوجد"], ["no", "لا يوجد"]] as const).map(([v, l]) => (
                  <button
                    key={v}
                    onClick={() => update("hasGuarantor", v)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium cursor-pointer transition-all border ${
                      filters.hasGuarantor === v
                        ? "bg-brand-500 text-white border-transparent"
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="border-b border-gray-100 dark:border-gray-800 px-4 py-3">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center text-gray-400">
                  <i className="ri-calendar-line text-sm"></i>
                </div>
                تاريخ التقديم
              </p>
              <div className="space-y-2">
                <input type="date" value={filters.submittedFrom} onChange={(e) => update("submittedFrom", e.target.value)} className="w-full px-2.5 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100" />
                <input type="date" value={filters.submittedTo} onChange={(e) => update("submittedTo", e.target.value)} className="w-full px-2.5 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100" />
              </div>
            </div>

            <CheckGroup label="مصدر الطلب" icon="ri-share-line" items={ALL_SOURCES.map((s) => ({ value: s, label: s }))} selected={filters.sources} onToggle={(v) => update("sources", toggleItem(filters.sources, v))} />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full py-3 bg-brand-500 text-white text-sm font-bold rounded-xl hover:bg-brand-600 cursor-pointer transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-search-2-line text-base"></i>
            </div>
            تطبيق البحث
            {activeCount > 0 && (
              <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {activeCount} فلتر
              </span>
            )}
          </button>
        </aside>

        {/* ── Results Area ── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Active Filters Tags */}
          {activeCount > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">الفلاتر النشطة:</span>
                {filters.keyword && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 px-2.5 py-1 rounded-full border border-brand-100 dark:border-brand-800">
                    <i className="ri-search-line text-xs"></i>
                    {filters.keyword}
                    <button onClick={() => update("keyword", "")} className="cursor-pointer hover:text-brand-900 w-3 h-3 flex items-center justify-center">
                      <i className="ri-close-line text-xs"></i>
                    </button>
                  </span>
                )}
                {filters.stages.map((s) => (
                  <span key={s} className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border ${stageColors[s]}`}>
                    {stageLabels[s]}
                    <button onClick={() => update("stages", filters.stages.filter((x) => x !== s))} className="cursor-pointer w-3 h-3 flex items-center justify-center">
                      <i className="ri-close-line text-xs"></i>
                    </button>
                  </span>
                ))}
                {filters.serviceTypes.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 text-[11px] bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 px-2.5 py-1 rounded-full border border-teal-100 dark:border-teal-800">
                    {s}
                    <button onClick={() => update("serviceTypes", filters.serviceTypes.filter((x) => x !== s))} className="cursor-pointer w-3 h-3 flex items-center justify-center">
                      <i className="ri-close-line text-xs"></i>
                    </button>
                  </span>
                ))}
                {filters.cities.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1 text-[11px] bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 px-2.5 py-1 rounded-full border border-sky-100 dark:border-sky-800">
                    <i className="ri-map-pin-line text-xs"></i>
                    {c}
                    <button onClick={() => update("cities", filters.cities.filter((x) => x !== c))} className="cursor-pointer w-3 h-3 flex items-center justify-center">
                      <i className="ri-close-line text-xs"></i>
                    </button>
                  </span>
                ))}
                {(filters.salaryMin || filters.salaryMax) && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-full border border-amber-100 dark:border-amber-800">
                    راتب: {filters.salaryMin || "0"} — {filters.salaryMax || "∞"} ر.س
                    <button onClick={() => { update("salaryMin", ""); update("salaryMax", ""); }} className="cursor-pointer w-3 h-3 flex items-center justify-center">
                      <i className="ri-close-line text-xs"></i>
                    </button>
                  </span>
                )}
                <button onClick={handleReset} className="text-[11px] text-red-500 hover:text-red-700 cursor-pointer font-medium flex items-center gap-1 whitespace-nowrap">
                  <i className="ri-delete-bin-line text-xs"></i>
                  مسح الكل
                </button>
              </div>
            </div>
          )}

          {/* Results Header */}
          {hasSearched && (
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-bold text-gray-900 dark:text-gray-100 text-base">{results.length}</span> نتيجة
                </p>
                {results.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <span>ترتيب حسب:</span>
                    {([
                      ["submittedAt", "التاريخ"],
                      ["fullName", "الاسم"],
                      ["salaryAmount", "الراتب"],
                      ["financingAmount", "التمويل"],
                      ["creditScore", "الائتماني"],
                    ] as [SortKey, string][]).map(([k, l]) => (
                      <button
                        key={k}
                        onClick={() => handleSort(k)}
                        className={`flex items-center gap-0.5 px-2 py-1 rounded-md cursor-pointer transition-colors ${
                          sortKey === k
                            ? "bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-medium"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {l}
                        <SortIcon k={k} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {results.length > 0 && (
                <button onClick={() => setSaveModalOpen(true)} className="text-xs text-brand-600 hover:text-brand-700 cursor-pointer font-medium flex items-center gap-1 whitespace-nowrap">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-bookmark-line text-sm"></i>
                  </div>
                  حفظ هذا البحث
                </button>
              )}
            </div>
          )}

          {/* Empty / Initial State */}
          {!hasSearched && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mb-4">
                <i className="ri-search-2-line text-3xl text-brand-400"></i>
              </div>
              <h3 className="text-base font-bold text-gray-700 dark:text-gray-200 mb-2">ابدأ البحث المتقدم</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs leading-relaxed">
                اختر الفلاتر من الشريط الجانبي ثم اضغط &ldquo;تطبيق البحث&rdquo; للحصول على النتائج
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {[
                  { label: "طلبات اليوم", action: () => { update("submittedFrom", "2026-04-24"); handleSearch(); } },
                  { label: "بانتظار المراجعة", action: () => { update("reviewStatuses", ["pending"]); handleSearch(); } },
                  { label: "ملفات الرياض", action: () => { update("cities", ["الرياض"]); handleSearch(); } },
                  { label: "قروض شخصية", action: () => { update("serviceTypes", ["قرض شخصي"]); handleSearch(); } },
                ].map((q) => (
                  <button
                    key={q.label}
                    onClick={q.action}
                    className="text-xs px-3 py-1.5 rounded-full border border-brand-200 dark:border-brand-700 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 cursor-pointer transition-colors"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {hasSearched && results.length === 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 py-16 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-3">
                <i className="ri-inbox-line text-3xl text-gray-300 dark:text-gray-600"></i>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">لا توجد نتائج تطابق الفلاتر المحددة</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">جرّب تخفيف الفلاتر أو تغيير معايير البحث</p>
              <button onClick={handleReset} className="mt-4 text-xs text-brand-600 hover:text-brand-700 cursor-pointer font-medium">
                مسح جميع الفلاتر
              </button>
            </div>
          )}

          {/* Results Table */}
          {hasSearched && results.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/70 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
                        <button onClick={() => handleSort("fullName")} className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200">
                          العميل <SortIcon k="fullName" />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">الخدمة</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">المرحلة</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
                        <button onClick={() => handleSort("salaryAmount")} className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200">
                          الراتب <SortIcon k="salaryAmount" />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
                        <button onClick={() => handleSort("financingAmount")} className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200">
                          التمويل <SortIcon k="financingAmount" />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
                        <button onClick={() => handleSort("creditScore")} className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200">
                          الائتماني <SortIcon k="creditScore" />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">الموظف</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
                        <button onClick={() => handleSort("submittedAt")} className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200">
                          التاريخ <SortIcon k="submittedAt" />
                        </button>
                      </th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((client) => {
                      const score = client.creditReport?.creditScore;
                      const scoreColor = !score ? "text-gray-300 dark:text-gray-600" : score >= 700 ? "text-emerald-600 dark:text-emerald-400" : score >= 600 ? "text-amber-600 dark:text-amber-400" : "text-red-500 dark:text-red-400";
                      return (
                        <tr key={client.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center flex-shrink-0">
                                <span className="text-brand-700 dark:text-brand-300 text-[10px] font-bold">
                                  {client.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">{client.fullName}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">{client.id}</span>
                                  <span className="text-gray-300 dark:text-gray-700">·</span>
                                  <span className="text-[10px] text-gray-400 dark:text-gray-500">{client.city}</span>
                                  {client.specialStatus && (
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${specialStatusColors[client.specialStatus]}`}>
                                      {specialStatusLabels[client.specialStatus]}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-gray-700 dark:text-gray-300">{client.serviceType}</span>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{client.employerType}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${stageColors[client.stage]}`}>
                              {stageLabels[client.stage]}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {client.salaryAmount ? (
                              <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{client.salaryAmount.toLocaleString("ar-SA")}</span>
                            ) : (
                              <span className="text-xs text-gray-300 dark:text-gray-600">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {client.financingCalc?.approvedAmount ? (
                              <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{client.financingCalc.approvedAmount.toLocaleString("ar-SA")}</span>
                            ) : (
                              <span className="text-xs text-gray-300 dark:text-gray-600">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {score ? (
                              <span className={`text-xs font-bold ${scoreColor}`}>{score}</span>
                            ) : (
                              <span className="text-xs text-gray-300 dark:text-gray-600">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-gray-600 dark:text-gray-400">{client.assignedTo ?? "—"}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(client.submittedAt).toLocaleDateString("ar-SA", { day: "numeric", month: "short" })}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <Link
                              to={`/dashboard/clients/${client.id}`}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all"
                            >
                              <i className="ri-external-link-line text-sm"></i>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {paginated.length < results.length && (
                <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <p className="text-xs text-gray-400 dark:text-gray-500">عرض {paginated.length} من {results.length}</p>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="text-sm text-brand-600 hover:text-brand-700 font-medium cursor-pointer flex items-center gap-1.5"
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-arrow-down-line text-sm"></i>
                    </div>
                    تحميل المزيد ({results.length - paginated.length} متبقي)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Save Search Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">حفظ البحث</h3>
              <button onClick={() => setSaveModalOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-400">
                <i className="ri-close-line text-base"></i>
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">أدخل اسماً لهذا البحث لتتمكن من استخدامه لاحقاً</p>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveSearch()}
              placeholder="مثال: طلبات الرياض الجديدة..."
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setSaveModalOpen(false)}
                className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveSearch}
                disabled={!saveName.trim()}
                className="flex-1 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 disabled:opacity-50 cursor-pointer"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
