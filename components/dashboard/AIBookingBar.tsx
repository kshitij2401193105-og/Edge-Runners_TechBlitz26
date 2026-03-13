"use client";
import { useState } from "react";

// ── AI Booking Integration ────────────────────────────────────────────────
// POST to /api/ai-book with { text }
// The API calls OpenAI (or Claude) to parse natural language into structured JSON
// then creates the appointment via Supabase
// ─────────────────────────────────────────────────────────────────────────

export function AIBookingBar() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { patient_name: string; doctor: string; date: string; time: string }>(null);
  const [error, setError] = useState("");

  async function handleParse() {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    // ── Replace with real API call ──────────────────────────────────────
    // const res = await fetch("/api/ai-book", { method: "POST", body: JSON.stringify({ text }), headers: { "Content-Type": "application/json" } });
    // const data = await res.json();
    // setResult(data.appointment);
    // ────────────────────────────────────────────────────────────────────

    // Demo parse
    await new Promise(r => setTimeout(r, 1200));
    const parsed = demoParseText(text);
    if (parsed) {
      setResult(parsed);
    } else {
      setError("Could not parse. Try: 'Book Rahul with Dr Sharma tomorrow at 10am'");
    }
    setLoading(false);
  }

  function demoParseText(input: string) {
    const lower = input.toLowerCase();
    const doctorMatch = lower.match(/dr\.?\s*(\w+)/i);
    const words = input.split(" ");
    const patientName = words[1] || "Patient";
    const tomorrowMentioned = lower.includes("tomorrow");
    const timeMentions: Record<string, string> = {
      morning: "09:00", afternoon: "14:00", evening: "17:00",
    };
    const timeKey = Object.keys(timeMentions).find(k => lower.includes(k));
    const timeMatch = lower.match(/(\d{1,2}(?::\d{2})?)\s*(?:am|pm)/);

    return {
      patient_name: patientName,
      doctor: doctorMatch ? `Dr. ${doctorMatch[1].charAt(0).toUpperCase() + doctorMatch[1].slice(1)}` : "Dr. Sharma",
      date: tomorrowMentioned ? "Tomorrow" : "Today",
      time: timeMatch ? timeMatch[0] : (timeKey ? timeMentions[timeKey] : "09:00"),
    };
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🤖</span>
        <h3 className="text-sm font-semibold text-slate-800">AI Booking</h3>
        <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">Beta</span>
      </div>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleParse()}
          placeholder='Try: "Book Rahul with Dr Sharma tomorrow morning"'
          className="flex-1 bg-white border border-blue-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition-all"
        />
        <button
          onClick={handleParse}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 whitespace-nowrap">
          {loading ? "Parsing…" : "Parse & Book"}
        </button>
      </div>

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

      {result && (
        <div className="mt-3 bg-white border border-green-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex gap-4 text-sm">
            <span><span className="text-slate-500 text-xs">Patient</span><br /><strong>{result.patient_name}</strong></span>
            <span><span className="text-slate-500 text-xs">Doctor</span><br /><strong>{result.doctor}</strong></span>
            <span><span className="text-slate-500 text-xs">Date</span><br /><strong>{result.date}</strong></span>
            <span><span className="text-slate-500 text-xs">Time</span><br /><strong>{result.time}</strong></span>
          </div>
          <button className="bg-green-600 hover:bg-green-500 text-white text-xs px-4 py-2 rounded-lg font-medium transition-colors">
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}
