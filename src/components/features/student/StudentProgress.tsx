"use client"

import { useMemo, useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Trophy, Target, TrendingUp, Calendar, Search, Loader2 } from "lucide-react"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/stores/auth.store"
import apiClient from "@/lib/api-client"

interface GeEntry {
  groupId: number
  experienceId: number
  finalScore: number | null
  attempts: number
  status: string
  deviceType: string | null
  experienceName?: string
  courseName?: string
  completedAt?: string | null
}

export function StudentProgress() {
  const [entries, setEntries] = useState<GeEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const currentUserId = useAuthStore((s) => s.user?.id)

  useEffect(() => {
    if (!currentUserId) return
    async function fetchData() {
      try {
        const [geRes, expsRes, coursesRes] = await Promise.all([
          apiClient.get("/group-experiences", { params: { userId: currentUserId, pageSize: 500 } }),
          apiClient.get("/experiences", { params: { pageSize: 500 } }),
          apiClient.get("/courses", { params: { pageSize: 500 } }),
        ])
        const expMap = new Map<number, { name: string; courseId: number }>()
        for (const e of expsRes.data.data || []) expMap.set(e.id, { name: e.name, courseId: e.courseId })
        const courseMap = new Map<number, string>()
        for (const c of coursesRes.data.data || []) courseMap.set(c.id, c.name)

        const list: GeEntry[] = (geRes.data.data || []).map((ge: GeEntry) => {
          const exp = expMap.get(ge.experienceId)
          return {
            ...ge,
            experienceName: exp?.name || "-",
            courseName: exp ? (courseMap.get(exp.courseId) || "-") : "-",
          }
        })
        setEntries(list)
      } catch {
        // silent
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [currentUserId])

  const stats = useMemo(() => {
    const completed = entries.filter((e) => e.status === "COMPLETED")
    const avgScore = completed.length ? Math.round(completed.reduce((s, e) => s + (e.finalScore || 0), 0) / completed.length) : 0
    const totalTime = entries.reduce((s, e) => s + 0, 0)
    return { completed: completed.length, total: entries.length, avgScore, totalTime }
  }, [entries])

  const chartData = useMemo(() => {
    const data = entries
      .filter((e) => e.status === "COMPLETED" && e.completedAt)
      .sort((a, b) => (a.completedAt || "").localeCompare(b.completedAt || ""))
      .slice(-10)
      .map((e, idx) => ({
        name: e.experienceName?.slice(0, 12) || `Exp ${idx + 1}`,
        score: e.finalScore || 0,
      }))
    return data
  }, [entries])

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      const q = searchQuery.toLowerCase()
      return (
        (e.experienceName || "").toLowerCase().includes(q) ||
        (e.courseName || "").toLowerCase().includes(q)
      )
    })
  }, [entries, searchQuery])

  const statusLabel = (s: string) => {
    switch (s) {
      case "COMPLETED": return "Completado"
      case "IN_PROGRESS": return "En progreso"
      case "FAILED": return "Fallido"
      default: return "Pendiente"
    }
  }

  const statusBadge = (s: string) => {
    switch (s) {
      case "COMPLETED": return "bg-emerald-100 text-emerald-700"
      case "IN_PROGRESS": return "bg-blue-100 text-blue-700"
      case "FAILED": return "bg-red-100 text-red-700"
      default: return "bg-amber-100 text-amber-700"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Mi Progreso</h1>
        <p className="text-sm text-gray-500 mt-1">Seguimiento detallado de tu rendimiento en experiencias XR.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm border">
          <div className="flex items-center gap-2 mb-2"><Trophy className="size-5 text-[#FFB800]" /><span className="text-sm text-gray-500">Completadas</span></div>
          {isLoading ? <Loader2 className="size-6 animate-spin" /> : <p className="text-3xl font-bold">{stats.completed}/{stats.total}</p>}
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm border">
          <div className="flex items-center gap-2 mb-2"><Target className="size-5 text-[#00AEEF]" /><span className="text-sm text-gray-500">Promedio</span></div>
          {isLoading ? <Loader2 className="size-6 animate-spin" /> : <p className="text-3xl font-bold">{stats.avgScore}</p>}
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm border">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="size-5 text-emerald-500" /><span className="text-sm text-gray-500">Tasa exito</span></div>
          {isLoading ? <Loader2 className="size-6 animate-spin" /> : <p className="text-3xl font-bold">{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</p>}
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm border">
          <div className="flex items-center gap-2 mb-2"><Calendar className="size-5 text-purple-500" /><span className="text-sm text-gray-500">Total XR</span></div>
          {isLoading ? <Loader2 className="size-6 animate-spin" /> : <p className="text-3xl font-bold">{stats.total}</p>}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Evolucion de puntajes</h3>
          {isLoading ? <div className="flex justify-center py-12"><Loader2 className="size-8 animate-spin" /></div> : (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 20]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#00AEEF" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Distribucion por curso</h3>
          {isLoading ? <div className="flex justify-center py-12"><Loader2 className="size-8 animate-spin" /></div> : (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={(() => {
                  const map = new Map<string, number>()
                  for (const e of entries) map.set(e.courseName || "-", (map.get(e.courseName || "-") || 0) + 1)
                  return Array.from(map.entries()).map(([name, count]) => ({ name, count }))
                })()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#00AEEF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Historial de experiencias</h3>
        <div className="relative max-w-md mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar experiencia..." className="pl-9" />
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="size-6 animate-spin" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Experiencia</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Puntaje</TableHead>
                <TableHead>Intentos</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No se encontraron experiencias</TableCell></TableRow>
              ) : (
                filteredEntries.map((e, idx) => (
                  <TableRow key={`${e.groupId}-${e.experienceId}-${idx}`}>
                    <TableCell className="font-medium">{e.experienceName}</TableCell>
                    <TableCell className="text-gray-500">{e.courseName}</TableCell>
                    <TableCell className="font-bold">{e.finalScore != null ? e.finalScore : "-"}</TableCell>
                    <TableCell>{e.attempts}</TableCell>
                    <TableCell><Badge className={statusBadge(e.status)}>{statusLabel(e.status)}</Badge></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
