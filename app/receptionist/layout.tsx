import { Sidebar } from "@/components/Sidebar";

export default function ReceptionistLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="receptionist" userName="Sarah K." />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
