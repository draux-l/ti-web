"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth.store"
import { ROLE_REDIRECT } from "@/types/auth.types"
import { Loader2 } from "lucide-react"

interface RouteGuardProps {
  children: React.ReactNode
  allowedRoleIds?: number[]
}

export function RouteGuard({ children, allowedRoleIds }: RouteGuardProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading, user, initialize } = useAuthStore()
  const [pendingRedirect, setPendingRedirect] = useState(false)

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login")
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (pendingRedirect && user?.roleId != null) {
      const correctPath = ROLE_REDIRECT[user.roleId] || "/login"
      router.replace(correctPath)
    }
  }, [pendingRedirect, user, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="size-8 animate-spin text-[#00AEEF]" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  if (allowedRoleIds && user?.roleId != null && !allowedRoleIds.includes(user.roleId)) {
    if (!pendingRedirect) {
      setPendingRedirect(true)
    }
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="size-8 animate-spin text-[#00AEEF]" />
      </div>
    )
  }

  return <>{children}</>
}
