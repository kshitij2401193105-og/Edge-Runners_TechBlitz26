import { NextRequest, NextResponse } from "next/server";
// import { createClient } from "@/lib/supabase/server";
// import { isSlotAvailable, calcEndTime } from "@/lib/scheduling";

/**
 * GET /api/appointments?doctor_id=X&date=YYYY-MM-DD
 * Returns all appointments for a doctor on a given date
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const doctor_id = searchParams.get("doctor_id");
  const date = searchParams.get("date");

  // ── Supabase query ───────────────────────────────────────────────────
  // const supabase = createClient();
  // const { data, error } = await supabase
  //   .from("appointments")
  //   .select("*, patients(name, phone, email), doctors(name, specialty)")
  //   .eq("doctor_id", doctor_id)
  //   .gte("start_time", `${date}T00:00:00`)
  //   .lte("start_time", `${date}T23:59:59`)
  //   .order("start_time");
  // if (error) return NextResponse.json({ error }, { status: 500 });
  // return NextResponse.json({ appointments: data });
  // ─────────────────────────────────────────────────────────────────────

  return NextResponse.json({ appointments: [], doctor_id, date });
}

/**
 * POST /api/appointments
 * Book a new appointment (with double-booking prevention)
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { doctor_id, patient_id, start_time, slot_duration = 15 } = body;

  // ── Supabase booking with conflict check ──────────────────────────────
  // const supabase = createClient();
  // const end_time = calcEndTime(start_time.slice(11, 16), slot_duration);
  //
  // // Get existing appointments for conflict check
  // const { data: existing } = await supabase
  //   .from("appointments")
  //   .select("start_time, end_time")
  //   .eq("doctor_id", doctor_id)
  //   .eq("status", "confirmed")
  //   .gte("start_time", start_time.slice(0, 10) + "T00:00:00")
  //   .lte("start_time", start_time.slice(0, 10) + "T23:59:59");
  //
  // const available = isSlotAvailable(start_time.slice(11, 16), end_time, existing || []);
  // if (!available) return NextResponse.json({ error: "Slot already booked" }, { status: 409 });
  //
  // const { data, error } = await supabase.from("appointments").insert({
  //   doctor_id, patient_id,
  //   start_time: `${start_time}:00`,
  //   end_time: `${start_time.slice(0,11)}${end_time}:00`,
  //   status: "confirmed",
  // }).select().single();
  //
  // if (error) return NextResponse.json({ error }, { status: 500 });
  // return NextResponse.json({ appointment: data });
  // ─────────────────────────────────────────────────────────────────────

  return NextResponse.json({ message: "Connect Supabase to enable booking" }, { status: 501 });
}

/**
 * PATCH /api/appointments — cancel or reschedule
 */
export async function PATCH(req: NextRequest) {
  const { id, status, new_start_time } = await req.json();

  // ── Supabase update ───────────────────────────────────────────────────
  // const supabase = createClient();
  // if (status === "cancelled") {
  //   await supabase.from("appointments").update({ status: "cancelled" }).eq("id", id);
  // }
  // if (new_start_time) {
  //   await supabase.from("appointments").update({ start_time: new_start_time, status: "confirmed" }).eq("id", id);
  // }
  // ─────────────────────────────────────────────────────────────────────

  return NextResponse.json({ message: "Connect Supabase to enable updates" }, { status: 501 });
}
