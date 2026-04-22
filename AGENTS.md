# AGENTS.md - Tecsup Inmersivo

## Developer Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
npx tsc --noEmit  # TypeScript check (no package script)
```

## Architecture

- **Next.js 14** App Router (`src/app/`)
- **Pages** are thin wrappers: import from `src/components/features/{role}/`
- **Feature components** contain all UI logic in `src/components/features/{role}/{Feature}.tsx`
- **Layouts** handle sidebar, header, mobile menu (`src/app/dashboard/{role}/layout.tsx`)

## Feature Component Pattern

```tsx
// src/app/dashboard/admin/page.tsx (THIN WRAPPER)
import { AdminDashboard } from "@/components/features/admin/AdminDashboard"
export default function Page() { return <AdminDashboard /> }

// src/components/features/admin/AdminDashboard.tsx (FULL COMPONENT)
import { useHeaderButton } from "@/contexts/HeaderButtonContext"

// Use useHeaderButton to set the mobile header button
useEffect(() => {
  setHeaderButton({ icon: Users, label: "Asignar", onClick: () => ... })
  return () => setHeaderButton(null)
}, [setHeaderButton])
```

## Header Button Convention (Critical)

- Mobile header (`md:hidden`) shows dynamic button via **HeaderButtonContext**
- Desktop buttons in pages use `hidden md:flex` (visible only on desktop)
- Pages call `setHeaderButton()` in useEffect, clean up in return

## Mobile Header in Layouts

```tsx
// src/app/dashboard/admin/layout.tsx
import { HeaderButtonProvider, useHeaderButton } from "@/contexts/HeaderButtonContext"
import { Menu, X, Users, BookOpen } from "lucide-react"

// Mobile header with menu + dynamic button
<header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
  <Button variant="ghost" onClick={() => setIsMobileMenuOpen(true)}><Menu className="size-5" /></Button>
  {headerButton && <button onClick={headerButton.onClick} className="...">{headerButton.label}</button>}
</header>
```

## Sidebar Quirk

Sidebar uses `position: fixed`. Main content needs `marginLeft`:
```tsx
<main style={!isCollapsed ? { marginLeft: "16rem" } : { marginLeft: "5rem" }}>
```

## Known Issues (Pre-existing)

- `InstructorExperiences.tsx:40` - Cannot find name 'prev'
- `InstructorGroups.tsx:30` - Cannot find name 'prev'
- Some shadcn components don't support `asChild` prop (TypeScript errors)

## Roles

- student, instructor, admin, superadmin

## Routes

- `/dashboard/admin` → Users, Courses, Assignments
- `/dashboard/student` → Courses, Progress, Settings
- `/dashboard/instructor` → Groups, Experiences, Grades, Settings