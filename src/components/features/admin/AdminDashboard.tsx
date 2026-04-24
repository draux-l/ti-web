"use client"

import * as React from "react"
import { useEffect } from "react"
import Link from "next/link"
import { Users, BookOpen, CheckCircle, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/LanguageContext"
import { useHeaderButton } from "@/contexts/HeaderButtonContext"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts"

const COURSES_DATA = [
  { id: 1, name: "Fundamentos de Realidad Virtual", students: 14, status: "Activo" },
  { id: 2, name: "Desarrollo de Experiencias AR", students: 19, status: "Activo" },
]

const RECENT_ACTIVITY = [
  { id: 1, text: "Juan Pérez completó el curso: Introducción a Unity XR", time: "Hace 5 min" },
  { id: 2, text: "Juan Pérez ingresó a la plataforma", time: "Hace 30 min" },
  { id: 3, text: "Luciano Aragonó el curso: Introducción a Unity XR", time: "Hace 50 min" },
]

const userDistData = [
  { type: "Estudiantes", count: 70, fill: "#00AEEF" },
  { type: "Instructores", count: 30, fill: "#FFB800" },
]

const chartConfig = {
  count: { label: "Usuarios" },
  Estudiantes: { label: "Estudiantes", color: "#00AEEF" },
  Instructores: { label: "Instructores", color: "#FFB800" },
} satisfies ChartConfig

export function AdminDashboard() {
  const { t } = useLanguage()

  const totalUsers = React.useMemo(() => {
    return userDistData.reduce((acc, curr) => acc + curr.count, 0)
  }, [])
  const { setHeaderButton } = useHeaderButton()

  useEffect(() => {
    setHeaderButton({
      icon: Users,
      label: "Asignar",
      onClick: () => window.location.href = "/dashboard/admin/assignments",
    })
    return () => setHeaderButton(null)
  }, [setHeaderButton])

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">
            {t("dashboard", "title")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t("dashboard", "subtitle")}
          </p>
        </div>
        <Link href="/dashboard/admin/assignments">
          <button className="hidden md:flex items-center justify-center bg-[#00AEEF] hover:bg-[#33C4F4] text-white font-medium px-6 py-2.5 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-200">
            <Users className="w-4 h-4 mr-2" />
            {t("dashboard", "assignBtn")}
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-full">
        <button className="flex items-center justify-between gap-4 rounded-3xl bg-white p-10 text-gray-700 border border-gray-200 transition-all duration-200 hover:scale-105 hover:shadow-lg">
          <div className="text-left">
            <p className="text-base text-gray-500 mb-1">{t("dashboard", "instructors")}</p>
            <p className="text-4xl font-bold">3</p>
          </div>
          <Users className="size-14" />
        </button>

        <button className="flex items-center justify-between gap-4 rounded-3xl bg-white p-10 text-gray-700 border border-gray-200 transition-all duration-200 hover:scale-105 hover:shadow-lg">
          <div className="text-left">
            <p className="text-base text-gray-500 mb-1">{t("dashboard", "students")}</p>
            <p className="text-4xl font-bold">5</p>
          </div>
          <Users className="size-14" />
        </button>

        <button className="flex items-center justify-between gap-4 rounded-3xl bg-white p-10 text-gray-700 border border-gray-200 transition-all duration-200 hover:scale-105 hover:shadow-lg">
          <div className="text-left">
            <p className="text-base text-gray-500 mb-1">{t("dashboard", "courses")}</p>
            <p className="text-4xl font-bold">2</p>
          </div>
          <BookOpen className="size-14" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="shadow-sm border-slate-200/60">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-800">{t("dashboard", "userDist")}</CardTitle>
              <CardDescription>{t("dashboard", "userDistSub")}</CardDescription>
            </CardHeader>
            <CardContent className="relative flex items-center justify-center p-4">
              <div className="relative w-[240px] h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userDistData}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {userDistData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-[#1A1A2E]">{totalUsers}%</span>
                  <span className="text-sm text-gray-500">Total</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium text-slate-700">
                Distribución de usuarios <TrendingUp className="h-4 w-4" />
              </div>
            </CardFooter>
          </Card>

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

        <div className="lg:col-span-5 flex flex-col gap-6">
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