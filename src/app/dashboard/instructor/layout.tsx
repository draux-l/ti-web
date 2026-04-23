"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Home, Users, Layout, TrendingUp, Settings, Menu, X, Eye } from "lucide-react"

import { Sidebar } from "@/components/Sidebar"
import { Button } from "@/components/ui/button"

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const mobileMenuItems = [
    { label: "Inicio", href: "/dashboard/instructor", icon: Home },
    { label: "Gestión de Grupos", href: "/dashboard/instructor/groups", icon: Users },
    { label: "Control de Experiencias", href: "/dashboard/instructor/experiences", icon: Layout },
    { label: "Calificaciones y Progreso", href: "/dashboard/instructor/grades", icon: TrendingUp },
    { label: "Configuración", href: "/dashboard/instructor/settings", icon: Settings },
  ]

  return (
    <div className="relative h-screen bg-slate-50">
      <div className="hidden md:block">
        <Sidebar
          role="instructor"
          userName="Pareja Instructor"
          onLogout={() => router.push("/login")}
          onSettings={() => router.push("/dashboard/instructor/settings")}
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
          <button
            onClick={() => window.open("/dashboard/student", "_blank")}
            className="flex items-center gap-1 rounded-full bg-sky-500 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-sky-600"
          >
            <Eye className="size-3.5" />
            Vista
          </button>
        </header>
        <main 
          className="min-h-0 flex-1 overflow-y-auto p-4 md:p-8 transition-all duration-300 ease-in-out"
          style={!isCollapsed && !isMobile ? { marginLeft: "16rem" } : isMobile ? {} : { marginLeft: "5rem" }}
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
                <span className="text-sm font-bold text-[#1A1A2E]">Tecsup Inmersivo</span>
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
              {mobileMenuItems.map((item) => {
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