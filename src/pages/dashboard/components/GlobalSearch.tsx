import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { mockClients, stageLabels, stageColors } from "@/mocks/dashboardData";

interface SearchResult {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  serviceType: string;
  stage: string;
  stageLabel: string;
  stageColor: string;
}

export default function GlobalSearch() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback((q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const lower = q.toLowerCase();
    const found = mockClients
      .filter(
        (c) =>
          c.fullName.includes(q) ||
          c.phone.includes(q) ||
          c.id.toLowerCase().includes(lower) ||
          c.city.includes(q) ||
          c.serviceType.includes(q) ||
          (c.nationalIdNumber ?? "").includes(q)
      )
      .slice(0, 8)
      .map((c) => ({
        id: c.id,
        fullName: c.fullName,
        phone: c.phone,
        city: c.city,
        serviceType: c.serviceType,
        stage: c.stage,
        stageLabel: stageLabels[c.stage],
        stageColor: stageColors[c.stage],
      }));
    setResults(found);
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    search(query);
  }, [query, search]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      goToClient(results[activeIndex].id);
    }
  };

  const goToClient = (id: string) => {
    navigate(`/dashboard/clients/${id}`);
    setOpen(false);
    setQuery("");
    setResults([]);
  };

  const highlight = (text: string, q: string) => {
    if (!q.trim()) return text;
    const idx = text.indexOf(q);
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 rounded px-0.5">{text.slice(idx, idx + q.length)}</mark>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search Trigger Button */}
      <button
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer min-w-[180px] sm:min-w-[220px]"
      >
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          <i className="ri-search-line text-sm"></i>
        </div>
        <span className="text-xs flex-1 text-right">بحث سريع...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600 font-mono">
          ⌘K
        </kbd>
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute left-0 top-12 w-[420px] bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
          {/* Input */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 text-gray-400">
              <i className="ri-search-line text-sm"></i>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ابحث بالاسم، الجوال، رقم الملف، المدينة..."
              className="flex-1 text-sm bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              >
                <i className="ri-close-line text-sm"></i>
              </button>
            )}
          </div>

          {/* Results */}
          {query && results.length === 0 && (
            <div className="py-10 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
              <div className="w-10 h-10 flex items-center justify-center mb-2">
                <i className="ri-search-line text-2xl"></i>
              </div>
              <p className="text-xs">لا توجد نتائج لـ &ldquo;{query}&rdquo;</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="max-h-80 overflow-y-auto">
              {results.map((r, i) => (
                <button
                  key={r.id}
                  onClick={() => goToClient(r.id)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-right transition-colors cursor-pointer border-b border-gray-50 dark:border-gray-800 last:border-0 ${
                    i === activeIndex
                      ? "bg-brand-50 dark:bg-brand-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-700 dark:text-brand-300 text-xs font-bold">
                      {r.fullName.charAt(0)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {highlight(r.fullName, query)}
                      </p>
                      <span className="font-mono text-[10px] text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                        {highlight(r.id, query)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-gray-400 dark:text-gray-500">{highlight(r.phone, query)}</span>
                      <span className="text-gray-300 dark:text-gray-700">·</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{highlight(r.city, query)}</span>
                      <span className="text-gray-300 dark:text-gray-700">·</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{r.serviceType}</span>
                    </div>
                  </div>

                  {/* Stage */}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap flex-shrink-0 ${r.stageColor}`}>
                    {r.stageLabel}
                  </span>

                  {/* Arrow */}
                  <div className="w-4 h-4 flex items-center justify-center text-gray-300 dark:text-gray-600 flex-shrink-0">
                    <i className="ri-arrow-left-line text-xs"></i>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Footer */}
          {!query && (
            <div className="px-4 py-3 flex items-center justify-between">
              <p className="text-xs text-gray-400 dark:text-gray-500">ابدأ الكتابة للبحث...</p>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1">
                  <kbd className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded border border-gray-200 dark:border-gray-700 font-mono">↑↓</kbd>
                  للتنقل
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded border border-gray-200 dark:border-gray-700 font-mono">↵</kbd>
                  للفتح
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded border border-gray-200 dark:border-gray-700 font-mono">Esc</kbd>
                  للإغلاق
                </span>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <p className="text-[10px] text-gray-400 dark:text-gray-500">{results.length} نتيجة</p>
              <button
                onClick={() => { navigate(`/dashboard/advanced-search`); setOpen(false); setQuery(""); }}
                className="text-[10px] text-brand-600 hover:text-brand-700 cursor-pointer font-medium flex items-center gap-1"
              >
                بحث متقدم
                <i className="ri-arrow-left-line text-xs"></i>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
