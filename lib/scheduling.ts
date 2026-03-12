/**
 * Core scheduling logic for ClinicOS
 * Connect to Supabase by passing real booked slots from DB queries
 */

export interface Slot {
  time: string;          // "HH:MM"
  status: "free" | "booked" | "freed";
}

/**
 * Generate time slots for a working session
 */
export function generateSlots(
  startTime: string,
  endTime: string,
  durationMinutes: number
): string[] {
  const slots: string[] = [];
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  let current = sh * 60 + sm;
  const endMin = eh * 60 + em;

  while (current < endMin) {
    const h = Math.floor(current / 60).toString().padStart(2, "0");
    const m = (current % 60).toString().padStart(2, "0");
    slots.push(`${h}:${m}`);
    current += durationMinutes;
  }

  return slots;
}

/**
 * Merge two working sessions (morning + afternoon) and mark booked slots
 * @param sessions Array of { start, end } session times
 * @param bookedSlots Array of "HH:MM" strings that are already booked
 * @param freedSlots Slots that were recently cancelled (freed)
 */
export function buildSlotGrid(
  sessions: { start: string; end: string }[],
  durationMinutes: number,
  bookedSlots: string[],
  freedSlots: string[] = []
): Slot[] {
  const allTimes = sessions.flatMap(s => generateSlots(s.start, s.end, durationMinutes));

  return allTimes.map(time => {
    if (bookedSlots.includes(time) && !freedSlots.includes(time)) {
      return { time, status: "booked" };
    }
    if (freedSlots.includes(time)) {
      return { time, status: "freed" };
    }
    return { time, status: "free" };
  });
}

/**
 * Calculate end time given a start time and duration
 */
export function calcEndTime(startTime: string, durationMinutes: number): string {
  const [h, m] = startTime.split(":").map(Number);
  const totalMin = h * 60 + m + durationMinutes;
  const eh = Math.floor(totalMin / 60).toString().padStart(2, "0");
  const em = (totalMin % 60).toString().padStart(2, "0");
  return `${eh}:${em}`;
}

/**
 * Check if a slot is available (no overlap with booked slots)
 * Use this before inserting into Supabase to prevent double booking
 */
export function isSlotAvailable(
  proposedStart: string,
  proposedEnd: string,
  existingAppointments: { start_time: string; end_time: string }[]
): boolean {
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const ps = toMin(proposedStart);
  const pe = toMin(proposedEnd);

  return !existingAppointments.some(({ start_time, end_time }) => {
    const es = toMin(start_time.slice(11, 16)); // handle ISO strings
    const ee = toMin(end_time.slice(11, 16));
    return ps < ee && pe > es; // overlap check
  });
}
