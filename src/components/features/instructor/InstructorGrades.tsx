"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Search, Users, CheckCircle, Clock, Eye, Loader2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/stores/auth.store"
import apiClient from "@/lib/api-client"
import type { User } from "@/types/auth.types"

interface ApiCourse {
  id: number
  name: string
}

interface ApiGroup {
  id: number
  name: string
}

interface ApiGroupExp {
  groupId: number
  experienceId: number
  finalScore: number | null
  status: string
  attempts: number
  enabled: boolean
}

interface ApiExperience {
  id: number
  name: string
  courseId: number
}

interface GradeEntry {
  ge: ApiGroupExp
  experienceId: number
  experienceName: string
  courseId: number
  courseName: string
  groupId: number
  groupName: string
  userId: string
  userName: string
  finalScore: number | null
  status: string
  attempts: number
}

export function InstructorGrades() {
  const [isLoading, setIsLoading] = useState(true)
  const [courses, setCourses] = useState<ApiCourse[]>([])
  const [groups, setGroups] = useState<ApiGroup[]>([])
  const [experiences, setExperiences] = useState<ApiExperience[]>([])
  const [memberships, setMemberships] = useState<Record<number, string[]>>({})
  const [students, setStudents] = useState<User[]>([])
  const [grades, setGrades] = useState<GradeEntry[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState<{ name: string; courseName: string } | null>(null)
  const [modalGrades, setModalGrades] = useState<GradeEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterGroupId, setFilterGroupId] = useState("todos")
  const [filterCourseId, setFilterCourseId] = useState("todos")
  const [filterExperienceId, setFilterExperienceId] = useState("todos")
  const currentOrgId = useAuthStore((s) => s.user?.orgId)
  const currentUserId = useAuthStore((s) => s.user?.id)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [coursesRes, groupsRes, expsRes, usersRes, membersRes] = await Promise.all([
        apiClient.get("/courses", { params: { orgId: currentOrgId, pageSize: 500 } }),
        apiClient.get("/groups", { params: { orgId: currentOrgId, instructorId: currentUserId, pageSize: 500 } }),
        apiClient.get("/experiences", { params: { pageSize: 500 } }),
        apiClient.get("/users", { params: { roleId: 4, orgId: currentOrgId, pageSize: 500 } }),
        apiClient.get("/user-groups", { params: { pageSize: 2000 } }),
      ])
      const courseList: ApiCourse[] = coursesRes.data.data
      const groupList: ApiGroup[] = groupsRes.data.data
      const expList: ApiExperience[] = expsRes.data.data
      const studentList: User[] = usersRes.data.data

      setCourses(courseList)
      setGroups(groupList)
      setExperiences(expList)
      setStudents(studentList)

      const courseMap = new Map(courseList.map((c) => [c.id, c.name]))
      const groupMap = new Map(groupList.map((g) => [g.id, g.name]))
      const expMap = new Map(expList.map((e) => [e.id, e.name]))
      const expCourseMap = new Map(expList.map((e) => [e.id, e.courseId]))
      const studentMap = new Map(studentList.map((s) => [s.id, [s.name, s.lastName].filter(Boolean).join(" ") || s.email]))
      const instructorGroupIds = new Set(groupList.map((g) => g.id))

      const memMap: Record<number, string[]> = {}
      const allMembers: { userId: string; groupId: number }[] = membersRes.data.data || []
      for (const m of allMembers) {
        if (!memMap[m.groupId]) memMap[m.groupId] = []
        memMap[m.groupId].push(m.userId)
      }
      setMemberships(memMap)

      const allEntries: GradeEntry[] = []
      for (const group of groupList) {
        const groupMembers = memMap[group.id] || []
        try {
          const geRes = await apiClient.get("/group-experiences", {
            params: { groupId: group.id, pageSize: 500 },
          })
          const geList: ApiGroupExp[] = geRes.data.data || []
          for (const ge of geList) {
            if (!ge.enabled && ge.status === "PENDING") continue
            for (const userId of groupMembers) {
              const expCourseId = expCourseMap.get(ge.experienceId)
              allEntries.push({
                ge,
                experienceId: ge.experienceId,
                experienceName: expMap.get(ge.experienceId) || "-",
                courseId: expCourseId || 0,
                courseName: expCourseId != null ? (courseMap.get(expCourseId) || "-") : "-",
                groupId: group.id,
                groupName: group.name,
                userId,
                userName: studentMap.get(userId) || userId,
                finalScore: ge.finalScore,
                status: ge.status,
                attempts: ge.attempts,
              })
              if (!instructorGroupIds.has(group.id)) continue
            }
          }
        } catch {
          // skip groups that fail
        }
      }
      setGrades(allEntries)
    } catch {
      // silent
    } finally {
      setIsLoading(false)
    }
  }, [currentOrgId, currentUserId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const experienceStats = useMemo(() => {
    const statsMap = new Map<number, { experienceId: number; experienceName: string; courseId: number; courseName: string; totalStudents: number; completedCount: number; avgScore: number }>()
    for (const g of grades) {
      const key = g.experienceId
      const existing = statsMap.get(key)
      if (!existing) {
        statsMap.set(key, { experienceId: key, experienceName: g.experienceName, courseId: g.courseId, courseName: g.courseName, totalStudents: 1, completedCount: g.status === "COMPLETED" ? 1 : 0, avgScore: g.finalScore || 0 })
      } else {
        existing.totalStudents++
        if (g.status === "COMPLETED") existing.completedCount++
        existing.avgScore = Math.round(((existing.avgScore * (existing.totalStudents - 1)) + (g.finalScore || 0)) / existing.totalStudents)
      }
    }
    return Array.from(statsMap.values())
  }, [grades])

  const filteredExperiences = useMemo(() => {
    return experienceStats.filter((exp) => {
      const matchesCourse = filterCourseId === "todos" || exp.courseId === Number(filterCourseId)
      const matchesExp = filterExperienceId === "todos" || exp.experienceId === Number(filterExperienceId)
      return matchesCourse && matchesExp
    })
  }, [experienceStats, filterCourseId, filterExperienceId])

  const chartData = useMemo(() => {
    const groupScores = new Map<string, { total: number; count: number }>()
    for (const g of grades) {
      const key = g.groupName
      const existing = groupScores.get(key)
      if (!existing) groupScores.set(key, { total: g.finalScore || 0, count: 1 })
      else { existing.total += g.finalScore || 0; existing.count++ }
    }
    return Array.from(groupScores.entries()).map(([squad, d]) => ({
      squad,
      promedio: d.count > 0 ? Math.round(d.total / d.count) : 0,
    }))
  }, [grades])

  const avgScore = useMemo(() => {
    const withScores = grades.filter((g) => g.finalScore != null)
    if (!withScores.length) return 0
    return Math.round(withScores.reduce((s, g) => s + (g.finalScore || 0), 0) / withScores.length)
  }, [grades])

  const openModal = (expId: number) => {
    const exp = experienceStats.find((e) => e.experienceId === expId)
    if (!exp) return
    setSelectedExperience({ name: exp.experienceName, courseName: exp.courseName })
    setModalGrades(grades.filter((g) => g.experienceId === expId))
    setSearchQuery("")
    setFilterGroupId("todos")
    setIsModalOpen(true)
  }

  const filteredModal = useMemo(() => {
    return modalGrades.filter((g) => {
      const matchesSearch = g.userName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesGroup = filterGroupId === "todos" || g.groupId === Number(filterGroupId)
      return matchesSearch && matchesGroup
    })
  }, [modalGrades, searchQuery, filterGroupId])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Calificaciones y Progreso</h1>
        <p className="text-sm text-gray-500 mt-1">Visualiza las calificaciones y el progreso de tus estudiantes.</p>
      </div>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="rounded-3xl bg-white shadow-sm border border-gray-200 xl:col-span-2">
          <CardHeader><CardTitle className="text-lg">Promedio por Grupo</CardTitle></CardHeader>
          <CardContent className="h-[280px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full"><Loader2 className="size-8 animate-spin text-[#00AEEF]" /></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="squad" tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="promedio" fill="#00AEEF" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card className="rounded-3xl bg-[#FFB800] text-[#1A1A2E] shadow-sm border-0">
          <CardHeader><CardTitle className="text-lg">Promedio actual</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? (
              <Loader2 className="size-12 animate-spin" />
            ) : (
              <>
                <p className="text-7xl font-bold">{avgScore}</p>
                <p className="text-sm">Promedio general de todos los estudiantes.</p>
              </>
            )}
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-3xl bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-lg">Experiencias</CardTitle>
            <div className="flex flex-col gap-3 md:flex-row">
              <Select value={filterCourseId} onValueChange={(v) => { setFilterCourseId(v); setFilterExperienceId("todos"); }}>
                <SelectTrigger className="w-full md:w-[220px] h-10 rounded-full"><SelectValue placeholder="Curso" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los cursos</SelectItem>
                  {courses.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterExperienceId} onValueChange={setFilterExperienceId}>
                <SelectTrigger className="w-full md:w-[220px] h-10 rounded-full"><SelectValue placeholder="Experiencia" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las experiencias</SelectItem>
                  {experienceStats.filter((e) => filterCourseId === "todos" || e.courseId === Number(filterCourseId)).map((e) => (
                    <SelectItem key={e.experienceId} value={String(e.experienceId)}>{e.experienceName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="size-8 animate-spin text-[#00AEEF]" /></div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredExperiences.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-500">No hay experiencias con calificaciones.</div>
              ) : (
                filteredExperiences.map((exp) => (
                  <div key={exp.experienceId} className="rounded-2xl border border-gray-200 bg-gray-50/50 p-5">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{exp.experienceName}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{exp.courseName}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="text-gray-500">{exp.totalStudents} estudiantes</span>
                      <span className="text-[#00AEEF] font-medium">{exp.completedCount}/{exp.totalStudents} completaron</span>
                    </div>
                    <Button onClick={() => openModal(exp.experienceId)} variant="outline" className="w-full rounded-full border-[#00AEEF] text-[#00AEEF] hover:bg-[#00AEEF]/10">
                      <Eye className="size-4 mr-2" />Ver notas
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
        <DialogContent className="sm:max-w-[600px] rounded-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedExperience?.name}</DialogTitle>
            <DialogDescription>{selectedExperience?.courseName}</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 py-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar estudiante..." className="pl-9 h-10 rounded-xl bg-slate-50" />
            </div>
            <Select value={filterGroupId} onValueChange={setFilterGroupId}>
              <SelectTrigger className="w-[180px] h-10 rounded-xl bg-slate-50"><SelectValue placeholder="Grupo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los grupos</SelectItem>
                {groups.map((g) => <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 max-h-[400px] pr-2">
            {filteredModal.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-8">No se encontraron estudiantes</p>
            ) : (
              filteredModal.map((g, idx) => (
                <div key={`${g.userId}-${g.experienceId}-${g.groupId}`} className="flex items-center justify-between rounded-xl border border-gray-200 bg-slate-50 p-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#00AEEF]/10">
                      <span className="text-sm font-bold text-[#00AEEF]">{g.userName.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{g.userName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{g.groupName}</span>
                        {g.status === "COMPLETED" ? (
                          <Badge className="bg-emerald-100 text-emerald-700 text-[10px]"><CheckCircle className="size-3 mr-1" />Completado</Badge>
                        ) : g.status === "IN_PROGRESS" ? (
                          <Badge className="bg-blue-100 text-blue-700 text-[10px]"><Clock className="size-3 mr-1" />En progreso</Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-700 text-[10px]"><Clock className="size-3 mr-1" />Pendiente</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-sm text-gray-400">{g.attempts} intentos</span>
                    <span className="text-lg font-bold text-[#1A1A2E] w-12 text-right">{g.finalScore != null ? g.finalScore : "-"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-full">Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
