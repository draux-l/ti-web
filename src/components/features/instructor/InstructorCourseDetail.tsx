"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Upload, FileArchive, Loader2, Clock } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import apiClient from "@/lib/api-client"

interface ApiCourse {
  id: number
  name: string
  description: string | null
}

interface ApiExperience {
  id: number
  name: string
  description: string | null
  duration: number
  type: string
}

export function InstructorCourseDetail() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string

  const [course, setCourse] = useState<ApiCourse | null>(null)
  const [experiences, setExperiences] = useState<ApiExperience[]>([])
  const [isLoadingCourse, setIsLoadingCourse] = useState(true)
  const [isLoadingExperiences, setIsLoadingExperiences] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState<{ id: number; name: string } | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await apiClient.get(`/courses/${courseId}`)
        setCourse(res.data)
      } catch {
        // silent
      } finally {
        setIsLoadingCourse(false)
      }
    }
    async function fetchExperiences() {
      try {
        const res = await apiClient.get("/experiences", {
          params: { courseId: Number(courseId), pageSize: 500 },
        })
        setExperiences(res.data.data)
      } catch {
        // silent
      } finally {
        setIsLoadingExperiences(false)
      }
    }
    fetchCourse()
    fetchExperiences()
  }, [courseId])

  const handleReplaceContent = (experience: ApiExperience) => {
    setSelectedExperience({ id: experience.id, name: experience.name })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedExperience(null)
    setIsDragOver(false)
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      <button
        onClick={() => router.push("/dashboard/instructor/courses")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 w-fit"
      >
        <ArrowLeft className="size-4" />
        Volver a Cursos
      </button>

      <Card className="rounded-3xl border border-gray-200 bg-white p-6">
        {isLoadingCourse ? (
          <CardContent className="p-0 flex justify-center py-12">
            <Loader2 className="size-8 animate-spin text-[#00AEEF]" />
          </CardContent>
        ) : course ? (
          <CardContent className="p-0">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.name}</h1>
              {course.description && <p className="text-gray-500">{course.description}</p>}
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Experiencias del Curso</h2>
              <p className="text-sm text-gray-500">{experiences.length} experiencias registradas</p>
            </div>

            {isLoadingExperiences ? (
              <div className="flex justify-center py-8">
                <Loader2 className="size-6 animate-spin text-[#00AEEF]" />
              </div>
            ) : experiences.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileArchive className="size-12 text-gray-300 mb-4" />
                <p className="text-gray-500">No hay experiencias registradas</p>
              </div>
            ) : (
              <div className="space-y-3">
                {experiences.map((experience, index) => (
                  <div
                    key={experience.id}
                    className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50/50 p-4 transition-all duration-200 hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-[#00AEEF]/10">
                        <span className="text-sm font-bold text-[#00AEEF]">{index + 1}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{experience.name}</h3>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{experience.type}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1"><Clock className="size-3.5" />{experience.duration} min</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleReplaceContent(experience)}
                      variant="ghost"
                      className="size-9 rounded-full text-gray-400 hover:text-[#00AEEF] hover:bg-[#00AEEF]/10"
                      title="Reemplazar contenido ZIP"
                    >
                      <Upload className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        ) : (
          <CardContent className="p-0 flex justify-center py-12">
            <p className="text-gray-500">Curso no encontrado</p>
          </CardContent>
        )}
      </Card>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Reemplazar Contenido</DialogTitle>
            <DialogDescription>
              {selectedExperience && (
                <span className="text-[#00AEEF] font-medium">{selectedExperience.name}</span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all ${
              isDragOver
                ? "border-[#00AEEF] bg-[#00AEEF]/5"
                : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
            }`}
          >
            <div className="flex size-16 items-center justify-center rounded-full bg-[#00AEEF]/10 mb-4">
              <Upload className="size-8 text-[#00AEEF]" />
            </div>
            <p className="text-center text-sm text-gray-600 mb-1">
              Arrastra el nuevo archivo aqui o haz click para buscar
            </p>
            <p className="text-xs text-gray-400">Formato aceptado: .zip (max 500MB)</p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleCloseModal} className="rounded-full">
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleCloseModal}
              className="bg-[#00AEEF] hover:bg-[#33C4F4] text-white rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              Actualizar Contenido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
