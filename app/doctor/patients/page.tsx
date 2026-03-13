"use client";
import { useState } from "react";

const PATIENTS = [
  { id: 1, name: "Rahul Mehta", age: 34, lastDiagnosis: "Hypertension", lastVisit: "2024-01-10", nextVisit: "2024-01-15", status: "Active" },
  { id: 2, name: "Priya Kapoor", age: 28, lastDiagnosis: "Post-op recovery", lastVisit: "2024-01-14", nextVisit: "2024-01-21", status: "Follow-up" },
  { id: 3, name: "Amit Singh", age: 45, lastDiagnosis: "Type 2 Diabetes", lastVisit: "2024-01-08", nextVisit: null, status: "Active" },
  { id: 4, name: "Neha Gupta", age: 31, lastDiagnosis: "Annual Checkup", lastVisit: "2024-01-13", nextVisit: "2024-01-15", status: "Routine" },
];

export default function DoctorPatients() {
  const [selected, setSelected] = useState<typeof PATIENTS[0] | null>(null);

  return (
    <div className="p-6 max-w-5xl mx-auto flex gap-5">
      {/* Patient list */}
      <div className="flex-1">
        <h1 className="text-2xl font-light text-slate-900 mb-6">My Patients</h1>
        <div className="space-y-3">
          {PATIENTS.map(p => (
            <div key={p.id}
              onClick={() => setSelected(p)}
              className={`bg-card border rounded-xl p-4 cursor-pointer transition-all hover:border-blue-300 ${
                selected?.id === p.id ? "border-blue-400 bg-blue-50/30" : ""
              }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{p.name}</p>
                    <p className="text-xs text-slate-500">Age {p.age} · {p.lastDiagnosis}</p>
                  </div>
                </div>
                <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                  p.status === "Follow-up" ? "bg-amber-100 text-amber-700" :
                  p.status === "Active" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
                }`}>{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patient detail panel */}
      {selected ? (
        <div className="w-72 shrink-0">
          <div className="bg-card border rounded-xl overflow-hidden sticky top-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-semibold mb-3">
                {selected.name.charAt(0)}
              </div>
              <h3 className="font-semibold text-lg">{selected.name}</h3>
              <p className="text-blue-200 text-sm">Age {selected.age}</p>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Last Diagnosis</p>
                <p className="text-sm font-medium text-slate-800">{selected.lastDiagnosis}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Last Visit</p>
                <p className="text-sm text-slate-700">{selected.lastVisit}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Next Appointment</p>
                <p className="text-sm text-slate-700">{selected.nextVisit || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Status</p>
                <p className="text-sm font-medium text-slate-800">{selected.status}</p>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                View Full Record
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-72 shrink-0 bg-slate-100 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-sm">
          Select a patient
        </div>
      )}
    </div>
  );
}
