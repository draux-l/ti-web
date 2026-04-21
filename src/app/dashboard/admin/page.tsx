"use client"

import { useState } from "react"
import Link from "next/link"
import { Users, BookOpen, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CheckCircle } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/LanguageContext"

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


export default function AdminDashboard() {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
            {t("dashboard", "title")}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t("dashboard", "subtitle")}
          </p>
        </div>
        <Link href="/dashboard/admin/assignments">
          <Button className="bg-[#00A3E0] hover:bg-[#008cc0] shadow-md shadow-blue-500/20 text-white font-medium transition-all px-6">
            <Users className="w-4 h-4 mr-2" />
            {t("dashboard", "assignBtn")}
          </Button>
        </Link>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-full">
        <Card className="shadow-sm border-slate-200/60 overflow-hidden relative group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600">{t("dashboard", "instructors")}</CardTitle>
            <Users className="w-4 h-4 text-slate-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">3</div>
            <p className="text-xs text-slate-500 font-medium mt-1">{t("dashboard", "instructorsSub")}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200/60 overflow-hidden relative group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600">{t("dashboard", "students")}</CardTitle>
            <Users className="w-4 h-4 text-slate-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">5</div>
            <p className="text-xs text-slate-500 font-medium mt-1">{t("dashboard", "studentsSub")}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200/60 overflow-hidden relative group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600">{t("dashboard", "courses")}</CardTitle>
            <BookOpen className="w-4 h-4 text-slate-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">2</div>
            <p className="text-xs text-slate-500 font-medium mt-1">{t("dashboard", "coursesSub")}</p>
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
              <CardTitle className="text-base font-semibold text-slate-800">{t("dashboard", "userDist")}</CardTitle>
              <CardDescription>{t("dashboard", "userDistSub")}</CardDescription>
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
              <CardTitle className="text-base font-semibold text-slate-800">{t("dashboard", "coursesAvail")}</CardTitle>
              <CardDescription>{t("dashboard", "coursesAvailSub")}</CardDescription>
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

        {/* RIGHT COLUMN: Activity */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* RECENT ACTIVITY CARD */}
          <Card className="shadow-sm border-slate-200/60 flex-1">
            <CardHeader className="py-5">
              <CardTitle className="text-sm font-semibold text-slate-700">{t("dashboard", "recentAct")}</CardTitle>
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
