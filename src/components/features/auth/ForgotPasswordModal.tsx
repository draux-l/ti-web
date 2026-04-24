"use client"

import { useState, useEffect, Fragment } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail, ShieldCheck, CheckCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

type ForgotStep = "email" | "code" | "newPassword" | "success"

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (resendCooldown === 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  const handleClose = () => {
    setForgotStep("email")
    setResetEmail("")
    setResetCode("")
    setNewPassword("")
    setConfirmPassword("")
    setIsSubmitting(false)
    setIsResending(false)
    setResendCooldown(0)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
    onClose()
  }

  const hasMinLength = newPassword.length >= 8
  const hasUppercase = /[A-Z]/.test(newPassword)
  const hasNumber = /\d/.test(newPassword)
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword
  const passwordChecks = [hasMinLength, hasUppercase, hasNumber]
  const passwordStrength = passwordChecks.filter(Boolean).length

  const handleSendCode = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(resetEmail)) {
      toast.error("Ingresa un correo válido", {
        description: "Verifica el formato de correo para continuar.",
      })
      return
    }
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setIsSubmitting(false)
    toast.success("Código enviado", {
      description: `Revisamos ${resetEmail} y enviamos un código de verificación.`,
    })
    setForgotStep("code")
  }

  const handleVerifyCode = async () => {
    if (resetCode.length !== 6) {
      toast.error("Código incompleto", {
        description: "Ingresa los 6 dígitos para validar tu identidad.",
      })
      return
    }
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSubmitting(false)
    setForgotStep("newPassword")
  }

  const handleResendCode = async () => {
    if (resendCooldown > 0) return

    setIsResending(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsResending(false)

    setResendCooldown(60)

    toast.success("Código reenviado", {
      description: "Te enviamos un nuevo código de verificación al correo registrado.",
    })
  }

  const handleUpdatePassword = async () => {
    if (!hasMinLength || !hasUppercase || !hasNumber) {
      toast.error("Contraseña poco segura", {
        description: "Debe tener 8+ caracteres, una mayúscula y un número.",
      })
      return
    }

    if (!passwordsMatch) {
      toast.error("Las contraseñas no coinciden", {
        description: "Verifica ambos campos antes de actualizar.",
      })
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 700))
    setIsSubmitting(false)

    setForgotStep("success")
  }

  const getStrengthLabel = () => {
    if (passwordStrength <= 1) return "Baja"
    if (passwordStrength === 2) return "Media"
    return "Alta"
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-md">
        <div className="bg-gradient-to-r from-[#00AEEF] to-[#0098D1] px-6 py-5 text-white">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="size-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">Seguridad de cuenta</span>
          </div>
          <div className="mb-3 flex w-full items-center justify-between">
            {["email", "code", "newPassword", "success"].map((step, index) => {
              const stepPosition = index + 1
              const activePosition =
                forgotStep === "email"
                  ? 1
                  : forgotStep === "code"
                  ? 2
                  : forgotStep === "newPassword"
                  ? 3
                  : 4
              const isActive = stepPosition <= activePosition
              return (
                <Fragment key={step}>
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      isActive ? "bg-white text-[#0098D1]" : "bg-white/30 text-white"
                    }`}
                  >
                    {stepPosition}
                  </span>
                  {index < 3 && (
                    <span
                      className={`h-1.5 flex-1 shrink-0 rounded-full ${
                        stepPosition < activePosition ? "bg-white" : "bg-white/30"
                      }`}
                    />
                  )}
                </Fragment>
              )
            })}
          </div>
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-xl font-bold text-white">
              {forgotStep === "email" && "Recuperar contraseña"}
              {forgotStep === "code" && "Verificar código"}
              {forgotStep === "newPassword" && "Configurar nueva contraseña"}
              {forgotStep === "success" && "Contraseña actualizada"}
            </DialogTitle>
            <DialogDescription className="text-sm text-sky-100">
              {forgotStep === "email" && "Te guiaremos paso a paso para recuperar tu acceso."}
              {forgotStep === "code" && "Valida tu identidad ingresando el código enviado a tu correo."}
              {forgotStep === "newPassword" && "Define una contraseña segura para proteger tu cuenta."}
              {forgotStep === "success" && "Tu contraseña fue actualizada con éxito."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 py-6">
          {forgotStep === "email" && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-sm font-medium text-gray-700">
                  Correo institucional o personal
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    className="h-11 rounded-xl border-gray-200 pl-10 focus-visible:ring-[#00AEEF]"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="h-11 flex-1 rounded-xl" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button
                  type="button"
                  className="h-11 flex-1 rounded-xl bg-[#00AEEF] font-semibold text-white transition hover:bg-[#0098D1]"
                  onClick={handleSendCode}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar código"}
                </Button>
              </div>
            </div>
          )}

          {forgotStep === "code" && (
            <div className="space-y-5">
              <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800">
                Ingresamos el código de verificación en <span className="font-semibold">{resetEmail}</span>.
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Código de 6 dígitos</Label>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={resetCode} onChange={(value) => setResetCode(value)}>
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
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="h-11 flex-1 rounded-xl" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button
                  type="button"
                  className="h-11 flex-1 rounded-xl bg-[#00AEEF] font-semibold text-white transition hover:bg-[#0098D1]"
                  onClick={handleVerifyCode}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Verificando..." : "Verificar código"}
                </Button>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm font-medium text-[#00AEEF] transition hover:text-[#0098D1] hover:underline disabled:opacity-50"
                  onClick={handleResendCode}
                  disabled={isResending || resendCooldown > 0}
                >
                  {resendCooldown > 0
                    ? `Reenviar en ${resendCooldown}s`
                    : isResending
                    ? "Reenviando..."
                    : "Reenviar código"}
                </button>
              </div>
            </div>
          )}

          {forgotStep === "newPassword" && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-medium text-gray-700">
                  Nueva contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    className="h-11 rounded-xl border-gray-200 pl-10 pr-10 focus-visible:ring-[#00AEEF]"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                  Confirmar contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repite tu contraseña"
                    className="h-11 rounded-xl border-gray-200 pl-10 pr-10 focus-visible:ring-[#00AEEF]"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2 rounded-xl border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-600">Fortaleza de contraseña</span>
                  <span className="font-semibold text-gray-700">{getStrengthLabel()}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full transition-all ${
                      passwordStrength <= 1
                        ? "bg-red-400"
                        : passwordStrength === 2
                        ? "bg-amber-400"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${(passwordStrength / 3) * 100}%` }}
                  />
                </div>
                <div className="grid gap-1 text-xs">
                  <p className={hasMinLength ? "text-emerald-600" : "text-gray-500"}>• Al menos 8 caracteres</p>
                  <p className={hasUppercase ? "text-emerald-600" : "text-gray-500"}>• Incluye una letra mayúscula</p>
                  <p className={hasNumber ? "text-emerald-600" : "text-gray-500"}>• Incluye al menos un número</p>
                  <p className={passwordsMatch ? "text-emerald-600" : "text-gray-500"}>• Ambas contraseñas coinciden</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" className="h-11 flex-1 rounded-xl" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button
                  type="button"
                  className="h-11 flex-1 rounded-xl bg-[#00AEEF] font-semibold text-white transition hover:bg-[#0098D1]"
                  disabled={!hasMinLength || !hasUppercase || !hasNumber || !passwordsMatch || isSubmitting}
                  onClick={handleUpdatePassword}
                >
                  {isSubmitting ? "Actualizando..." : "Actualizar contraseña"}
                </Button>
              </div>
            </div>
          )}

          {forgotStep === "success" && (
            <div className="flex flex-col items-center space-y-5 py-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle className="size-10 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900">
                  Contraseña cambiada correctamente
                </h3>
                <p className="text-sm text-gray-600">
                  Tu contraseña fue actualizada con éxito. Ya puedes iniciar sesión.
                </p>
              </div>
              <Button
                type="button"
                className="h-11 w-full rounded-xl bg-[#00AEEF] font-semibold text-white transition hover:bg-[#0098D1]"
                onClick={() => {
                  handleClose()
                  router.push("/login")
                }}
              >
                Ir al login
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
