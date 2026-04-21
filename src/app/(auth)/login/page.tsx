"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, User, Lock, AlertCircle, Mail } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

const loginSchema = z.object({
  username: z.string().min(1, "El usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
  remember: z.boolean().optional(),
})

type LoginForm = z.infer<typeof loginSchema>

const ROLE_REDIRECT: Record<string, string> = {
  student: "/dashboard/student",
  instructor: "/dashboard/instructor",
  admin: "/dashboard/admin",
}

const CREDENTIALS: Record<string, { password: string; role: string; name: string }> = {
  ander: { password: "123456", role: "student", name: "Ander García" },
  pareja: { password: "123456", role: "instructor", name: "Pareja Instructor" },
  admin: { password: "123456", role: "admin", name: "Administrador" },
}

type ForgotStep = "email" | "code" | "newPassword"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isForgotOpen, setIsForgotOpen] = useState(false)
  const [forgotStep, setForgotStep] = useState<ForgotStep>("email")
  const [resetEmail, setResetEmail] = useState("")
  const [resetCode, setResetCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
    mode: "onSubmit",
  })

  const remember = watch("remember")

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 800))

    const user = CREDENTIALS[data.username]

    if (!user || user.password !== data.password) {
      toast.error("Credenciales inválidas", {
        description: "El usuario o la contraseña son incorrectos.",
      })
      setIsLoading(false)
      return
    }

    toast.success("¡Bienvenido!", {
      description: `Inicio de sesión exitoso como ${user.name}.`,
    })

    router.push(ROLE_REDIRECT[user.role])
  }

  const handleCloseForgot = () => {
    setIsForgotOpen(false)
    setForgotStep("email")
    setResetEmail("")
    setResetCode("")
    setNewPassword("")
    setConfirmPassword("")
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md rounded-2xl bg-white shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-[#00A3E0]">
            <span className="text-3xl font-bold text-white">T</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">Tecsup Inmersivo</h1>
            <p className="text-sm text-gray-400">Plataforma de Gestión XR</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Usuario"
                  className="border-none bg-slate-100 pl-10"
                  aria-invalid={!!errors.username}
                  {...register("username")}
                />
              </div>
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Contraseña"
                  className="border-none bg-slate-100 pl-10"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(checked) =>
                    setValue("remember", checked as boolean)
                  }
                />
                <Label htmlFor="remember" className="text-sm text-gray-500">
                  Recordar mi cuenta
                </Label>
              </div>
              <button
                type="button"
                className="text-sm text-[#00A3E0] hover:underline"
                onClick={() => setIsForgotOpen(true)}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#00A3E0] text-white hover:bg-[#00A3E0]/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs font-medium text-gray-400">
                <span className="bg-white px-2">O CONTINUAR CON</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full bg-white"
              onClick={() => toast.info("Google OAuth próximamente")}
            >
              <svg className="mr-2 size-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Iniciar sesión con Google
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 flex w-full max-w-md items-center gap-3 rounded-xl bg-slate-100 px-4 py-3">
        <AlertCircle className="size-5 shrink-0 text-amber-500" />
        <p className="text-xs text-gray-500">
          Si no tienes acceso, contacta al administrador de tu institución o escribe a{" "}
          <a
            href="mailto:soporte@tecsup.edu.pe"
            className="font-medium text-[#00A3E0] hover:underline"
          >
            soporte@tecsup.edu.pe
          </a>
        </p>
      </div>

      <Dialog open={isForgotOpen} onOpenChange={handleCloseForgot}>
        <DialogContent className="rounded-2xl bg-white p-6 sm:max-w-md">
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
                  className="border-none bg-slate-100 rounded-full pl-10"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-full"
                  onClick={handleCloseForgot}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  className="flex-1 bg-[#00A3E0] text-white hover:bg-[#00A3E0]/90 rounded-full"
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
                  className="flex-1 rounded-full"
                  onClick={handleCloseForgot}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  className="flex-1 bg-[#00A3E0] text-white hover:bg-[#00A3E0]/90 rounded-full"
                  onClick={handleVerifyCode}
                >
                  Verificar
                </Button>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-[#00A3E0] hover:underline"
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
                    className="border-none bg-slate-100 rounded-full pl-10"
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
                    className="border-none bg-slate-100 rounded-full pl-10"
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
                  className="flex-1 rounded-full"
                  onClick={handleCloseForgot}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  className="flex-1 bg-[#00A3E0] text-white hover:bg-[#00A3E0]/90 rounded-full"
                  disabled={newPassword.length < 6 || newPassword !== confirmPassword}
                  onClick={() => {
                    toast.success("Contraseña actualizada", {
                      description: "Tu contraseña ha sido cambiada exitosamente.",
                    })
                    handleCloseForgot()
                  }}
                >
                  Actualizar Contraseña
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
