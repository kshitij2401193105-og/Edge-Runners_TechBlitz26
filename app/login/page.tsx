"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Supabase auth client imported from lib
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"receptionist" | "doctor">("receptionist");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // SUPABASE AUTH
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    
    if (authError) { 
      setError(authError.message); 
      setLoading(false); 
      return; 
    }
    
    // Fetch profile role after login to redirect routing
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .single();
      
    if (profile?.role === "doctor") {
      router.push("/doctor");
    } else {
      router.push("/receptionist");
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-slate-900 to-[#0f2744] flex-col justify-between p-10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <span className="text-white font-semibold text-lg">ClinicOS</span>
        </Link>

        <div>
          <h2 className="text-3xl text-white font-light mb-4 leading-snug"
            style={{ fontFamily: "'DM Serif Display', serif" }}>
            Your clinic,<br />perfectly organised.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Manage appointments, patients, and schedules from one unified workspace designed for healthcare professionals.
          </p>
        </div>

        <div className="space-y-3">
          {[
            { label: "Today's Appointments", value: "24" },
            { label: "Active Doctors", value: "6" },
            { label: "Avg Wait Time", value: "12 min" },
          ].map(stat => (
            <div key={stat.label} className="flex items-center justify-between bg-white/5 border border-white/8 rounded-lg px-4 py-3">
              <span className="text-slate-400 text-sm">{stat.label}</span>
              <span className="text-white font-semibold text-sm">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-900 mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm">Sign in to your clinic workspace</p>
          </div>

          {/* Role toggle */}
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 mb-6 gap-1">
            {(["receptionist", "doctor"] as const).map(r => (
              <button key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-150 ${
                  role === r
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}>
                {r === "receptionist" ? "🖥 Receptionist" : "🩺 Doctor"}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@clinic.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-60">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Demo: any email + password works • Role is selected above
          </p>

          {/* Supabase connection note */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
            <strong>Connect Supabase:</strong> Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in <code>.env.local</code>, then uncomment the auth block in this file.
          </div>
        </div>
      </div>
    </div>
  );
}
