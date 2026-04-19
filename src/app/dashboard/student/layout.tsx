"use client"

import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/Sidebar"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const userName = "Ander García"
  const role = "student"

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar role={role} userName={userName} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  )
}
