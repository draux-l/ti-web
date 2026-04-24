"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ForgotPasswordModal } from "./ForgotPasswordModal"
import tecsupLogin from "@/app/assets/tecsup_login.png"

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

  return (
    <div suppressHydrationWarning className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-md md:max-w-4xl">
        <Card className="overflow-hidden p-0 border-none shadow-none ring-0">
          <CardContent className="grid p-0 md:grid-cols-2">
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
                    <Label htmlFor="username">Usuario</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Ingresa tu usuario"
                      className="border-none shadow-none bg-slate-50/50 focus-visible:ring-1 focus-visible:ring-[#00AEEF]"
                      {...register("username")}
                    />
                    {errors.username && (
                      <p className="text-sm text-destructive">{errors.username.message}</p>
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
                    className="w-full bg-[#00AEEF] hover:bg-[#33C4F4] text-white font-medium py-2 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg"
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

                <div className="relative text-center text-xs text-muted-foreground">
                  <span>O CONTINUAR CON</span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline" type="button" className="w-full" onClick={() => router.push("/google-verify")}>
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
                    <span className="sr-only">Iniciar con Google</span>
                  </Button>
                  <Button variant="outline" type="button" className="w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4">
                      <path
                        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="sr-only">Iniciar con Apple</span>
                  </Button>
                  <Button variant="outline" type="button" className="w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="sr-only">Iniciar con Meta</span>
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