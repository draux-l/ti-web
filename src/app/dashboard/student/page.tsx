"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { StudentDashboard } from "@/components/features/student/StudentDashboard"
import { StudentCourses } from "@/components/features/student/StudentCourses"
import { StudentCourseDetail } from "@/components/features/student/StudentCourseDetail"
import { StudentProgress } from "@/components/features/student/StudentProgress"
import { AccessCodeModal } from "@/components/features/student/AccessCodeModal"

type View = "dashboard" | "courses" | "progress" | "courseDetail"
type SelectedCourse = string | null

export default function StudentPage() {
  const searchParams = useSearchParams()
  const [currentView, setCurrentView] = useState<View>("dashboard")
  const [selectedCourse, setSelectedCourse] = useState<SelectedCourse>(null)
  const [isXRAccessOpen, setIsXRAccessOpen] = useState(false)
  const [autoTriggerXR, setAutoTriggerXR] = useState(false)

  useEffect(() => {
    const view = searchParams.get("view")
    const course = searchParams.get("course")
    
    if (view === "courseDetail" && course) {
      setSelectedCourse(course)
      setCurrentView("courseDetail")
    }
  }, [searchParams])

  const handleNavigate = (view: "dashboard" | "courses" | "progress") => {
    setCurrentView(view)
    setSelectedCourse(null)
  }

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourse(courseId)
    setCurrentView("courseDetail")
  }

  const handleBackToCourses = () => {
    setCurrentView("courses")
    setSelectedCourse(null)
  }

  const handleOpenXRCode = (autoTrigger = false) => {
    setAutoTriggerXR(autoTrigger)
    setIsXRAccessOpen(true)
  }

  const renderContent = () => {
    switch (currentView) {
      case "courseDetail":
        return (
          <StudentCourseDetail
            courseId={selectedCourse || "1"}
            onBack={handleBackToCourses}
            onOpenXRCode={() => handleOpenXRCode(true)}
          />
        )
      case "courses":
        return (
          <StudentCourses />
        )
      case "progress":
        return <StudentProgress />
      case "dashboard":
      default:
        return (
          <StudentDashboard
            onNavigate={handleNavigate}
            onSelectCourse={handleSelectCourse}
            onOpenXRCode={() => handleOpenXRCode(false)}
          />
        )
    }
  }

  return (
    <>
      {renderContent()}
      <AccessCodeModal
        isOpen={isXRAccessOpen}
        onClose={() => setIsXRAccessOpen(false)}
        autoTrigger={autoTriggerXR}
      />
    </>
  )
}
