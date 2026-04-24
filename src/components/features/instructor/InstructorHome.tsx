"use client"

import Link from "next/link"
import { Layout, TrendingUp, Users, Clock3, ArrowRight, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"

const quickLinks = [
  { title: "Gestión de Grupos", description: "Administra tus grupos de estudiantes y asignaciones", href: "/dashboard/instructor/groups" },
  { title: "Experiencias XR", description: "Controla experiencias y configuraciones", href: "/dashboard/instructor/experiences" },
  { title: "Calificaciones", description: "Registra y supervisa el progreso de tus alumnos", href: "/dashboard/instructor/grades" },
]

export function InstructorHome() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Bienvenido de vuelta, Instructor</h1>
          <p className="text-sm text-gray-500 mt-1">Supervisa el avance de tus grupos y gestiona experiencias de aprendizaje XR.</p>
        </div>
        <button
          onClick={() => window.open("/dashboard/student", "_blank")}
          className="hidden md:flex items-center gap-2 rounded-full bg-[#00AEEF] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#00AEEF]/90 hover:shadow-lg"
        >
          <Eye className="size-5" />
          Visualizar vista de alumno
        </button>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <button
          onClick={() => window.open("/dashboard/instructor/groups", "_blank")}
          className="flex items-center justify-between gap-4 rounded-3xl bg-[#00AEEF] p-10 text-white transition-transform hover:scale-[1.02]"
        >
          <Users className="size-14" />
          <div className="text-left">
            <p className="text-4xl font-bold">8</p>
            <p className="text-base opacity-90">Grupos Activos</p>
          </div>
        </button>

        <button
          onClick={() => window.open("/dashboard/instructor/grades", "_blank")}
          className="flex items-center justify-between gap-4 rounded-3xl bg-[#FFB800] p-10 text-gray-900 transition-transform hover:scale-[1.02]"
        >
          <TrendingUp className="size-14" />
          <div className="text-left">
            <p className="text-4xl font-bold">74%</p>
            <p className="text-base opacity-80">Progreso Promedio</p>
          </div>
        </button>

        <button
          onClick={() => window.open("/dashboard/instructor/experiences", "_blank")}
          className="flex items-center justify-between gap-4 rounded-3xl bg-white p-10 text-gray-700 border border-gray-200 transition-transform hover:scale-[1.02]"
        >
          <Clock3 className="size-14" />
          <div className="text-left">
            <p className="text-4xl font-bold">15</p>
            <p className="text-base text-gray-500">Experiencias por Vencer</p>
          </div>
        </button>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {quickLinks.map((item) => (
          <div key={item.title} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{item.description}</p>
            <Button variant="outline" className="rounded-full border-[#00AEEF] text-[#00AEEF] hover:bg-blue-50 hover:text-[#0098d1]">
              <Link href={item.href} className="flex items-center">Ir al módulo <ArrowRight className="ml-2 size-4" /></Link>
            </Button>
          </div>
        ))}
      </section>
    </div>
  )
}