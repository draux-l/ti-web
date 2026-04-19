"use client"

import Link from "next/link"
import { Users, BookOpen, Layers, Activity, Box, Headset, CheckCircle } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const VR_LICENSES_DATA = [
  { name: "En Uso", value: 45, color: "#0ea5e9" }, // sky-500
  { name: "Disponibles", value: 30, color: "#bae6fd" }, // sky-200
  { name: "Mantenimiento", value: 5, color: "#fbbf24" }, // amber-400
]

const COURSES_DATA = [
  { id: 1, name: "Fundamentos de Realidad Virtual", students: 14, status: "Activo" },
  { id: 2, name: "Desarrollo de Experiencias AR", students: 19, status: "Activo" },
  { id: 3, name: "Introducción a Unity XR", students: 11, status: "Activo" },
]

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
            Panel de Administración
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestiona recursos, usuarios y licencias VR
          </p>
        </div>
        <Link href="/dashboard/admin/assignments">
          <Button className="bg-[#00A3E0] hover:bg-[#008cc0] shadow-md shadow-blue-500/20 text-white font-medium transition-all px-6">
            <Users className="w-4 h-4 mr-2" />
            Asignar Alumno a Curso
          </Button>
        </Link>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="shadow-sm border-slate-200/60 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Box className="w-16 h-16" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600">Licencias VR</CardTitle>
            <Layers className="w-4 h-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">80</div>
            <p className="text-xs text-slate-500 font-medium mt-1">45 en uso (56%)</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200/60 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Headset className="w-16 h-16" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600">Instructores</CardTitle>
            <Users className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">3</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Activos este periodo</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200/60 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-16 h-16" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600">Alumnos</CardTitle>
            <Users className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">5</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Matriculados</p>
          </CardContent>
        </Card>
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PIE CHART CARD */}
        <Card className="shadow-sm border-slate-200/60 h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800">Estado de Licencias VR</CardTitle>
            <CardDescription>Distribución actual de visores y dispositivos</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center min-h-[300px] relative">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#334155', fontWeight: 600 }}
                  />
                  <Pie
                    data={VR_LICENSES_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {VR_LICENSES_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-sm text-slate-600 font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* List labels */}
            <div className="flex flex-col gap-2 mt-4">
              {VR_LICENSES_DATA.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-md border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{item.value} visores</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cursos CARD */}
        <Card className="shadow-sm border-slate-200/60 h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800">Cursos Disponibles</CardTitle>
            <CardDescription>Programas XR activos en la plataforma</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex flex-col gap-4">
              {COURSES_DATA.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-sky-100 hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{course.name}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{course.students} alumnos matriculados</p>
                    </div>
                  </div>
                  <Badge className="bg-sky-500 hover:bg-sky-600 text-white border-transparent py-1 px-3 shadow-sm flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3" />
                    {course.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
