"use client"

import { useEffect, useState } from "react"
import { Building, Users, BookOpen, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import apiClient from "@/lib/api-client"

export function SuperAdminDashboard() {
  const [orgCount, setOrgCount] = useState(0)
  const [userCount, setUserCount] = useState(0)
  const [courseCount, setCourseCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [orgsRes, usersRes, coursesRes] = await Promise.all([
          apiClient.get("/organizations", { params: { pageSize: 1 } }),
          apiClient.get("/users", { params: { pageSize: 1 } }),
          apiClient.get("/courses", { params: { pageSize: 1 } }),
        ])
        setOrgCount(orgsRes.data.meta.total)
        setUserCount(usersRes.data.meta.total)
        setCourseCount(coursesRes.data.meta.total)
      } catch {
        // silent
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Panel de Super Administrador</h1>
        <p className="text-sm text-gray-500 mt-1">Gestiona todas las organizaciones y recursos del sistema.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-3xl bg-[#00AEEF] text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base opacity-90">Organizaciones</CardTitle>
            <Building className="size-10" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="size-8 animate-spin" /> : <p className="text-4xl font-bold">{orgCount}</p>}
          </CardContent>
        </Card>
        <Card className="rounded-3xl bg-[#FFB800] text-gray-900 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base opacity-80">Usuarios</CardTitle>
            <Users className="size-10" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="size-8 animate-spin" /> : <p className="text-4xl font-bold">{userCount}</p>}
          </CardContent>
        </Card>
        <Card className="rounded-3xl bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base text-gray-500">Cursos</CardTitle>
            <BookOpen className="size-10" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="size-8 animate-spin" /> : <p className="text-4xl font-bold text-gray-700">{courseCount}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
