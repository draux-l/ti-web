"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Plus, UserMinus2, Users, Pencil, Search, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuthStore } from "@/stores/auth.store"
import apiClient from "@/lib/api-client"
import type { User } from "@/types/auth.types"

interface ApiGroup {
  id: number
  name: string
  courseId: number | null
  orgId: number
  status: string
}

interface GroupMember {
  id: number
  userId: string
  groupId: number
  groupName: string
  userName: string
}

export function InstructorGroups() {
  const [groups, setGroups] = useState<ApiGroup[]>([])
  const [groupMembers, setGroupMembers] = useState<Record<number, string[]>>({})
  const [students, setStudents] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [nameError, setNameError] = useState(false)
  const [groupSearch, setGroupSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<ApiGroup | null>(null)
  const [modalGroupName, setModalGroupName] = useState("")
  const [selectedCourseId, setSelectedCourseId] = useState("")
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])
  const [studentSearch, setStudentSearch] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [courses, setCourses] = useState<{ id: number; name: string }[]>([])
  const currentOrgId = useAuthStore((s) => s.user?.orgId)
  const currentUserId = useAuthStore((s) => s.user?.id)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [groupsRes, studentsRes, coursesRes] = await Promise.all([
        apiClient.get("/groups", {
          params: { orgId: currentOrgId, instructorId: currentUserId, pageSize: 500 },
        }),
        apiClient.get("/users", {
          params: { roleId: 4, orgId: currentOrgId, pageSize: 500 },
        }),
        apiClient.get("/courses", {
          params: { orgId: currentOrgId, pageSize: 500 },
        }),
      ])
      const groupList: ApiGroup[] = groupsRes.data.data
      setGroups(groupList)
      setStudents(studentsRes.data.data)
      setCourses(coursesRes.data.data)

      const memberMap: Record<number, string[]> = {}
      const memberPromises = groupList.map(async (g) => {
        try {
          const res = await apiClient.get("/user-groups", {
            params: { groupId: g.id },
          })
          memberMap[g.id] = (res.data.data || []).map((m: { userId: string }) => m.userId)
        } catch {
          memberMap[g.id] = []
        }
      })
      await Promise.all(memberPromises)
      setGroupMembers(memberMap)
    } catch {
      toast.error("Error al cargar grupos")
    } finally {
      setIsLoading(false)
    }
  }, [currentOrgId, currentUserId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const studentNameMap = useMemo(() => {
    const map: Record<string, string> = {}
    students.forEach((s) => {
      map[s.id] = [s.name, s.lastName].filter(Boolean).join(" ") || s.email
    })
    return map
  }, [students])

  const filteredGroups = useMemo(() => {
    return groups.filter((g) =>
      g.name.toLowerCase().includes(groupSearch.toLowerCase())
    )
  }, [groups, groupSearch])

  const openCreateModal = () => {
    if (!newGroupName.trim()) {
      setNameError(true)
      return
    }
    setNameError(false)
    setEditingGroup(null)
    setModalGroupName(newGroupName.trim())
    setSelectedStudentIds([])
    setSelectedCourseId("")
    setStudentSearch("")
    setIsModalOpen(true)
  }

  const openEditModal = (group: ApiGroup) => {
    setEditingGroup(group)
    setModalGroupName(group.name)
    setSelectedStudentIds(groupMembers[group.id] || [])
    setSelectedCourseId(group.courseId ? String(group.courseId) : "")
    setStudentSearch("")
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingGroup(null)
    setModalGroupName("")
    setSelectedStudentIds([])
    setSelectedCourseId("")
    setIsSaving(false)
  }

  const handleSaveGroup = async () => {
    if (!modalGroupName.trim() || isSaving) return
    setIsSaving(true)

    try {
      if (editingGroup) {
        await apiClient.patch(`/groups/${editingGroup.id}`, { name: modalGroupName.trim() })
        toast.success("Grupo actualizado")
      } else {
        const groupCode = modalGroupName
          .replace(/[^a-zA-Z0-9_-]/g, "_")
          .slice(0, 30)
          .toUpperCase() || "GRUPO_" + Date.now().toString(36).slice(-6).toUpperCase()

        const body: Record<string, unknown> = {
          code: groupCode,
          name: modalGroupName.trim(),
          orgId: currentOrgId,
          status: "ACTIVE",
        }
        if (selectedCourseId && selectedCourseId !== "none") {
          body.courseId = Number(selectedCourseId)
        }
        const groupRes = await apiClient.post("/groups", body)
        const groupId = groupRes.data.id

        if (selectedStudentIds.length > 0) {
          await Promise.all(
            selectedStudentIds.map((userId) =>
              apiClient.post("/user-groups", { userId, groupId }).catch(() => {})
            )
          )
        }
        toast.success("Grupo creado")
      }
      handleCloseModal()
      setNewGroupName("")
      fetchData()
    } catch {
      toast.error("Error al guardar grupo")
    } finally {
      setIsSaving(false)
    }
  }

  const toggleStudentInGroup = async (groupId: number, studentId: string, currentlyIn: boolean) => {
    try {
      if (currentlyIn) {
        await apiClient.delete("/user-groups", {
          data: { userId: studentId, groupId },
        })
      } else {
        await apiClient.post("/user-groups", { userId: studentId, groupId })
      }
      setSelectedStudentIds((prev) =>
        currentlyIn ? prev.filter((id) => id !== studentId) : [...prev, studentId]
      )
    } catch {
      toast.error("Error al actualizar estudiantes")
    }
  }

  const removeStudent = (groupId: number, studentId: string) => {
    toast.warning("¿Quitar este estudiante?", {
      description: "El estudiante sera removido del grupo",
      action: {
        label: "Quitar",
        onClick: () => {
          apiClient.delete("/user-groups", { data: { userId: studentId, groupId } })
            .then(() => {
              toast.success("Estudiante removido del grupo")
              fetchData()
            })
            .catch(() => toast.error("Error al remover estudiante"))
        },
      },
      cancel: { label: "Cancelar", onClick: () => {} },
    })
  }

  const deleteGroup = (groupId: number) => {
    toast.warning("¿Eliminar este grupo?", {
      description: "El grupo y sus datos seran eliminados permanentemente",
      action: {
        label: "Eliminar",
        onClick: () => {
          apiClient.delete(`/groups/${groupId}`)
            .then(() => {
              toast.success("Grupo eliminado")
              fetchData()
            })
            .catch(() => toast.error("Error al eliminar grupo"))
        },
      },
      cancel: { label: "Cancelar", onClick: () => {} },
    })
  }

  const studentDisplayName = (s: User) =>
    [s.name, s.lastName].filter(Boolean).join(" ") || s.email

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Gestion de Grupos</h1>
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
                if (nameError && e.target.value.trim()) setNameError(false)
              }}
              placeholder="Ej. Grupo D - Metalurgia"
              className={`h-10 rounded-full bg-slate-50 ${nameError ? "border-red-500" : ""}`}
            />
            {nameError && <p className="mt-1 ml-4 text-xs text-red-500">Complete un nombre del grupo</p>}
          </div>
          <Button
            onClick={openCreateModal}
            className="h-10 rounded-full bg-[#00AEEF] px-5 text-white hover:bg-[#33C4F4] hover:scale-105 hover:shadow-lg transition-all duration-200"
          >
            <Plus className="size-4 mr-2" />Crear Grupo
          </Button>
        </CardContent>
      </Card>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <Input
          value={groupSearch}
          onChange={(e) => setGroupSearch(e.target.value)}
          placeholder="Buscar grupo..."
          className="pl-9 h-10 rounded-full bg-white border border-gray-200"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-8 animate-spin text-[#00AEEF]" />
        </div>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          {filteredGroups.map((group) => {
            const members = groupMembers[group.id] || []
            return (
              <Card key={group.id} className="rounded-3xl bg-white shadow-sm border border-gray-200">
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
                  <p className="text-xs text-gray-500">{members.length} estudiantes</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {members.length === 0 && (
                    <p className="rounded-xl bg-slate-50 p-3 text-sm text-gray-500">Sin estudiantes asignados.</p>
                  )}
                  {members.map((studentId) => (
                    <div
                      key={`${group.id}-${studentId}`}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
                    >
                      <span className="text-sm text-gray-700">{studentNameMap[studentId] || studentId}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 rounded-full text-red-400 hover:bg-red-50 hover:text-red-600"
                        onClick={() => removeStudent(group.id, studentId)}
                      >
                        <UserMinus2 className="size-3" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </section>
      )}

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingGroup ? "Editar Grupo" : "Asignar estudiantes al grupo"}</DialogTitle>
            <DialogDescription>
              {editingGroup ? "Modifica el nombre y asigna estudiantes." : `Grupo: ${modalGroupName}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="groupName">Nombre del Grupo</Label>
              <Input
                id="groupName"
                value={modalGroupName}
                onChange={(e) => setModalGroupName(e.target.value)}
                placeholder="Ej. Grupo D - Metalurgia"
                className="rounded-xl bg-slate-50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Curso (opcional)</Label>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger className="rounded-xl bg-slate-50"><SelectValue placeholder="Seleccionar curso" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin curso</SelectItem>
                  {courses.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
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
                {students.filter((s) =>
                  studentDisplayName(s).toLowerCase().includes(studentSearch.toLowerCase())
                ).length === 0 ? (
                  <p className="p-3 text-center text-sm text-gray-500">No se encontraron estudiantes</p>
                ) : (
                  <div className="space-y-1">
                    {students
                      .filter((s) =>
                        studentDisplayName(s).toLowerCase().includes(studentSearch.toLowerCase())
                      )
                      .map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center gap-3 rounded-lg p-2 hover:bg-white cursor-pointer"
                          onClick={() => {
                            setSelectedStudentIds((prev) =>
                              prev.includes(student.id)
                                ? prev.filter((id) => id !== student.id)
                                : [...prev, student.id]
                            )
                          }}
                        >
                          <Checkbox
                            checked={selectedStudentIds.includes(student.id)}
                            onCheckedChange={() => {}}
                          />
                          <span className="text-sm text-gray-700">{studentDisplayName(student)}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400">{selectedStudentIds.length} estudiante(s) seleccionado(s)</p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleCloseModal} className="rounded-full">Cancelar</Button>
            <Button
              type="button"
              onClick={handleSaveGroup}
              disabled={!modalGroupName.trim()}
              className="rounded-full bg-[#00AEEF] hover:bg-[#33C4F4] text-white transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              {editingGroup ? "Guardar Cambios" : "Crear Grupo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
