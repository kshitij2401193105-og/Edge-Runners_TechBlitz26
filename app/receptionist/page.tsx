"use client";
import { useState } from "react";
import { QuickBookModal } from "@/components/modals/QuickBookModal";
import { AIBookingBar } from "@/components/dashboard/AIBookingBar";
import { format } from "date-fns";

// ── Replace with Supabase queries ─────────────────────────────────────────
// import { createClient } from "@/lib/supabase/client";
// const { data: appointments } = await supabase.from("appointments")
//   .select("*, patients(*), doctors(*)")
//   .gte("start_time", today)
//   .lte("start_time", tomorrow);
// ─────────────────────────────────────────────────────────────────────────

const DEMO_APPOINTMENTS = [
  { id: 1, patient: "Rahul Mehta", doctor: "Dr. Sharma", time: "09:00", status: "confirmed", type: "General" },
  { id: 2, patient: "Priya Kapoor", doctor: "Dr. Patel", time: "09:15", status: "confirmed", type: "Follow-up" },
  { id: 3, patient: "Amit Singh", doctor: "Dr. Sharma", time: "09:30", status: "cancelled", type: "Consultation" },
  { id: 4, patient: "Walk-in", doctor: "Dr. Iyer", time: "10:00", status: "walkin", type: "Walk-in" },
  { id: 5, patient: "Neha Gupta", doctor: "Dr. Patel", time: "10:15", status: "confirmed", type: "General" },
];

const STATS = [
  { label: "Today's Appointments", value: "24", delta: "+3 from yesterday", color: "text-blue-600" },
  { label: "Cancellations", value: "2", delta: "1 slot freed", color: "text-amber-600" },
  { label: "Walk-ins", value: "4", delta: "Queue: 2 waiting", color: "text-emerald-600" },
  { label: "Avg Wait Time", value: "11 min", delta: "Good", color: "text-slate-600" },
];

export default function ReceptionistDashboard() {
  const [showQuickBook, setShowQuickBook] = useState(false);
  const today = format(new Date(), "EEEE, d MMMM yyyy");

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-light text-slate-900">Good morning, Sarah</h1>
          <p className="text-slate-500 text-sm mt-0.5">{today}</p>
        </div>
        <button
          onClick={() => setShowQuickBook(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
          <span className="text-base leading-none">+</span>
          Quick Appointment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map(stat => (
          <div key={stat.label} className="stat-card">
            <p className="text-slate-500 text-xs mb-1">{stat.label}</p>
            <p className={`text-2xl font-semibold ${stat.color} mb-0.5`}>{stat.value}</p>
            <p className="text-slate-400 text-xs">{stat.delta}</p>
          </div>
        ))}
      </div>

      {/* AI Booking Bar */}
      <AIBookingBar />

      {/* Today's appointments */}
      <div className="bg-card border rounded-xl overflow-hidden mt-6">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-semibold text-slate-900 text-sm">Today's Schedule</h2>
          <span className="text-xs text-slate-500">{DEMO_APPOINTMENTS.length} appointments</span>
        </div>
        <div className="divide-y">
          {DEMO_APPOINTMENTS.map(appt => (
            <AppointmentRow key={appt.id} appt={appt} />
          ))}
        </div>
      </div>

      {/* Walk-in queue */}
      <WalkInQueue />

      {showQuickBook && <QuickBookModal onClose={() => setShowQuickBook(false)} />}
    </div>
  );
}

function AppointmentRow({ appt }: { appt: typeof DEMO_APPOINTMENTS[0] }) {
  const statusMap: Record<string, string> = {
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    cancelled: "bg-red-50 text-red-600 border-red-200",
    walkin: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-4">
        <span className="text-slate-400 text-sm font-mono w-12">{appt.time}</span>
        <div>
          <p className="text-sm font-medium text-slate-900">{appt.patient}</p>
          <p className="text-xs text-slate-500">{appt.doctor} · {appt.type}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-[11px] font-medium border px-2.5 py-0.5 rounded-full capitalize ${statusMap[appt.status]}`}>
          {appt.status}
        </span>
        {appt.status === "confirmed" && (
          <button className="text-xs text-red-500 hover:text-red-700 transition-colors">Cancel</button>
        )}
      </div>
    </div>
  );
}

function WalkInQueue() {
  const queue = [
    { name: "Walk-in Patient 1", since: "09:45", wait: "~12 min" },
    { name: "Walk-in Patient 2", since: "10:02", wait: "~24 min" },
  ];

  return (
    <div className="bg-card border rounded-xl overflow-hidden mt-4">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-slate-900 text-sm">Walk-in Queue</h2>
          <span className="bg-amber-100 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {queue.length} waiting
          </span>
        </div>
        <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">+ Add Walk-in</button>
      </div>
      <div className="divide-y">
        {queue.map((p, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs text-slate-500 font-semibold">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-800">{p.name}</p>
                <p className="text-xs text-slate-500">Arrived {p.since}</p>
              </div>
            </div>
            <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">{p.wait}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
