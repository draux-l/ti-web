"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const MOCK_COURSES = [
  { id: "1", name: "Fundamentos de Realidad Virtual", specialty: "Desarrollo", description: "Introducción a los conceptos básicos de VR y entornos inmersivos.", students: 14, experiencesCount: 3, bgColor: "from-blue-50 to-blue-100" },
  { id: "2", name: "Desarrollo de Experiencias AR", specialty: "Diseño", description: "Creación de aplicaciones de realidad aumentada interactiva.", students: 19, experiencesCount: 2, bgColor: "from-purple-50 to-purple-100" },
  { id: "3", name: "Unity XR Basics", specialty: "Desarrollo", description: "Aprende los fundamentos de Unity para XR.", students: 8, experiencesCount: 4, bgColor: "from-green-50 to-green-100" },
  { id: "4", name: "Diseño de Experiencias Inmersivas", specialty: "Diseño", description: "Principios de diseño para experiencias VR/AR.", students: 12, experiencesCount: 5, bgColor: "from-orange-50 to-orange-100" },
]

export function InstructorCourses() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCourses = MOCK_COURSES.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="group overflow-hidden rounded-3xl bg-white transition-all hover:shadow-lg cursor-pointer"
            onClick={() => router.push(`/dashboard/instructor/courses/${course.id}`)}
          >
            <div className={`bg-gradient-to-br ${course.bgColor} relative aspect-video w-full flex items-center justify-center`}>
              <div className="rounded-full bg-white/90 p-6 shadow-sm">
                <BookOpen className="size-12 text-[#00AEEF]" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="mb-1 font-semibold text-gray-900">{course.name}</h3>
              <p className="mb-4 text-xs text-gray-500">{course.specialty}</p>

              <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
                <span>{course.students} estudiantes</span>
                <span className="text-[#00AEEF]">{course.experiencesCount} experiencias</span>
              </div>

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
    </div>
  )
}