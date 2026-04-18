"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, Home, Users, Layout, TrendingUp, Settings, Menu, X } from "lucide-react"

import { Sidebar } from "@/components/Sidebar"
import { Button } from "@/components/ui/button"

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const mobileMenuItems = [
    { label: "Inicio", href: "/dashboard/instructor", icon: Home },
    { label: "Gestión de Grupos", href: "/dashboard/instructor/groups", icon: Users },
    { label: "Control de Experiencias", href: "/dashboard/instructor/experiences", icon: Layout },
    { label: "Calificaciones y Progreso", href: "/dashboard/instructor/grades", icon: TrendingUp },
    { label: "Configuración", href: "/dashboard/instructor/settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-slate-50">
      <div className="hidden md:block">
        <Sidebar
          role="instructor"
          userName="Pareja Instructor"
          onLogout={() => router.push("/login")}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="h-9 w-9 rounded-full p-0 md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <h2 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
              Panel del Instructor
            </h2>
          </div>
          <Button
            onClick={() => window.open("/dashboard/student", "_blank")}
            variant="outline"
            className="rounded-full border-[#00AEEF] text-[#00AEEF] hover:bg-blue-50 hover:text-[#0098d1]"
          >
            <Eye className="size-4" />
            <span className="hidden sm:inline">Visualizar vista de alumno</span>
            <span className="sm:hidden">Vista alumno</span>
          </Button>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
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
