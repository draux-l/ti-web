"use client"

import { useState } from "react"
import Link from "next/link"
import { Users, BookOpen, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CheckCircle } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const USER_DISTRIBUTION_DATA = [
  { name: "Estudiantes", value: 70, color: "#0ea5e9" }, // sky-500
  { name: "Instructores", value: 30, color: "#bae6fd" }, // sky-200
]

const COURSES_DATA = [
  { id: 1, name: "Fundamentos de Realidad Virtual", students: 14, status: "Activo" },
  { id: 2, name: "Desarrollo de Experiencias AR", students: 19, status: "Activo" },
]

const RECENT_ACTIVITY = [
  { id: 1, text: "Juan Pérez completó el curso: Introducción a Unity XR", time: "Hace 5 min" },
  { id: 2, text: "Juan Pérez ingresó a la plataforma", time: "Hace 30 min" },
  { id: 3, text: "Luciano Aragon completó el curso: Introducción a Unity XR", time: "Hace 50 min" },
]

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

function FunctionalCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const handlePrevYear = () => setCurrentDate(new Date(year - 1, month, 1))
  const handleNextYear = () => setCurrentDate(new Date(year + 1, month, 1))

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  
  let firstDayOfWeek = firstDayOfMonth.getDay()
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

  const days = []
  
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthLastDay - i),
      isCurrentMonth: false,
    })
  }
  
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    })
  }
  
  const remainingCells = 42 - days.length
  for (let i = 1; i <= remainingCells; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    })
  }

  const today = new Date()
  const isSameDate = (d1: Date, d2: Date | null) => 
    d2 && d1.getDate() === d2.getDate() && 
    d1.getMonth() === d2.getMonth() && 
    d1.getFullYear() === d2.getFullYear()

  return (
    <Card className="shadow-sm border-slate-200/60 pb-2">
      <CardHeader className="flex flex-row items-center justify-between pt-6 pb-4">
        <div className="flex items-center gap-3">
            <button onClick={handlePrevYear} className="text-slate-400 hover:text-[#0ea5e9] transition-colors">
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button onClick={handlePrevMonth} className="text-slate-400 hover:text-[#0ea5e9] transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
        </div>
        <h3 className="text-sm font-bold text-slate-800 tracking-wide capitalize">
          {MONTH_NAMES[month]} {year}
        </h3>
        <div className="flex items-center gap-3">
          <button onClick={handleNextMonth} className="text-slate-400 hover:text-[#0ea5e9] transition-colors">
              <ChevronRight className="w-4 h-4" />
          </button>
          <button onClick={handleNextYear} className="text-slate-400 hover:text-[#0ea5e9] transition-colors">
              <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-5 relative">
        <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center justify-items-center">
          {/* Header row */}
          <span className="text-[10px] font-bold text-slate-500 w-8 h-6">LUN</span>
          <span className="text-[10px] font-bold text-slate-500 w-8 h-6">MAR</span>
          <span className="text-[10px] font-bold text-slate-500 w-8 h-6">MIE</span>
          <span className="text-[10px] font-bold text-slate-500 w-8 h-6">JUE</span>
          <span className="text-[10px] font-bold text-slate-500 w-8 h-6">VIE</span>
          <span className="text-[10px] font-bold text-slate-800 w-8 h-6">SAB</span>
          <span className="text-[10px] font-bold text-slate-800 w-8 h-6">DOM</span>
          
          {/* Days */}
          {days.map((d, index) => {
            const isWeekend = index % 7 === 5 || index % 7 === 6
            const selected = isSameDate(d.date, selectedDate)
            
            let cellClasses = "text-xs font-medium w-8 h-8 flex items-center justify-center cursor-pointer transition-colors"
            
            if (!d.isCurrentMonth) {
              cellClasses += " text-slate-300"
            } else if (selected) {
              cellClasses = "w-8 h-8 flex items-center justify-center relative cursor-pointer bg-[#0ea5e9] bg-opacity-20"
            } else if (isWeekend) {
              cellClasses += " font-bold text-red-500 hover:bg-slate-100 rounded-sm"
            } else {
              cellClasses += " text-slate-600 hover:bg-slate-100 rounded-sm"
            }

            return (
                <div 
                  key={index} 
                  className={cellClasses} 
                  onClick={() => setSelectedDate(d.date)}
                >
                  <span className={selected ? "text-xs font-bold text-[#0ea5e9]" : ""}>
                    {d.date.getDate()}
                  </span>
                </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

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
            Gestiona recursos y usuarios
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        <Card className="shadow-sm border-slate-200/60 overflow-hidden relative group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600">Instructores</CardTitle>
            <Users className="w-4 h-4 text-slate-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">3</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Activos este periodo</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200/60 overflow-hidden relative group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600">Alumnos</CardTitle>
            <Users className="w-4 h-4 text-slate-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">5</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Matriculados</p>
          </CardContent>
        </Card>
      </div>

      {/* TWO COLUMNS LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Chart & Courses */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* PIE CHART CARD */}
          <Card className="shadow-sm border-slate-200/60">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-800">Distribucion de usuarios</CardTitle>
              <CardDescription>Distribucion actual de estudiantes e instructores en el sistema LMS</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#334155', fontWeight: 600 }}
                    />
                    <Pie
                      data={USER_DISTRIBUTION_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="white"
                      strokeWidth={2}
                    >
                      {USER_DISTRIBUTION_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-6 mt-2 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#0ea5e9]"></div>
                  <span className="text-sm font-medium text-slate-600">Estudiantes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#bae6fd]"></div>
                  <span className="text-sm font-medium text-slate-600">Instructores</span>
                </div>
              </div>

              {/* List distribution summary */}
              <div className="w-full flex flex-col gap-3 mt-2 border-t border-slate-100 pt-4">
                {USER_DISTRIBUTION_DATA.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium text-slate-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* COURSES CARD */}
          <Card className="shadow-sm border-slate-200/60">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-800">Cursos Disponibles</CardTitle>
              <CardDescription>Programas XR activos en la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
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
                    <Badge className="bg-[#0ea5e9] hover:bg-sky-600 text-white border-transparent py-1 px-3 shadow-sm flex items-center gap-1.5 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      {course.status}
                    </Badge>
                  </div>
                ))}
            </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Calendar & Activity */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <FunctionalCalendar />

          {/* RECENT ACTIVITY CARD */}
          <Card className="shadow-sm border-slate-200/60 flex-1">
            <CardHeader className="py-5">
              <CardTitle className="text-sm font-semibold text-slate-700">Actividad reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {RECENT_ACTIVITY.map((activity) => (
                  <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#f8fafc] px-4 py-3 rounded-lg border border-slate-100 gap-2">
                    <span className="text-[13px] font-medium text-slate-600">{activity.text}</span>
                    <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
