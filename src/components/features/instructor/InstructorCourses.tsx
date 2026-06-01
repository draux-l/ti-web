"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Search, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/stores/auth.store"
import apiClient from "@/lib/api-client"

const BG_COLORS = [
  "from-blue-50 to-blue-100",
  "from-purple-50 to-purple-100",
  "from-green-50 to-green-100",
  "from-orange-50 to-orange-100",
  "from-pink-50 to-pink-100",
  "from-teal-50 to-teal-100",
]

export function InstructorCourses() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [courses, setCourses] = useState<{ id: number; name: string; description: string | null }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const currentOrgId = useAuthStore((s) => s.user?.orgId)

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await apiClient.get("/courses", {
          params: { pageSize: 100, orgId: currentOrgId },
        })
        setCourses(res.data.data)
      } catch {
        // silent
      } finally {
        setIsLoading(false)
      }
    }
    fetchCourses()
  }, [currentOrgId])

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Mis Cursos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Visualiza y gestiona los cursos asignados a ti
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <Input
          placeholder="Buscar curso..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-11 rounded-xl border-gray-200 bg-white"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-8 animate-spin text-[#00AEEF]" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="group overflow-hidden rounded-3xl bg-white transition-all hover:shadow-lg cursor-pointer"
                onClick={() => router.push(`/dashboard/instructor/courses/${course.id}`)}
              >
                <div className={`bg-gradient-to-br ${BG_COLORS[course.id % BG_COLORS.length]} relative aspect-video w-full flex items-center justify-center`}>
                  <div className="rounded-full bg-white/90 p-6 shadow-sm">
                    <BookOpen className="size-12 text-[#00AEEF]" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mb-1 font-semibold text-gray-900">{course.name}</h3>
                  {course.description && (
                    <p className="mb-4 text-xs text-gray-500 line-clamp-2">{course.description}</p>
                  )}
                  <Button
                    onClick={() => router.push(`/dashboard/instructor/courses/${course.id}`)}
                    className="w-full rounded-full bg-[#00AEEF] hover:bg-[#33C4F4] text-white font-medium py-2 text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  >
                    Ver curso
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="size-12 text-gray-300 mb-4" />
              <p className="text-gray-500">No se encontraron cursos</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
