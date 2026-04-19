"use client"

import { useState, useEffect } from "react"
import { QrCode, Copy, Check, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface AccessCodeModalProps {
  isOpen: boolean
  onClose: () => void
  autoTrigger?: boolean
}

export function AccessCodeModal({ isOpen, onClose, autoTrigger = false }: AccessCodeModalProps) {
  const [code, setCode] = useState("123 456")
  const [timeLeft, setTimeLeft] = useState(300)
  const [isCopied, setIsCopied] = useState(false)
  const [isSynced, setIsSynced] = useState(false)

  useEffect(() => {
    if (isOpen && !isSynced) {
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString()
      setCode(`${randomCode.slice(0, 3)} ${randomCode.slice(3)}`)
      setTimeLeft(300)
      setIsCopied(false)
    }
  }, [isOpen, isSynced])

  useEffect(() => {
    if (timeLeft > 0 && isOpen && !isSynced) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft, isOpen, isSynced])

  useEffect(() => {
    if (autoTrigger && isOpen) {
      const syncTimer = setTimeout(() => {
        setIsSynced(true)
      }, 3000)
      return () => clearTimeout(syncTimer)
    }
  }, [autoTrigger, isOpen])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.replace(" ", ""))
      setIsCopied(true)
      toast.success("Código copiado al portapapeles")
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      toast.error("Error al copiar el código")
    }
  }

  const handleClose = () => {
    setIsSynced(false)
    setCode("123 456")
    setTimeLeft(300)
    onClose()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (isSynced) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="rounded-2xl bg-white p-6 sm:max-w-md">
          <div className="flex flex-col items-center py-8">
            <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-green-100">
              <Check className="size-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">¡Visor Sincronizado!</h2>
            <p className="mt-2 text-center text-gray-500">
              Tu dispositivo está conectado y listo para la experiencia XR.
            </p>

            <div className="mt-8 w-full rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-blue-100">
                  <Monitor className="size-6 text-[#00AEEF]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Meta Quest 3</p>
                  <p className="text-sm text-gray-500">Estado: Conectado</p>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <div className="size-2 animate-pulse rounded-full bg-green-500" />
                  <span className="text-sm font-medium">Online</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleClose}
              className="mt-6 w-full rounded-full bg-[#00AEEF] hover:bg-[#00AEEF]/90"
            >
              Continuar a la experiencia
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="rounded-2xl bg-white p-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Código de Acceso XR
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div className="rounded-xl bg-gray-50 p-4">
            <ol className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#00AEEF] text-xs font-bold text-white">
                  1
                </span>
                <span>Ponerse el visor de realidad virtual</span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#00AEEF] text-xs font-bold text-white">
                  2
                </span>
                <span>Abrir la aplicación &quot;Tecsup Inmersivo&quot;</span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#00AEEF] text-xs font-bold text-white">
                  3
                </span>
                <span>Ingresar el código de acceso de 6 dígitos</span>
              </li>
            </ol>
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-4 rounded-2xl border-2 border-dashed border-[#00AEEF] bg-blue-50/30 p-8">
              <p className="mb-4 text-center text-sm font-medium text-gray-500">
                Código de Acceso
              </p>
              <p className="text-center text-5xl font-bold tracking-widest text-[#00AEEF]">
                {code}
              </p>
            </div>

            <div className="flex w-full items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <QrCode className="size-4" />
                <span>Expira en:</span>
                <span
                  className={`font-medium ${
                    timeLeft <= 60 ? "text-red-500" : "text-gray-900"
                  }`}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="rounded-full"
              >
                {isCopied ? (
                  <>
                    <Check className="mr-1 size-4" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 size-4" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400">
            Mantén esta pantalla visible mientras dure la sincronización
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
