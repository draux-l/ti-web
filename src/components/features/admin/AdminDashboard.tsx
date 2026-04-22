"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Users, BookOpen, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/LanguageContext"
import { useHeaderButton } from "@/contexts/HeaderButtonContext"

const COURSES_DATA = [
  { id: 1, name: "Fundamentos de Realidad Virtual", students: 14, status: "Activo" },
  { id: 2, name: "Desarrollo de Experiencias AR", students: 19, status: "Activo" },
]

const RECENT_ACTIVITY = [
  { id: 1, text: "Juan Pérez completó el curso: Introducción a Unity XR", time: "Hace 5 min" },
  { id: 2, text: "Juan Pérez ingresó a la plataforma", time: "Hace 30 min" },
  { id: 3, text: "Luciano Aragonó el curso: Introducción a Unity XR", time: "Hace 50 min" },
]

export function AdminDashboard() {
  const { t } = useLanguage()
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
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
            {t("dashboard", "title")}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t("dashboard", "subtitle")}
          </p>
        </div>
        <Link href="/dashboard/admin/assignments">
          <Button className="bg-[#00A3E0] hover:bg-[#008cc0] shadow-md shadow-blue-500/20 text-white font-medium transition-all px-6 hidden md:flex">
            <Users className="w-4 h-4 mr-2" />
            {t("dashboard", "assignBtn")}
          </Button>
        </Link>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="shadow-sm border-slate-200/60">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-800">{t("dashboard", "userDist")}</CardTitle>
              <CardDescription>{t("dashboard", "userDistSub")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="flex items-center gap-12 py-8">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-sky-500 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">70%</span>
                  </div>
                  <span className="mt-3 text-sm font-medium text-slate-600">Estudiantes</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-sky-200 flex items-center justify-center">
                    <span className="text-slate-700 font-bold text-2xl">30%</span>
                  </div>
                  <span className="mt-3 text-sm font-medium text-slate-600">Instructores</span>
                </div>
              </div>
            </CardContent>
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