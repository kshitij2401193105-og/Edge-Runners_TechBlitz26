import { Sidebar } from "@/components/Sidebar";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="doctor" userName="Dr. Sharma" />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
