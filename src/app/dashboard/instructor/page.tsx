"use client"

import Link from "next/link"
import { Layout, TrendingUp, Users, Clock3, ArrowRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const kpis = [
  {
    title: "Grupos Activos",
    value: "8",
    detail: "Equipos con sesiones en curso",
    icon: Users,
    className: "bg-[#00AEEF] text-white ring-0",
  },
  {
    title: "Progreso Promedio",
    value: "74%",
    detail: "Promedio general de avance",
    icon: TrendingUp,
    className: "bg-[#FFB800] text-[#1A1A2E] ring-0",
  },
  {
    title: "Experiencias por Vencer",
    value: "15",
    detail: "Actividades con fecha cercana",
    icon: Clock3,
    className: "bg-white text-[#1A1A2E]",
  },
]

const quickLinks = [
  {
    title: "Gestionar Grupos",
    description: "Crea grupos y administra alumnos asignados.",
    href: "/dashboard/instructor/groups",
  },
  {
    title: "Control de Experiencias",
    description: "Asigna, reprograma y rehabilita retos XR.",
    href: "/dashboard/instructor/experiences",
  },
  {
    title: "Calificaciones y Progreso",
    description: "Edita notas y monitorea evolución de resultados.",
    href: "/dashboard/instructor/grades",
  },
]

export default function InstructorHomePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[#1A1A2E] md:text-3xl">
          Bienvenido de vuelta, Instructor
        </h1>
        <p className="text-sm text-gray-500 md:text-base">
          Supervisa el avance de tus grupos y gestiona experiencias de aprendizaje XR.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.title} className={`rounded-3xl shadow-sm ${kpi.className}`}>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-semibold">{kpi.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-end justify-between">
                  <p className="text-4xl font-bold">{kpi.value}</p>
                  <Icon className="size-6 opacity-85" />
                </div>
                <p className="text-xs opacity-90">{kpi.detail}</p>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {quickLinks.map((item) => (
          <Card key={item.title} className="rounded-3xl bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">{item.description}</p>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-[#00AEEF] text-[#00AEEF] hover:bg-blue-50 hover:text-[#0098d1]"
              >
                <Link href={item.href}>
                  Ir al módulo
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}

        <Card className="rounded-3xl bg-[#1A1A2E] text-white shadow-sm lg:col-span-3">
          <CardContent className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-semibold">Piloto Sandvik listo para seguimiento</p>
              <p className="text-sm text-white/80">
                Controla fallas en aceros de perforación y valida resultados de cada sesión.
              </p>
            </div>
            <Button
              asChild
              className="h-11 rounded-full bg-[#00AEEF] px-5 text-white hover:bg-[#0098d1]"
            >
              <Link href="/dashboard/instructor/experiences">
                <Layout className="size-4" />
                Revisar experiencias
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
