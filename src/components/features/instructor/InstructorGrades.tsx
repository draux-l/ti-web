"use client"

import { useMemo, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Search, Users, CheckCircle, Clock, Pencil } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const courses = [
  { id: "c-1", name: "Fundamentos de Realidad Virtual" },
  { id: "c-2", name: "Desarrollo de Experiencias AR" },
  { id: "c-3", name: "Unity XR Basics" },
]

const groups = [
  { id: "g-1", name: "Grupo A - Minería" },
  { id: "g-2", name: "Grupo B - Mecánica" },
  { id: "g-3", name: "Grupo C - Electricidad" },
]

type StudentGrade = {
  id: string
  experienceId: string
  experienceTitle: string
  courseId: string
  courseName: string
  studentId: string
  studentName: string
  groupId: string
  groupName: string
  score: number | null
  completed: boolean
  attempts: number
}

const initialGrades: StudentGrade[] = [
  { id: "sg-1", experienceId: "e-1", experienceTitle: "VR Lab 1 - Introducción", courseId: "c-1", courseName: "Fundamentos de Realidad Virtual", studentId: "s-1", studentName: "Ana Pérez", groupId: "g-1", groupName: "Grupo A - Minería", score: 18, completed: true, attempts: 1 },
  { id: "sg-2", experienceId: "e-1", experienceTitle: "VR Lab 1 - Introducción", courseId: "c-1", courseName: "Fundamentos de Realidad Virtual", studentId: "s-2", studentName: "Luis Gómez", groupId: "g-1", groupName: "Grupo A - Minería", score: 15, completed: true, attempts: 2 },
  { id: "sg-3", experienceId: "e-1", experienceTitle: "VR Lab 1 - Introducción", courseId: "c-1", courseName: "Fundamentos de Realidad Virtual", studentId: "s-3", studentName: "Carlos Ruiz", groupId: "g-1", groupName: "Grupo A - Minería", score: null, completed: false, attempts: 0 },
  { id: "sg-4", experienceId: "e-1", experienceTitle: "VR Lab 1 - Introducción", courseId: "c-1", courseName: "Fundamentos de Realidad Virtual", studentId: "s-4", studentName: "María López", groupId: "g-2", groupName: "Grupo B - Mecánica", score: 17, completed: true, attempts: 1 },
  { id: "sg-5", experienceId: "e-1", experienceTitle: "VR Lab 1 - Introducción", courseId: "c-1", courseName: "Fundamentos de Realidad Virtual", studentId: "s-5", studentName: "Jorge León", groupId: "g-2", groupName: "Grupo B - Mecánica", score: null, completed: false, attempts: 0 },
  { id: "sg-6", experienceId: "e-2", experienceTitle: "AR Fundamentals - Tracking", courseId: "c-2", courseName: "Desarrollo de Experiencias AR", studentId: "s-1", studentName: "Ana Pérez", groupId: "g-1", groupName: "Grupo A - Minería", score: 16, completed: true, attempts: 1 },
  { id: "sg-7", experienceId: "e-2", experienceTitle: "AR Fundamentals - Tracking", courseId: "c-2", courseName: "Desarrollo de Experiencias AR", studentId: "s-2", studentName: "Luis Gómez", groupId: "g-1", groupName: "Grupo A - Minería", score: 14, completed: true, attempts: 2 },
  { id: "sg-8", experienceId: "e-2", experienceTitle: "AR Fundamentals - Tracking", courseId: "c-2", courseName: "Desarrollo de Experiencias AR", studentId: "s-6", studentName: "Laura Díaz", groupId: "g-3", groupName: "Grupo C - Electricidad", score: null, completed: false, attempts: 0 },
]

const chartData = [
  { squad: "Grupo A", promedio: 78 },
  { squad: "Grupo B", promedio: 71 },
  { squad: "Grupo C", promedio: 83 },
]

export function InstructorGrades() {
  const [grades, setGrades] = useState<StudentGrade[]>(initialGrades)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState<{
    id: string
    title: string
    courseName: string
  } | null>(null)
  const [editingGrades, setEditingGrades] = useState<StudentGrade[]>([])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterGroupId, setFilterGroupId] = useState("todos")
  const [filterCourseId, setFilterCourseId] = useState("todos")
  const [filterExperienceId, setFilterExperienceId] = useState("todos")

  const experienceStats = useMemo(() => {
    const stats: Record<
      string,
      { id: string; title: string; courseId: string; courseName: string; totalStudents: number; completedCount: number }
    > = {}

    grades.forEach((grade) => {
      if (!stats[grade.experienceId]) {
        stats[grade.experienceId] = {
          id: grade.experienceId,
          title: grade.experienceTitle,
          courseId: grade.courseId,
          courseName: grade.courseName,
          totalStudents: 0,
          completedCount: 0,
        }
      }
      stats[grade.experienceId].totalStudents++
      if (grade.completed) {
        stats[grade.experienceId].completedCount++
      }
    })

    return Object.values(stats)
  }, [grades])

  const filteredExperienceStats = useMemo(() => {
    return experienceStats.filter((exp) => {
      const matchesCourse = filterCourseId === "todos" || exp.courseId === filterCourseId
      const matchesExperience = filterExperienceId === "todos" || exp.id === filterExperienceId
      return matchesCourse && matchesExperience
    })
  }, [experienceStats, filterCourseId, filterExperienceId])

  const availableExperiences = useMemo(() => {
    if (filterCourseId === "todos") {
      return experienceStats
    }
    return experienceStats.filter((exp) => exp.courseId === filterCourseId)
  }, [experienceStats, filterCourseId])

  const filteredStudents = useMemo(() => {
    return editingGrades.filter((grade) => {
      const matchesSearch = grade.studentName
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesGroup = filterGroupId === "todos" || grade.groupId === filterGroupId
      return matchesSearch && matchesGroup
    })
  }, [editingGrades, searchQuery, filterGroupId])

  const openDetailsModal = (experienceId: string) => {
    const exp = experienceStats.find((e) => e.id === experienceId)
    if (!exp) return

    setSelectedExperience(exp)
    setEditingGrades(grades.filter((g) => g.experienceId === experienceId))
    setSearchQuery("")
    setFilterGroupId("todos")
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedExperience(null)
    setEditingGrades([])
  }

  const updateGradeScore = (studentGradeId: string, newScore: number | null) => {
    setEditingGrades((prev) =>
      prev.map((g) => (g.id === studentGradeId ? { ...g, score: newScore } : g))
    )
  }

  const saveGrades = () => {
    const updatedGrades = grades.map((g) => {
      const edited = editingGrades.find((eg) => eg.id === g.id)
      if (edited) {
        return { ...g, score: edited.score }
      }
      return g
    })
    setGrades(updatedGrades)
    handleCloseModal()
  }

  const avgScore = useMemo(() => {
    const completed = grades.filter((g) => g.score !== null)
    if (!completed.length) return 0
    const total = completed.reduce((sum, g) => sum + (g.score || 0), 0)
    return Math.round(total / completed.length)
  }, [grades])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Calificaciones y Progreso</h1>
        <p className="text-sm text-gray-500 mt-1">
          Visualiza la evolución del grupo y actualiza puntuaciones en tiempo real.
        </p>
      </div>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="rounded-3xl bg-white shadow-sm border border-gray-200 xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Promedio por Grupo</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="squad" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="promedio" stroke="#00AEEF" fill="#00AEEF" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-3xl bg-[#FFB800] text-[#1A1A2E] shadow-sm border-0">
          <CardHeader>
            <CardTitle className="text-lg">Promedio actual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-9xl font-bold">{avgScore}</p>
            <p className="text-sm">Actualizado automáticamente al editar notas.</p>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-3xl bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-lg">Experiencias</CardTitle>
            <div className="flex flex-col gap-3 md:flex-row">
              <Select value={filterCourseId} onValueChange={(value) => {
                setFilterCourseId(value)
                setFilterExperienceId("todos")
              }}>
                <SelectTrigger className="w-full md:w-[220px] h-10 rounded-full bg-white border border-gray-200">
                  <SelectValue placeholder="Curso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los cursos</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterExperienceId} onValueChange={setFilterExperienceId}>
                <SelectTrigger className="w-full md:w-[220px] h-10 rounded-full bg-white border border-gray-200">
                  <SelectValue placeholder="Experiencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las experiencias</SelectItem>
                  {availableExperiences.map((exp) => (
                    <SelectItem key={exp.id} value={exp.id}>
                      {exp.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredExperienceStats.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500">
                No hay experiencias que coincidan con los filtros.
              </div>
            ) : (
              filteredExperienceStats.map((exp) => (
                <div
                  key={exp.id}
                  className="rounded-2xl border border-gray-200 bg-gray-50/50 p-5 transition-all duration-200 hover:bg-gray-100 hover:shadow-md"
                >
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{exp.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{exp.courseName}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-gray-500">{groups.length} grupos</span>
                    <span className="text-[#00AEEF] font-medium">
                      {exp.completedCount}/{exp.totalStudents} completaron
                    </span>
                  </div>
                  <Button
                    onClick={() => openDetailsModal(exp.id)}
                    variant="outline"
                    className="w-full rounded-full border-[#00AEEF] text-[#00AEEF] hover:bg-[#00AEEF]/10 hover:scale-105 transition-all duration-200"
                  >
                    <Pencil className="size-4 mr-2" />
                    Editar notas
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[600px] rounded-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedExperience?.title}</DialogTitle>
            <DialogDescription>{selectedExperience?.courseName}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar estudiante..."
                  className="pl-9 h-10 rounded-xl bg-slate-50"
                />
              </div>
              <Select value={filterGroupId} onValueChange={setFilterGroupId}>
                <SelectTrigger className="w-full sm:w-[180px] h-10 rounded-xl bg-slate-50">
                  <SelectValue placeholder="Grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los grupos</SelectItem>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 max-h-[400px] pr-2">
              {filteredStudents.length === 0 ? (
                <p className="text-center text-sm text-gray-500 py-8">
                  No se encontraron estudiantes
                </p>
              ) : (
                filteredStudents.map((grade) => (
                  <div
                    key={grade.id}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex size-10 items-center justify-center rounded-full bg-[#00AEEF]/10">
                        <span className="text-sm font-bold text-[#00AEEF]">
                          {grade.studentName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{grade.studentName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{grade.groupName}</span>
                          {grade.completed ? (
                            <Badge className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0">
                              <CheckCircle className="size-3 mr-1" />
                              Completado
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0">
                              <Clock className="size-3 mr-1" />
                              Pendiente
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {grade.completed ? (
                        <Input
                          type="number"
                          min={0}
                          max={20}
                          value={grade.score ?? ""}
                          onChange={(e) =>
                            updateGradeScore(
                              grade.id,
                              e.target.value ? Number(e.target.value) : null
                            )
                          }
                          className="h-9 w-16 rounded-lg text-center font-medium"
                          placeholder="—"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm w-16 text-center">—</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              className="rounded-full"
            >
              Cerrar
            </Button>
            <Button
              type="button"
              onClick={saveGrades}
              className="rounded-full bg-[#00AEEF] hover:bg-[#33C4F4] text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}