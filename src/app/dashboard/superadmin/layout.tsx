"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/Sidebar"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth.store"
import { RouteGuard } from "@/components/guards/RouteGuard"
import { ChatWidget } from "@/components/chat/ChatWidget"

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const userName = useAuthStore((s) => s.user?.name)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <RouteGuard allowedRoleIds={[1]}>
      <div className="relative h-screen bg-slate-50">
        <div className="hidden md:block">
          <Sidebar
            role="superadmin"
            userName={userName || "Super Admin"}
            onLogout={() => useAuthStore.getState().logout()}
            onSettings={() => router.push("/dashboard/superadmin")}
            isCollapsed={isCollapsed}
            onToggleCollapse={setIsCollapsed}
          />
        </div>
        <main
          className="min-h-0 flex-1 overflow-y-auto p-4 md:p-8 transition-all duration-300 ease-in-out"
          style={!isCollapsed && !isMobile ? { marginLeft: "16rem" } : isMobile ? {} : { marginLeft: "5rem" }}
        >
          {children}
        </main>
        <ChatWidget />
      </div>
    </RouteGuard>
  )
}
