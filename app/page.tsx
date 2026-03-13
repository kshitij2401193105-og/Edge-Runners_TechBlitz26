"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0f2744] to-slate-900 flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">ClinicOS</span>
        </div>
        <Link href="/login"
          className="bg-blue-500 hover:bg-blue-400 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
          Sign In
        </Link>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
          Clinic Management System
        </div>

        <h1 className="text-5xl md:text-6xl font-light text-white mb-6 leading-tight max-w-2xl"
          style={{ fontFamily: "'DM Serif Display', serif" }}>
          Modern care,<br />
          <span className="text-blue-400">streamlined.</span>
        </h1>

        <p className="text-slate-400 text-lg max-w-md mb-10 leading-relaxed">
          Appointment scheduling, patient records, and clinic analytics — all in one clean interface.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/login"
            className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25">
            Get Started
          </Link>
          <a href="#features"
            className="border border-white/10 text-white/70 hover:text-white hover:border-white/20 px-8 py-3 rounded-xl font-medium transition-colors">
            Learn More
          </a>
        </div>
      </div>

      {/* Feature cards */}
      <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8 pb-16 max-w-5xl mx-auto w-full">
        {[
          { icon: "🗓️", title: "Smart Scheduling", desc: "Auto-generate time slots, prevent double bookings, visual calendar." },
          { icon: "🤖", title: "AI Booking", desc: "Type naturally: \"Book Rahul with Dr Sharma tomorrow\" and it just works." },
          { icon: "📊", title: "Analytics", desc: "Daily stats, cancellation tracking, busiest slot insights at a glance." },
        ].map((f) => (
          <div key={f.title} className="bg-white/5 border border-white/8 rounded-xl p-6">
            <div className="text-2xl mb-3">{f.icon}</div>
            <h3 className="text-white font-semibold mb-2 text-sm">{f.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <footer className="text-center text-slate-600 text-xs pb-6">
        © 2024 ClinicOS — Built for fast, modern medical practices
      </footer>
    </div>
  );
}
