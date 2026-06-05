"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 bg-slate-50">
      <AlertTriangle className="size-12 text-red-500" />
      <h1 className="text-2xl font-semibold text-slate-900">Error en el dashboard</h1>
      <p className="text-sm text-slate-500 text-center max-w-md">
        Ocurrio un error al cargar esta seccion.
      </p>
      <Button onClick={reset} className="bg-[#00AEEF] hover:bg-[#0098d1]">
        Reintentar
      </Button>
    </div>
  )
}
