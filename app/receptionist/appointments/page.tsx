"use client";
import { useState } from "react";

// ── Supabase Query ────────────────────────────────────────────────────────
// const { data } = await supabase.from("appointments")
//   .select("*, patients(name, phone), doctors(name, specialty)")
//   .order("start_time");
// ─────────────────────────────────────────────────────────────────────────

const ALL_APPOINTMENTS = [
  { id: 1, patient: "Rahul Mehta", phone: "9876543210", doctor: "Dr. Sharma", date: "2024-01-15", time: "09:00", status: "confirmed", type: "General" },
  { id: 2, patient: "Priya Kapoor", phone: "9123456789", doctor: "Dr. Patel", date: "2024-01-15", time: "09:15", status: "confirmed", type: "Follow-up" },
  { id: 3, patient: "Amit Singh", phone: "9988776655", doctor: "Dr. Sharma", date: "2024-01-15", time: "09:30", status: "cancelled", type: "Consultation" },
  { id: 4, patient: "Neha Gupta", phone: "9112233445", doctor: "Dr. Patel", date: "2024-01-16", time: "10:00", status: "confirmed", type: "General" },
  { id: 5, patient: "Ravi Verma", phone: "9876501234", doctor: "Dr. Iyer", date: "2024-01-16", time: "11:15", status: "confirmed", type: "Specialist" },
];

const statusStyle: Record<string, string> = {
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
  completed: "bg-green-50 text-green-700 border-green-200",
};

export default function AppointmentsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = ALL_APPOINTMENTS.filter(a => {
    const matchSearch = a.patient.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || a.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-light text-slate-900">Appointments</h1>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          + New Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search patient or doctor…"
          className="flex-1 border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400"
        />
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-1">
          {["all", "confirmed", "cancelled"].map(f => (
            <button key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                filter === f ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-700"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Patient</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Doctor</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date & Time</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(appt => (
              <tr key={appt.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="text-sm font-medium text-slate-900">{appt.patient}</p>
                  <p className="text-xs text-slate-500">{appt.phone}</p>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-700">{appt.doctor}</td>
                <td className="px-5 py-3.5">
                  <p className="text-sm text-slate-700">{appt.date}</p>
                  <p className="text-xs text-slate-500 font-mono">{appt.time}</p>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-600">{appt.type}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-[11px] font-medium border px-2.5 py-0.5 rounded-full ${statusStyle[appt.status]}`}>
                    {appt.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2 justify-end">
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">Reschedule</button>
                    {appt.status === "confirmed" && (
                      <button className="text-xs text-red-500 hover:text-red-700">Cancel</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No appointments found</div>
        )}
      </div>
    </div>
  );
}
