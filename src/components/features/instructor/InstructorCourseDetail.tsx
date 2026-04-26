"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Upload, FileArchive } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const MOCK_COURSES: Record<string, { name: string; description: string }> = {
  "1": { name: "Fundamentos de Realidad Virtual", description: "Introducción a los conceptos básicos de VR y entornos inmersivos." },
  "2": { name: "Desarrollo de Experiencias AR", description: "Creación de aplicaciones de realidad aumentada interactiva." },
  "3": { name: "Unity XR Basics", description: "Aprende los fundamentos de Unity para XR." },
  "4": { name: "Diseño de Experiencias Inmersivas", description: "Principios de diseño para experiencias VR/AR." },
}

const MOCK_EXPERIENCES: Record<string, { id: string; title: string; duration: string }[]> = {
  "1": [
    { id: "1-1", title: "VR Lab 1 - Introducción", duration: "45 min" },
    { id: "1-2", title: "VR Lab 2 - Instalación del Ambiente", duration: "60 min" },
    { id: "1-3", title: "VR Lab 3 - Configuración SDK", duration: "55 min" },
  ],
  "2": [
    { id: "2-1", title: "AR Fundamentals - Tracking", duration: "40 min" },
    { id: "2-2", title: "AR Interactions - Gestures", duration: "50 min" },
  ],
  "3": [
    { id: "3-1", title: "Unity Setup & Interface", duration: "35 min" },
    { id: "3-2", title: "XR Interaction Toolkit", duration: "45 min" },
    { id: "3-3", title: "Building VR Scenes", duration: "60 min" },
    { id: "3-4", title: "Optimization Techniques", duration: "40 min" },
  ],
  "4": [
    { id: "4-1", title: "UX Principles for XR", duration: "30 min" },
    { id: "4-2", title: "Spatial Design Basics", duration: "45 min" },
    { id: "4-3", title: "User Testing in VR", duration: "50 min" },
    { id: "4-4", title: "Accessibility in XR", duration: "35 min" },
    { id: "4-5", title: "Final Project Review", duration: "60 min" },
  ],
}

export function InstructorCourseDetail() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string

  const course = MOCK_COURSES[courseId] || MOCK_COURSES["1"]
  const experiences = MOCK_EXPERIENCES[courseId] || MOCK_EXPERIENCES["1"]

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState<{ id: string; title: string } | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleReplaceContent = (experience: { id: string; title: string }) => {
    setSelectedExperience(experience)
    setIsModalOpen(true)
  }

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Future: handle file replacement here
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
        <CardContent className="p-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.name}</h1>
            <p className="text-gray-500">{course.description}</p>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Experiencias del Curso</h2>
            <p className="text-sm text-gray-500">{experiences.length} experiencias registradas</p>
          </div>

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
                    <h3 className="font-semibold text-gray-900">{experience.title}</h3>
                    <p className="text-sm text-gray-500">Duración: {experience.duration}</p>
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
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Reemplazar Contenido</DialogTitle>
            <DialogDescription>
              {selectedExperience && (
                <span className="text-[#00AEEF] font-medium">{selectedExperience.title}</span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all ${
              isDragOver
                ? "border-[#00AEEF] bg-[#00AEEF]/5"
                : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
            }`}
          >
            <input
              type="file"
              accept=".zip"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex size-16 items-center justify-center rounded-full bg-[#00AEEF]/10 mb-4">
              <Upload className="size-8 text-[#00AEEF]" />
            </div>
            <p className="text-center text-sm text-gray-600 mb-1">
              Arrastra el nuevo archivo aquí o haz click para buscar
            </p>
            <p className="text-xs text-gray-400">Formato aceptado: .zip (máx 500MB)</p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              className="rounded-full"
            >
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