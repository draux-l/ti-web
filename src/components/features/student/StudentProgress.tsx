"use client"

import { useMemo, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { Trophy, Target, TrendingUp, Calendar, Filter, X } from "lucide-react"

interface GroupExperience {
  id: string
  experience_id: string
  user_id: string
  group_id: string
  final_score: number
  attempts: number
  status: "completed" | "in_progress" | "failed" | "pending"
  time_spent: number
  device_type: "vr_headset" | "desktop" | "mobile" | "tablet"
  started_at: string
  completed_at: string
}

interface Experience {
  id: string
  course_id: string
  title: string
}

interface Course {
  id: string
  name: string
}

const mockGroupExperiences: GroupExperience[] = [
  { id: "1", experience_id: "1", user_id: "1", group_id: "g1", final_score: 16, attempts: 1, status: "completed", time_spent: 2100, device_type: "vr_headset", started_at: "2024-01-15T10:00:00Z", completed_at: "2024-01-15T10:35:00Z" },
  { id: "2", experience_id: "2", user_id: "1", group_id: "g2", final_score: 14, attempts: 2, status: "completed", time_spent: 2880, device_type: "desktop", started_at: "2024-01-16T09:00:00Z", completed_at: "2024-01-16T09:48:00Z" },
  { id: "3", experience_id: "3", user_id: "1", group_id: "g3", final_score: 18, attempts: 1, status: "completed", time_spent: 2520, device_type: "vr_headset", started_at: "2024-01-17T14:00:00Z", completed_at: "2024-01-17T14:42:00Z" },
  { id: "4", experience_id: "4", user_id: "1", group_id: "g4", final_score: 15, attempts: 1, status: "completed", time_spent: 4080, device_type: "desktop", started_at: "2024-01-18T11:00:00Z", completed_at: "2024-01-18T12:08:00Z" },
  { id: "5", experience_id: "5", user_id: "1", group_id: "g5", final_score: 17, attempts: 1, status: "completed", time_spent: 4920, device_type: "vr_headset", started_at: "2024-01-19T10:00:00Z", completed_at: "2024-01-19T11:22:00Z" },
  { id: "6", experience_id: "6", user_id: "1", group_id: "g6", final_score: 12, attempts: 2, status: "completed", time_spent: 2520, device_type: "mobile", started_at: "2024-01-20T09:00:00Z", completed_at: "2024-01-20T09:42:00Z" },
  { id: "7", experience_id: "7", user_id: "1", group_id: "g7", final_score: 12, attempts: 2, status: "completed", time_spent: 3900, device_type: "desktop", started_at: "2024-01-21T15:00:00Z", completed_at: "2024-01-21T16:05:00Z" },
  { id: "8", experience_id: "8", user_id: "1", group_id: "g8", final_score: 15, attempts: 1, status: "completed", time_spent: 4320, device_type: "vr_headset", started_at: "2024-01-22T10:00:00Z", completed_at: "2024-01-22T11:12:00Z" },
  { id: "9", experience_id: "9", user_id: "1", group_id: "g9", final_score: 14, attempts: 1, status: "completed", time_spent: 3480, device_type: "tablet", started_at: "2024-01-23T14:00:00Z", completed_at: "2024-01-23T14:58:00Z" },
  { id: "10", experience_id: "10", user_id: "1", group_id: "g10", final_score: 0, attempts: 0, status: "in_progress", time_spent: 1800, device_type: "desktop", started_at: "2024-01-24T10:00:00Z", completed_at: "" },
  { id: "11", experience_id: "11", user_id: "1", group_id: "g11", final_score: 0, attempts: 0, status: "pending", time_spent: 0, device_type: "desktop", started_at: "", completed_at: "" },
]

const mockExperiences: Experience[] = [
  { id: "1", course_id: "1", title: "Introducción a la Electricidad" },
  { id: "2", course_id: "1", title: "Circuitos en Serie y Paralelo" },
  { id: "3", course_id: "1", title: "Ley de Ohm y Potencia" },
  { id: "4", course_id: "1", title: "Sistemas Trifásicos" },
  { id: "5", course_id: "1", title: "Motores Eléctricos" },
  { id: "6", course_id: "2", title: "Fundamentos de Mecánica" },
  { id: "7", course_id: "2", title: "Sistemas Hidráulicos" },
  { id: "8", course_id: "2", title: "Motor Diesel" },
  { id: "9", course_id: "2", title: "Transmisión y Tren de Fuerza" },
  { id: "10", course_id: "2", title: "Simulación VR - Excavadora" },
  { id: "11", course_id: "2", title: "Mantenimiento Preventivo" },
]

const mockCourses: Course[] = [
  { id: "1", name: "Electricidad Industrial" },
  { id: "2", name: "Mecánica de Maquinaria Pesada" },
]

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function getCourseName(experienceId: string): string {
  const experience = mockExperiences.find(e => e.id === experienceId)
  if (!experience) return "Curso Desconocido"
  const course = mockCourses.find(c => c.id === experience.course_id)
  return course?.name || "Curso Desconocido"
}

function getExperienceTitle(experienceId: string): string {
  const experience = mockExperiences.find(e => e.id === experienceId)
  return experience?.title || "Módulo Desconocido"
}

function getGradeColor(score: number): string {
  const percentage = (score / 20) * 100
  if (percentage >= 80) return "text-green-600 bg-green-50"
  if (percentage >= 70) return "text-yellow-600 bg-yellow-50"
  return "text-red-600 bg-red-50"
}

function getStatusBadge(status: string): { label: string; className: string } {
  switch (status) {
    case "completed":
      return { label: "Aprobado", className: "bg-green-100 text-green-700" }
    case "failed":
      return { label: "Mejorable", className: "bg-red-100 text-red-700" }
    case "in_progress":
      return { label: "En Progreso", className: "bg-blue-100 text-blue-700" }
    default:
      return { label: "Pendiente", className: "bg-gray-100 text-gray-700" }
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—"
  const date = new Date(dateStr)
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export function StudentProgress() {
  const [filters, setFilters] = useState({
    course: "",
    status: "",
    module: "",
    dateFrom: "",
    dateTo: "",
  })

  const hasActiveFilters = filters.course || filters.status || filters.module || filters.dateFrom || filters.dateTo

  const filteredData = useMemo(() => {
    return mockGroupExperiences.filter(exp => {
      const experience = mockExperiences.find(e => e.id === exp.experience_id)
      const course = experience ? mockCourses.find(c => c.id === experience.course_id) : null
      
      if (filters.course && course?.id !== filters.course) return false
      if (filters.status && exp.status !== filters.status) return false
      if (filters.module && experience?.id !== filters.module) return false
      
      if (filters.dateFrom && exp.completed_at) {
        if (new Date(exp.completed_at) < new Date(filters.dateFrom)) return false
      }
      if (filters.dateTo && exp.completed_at) {
        if (new Date(exp.completed_at) > new Date(filters.dateTo)) return false
      }
      
      return true
    })
  }, [filters])

  const clearFilters = () => {
    setFilters({ course: "", status: "", module: "", dateFrom: "", dateTo: "" })
  }

  const stats = useMemo(() => {
    const completed = mockGroupExperiences.filter(e => e.status === "completed")
    const totalEvaluations = mockGroupExperiences.filter(e => e.status !== "pending").length
    const averageScore = completed.length > 0
      ? completed.reduce((sum, e) => sum + e.final_score, 0) / completed.length
      : 0
    const bestScore = completed.length > 0
      ? Math.max(...completed.map(e => e.final_score))
      : 0
    const approvalRate = totalEvaluations > 0
      ? (completed.length / totalEvaluations) * 100
      : 0
    const totalTimeSeconds = mockGroupExperiences.reduce((sum, e) => sum + e.time_spent, 0)
    const totalHours = Math.round(totalTimeSeconds / 3600 * 10) / 10
    
    return {
      totalEvaluations,
      averageScore: Math.round(averageScore * 10) / 10,
      bestScore,
      approvalRate: Math.round(approvalRate),
      completedCourses: completed.length,
      totalHours,
    }
  }, [])

  const chartData = useMemo(() => {
    const completed = mockGroupExperiences
      .filter(e => e.status === "completed")
      .sort((a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime())
    
    return completed.map((exp, index) => ({
      name: `E${index + 1}`,
      score: exp.final_score,
      date: formatDate(exp.completed_at),
      percentage: (exp.final_score / 20) * 100,
    }))
  }, [])

  const courseCompletion = useMemo(() => {
    const completed = mockGroupExperiences.filter(e => e.status === "completed").length
    const inProgress = mockGroupExperiences.filter(e => e.status === "in_progress").length
    const pending = mockGroupExperiences.filter(e => e.status === "pending").length
    
    return [
      { name: "Completados", value: completed, color: "#10B981" },
      { name: "En progreso", value: inProgress, color: "#00A3E0" },
      { name: "Pendientes", value: pending, color: "#E5E7EB" },
    ]
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Progreso</h1>
        <p className="mt-1 text-gray-500">Resumen de tu actividad y calificaciones</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Trophy className="size-4" />
            Promedio General
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.averageScore}/20</p>
          <p className="mt-1 text-xs text-green-600">
            {((stats.averageScore / 20) * 100).toFixed(0)}% de efectividad
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Target className="size-4" />
            Mejor Nota
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.bestScore}/20</p>
          <p className="mt-1 text-xs text-gray-500">
            {((stats.bestScore / 20) * 100).toFixed(0)}% de efectividad
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <TrendingUp className="size-4" />
            Evaluaciones
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalEvaluations}</p>
          <p className="mt-1 text-xs text-gray-500">
            {stats.approvalRate}% aprobación
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="size-4" />
            Tiempo Total
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalHours}h</p>
          <p className="mt-1 text-xs text-gray-500">En plataforma XR</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Evolución de Notas
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis domain={[0, 20]} stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                  }}
                  formatter={(value: number) => [`${value}/20 (${((value / 20) * 100).toFixed(0)}%)`, "Nota"]}
                  labelFormatter={(label) => `Evaluación ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#00A3E0"
                  strokeWidth={3}
                  dot={{ fill: "#00A3E0", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey={() => 16}
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Objetivo (80%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Estado de Evaluaciones
          </h2>
          <div className="flex h-64 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseCompletion} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#6B7280" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#6B7280" fontSize={12} width={100} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                  }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {courseCompletion.map((entry, index) => (
                    <Bar key={`cell-${index}`} fill={entry.color} dataKey="value" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Historial de Calificaciones
        </h2>

        <div className="mb-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Filtros:</span>
            </div>
            
            <select
              value={filters.course}
              onChange={(e) => setFilters({ ...filters, course: e.target.value })}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A3E0]/50"
            >
              <option value="">Todos los cursos</option>
              {mockCourses.map((course) => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>

            <select
              value={filters.module}
              onChange={(e) => setFilters({ ...filters, module: e.target.value })}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A3E0]/50"
            >
              <option value="">Todos los módulos</option>
              {mockExperiences.map((exp) => (
                <option key={exp.id} value={exp.id}>{exp.title}</option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A3E0]/50"
            >
              <option value="">Todos los estados</option>
              <option value="completed">Aprobado</option>
              <option value="failed">Mejorable</option>
              <option value="in_progress">En Progreso</option>
            </select>

            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              placeholder="Desde"
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A3E0]/50"
            />

            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              placeholder="Hasta"
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A3E0]/50"
            />

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200"
              >
                <X className="size-4" />
                Limpiar
              </button>
            )}
          </div>

          <p className="text-sm text-gray-500">
            Mostrando {filteredData.filter(e => e.status !== "pending").length} resultados
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-3 text-sm font-medium text-gray-500">Fecha</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Módulo</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Curso</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Tiempo</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Nota</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData
                .filter(e => e.status !== "pending")
                .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
                .map((exp) => {
                  const badge = getStatusBadge(exp.status)
                  return (
                    <tr key={exp.id} className="hover:bg-gray-50">
                      <td className="py-3 text-sm text-gray-900">
                        {formatDate(exp.completed_at)}
                      </td>
                      <td className="py-3 text-sm text-gray-900">
                        {getExperienceTitle(exp.experience_id)}
                      </td>
                      <td className="py-3 text-sm text-gray-500">
                        {getCourseName(exp.experience_id)}
                      </td>
                      <td className="py-3 text-sm text-gray-500">
                        {formatTime(exp.time_spent)}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getGradeColor(exp.final_score)}`}>
                          {exp.final_score}/20
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${badge.className}`}>
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}