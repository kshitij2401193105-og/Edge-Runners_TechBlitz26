export type Role = "doctor" | "receptionist";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  created_at: string;
}

export interface Doctor {
  id: string;
  user_id: string;
  name: string;
  specialty: string;
  phone?: string;
  email?: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  age?: number;
  created_at: string;
}

export type AppointmentStatus = "confirmed" | "cancelled" | "completed" | "walkin";

export interface Appointment {
  id: string;
  doctor_id: string;
  patient_id: string;
  start_time: string;   // ISO 8601
  end_time: string;
  status: AppointmentStatus;
  notes?: string;
  type?: string;
  created_at: string;

  // Joined
  doctors?: Doctor;
  patients?: Patient;
}

export interface Availability {
  id: string;
  doctor_id: string;
  day_of_week: number;   // 0 = Sunday
  start_time: string;    // "HH:MM"
  end_time: string;
  slot_duration: number; // minutes
  is_active: boolean;
}

export interface Slot {
  time: string;
  status: "free" | "booked" | "freed";
}

export interface AIBookingResult {
  patient_name: string;
  doctor: string;
  date: string;
  time: string;
  notes?: string;
}
