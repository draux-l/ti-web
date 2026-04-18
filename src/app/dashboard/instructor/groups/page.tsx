"use client"

import { useMemo, useState } from "react"
import { Plus, UserPlus2, UserMinus2, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Group = {
  id: string
  name: string
  students: string[]
}

const initialGroups: Group[] = [
  { id: "g-1", name: "Grupo A - Minería", students: ["Ana Pérez", "Luis Gómez", "Marco Vidal"] },
  { id: "g-2", name: "Grupo B - Mecánica", students: ["Sofía Ruiz", "Jorge León"] },
  { id: "g-3", name: "Grupo C - Electricidad", students: ["Carla Pinto", "Iván Torres"] },
]

export default function InstructorGroupsPage() {
  const [groups, setGroups] = useState<Group[]>(initialGroups)
  const [newGroupName, setNewGroupName] = useState("")
  const [studentName, setStudentName] = useState("")
  const [selectedGroupId, setSelectedGroupId] = useState(initialGroups[0]?.id ?? "")

  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === selectedGroupId),
    [groups, selectedGroupId]
  )

  const createGroup = () => {
    const value = newGroupName.trim()
    if (!value) return
    const id = `g-${crypto.randomUUID()}`
    setGroups((prev) => [{ id, name: value, students: [] }, ...prev])
    setSelectedGroupId(id)
    setNewGroupName("")
  }

  const addStudent = () => {
    const value = studentName.trim()
    if (!value || !selectedGroup) return
    setGroups((prev) =>
      prev.map((group) =>
        group.id === selectedGroup.id
          ? { ...group, students: [...group.students, value] }
          : group
      )
    )
    setStudentName("")
  }

  const removeStudent = (groupId: string, name: string) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, students: group.students.filter((student) => student !== name) }
          : group
      )
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E] md:text-3xl">Gestión de Grupos</h1>
        <p className="mt-1 text-sm text-gray-500">
          Crea grupos y administra alumnos asignados para las experiencias XR.
        </p>
      </div>

      <Card className="rounded-3xl bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Crear Grupo</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={newGroupName}
            onChange={(event) => setNewGroupName(event.target.value)}
            placeholder="Ej. Grupo D - Metalurgia"
            className="h-10 rounded-full bg-slate-50"
          />
          <Button
            onClick={createGroup}
            className="h-10 rounded-full bg-[#00AEEF] px-5 text-white hover:bg-[#0098d1]"
          >
            <Plus className="size-4" />
            Crear Grupo
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-3xl bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Asignar Estudiante al Grupo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <select
            value={selectedGroupId}
            onChange={(event) => setSelectedGroupId(event.target.value)}
            className="h-10 w-full rounded-full border border-gray-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#00AEEF]"
          >
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
              placeholder="Nombre del estudiante"
              className="h-10 rounded-full bg-slate-50"
            />
            <Button
              onClick={addStudent}
              className="h-10 rounded-full bg-[#00AEEF] px-5 text-white hover:bg-[#0098d1]"
            >
              <UserPlus2 className="size-4" />
              Asignar
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        {groups.map((group) => (
          <Card key={group.id} className="rounded-3xl bg-white shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-2 text-lg text-[#1A1A2E]">
                <Users className="size-5 text-[#00AEEF]" />
                {group.name}
              </CardTitle>
              <p className="text-xs text-gray-500">{group.students.length} estudiantes</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {group.students.length === 0 && (
                <p className="rounded-2xl bg-slate-50 p-3 text-sm text-gray-500">
                  Sin estudiantes asignados.
                </p>
              )}
              {group.students.map((student) => (
                <div
                  key={`${group.id}-${student}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <span className="text-sm text-gray-700">{student}</span>
                  <Button
                    variant="ghost"
                    className="h-8 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => removeStudent(group.id, student)}
                  >
                    <UserMinus2 className="size-4" />
                    Quitar
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
