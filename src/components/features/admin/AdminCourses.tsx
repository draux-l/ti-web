"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Plus, Pencil, Trash2, Search, X, FileArchive, Clock, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useHeaderButton } from "@/contexts/HeaderButtonContext"
import apiClient from "@/lib/api-client"
import { useAuthStore } from "@/stores/auth.store"
import type { Specialty } from "@/types/auth.types"
import { isCourseName } from "@/validators/form.validators"

interface ApiCourse {
  id: number
  name: string
  description: string
  specialtyId: number | null
  status: boolean
}

interface ApiExperience {
  id: number
  courseId: number
  name: string
  type: string
  score: number
  order: number
  description: string | null
}

const EMPTY_FORM = { id: 0, name: "", specialtyId: "", description: "", status: "Activo" }
const EMPTY_EXP = { name: "", type: "VR", score: "100", duration: "", order: "", description: "" }

export function AdminCourses() {
  const [courses, setCourses] = useState<ApiCourse[]>([])
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isExperiencesOpen, setIsExperiencesOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<ApiCourse | null>(null)
  const [experiences, setExperiences] = useState<ApiExperience[]>([])
  const [isLoadingExperiences, setIsLoadingExperiences] = useState(false)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [experienceForm, setExperienceForm] = useState(EMPTY_EXP)
  const [searchQuery, setSearchQuery] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("todos")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [courseNameError, setCourseNameError] = useState("")
  const [descError, setDescError] = useState("")
  const [expNameError, setExpNameError] = useState("")
  const [expDescError, setExpDescError] = useState("")
  const [expDurationError, setExpDurationError] = useState("")
  const [expScoreError, setExpScoreError] = useState("")
  const [expOrderError, setExpOrderError] = useState("")
  const { setHeaderButton } = useHeaderButton()
  const currentOrgId = useAuthStore((s) => s.user?.orgId)

  const fetchCourses = useCallback(async () => {
    setIsLoadingCourses(true)
    setFetchError(null)
    try {
      const res = await apiClient.get("/courses", {
        params: { pageSize: 500, orgId: currentOrgId },
      })
      setCourses(res.data.data)
    } catch {
      setFetchError("No se pudieron cargar los cursos")
      toast.error("Error al cargar cursos")
    } finally {
      setIsLoadingCourses(false)
    }
  }, [currentOrgId])

  const fetchSpecialties = useCallback(async () => {
    try {
      const res = await apiClient.get("/specialties", {
        params: { pageSize: 500, orgId: currentOrgId },
      })
      setSpecialties(res.data.data)
    } catch {
      // silent
    }
  }, [currentOrgId])

  const fetchExperiences = useCallback(async (courseId: number) => {
    setIsLoadingExperiences(true)
    try {
      const res = await apiClient.get("/experiences", {
        params: { courseId, orgId: currentOrgId },
      })
      setExperiences(res.data.data)
    } catch {
      setExperiences([])
    } finally {
      setIsLoadingExperiences(false)
    }
  }, [currentOrgId])

  useEffect(() => {
    fetchCourses()
    fetchSpecialties()
  }, [fetchCourses, fetchSpecialties])

  const specialtyName = (specialtyId: number | null) => {
    if (!specialtyId) return "-"
    const s = specialties.find((sp) => sp.id === specialtyId)
    return s?.name || "-"
  }

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.description || "").toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSpecialty =
        specialtyFilter === "todos" || String(course.specialtyId || "") === specialtyFilter
      return matchesSearch && matchesSpecialty
    })
  }, [courses, searchQuery, specialtyFilter])

  useEffect(() => {
    setHeaderButton({
      icon: Plus,
      label: "Añadir",
      onClick: () => setIsDialogOpen(true),
    })
    return () => setHeaderButton(null)
  }, [setHeaderButton])

  const resetForm = () => {
    setFormData(EMPTY_FORM)
    setIsSubmitting(false)
  }

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    if (!isCourseName(formData.name)) {
      setCourseNameError("Solo letras, espacios y guiones")
      return
    }
    if (formData.name.length > 50) {
      setCourseNameError("Maximo 50 caracteres")
      return
    }
    setCourseNameError("")
    if (formData.description.length > 250) {
      setDescError("Maximo 250 caracteres")
      return
    }
    setDescError("")
    setIsSubmitting(true)
    try {
      const res = await apiClient.post("/courses", {
        name: formData.name.trim(),
        description: formData.description.trim(),
        specialtyId: formData.specialtyId ? Number(formData.specialtyId) : null,
        status: formData.status === "Activo",
      })
      toast.success("Curso creado correctamente")
      setIsDialogOpen(false)
      resetForm()
      fetchCourses()
    } catch {
      toast.error("Error al crear curso")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await apiClient.patch(`/courses/${formData.id}`, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        specialtyId: formData.specialtyId ? Number(formData.specialtyId) : null,
        status: formData.status === "Activo",
      })
      toast.success("Curso actualizado correctamente")
      setIsEditDialogOpen(false)
      resetForm()
      fetchCourses()
    } catch {
      toast.error("Error al actualizar curso")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditModal = (course: ApiCourse) => {
    setFormData({
      id: course.id,
      name: course.name,
      specialtyId: course.specialtyId ? String(course.specialtyId) : "",
      description: course.description || "",
      status: course.status ? "Activo" : "Inactivo",
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteCourse = (id: number) => {
    toast.warning("¿Eliminar este curso?", {
      description: "Esta accion no se puede deshacer",
      action: {
        label: "Eliminar",
        onClick: () => {
          apiClient.delete(`/courses/${id}`)
            .then(() => {
              toast.success("Curso eliminado correctamente")
              fetchCourses()
            })
            .catch(() => toast.error("Error al eliminar curso"))
        },
      },
      cancel: { label: "Cancelar", onClick: () => {} },
    })
  }

  const openExperiencesDrawer = (course: ApiCourse) => {
    setSelectedCourse(course)
    setIsExperiencesOpen(true)
    fetchExperiences(course.id)
  }

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || !selectedCourse) return

    if (!experienceForm.name.trim()) { setExpNameError("El nombre es requerido"); return }
    setExpNameError("")
    if (experienceForm.name.length > 50) { setExpNameError(`Maximo 50 caracteres (tienes ${experienceForm.name.length})`); return }
    setExpNameError("")
    if (experienceForm.description.length > 200) { setExpDescError(`Maximo 200 caracteres (tienes ${experienceForm.description.length})`); return }
    setExpDescError("")
    const dur = parseInt(experienceForm.duration)
    if (!dur || dur < 1) { setExpDurationError("La duracion debe ser mayor a 0"); return }
    setExpDurationError("")
    const sc = parseInt(experienceForm.score)
    if (isNaN(sc) || sc < 0 || sc > 100) { setExpScoreError("Score entre 0 y 100"); return }
    setExpScoreError("")
    const ord = parseInt(experienceForm.order)
    if (isNaN(ord) || ord < 0) { setExpOrderError("El orden debe ser mayor o igual a 0"); return }
    setExpOrderError("")

    setIsSubmitting(true)
    try {
      await apiClient.post("/experiences", {
        name: experienceForm.name.trim(),
        type: experienceForm.type,
        score: parseInt(experienceForm.score) || 100,
        duration: parseInt(experienceForm.duration) || 0,
        order: parseInt(experienceForm.order) || 0,
        description: experienceForm.description.trim(),
        courseId: selectedCourse.id,
      })
      toast.success("Experiencia agregada correctamente")
      setExperienceForm(EMPTY_EXP)
      fetchExperiences(selectedCourse.id)
    } catch {
      toast.error("Error al agregar experiencia")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteExperience = (expId: number) => {
    toast.warning("¿Eliminar esta experiencia?", {
      description: "Esta accion no se puede deshacer",
      action: {
        label: "Eliminar",
        onClick: () => {
          apiClient.delete(`/experiences/${expId}`)
            .then(() => {
              toast.success("Experiencia eliminada correctamente")
              if (selectedCourse) fetchExperiences(selectedCourse.id)
            })
            .catch(() => toast.error("Error al eliminar experiencia"))
        },
      },
      cancel: { label: "Cancelar", onClick: () => {} },
    })
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Gestion de Cursos</h1>
          <p className="text-sm text-gray-500 mt-1">Administra los programas y cursos de la plataforma</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(v) => { setIsDialogOpen(v); if (!v) resetForm(); }}>
          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="hidden md:flex items-center justify-center bg-[#00AEEF] hover:bg-[#33C4F4] text-white font-medium transition-all px-6 py-2.5 rounded-full hover:scale-105 hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Añadir Curso
          </button>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddCourse}>
              <DialogHeader>
                <DialogTitle>Nuevo Curso</DialogTitle>
                <DialogDescription>Completa los detalles del nuevo curso.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Nombre del Curso</Label>
                  <Input id="name" required maxLength={50} value={formData.name} onChange={(e) => { setFormData({...formData, name: e.target.value}); setCourseNameError(""); }} placeholder="Ej: Realidad Mixta (letras y guiones, max 50)" className={courseNameError ? "border-red-500" : "bg-slate-50/50"} />
                  {courseNameError && <p className="text-xs text-red-500 mt-1">{courseNameError}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="specialty">Especialidad</Label>
                  <Select value={formData.specialtyId} onValueChange={(v) => setFormData({...formData, specialtyId: v})}>
                    <SelectTrigger className="bg-slate-50/50"><SelectValue placeholder="Seleccionar Especialidad" /></SelectTrigger>
                    <SelectContent>
                      {specialties.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="description">Descripcion</Label>
                  <Input id="description" required maxLength={250} value={formData.description} onChange={(e) => { setFormData({...formData, description: e.target.value}); setDescError(""); }} placeholder="Ej: Curso enfocado en... (max 250)" className={descError ? "border-red-500" : "bg-slate-50/50"} />
                  {descError && <p className="text-xs text-red-500 mt-1">{descError}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                    <SelectTrigger className="bg-slate-50/50"><SelectValue placeholder="Estado" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-[#00AEEF] hover:bg-[#33C4F4] text-white hover:scale-105 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                  {isSubmitting ? "Creando..." : "Guardar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm border-slate-200/60 mt-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-slate-800">Cursos Registrados ({filteredCourses.length})</CardTitle>
          <CardDescription>Visualiza y administra todos los cursos disponibles en la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Buscar por nombre o descripcion..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Todas las especialidades" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                {specialties.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border border-slate-200 mt-4 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">ID</TableHead>
                  <TableHead className="font-semibold text-slate-700">Nombre del Curso</TableHead>
                  <TableHead className="font-semibold text-slate-700">Especialidad</TableHead>
                  <TableHead className="font-semibold text-slate-700">Descripcion</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-center">Experiencias</TableHead>
                  <TableHead className="font-semibold text-slate-700">Estado</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fetchError ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <p className="text-sm text-red-600">{fetchError}</p>
                        <Button variant="outline" size="sm" onClick={fetchCourses}>Reintentar</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : isLoadingCourses ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="size-6 animate-spin text-[#00AEEF]" />
                        <span className="text-sm text-gray-500">Cargando cursos...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                      No se encontraron cursos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((course) => (
                    <TableRow key={course.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium text-slate-400">#{String(course.id).padStart(4, "0")}</TableCell>
                      <TableCell className="font-bold text-slate-900">{course.name}</TableCell>
                      <TableCell className="text-slate-600 font-medium">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">{specialtyName(course.specialtyId)}</Badge>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm max-w-[250px] truncate">{course.description || "-"}</TableCell>
                      <TableCell className="text-center">
                        <button
                          onClick={() => openExperiencesDrawer(course)}
                          className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-all hover:scale-105 bg-[#00AEEF]/10 text-[#00AEEF] hover:bg-[#00AEEF]/20"
                        >
                          <FileArchive className="size-4" />
                        </button>
                      </TableCell>
                      <TableCell>
                        <Badge variant={course.status ? "default" : "secondary"} className={course.status ? "bg-[#00A3E0] hover:bg-[#008cc0]" : "bg-slate-200 text-slate-600 hover:bg-slate-300"}>
                          {course.status ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button onClick={() => openEditModal(course)} variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-[#00A3E0] hover:bg-blue-50">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleDeleteCourse(course.id)} variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={(v) => { setIsEditDialogOpen(v); if (!v) resetForm(); }}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleEditCourse}>
            <DialogHeader>
              <DialogTitle>Editar Curso</DialogTitle>
              <DialogDescription>Modifica los detalles del curso seleccionado.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-name">Nombre del Curso</Label>
                <Input id="edit-name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-slate-50/50" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-specialty">Especialidad</Label>
                <Select value={formData.specialtyId} onValueChange={(v) => setFormData({...formData, specialtyId: v})}>
                  <SelectTrigger className="bg-slate-50/50"><SelectValue placeholder="Seleccionar Especialidad" /></SelectTrigger>
                  <SelectContent>
                    {specialties.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-description">Descripcion</Label>
                <Input id="edit-description" required maxLength={250} value={formData.description} onChange={(e) => { setFormData({...formData, description: e.target.value}); setDescError(""); }} className={descError ? "border-red-500" : "bg-slate-50/50"} />
                {descError && <p className="text-xs text-red-500 mt-1">{descError}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-status">Estado</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                  <SelectTrigger className="bg-slate-50/50"><SelectValue placeholder="Estado" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#00AEEF] hover:bg-[#33C4F4] text-white hover:scale-105 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className={`fixed inset-0 z-50 ${isExperiencesOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isExperiencesOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsExperiencesOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl transition-transform duration-300 ease-in-out ${isExperiencesOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {selectedCourse && (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold text-[#1A1A2E]">Experiencias</h2>
                  <p className="text-sm text-slate-500 mt-1">{selectedCourse.name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExperiencesOpen(false)}
                  className="rounded-full"
                >
                  <X className="size-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {isLoadingExperiences ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="size-8 animate-spin text-[#00AEEF]" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {experiences.length === 0 ? (
                      <div className="text-center py-12 text-slate-500">
                        <FileArchive className="size-12 mx-auto mb-3 text-slate-300" />
                        <p>No hay experiencias registradas</p>
                        <p className="text-sm mt-1">Agrega la primera experiencia para este curso</p>
                      </div>
                    ) : (
                      experiences.map((exp) => (
                        <div key={exp.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-slate-900">{exp.name}</h4>
                                <Badge className="bg-blue-100 text-blue-700 text-xs">{exp.type}</Badge>
                              </div>
                              {exp.description && (
                                <p className="text-sm text-slate-500 mt-1">{exp.description}</p>
                              )}
                              <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                                <span className="flex items-center gap-1"><Clock className="size-3.5" />Score: {exp.score}</span>
                                <span>Orden: {exp.order}</span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteExperience(exp.id)}
                              className="size-8 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-200 bg-slate-50">
                <form onSubmit={handleAddExperience} className="space-y-4">
                  <h4 className="font-semibold text-slate-900">Agregar Experiencia</h4>
                  <div className="grid gap-3">
                    <Input
                      required
                      maxLength={50}
                      value={experienceForm.name}
                      onChange={(e) => { setExperienceForm({...experienceForm, name: e.target.value}); setExpNameError(""); }}
                      placeholder="Ej: VR Lab 1 (max 50)"
                      className={`bg-white rounded-xl ${expNameError ? "border-red-500" : ""}`}
                    />
                    {expNameError && <p className="text-xs text-red-500">{expNameError}</p>}
                    <Input
                      maxLength={200}
                      value={experienceForm.description}
                      onChange={(e) => { setExperienceForm({...experienceForm, description: e.target.value}); setExpDescError(""); }}
                      placeholder="Ej: Descripcion breve (max 200)"
                      className={`bg-white rounded-xl ${expDescError ? "border-red-500" : ""}`}
                    />
                    {expDescError && <p className="text-xs text-red-500">{expDescError}</p>}
                    <div className="grid grid-cols-4 gap-3">
                      <Select value={experienceForm.type} onValueChange={(v) => setExperienceForm({...experienceForm, type: v})}>
                        <SelectTrigger className="bg-white rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VR">VR</SelectItem>
                          <SelectItem value="VIDEO">VIDEO</SelectItem>
                          <SelectItem value="DOCUMENT">DOCUMENT</SelectItem>
                          <SelectItem value="SLIDES">SLIDES</SelectItem>
                          <SelectItem value="INDUCTION">INDUCTION</SelectItem>
                        </SelectContent>
                      </Select>
                      <div>
                        <Input
                          required
                          type="number"
                          min={1}
                          value={experienceForm.duration}
                          onChange={(e) => { setExperienceForm({...experienceForm, duration: e.target.value}); setExpDurationError(""); }}
                          placeholder="Duracion (min 1)"
                          className={`bg-white rounded-xl ${expDurationError ? "border-red-500" : ""}`}
                        />
                        {expDurationError && <p className="text-xs text-red-500">{expDurationError}</p>}
                      </div>
                      <div>
                        <Input
                          required
                          type="number"
                          value={experienceForm.score}
                          onChange={(e) => { setExperienceForm({...experienceForm, score: e.target.value}); setExpScoreError(""); }}
                          placeholder="Score (0-100)"
                          className={`bg-white rounded-xl ${expScoreError ? "border-red-500" : ""}`}
                        />
                        {expScoreError && <p className="text-xs text-red-500">{expScoreError}</p>}
                      </div>
                      <div>
                        <Input
                          required
                          type="number"
                          min={0}
                          value={experienceForm.order}
                          onChange={(e) => { setExperienceForm({...experienceForm, order: e.target.value}); setExpOrderError(""); }}
                          placeholder="Orden (min 0)"
                          className={`bg-white rounded-xl ${expOrderError ? "border-red-500" : ""}`}
                        />
                        {expOrderError && <p className="text-xs text-red-500">{expOrderError}</p>}
                      </div>
                    </div>
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-[#00AEEF] hover:bg-[#33C4F4] disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Plus className="size-4 mr-2" />}
                    {isSubmitting ? "Agregando..." : "Agregar Experiencia"}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
