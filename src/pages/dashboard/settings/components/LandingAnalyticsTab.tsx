import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { mockClients } from "@/mocks/dashboardData";

// ─── Types ────────────────────────────────────────────────────────────────────
type Period = "7d" | "30d" | "90d" | "all";

interface DailyVisit {
  date: string;
  visits: number;
  submissions: number;
}

interface LiveSubmission {
  id: string;
  clientId: string;
  clientName: string;
  serviceType: string;
  city: string;
  submittedAt: string;
  isNew?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateVisitData(baseClients: typeof mockClients, liveCount: number, period: Period): DailyVisit[] {
  const now = new Date("2026-04-25");
  const days = period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 120;
  const result: DailyVisit[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const submissions = baseClients.filter((c) => c.submittedAt.startsWith(dateStr)).length;
    const seed = d.getDate() + d.getMonth() * 31;
    const multiplier = 3 + (seed % 10);
    const visits = submissions > 0 ? submissions * multiplier : Math.floor(seed % 5);
    result.push({ date: dateStr, visits, submissions });
  }

  // Add live submissions to today
  if (liveCount > 0 && result.length > 0) {
    const last = result[result.length - 1];
    last.submissions += liveCount;
    last.visits += liveCount * 4;
  }

  return result;
}

function formatDate(dateStr: string, short = false): string {
  const d = new Date(dateStr);
  if (short) return d.toLocaleDateString("ar-SA", { month: "short", day: "numeric" });
  return d.toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric" });
}

function timeAgo(isoStr: string): string {
  const now = Date.now();
  const then = new Date(isoStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `منذ ${diff} ث`;
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} د`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} س`;
  return formatDate(isoStr.split("T")[0], true);
}

const DEMO_SUBMISSIONS: Omit<LiveSubmission, "id" | "submittedAt" | "isNew">[] = [
  { clientId: "CLT-L1", clientName: "عبدالله المطيري", serviceType: "سداد متعثرات", city: "الرياض" },
  { clientId: "CLT-L2", clientName: "نورة الشمري", serviceType: "تمويل عقاري", city: "جدة" },
  { clientId: "CLT-L3", clientName: "فهد العتيبي", serviceType: "استخراج تمويل شخصي", city: "الدمام" },
  { clientId: "CLT-L4", clientName: "سارة الزهراني", serviceType: "فك رهن", city: "مكة المكرمة" },
  { clientId: "CLT-L5", clientName: "خالد الحربي", serviceType: "تمويل ناجيري", city: "الطائف" },
  { clientId: "CLT-L6", clientName: "ريم القحطاني", serviceType: "تمويل عقاري", city: "الرياض" },
  { clientId: "CLT-L7", clientName: "محمد الدوسري", serviceType: "سداد متعثرات", city: "الخبر" },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LandingAnalyticsTab() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>("30d");
  const [activeMetric, setActiveMetric] = useState<"visits" | "submissions">("visits");
  const [liveSubmissions, setLiveSubmissions] = useState<LiveSubmission[]>([]);
  const [liveVisitors, setLiveVisitors] = useState(3);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [flashKpi, setFlashKpi] = useState<string | null>(null);
  const [ticker, setTicker] = useState(0);
  const demoIdxRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const baseClients = mockClients;

  // ── Live counter (ticks every second) ────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setTicker((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // ── Simulate live visitors fluctuation ───────────────────────────────────
  useEffect(() => {
    if (!isLive) return;
    const t = setInterval(() => {
      setLiveVisitors((v) => Math.max(1, v + Math.floor(Math.random() * 5) - 2));
    }, 4000);
    return () => clearInterval(t);
  }, [isLive]);

  // ── Listen for real submissions from landing page ─────────────────────────
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as LiveSubmission;
      const entry: LiveSubmission = { ...detail, submittedAt: new Date().toISOString(), isNew: true };
      setLiveSubmissions((prev) => [entry, ...prev].slice(0, 20));
      setLastUpdated(new Date());
      setFlashKpi("submissions");
      setTimeout(() => setFlashKpi(null), 1500);
      setTimeout(() => {
        setLiveSubmissions((prev) => prev.map((s) => s.id === entry.id ? { ...s, isNew: false } : s));
      }, 3000);
    };
    window.addEventListener("new_landing_submission", handler);
    return () => window.removeEventListener("new_landing_submission", handler);
  }, []);

  // ── Demo auto-simulation ──────────────────────────────────────────────────
  const triggerDemoSubmission = useCallback(() => {
    const demo = DEMO_SUBMISSIONS[demoIdxRef.current % DEMO_SUBMISSIONS.length];
    demoIdxRef.current++;
    const entry: LiveSubmission = {
      ...demo,
      id: `live_${Date.now()}`,
      submittedAt: new Date().toISOString(),
      isNew: true,
    };
    setLiveSubmissions((prev) => [entry, ...prev].slice(0, 20));
    setLastUpdated(new Date());
    setFlashKpi("submissions");
    setTimeout(() => setFlashKpi(null), 1500);
    setTimeout(() => {
      setLiveSubmissions((prev) => prev.map((s) => s.id === entry.id ? { ...s, isNew: false } : s));
    }, 3000);
  }, []);

  useEffect(() => {
    if (!isLive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      if (Math.random() < 0.25) triggerDemoSubmission();
    }, 20000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isLive, triggerDemoSubmission]);

  // ── Computed metrics ──────────────────────────────────────────────────────
  const visitData = useMemo(
    () => generateVisitData(baseClients, liveSubmissions.length, period),
    [baseClients, liveSubmissions.length, period]
  );

  const totalVisits = visitData.reduce((s, d) => s + d.visits, 0);
  const totalSubmissions = visitData.reduce((s, d) => s + d.submissions, 0);
  const conversionRate = totalVisits > 0 ? ((totalSubmissions / totalVisits) * 100).toFixed(1) : "0.0";
  const avgVisitsPerDay = visitData.length > 0 ? Math.round(totalVisits / visitData.length) : 0;
  const bounceRate = Math.max(0, 100 - parseFloat(conversionRate) * 2.5).toFixed(1);

  const allSubmissions: LiveSubmission[] = [
    ...liveSubmissions,
    ...baseClients
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 12)
      .map((c) => ({
        id: c.id,
        clientId: c.id,
        clientName: c.fullName,
        serviceType: c.serviceType,
        city: c.city,
        submittedAt: c.submittedAt,
        isNew: false,
      })),
  ].slice(0, 15);

  // ── Source breakdown ──────────────────────────────────────────────────────
  const sourceMap: Record<string, number> = {};
  baseClients.forEach((c) => { const s = c.source || "غير محدد"; sourceMap[s] = (sourceMap[s] || 0) + 1; });
  const sources = Object.entries(sourceMap).sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count, pct: Math.round((count / baseClients.length) * 100) }));

  // ── Service breakdown ─────────────────────────────────────────────────────
  const serviceMap: Record<string, number> = {};
  baseClients.forEach((c) => { const s = c.serviceType || "غير محدد"; serviceMap[s] = (serviceMap[s] || 0) + 1; });
  const serviceBreakdown = Object.entries(serviceMap).sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count, pct: Math.round((count / baseClients.length) * 100) }));

  // ── City breakdown ────────────────────────────────────────────────────────
  const cityMap: Record<string, number> = {};
  baseClients.forEach((c) => { const city = c.city || "غير محدد"; cityMap[city] = (cityMap[city] || 0) + 1; });
  const cityBreakdown = Object.entries(cityMap).sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([name, count]) => ({ name, count, pct: Math.round((count / baseClients.length) * 100) }));

  // ── Employer breakdown ────────────────────────────────────────────────────
  const empMap: Record<string, number> = {};
  baseClients.forEach((c) => { const e = c.employerType || "غير محدد"; empMap[e] = (empMap[e] || 0) + 1; });
  const empBreakdown = Object.entries(empMap).sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count, pct: Math.round((count / baseClients.length) * 100) }));

  // ── Chart data ────────────────────────────────────────────────────────────
  const chartData = useMemo(() => {
    if (period === "7d") return visitData;
    if (period === "30d") return visitData.filter((_, i) => i % 2 === 0);
    const weeks: DailyVisit[] = [];
    for (let i = 0; i < visitData.length; i += 7) {
      const chunk = visitData.slice(i, i + 7);
      weeks.push({ date: chunk[0].date, visits: chunk.reduce((s, d) => s + d.visits, 0), submissions: chunk.reduce((s, d) => s + d.submissions, 0) });
    }
    return weeks;
  }, [visitData, period]);

  const maxVal = Math.max(...chartData.map((d) => activeMetric === "visits" ? d.visits : d.submissions), 1);

  const periodLabels: Record<Period, string> = { "7d": "آخر 7 أيام", "30d": "آخر 30 يوم", "90d": "آخر 90 يوم", "all": "كل الوقت" };

  // ── Seconds since last update ─────────────────────────────────────────────
  const secsSinceUpdate = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);

  return (
    <div className="space-y-5" dir="rtl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-bar-chart-2-line text-brand-500 text-sm"></i>
            </div>
            إحصائيات صفحة الهبوط
            {isLive && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                مباشر
              </span>
            )}
          </h4>
          <p className="text-xs text-gray-400 mt-0.5 mr-7">
            آخر تحديث: {secsSinceUpdate < 60 ? `منذ ${secsSinceUpdate} ث` : timeAgo(lastUpdated.toISOString())}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Live toggle */}
          <button
            onClick={() => setIsLive((v) => !v)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium cursor-pointer whitespace-nowrap transition-all ${isLive ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className={`${isLive ? "ri-pause-circle-line" : "ri-play-circle-line"} text-sm`}></i>
            </div>
            {isLive ? "إيقاف Live" : "تشغيل Live"}
          </button>
          {/* Demo trigger */}
          <button
            onClick={triggerDemoSubmission}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-brand-200 bg-brand-50 text-brand-600 font-medium cursor-pointer whitespace-nowrap hover:bg-brand-100 transition-colors"
          >
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-circle-line text-sm"></i></div>
            محاكاة طلب
          </button>
          {/* Period selector */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {(["7d", "30d", "90d", "all"] as Period[]).map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium cursor-pointer whitespace-nowrap transition-all ${period === p ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                {periodLabels[p]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Live Visitors Banner ── */}
      {isLive && (
        <div className="bg-gradient-to-l from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-100">
              <i className="ri-user-location-line text-emerald-600 text-base"></i>
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-800">
                <span className="text-xl font-black">{liveVisitors}</span> زائر الآن على الصفحة
              </p>
              <p className="text-xs text-emerald-600">يتصفحون صفحة الهبوط في هذه اللحظة</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-emerald-700">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-file-add-line text-sm"></i></div>
              <span><strong>{liveSubmissions.length}</strong> طلب جديد اليوم</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-time-line text-sm"></i></div>
              <span>يتحدث كل ثانية</span>
            </div>
          </div>
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <LiveKpiCard
          icon="ri-eye-line" label="إجمالي الزيارات"
          value={totalVisits.toLocaleString("ar-SA")}
          sub={`معدل ${avgVisitsPerDay} / يوم`}
          color="text-sky-600" bg="bg-sky-50" trend="+12%" trendUp
          flash={flashKpi === "visits"}
        />
        <LiveKpiCard
          icon="ri-file-add-line" label="الطلبات المُرسلة"
          value={totalSubmissions.toLocaleString("ar-SA")}
          sub={liveSubmissions.length > 0 ? `+${liveSubmissions.length} جديد اليوم` : `من ${baseClients.length} عميل`}
          color="text-emerald-600" bg="bg-emerald-50" trend="+8%" trendUp
          flash={flashKpi === "submissions"}
          liveCount={liveSubmissions.length}
        />
        <LiveKpiCard
          icon="ri-percent-line" label="نسبة التحويل"
          value={`${conversionRate}%`}
          sub="زيارة → طلب"
          color="text-brand-600" bg="bg-brand-50" trend="+2.1%" trendUp
          flash={flashKpi === "conversion"}
        />
        <LiveKpiCard
          icon="ri-user-location-line" label="زوار الآن"
          value={isLive ? liveVisitors.toString() : "—"}
          sub="على الصفحة الآن"
          color="text-teal-600" bg="bg-teal-50" trend="مباشر" trendUp
          flash={false} isLive={isLive}
        />
      </div>

      {/* ── Chart + Live Feed ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-sm font-bold text-gray-800">مخطط الزيارات والطلبات</h5>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                <button onClick={() => setActiveMetric("visits")}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium cursor-pointer whitespace-nowrap transition-all ${activeMetric === "visits" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500"}`}
                >الزيارات</button>
                <button onClick={() => setActiveMetric("submissions")}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium cursor-pointer whitespace-nowrap transition-all ${activeMetric === "submissions" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500"}`}
                >الطلبات</button>
              </div>
            </div>
          </div>

          <div className="flex items-end gap-1 h-44 overflow-x-auto pb-2">
            {chartData.map((d, i) => {
              const val = activeMetric === "visits" ? d.visits : d.submissions;
              const heightPct = maxVal > 0 ? (val / maxVal) * 100 : 0;
              const isToday = i === chartData.length - 1;
              return (
                <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0" style={{ minWidth: chartData.length > 20 ? "12px" : "auto", flex: 1 }}>
                  <div className="relative group w-full flex justify-center">
                    <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
                      <div className="bg-gray-800 text-white text-[10px] px-2 py-1 rounded-lg whitespace-nowrap">
                        {formatDate(d.date, true)}: {val}{isToday && isLive ? " 🔴" : ""}
                      </div>
                      <div className="w-1.5 h-1.5 bg-gray-800 rotate-45 -mt-0.5"></div>
                    </div>
                    <div
                      className={`w-full rounded-t-md transition-all cursor-pointer ${
                        isToday && isLive
                          ? "bg-emerald-400 hover:bg-emerald-500 animate-pulse"
                          : activeMetric === "visits"
                          ? "bg-sky-400 hover:bg-sky-500"
                          : "bg-brand-400 hover:bg-brand-500"
                      }`}
                      style={{ height: `${Math.max(heightPct * 1.6, val > 0 ? 4 : 0)}px` }}
                    ></div>
                  </div>
                  {chartData.length <= 15 && (
                    <span className={`text-[8px] whitespace-nowrap ${isToday && isLive ? "text-emerald-500 font-bold" : "text-gray-400"}`}>
                      {isToday && isLive ? "الآن" : formatDate(d.date, true).split(" ")[0]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-sky-400"></div>
              <span className="text-xs text-gray-500">الزيارات ({totalVisits.toLocaleString("ar-SA")})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-brand-400"></div>
              <span className="text-xs text-gray-500">الطلبات ({totalSubmissions.toLocaleString("ar-SA")})</span>
            </div>
            {isLive && (
              <div className="flex items-center gap-1.5 mr-auto">
                <div className="w-3 h-3 rounded-sm bg-emerald-400 animate-pulse"></div>
                <span className="text-xs text-emerald-600 font-medium">اليوم (مباشر)</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Feed */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 flex-shrink-0">
            <h5 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
              بث مباشر للطلبات
            </h5>
            <span className="text-[10px] text-gray-400">{liveSubmissions.length} جديد</span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-52">
            {liveSubmissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <div className="w-8 h-8 flex items-center justify-center mb-2">
                  <i className="ri-radar-line text-2xl"></i>
                </div>
                <p className="text-xs">في انتظار الطلبات...</p>
                <p className="text-[10px] mt-1 text-gray-300">اضغط "محاكاة طلب" للتجربة</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {liveSubmissions.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => navigate(`/dashboard/clients/${s.clientId}`)}
                    className={`px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-all ${s.isNew ? "bg-emerald-50/60 border-r-2 border-emerald-400" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0 ${s.isNew ? "bg-emerald-100 text-emerald-700" : "bg-brand-100 text-brand-600"}`}>
                        {s.clientName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-semibold text-gray-800 truncate">{s.clientName}</p>
                          {s.isNew && <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap flex-shrink-0">جديد</span>}
                        </div>
                        <p className="text-[10px] text-gray-500 truncate">{s.serviceType} — {s.city}</p>
                      </div>
                      <span className="text-[9px] text-gray-400 whitespace-nowrap flex-shrink-0">{timeAgo(s.submittedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Sources + Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h5 className="text-sm font-bold text-gray-800 mb-4">مصادر العملاء</h5>
          <div className="space-y-3">
            {sources.map((s, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600 truncate flex-1 ml-2">{s.name}</span>
                  <span className="text-xs font-bold text-gray-800 flex-shrink-0">{s.count}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, backgroundColor: COLORS[i % COLORS.length] }}></div>
                </div>
                <span className="text-[10px] text-gray-400">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h5 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center"><i className="ri-service-line text-brand-500 text-sm"></i></div>
            نوع الخدمة
          </h5>
          <div className="space-y-2.5">
            {serviceBreakdown.map((s, i) => <BreakdownRow key={i} label={s.name} count={s.count} pct={s.pct} colorIdx={i} />)}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h5 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center"><i className="ri-map-pin-line text-brand-500 text-sm"></i></div>
            توزيع المدن
          </h5>
          <div className="space-y-2.5">
            {cityBreakdown.map((c, i) => <BreakdownRow key={i} label={c.name} count={c.count} pct={c.pct} colorIdx={i} />)}
          </div>
        </div>
      </div>

      {/* ── Conversion Funnel ── */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h5 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center"><i className="ri-filter-3-line text-brand-500 text-sm"></i></div>
          قمع التحويل
        </h5>
        <div className="flex items-end gap-3 overflow-x-auto pb-2">
          {[
            { label: "زيارات الصفحة", value: totalVisits, color: "bg-sky-100 border-sky-200", text: "text-sky-700", icon: "ri-eye-line" },
            { label: "بدأوا النموذج", value: Math.round(totalVisits * 0.42), color: "bg-amber-100 border-amber-200", text: "text-amber-700", icon: "ri-edit-line" },
            { label: "أرسلوا الطلب", value: totalSubmissions, color: "bg-emerald-100 border-emerald-200", text: "text-emerald-700", icon: "ri-send-plane-line" },
            { label: "تم تعيين موظف", value: baseClients.filter((c) => c.assignedTo).length, color: "bg-brand-100 border-brand-200", text: "text-brand-700", icon: "ri-user-add-line" },
            { label: "تحت المعالجة", value: baseClients.filter((c) => !["archived"].includes(c.stage) && !c.specialStatus).length, color: "bg-violet-100 border-violet-200", text: "text-violet-700", icon: "ri-loader-4-line" },
          ].map((step, i, arr) => {
            const prevVal = i > 0 ? arr[i - 1].value : step.value;
            const dropPct = prevVal > 0 ? Math.round(((prevVal - step.value) / prevVal) * 100) : 0;
            return (
              <div key={i} className="flex items-center gap-2 flex-shrink-0">
                <div className={`rounded-xl border p-4 text-center min-w-[120px] ${step.color}`}>
                  <div className="w-8 h-8 flex items-center justify-center mx-auto mb-2 rounded-lg bg-white/60">
                    <i className={`${step.icon} ${step.text} text-base`}></i>
                  </div>
                  <p className={`text-xl font-black ${step.text}`}>{step.value.toLocaleString("ar-SA")}</p>
                  <p className="text-xs text-gray-600 mt-1 leading-tight">{step.label}</p>
                </div>
                {i < arr.length - 1 && (
                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                    <div className="w-6 h-6 flex items-center justify-center"><i className="ri-arrow-left-line text-gray-300 text-base"></i></div>
                    {dropPct > 0 && <span className="text-[10px] text-rose-500 font-medium whitespace-nowrap">-{dropPct}%</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── All Submissions Table ── */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h5 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center"><i className="ri-time-line text-brand-500 text-sm"></i></div>
            آخر الطلبات الواردة
            {liveSubmissions.length > 0 && (
              <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                +{liveSubmissions.length} جديد
              </span>
            )}
          </h5>
          <span className="text-xs text-gray-400">{allSubmissions.length} طلب</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/60">
                <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">الاسم</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">الخدمة</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">المدينة</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">الوقت</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allSubmissions.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => navigate(`/dashboard/clients/${s.clientId}`)}
                  className={`cursor-pointer transition-colors ${s.isNew ? "bg-emerald-50/40 hover:bg-emerald-50" : "hover:bg-gray-50/40"}`}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0 ${s.isNew ? "bg-emerald-100 text-emerald-700" : "bg-brand-100 text-brand-600"}`}>
                        {s.clientName.charAt(0)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-gray-800 whitespace-nowrap">{s.clientName}</span>
                        {s.isNew && <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap">جديد</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="text-xs text-gray-600 whitespace-nowrap">{s.serviceType}</span></td>
                  <td className="px-4 py-3"><span className="text-xs text-gray-600">{s.city}</span></td>
                  <td className="px-4 py-3"><span className="text-xs text-gray-500 whitespace-nowrap">{timeAgo(s.submittedAt)}</span></td>
                  <td className="px-4 py-3">
                    {s.isNew
                      ? <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 whitespace-nowrap flex items-center gap-1 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>وصل الآن</span>
                      : <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 whitespace-nowrap">قيد المعالجة</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Employer breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h5 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center"><i className="ri-building-line text-brand-500 text-sm"></i></div>
            جهة العمل
          </h5>
          <div className="space-y-2.5">
            {empBreakdown.map((e, i) => <BreakdownRow key={i} label={e.name} count={e.count} pct={e.pct} colorIdx={i} />)}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <p className="text-sm font-bold text-brand-700 mb-3 flex items-center gap-2">
              <div className="w-5 h-5 flex items-center justify-center"><i className="ri-lightbulb-line text-brand-500 text-sm"></i></div>
              نصائح لتحسين نسبة التحويل
            </p>
            <ul className="text-xs text-brand-600 space-y-2">
              {[
                "قلّل عدد الحقول الإلزامية — كل حقل إضافي يقلل التحويل بنسبة 5-10%",
                "أضف نص مساعدة واضح لكل حقل لتقليل الارتباك",
                "تأكد من أن زر الإرسال واضح ومميز بلون جذاب",
                "اختبر النموذج على الجوال — أكثر من 60% من الزيارات من الهاتف",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ri-checkbox-circle-line text-brand-400 text-sm"></i>
                  </div>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-brand-100">
            <p className="text-xs text-brand-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              نسبة التحويل الحالية: <strong>{conversionRate}%</strong>
              {parseFloat(conversionRate) >= 5 ? " — ممتاز!" : parseFloat(conversionRate) >= 3 ? " — جيد" : " — يحتاج تحسين"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Live KPI Card ────────────────────────────────────────────────────────────
const COLORS = ["#FF6039", "#34D399", "#60A5FA", "#FBBF24", "#A78BFA", "#F472B6"];

function LiveKpiCard({
  icon, label, value, sub, color, bg, trend, trendUp, flash, liveCount, isLive,
}: {
  icon: string; label: string; value: string; sub: string;
  color: string; bg: string; trend: string; trendUp: boolean;
  flash: boolean; liveCount?: number; isLive?: boolean;
}) {
  return (
    <div className={`bg-white rounded-xl border p-4 transition-all duration-300 ${flash ? "border-emerald-300 bg-emerald-50/30" : "border-gray-100"}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 flex items-center justify-center rounded-xl ${flash ? "bg-emerald-100" : bg}`}>
          <i className={`${icon} ${flash ? "text-emerald-600" : color} text-base`}></i>
        </div>
        <div className="flex items-center gap-1.5">
          {liveCount !== undefined && liveCount > 0 && (
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
              +{liveCount}
            </span>
          )}
          {isLive !== undefined ? (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${isLive ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
              {isLive ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> مباشر</> : "متوقف"}
            </span>
          ) : (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
              <i className={`${trendUp ? "ri-arrow-up-line" : "ri-arrow-down-line"} text-[10px]`}></i>
              {trend}
            </span>
          )}
        </div>
      </div>
      <p className={`text-2xl font-black mb-0.5 transition-colors ${flash ? "text-emerald-700" : "text-gray-900"}`}>{value}</p>
      <p className="text-xs font-semibold text-gray-600">{label}</p>
      <p className={`text-[10px] mt-0.5 ${flash ? "text-emerald-600 font-medium" : "text-gray-400"}`}>{sub}</p>
    </div>
  );
}

// ─── Breakdown Row ────────────────────────────────────────────────────────────
function BreakdownRow({ label, count, pct, colorIdx }: { label: string; count: number; pct: number; colorIdx: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-700 truncate flex-1 ml-2">{label}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-bold text-gray-800">{count}</span>
          <span className="text-[10px] text-gray-400 w-8 text-left">{pct}%</span>
        </div>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: COLORS[colorIdx % COLORS.length] }}></div>
      </div>
    </div>
  );
}
