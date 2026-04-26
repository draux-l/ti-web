"use client"

import { useMemo, useState } from "react"
import { Plus, UserMinus2, Users, Pencil, Search, Trash2 } from "lucide-react"

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
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

type Group = { id: string; name: string; studentIds: string[] }

const AVAILABLE_STUDENTS = [
  { id: "s-1", name: "Ana Pérez", specialty: "Desarrollo" },
  { id: "s-2", name: "Luis Gómez", specialty: "Desarrollo" },
  { id: "s-3", name: "María López", specialty: "Diseño" },
  { id: "s-4", name: "Carlos Ruiz", specialty: "Desarrollo" },
  { id: "s-5", name: "Sofía Torres", specialty: "Redes" },
  { id: "s-6", name: "Jorge León", specialty: "Ciberseguridad" },
  { id: "s-7", name: "Laura Díaz", specialty: "Diseño" },
  { id: "s-8", name: "Andrés Castro", specialty: "Desarrollo" },
  { id: "s-9", name: "Patricia Vargas", specialty: "Redes" },
  { id: "s-10", name: "Roberto Silva", specialty: "Ciberseguridad" },
]

const initialGroups: Group[] = [
  { id: "g-1", name: "Grupo A - Minería", studentIds: ["s-1", "s-2", "s-3"] },
  { id: "g-2", name: "Grupo B - Mecánica", studentIds: ["s-4", "s-5"] },
  { id: "g-3", name: "Grupo C - Electricidad", studentIds: ["s-6", "s-7"] },
]

const SPECIALTIES = ["Todas", "Desarrollo", "Diseño", "Redes", "Ciberseguridad"]

export function InstructorGroups() {
  const [groups, setGroups] = useState<Group[]>(initialGroups)
  const [newGroupName, setNewGroupName] = useState("")
  const [nameError, setNameError] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [modalGroupName, setModalGroupName] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("Todas")
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])
  const [studentSearch, setStudentSearch] = useState("")

  const [groupSearch, setGroupSearch] = useState("")
  const [groupSpecialtyFilter, setGroupSpecialtyFilter] = useState("Todas")

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const matchesSearch = group.name.toLowerCase().includes(groupSearch.toLowerCase())
      const matchesSpecialty =
        groupSpecialtyFilter === "Todas" ||
        group.name.toLowerCase().includes(groupSpecialtyFilter.toLowerCase())
      return matchesSearch && matchesSpecialty
    })
  }, [groups, groupSearch, groupSpecialtyFilter])

  const filteredStudents = useMemo(() => {
    return AVAILABLE_STUDENTS.filter((student) => {
      const matchesSpecialty =
        selectedSpecialty === "Todas" || student.specialty === selectedSpecialty
      const matchesSearch = student.name
        .toLowerCase()
        .includes(studentSearch.toLowerCase())
      return matchesSpecialty && matchesSearch
    })
  }, [selectedSpecialty, studentSearch])

  const openCreateModal = () => {
    if (!newGroupName.trim()) {
      setNameError(true)
      return
    }
    setNameError(false)
    setEditingGroup(null)
    setModalGroupName(newGroupName.trim())
    setSelectedStudentIds([])
    setSelectedSpecialty("Todas")
    setStudentSearch("")
    setIsModalOpen(true)
  }

  const openEditModal = (group: Group) => {
    setEditingGroup(group)
    setModalGroupName(group.name)
    setSelectedStudentIds(group.studentIds)
    setSelectedSpecialty("Todas")
    setStudentSearch("")
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingGroup(null)
    setModalGroupName("")
    setSelectedStudentIds([])
    setNameError(false)
  }

  const handleSaveGroup = () => {
    if (!modalGroupName.trim()) return

    if (editingGroup) {
      setGroups(
        groups.map((g) =>
          g.id === editingGroup.id
            ? { ...g, name: modalGroupName.trim(), studentIds: selectedStudentIds }
            : g
        )
      )
    } else {
      const newGroup: Group = {
        id: `g-${Date.now()}`,
        name: modalGroupName.trim(),
        studentIds: selectedStudentIds,
      }
      setGroups([newGroup, ...groups])
      setNewGroupName("")
    }
    handleCloseModal()
  }

  const toggleStudent = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    )
  }

  const removeStudent = (groupId: string, studentId: string) => {
    if (window.confirm("¿Estás seguro de quitar este estudiante del grupo?")) {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId
            ? { ...g, studentIds: g.studentIds.filter((id) => id !== studentId) }
            : g
        )
      )
    }
  }

  const deleteGroup = (groupId: string) => {
    if (window.confirm("¿Estás seguro de eliminar este grupo?")) {
      setGroups((prev) => prev.filter((g) => g.id !== groupId))
    }
  }

  const getSpecialtyBadgeColor = (specialty: string) => {
    switch (specialty) {
      case "Desarrollo":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "Diseño":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "Redes":
        return "bg-green-100 text-green-700 border-green-200"
      case "Ciberseguridad":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Gestión de Grupos</h1>
        <p className="text-sm text-gray-500 mt-1">
          Crea grupos y administra alumnos asignados para las experiencias XR.
        </p>
      </div>

      <Card className="rounded-3xl bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Crear Grupo</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <Input
              value={newGroupName}
              onChange={(e) => {
                setNewGroupName(e.target.value)
                if (nameError && e.target.value.trim()) {
                  setNameError(false)
                }
              }}
              placeholder="Ej. Grupo D - Metalurgia"
              className={`h-10 rounded-full bg-slate-50 ${
                nameError ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
            {nameError && (
              <p className="mt-1 ml-4 text-xs text-red-500">
                Complete un nombre del grupo
              </p>
            )}
          </div>
          <Button
            onClick={openCreateModal}
            className="h-10 rounded-full bg-[#00AEEF] px-5 text-white hover:bg-[#33C4F4] hover:scale-105 hover:shadow-lg transition-all duration-200"
          >
            <Plus className="size-4 mr-2" />
            Crear Grupo
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            value={groupSearch}
            onChange={(e) => setGroupSearch(e.target.value)}
            placeholder="Buscar grupo..."
            className="pl-9 h-10 rounded-full bg-white border border-gray-200"
          />
        </div>
        <Select value={groupSpecialtyFilter} onValueChange={setGroupSpecialtyFilter}>
          <SelectTrigger className="w-full sm:w-[200px] h-10 rounded-full bg-white border border-gray-200">
            <SelectValue placeholder="Especialidad" />
          </SelectTrigger>
          <SelectContent>
            {SPECIALTIES.map((specialty) => (
              <SelectItem key={specialty} value={specialty}>
                {specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        {filteredGroups.map((group) => (
          <Card
            key={group.id}
            className="rounded-3xl bg-white shadow-sm border border-gray-200"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg text-[#1A1A2E]">
                  <Users className="size-5 text-[#00AEEF]" />
                  {group.name}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteGroup(group.id)}
                    className="size-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditModal(group)}
                    className="size-8 rounded-full text-gray-400 hover:text-[#00AEEF] hover:bg-[#00AEEF]/10"
                  >
                    <Pencil className="size-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {group.studentIds.length} estudiantes
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              {group.studentIds.length === 0 && (
                <p className="rounded-xl bg-slate-50 p-3 text-sm text-gray-500">
                  Sin estudiantes asignados.
                </p>
              )}
              {group.studentIds.map((studentId) => {
                const student = AVAILABLE_STUDENTS.find((s) => s.id === studentId)
                if (!student) return null
                return (
                  <div
                    key={`${group.id}-${studentId}`}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">{student.name}</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 ${getSpecialtyBadgeColor(student.specialty)}`}
                      >
                        {student.specialty}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 rounded-full text-red-400 hover:bg-red-50 hover:text-red-600 hover:scale-105 transition-all duration-200"
                      onClick={() => removeStudent(group.id, studentId)}
                    >
                      <UserMinus2 className="size-3" />
                    </Button>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        ))}
      </section>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? "Editar Grupo" : "Crear Grupo"}
            </DialogTitle>
            <DialogDescription>
              {editingGroup
                ? "Modifica el nombre y asigna estudiantes al grupo."
                : "Completa los detalles del nuevo grupo."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="groupName">
                Nombre del Grupo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="groupName"
                value={modalGroupName}
                onChange={(e) => setModalGroupName(e.target.value)}
                placeholder="Ej. Grupo D - Metalurgia"
                className="rounded-xl bg-slate-50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Filtrar por especialidad</Label>
              <Select
                value={selectedSpecialty}
                onValueChange={setSelectedSpecialty}
              >
                <SelectTrigger className="rounded-xl bg-slate-50">
                  <SelectValue placeholder="Todas las especialidades" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Buscar estudiante</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Buscar por nombre..."
                  className="pl-9 rounded-xl bg-slate-50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Seleccionar estudiantes</Label>
              <div className="max-h-48 overflow-y-auto rounded-xl border border-gray-200 bg-slate-50 p-2">
                {filteredStudents.length === 0 ? (
                  <p className="p-3 text-center text-sm text-gray-500">
                    No se encontraron estudiantes
                  </p>
                ) : (
                  <div className="space-y-1">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center gap-3 rounded-lg p-2 hover:bg-white cursor-pointer"
                        onClick={() => toggleStudent(student.id)}
                      >
                        <Checkbox
                          checked={selectedStudentIds.includes(student.id)}
                          onCheckedChange={() => toggleStudent(student.id)}
                        />
                        <div className="flex flex-1 items-center justify-between">
                          <span className="text-sm text-gray-700">
                            {student.name}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1.5 py-0 ${getSpecialtyBadgeColor(student.specialty)}`}
                          >
                            {student.specialty}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400">
                {selectedStudentIds.length} estudiante(s) seleccionado(s)
              </p>
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
              onClick={handleSaveGroup}
              disabled={!modalGroupName.trim()}
              className="rounded-full bg-[#00AEEF] hover:bg-[#33C4F4] text-white transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100"
            >
              {editingGroup ? "Guardar Cambios" : "Crear Grupo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}