"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth.store"
import { ROLE_REDIRECT } from "@/types/auth.types"
import { Loader2 } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuthStore()

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.roleId != null) {
      router.replace(ROLE_REDIRECT[user.roleId] || "/dashboard/student")
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#00AEEF]" />
      </div>
    )
  }

  return <>{children}</>
}
