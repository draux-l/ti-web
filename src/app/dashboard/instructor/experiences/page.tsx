"use client"

import { useMemo, useState } from "react"
import { CalendarDays, Layout, PlusCircle, MinusCircle, RotateCcw } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Experience = {
  id: string
  title: string
  groupId: string
  dueDate: string
  attempts: number
  enabled: boolean
}

const groups = [
  { id: "g-1", name: "Grupo A - Minería" },
  { id: "g-2", name: "Grupo B - Mecánica" },
  { id: "g-3", name: "Grupo C - Electricidad" },
]

const catalog = [
  { id: "x-1", name: "Análisis de Fallas en Aceros" },
  { id: "x-2", name: "Sistemas Hidráulicos Avanzados" },
  { id: "x-3", name: "Inspección de Tableros Eléctricos" },
]

const initialAssignments: Experience[] = [
  {
    id: "a-1",
    title: "Análisis de Fallas en Aceros",
    groupId: "g-1",
    dueDate: "2026-04-24",
    attempts: 3,
    enabled: true,
  },
  {
    id: "a-2",
    title: "Sistemas Hidráulicos Avanzados",
    groupId: "g-2",
    dueDate: "2026-04-20",
    attempts: 2,
    enabled: false,
  },
]

export default function InstructorExperiencesPage() {
  const [assignments, setAssignments] = useState<Experience[]>(initialAssignments)
  const [experienceId, setExperienceId] = useState(catalog[0].id)
  const [groupId, setGroupId] = useState(groups[0].id)
  const [dueDate, setDueDate] = useState("2026-04-30")

  const sortedAssignments = useMemo(
    () => [...assignments].sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [assignments]
  )

  const assignExperience = () => {
    const selectedExperience = catalog.find((item) => item.id === experienceId)
    if (!selectedExperience || !groupId || !dueDate) return
    setAssignments((prev) => [
      ...prev,
      {
        id: `a-${crypto.randomUUID()}`,
        title: selectedExperience.name,
        groupId,
        dueDate,
        attempts: 3,
        enabled: true,
      },
    ])
  }

  const updateAttempts = (id: string, delta: number) => {
    setAssignments((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, attempts: Math.max(1, item.attempts + delta) }
          : item
      )
    )
  }

  const updateDueDate = (id: string, value: string) => {
    setAssignments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, dueDate: value } : item))
    )
  }

  const toggleEnabled = (id: string) => {
    setAssignments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E] md:text-3xl">Control de Experiencias</h1>
        <p className="mt-1 text-sm text-gray-500">
          Asigna actividades XR, reprograma fechas y controla intentos por grupo.
        </p>
      </div>

      <Card className="rounded-3xl bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Asignar Experiencia al Grupo</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <select
            value={experienceId}
            onChange={(event) => setExperienceId(event.target.value)}
            className="h-10 rounded-full border border-gray-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#00AEEF] md:col-span-2"
          >
            {catalog.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            value={groupId}
            onChange={(event) => setGroupId(event.target.value)}
            className="h-10 rounded-full border border-gray-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#00AEEF]"
          >
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <Input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="h-10 rounded-full bg-slate-50"
            />
            <Button
              onClick={assignExperience}
              className="h-10 rounded-full bg-[#00AEEF] px-4 text-white hover:bg-[#0098d1]"
            >
              <PlusCircle className="size-4" />
              Asignar
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4">
        {sortedAssignments.map((item) => {
          const group = groups.find((groupItem) => groupItem.id === item.groupId)
          return (
            <Card key={item.id} className="rounded-3xl bg-white shadow-sm">
              <CardContent className="space-y-4 py-6">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-base font-semibold text-[#1A1A2E]">{item.title}</p>
                    <p className="text-sm text-gray-500">{group?.name}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.enabled
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {item.enabled ? "Habilitada" : "Vencida/Bloqueada"}
                  </span>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <p className="mb-2 text-xs font-semibold text-gray-500 uppercase">
                      Reprogramar fecha
                    </p>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-[#00AEEF]" />
                      <Input
                        type="date"
                        value={item.dueDate}
                        onChange={(event) => updateDueDate(item.id, event.target.value)}
                        className="h-9 rounded-full bg-white"
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <p className="mb-2 text-xs font-semibold text-gray-500 uppercase">
                      Intentos máximos
                    </p>
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        className="h-8 rounded-full text-gray-600 hover:bg-white"
                        onClick={() => updateAttempts(item.id, -1)}
                      >
                        <MinusCircle className="size-4" />
                      </Button>
                      <span className="text-xl font-bold text-[#1A1A2E]">{item.attempts}</span>
                      <Button
                        variant="ghost"
                        className="h-8 rounded-full text-gray-600 hover:bg-white"
                        onClick={() => updateAttempts(item.id, 1)}
                      >
                        <PlusCircle className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <p className="mb-2 text-xs font-semibold text-gray-500 uppercase">
                      Rehabilitar acceso
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => toggleEnabled(item.id)}
                      className="h-9 w-full rounded-full border-[#00AEEF] text-[#00AEEF] hover:bg-blue-50 hover:text-[#0098d1]"
                    >
                      <RotateCcw className="size-4" />
                      {item.enabled ? "Deshabilitar" : "Rehabilitar"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {sortedAssignments.length === 0 && (
          <Card className="rounded-3xl bg-white shadow-sm">
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <Layout className="size-8 text-[#00AEEF]" />
              <p className="text-base font-semibold text-[#1A1A2E]">Sin experiencias asignadas</p>
              <p className="text-sm text-gray-500">
                Usa el formulario superior para asignar la primera actividad.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}
