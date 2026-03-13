"use client";

// ── Supabase Analytics Queries ────────────────────────────────────────────
// Today's count: supabase.from("appointments").select("count", { count: "exact" }).gte("start_time", todayStart)
// Cancellations: .eq("status", "cancelled")
// Busiest slots: .select("start_time").order("start_time") → aggregate by hour
// ─────────────────────────────────────────────────────────────────────────

const HOURLY_DATA = [
  { hour: "09:00", count: 6 },
  { hour: "10:00", count: 8 },
  { hour: "11:00", count: 5 },
  { hour: "12:00", count: 3 },
  { hour: "13:00", count: 2 },
  { hour: "14:00", count: 7 },
  { hour: "15:00", count: 9 },
  { hour: "16:00", count: 4 },
  { hour: "17:00", count: 2 },
];

const DOCTOR_STATS = [
  { name: "Dr. Sharma", total: 9, cancelled: 1, completed: 7 },
  { name: "Dr. Patel", total: 8, cancelled: 0, completed: 6 },
  { name: "Dr. Iyer", total: 5, cancelled: 1, completed: 3 },
  { name: "Dr. Mehta", total: 6, cancelled: 0, completed: 5 },
];

const max = Math.max(...HOURLY_DATA.map(d => d.count));

export default function AnalyticsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-light text-slate-900">Analytics</h1>
        <p className="text-slate-500 text-sm">Clinic performance overview · Today</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Appointments", value: "28", change: "+12%", up: true },
          { label: "Cancellations", value: "2", change: "-33%", up: false },
          { label: "Walk-ins", value: "4", change: "+1", up: true },
          { label: "Avg Duration", value: "15 min", change: "On target", up: true },
        ].map(stat => (
          <div key={stat.label} className="stat-card">
            <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-semibold text-slate-900 mb-1">{stat.value}</p>
            <p className={`text-xs font-medium ${stat.up ? "text-emerald-600" : "text-red-500"}`}>{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Hourly chart */}
      <div className="bg-card border rounded-xl p-5 mb-4">
        <h2 className="text-sm font-semibold text-slate-800 mb-5">Appointments by Hour</h2>
        <div className="flex items-end gap-2 h-32">
          {HOURLY_DATA.map(d => (
            <div key={d.hour} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-slate-500 font-semibold">{d.count}</span>
              <div
                className="w-full bg-blue-500 rounded-t-md transition-all"
                style={{ height: `${(d.count / max) * 100}%`, minHeight: "4px" }}
              />
              <span className="text-[9px] text-slate-400 rotate-45 origin-left translate-y-2">{d.hour}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor breakdown */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="text-sm font-semibold text-slate-800">Doctor Performance</h2>
        </div>
        <div className="divide-y">
          {DOCTOR_STATS.map(doc => (
            <div key={doc.name} className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold">
                  {doc.name.split(" ").pop()?.charAt(0)}
                </div>
                <span className="text-sm font-medium text-slate-800">{doc.name}</span>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-xs text-slate-400">Total</p>
                  <p className="font-semibold text-slate-900">{doc.total}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400">Cancelled</p>
                  <p className={`font-semibold ${doc.cancelled > 0 ? "text-red-500" : "text-slate-400"}`}>{doc.cancelled}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400">Completed</p>
                  <p className="font-semibold text-emerald-600">{doc.completed}</p>
                </div>
                <div className="w-24">
                  <p className="text-xs text-slate-400 mb-1">Fill rate</p>
                  <div className="bg-slate-100 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${(doc.completed / doc.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
