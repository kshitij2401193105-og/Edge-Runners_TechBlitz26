# ClinicOS — Doctor Appointment & Scheduling System

A professional, fast clinic management system built with Next.js 14, Supabase, and Tailwind CSS.

## Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript
- **UI**: Tailwind CSS + custom components (no Shadcn dependency needed)
- **Database + Auth**: Supabase
- **Fonts**: DM Sans + DM Serif Display (Google Fonts)

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in your Supabase URL and anon key

# 3. Set up Supabase database
# Go to: https://app.supabase.com → SQL Editor
# Run the contents of supabase-schema.sql

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Connecting Supabase Auth (Login)

In `app/login/page.tsx`, uncomment the Supabase auth block:

```ts
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

const { data, error } = await supabase.auth.signInWithPassword({ email, password });
if (error) { setError(error.message); return; }

// Get user role from your users table
const { data: profile } = await supabase.from("users").select("role").eq("id", data.user.id).single();
router.push(profile?.role === "doctor" ? "/doctor" : "/receptionist");
```

To create users, use Supabase's Auth > Users dashboard or the admin API.

---

## Project Structure

```
clinic-os/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── login/page.tsx              # Login (role-based)
│   ├── receptionist/
│   │   ├── layout.tsx              # Receptionist shell
│   │   ├── page.tsx                # Dashboard
│   │   ├── appointments/page.tsx   # Appointments list
│   │   ├── patients/page.tsx       # Patient management
│   │   ├── calendar/page.tsx       # Visual schedule board
│   │   └── analytics/page.tsx      # Clinic analytics
│   ├── doctor/
│   │   ├── layout.tsx              # Doctor shell
│   │   ├── page.tsx                # Dashboard
│   │   ├── schedule/page.tsx       # Schedule + slot settings
│   │   └── patients/page.tsx       # Patient list + detail
│   └── api/
│       ├── ai-book/route.ts        # AI booking parser
│       └── appointments/route.ts   # CRUD + conflict check
├── components/
│   ├── Sidebar.tsx                 # Role-aware sidebar
│   ├── dashboard/
│   │   └── AIBookingBar.tsx        # Natural language booking
│   └── modals/
│       └── QuickBookModal.tsx      # Quick appointment modal
├── lib/
│   ├── utils.ts                    # cn() utility
│   ├── scheduling.ts               # Slot generation, conflict check
│   └── supabase/
│       ├── client.ts               # Browser Supabase client
│       └── server.ts               # Server Supabase client
├── types/index.ts                  # TypeScript interfaces
├── supabase-schema.sql             # Full DB schema
└── .env.example                    # Environment template
```

---

## AI Booking Feature

In `app/api/ai-book/route.ts`, uncomment the OpenAI or Anthropic block.

Example prompt: `"Book Rahul with Dr Sharma tomorrow morning"`

Returns structured JSON:
```json
{
  "patient_name": "Rahul",
  "doctor": "Dr. Sharma",
  "date": "2024-01-16",
  "time": "09:00"
}
```

---

## Deploy to Vercel

```bash
vercel deploy
```

Add environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY` (if using AI booking)

---

## Features

| Feature | Status |
|---------|--------|
| Role-based login (Doctor / Receptionist) | ✅ Ready (wire Supabase) |
| Receptionist dashboard | ✅ Complete |
| Doctor dashboard | ✅ Complete |
| Quick appointment modal | ✅ Complete |
| AI natural language booking | ✅ Ready (wire OpenAI/Claude) |
| Visual schedule calendar | ✅ Complete |
| Patient management (add/search) | ✅ Complete |
| Walk-in queue | ✅ Complete |
| Clinic analytics | ✅ Complete |
| Doctor schedule settings | ✅ Complete |
| Slot generator | ✅ Complete |
| Double-booking prevention | ✅ DB + API level |
| Recently-freed slot indicator | ✅ Complete |
| Supabase schema + RLS | ✅ Complete |
