"use client";
import { useState } from "react";
import { format, addDays } from "date-fns";

// ── Supabase: fetch appointments per doctor per day ───────────────────────
// supabase.from("appointments").select("*, patients(name)")
//   .eq("doctor_id", doctorId).gte("start_time", dayStart).lte("start_time", dayEnd)
// ─────────────────────────────────────────────────────────────────────────

const HOURS = ["09", "10", "11", "12", "13", "14", "15", "16", "17"];
const DOCTORS = ["Dr. Sharma", "Dr. Patel", "Dr. Iyer", "Dr. Mehta"];

const DEMO_EVENTS: Record<string, { time: string; patient: string; type: string; status: string }[]> = {
  "Dr. Sharma": [
    { time: "09:00", patient: "Rahul Mehta", type: "General", status: "confirmed" },
    { time: "09:15", patient: "Priya Kapoor", type: "Follow-up", status: "confirmed" },
    { time: "10:30", patient: "Recently Freed", type: "", status: "freed" },
    { time: "11:00", patient: "Amit Singh", type: "Consultation", status: "confirmed" },
  ],
  "Dr. Patel": [
    { time: "09:00", patient: "Neha Gupta", type: "General", status: "confirmed" },
    { time: "10:00", patient: "Ravi Verma", type: "Specialist", status: "confirmed" },
    { time: "14:00", patient: "Kavya Reddy", type: "Follow-up", status: "confirmed" },
  ],
  "Dr. Iyer": [
    { time: "09:30", patient: "Walk-in", type: "Walk-in", status: "walkin" },
    { time: "11:00", patient: "Mohan Das", type: "General", status: "confirmed" },
  ],
  "Dr. Mehta": [
    { time: "10:00", patient: "Sunita Rao", type: "Consultation", status: "confirmed" },
    { time: "15:00", patient: "Arun Kumar", type: "General", status: "confirmed" },
  ],
};

function timeToOffset(time: string) {
  const [h, m] = time.split(":").map(Number);
  return ((h - 9) * 60 + m) * (56 / 60); // px per minute, 56px per hour
}

const statusColor: Record<string, string> = {
  confirmed: "bg-blue-100 border-blue-300 text-blue-800",
  freed: "bg-amber-100 border-amber-400 text-amber-800 animate-pulse",
  walkin: "bg-violet-100 border-violet-300 text-violet-800",
};

export default function CalendarPage() {
  const [selectedDoctor, setSelectedDoctor] = useState("All");
  const today = new Date();

  const displayDoctors = selectedDoctor === "All" ? DOCTORS : [selectedDoctor];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-light text-slate-900">Schedule Board</h1>
          <p className="text-slate-500 text-sm">{format(today, "EEEE, d MMMM yyyy")}</p>
        </div>
        <select
          value={selectedDoctor}
          onChange={e => setSelectedDoctor(e.target.value)}
          className="border border-slate-200 bg-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30">
          <option value="All">All Doctors</option>
          {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-5 text-xs">
        {[
          { label: "Confirmed", cls: "bg-blue-100 border border-blue-300" },
          { label: "Recently Freed", cls: "bg-amber-100 border border-amber-400" },
          { label: "Walk-in", cls: "bg-violet-100 border border-violet-300" },
          { label: "Free Slot", cls: "bg-slate-100 border border-slate-200" },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded ${l.cls}`} />
            <span className="text-slate-500">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="bg-card border rounded-xl overflow-hidden">
        {/* Doctor header */}
        <div className="grid border-b" style={{ gridTemplateColumns: `80px repeat(${displayDoctors.length}, 1fr)` }}>
          <div className="p-3 border-r bg-slate-50" />
          {displayDoctors.map(doc => (
            <div key={doc} className="p-3 text-center border-r last:border-0 bg-slate-50">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold mx-auto mb-1">
                {doc.split(" ").pop()?.charAt(0)}
              </div>
              <p className="text-xs font-semibold text-slate-700">{doc}</p>
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="grid" style={{ gridTemplateColumns: `80px repeat(${displayDoctors.length}, 1fr)` }}>
          {/* Time column */}
          <div className="border-r">
            {HOURS.map(h => (
              <div key={h} className="h-14 border-b flex items-start justify-end pr-3 pt-1">
                <span className="text-xs text-slate-400 font-mono">{h}:00</span>
              </div>
            ))}
          </div>

          {/* Doctor columns */}
          {displayDoctors.map(doc => {
            const events = DEMO_EVENTS[doc] || [];
            return (
              <div key={doc} className="border-r last:border-0 relative">
                {HOURS.map(h => (
                  <div key={h} className="h-14 border-b border-slate-100 hover:bg-blue-50/30 transition-colors cursor-pointer" />
                ))}
                {/* Events */}
                {events.map((ev, i) => (
                  <div
                    key={i}
                    className={`absolute left-1 right-1 rounded-lg border px-2 py-1 text-[10px] font-medium ${statusColor[ev.status] || statusColor.confirmed}`}
                    style={{ top: `${timeToOffset(ev.time)}px`, height: "48px" }}>
                    <p className="font-semibold truncate">{ev.patient}</p>
                    <p className="opacity-70">{ev.time} {ev.type && `· ${ev.type}`}</p>
                    {ev.status === "freed" && <p className="text-amber-600 font-bold">✦ Recently freed</p>}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
