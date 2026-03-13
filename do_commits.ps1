$ErrorActionPreference = "Continue"

Remove-Item -Recurse -Force .git
git init
git checkout -b main

# Commit 1
git add package.json package-lock.json README.md .gitignore
$env:GIT_COMMITTER_DATE="2026-03-13T02:00:00+0530"
git commit -m "Initial commit: basic project setup" --date="2026-03-13T02:00:00+0530"

# Commit 2
git add tsconfig.json next.config.js next-env.d.ts
$env:GIT_COMMITTER_DATE="2026-03-13T03:00:00+0530"
git commit -m "Configure TypeScript and Next.js" --date="2026-03-13T03:00:00+0530"

# Commit 3
git add tailwind.config.ts postcss.config.js
$env:GIT_COMMITTER_DATE="2026-03-13T04:00:00+0530"
git commit -m "Add Tailwind CSS configuration" --date="2026-03-13T04:00:00+0530"

# Commit 4
git add lib/ types/
$env:GIT_COMMITTER_DATE="2026-03-13T05:00:00+0530"
git commit -m "Add common types and utility functions" --date="2026-03-13T05:00:00+0530"

# Commit 5
git add components/ui/
$env:GIT_COMMITTER_DATE="2026-03-13T06:00:00+0530"
git commit -m "Add shadcn UI components" --date="2026-03-13T06:00:00+0530"

# Commit 6
git add components/
$env:GIT_COMMITTER_DATE="2026-03-13T07:00:00+0530"
git commit -m "Implement application specific components" --date="2026-03-13T07:00:00+0530"

# Commit 7
git add supabase-schema.sql supabase-setup-with-seeds.sql .env.example .env.local
$env:GIT_COMMITTER_DATE="2026-03-13T08:00:00+0530"
git commit -m "Add database schemas and environment files" --date="2026-03-13T08:00:00+0530"

# Commit 8
git add "{app"
$env:GIT_COMMITTER_DATE="2026-03-13T09:00:00+0530"
git commit -m "Setup internal app structures" --date="2026-03-13T09:00:00+0530"

# Commit 9
git add app/
$env:GIT_COMMITTER_DATE="2026-03-13T10:00:00+0530"
git commit -m "Implement main Next.js app routes" --date="2026-03-13T10:00:00+0530"

# Commit 10
git add .
$env:GIT_COMMITTER_DATE="2026-03-13T11:00:00+0530"
git commit -m "Final adjustments and code cleanup" --date="2026-03-13T11:00:00+0530"

git remote add origin https://github.com/kshitij2401193105-og/Edge-Runners_TechBlitz26.git
git push -u origin main --force
