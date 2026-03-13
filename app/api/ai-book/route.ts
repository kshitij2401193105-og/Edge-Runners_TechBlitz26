import { NextRequest, NextResponse } from "next/server";

/**
 * AI Natural Language Booking
 *
 * To use OpenAI/Claude API:
 * 1. Set OPENAI_API_KEY (or ANTHROPIC_API_KEY) in .env.local
 * 2. Uncomment the relevant block below
 * 3. Remove the demo parser
 */

const SYSTEM_PROMPT = `You are a medical clinic scheduling assistant.
Parse the user's natural language booking request and return ONLY valid JSON.
No extra text. Return this exact structure:
{
  "patient_name": string,
  "doctor": string,
  "date": string (YYYY-MM-DD or "today" or "tomorrow"),
  "time": string (HH:MM 24h),
  "notes": string (optional)
}
Rules:
- "morning" = 09:00, "afternoon" = 14:00, "evening" = 17:00
- Today's date context is provided in the user message
- If doctor is mentioned as "Dr X" or "Doctor X", normalize to "Dr. X"
- If info is missing, use sensible defaults`;

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text?.trim()) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  // ── OPENAI (uncomment to use) ──────────────────────────────────────────
  // const res = await fetch("https://api.openai.com/v1/chat/completions", {
  //   method: "POST",
  //   headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     model: "gpt-4o-mini",
  //     messages: [
  //       { role: "system", content: SYSTEM_PROMPT },
  //       { role: "user", content: `Today is ${new Date().toISOString().split("T")[0]}. Parse: "${text}"` },
  //     ],
  //     response_format: { type: "json_object" },
  //   }),
  // });
  // const data = await res.json();
  // const appointment = JSON.parse(data.choices[0].message.content);
  // return NextResponse.json({ appointment });
  // ────────────────────────────────────────────────────────────────────────

  // ── ANTHROPIC (uncomment to use) ─────────────────────────────────────
  // const res = await fetch("https://api.anthropic.com/v1/messages", {
  //   method: "POST",
  //   headers: { "x-api-key": process.env.ANTHROPIC_API_KEY!, "anthropic-version": "2023-06-01", "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     model: "claude-haiku-4-5",
  //     max_tokens: 200,
  //     system: SYSTEM_PROMPT,
  //     messages: [{ role: "user", content: `Today is ${new Date().toISOString().split("T")[0]}. Parse: "${text}"` }],
  //   }),
  // });
  // const data = await res.json();
  // const appointment = JSON.parse(data.content[0].text);
  // return NextResponse.json({ appointment });
  // ────────────────────────────────────────────────────────────────────────

  // Demo parser (remove when using real AI)
  const appointment = demoParser(text);
  return NextResponse.json({ appointment });
}

function demoParser(input: string) {
  const lower = input.toLowerCase();
  const doctorMatch = lower.match(/dr\.?\s*(\w+)/i);
  const words = input.split(" ");
  const timeMap: Record<string, string> = { morning: "09:00", afternoon: "14:00", evening: "17:00" };
  const timeKey = Object.keys(timeMap).find(k => lower.includes(k));
  const timeMatch = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/);

  let time = "09:00";
  if (timeKey) time = timeMap[timeKey];
  if (timeMatch) {
    let h = parseInt(timeMatch[1]);
    const m = timeMatch[2] || "00";
    if (timeMatch[3] === "pm" && h < 12) h += 12;
    time = `${h.toString().padStart(2, "0")}:${m}`;
  }

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    patient_name: words[1] || "Patient",
    doctor: doctorMatch ? `Dr. ${doctorMatch[1].charAt(0).toUpperCase() + doctorMatch[1].slice(1)}` : "Dr. Sharma",
    date: lower.includes("tomorrow") ? tomorrow.toISOString().split("T")[0] : today.toISOString().split("T")[0],
    time,
    notes: "",
  };
}
