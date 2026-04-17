"use client"

import { useState } from "react"
import { ArrowLeft, Play, FileText, CheckCircle2, Circle, Lock, Clock, Users, Award, Calendar, MonitorSmartphone } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface ExperienceData {
  finalScore: number
  attempts: number
  status: "completed" | "in_progress" | "failed" | "pending"
  timeSpent: number
  deviceType: "vr_headset" | "desktop" | "mobile" | "tablet"
  startedAt: string
  completedAt: string
  isGroup: boolean
  memberCount: number
}

const mockTeamMembers: TeamMember[] = [
  { id: "1", name: "María González", avatar: "MG", role: "Líder de Equipo" },
  { id: "2", name: "Carlos Rodríguez", avatar: "CR", role: "Especialista" },
  { id: "3", name: "Ana Martínez", avatar: "AM", role: "Analista" },
  { id: "4", name: "Pedro Sánchez", avatar: "PS", role: "Técnico" },
  { id: "5", name: "Laura Torres", avatar: "LT", role: "Coordinadora" },
]

interface StudentCourseDetailProps {
  courseId: string
  onBack: () => void
  onOpenXRCode: () => void
}

const mockCourseDetails: Record<string, { name: string; description: string; modules: { id: string; title: string; completed: boolean; locked: boolean; duration: string; feedback?: ExperienceData }[] }> = {
  "1": {
    name: "Electricidad Industrial",
    description: "Aprende los fundamentos de la electricidad industrial, circuitos trifásicos y sistemas de distribución.",
    modules: [
      { id: "1-1", title: "Introducción a la Electricidad", completed: true, locked: false, duration: "45 min", feedback: { finalScore: 16, attempts: 1, status: "completed", timeSpent: 35, deviceType: "vr_headset", startedAt: "2024-01-15", completedAt: "15/01/2024", isGroup: false, memberCount: 1 } },
      { id: "1-2", title: "Circuitos en Serie y Paralelo", completed: true, locked: false, duration: "60 min", feedback: { finalScore: 14, attempts: 2, status: "completed", timeSpent: 48, deviceType: "desktop", startedAt: "2024-01-16", completedAt: "16/01/2024", isGroup: true, memberCount: 3 } },
      { id: "1-3", title: "Ley de Ohm y Potencia", completed: true, locked: false, duration: "55 min", feedback: { finalScore: 18, attempts: 1, status: "completed", timeSpent: 42, deviceType: "vr_headset", startedAt: "2024-01-17", completedAt: "17/01/2024", isGroup: false, memberCount: 1 } },
      { id: "1-4", title: "Sistemas Trifásicos", completed: true, locked: false, duration: "75 min", feedback: { finalScore: 15, attempts: 1, status: "completed", timeSpent: 68, deviceType: "desktop", startedAt: "2024-01-18", completedAt: "18/01/2024", isGroup: true, memberCount: 4 } },
      { id: "1-5", title: "Motores Eléctricos", completed: true, locked: false, duration: "90 min", feedback: { finalScore: 17, attempts: 1, status: "completed", timeSpent: 82, deviceType: "vr_headset", startedAt: "2024-01-19", completedAt: "19/01/2024", isGroup: false, memberCount: 1 } },
      { id: "1-6", title: "Análisis de Circuitos VR", completed: false, locked: false, duration: "120 min" },
      { id: "1-7", title: "Diagnóstico de Fallas", completed: false, locked: true, duration: "90 min" },
      { id: "1-8", title: "Evaluación Final", completed: false, locked: true, duration: "60 min" },
    ],
  },
  "2": {
    name: "Mecánica de Maquinaria Pesada",
    description: "Conoce los principales sistemas mecánicos de maquinaria pesada y su mantenimiento preventivo.",
    modules: [
      { id: "2-1", title: "Fundamentos de Mecánica", completed: true, locked: false, duration: "50 min", feedback: { finalScore: 13, attempts: 1, status: "completed", timeSpent: 42, deviceType: "mobile", startedAt: "2024-01-20", completedAt: "20/01/2024", isGroup: false, memberCount: 1 } },
      { id: "2-2", title: "Sistemas Hidráulicos", completed: true, locked: false, duration: "70 min", feedback: { finalScore: 12, attempts: 2, status: "completed", timeSpent: 65, deviceType: "desktop", startedAt: "2024-01-21", completedAt: "21/01/2024", isGroup: true, memberCount: 2 } },
      { id: "2-3", title: "Motor Diesel", completed: true, locked: false, duration: "80 min", feedback: { finalScore: 15, attempts: 1, status: "completed", timeSpent: 72, deviceType: "vr_headset", startedAt: "2024-01-22", completedAt: "22/01/2024", isGroup: false, memberCount: 1 } },
      { id: "2-4", title: "Transmisión y Tren de Fuerza", completed: true, locked: false, duration: "65 min", feedback: { finalScore: 14, attempts: 1, status: "completed", timeSpent: 58, deviceType: "tablet", startedAt: "2024-01-23", completedAt: "23/01/2024", isGroup: true, memberCount: 3 } },
      { id: "2-5", title: "Simulación VR - Excavadora", completed: false, locked: false, duration: "120 min" },
      { id: "2-6", title: "Mantenimiento Preventivo", completed: false, locked: true, duration: "55 min" },
      { id: "2-7", title: "Diagnóstico de Averías", completed: false, locked: true, duration: "75 min" },
      { id: "2-8", title: "Evaluación Final", completed: false, locked: true, duration: "60 min" },
    ],
  },
}

function FeedbackPanel({ 
  feedback, 
  onOpenQuiz,
  onOpenTeam 
}: { 
  feedback: ExperienceData
  onOpenQuiz: () => void
  onOpenTeam: () => void
}) {
  const typeLabel = feedback.memberCount === 1 ? "Individual" : "Grupal"
  
  return (
    <div className="mt-4 rounded-xl bg-green-50 p-4">
      <h4 className="mb-3 text-sm font-semibold text-green-700">Feedback de tu práctica</h4>
      <div className="grid grid-cols-3 gap-4">
        <button 
          onClick={onOpenQuiz}
          className="flex items-center gap-2 rounded-lg bg-green-100 p-3 transition-all hover:bg-green-200 cursor-pointer"
        >
          <Award className="size-4 text-green-600" />
          <div>
            <p className="text-xs text-gray-500">Nota</p>
            <p className="font-semibold text-green-700">
              {feedback.finalScore}
            </p>
          </div>
        </button>
        <div className="flex items-center gap-2 rounded-lg bg-green-100 p-3">
          <Clock className="size-4 text-green-600" />
          <div>
            <p className="text-xs text-gray-500">Sesión XR</p>
            <p className="font-semibold text-gray-900">{feedback.timeSpent} min</p>
          </div>
        </div>
        {feedback.memberCount > 1 ? (
          <button 
            onClick={onOpenTeam}
            className="flex items-center gap-2 rounded-lg bg-green-100 p-3 transition-all hover:bg-green-200 cursor-pointer"
          >
            <Users className="size-4 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Tipo</p>
              <p className="font-semibold text-green-700">
                {typeLabel}
              </p>
            </div>
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-lg bg-green-100 p-3">
            <Users className="size-4 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Tipo</p>
              <p className="font-semibold text-gray-900">{typeLabel}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function StudentCourseDetail({ courseId, onBack, onOpenXRCode }: StudentCourseDetailProps) {
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null)
  const [quizModalOpen, setQuizModalOpen] = useState(false)
  const [teamModalOpen, setTeamModalOpen] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<ExperienceData | null>(null)
  const course = mockCourseDetails[courseId] || mockCourseDetails["1"]
  const completedCount = course.modules.filter((m) => m.completed).length
  const progress = Math.round((completedCount / course.modules.length) * 100)

  const handleOpenQuiz = (feedback: ExperienceData) => {
    setSelectedFeedback(feedback)
    setQuizModalOpen(true)
  }

  const handleOpenTeam = (feedback: ExperienceData) => {
    setSelectedFeedback(feedback)
    setTeamModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="size-4" />
        Volver a cursos
      </button>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
          <p className="mt-2 text-gray-500">{course.description}</p>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-gray-500">Progreso del curso</span>
              <span className="font-medium text-gray-900">{progress}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#00A3E0] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Contenido del curso</h2>
          <span className="text-sm text-gray-500">
            {completedCount} de {course.modules.length} completados
          </span>
        </div>

        <div className="space-y-2">
          {course.modules.map((module, index) => (
            <div
              key={module.id}
              className={`rounded-xl transition-colors ${
                module.locked
                  ? "bg-gray-50 opacity-60"
                  : module.completed
                  ? "bg-green-50"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-4 p-4">
                <div className="flex size-8 items-center justify-center rounded-full">
                  {module.locked ? (
                    <Lock className="size-4 text-gray-400" />
                  ) : module.completed ? (
                    <CheckCircle2 className="size-5 text-green-600" />
                  ) : (
                    <Circle className="size-5 text-gray-400" />
                  )}
                </div>

                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      module.locked ? "text-gray-400" : "text-gray-900"
                    }`}
                  >
                    {index + 1}. {module.title}
                  </p>
                  <p className="text-xs text-gray-500">{module.duration}</p>
                </div>

                {!module.locked && !module.completed && (
                  <button
                    onClick={onOpenXRCode}
                    className="flex items-center gap-2 rounded-full bg-[#00A3E0] px-4 py-2 text-sm font-medium text-white hover:bg-[#00A3E0]/90"
                  >
                    <Play className="size-4" />
                    Iniciar
                  </button>
                )}

                {!module.locked && module.completed && (
                  <button
                    onClick={() => setExpandedFeedback(expandedFeedback === module.id ? null : module.id)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      expandedFeedback === module.id
                        ? "border-green-500 bg-green-100 text-green-700"
                        : "border-[#00A3E0] text-[#00A3E0] hover:bg-blue-50"
                    }`}
                  >
                    <FileText className="size-4" />
                    {expandedFeedback === module.id ? "Ocultar" : "Revisar"}
                  </button>
                )}
              </div>

              {expandedFeedback === module.id && module.feedback && (
                <FeedbackPanel 
                  feedback={module.feedback} 
                  onOpenQuiz={() => handleOpenQuiz(module.feedback!)}
                  onOpenTeam={() => handleOpenTeam(module.feedback!)}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={quizModalOpen} onOpenChange={setQuizModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl shadow-xl border-0 bg-white p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-[#00A3E0] to-[#00AEEF] p-6 text-white">
            <DialogTitle className="text-xl font-bold text-white mb-1">
              Detalles de la Actividad XR
            </DialogTitle>
            <DialogDescription className="text-white/80 text-sm">
              Información de tu sesión de práctica
            </DialogDescription>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <Calendar className="size-6 text-[#00A3E0] mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{selectedFeedback?.completedAt || "—"}</p>
                <p className="text-xs text-gray-500">Fecha</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-[#00A3E0]">{selectedFeedback?.finalScore || "—"}</p>
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
                <div>
                  <p className="text-sm text-gray-500">Dispositivo</p>
                  <p className="font-semibold text-gray-900 capitalize">{selectedFeedback?.deviceType?.replace("_", " ") || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t">
            <button
              onClick={() => setQuizModalOpen(false)}
              className="w-full rounded-xl bg-[#00A3E0] py-3 text-sm font-medium text-white transition-colors hover:bg-[#00A3E0]/90"
            >
              Cerrar
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={teamModalOpen} onOpenChange={setTeamModalOpen}>
        <DialogContent className="max-w-md rounded-2xl shadow-xl border-0 bg-white p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-[#00A3E0] to-[#00AEEF] p-6 text-white">
            <DialogTitle className="text-xl font-bold text-white mb-1">
              {selectedFeedback?.memberCount === 1 ? "Participante" : "Integrantes del Equipo"}
            </DialogTitle>
            <DialogDescription className="text-white/80 text-sm">
              {selectedFeedback?.memberCount === 1 
                ? "Miembro que participó en esta actividad individual" 
                : "Miembros que participaron en esta actividad grupal"}
            </DialogDescription>
          </div>
          
          <div className="p-6">
            <div className="space-y-3">
              {mockTeamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="relative">
                    <div className="size-12 rounded-full bg-gradient-to-br from-[#00A3E0] to-[#00AEEF] flex items-center justify-center text-white font-semibold text-sm">
                      {member.avatar}
                    </div>
                    <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-green-500 border-2 border-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t">
            <button
              onClick={() => setTeamModalOpen(false)}
              className="w-full rounded-xl bg-[#00A3E0] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#00A3E0]/90"
            >
              Cerrar
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
