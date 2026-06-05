"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth.store"
import { FileQuestion, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#00AEEF]" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-8">
      <span className="text-2xl font-bold text-[#00AEEF]">TECSUP</span>
      <FileQuestion className="size-16 text-slate-300" />
      <h1 className="text-3xl font-bold text-slate-900">Pagina no encontrada</h1>
      <p className="text-base text-slate-500 text-center max-w-sm">
        La pagina que buscas no existe o fue movida.
      </p>
      <Button onClick={() => router.back()} className="rounded-full bg-[#00AEEF] hover:bg-[#0098d1]">
        Volver donde estaba
      </Button>
    </div>
  )
}
