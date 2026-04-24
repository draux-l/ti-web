"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

const CODE_EXPIRY_SECONDS = 60

export function GoogleAuthCodeForm() {
  const router = useRouter()
  const [email, setEmail] = useState("c***@gmail.com")
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(CODE_EXPIRY_SECONDS)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleResend = async () => {
    setTimeLeft(CODE_EXPIRY_SECONDS)
    setCanResend(false)
    setCode("")

    const newCode = Math.floor(100000 + Math.random() * 900000).toString()
    toast.success("Código reenviado", {
      description: `Nuevo código: ${newCode}`,
    })
  }

  const handleVerify = async () => {
    if (code.length !== 6) return

    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (code === "123456") {
      toast.success("Verificación exitosa", {
        description: "Redirigiendo a tu dashboard...",
      })
      router.push("/dashboard/student")
    } else {
      toast.error("Código incorrecto", {
        description: "Por favor verifica el código e intenta nuevamente.",
      })
      setCode("")
    }

    setIsLoading(false)
  }

  const handleBackToLogin = () => {
    router.push("/login")
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#00AEEF]/10">
              <Mail className="size-8 text-[#00AEEF]" />
            </div>

            <h1 className="text-2xl font-bold text-[#1A1A2E]">
              Verifica tu correo
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Hemos enviado un código de 6 dígitos a tu correo:
              <br />
              <span className="font-medium text-gray-700">{email}</span>
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(value) => setCode(value)}
              className="gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="h-12 w-10 rounded-lg border-gray-200 text-lg font-medium" />
                <InputOTPSlot index={1} className="h-12 w-10 rounded-lg border-gray-200 text-lg font-medium" />
                <InputOTPSlot index={2} className="h-12 w-10 rounded-lg border-gray-200 text-lg font-medium" />
                <InputOTPSlot index={3} className="h-12 w-10 rounded-lg border-gray-200 text-lg font-medium" />
                <InputOTPSlot index={4} className="h-12 w-10 rounded-lg border-gray-200 text-lg font-medium" />
                <InputOTPSlot index={5} className="h-12 w-10 rounded-lg border-gray-200 text-lg font-medium" />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="mt-6">
            <Button
              onClick={handleVerify}
              disabled={code.length !== 6 || isLoading}
              className="w-full bg-[#00AEEF] hover:bg-[#33C4F4] text-white font-medium py-2 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <span className="mr-2 size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Verificando...
                </>
              ) : (
                "Verificar código"
              )}
            </Button>
          </div>

          <div className="mt-4 text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-sm text-[#00AEEF] hover:underline"
              >
                Reenviar código
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                Reenviar código en {formatTime(timeLeft)}
              </p>
            )}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleBackToLogin}
              className="flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="size-4" />
              Volver al login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}