"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { BookOpen, TrendingUp, Clock, Monitor } from "lucide-react"
import { useHeaderButton } from "@/contexts/HeaderButtonContext"

interface StudentDashboardProps {
  onNavigate: (view: "dashboard" | "courses" | "progress") => void
  onSelectCourse: (courseId: string) => void
  onOpenXRCode: () => void
}

const mockCourses = [
  {
    id: "1",
    name: "Electricidad Industrial",
    progress: 65,
    lastAccess: "Hace 2 horas",
    modules: 8,
    completedModules: 5,
  },
  {
    id: "2",
    name: "Mecánica de Maquinaria Pesada",
    progress: 30,
    lastAccess: "Ayer",
    modules: 12,
    completedModules: 4,
  },
  {
    id: "3",
    name: "Seguridad en Minería Subterránea",
    progress: 100,
    lastAccess: "Hace 1 semana",
    modules: 6,
    completedModules: 6,
  },
]

export function StudentDashboard({ onNavigate, onSelectCourse, onOpenXRCode }: StudentDashboardProps) {
  const router = useRouter()
  const { setHeaderButton } = useHeaderButton()

  useEffect(() => {
    setHeaderButton({
      icon: Monitor,
      label: "XR",
      onClick: onOpenXRCode,
    })
    return () => setHeaderButton(null)
  }, [setHeaderButton, onOpenXRCode])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Bienvenido de vuelta, Ander</h1>
          <p className="text-sm text-gray-500 mt-1">Continúa donde lo dejaste</p>
        </div>
        <button
          onClick={onOpenXRCode}
          className="hidden md:flex items-center gap-2 rounded-full bg-[#00AEEF] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#00AEEF]/90 hover:shadow-lg"
        >
          <Monitor className="size-5" />
          Código de Acceso XR
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <button
          onClick={() => router.push("/dashboard/student/courses")}
          className="flex items-center justify-between gap-4 rounded-2xl bg-[#00A3E0] p-6 text-white transition-transform hover:scale-[1.02]"
        >
          <BookOpen className="size-10" />
          <div className="text-left">
            <p className="text-2xl font-bold">3</p>
            <p className="text-sm opacity-90">Cursos activos</p>
          </div>
        </button>

        <button
          onClick={() => router.push("/dashboard/student/progress")}
          className="flex items-center justify-between gap-4 rounded-2xl bg-[#FFB800] p-6 text-gray-900 transition-transform hover:scale-[1.02]"
        >
          <TrendingUp className="size-10" />
          <div className="text-left">
            <p className="text-2xl font-bold">65%</p>
            <p className="text-sm opacity-80">Progreso general</p>
          </div>
        </button>

        <button
          onClick={() => router.push("/dashboard/student/courses")}
          className="flex items-center justify-between gap-4 rounded-2xl bg-gray-100 p-6 text-gray-700 transition-transform hover:scale-[1.02]"
        >
          <Clock className="size-10" />
          <div className="text-left">
            <p className="text-2xl font-bold">12h</p>
            <p className="text-sm text-gray-500">Tiempo total</p>
          </div>
        </button>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Cursos en progreso</h2>
          <button
            onClick={() => router.push("/dashboard/student/courses")}
            className="text-sm text-[#00A3E0] hover:underline"
          >
            Ver todos
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockCourses.slice(0, 2).map((course) => (
            <div
              key={course.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{course.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">{course.lastAccess}</p>
                </div>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-[#00A3E0]">
                  {course.progress}%
                </span>
              </div>

              <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[#00A3E0] transition-all"
                  style={{ width: `${course.progress}%` }}
                />
              </div>

              <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
                <span>{course.completedModules}/{course.modules} módulos</span>
              </div>

              <button
                onClick={() => router.push(`/dashboard/student/courses?view=courseDetail&course=${course.id}`)}
                className="w-full rounded-full bg-[#00A3E0] py-2 text-sm font-medium text-white transition-colors hover:bg-[#00A3E0]/90"
              >
                Continuar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
