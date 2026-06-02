"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Play, FileText, CheckCircle2, Circle, Lock, Clock, Users, Award, Calendar, MonitorSmartphone, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useAuthStore } from "@/stores/auth.store"
import apiClient from "@/lib/api-client"

interface ApiCourse {
  id: number
  name: string
  description: string | null
}

interface ApiExperience {
  id: number
  name: string
  duration: number
  courseId: number
}

interface ApiGroupExp {
  groupId: number
  experienceId: number
  finalScore: number | null
  attempts: number
  status: string
  deviceType: string | null
}

interface ModuleItem {
  id: string
  title: string
  completed: boolean
  locked: boolean
  duration: string
  feedback?: {
    finalScore: number
    attempts: number
    status: string
    timeSpent: number
    deviceType: string
    startedAt: string
    completedAt: string
    isGroup: boolean
    memberCount: number
  }
}

interface StudentCourseDetailProps {
  courseId: string
  onBack: () => void
  onOpenXRCode: () => void
}

export function StudentCourseDetail({ courseId, onBack, onOpenXRCode }: StudentCourseDetailProps) {
  const [course, setCourse] = useState<ApiCourse | null>(null)
  const [modules, setModules] = useState<ModuleItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null)
  const [quizModalOpen, setQuizModalOpen] = useState(false)
  const [teamModalOpen, setTeamModalOpen] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<ModuleItem["feedback"] | null>(null)
  const currentUserId = useAuthStore((s) => s.user?.id)

  useEffect(() => {
    async function fetchData() {
      try {
        const [courseRes, expsRes, geRes] = await Promise.all([
          apiClient.get(`/courses/${courseId}`),
          apiClient.get("/experiences", { params: { courseId: Number(courseId), pageSize: 500 } }),
          apiClient.get("/group-experiences", { params: { userId: currentUserId, pageSize: 500 } }),
        ])
        setCourse(courseRes.data)
        const allExperiences: ApiExperience[] = expsRes.data.data || []
        const groupExps: ApiGroupExp[] = geRes.data.data || []

        const geMap = new Map<number, ApiGroupExp>()
        for (const ge of groupExps) geMap.set(ge.experienceId, ge)

        const moduleList: ModuleItem[] = allExperiences.map((exp, idx) => {
          const ge = geMap.get(exp.id)
          const isCompleted = ge?.status === "COMPLETED"
          const previousLocked = idx > 0 && !geMap.get(allExperiences[idx - 1].id)
          return {
            id: String(exp.id),
            title: exp.name,
            completed: isCompleted,
            locked: previousLocked && !isCompleted && idx > 0,
            duration: `${exp.duration || 0} min`,
            feedback: ge ? {
              finalScore: ge.finalScore || 0,
              attempts: ge.attempts,
              status: ge.status,
              timeSpent: 0,
              deviceType: ge.deviceType || "vr_headset",
              startedAt: "",
              completedAt: "",
              isGroup: false,
              memberCount: 1,
            } : undefined,
          }
        })
        setModules(moduleList)
      } catch {
        // silent
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [courseId, currentUserId])

  const completedCount = modules.filter((m) => m.completed).length
  const progress = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="size-4" />Volver a cursos
      </button>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="size-8 animate-spin text-[#00AEEF]" /></div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{course?.name || "Curso"}</h1>
            {course?.description && <p className="mt-2 text-gray-500">{course.description}</p>}
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="flex-1">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-gray-500">Progreso del curso</span>
                <span className="font-medium text-gray-900">{progress}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-[#00A3E0]" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Contenido del curso</h2>
            <span className="text-sm text-gray-500">{completedCount} de {modules.length} completados</span>
          </div>

          <div className="space-y-2">
            {modules.map((module, index) => (
              <div key={module.id} className={`rounded-xl transition-colors ${module.locked ? "bg-gray-50 opacity-60" : module.completed ? "bg-gray-100" : "bg-gray-50 hover:bg-gray-100"}`}>
                <div className="flex items-center gap-4 p-4">
                  <div className="flex size-8 items-center justify-center rounded-full">
                    {module.locked ? <Lock className="size-4 text-gray-400" /> : module.completed ? <CheckCircle2 className="size-5 text-[#00A3E0]" /> : <Circle className="size-5 text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${module.locked ? "text-gray-400" : "text-gray-900"}`}>{index + 1}. {module.title}</p>
                    <p className="text-xs text-gray-500">{module.duration}</p>
                  </div>
                  {!module.locked && !module.completed && (
                    <button onClick={onOpenXRCode} className="flex items-center gap-2 rounded-full bg-[#00A3E0] px-4 py-2 text-sm font-medium text-white hover:bg-[#00A3E0]/90">
                      <Play className="size-4" />Iniciar
                    </button>
                  )}
                  {!module.locked && module.completed && module.feedback && (
                    <button
                      onClick={() => setExpandedFeedback(expandedFeedback === module.id ? null : module.id)}
                      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${expandedFeedback === module.id ? "border-[#00A3E0] bg-[#00A3E0] text-white" : "border-[#00A3E0] text-[#00A3E0] hover:bg-blue-50"}`}
                    >
                      <FileText className="size-4" />{expandedFeedback === module.id ? "Ocultar" : "Revisar"}
                    </button>
                  )}
                </div>
                {expandedFeedback === module.id && module.feedback && (
                  <div className="mt-0 rounded-b-xl bg-[#F7F7F7] p-4">
                    <h4 className="mb-3 text-sm font-semibold text-[#000000]">Feedback de tu practica</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <button onClick={() => { setSelectedFeedback(module.feedback); setQuizModalOpen(true); }} className="flex items-center gap-2 rounded-lg bg-white p-3 hover:bg-gray-50">
                        <Award className="size-4 text-[#00A3E0]" />
                        <div><p className="text-xs text-gray-500">Nota</p><p className="font-semibold text-[#00A3E0]">{module.feedback.finalScore}</p></div>
                      </button>
                      <div className="flex items-center gap-2 rounded-lg bg-white p-3">
                        <Clock className="size-4 text-[#00A3E0]" />
                        <div><p className="text-xs text-gray-500">Sesion XR</p><p className="font-semibold text-[#00A3E0]">{module.feedback.timeSpent} min</p></div>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-white p-3">
                        <Users className="size-4 text-[#00A3E0]" />
                        <div><p className="text-xs text-gray-500">Tipo</p><p className="font-semibold text-[#00A3E0]">{module.feedback.isGroup ? "Grupal" : "Individual"}</p></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={quizModalOpen} onOpenChange={setQuizModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl shadow-xl border-0 bg-white p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-[#00A3E0] to-[#00AEEF] p-6 text-white">
            <DialogTitle className="text-xl font-bold text-white mb-1">Detalles de la Actividad XR</DialogTitle>
            <DialogDescription className="text-white/80 text-sm">Informacion de tu sesion de practica</DialogDescription>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <Calendar className="size-6 text-[#00A3E0] mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{selectedFeedback?.completedAt || "-"}</p>
                <p className="text-xs text-gray-500">Fecha</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-[#00A3E0]">{selectedFeedback?.finalScore || "-"}</p>
                <p className="text-xs text-gray-500">Nota</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <Clock className="size-6 text-[#00A3E0] mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{selectedFeedback?.timeSpent || "0"} min</p>
                <p className="text-xs text-gray-500">Tiempo</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-gray-900">{selectedFeedback?.attempts || 1}</p>
                <p className="text-xs text-gray-500">Intentos</p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <MonitorSmartphone className="size-6 text-[#00A3E0]" />
                <div><p className="text-sm text-gray-500">Dispositivo</p><p className="font-semibold text-gray-900 capitalize">{(selectedFeedback?.deviceType || "desktop").replace("_", " ")}</p></div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 border-t">
            <button onClick={() => setQuizModalOpen(false)} className="w-full rounded-xl bg-[#00A3E0] py-3 text-sm font-medium text-white">Cerrar</button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={teamModalOpen} onOpenChange={setTeamModalOpen}>
        <DialogContent className="max-w-md rounded-2xl shadow-xl border-0 bg-white p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-[#00A3E0] to-[#00AEEF] p-6 text-white">
            <DialogTitle className="text-xl font-bold text-white mb-1">Equipo</DialogTitle>
            <DialogDescription className="text-white/80 text-sm">Sin informacion adicional disponible</DialogDescription>
          </div>
          <div className="p-4 bg-gray-50 border-t">
            <button onClick={() => setTeamModalOpen(false)} className="w-full rounded-xl bg-[#00A3E0] py-3 text-sm font-semibold text-white">Cerrar</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
