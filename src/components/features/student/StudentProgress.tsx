"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

interface StudentProgressProps {}

const progressData = [
  { month: "Ene", progress: 15 },
  { month: "Feb", progress: 28 },
  { month: "Mar", progress: 45 },
  { month: "Abr", progress: 62 },
  { month: "May", progress: 78 },
  { month: "Jun", progress: 85 },
]

const courseCompletion = [
  { name: "Completados", value: 1, color: "#10B981" },
  { name: "En progreso", value: 2, color: "#00A3E0" },
  { name: "No iniciados", value: 0, color: "#E5E7EB" },
]

const gradesData = [
  { course: "Electricidad", nota: 85 },
  { course: "Mecánica", nota: 72 },
  { course: "Seguridad", nota: 95 },
]

export function StudentProgress({}: StudentProgressProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Progreso</h1>
        <p className="mt-1 text-gray-500">Resumen de tu actividad y calificaciones</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Promedio General</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">84%</p>
          <p className="mt-1 text-xs text-green-600">+5% vs mes anterior</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Cursos Completados</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">1</p>
          <p className="mt-1 text-xs text-gray-500">De 3 cursos activos</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Horas en VR</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">8.5h</p>
          <p className="mt-1 text-xs text-gray-500">Este mes</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Evaluaciones</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">12</p>
          <p className="mt-1 text-xs text-gray-500">Totales aprobadas</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Progreso Mensual
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="progress"
                  stroke="#00A3E0"
                  strokeWidth={3}
                  dot={{ fill: "#00A3E0", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Estado de Cursos
          </h2>
          <div className="flex h-64 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={courseCompletion}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {courseCompletion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-6">
            {courseCompletion.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Historial de Calificaciones
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gradesData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" domain={[0, 100]} stroke="#6B7280" fontSize={12} />
              <YAxis dataKey="course" type="category" stroke="#6B7280" fontSize={12} width={100} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                }}
              />
              <Bar dataKey="nota" fill="#00A3E0" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
