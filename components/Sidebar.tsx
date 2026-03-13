"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  role: "receptionist" | "doctor";
  userName?: string;
}

const ReceptionistNav: NavItem[] = [
  { href: "/receptionist", label: "Dashboard", icon: <HomeIcon /> },
  { href: "/receptionist/appointments", label: "Appointments", icon: <CalIcon /> },
  { href: "/receptionist/patients", label: "Patients", icon: <PeopleIcon /> },
  { href: "/receptionist/calendar", label: "Calendar", icon: <GridIcon /> },
  { href: "/receptionist/analytics", label: "Analytics", icon: <ChartIcon /> },
];

const DoctorNav: NavItem[] = [
  { href: "/doctor", label: "Dashboard", icon: <HomeIcon /> },
  { href: "/doctor/schedule", label: "My Schedule", icon: <CalIcon /> },
  { href: "/doctor/patients", label: "Patients", icon: <PeopleIcon /> },
];

export function Sidebar({ role, userName = "User" }: SidebarProps) {
  const pathname = usePathname();
  const nav = role === "receptionist" ? ReceptionistNav : DoctorNav;

  return (
    <aside className="sidebar w-60 min-h-screen flex flex-col py-5 px-3 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <span className="font-semibold text-white text-base">ClinicOS</span>
      </div>

      {/* Role badge */}
      <div className="px-3 mb-5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          {role === "receptionist" ? "Receptionist" : "Doctor"}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5">
        {nav.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "sidebar-item",
              pathname === item.href && "active"
            )}>
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="mt-auto px-3 pt-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 text-xs font-semibold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white text-xs font-medium">{userName}</p>
            <p className="text-slate-500 text-[10px] capitalize">{role}</p>
          </div>
        </div>
        <Link href="/login"
          className="mt-3 flex items-center gap-2 text-slate-500 hover:text-slate-300 text-xs transition-colors">
          <LogoutIcon />
          Sign out
        </Link>
      </div>
    </aside>
  );
}

// Icons
function HomeIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
}
function CalIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={1.8} strokeLinecap="round" /><line x1="16" y1="2" x2="16" y2="6" strokeWidth={1.8} strokeLinecap="round" /><line x1="8" y1="2" x2="8" y2="6" strokeWidth={1.8} strokeLinecap="round" /><line x1="3" y1="10" x2="21" y2="10" strokeWidth={1.8} strokeLinecap="round" /></svg>;
}
function PeopleIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>;
}
function GridIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="7" height="7" strokeWidth={1.8} strokeLinecap="round" /><rect x="14" y="3" width="7" height="7" strokeWidth={1.8} strokeLinecap="round" /><rect x="3" y="14" width="7" height="7" strokeWidth={1.8} strokeLinecap="round" /><rect x="14" y="14" width="7" height="7" strokeWidth={1.8} strokeLinecap="round" /></svg>;
}
function ChartIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function LogoutIcon() {
  return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
}
