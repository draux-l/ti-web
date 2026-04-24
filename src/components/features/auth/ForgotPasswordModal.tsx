"use client"

import { useState } from "react"
import { Mail, Lock } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

type ForgotStep = "email" | "code" | "newPassword"

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [forgotStep, setForgotStep] = useState<ForgotStep>("email")
  const [resetEmail, setResetEmail] = useState("")
  const [resetCode, setResetCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleClose = () => {
    setForgotStep("email")
    setResetEmail("")
    setResetCode("")
    setNewPassword("")
    setConfirmPassword("")
    onClose()
  }

  const handleSendCode = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(resetEmail)) {
      toast.error("Por favor, ingresa un correo válido.")
      return
    }
    setForgotStep("code")
  }

  const handleVerifyCode = async () => {
    setForgotStep("newPassword")
  }

  const handleResendCode = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    toast.success("Código reenviado", {
      description: `Nuevo código: ${code}`,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="rounded-2xl bg-white p-6 sm:max-w-md border-none shadow-none ring-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {forgotStep === "email" && "Recuperar contraseña"}
            {forgotStep === "code" && "Verificar código"}
            {forgotStep === "newPassword" && "Nueva contraseña"}
          </DialogTitle>
        </DialogHeader>

        {forgotStep === "email" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Ingresa tu correo electrónico y te enviaremos un código de verificación.
            </p>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="email"
                placeholder="correo@ejemplo.com"
                className="pl-10"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="flex-1 bg-[#00AEEF] hover:bg-[#33C4F4] text-white font-medium py-2 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg"
                onClick={handleSendCode}
              >
                Enviar código
              </Button>
            </div>
          </div>
        )}

        {forgotStep === "code" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Hemos enviado un código de 6 dígitos a <span className="font-medium text-gray-700">{resetEmail}</span>
            </p>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={resetCode}
                onChange={(value) => setResetCode(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="flex-1 bg-[#00AEEF] hover:bg-[#33C4F4] text-white font-medium py-2 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg"
                onClick={handleVerifyCode}
              >
                Verificar
              </Button>
            </div>
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-[#00AEEF] hover:underline"
                onClick={handleResendCode}
              >
                Reenviar código
              </button>
            </div>
          </div>
        )}

        {forgotStep === "newPassword" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Ingresa tu nueva contraseña.
            </p>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Nueva contraseña"
                  className="pl-10"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Confirmar contraseña"
                  className="pl-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                <p className="text-sm text-destructive">Las contraseñas no coinciden</p>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="flex-1 bg-[#00AEEF] hover:bg-[#33C4F4] text-white font-medium py-2 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg"
                disabled={newPassword.length < 6 || newPassword !== confirmPassword}
                onClick={() => {
                  toast.success("Contraseña actualizada", {
                    description: "Tu contraseña ha sido cambiada exitosamente.",
                  })
                  handleClose()
                }}
              >
                Actualizar Contraseña
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}