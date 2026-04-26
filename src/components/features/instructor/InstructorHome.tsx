"use client"

import Link from "next/link"
import { Layout, TrendingUp, Users, Clock3, ArrowRight, Play, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const quickLinks = [
  { title: "Gestión de Grupos", description: "Administra tus grupos de estudiantes y asignaciones", href: "/dashboard/instructor/groups" },
  { title: "Experiencias XR", description: "Controla experiencias y configuraciones", href: "/dashboard/instructor/experiences" },
  { title: "Calificaciones", description: "Registra y supervisa el progreso de tus alumnos", href: "/dashboard/instructor/grades" },
]

const currentExperience = {
  title: "Simulación VR - Excavadora",
  course: "Mecánica de Maquinaria Pesada",
  progress: 65,
  studentsActive: 12,
}

const nextExperience = {
  title: "Mantenimiento Preventivo",
  course: "Mecánica de Maquinaria Pesada",
  dueDate: "Por definir",
}

export function InstructorHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Bienvenido de vuelta, Instructor</h1>
        <p className="text-sm text-gray-500 mt-1">Supervisa el avance de tus grupos y gestiona experiencias de aprendizaje XR.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="flex items-center justify-between gap-4 rounded-3xl bg-[#00AEEF] p-10 text-white transition-all duration-200 hover:bg-[#33C4F4] hover:scale-105 hover:shadow-lg cursor-default">
          <Users className="size-14" />
          <div className="text-left">
            <p className="text-4xl font-bold">8</p>
            <p className="text-base opacity-90">Grupos Activos</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-3xl bg-[#FFB800] p-10 text-gray-900 transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-default">
          <TrendingUp className="size-14" />
          <div className="text-left">
            <p className="text-4xl font-bold">74%</p>
            <p className="text-base opacity-80">Progreso Promedio</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-3xl bg-white p-10 text-gray-700 border border-gray-200 transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-default">
          <Clock3 className="size-14" />
          <div className="text-left">
            <p className="text-4xl font-bold">15</p>
            <p className="text-base text-gray-500">Experiencias por Vencer</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {quickLinks.map((item) => (
          <div key={item.title} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{item.description}</p>
            <Button variant="outline" className="rounded-full border-[#00AEEF] text-[#00AEEF] hover:bg-blue-50 hover:text-[#0098d1] hover:scale-105 transition-all duration-200">
              <Link href={item.href} className="flex items-center">Ir al módulo <ArrowRight className="ml-2 size-4" /></Link>
            </Button>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Experiencias Actuales</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:scale-105 hover:shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00AEEF]">
                <Play className="size-3 text-white" />
              </div>
              <span className="text-xs font-semibold text-[#00AEEF] uppercase tracking-wider">En Proceso</span>
            </div>
            <h3 className="font-bold text-gray-900">{currentExperience.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{currentExperience.course}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Progreso del grupo</span>
                <span className="font-semibold text-[#00AEEF]">{currentExperience.progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-[#00AEEF] transition-all"
                  style={{ width: `${currentExperience.progress}%` }}
                />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="secondary" className="bg-[#00AEEF]/10 text-[#00AEEF]">
                {currentExperience.studentsActive} alumnos activos
              </Badge>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:scale-105 hover:shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400">
                <Calendar className="size-3 text-white" />
              </div>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Siguiente Asignada</span>
            </div>
            <h3 className="font-bold text-gray-900">{nextExperience.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{nextExperience.course}</p>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                Fecha: {nextExperience.dueDate}
              </Badge>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}