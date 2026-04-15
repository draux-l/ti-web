"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, Lock } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const loginSchema = z.object({
  username: z.string().min(1, "El usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
})

type LoginForm = z.infer<typeof loginSchema>

const ROLE_REDIRECT: Record<string, string> = {
  estudiante: "/dashboard/student",
  instructor: "/dashboard/instructor",
  admin: "/dashboard/admin",
}

const CREDENTIALS: Record<string, { password: string; role: string; name: string }> = {
  ander: { password: "123456", role: "estudiante", name: "Ander" },
  pareja: { password: "123456", role: "instructor", name: "Pareja" },
  admin: { password: "123456", role: "admin", name: "Admin" },
}

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onSubmit",
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)

    // Simulate network delay
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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md rounded-2xl shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-[#00A3E0]/10">
            <Lock className="size-6 text-[#00A3E0]" />
          </div>
          <CardTitle className="text-2xl font-semibold">Tecsup</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="Ingresa tu usuario"
                aria-invalid={!!errors.username}
                {...register("username")}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-[#00A3E0] hover:bg-[#00A3E0]/90"
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
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
