"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <AlertTriangle className="size-12 text-red-500" />
      <h1 className="text-2xl font-semibold text-slate-900">Algo salio mal</h1>
      <p className="text-sm text-slate-500 text-center max-w-md">
        Ocurrio un error inesperado. Intenta recargar la pagina.
      </p>
      <Button onClick={reset} className="bg-[#00AEEF] hover:bg-[#0098d1]">
        Reintentar
      </Button>
    </div>
  )
}
