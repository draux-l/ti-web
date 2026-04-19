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

  
  

  return (
    <div className="flex h-screen bg-slate-50 w-full overflow-hidden">
      <Sidebar role={role} userName={userName} onLogout={handleLogout} />
      
      <div className="flex flex-col flex-1 h-full min-w-0">
        {/* Contenido principal scrolleable de las páginas */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          {children}
        </main>
      </div>
    </div>
  )
}
