"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/Sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()
  const userName = "Administrador"
  const role = "admin"

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <div className="relative h-screen bg-slate-50">
      <Sidebar 
        role={role} 
        userName={userName} 
        onLogout={handleLogout} 
        isCollapsed={isCollapsed}
        onToggleCollapse={setIsCollapsed}
      />
      <main 
        className="absolute inset-y-0 right-0 overflow-y-auto p-8 transition-all duration-300 ease-in-out"
        style={{ left: isCollapsed ? "5rem" : "16rem" }}
      >
        {children}
      </main>
    </div>
  )
}
