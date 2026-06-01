"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/Sidebar"
import { Menu, X, Plus, Users, BookOpen, UserPlus, Building, Layout } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RouteGuard } from "@/components/guards/RouteGuard"
import { useAuthStore } from "@/stores/auth.store"
import { ROLE_LABEL_MAP } from "@/types/auth.types"
import { HeaderButtonProvider, useHeaderButton } from "@/contexts/HeaderButtonContext"

const MOBILE_MENU_ITEMS: Record<string, { label: string; href: string; icon: React.ElementType }[]> = {
  "/dashboard/admin": [
    { label: "Inicio", href: "/dashboard/admin", icon: Users },
    { label: "Usuarios", href: "/dashboard/admin/users", icon: Users },
    { label: "Cursos", href: "/dashboard/admin/courses", icon: BookOpen },
    { label: "Departamentos", href: "/dashboard/admin/departments", icon: Building },
    { label: "Especialidades", href: "/dashboard/admin/specialties", icon: Layout },
    { label: "Asignaciones", href: "/dashboard/admin/assignments", icon: Users },
  ],
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { headerButton } = useHeaderButton()
  const user = useAuthStore((s) => s.user)
  
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [passwords, setPasswords] = useState({ old: "", new: "", repeat: "" })

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const menuItems = MOBILE_MENU_ITEMS["/dashboard/admin"] || []

  const handleLogout = () => {
    useAuthStore.getState().logout()
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.new !== passwords.repeat) {
      alert("Las contraseñas nuevas no coinciden")
      return
    }
    alert("Contraseña actualizada exitosamente")
    setIsPasswordModalOpen(false)
    setPasswords({ old: "", new: "", repeat: "" })
  }

  return (
    <div className="relative h-screen bg-slate-50">
      <div className="hidden md:block">
        <Sidebar 
          role={(ROLE_LABEL_MAP[user?.roleId || 0] as "admin") || "admin"} 
          userName={user?.name || "Administrador"} 
          onLogout={handleLogout}
          onChangePassword={() => setIsPasswordModalOpen(true)}
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
                useAuthStore.getState().logout()
              }}
            >
              Cerrar sesión
            </Button>
          </aside>
        </div>
      )}

      <Dialog open={isPasswordModalOpen} onOpenChange={(val) => { setIsPasswordModalOpen(val); if (!val) setPasswords({ old: "", new: "", repeat: "" }) }}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handlePasswordSubmit}>
            <DialogHeader>
              <DialogTitle>Cambiar contraseña</DialogTitle>
              <DialogDescription>
                Ingresa tu contraseña actual y la nueva contraseña que deseas utilizar.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="old">Contraseña Anterior</Label>
                <Input required id="old" type="password" value={passwords.old} onChange={e => setPasswords({...passwords, old: e.target.value})} className="bg-slate-50/50" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="new">Nueva Contraseña</Label>
                <Input required id="new" type="password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="bg-slate-50/50" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="repeat">Repetir Contraseña</Label>
                <Input required id="repeat" type="password" value={passwords.repeat} onChange={e => setPasswords({...passwords, repeat: e.target.value})} className="bg-slate-50/50" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsPasswordModalOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-[#00A3E0] hover:bg-[#008cc0] text-white">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard allowedRoleIds={[1, 2]}>
      <HeaderButtonProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </HeaderButtonProvider>
    </RouteGuard>
  )
}