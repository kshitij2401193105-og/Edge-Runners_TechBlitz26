"use client";
import { useState } from "react";

// ── Supabase: doctor's availability settings ──────────────────────────────
// supabase.from("availability").select("*").eq("doctor_id", doctorId)
// supabase.from("availability").upsert({ doctor_id, day_of_week, start_time, end_time, slot_duration })
// ─────────────────────────────────────────────────────────────────────────

function generateSlots(start: string, end: string, duration: number): string[] {
  const slots: string[] = [];
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let current = sh * 60 + sm;
  const endMin = eh * 60 + em;
  while (current < endMin) {
    const h = Math.floor(current / 60).toString().padStart(2, "0");
    const m = (current % 60).toString().padStart(2, "0");
    slots.push(`${h}:${m}`);
    current += duration;
  }
  return slots;
}

const BOOKED = ["09:00", "09:30", "10:00", "14:15"];

export default function DoctorSchedule() {
  const [morningStart, setMorningStart] = useState("09:00");
  const [morningEnd, setMorningEnd] = useState("13:00");
  const [eveningStart, setEveningStart] = useState("14:00");
  const [eveningEnd, setEveningEnd] = useState("18:00");
  const [duration, setDuration] = useState(15);

  const morningSlots = generateSlots(morningStart, morningEnd, duration);
  const eveningSlots = generateSlots(eveningStart, eveningEnd, duration);
  const allSlots = [...morningSlots, ...eveningSlots];

  const free = allSlots.filter(s => !BOOKED.includes(s)).length;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-light text-slate-900">My Schedule Settings</h1>
        <p className="text-slate-500 text-sm">Configure your working hours and slot duration</p>
      </div>

      {/* Settings card */}
      <div className="bg-card border rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">Working Hours</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium">Morning Start</label>
            <input type="time" value={morningStart} onChange={e => setMorningStart(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium">Morning End</label>
            <input type="time" value={morningEnd} onChange={e => setMorningEnd(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium">Afternoon Start</label>
            <input type="time" value={eveningStart} onChange={e => setEveningStart(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium">Afternoon End</label>
            <input type="time" value={eveningEnd} onChange={e => setEveningEnd(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400" />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-500 mb-2 block font-medium">Slot Duration: <strong className="text-slate-800">{duration} min</strong></label>
          <div className="flex gap-2">
            {[10, 15, 20, 30].map(d => (
              <button key={d} onClick={() => setDuration(d)}
                className={`px-4 py-1.5 rounded-lg text-sm border transition-all ${
                  duration === d ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-600 hover:border-blue-300"
                }`}>
                {d} min
              </button>
            ))}
          </div>
        </div>

        <button className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors">
          Save Settings
        </button>
      </div>

      {/* Generated slots preview */}
      <div className="bg-card border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-800">Generated Slots Preview</h2>
          <div className="flex gap-3 text-xs text-slate-500">
            <span className="text-emerald-600 font-medium">{free} free</span>
            <span>·</span>
            <span className="text-blue-600 font-medium">{BOOKED.length} booked</span>
            <span>·</span>
            <span>{allSlots.length} total</span>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs font-medium text-slate-500 mb-2">Morning</p>
          <div className="flex flex-wrap gap-2">
            {morningSlots.map(s => (
              <span key={s} className={BOOKED.includes(s) ? "slot-booked" : "slot-free"}>{s}</span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-500 mb-2">Afternoon</p>
          <div className="flex flex-wrap gap-2">
            {eveningSlots.map(s => (
              <span key={s} className={BOOKED.includes(s) ? "slot-booked" : "slot-free"}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
