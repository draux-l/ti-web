"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ServerDownBanner() {
  const [isDown, setIsDown] = useState(false)

  useEffect(() => {
    const handler = () => setIsDown(true)
    window.addEventListener("server-down", handler)
    return () => window.removeEventListener("server-down", handler)
  }, [])

  if (!isDown) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-5 py-2.5 rounded-full shadow-lg flex items-center gap-3">
      <AlertTriangle className="size-4" />
      <span className="text-sm font-medium">Servidor no disponible</span>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => window.location.reload()}
        className="h-7 rounded-full text-xs"
      >
        <RefreshCw className="size-3 mr-1" />
        Reintentar
      </Button>
    </div>
  )
}
