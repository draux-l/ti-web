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
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type StudentRow = {
  id: string
  squad: string
  student: string
  expA: number
  expB: number
  expC: number
  score: number
}

const chartData = [
  { squad: "Grupo A", promedio: 78 },
  { squad: "Grupo B", promedio: 71 },
  { squad: "Grupo C", promedio: 83 },
]

const initialRows: StudentRow[] = [
  {
    id: "s-1",
    squad: "Grupo A - Minería",
    student: "Ana Pérez",
    expA: 82,
    expB: 76,
    expC: 88,
    score: 82,
  },
  {
    id: "s-2",
    squad: "Grupo A - Minería",
    student: "Luis Gómez",
    expA: 74,
    expB: 68,
    expC: 79,
    score: 74,
  },
  {
    id: "s-3",
    squad: "Grupo B - Mecánica",
    student: "Sofía Ruiz",
    expA: 66,
    expB: 70,
    expC: 61,
    score: 66,
  },
  {
    id: "s-4",
    squad: "Grupo C - Electricidad",
    student: "Marco Vidal",
    expA: 91,
    expB: 87,
    expC: 95,
    score: 91,
  },
]

export default function InstructorGradesPage() {
  const [rows, setRows] = useState<StudentRow[]>(initialRows)

  const avgScore = useMemo(() => {
    if (!rows.length) return 0
    const total = rows.reduce((sum, row) => sum + row.score, 0)
    return Math.round(total / rows.length)
  }, [rows])

  const updateScore = (id: string, value: number) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, score: value } : row))
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E] md:text-3xl">
          Calificaciones y Progreso
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Visualiza la evolución del grupo y actualiza puntuaciones en tiempo real.
        </p>
      </div>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="rounded-3xl bg-white shadow-sm xl:col-span-2">
          <CardHeader>
            <CardTitle>Promedio por Squad (Gráfico de Barras)</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="squad" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} domain={[0, 100]} />
                <Tooltip />
                <Bar
                  dataKey="promedio"
                  stroke="#00AEEF"
                  fill="#00AEEF"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-3xl bg-[#FFB800] text-[#1A1A2E] shadow-sm">
          <CardHeader>
            <CardTitle>Promedio actual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-5xl font-bold">{avgScore}</p>
            <p className="text-sm">Actualizado automáticamente al editar notas finales.</p>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-3xl bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Progreso del Squad por Experiencia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  <th className="px-3 py-2">Squad</th>
                  <th className="px-3 py-2">Alumno</th>
                  <th className="px-3 py-2">Exp. Aceros</th>
                  <th className="px-3 py-2">Exp. Hidráulica</th>
                  <th className="px-3 py-2">Exp. Eléctrica</th>
                  <th className="px-3 py-2">Puntuación Final</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="rounded-2xl bg-slate-50">
                    <td className="px-3 py-3 text-sm text-gray-600">{row.squad}</td>
                    <td className="px-3 py-3 text-sm font-medium text-[#1A1A2E]">{row.student}</td>
                    <td className="px-3 py-3">
                      <Progress value={row.expA} />
                    </td>
                    <td className="px-3 py-3">
                      <Progress value={row.expB} />
                    </td>
                    <td className="px-3 py-3">
                      <Progress value={row.expC} />
                    </td>
                    <td className="px-3 py-3">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={row.score}
                        onChange={(event) => updateScore(row.id, Number(event.target.value))}
                        className="h-9 w-24 rounded-full bg-white"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Progress({ value }: { value: number }) {
  return (
    <div className="w-full min-w-[120px]">
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div className="h-full rounded-full bg-[#00AEEF]" style={{ width: `${value}%` }} />
      </div>
      <p className="mt-1 text-xs text-gray-500">{value}%</p>
    </div>
  )
}
