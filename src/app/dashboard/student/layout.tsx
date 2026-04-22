"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/Sidebar"
import { Menu, X, Monitor, BookOpen, TrendingUp, Users, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { HeaderButtonProvider, useHeaderButton } from "@/contexts/HeaderButtonContext"

const MOBILE_MENU_ITEMS: Record<string, { label: string; href: string; icon: React.ElementType }[]> = {
  "/dashboard/student": [
    { label: "Inicio", href: "/dashboard/student", icon: Users },
    { label: "Mis Cursos", href: "/dashboard/student/courses", icon: BookOpen },
    { label: "Mi Progreso", href: "/dashboard/student/progress", icon: TrendingUp },
    { label: "Configuración", href: "/dashboard/student/settings", icon: Settings },
  ],
}

function StudentLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { headerButton } = useHeaderButton()
  
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const userName = "Ander García"
  const role = "student"

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const menuItems = MOBILE_MENU_ITEMS["/dashboard/student"] || []

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <div className="relative h-screen bg-slate-50">
      <div className="hidden md:block">
        <Sidebar 
          role={role} 
          userName={userName} 
          onLogout={handleLogout}
          isCollapsed={isCollapsed}
          onToggleCollapse={setIsCollapsed}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
          <Button
            variant="ghost"
            className="h-9 w-9 rounded-full p-0"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          {headerButton && (
            <button
              onClick={headerButton.onClick}
              className="flex items-center gap-1 rounded-full bg-sky-500 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-sky-600"
            >
              <headerButton.icon className="size-3.5" />
              {headerButton.label}
            </button>
          )}
        </header>
        
        <main 
          className="flex-1 overflow-y-auto p-4 md:p-8 relative bg-slate-50 transition-all duration-300 ease-in-out"
          style={!isMobile && !isCollapsed ? { marginLeft: "16rem" } : isMobile ? {} : { marginLeft: "5rem" }}
        >
          {children}
        </main>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="relative z-10 h-full w-[280px] border-r border-gray-200 bg-white p-4 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#00AEEF]">
                  <span className="text-sm font-bold text-white">T</span>
                </div>
                <span className="text-sm font-bold text-[#1A1A2E]">TECSUP</span>
              </div>
              <Button
                variant="ghost"
                className="h-9 w-9 rounded-full p-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-slate-100"
                  >
                    <Icon className="size-4 text-[#00AEEF]" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <Button
              variant="outline"
              className="mt-6 w-full rounded-full border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => {
                setIsMobileMenuOpen(false)
                router.push("/login")
              }}
            >
              Cerrar sesión
            </Button>
          </aside>
        </div>
      )}
    </div>
  )
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <HeaderButtonProvider>
      <StudentLayoutContent>{children}</StudentLayoutContent>
    </HeaderButtonProvider>
  )
}