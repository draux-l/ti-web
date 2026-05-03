"use client"

import { useMemo, useState } from "react"
import { CalendarDays, PlusCircle, MinusCircle, RotateCcw, Trash2, Search } from "lucide-react"
import { toast } from "sonner"

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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const courses = [
  { id: "c-1", name: "Fundamentos de Realidad Virtual" },
  { id: "c-2", name: "Desarrollo de Experiencias AR" },
  { id: "c-3", name: "Unity XR Basics" },
  { id: "c-4", name: "Diseño de Experiencias Inmersivas" },
]

const groups = [
  { id: "g-1", name: "Grupo A - Minería" },
  { id: "g-2", name: "Grupo B - Mecánica" },
  { id: "g-3", name: "Grupo C - Electricidad" },
]

const courseExperiences: Record<string, { id: string; title: string }[]> = {
  "c-1": [
    { id: "e-1", title: "VR Lab 1 - Introducción" },
    { id: "e-2", title: "VR Lab 2 - Instalación del Ambiente" },
    { id: "e-3", title: "VR Lab 3 - Configuración SDK" },
  ],
  "c-2": [
    { id: "e-4", title: "AR Fundamentals - Tracking" },
    { id: "e-5", title: "AR Interactions - Gestures" },
  ],
  "c-3": [
    { id: "e-6", title: "Unity Setup & Interface" },
    { id: "e-7", title: "XR Interaction Toolkit" },
    { id: "e-8", title: "Building VR Scenes" },
    { id: "e-9", title: "Optimization Techniques" },
  ],
  "c-4": [
    { id: "e-10", title: "UX Principles for XR" },
    { id: "e-11", title: "Spatial Design Basics" },
    { id: "e-12", title: "User Testing in VR" },
  ],
}

type Assignment = {
  id: string
  experienceId: string
  experienceTitle: string
  courseId: string
  courseName: string
  groupId: string
  groupName: string
  dueDate: string
  dueTime: string
  attempts: number
  enabled: boolean
}

const initialAssignments: Assignment[] = [
  {
    id: "a-1",
    experienceId: "e-1",
    experienceTitle: "VR Lab 1 - Introducción",
    courseId: "c-1",
    courseName: "Fundamentos de Realidad Virtual",
    groupId: "g-1",
    groupName: "Grupo A - Minería",
    dueDate: "2026-05-01",
    dueTime: "14:30",
    attempts: 3,
    enabled: true,
  },
  {
    id: "a-2",
    experienceId: "e-4",
    experienceTitle: "AR Fundamentals - Tracking",
    courseId: "c-2",
    courseName: "Desarrollo de Experiencias AR",
    groupId: "g-2",
    groupName: "Grupo B - Mecánica",
    dueDate: "2026-05-10",
    dueTime: "10:00",
    attempts: 2,
    enabled: false,
  },
  {
    id: "a-3",
    experienceId: "e-6",
    experienceTitle: "Unity Setup & Interface",
    courseId: "c-3",
    courseName: "Unity XR Basics",
    groupId: "g-3",
    groupName: "Grupo C - Electricidad",
    dueDate: "2026-05-20",
    dueTime: "09:00",
    attempts: 3,
    enabled: true,
  },
]

export function InstructorExperiences() {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [selectedCourseId, setSelectedCourseId] = useState("")
  const [selectedExperienceId, setSelectedExperienceId] = useState("")
  const [selectedGroupId, setSelectedGroupId] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [dueTime, setDueTime] = useState("")

  const [searchQuery, setSearchQuery] = useState("")
  const [filterCourseId, setFilterCourseId] = useState("todos")
  const [filterDate, setFilterDate] = useState("todos")
  const [filterStatus, setFilterStatus] = useState("todos")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const experiencesOfCourse = useMemo(() => {
    return selectedCourseId ? courseExperiences[selectedCourseId] || [] : []
  }, [selectedCourseId])

  const filteredAssignments = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString().split("T")[0]

    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    const nextWeekStr = nextWeek.toISOString().split("T")[0]

    const nextMonth = new Date(today)
    nextMonth.setDate(nextMonth.getDate() + 30)
    const nextMonthStr = nextMonth.toISOString().split("T")[0]

    return assignments
      .filter((item) => {
        const matchesSearch = item.experienceTitle
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
        const matchesCourse =
          filterCourseId === "todos" || item.courseId === filterCourseId

        let matchesDate = true
        if (filterDate === "esta-semana") {
          matchesDate = item.dueDate >= todayStr && item.dueDate <= nextWeekStr
        } else if (filterDate === "este-mes") {
          matchesDate = item.dueDate >= todayStr && item.dueDate <= nextMonthStr
        } else if (filterDate === "proximos-7") {
          matchesDate = item.dueDate >= todayStr && item.dueDate <= nextWeekStr
        } else if (filterDate === "proximos-30") {
          matchesDate = item.dueDate >= todayStr && item.dueDate <= nextMonthStr
        }

        const matchesStatus =
          filterStatus === "todos" ||
          (filterStatus === "habilitada" && item.enabled) ||
          (filterStatus === "deshabilitada" && !item.enabled)
        return matchesSearch && matchesCourse && matchesDate && matchesStatus
      })
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  }, [assignments, searchQuery, filterCourseId, filterDate, filterStatus])

  const openAssignModal = () => {
    setSelectedCourseId(courses[0].id)
    setSelectedExperienceId("")
    setSelectedGroupId(groups[0].id)
    setDueDate("")
    setDueTime("")
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCourseId("")
    setSelectedExperienceId("")
    setSelectedGroupId("")
    setDueDate("")
    setDueTime("")
    setIsSubmitting(false)
  }

  const handleAssign = () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    const course = courses.find((c) => c.id === selectedCourseId)
    const experience = experiencesOfCourse.find((e) => e.id === selectedExperienceId)
    const group = groups.find((g) => g.id === selectedGroupId)

    if (!course || !experience || !group || !dueDate || !dueTime) { setIsSubmitting(false); return }

    const newAssignment: Assignment = {
      id: `a-${Date.now()}`,
      experienceId: experience.id,
      experienceTitle: experience.title,
      courseId: course.id,
      courseName: course.name,
      groupId: group.id,
      groupName: group.name,
      dueDate,
      dueTime,
      attempts: 3,
      enabled: true,
    }

    setAssignments([newAssignment, ...assignments])
    handleCloseModal()
  }

  const updateAttempts = (id: string, delta: number) => {
    setAssignments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, attempts: Math.max(1, item.attempts + delta) } : item
      )
    )
  }

  const updateDueDate = (id: string, date: string, time: string) => {
    setAssignments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, dueDate: date, dueTime: time } : item
      )
    )
  }

  const toggleEnabled = (id: string) => {
    setAssignments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    )
  }

  const deleteAssignment = (id: string) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    toast.warning("¿Eliminar esta asignación?", {
      description: "La asignación será eliminada permanentemente",
      action: {
        label: "Eliminar",
        onClick: () => {
          setAssignments((prev) => prev.filter((item) => item.id !== id))
          toast.success("Asignación eliminada")
        }
      },
      cancel: { label: "Cancelar", onClick: () => {} },
      onDismiss: () => setIsSubmitting(false)
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Control de Experiencias</h1>
        <p className="text-sm text-gray-500 mt-1">
          Asigna experiencias a grupos, reprograma fechas y controla intentos.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar experiencia..."
            className="pl-9 h-10 rounded-full bg-white border border-gray-200"
          />
        </div>
        <Select value={filterCourseId} onValueChange={setFilterCourseId}>
          <SelectTrigger className="w-full sm:w-[200px] h-10 rounded-full bg-white border border-gray-200">
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
        <Select value={filterDate} onValueChange={setFilterDate}>
          <SelectTrigger className="w-full sm:w-[180px] h-10 rounded-full bg-white border border-gray-200">
            <SelectValue placeholder="Fecha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas las fechas</SelectItem>
            <SelectItem value="esta-semana">Esta semana</SelectItem>
            <SelectItem value="este-mes">Este mes</SelectItem>
            <SelectItem value="proximos-7">Próximos 7 días</SelectItem>
            <SelectItem value="proximos-30">Próximos 30 días</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[160px] h-10 rounded-full bg-white border border-gray-200">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="habilitada">Habilitadas</SelectItem>
            <SelectItem value="deshabilitada">Deshabilitadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="rounded-3xl bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Asignaciones</CardTitle>
            <Button
              onClick={openAssignModal}
              className="rounded-full bg-[#00AEEF] hover:bg-[#33C4F4] text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <PlusCircle className="size-4 mr-2" />
              Nueva Asignación
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredAssignments.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-8">
              No hay asignaciones que coincidan con los filtros.
            </p>
          ) : (
            filteredAssignments.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4 transition-all duration-200 hover:bg-gray-100"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{item.experienceTitle}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          item.enabled
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {item.enabled ? "Habilitada" : "Vencida/Bloqueada"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {item.courseName} • {item.groupName}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                      {item.dueDate} {item.dueTime}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAssignment(item.id)}
                      className="size-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="mb-2 text-xs font-semibold text-gray-500 uppercase">
                      Reprogramar fecha y hora
                    </p>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-[#00AEEF]" />
                      <Input
                        type="date"
                        value={item.dueDate}
                        onChange={(e) => updateDueDate(item.id, e.target.value, item.dueTime)}
                        className="h-8 rounded-lg bg-slate-50 text-sm"
                      />
                      <Input
                        type="time"
                        value={item.dueTime}
                        onChange={(e) => updateDueDate(item.id, item.dueDate, e.target.value)}
                        className="h-8 rounded-lg bg-slate-50 text-sm w-20"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="mb-2 text-xs font-semibold text-gray-500 uppercase">
                      Intentos máximos
                    </p>
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        className="h-8 rounded-full text-gray-600 hover:bg-slate-50 hover:scale-105 transition-all duration-200"
                        onClick={() => updateAttempts(item.id, -1)}
                      >
                        <MinusCircle className="size-4" />
                      </Button>
                      <span className="text-xl font-bold text-[#1A1A2E]">{item.attempts}</span>
                      <Button
                        variant="ghost"
                        className="h-8 rounded-full text-gray-600 hover:bg-slate-50 hover:scale-105 transition-all duration-200"
                        onClick={() => updateAttempts(item.id, 1)}
                      >
                        <PlusCircle className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="mb-2 text-xs font-semibold text-gray-500 uppercase">
                      Rehabilitar acceso
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => toggleEnabled(item.id)}
                      className="h-8 w-full rounded-full border-[#00AEEF] text-[#00AEEF] hover:bg-blue-50 hover:text-[#0098d1] hover:scale-105 transition-all duration-200 text-xs"
                    >
                      <RotateCcw className="size-3 mr-1" />
                      {item.enabled ? "Deshabilitar" : "Rehabilitar"}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Nueva Asignación</DialogTitle>
            <DialogDescription>
              Selecciona una experiencia y asígnala a un grupo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <Label>Seleccionar Curso</Label>
              <Select
                value={selectedCourseId}
                onValueChange={(value) => {
                  setSelectedCourseId(value)
                  setSelectedExperienceId("")
                }}
              >
                <SelectTrigger className="rounded-xl bg-slate-50">
                  <SelectValue placeholder="Selecciona un curso" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCourseId && (
              <div className="flex flex-col gap-2">
                <Label>Experiencias del curso</Label>
                <RadioGroup
                  value={selectedExperienceId}
                  onValueChange={setSelectedExperienceId}
                  className="max-h-40 overflow-y-auto rounded-xl border border-gray-200 bg-slate-50 p-2"
                >
                  {experiencesOfCourse.length === 0 ? (
                    <p className="p-3 text-center text-sm text-gray-500">
                      Este curso no tiene experiencias
                    </p>
                  ) : (
                    experiencesOfCourse.map((experience) => (
                      <div key={experience.id} className="flex items-center gap-2 rounded-lg p-2 hover:bg-white">
                        <RadioGroupItem value={experience.id} id={experience.id} />
                        <Label htmlFor={experience.id} className="flex-1 cursor-pointer text-sm">
                          {experience.title}
                        </Label>
                      </div>
                    ))
                  )}
                </RadioGroup>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label>Asignar al Grupo</Label>
              <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                <SelectTrigger className="rounded-xl bg-slate-50">
                  <SelectValue placeholder="Selecciona un grupo" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Fecha y Hora de entrega</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="rounded-xl bg-slate-50 flex-1"
                />
                <Input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="rounded-xl bg-slate-50 w-28"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              className="rounded-full"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleAssign}
              disabled={!selectedCourseId || !selectedExperienceId || !selectedGroupId || !dueDate || !dueTime || isSubmitting}
              className="rounded-full bg-[#00AEEF] hover:bg-[#33C4F4] text-white transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100"
            >
              Asignar Experiencia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}