"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { BookOpen, Monitor, Loader2 } from "lucide-react"
import { AccessCodeModal } from "@/components/features/student/AccessCodeModal"
import { StudentCourseDetail } from "@/components/features/student/StudentCourseDetail"
import { useHeaderButton } from "@/contexts/HeaderButtonContext"
import { useAuthStore } from "@/stores/auth.store"
import apiClient from "@/lib/api-client"

const BG_COLORS = [
  "bg-gradient-to-br from-blue-50 to-blue-100",
  "bg-gradient-to-br from-purple-50 to-purple-100",
  "bg-gradient-to-br from-green-50 to-green-100",
  "bg-gradient-to-br from-orange-50 to-orange-100",
  "bg-gradient-to-br from-pink-50 to-pink-100",
  "bg-gradient-to-br from-teal-50 to-teal-100",
]

interface CourseProgress {
  courseId: number
  courseName: string
  totalExperiences: number
  completedExperiences: number
  percent: number
}

type View = "courses" | "courseDetail"

export function StudentCourses() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setHeaderButton } = useHeaderButton()
  const [currentView, setCurrentView] = useState<View>("courses")
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [isXRAccessOpen, setIsXRAccessOpen] = useState(false)
  const [autoTriggerXR, setAutoTriggerXR] = useState(false)
  const [courses, setCourses] = useState<CourseProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const currentUserId = useAuthStore((s) => s.user?.id)

  useEffect(() => {
    if (!currentUserId) return
    async function fetchData() {
      try {
        const res = await apiClient.get(`/users/${currentUserId}/dashboard`)
        setCourses(res.data.progress || [])
      } catch {
        // silent
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [currentUserId])

  useEffect(() => {
    const view = searchParams.get("view")
    const course = searchParams.get("course")
    if (view === "courseDetail" && course) {
      setSelectedCourse(course)
      setCurrentView("courseDetail")
    } else {
      setCurrentView("courses")
      setSelectedCourse(null)
    }
  }, [searchParams])

  useEffect(() => {
    setHeaderButton({
      icon: Monitor,
      label: "XR",
      onClick: () => { setAutoTriggerXR(false); setIsXRAccessOpen(true) },
    })
    return () => setHeaderButton(null)
  }, [setHeaderButton])

  const handleContinue = (courseId: string) => router.push(`/dashboard/student/courses?view=courseDetail&course=${courseId}`)
  const handleBackToCourses = () => router.push("/dashboard/student/courses")
  const handleOpenXRCode = (autoTrigger = false) => { setAutoTriggerXR(autoTrigger); setIsXRAccessOpen(true) }

  return (
    <>
      {currentView === "courseDetail" ? (
        <StudentCourseDetail courseId={selectedCourse || "1"} onBack={handleBackToCourses} onOpenXRCode={() => handleOpenXRCode(true)} />
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div><h1 className="text-2xl font-bold text-[#1A1A2E]">Mis Cursos</h1><p className="text-sm text-gray-500 mt-1">Gestiona tu aprendizaje</p></div>
            <button onClick={() => { setAutoTriggerXR(false); setIsXRAccessOpen(true) }} className="hidden md:flex items-center justify-center bg-[#00AEEF] hover:bg-[#33C4F4] text-white font-medium px-6 py-2.5 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-200"><Monitor className="w-4 h-4 mr-2" />Codigo de Acceso XR</button>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="size-8 animate-spin text-[#00AEEF]" /></div>
          ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <BookOpen className="size-12 mb-4 text-gray-300" />
              <p>No tienes cursos asignados</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, idx) => (
                <div key={course.courseId} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-lg">
                  <div className={`${BG_COLORS[idx % BG_COLORS.length]} relative aspect-video w-full flex items-center justify-center`}>
                    <div className="rounded-full bg-white/90 p-6"><BookOpen className="size-12 text-[#00AEEF]" /></div>
                    <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">{course.percent}%</span>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-3 font-semibold text-gray-900">{course.courseName}</h3>
                    <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-[#00A3E0]" style={{ width: `${course.percent}%` }} /></div>
                    <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
                      <span>{course.completedExperiences}/{course.totalExperiences} experiencias</span>
                      <span>{course.percent === 100 ? "Completado" : "En progreso"}</span>
                    </div>
                    <button onClick={() => handleContinue(String(course.courseId))} className="w-full rounded-full bg-[#00AEEF] hover:bg-[#33C4F4] text-white font-medium py-2 text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg">Continuar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <AccessCodeModal isOpen={isXRAccessOpen} onClose={() => setIsXRAccessOpen(false)} autoTrigger={autoTriggerXR} />
    </>
  )
}
