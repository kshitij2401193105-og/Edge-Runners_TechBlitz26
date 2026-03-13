"use client";
import { useState } from "react";

// ── Supabase Integration ──────────────────────────────────────────────────
// import { createClient } from "@/lib/supabase/client";
// const supabase = createClient();
// Fetch doctors: supabase.from("doctors").select("*")
// Fetch patients: supabase.from("patients").select("*").ilike("name", `%${search}%`)
// Fetch slots: supabase.from("appointments").select("start_time").eq("doctor_id", doctorId).eq("date", date)
// Book: supabase.from("appointments").insert({ doctor_id, patient_id, start_time, end_time, status: "confirmed" })
// ─────────────────────────────────────────────────────────────────────────

const DEMO_DOCTORS = ["Dr. Sharma", "Dr. Patel", "Dr. Iyer", "Dr. Mehta"];
const DEMO_PATIENTS = ["Rahul Mehta", "Priya Kapoor", "Amit Singh", "Neha Gupta", "Ravi Verma"];
const DEMO_SLOTS = ["09:00", "09:15", "09:30", "10:00", "10:15", "10:30", "11:00", "11:15"];
const BOOKED_SLOTS = ["09:15", "10:00"];
const FREED_SLOTS = ["10:30"];

interface QuickBookModalProps {
  onClose: () => void;
}

export function QuickBookModal({ onClose }: QuickBookModalProps) {
  const [step, setStep] = useState<"select" | "confirm">("select");
  const [patient, setPatient] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [doctor, setDoctor] = useState("");
  const [slot, setSlot] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [booked, setBooked] = useState(false);

  const filteredPatients = DEMO_PATIENTS.filter(p =>
    p.toLowerCase().includes(patientSearch.toLowerCase())
  );

  function handleBook() {
    // ── Supabase insert ──────────────────────────────────────────────────
    // await supabase.from("appointments").insert({
    //   doctor_id: doctorId, patient_id: patientId,
    //   start_time: `${date}T${slot}:00`, end_time: `${date}T${endSlot}:00`, status: "confirmed"
    // });
    setBooked(true);
    setTimeout(onClose, 1800);
  }

  const canProceed = patient && doctor && slot;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-slate-900">Quick Appointment</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {booked ? (
          <div className="p-10 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-semibold text-slate-900 mb-1">Appointment Booked!</p>
            <p className="text-slate-500 text-sm">{patient} with {doctor} at {slot}</p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Patient search */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Patient</label>
              {patient ? (
                <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium text-blue-800">{patient}</span>
                  <button onClick={() => setPatient("")} className="text-blue-400 hover:text-blue-600 text-xs">Change</button>
                </div>
              ) : (
                <div>
                  <input
                    value={patientSearch}
                    onChange={e => setPatientSearch(e.target.value)}
                    placeholder="Search patient name…"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 mb-2"
                  />
                  {patientSearch && (
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      {filteredPatients.map(p => (
                        <button key={p}
                          onClick={() => { setPatient(p); setPatientSearch(""); }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 border-b last:border-0 transition-colors">
                          {p}
                        </button>
                      ))}
                      <button
                        onClick={() => { setPatient("New Patient"); setPatientSearch(""); }}
                        className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium">
                        + Create "{patientSearch}"
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Doctor */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Doctor</label>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_DOCTORS.map(d => (
                  <button key={d}
                    onClick={() => setDoctor(d)}
                    className={`py-2 px-3 rounded-lg border text-sm transition-all ${
                      doctor === d
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-slate-200 text-slate-700 hover:border-blue-300"
                    }`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400"
              />
            </div>

            {/* Slots */}
            {doctor && (
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">Available Slots</label>
                <div className="flex flex-wrap gap-2">
                  {DEMO_SLOTS.map(s => {
                    const isBooked = BOOKED_SLOTS.includes(s);
                    const isFreed = FREED_SLOTS.includes(s);
                    if (isBooked) return (
                      <span key={s} className="slot-booked opacity-50 cursor-not-allowed">{s}</span>
                    );
                    if (isFreed) return (
                      <button key={s}
                        onClick={() => setSlot(s)}
                        className={`slot-freed ${slot === s ? "ring-2 ring-amber-500" : ""}`}>
                        {s} ✦
                      </button>
                    );
                    return (
                      <button key={s}
                        onClick={() => setSlot(s)}
                        className={`slot-free ${slot === s ? "ring-2 ring-emerald-500 bg-emerald-100" : ""}`}>
                        {s}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-3 mt-2 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-400 rounded-full" />Free</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-400 rounded-full" />Booked</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400 rounded-full" />Recently freed</span>
                </div>
              </div>
            )}

            <button
              onClick={handleBook}
              disabled={!canProceed}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-40">
              Confirm Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
