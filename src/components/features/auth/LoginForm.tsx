"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ForgotPasswordModal } from "./ForgotPasswordModal"
import { loginSchema, type LoginFormData } from "@/validators/auth.schema"
import { ROLE_REDIRECT } from "@/types/auth.types"
import apiClient from "@/lib/api-client"
import { useAuthStore } from "@/stores/auth.store"
import tecsupLogin from "@/app/assets/tecsup_login.png"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isForgotOpen, setIsForgotOpen] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
    mode: "onSubmit",
  })

  const remember = watch("remember")

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    try {
      const res = await apiClient.post("/auth/sign-in", {
        email: data.email,
        password: data.password,
      })

      const { token, user } = res.data

      useAuthStore.getState().login(token, user)

      toast.success("¡Bienvenido!", {
        description: `Inicio de sesión exitoso.`,
      })

      const redirectPath = ROLE_REDIRECT[user.roleId] || "/dashboard/student"
      router.push(redirectPath)
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "No se pudo conectar con el servidor."

      toast.error("Error de inicio de sesión", {
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div suppressHydrationWarning className="flex min-h-svh bg-[#E9EEF2] flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-md md:max-w-4xl">
        <Card className="overflow-hidden p-[1px] bg-gradient-to-b from-white/50 via-[#D3DFE3]/4 backdrop-blur-xl backdrop-saturate-150 shadow-xl rounded-3xl ring-0">
          <CardContent className="grid p-0 rounded-[31px]
    bg-white/10
    backdrop-blur-xl
    md:grid-cols-2">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
                  <p className="text-balance text-sm text-muted-foreground">
                    Ingresa tus credenciales para acceder a la plataforma
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="correo@tecsup.edu.pe"
                      className="border-none shadow-none bg-slate-50/50 focus-visible:ring-1 focus-visible:ring-[#00AEEF]"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Contraseña</Label>
                      <button
                        type="button"
                        className="ml-auto text-sm text-[#00AEEF] hover:underline"
                        onClick={() => setIsForgotOpen(true)}
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Ingresa tu contraseña"
                      className="border-none shadow-none bg-slate-50/50 focus-visible:ring-1 focus-visible:ring-[#00AEEF]"
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                  </div>

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

                  <Button
                    type="submit"
                    className="w-full bg-[#00AEEF]/70 backdrop-blur-xl border-none backdrop-saturate-150 shadow-xl rounded-3xl hover:bg-[#33C4F4] text-white font-medium py-2 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg"
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
                </div>

                <p className="text-center text-xs text-muted-foreground">
                  Si no tienes acceso, contacta al administrador de tu institución o escribe a{" "}
                  <a
                    href="mailto:soporte@tecsup.edu.pe"
                    className="font-medium text-[#00AEEF] hover:underline"
                  >
                    soporte@tecsup.edu.pe
                  </a>
                </p>
              </div>
            </form>

            <div className="relative hidden bg-muted md:block">
              <Image
                src={tecsupLogin}
                alt="Tecsup Inmersivo"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <ForgotPasswordModal isOpen={isForgotOpen} onClose={() => setIsForgotOpen(false)} />
    </div>
  )
}
