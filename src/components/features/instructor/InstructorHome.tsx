"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { TrendingUp, Users, Clock3, ArrowRight, Play, Calendar, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/stores/auth.store"
import apiClient from "@/lib/api-client"

const quickLinks = [
  { title: "Gestion de Grupos", description: "Administra tus grupos de estudiantes y asignaciones", href: "/dashboard/instructor/groups" },
  { title: "Experiencias XR", description: "Controla experiencias y configuraciones", href: "/dashboard/instructor/experiences" },
  { title: "Calificaciones", description: "Registra y supervisa el progreso de tus alumnos", href: "/dashboard/instructor/grades" },
]

export function InstructorHome() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeGroups, setActiveGroups] = useState(0)
  const [avgProgress, setAvgProgress] = useState(0)
  const [upcomingCount, setUpcomingCount] = useState(0)
  const [currentExp, setCurrentExp] = useState<{ name: string; courseName: string; progress: number } | null>(null)
  const [nextExp, setNextExp] = useState<{ name: string; courseName: string; dueDate: string } | null>(null)
  const currentOrgId = useAuthStore((s) => s.user?.orgId)
  const currentUserId = useAuthStore((s) => s.user?.id)
  const userName = useAuthStore((s) => s.user?.name)

  useEffect(() => {
    async function fetchData() {
      try {
        const [groupsRes, geRes] = await Promise.all([
          apiClient.get("/groups", { params: { orgId: currentOrgId, instructorId: currentUserId, status: "ACTIVE", pageSize: 1 } }),
          apiClient.get("/group-experiences", { params: { pageSize: 500 } }),
        ])
        setActiveGroups(groupsRes.data.meta.total)

        const courseMap = new Map<number, string>()
        const expMap = new Map<number, { name: string; courseId: number }>()
        try {
          const coursesRes = await apiClient.get("/courses", { params: { orgId: currentOrgId, pageSize: 500 } })
          coursesRes.data.data.forEach((c: { id: number; name: string }) => courseMap.set(c.id, c.name))
          const expsRes = await apiClient.get("/experiences", { params: { pageSize: 500 } })
          expsRes.data.data.forEach((e: { id: number; name: string; courseId: number }) => expMap.set(e.id, e))
        } catch {
          // names optional
        }

        const geList = geRes.data.data || []
        const completed = geList.filter((ge: { status: string }) => ge.status === "COMPLETED").length
        setAvgProgress(geList.length > 0 ? Math.round((completed / geList.length) * 100) : 0)

        const today = new Date()
        const upcoming = geList.filter((ge: { dueDate: string | null; status: string }) => {
          if (!ge.dueDate || ge.status === "COMPLETED" || ge.status === "FAILED") return false
          return new Date(ge.dueDate) > today
        })
        setUpcomingCount(upcoming.length)

        const inProgress = geList.find((ge: { status: string }) => ge.status === "IN_PROGRESS")
        if (inProgress) {
          const exp = expMap.get(inProgress.experienceId)
          setCurrentExp({
            name: exp?.name || "Experiencia en curso",
            courseName: exp?.courseId ? (courseMap.get(exp.courseId) || "-") : "-",
            progress: avgProgress,
          })
        }

        const pending = upcoming[0]
        if (pending) {
          const exp = expMap.get(pending.experienceId)
          setNextExp({
            name: exp?.name || "Proxima experiencia",
            courseName: exp?.courseId ? (courseMap.get(exp.courseId) || "-") : "-",
            dueDate: pending.dueDate ? new Date(pending.dueDate).toLocaleDateString("es-PE") : "Por definir",
          })
        }
      } catch {
        // silent
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [currentOrgId, currentUserId, avgProgress])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Bienvenido de vuelta, {userName || "Instructor"}</h1>
        <p className="text-sm text-gray-500 mt-1">Supervisa el avance de tus grupos y gestiona experiencias de aprendizaje XR.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="flex items-center justify-between gap-4 rounded-3xl bg-[#00AEEF] p-10 text-white">
          <Users className="size-14" />
          <div className="text-left">
            {isLoading ? <Loader2 className="size-8 animate-spin" /> : <p className="text-4xl font-bold">{activeGroups}</p>}
            <p className="text-base opacity-90">Grupos Activos</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-3xl bg-[#FFB800] p-10 text-gray-900">
          <TrendingUp className="size-14" />
          <div className="text-left">
            {isLoading ? <Loader2 className="size-8 animate-spin" /> : <p className="text-4xl font-bold">{avgProgress}%</p>}
            <p className="text-base opacity-80">Progreso Promedio</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-3xl bg-white p-10 text-gray-700 border border-gray-200">
          <Clock3 className="size-14" />
          <div className="text-left">
            {isLoading ? <Loader2 className="size-8 animate-spin" /> : <p className="text-4xl font-bold">{upcomingCount}</p>}
            <p className="text-base text-gray-500">Por Vencer</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {quickLinks.map((item) => (
          <div key={item.title} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{item.description}</p>
            <Button variant="outline" className="rounded-full border-[#00AEEF] text-[#00AEEF] hover:bg-blue-50">
              <Link href={item.href} className="flex items-center">Ir al modulo <ArrowRight className="ml-2 size-4" /></Link>
            </Button>
          </div>
        ))}
      </section>

      {!isLoading && (
        <section className="rounded-3xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Experiencias Actuales</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00AEEF]">
                  <Play className="size-3 text-white" />
                </div>
                <span className="text-xs font-semibold text-[#00AEEF] uppercase tracking-wider">En Proceso</span>
              </div>
              <h3 className="font-bold text-gray-900">{currentExp?.name || "Sin experiencias en curso"}</h3>
              <p className="text-sm text-gray-500 mb-4">{currentExp?.courseName || "-"}</p>
              {currentExp && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progreso del grupo</span>
                      <span className="font-semibold text-[#00AEEF]">{currentExp.progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div className="h-2 rounded-full bg-[#00AEEF]" style={{ width: `${currentExp.progress}%` }} />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400">
                  <Calendar className="size-3 text-white" />
                </div>
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Siguiente Asignada</span>
              </div>
              <h3 className="font-bold text-gray-900">{nextExp?.name || "Sin experiencias pendientes"}</h3>
              <p className="text-sm text-gray-500 mb-4">{nextExp?.courseName || "-"}</p>
              {nextExp && (
                <Badge variant="secondary" className="bg-gray-100 text-gray-600">Fecha: {nextExp.dueDate}</Badge>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
