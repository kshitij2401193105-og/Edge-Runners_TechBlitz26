"use client";
import { useState } from "react";

// ── Supabase: supabase.from("patients").select("*").ilike("name", `%${search}%`) ──

const PATIENTS = [
  { id: 1, name: "Rahul Mehta", phone: "9876543210", email: "rahul@email.com", age: 34, lastVisit: "2024-01-10", totalVisits: 8 },
  { id: 2, name: "Priya Kapoor", phone: "9123456789", email: "priya@email.com", age: 28, lastVisit: "2024-01-14", totalVisits: 3 },
  { id: 3, name: "Amit Singh", phone: "9988776655", email: "amit@email.com", age: 45, lastVisit: "2024-01-08", totalVisits: 12 },
  { id: 4, name: "Neha Gupta", phone: "9112233445", email: "neha@email.com", age: 31, lastVisit: "2024-01-13", totalVisits: 5 },
];

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", age: "" });

  const filtered = PATIENTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  function handleAddPatient(e: React.FormEvent) {
    e.preventDefault();
    // ── Supabase insert ──────────────────────────────────────────────────
    // await supabase.from("patients").insert({ name: form.name, phone: form.phone, email: form.email });
    setShowAdd(false);
    setForm({ name: "", phone: "", email: "", age: "" });
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-light text-slate-900">Patients</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          + Add Patient
        </button>
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by name, phone, or email…"
        className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 mb-5"
      />

      <div className="grid gap-3">
        {filtered.map(patient => (
          <div key={patient.id} className="bg-card border rounded-xl px-5 py-4 flex items-center justify-between hover:border-blue-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
                {patient.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-slate-900 text-sm">{patient.name}</p>
                <p className="text-xs text-slate-500">{patient.phone} · {patient.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-8 text-right">
              <div>
                <p className="text-xs text-slate-400">Age</p>
                <p className="text-sm font-medium text-slate-700">{patient.age}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Last Visit</p>
                <p className="text-sm font-medium text-slate-700">{patient.lastVisit}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Visits</p>
                <p className="text-sm font-medium text-slate-700">{patient.totalVisits}</p>
              </div>
              <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                Book Appt
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Patient Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-slate-900">New Patient</h2>
              <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddPatient} className="p-5 space-y-4">
              {[
                { label: "Full Name", key: "name", type: "text", placeholder: "e.g. Rahul Mehta" },
                { label: "Phone", key: "phone", type: "tel", placeholder: "10-digit mobile number" },
                { label: "Email", key: "email", type: "email", placeholder: "optional" },
                { label: "Age", key: "age", type: "number", placeholder: "" },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">{field.label}</label>
                  <input
                    type={field.type}
                    value={form[field.key as keyof typeof form]}
                    onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400"
                  />
                </div>
              ))}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-medium text-sm transition-colors">
                Create Patient
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
