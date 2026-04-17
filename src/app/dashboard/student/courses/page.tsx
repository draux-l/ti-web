"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Zap, Wrench, Shield, Monitor } from "lucide-react"
import { AccessCodeModal } from "@/components/features/student/AccessCodeModal"

interface CourseCardProps {
  id: string
  name: string
  icon: React.ElementType
  iconColor: string
  bgColor: string
  progress: number
  completedModules: number
  totalModules: number
  onContinue: (courseId: string) => void
}

function CourseCard({
  id,
  name,
  icon: Icon,
  iconColor,
  bgColor,
  progress,
  completedModules,
  totalModules,
  onContinue,
}: CourseCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-lg">
      <div className={`${bgColor} relative aspect-video w-full flex items-center justify-center`}>
        <div className={`rounded-full ${iconColor} p-6`}>
          <Icon className="size-12 text-white" />
        </div>
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
          {progress}%
        </span>
      </div>
      <div className="p-4">
        <h3 className="mb-3 font-semibold text-gray-900">{name}</h3>
        <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[#00A3E0] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
          <span>{completedModules}/{totalModules} módulos</span>
          <span>{progress === 100 ? "Completado" : "En progreso"}</span>
        </div>
        <button
          onClick={() => onContinue(id)}
          className="w-full rounded-full bg-[#00A3E0] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#00A3E0]/90"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}

const courses = [
  {
    id: "1",
    name: "Electricidad Industrial",
    icon: Zap,
    iconColor: "bg-yellow-500",
    bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-100",
    progress: 65,
    completedModules: 5,
    totalModules: 8,
  },
  {
    id: "2",
    name: "Mecánica de Maquinaria Pesada",
    icon: Wrench,
    iconColor: "bg-orange-500",
    bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
    progress: 30,
    completedModules: 4,
    totalModules: 12,
  },
  {
    id: "3",
    name: "Seguridad en Minería Subterránea",
    icon: Shield,
    iconColor: "bg-green-500",
    bgColor: "bg-gradient-to-br from-green-50 to-green-100",
    progress: 100,
    completedModules: 6,
    totalModules: 6,
  },
]

export default function StudentCoursesPage() {
  const router = useRouter()
  const [isXRAccessOpen, setIsXRAccessOpen] = useState(false)
  const [autoTriggerXR, setAutoTriggerXR] = useState(false)

  const handleContinue = (courseId: string) => {
    router.push(`/dashboard/student?view=courseDetail&course=${courseId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Cursos</h1>
          <p className="mt-1 text-gray-500">Gestiona tu aprendizaje</p>
        </div>
        <button
          onClick={() => {
            setAutoTriggerXR(false)
            setIsXRAccessOpen(true)
          }}
          className="flex items-center gap-2 rounded-full bg-[#00AEEF] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#00AEEF]/90 hover:shadow-lg"
        >
          <Monitor className="size-5" />
          Código de Acceso XR
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            {...course}
            onContinue={handleContinue}
          />
        ))}
      </div>

      <AccessCodeModal
        isOpen={isXRAccessOpen}
        onClose={() => setIsXRAccessOpen(false)}
        autoTrigger={autoTriggerXR}
      />
    </div>
  )
}
