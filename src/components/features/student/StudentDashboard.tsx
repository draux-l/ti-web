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
          className="hidden md:flex items-center justify-center bg-[#00AEEF] hover:bg-[#33C4F4] text-white font-medium px-6 py-2.5 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-200"
        >
          <Monitor className="w-4 h-4 mr-2" />
          Código de Acceso XR
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <button
          onClick={() => router.push("/dashboard/student/courses")}
          className="flex items-center justify-between gap-4 rounded-3xl bg-[#00AEEF] p-10 text-white transition-all duration-200 hover:bg-[#33C4F4] hover:scale-105 hover:shadow-lg"
        >
          <BookOpen className="size-14" />
          <div className="text-left">
            <p className="text-4xl font-bold">3</p>
            <p className="text-base opacity-90">Cursos activos</p>
          </div>
        </button>

        <button
          onClick={() => router.push("/dashboard/student/progress")}
          className="flex items-center justify-between gap-4 rounded-3xl bg-[#FFB800] p-10 text-gray-900 transition-all duration-200 hover:scale-105 hover:shadow-lg"
        >
          <TrendingUp className="size-14" />
          <div className="text-left">
            <p className="text-4xl font-bold">65%</p>
            <p className="text-base opacity-80">Progreso general</p>
          </div>
        </button>

        <button
          onClick={() => router.push("/dashboard/student/courses")}
          className="flex items-center justify-between gap-4 rounded-3xl bg-gray-100 p-10 text-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-lg"
        >
          <Clock className="size-14" />
          <div className="text-left">
            <p className="text-4xl font-bold">12h</p>
            <p className="text-base text-gray-500">Tiempo total</p>
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
                className="w-full rounded-full bg-[#00AEEF] hover:bg-[#33C4F4] text-white font-medium py-2 text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
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
