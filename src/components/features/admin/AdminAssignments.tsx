"use client"

import { useState, useEffect, useMemo } from "react"
import { Check, ChevronRight, UserCircle, Users, BookOpen, Search, Filter, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import apiClient from "@/lib/api-client"
import { useAuthStore } from "@/stores/auth.store"
import type { User } from "@/types/auth.types"

const STEPS = [
  { id: 1, title: "Instructor", icon: UserCircle },
  { id: 2, title: "Alumnos", icon: Users },
  { id: 3, title: "Curso", icon: BookOpen },
]

interface ApiCourse {
  id: number
  name: string
}

export function AdminAssignments() {
  const [currentStep, setCurrentStep] = useState(1)
  const [instructors, setInstructors] = useState<User[]>([])
  const [students, setStudents] = useState<User[]>([])
  const [courses, setCourses] = useState<ApiCourse[]>([])
  const [isLoadingInstructors, setIsLoadingInstructors] = useState(true)
  const [isLoadingStudents, setIsLoadingStudents] = useState(true)
  const [isLoadingCourses, setIsLoadingCourses] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedInstructor, setSelectedInstructor] = useState<string>("")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [searchQueryName, setSearchQueryName] = useState("")
  const [filterType, setFilterType] = useState<string>("")
  const [filterQuery, setFilterQuery] = useState("")
  const [groupName, setGroupName] = useState("")
  const currentOrgId = useAuthStore((s) => s.user?.orgId)

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient.get("/users", {
          params: { roleId: 3, pageSize: 500, orgId: currentOrgId },
        })
        setInstructors(res.data.data)
      } catch {
        toast.error("Error al cargar instructores")
      } finally {
        setIsLoadingInstructors(false)
      }
    }
    load()
  }, [currentOrgId])

  const loadStudents = async () => {
    setIsLoadingStudents(true)
    try {
      const res = await apiClient.get("/users", {
        params: { roleId: 4, pageSize: 500, orgId: currentOrgId },
      })
      setStudents(res.data.data)
    } catch {
      toast.error("Error al cargar alumnos")
    } finally {
      setIsLoadingStudents(false)
    }
  }

  const loadCourses = async () => {
    setIsLoadingCourses(true)
    try {
      const res = await apiClient.get("/courses", {
        params: { pageSize: 500, orgId: currentOrgId },
      })
      setCourses(res.data.data)
    } catch {
      toast.error("Error al cargar cursos")
    } finally {
      setIsLoadingCourses(false)
    }
  }

  const handleStep2 = () => {
    setCurrentStep(2)
    loadStudents()
  }

  const handleStep3 = () => {
    setCurrentStep(3)
    loadCourses()
  }

  const handleFinalize = async () => {
    if (!selectedInstructor || !selectedCourse) return
    setIsSubmitting(true)
    try {
      const groupNameFinal =
        groupName.trim() ||
        `Grupo ${new Date().toLocaleDateString("es-PE")}`

      const groupCode = groupNameFinal
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .slice(0, 30)
        .toUpperCase() || "GRUPO_" + Date.now().toString(36).slice(-6).toUpperCase()

      const groupRes = await apiClient.post("/groups", {
        code: groupCode,
        name: groupNameFinal,
        courseId: Number(selectedCourse),
        orgId: currentOrgId,
        status: "ACTIVE",
      })
      const groupId = groupRes.data.id

      const userIds = [selectedInstructor, ...selectedStudents]
      await Promise.all(
        userIds.map((userId) =>
          apiClient.post("/user-groups", { userId, groupId }).catch(() => {})
        )
      )

      toast.success("Asignacion guardada con exito")
      setCurrentStep(1)
      setSelectedInstructor("")
      setSelectedStudents([])
      setSelectedCourse("")
      setGroupName("")
    } catch {
      toast.error("Error al guardar la asignacion")
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredInstructors = useMemo(() => {
    return instructors.filter((inst) => {
      const name = (inst.name || "").toLowerCase()
      const matchesName = name.includes(searchQueryName.toLowerCase())
      let matchesFilter = true
      if (filterType && filterQuery) {
        if (filterType === "dni")
          matchesFilter = (inst.documentNumber || "").includes(filterQuery)
        else if (filterType === "telefono")
          matchesFilter = (inst.phone || "").includes(filterQuery)
        else if (filterType === "especialidad")
          matchesFilter = (inst.specialty?.name || "").toLowerCase() === filterQuery.toLowerCase()
      }
      return matchesName && matchesFilter
    })
  }, [instructors, searchQueryName, filterType, filterQuery])

  const handleSelectAllStudents = () => {
    if (selectedStudents.length === students.length) setSelectedStudents([])
    else setSelectedStudents(students.map((s) => s.id))
  }

  const handleToggleStudent = (id: string) => {
    setSelectedStudents((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      <div className="w-full flex justify-between px-10 pt-6">
        {STEPS.map((step, index) => {
          const isCompleted = step.id < currentStep
          const isCurrent = step.id === currentStep
          const last = index === STEPS.length - 1
          return (
            <div key={step.id} className={`flex items-center relative ${last ? "" : "w-full"}`}>
              <div className="flex flex-col items-center gap-2 relative z-10 bg-slate-50/50">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    isCompleted
                      ? "bg-[#34d399] text-white shadow-md"
                      : isCurrent
                      ? "bg-[#00A3E0] text-white shadow-md"
                      : "bg-slate-100 text-slate-400 border border-slate-200"
                  }`}
                >
                  {step.id}
                </div>
                <span
                  className={`text-xs font-medium ${
                    isCurrent || isCompleted ? "text-slate-800" : "text-slate-400"
                  } absolute -bottom-7 whitespace-nowrap`}
                >
                  {step.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className="flex-1 h-[7px] bg-slate-200 relative w-full">
                  <div
                    className="absolute top-0 left-0 h-full transition-all duration-500 ease-in-out"
                    style={{
                      width: isCompleted ? "100%" : "0%",
                      background: "linear-gradient(90deg, #34d399 0%, #00eaec 100%)",
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <Card className="shadow-lg shadow-slate-200/40 border-slate-200/60 h-[470px] mt-10 rounded-2xl flex flex-col relative overflow-hidden bg-white">
        {currentStep === 1 && (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 h-full relative px-10 pt-6">
            <CardHeader className="flex-none bg-white z-10 pb-4">
              <div className="flex items-center gap-2 text-slate-800 mb-1">
                <Users className="w-5 h-5 text-slate-500" />
                <CardTitle className="text-sm 2xl:text-lg">Paso 1: Seleccionar Instructor Responsable del Grupo</CardTitle>
              </div>
              <CardDescription className="text-sm 2xl:text-base text-slate-500 pl-7">
                Selecciona al instructor que estara a cargo del grupo
              </CardDescription>
            </CardHeader>
            <div className="flex items-center gap-4 px-4 pb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Buscar instructores..."
                  className="w-full bg-slate-100/50 border-slate-200 pl-9 text-sm"
                  value={searchQueryName}
                  onChange={(e) => setSearchQueryName(e.target.value)}
                />
              </div>
              <Select
                value={filterType}
                onValueChange={(val) => {
                  setFilterType(val)
                  setFilterQuery("")
                }}
              >
                <SelectTrigger className="w-[140px] bg-white border-slate-200 text-slate-700">
                  <Filter className="w-4 h-4 mr-2 text-slate-500" />
                  <SelectValue placeholder="Filtrar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="telefono">Telefono</SelectItem>
                  <SelectItem value="dni">DNI</SelectItem>
                  <SelectItem value="especialidad">Especialidad</SelectItem>
                </SelectContent>
              </Select>
              {filterType && filterType !== "especialidad" && (
                <div className="relative w-[200px]">
                  <Input
                    type="text"
                    placeholder={`Buscar por ${filterType}...`}
                    className="w-full bg-white border-slate-200 text-sm"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                  />
                  {filterQuery && (
                    <button onClick={() => setFilterQuery("")} className="absolute right-2 top-2.5 text-slate-400">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
              {filterType === "especialidad" && (
                <Select value={filterQuery} onValueChange={setFilterQuery}>
                  <SelectTrigger className="w-[200px] bg-white border-slate-200 text-slate-700">
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(new Set(instructors.map((i) => i.specialty?.name).filter(Boolean))).map((name) => (
                      <SelectItem key={name} value={name!}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="flex-1 z-10 overflow-y-auto px-6 pb-28">
              {isLoadingInstructors ? (
                <div className="flex flex-col items-center gap-2 py-12">
                  <Loader2 className="size-6 animate-spin text-[#00AEEF]" />
                  <span className="text-sm text-gray-500">Cargando instructores...</span>
                </div>
              ) : (
                <RadioGroup value={selectedInstructor} onValueChange={setSelectedInstructor}>
                  <Table>
                    <TableHeader className="sticky top-0 z-10 shadow-sm border-b">
                      <TableRow className="border-b-2 text-xs">
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead className="font-bold text-slate-800">Nombre</TableHead>
                        <TableHead className="font-bold text-slate-800">Correo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInstructors.map((inst) => (
                        <TableRow
                          key={inst.id}
                          className="text-[10px] hover:bg-slate-50 cursor-pointer border-b border-slate-100"
                          onClick={() => setSelectedInstructor(inst.id)}
                        >
                          <TableCell className="w-[50px]">
                            <RadioGroupItem value={inst.id} className="text-[#00A3E0] border-slate-300" />
                          </TableCell>
                          <TableCell className="font-medium text-slate-600 2xl:text-sm py-2">{inst.name}</TableCell>
                          <TableCell className="text-slate-500 2xl:text-sm py-2">{inst.email}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </RadioGroup>
              )}
            </div>
            <div className="absolute bottom-0 left-0 w-full z-20 flex flex-col">
              <div className="h-10 w-full bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
              <div className="bg-white px-8 pt-5 flex justify-end items-center">
                <Button onClick={handleStep2} disabled={!selectedInstructor} className="bg-[#00A3E0] hover:bg-[#008cc0] text-white px-10 py-5 rounded-md text-base">
                  Continuar
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex-1 flex flex-col animate-in fade-in zoom-in-95 duration-300 h-full px-10 pt-6 relative">
            <CardHeader className="flex-none bg-white z-10 pb-4">
              <div className="flex items-center gap-2 text-slate-800 mb-1">
                <Users className="w-5 h-5 text-slate-500" />
                <CardTitle className="text-sm 2xl:text-lg">Paso 2: Seleccionar Alumnos</CardTitle>
              </div>
              <CardDescription className="text-sm 2xl:text-base text-slate-500 pl-7 mb-4">
                Selecciona los alumnos que participaran en este grupo
              </CardDescription>
              <Button variant="outline" size="sm" onClick={handleSelectAllStudents} className="w-fit text-slate-700 border-slate-300 hover:bg-slate-50">
                {selectedStudents.length === students.length ? "Deseleccionar todos" : "Seleccionar todos"}
              </Button>
            </CardHeader>
            <div className="flex-1 overflow-y-auto px-6 pb-28">
              {isLoadingStudents ? (
                <div className="flex flex-col items-center gap-2 py-12">
                  <Loader2 className="size-6 animate-spin text-[#00AEEF]" />
                  <span className="text-sm text-gray-500">Cargando alumnos...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-white sticky top-0 z-10 shadow-sm border-b">
                    <TableRow className="border-b-2 text-xs">
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead className="font-bold text-slate-800">Nombre</TableHead>
                      <TableHead className="font-bold text-slate-800">Correo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id} className="text-[10px] hover:bg-slate-50 border-b border-slate-100">
                        <TableCell className="w-[50px]">
                          <Checkbox
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={() => handleToggleStudent(student.id)}
                            className="border-slate-300"
                          />
                        </TableCell>
                        <TableCell
                          className="font-medium text-slate-600 2xl:text-sm py-2 cursor-pointer"
                          onClick={() => handleToggleStudent(student.id)}
                        >
                          {student.name}
                        </TableCell>
                        <TableCell
                          className="text-slate-500 2xl:text-sm py-2 cursor-pointer"
                          onClick={() => handleToggleStudent(student.id)}
                        >
                          {student.email}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
            <div className="absolute bottom-0 left-0 w-full z-20 flex flex-col">
              <div className="h-10 w-full bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
              <div className="bg-white px-8 pt-5 flex justify-between">
                <Button onClick={() => setCurrentStep(1)} variant="outline" className="text-slate-600 px-10 py-5 rounded-full text-base hover:bg-slate-100 hover:scale-105 transition-all duration-200">
                  Atras
                </Button>
                <Button onClick={handleStep3} disabled={selectedStudents.length === 0} className="bg-[#00AEEF] hover:bg-[#33C4F4] text-white px-10 py-5 rounded-full text-base hover:scale-105 hover:shadow-lg transition-all duration-200">
                  Continuar
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-8 duration-500 h-full px-10 pt-6 relative">
            <CardHeader className="flex-none bg-white z-10 pb-4">
              <div className="flex items-center gap-2 text-slate-800 mb-1">
                <BookOpen className="w-5 h-5 text-slate-500" />
                <CardTitle className="text-sm 2xl:text-lg">Paso 3: Seleccionar Curso</CardTitle>
              </div>
              <CardDescription className="text-sm 2xl:text-base text-slate-500 pl-7">
                Determina el curso y finaliza la asignacion
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 flex-1 px-6 pb-24">
              {isLoadingCourses ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="size-6 animate-spin text-[#00AEEF]" />
                </div>
              ) : (
                <>
                  <div className="grid gap-2">
                    <Label>Nombre del grupo (opcional)</Label>
                    <Input
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder="Ej: Grupo A - Matutino"
                      className="bg-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Curso</Label>
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Seleccionar curso" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={String(course.id)}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
            <div className="absolute bottom-0 left-0 w-full z-20 flex flex-col">
              <div className="h-20 w-full bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
              <div className="bg-white px-8 pt-5 flex justify-between">
                <Button onClick={() => setCurrentStep(2)} variant="outline" className="text-slate-600 px-10 py-5 rounded-full text-base hover:bg-slate-100 hover:scale-105 transition-all duration-200">
                  Atras
                </Button>
                <Button onClick={handleFinalize} disabled={!selectedCourse || isSubmitting} className="bg-[#00AEEF] hover:bg-[#33C4F4] text-white px-10 py-5 rounded-full text-base hover:scale-105 hover:shadow-lg transition-all duration-200">
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-5 h-5 mr-2" />
                  )}
                  {isSubmitting ? "Guardando..." : "Finalizar Asignacion"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
