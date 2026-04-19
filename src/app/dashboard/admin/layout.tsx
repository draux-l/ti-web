"use client"

import { usePathname, useRouter } from "next/navigation"
import { Sidebar } from "@/components/Sidebar"
import { LogOut } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const userName = "Administrador"
  const role = "admin"

  const handleLogout = () => {
    router.push("/login")
  }

  // Genera el listado de breadcrumbs basado en la URL actual
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean)
    
    // Si estamos exactamente en /dashboard/admin
    if (paths.length === 2 && paths[1] === "admin") {
      return (
        <BreadcrumbItem>
          <BreadcrumbPage className="font-semibold text-slate-800 text-base">Inicio</BreadcrumbPage>
        </BreadcrumbItem>
      )
    }

    // Si estamos en sub-rutas de admin
    let currentPageName = ""
    const lastPath = paths[paths.length - 1]
    
    if (lastPath === "users") currentPageName = "Usuarios"
    else if (lastPath === "assignments") currentPageName = "Asignación de Cursos"
    else if (lastPath === "vr-licenses") currentPageName = "Licencias VR"
    else if (lastPath === "settings") currentPageName = "Configuración"
    else currentPageName = lastPath

    return (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard/admin" className="text-slate-500 hover:text-slate-900 text-base">
            Inicio
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="font-semibold text-slate-800 text-base">{currentPageName}</BreadcrumbPage>
        </BreadcrumbItem>
      </>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50 w-full overflow-hidden">
      <Sidebar role={role} userName={userName} onLogout={handleLogout} />
      
      <div className="flex flex-col flex-1 h-full min-w-0">
        {/* Cabecera / Topbar */}
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200/60 shadow-sm shrink-0">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                {generateBreadcrumbs()}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <span className="hidden md:inline-block">Institución Educa</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="text-slate-600 hover:text-red-600 hover:bg-red-50 border-slate-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </header>

        {/* Contenido principal scrolleable de las páginas */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          {children}
        </main>
      </div>
    </div>
  )
}
