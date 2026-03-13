"use client";

// ── Supabase: fetch today's appointments for the logged-in doctor ─────────
// const { data: { user } } = await supabase.auth.getUser();
// const { data: doctor } = await supabase.from("doctors").select("*").eq("user_id", user.id).single();
// const { data: appointments } = await supabase.from("appointments")
//   .select("*, patients(*)").eq("doctor_id", doctor.id)
//   .gte("start_time", todayStart).lte("start_time", todayEnd).order("start_time");
// ─────────────────────────────────────────────────────────────────────────

const TODAY_APPTS = [
  { id: 1, time: "09:00", patient: "Rahul Mehta", age: 34, type: "General Consultation", status: "upcoming", notes: "BP check, follow-up" },
  { id: 2, time: "09:15", patient: "Priya Kapoor", age: 28, type: "Follow-up", status: "in-progress", notes: "Post-op review" },
  { id: 3, time: "09:30", patient: "Amit Singh", age: 45, type: "Consultation", status: "completed", notes: "Diabetes management" },
  { id: 4, time: "10:00", patient: "Neha Gupta", age: 31, type: "General", status: "upcoming", notes: "Annual checkup" },
  { id: 5, time: "10:15", patient: "Ravi Verma", age: 52, type: "Specialist", status: "upcoming", notes: "Cardiology referral" },
];

const statusBadge: Record<string, string> = {
  upcoming: "bg-slate-100 text-slate-600",
  "in-progress": "bg-blue-100 text-blue-700 animate-pulse",
  completed: "bg-green-100 text-green-700",
};

export default function DoctorDashboard() {
  const next = TODAY_APPTS.find(a => a.status === "in-progress" || a.status === "upcoming");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-light text-slate-900">Good morning, Dr. Sharma</h1>
        <p className="text-slate-500 text-sm">Monday, 15 January 2024</p>
      </div>

      {/* Next patient banner */}
      {next && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white mb-6">
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
            {next.status === "in-progress" ? "Current Patient" : "Next Patient"}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-0.5">{next.patient}</h2>
              <p className="text-blue-200 text-sm">{next.type} · Age {next.age}</p>
              {next.notes && <p className="text-blue-300 text-xs mt-1 italic">"{next.notes}"</p>}
            </div>
            <div className="text-right">
              <p className="text-3xl font-light">{next.time}</p>
              {next.status === "in-progress" && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">In session</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="stat-card text-center">
          <p className="text-3xl font-semibold text-blue-600">12</p>
          <p className="text-xs text-slate-500 mt-0.5">Today's Patients</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-3xl font-semibold text-emerald-600">3</p>
          <p className="text-xs text-slate-500 mt-0.5">Completed</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-3xl font-semibold text-slate-600">9</p>
          <p className="text-xs text-slate-500 mt-0.5">Remaining</p>
        </div>
      </div>

      {/* Today's schedule */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="text-sm font-semibold text-slate-900">Today's Schedule</h2>
        </div>
        <div className="divide-y">
          {TODAY_APPTS.map(appt => (
            <div key={appt.id} className={`flex items-center justify-between px-5 py-4 transition-colors ${
              appt.status === "in-progress" ? "bg-blue-50" : "hover:bg-slate-50"
            }`}>
              <div className="flex items-center gap-4">
                <span className="text-slate-400 font-mono text-sm w-12">{appt.time}</span>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white text-sm font-semibold">
                  {appt.patient.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{appt.patient}</p>
                  <p className="text-xs text-slate-500">{appt.type} · Age {appt.age}</p>
                  {appt.notes && <p className="text-xs text-slate-400 italic">{appt.notes}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize ${statusBadge[appt.status]}`}>
                  {appt.status}
                </span>
                {appt.status !== "completed" && (
                  <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">View Details</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
