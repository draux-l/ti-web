"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, TrendingUp, Clock, Monitor, Loader2 } from "lucide-react"
import { useHeaderButton } from "@/contexts/HeaderButtonContext"
import { useAuthStore } from "@/stores/auth.store"
import apiClient from "@/lib/api-client"

interface StudentDashboardProps {
  onNavigate: (view: "dashboard" | "courses" | "progress") => void
  onSelectCourse: (courseId: string) => void
  onOpenXRCode: () => void
}

interface ProgressEntry {
  courseId: number
  courseName: string
  totalExperiences: number
  completedExperiences: number
  percent: number
}

export function StudentDashboard({ onNavigate, onSelectCourse, onOpenXRCode }: StudentDashboardProps) {
  const router = useRouter()
  const { setHeaderButton } = useHeaderButton()
  const [isLoading, setIsLoading] = useState(true)
  const [greeting, setGreeting] = useState("Estudiante")
  const [progress, setProgress] = useState<ProgressEntry[]>([])
  const [totalTime, setTotalTime] = useState(0)

  const currentUserId = useAuthStore((s) => s.user?.id)
  const userName = useAuthStore((s) => s.user?.name)

  useEffect(() => {
    if (!currentUserId) return
    async function fetchData() {
      try {
        const res = await apiClient.get(`/users/${currentUserId}/dashboard`)
        const dashboard = res.data
        setGreeting(dashboard.user?.name || userName || "Estudiante")
        const progressList: ProgressEntry[] = dashboard.progress || []
        setProgress(progressList)

        try {
          const sessionsRes = await apiClient.get("/sessions", { params: { userId: currentUserId, pageSize: 500 } })
          const sessions = sessionsRes.data.data || []
          const mins = sessions.reduce(
            (acc: number, s: { totalTimeSeconds?: number; timeSpent?: number }) =>
              acc + (s.totalTimeSeconds || s.timeSpent || 0) / 60,
            0
          )
          setTotalTime(Math.round(mins / 60) || 0)
        } catch {
          // sessions are optional
        }
      } catch {
        setGreeting(userName || "Estudiante")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [currentUserId, userName])

  useEffect(() => {
    setHeaderButton({
      icon: Monitor,
      label: "XR",
      onClick: onOpenXRCode,
    })
    return () => setHeaderButton(null)
  }, [setHeaderButton, onOpenXRCode])

  const activeCourses = progress.filter((p) => p.percent < 100).length
  const avgProgress = progress.length > 0
    ? Math.round(progress.reduce((s, p) => s + p.percent, 0) / progress.length)
    : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Bienvenido de vuelta, {greeting.split(" ")[0]}</h1>
          <p className="text-sm text-gray-500 mt-1">Continua donde lo dejaste</p>
        </div>
        <button
          onClick={onOpenXRCode}
          className="hidden md:flex items-center justify-center bg-[#00AEEF] hover:bg-[#33C4F4] text-white font-medium px-6 py-2.5 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-200"
        >
          <Monitor className="w-4 h-4 mr-2" />
          Codigo de Acceso XR
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <button
          onClick={() => router.push("/dashboard/student/courses")}
          className="flex items-center justify-between gap-4 rounded-3xl bg-[#00AEEF] p-10 text-white transition-all duration-200 hover:bg-[#33C4F4] hover:scale-105 hover:shadow-lg"
        >
          <BookOpen className="size-14" />
          <div className="text-left">
            {isLoading ? <Loader2 className="size-8 animate-spin" /> : <p className="text-4xl font-bold">{activeCourses}</p>}
            <p className="text-base opacity-90">Cursos activos</p>
          </div>
        </button>

        <button
          onClick={() => router.push("/dashboard/student/progress")}
          className="flex items-center justify-between gap-4 rounded-3xl bg-[#FFB800] p-10 text-gray-900 transition-all duration-200 hover:scale-105 hover:shadow-lg"
        >
          <TrendingUp className="size-14" />
          <div className="text-left">
            {isLoading ? <Loader2 className="size-8 animate-spin" /> : <p className="text-4xl font-bold">{avgProgress}%</p>}
            <p className="text-base opacity-80">Progreso general</p>
          </div>
        </button>

        <button
          onClick={() => router.push("/dashboard/student/courses")}
          className="flex items-center justify-between gap-4 rounded-3xl bg-gray-100 p-10 text-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-lg"
        >
          <Clock className="size-14" />
          <div className="text-left">
            {isLoading ? <Loader2 className="size-8 animate-spin" /> : <p className="text-4xl font-bold">{totalTime}h</p>}
            <p className="text-base text-gray-500">Tiempo total</p>
          </div>
        </button>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Cursos en progreso</h2>
          <button onClick={() => router.push("/dashboard/student/courses")} className="text-sm text-[#00A3E0] hover:underline">
            Ver todos
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="size-8 animate-spin text-[#00AEEF]" /></div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {progress.filter((p) => p.percent < 100).slice(0, 3).map((course) => (
              <div key={course.courseId} className="rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{course.courseName}</h3>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-[#00A3E0]">{course.percent}%</span>
                </div>
                <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-[#00A3E0]" style={{ width: `${course.percent}%` }} />
                </div>
                <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
                  <span>{course.completedExperiences}/{course.totalExperiences} experiencias</span>
                </div>
                <button
                  onClick={() => onSelectCourse(String(course.courseId))}
                  className="w-full rounded-full bg-[#00AEEF] hover:bg-[#33C4F4] text-white font-medium py-2 text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  Continuar
                </button>
              </div>
            ))}
            {progress.filter((p) => p.percent < 100).length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">No hay cursos en progreso</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
