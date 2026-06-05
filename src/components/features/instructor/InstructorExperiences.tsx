"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { CalendarDays, PlusCircle, RotateCcw, Trash2, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuthStore } from "@/stores/auth.store"
import apiClient from "@/lib/api-client"

interface ApiCourse {
  id: number
  name: string
}

interface ApiGroup {
  id: number
  name: string
}

interface ApiExperience {
  id: number
  name: string
  courseId: number
}

interface ApiGroupExperience {
  groupId: number
  experienceId: number
  enabled: boolean
  dueDate: string | null
  status: string
  experienceName?: string
  courseName?: string
  groupName?: string
}

export function InstructorExperiences() {
  const [assignments, setAssignments] = useState<ApiGroupExperience[]>([])
  const [courses, setCourses] = useState<ApiCourse[]>([])
  const [groups, setGroups] = useState<ApiGroup[]>([])
  const [experiences, setExperiences] = useState<ApiExperience[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState("")
  const [selectedExperienceId, setSelectedExperienceId] = useState("")
  const [selectedGroupId, setSelectedGroupId] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCourseId, setFilterCourseId] = useState("todos")
  const [filterDate, setFilterDate] = useState("todos")
  const [filterStatus, setFilterStatus] = useState("todos")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const currentOrgId = useAuthStore((s) => s.user?.orgId)
  const currentUserId = useAuthStore((s) => s.user?.id)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [coursesRes, groupsRes, expsRes, geRes] = await Promise.all([
        apiClient.get("/courses", { params: { orgId: currentOrgId, pageSize: 500 } }),
        apiClient.get("/groups", { params: { orgId: currentOrgId, instructorId: currentUserId, pageSize: 500 } }),
        apiClient.get("/experiences", { params: { pageSize: 500 } }),
        apiClient.get("/group-experiences", { params: { pageSize: 500 } }),
      ])
      setCourses(coursesRes.data.data)
      setGroups(groupsRes.data.data)
      setExperiences(expsRes.data.data)

      const geList: ApiGroupExperience[] = geRes.data.data || []
      const courseMap = new Map<number, string>(coursesRes.data.data.map((c: ApiCourse) => [c.id, c.name]))
      const groupMap = new Map<number, string>(groupsRes.data.data.map((g: ApiGroup) => [g.id, g.name]))
      const expMap = new Map<number, string>(expsRes.data.data.map((e: ApiExperience) => [e.id, e.name]))
      const expCourseMap = new Map<number, number>(expsRes.data.data.map((e: ApiExperience) => [e.id, e.courseId]))
      const instructorGroupIds = new Set(groupsRes.data.data.map((g: ApiGroup) => g.id))

      const mapped: ApiGroupExperience[] = []
      for (const ge of geList) {
        if (!instructorGroupIds.has(ge.groupId)) continue
        const expCourseId = expCourseMap.get(ge.experienceId)
        mapped.push({
          ...ge,
          experienceName: expMap.get(ge.experienceId) || "-",
          courseName: expCourseId != null ? (courseMap.get(expCourseId) || "-") : "-",
          groupName: groupMap.get(ge.groupId) || "-",
        })
      }
      setAssignments(mapped)
    } catch {
      toast.error("Error al cargar asignaciones")
    } finally {
      setIsLoading(false)
    }
  }, [currentOrgId, currentUserId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const courseExperiences = useMemo(() => {
    return experiences.filter((e) => e.courseId === Number(selectedCourseId) || !selectedCourseId)
  }, [experiences, selectedCourseId])

  const filteredAssignments = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const nextWeek = new Date(today.getTime() + 7 * 86400000)
    const nextMonth = new Date(today.getTime() + 30 * 86400000)

    return assignments
      .filter((item) => {
        const matchesSearch = (item.experienceName || "").toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCourse = filterCourseId === "todos" ||
          experiences.find((e) => e.id === item.experienceId)?.courseId === Number(filterCourseId)
        let matchesDate = true
        if (item.dueDate && filterDate !== "todos") {
          const d = new Date(item.dueDate)
          if (filterDate === "esta-semana" || filterDate === "proximos-7")
            matchesDate = d >= today && d <= nextWeek
          else if (filterDate === "este-mes" || filterDate === "proximos-30")
            matchesDate = d >= today && d <= nextMonth
        }
        const matchesStatus =
          filterStatus === "todos" ||
          (filterStatus === "habilitada" && item.enabled) ||
          (filterStatus === "deshabilitada" && !item.enabled)
        return matchesSearch && matchesCourse && matchesDate && matchesStatus
      })
      .sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""))
  }, [assignments, searchQuery, filterCourseId, filterDate, filterStatus, experiences])

  const openAssignModal = () => {
    setSelectedCourseId(courses[0]?.id ? String(courses[0].id) : "")
    setSelectedExperienceId("")
    setSelectedGroupId(groups[0]?.id ? String(groups[0].id) : "")
    setDueDate("")
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCourseId("")
    setSelectedExperienceId("")
    setSelectedGroupId("")
    setDueDate("")
    setIsSaving(false)
  }

  const handleAssign = async () => {
    if (isSaving || !selectedCourseId || !selectedExperienceId || !selectedGroupId) return
    setIsSaving(true)
    try {
      const body: Record<string, unknown> = {
        groupId: Number(selectedGroupId),
        experienceId: Number(selectedExperienceId),
        enabled: true,
      }
      if (dueDate) body.dueDate = new Date(dueDate).toISOString()
      await apiClient.post("/group-experiences", body)
      toast.success("Asignacion creada")
      handleCloseModal()
      fetchData()
    } catch {
      toast.error("Error al crear asignacion")
    } finally {
      setIsSaving(false)
    }
  }

  const updateDueDate = async (ge: ApiGroupExperience, date: string) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await apiClient.patch(`/group-experiences/${ge.groupId}/${ge.experienceId}`, {
        dueDate: date ? new Date(date).toISOString() : null,
      })
      toast.success("Fecha actualizada")
      fetchData()
    } catch {
      toast.error("Error al actualizar fecha")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleEnabled = async (ge: ApiGroupExperience) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await apiClient.patch(`/group-experiences/${ge.groupId}/${ge.experienceId}`, {
        enabled: !ge.enabled,
      })
      toast.success(ge.enabled ? "Deshabilitada" : "Habilitada")
      fetchData()
    } catch {
      toast.error("Error al cambiar estado")
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteAssignment = (ge: ApiGroupExperience) => {
    toast.warning("¿Eliminar esta asignacion?", {
      description: "La asignacion sera eliminada permanentemente",
      action: {
        label: "Eliminar",
        onClick: () => {
          apiClient.delete(`/group-experiences/${ge.groupId}/${ge.experienceId}`)
            .then(() => {
              toast.success("Asignacion eliminada")
              fetchData()
            })
            .catch(() => toast.error("Error al eliminar"))
        },
      },
      cancel: { label: "Cancelar", onClick: () => {} },
    })
  }

  const formatDate = (d: string | null) => {
    if (!d) return "Sin fecha"
    return new Date(d).toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Control de Experiencias</h1>
        <p className="text-sm text-gray-500 mt-1">
          Asigna experiencias a grupos, reprograma fechas y controla el acceso.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar experiencia..." className="pl-9 h-10 rounded-full bg-white border border-gray-200" />
        </div>
        <Select value={filterCourseId} onValueChange={setFilterCourseId}>
          <SelectTrigger className="w-full sm:w-[200px] h-10 rounded-full bg-white border border-gray-200"><SelectValue placeholder="Curso" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los cursos</SelectItem>
            {courses.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterDate} onValueChange={setFilterDate}>
          <SelectTrigger className="w-full sm:w-[180px] h-10 rounded-full bg-white border border-gray-200"><SelectValue placeholder="Fecha" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas las fechas</SelectItem>
            <SelectItem value="esta-semana">Esta semana</SelectItem>
            <SelectItem value="este-mes">Este mes</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[160px] h-10 rounded-full bg-white border border-gray-200"><SelectValue placeholder="Estado" /></SelectTrigger>
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
            <Button onClick={openAssignModal} className="rounded-full bg-[#00AEEF] hover:bg-[#33C4F4] text-white transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <PlusCircle className="size-4 mr-2" />Nueva Asignacion
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="size-8 animate-spin text-[#00AEEF]" /></div>
          ) : filteredAssignments.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-8">No hay asignaciones que coincidan con los filtros.</p>
          ) : (
            filteredAssignments.map((item) => (
              <div key={`${item.groupId}-${item.experienceId}`} className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{item.experienceName}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.enabled ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                        {item.enabled ? "Habilitada" : "Deshabilitada"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{item.courseName} - {item.groupName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{formatDate(item.dueDate)}</span>
                    <Button variant="ghost" size="icon" onClick={() => deleteAssignment(item)} className="size-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="mb-2 text-xs font-semibold text-gray-500 uppercase">Reprogramar fecha limite</p>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-[#00AEEF]" />
                      <Input type="date" min={new Date().toISOString().split("T")[0]} max={new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]} value={item.dueDate ? item.dueDate.split("T")[0] : ""} onChange={(e) => updateDueDate(item, e.target.value)} className="h-8 rounded-lg bg-slate-50 text-sm" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="mb-2 text-xs font-semibold text-gray-500 uppercase">Acceso</p>
                    <Button variant="outline" onClick={() => toggleEnabled(item)} className="h-8 w-full rounded-full border-[#00AEEF] text-[#00AEEF] hover:bg-blue-50 text-xs">
                      <RotateCcw className="size-3 mr-1" />
                      {item.enabled ? "Deshabilitar" : "Habilitar"}
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
            <DialogTitle>Nueva Asignacion</DialogTitle>
            <DialogDescription>Selecciona una experiencia y asignala a un grupo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <Label>Seleccionar Curso</Label>
              <Select value={selectedCourseId} onValueChange={(v) => { setSelectedCourseId(v); setSelectedExperienceId(""); }}>
                <SelectTrigger className="rounded-xl bg-slate-50"><SelectValue placeholder="Selecciona un curso" /></SelectTrigger>
                <SelectContent>{courses.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {selectedCourseId && (
              <div className="flex flex-col gap-2">
                <Label>Experiencias del curso</Label>
                <RadioGroup value={selectedExperienceId} onValueChange={setSelectedExperienceId} className="max-h-40 overflow-y-auto rounded-xl border border-gray-200 bg-slate-50 p-2">
                  {courseExperiences.length === 0 ? (
                    <p className="p-3 text-center text-sm text-gray-500">Este curso no tiene experiencias</p>
                  ) : (
                    courseExperiences.map((exp) => (
                      <div key={exp.id} className="flex items-center gap-2 rounded-lg p-2 hover:bg-white">
                        <RadioGroupItem value={String(exp.id)} id={String(exp.id)} />
                        <Label htmlFor={String(exp.id)} className="flex-1 cursor-pointer text-sm">{exp.name}</Label>
                      </div>
                    ))
                  )}
                </RadioGroup>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label>Asignar al Grupo</Label>
              <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                <SelectTrigger className="rounded-xl bg-slate-50"><SelectValue placeholder="Selecciona un grupo" /></SelectTrigger>
                <SelectContent>{groups.map((g) => <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Fecha limite (opcional, max 14 dias)</Label>
              <Input type="date" min={new Date().toISOString().split("T")[0]} max={new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]} value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="rounded-xl bg-slate-50" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleCloseModal} className="rounded-full">Cancelar</Button>
            <Button type="button" onClick={handleAssign} disabled={!selectedCourseId || !selectedExperienceId || !selectedGroupId || isSaving} className="rounded-full bg-[#00AEEF] hover:bg-[#33C4F4] text-white disabled:opacity-50">
              {isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              {isSaving ? "Asignando..." : "Asignar Experiencia"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
