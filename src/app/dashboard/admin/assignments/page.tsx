"use client"

import { useState } from "react"
import { Check, ChevronRight, UserCircle, Users, BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

const STEPS = [
  { id: 1, title: "Instructor", icon: UserCircle },
  { id: 2, title: "Alumnos", icon: Users },
  { id: 3, title: "Curso", icon: BookOpen },
]

// Usamos mas mocks para asegurar que el scroll se active de verdad
const MOCK_INSTRUCTORS = [
  { id: "inst1", name: "ANGELES ALIAGA, SUSANA ANDREA", email: "angeles@gmail.com", courses: "" },
  { id: "inst2", name: "GELDRA CHAPELL, ZONIA MARTINA", email: "angeles@gmail.com", courses: "" },
  { id: "inst3", name: "PADILLA VILLANUEVA, WILLIAM EDGAR", email: "angeles@gmail.com", courses: "" },
  { id: "inst4", name: "ACUÑA ZUÑIGA, RAMON ALBERTO", email: "angeles@gmail.com", courses: "" },
  { id: "inst5", name: "ANSIE PLAZA, SUSANA ANDREA", email: "angeles@gmail.com", courses: "" },
  { id: "inst6", name: "MENDOZA CASTRO, CARLOS", email: "angeles@gmail.com", courses: "" },
  { id: "inst7", name: "SILVA PEREZ, MARIA", email: "angeles@gmail.com", courses: "" },
  { id: "inst8", name: "QUISPE CHURA, JOSE", email: "angeles@gmail.com", courses: "" },
  { id: "inst9", name: "FLORES CONDORI, ANA", email: "angeles@gmail.com", courses: "" },
  { id: "inst10", name: "RODRIGUEZ PAZ, LUIS", email: "angeles@gmail.com", courses: "" },
]

const MOCK_STUDENTS = [...MOCK_INSTRUCTORS]

export default function CourseAssignmentsPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedInstructor, setSelectedInstructor] = useState<string>("")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  const handleSelectAllStudents = () => {
    if (selectedStudents.length === MOCK_STUDENTS.length) {
      setSelectedStudents([]) // deselect all
    } else {
      setSelectedStudents(MOCK_STUDENTS.map(s => s.id)) // select all
    }
  }

  const handleToggleStudent = (id: string) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-10">
      
      {/* STEPPER HEADER */}
      <div className="w-full flex justify-between px-10 pt-6"> 
          {STEPS.map((step, index) => {
            const isCompleted = step.id < currentStep
            const isCurrent = step.id === currentStep

            let last = false
            if (index === STEPS.length - 1) {
              // Si es el último paso, no renderizamos el conector (linea)
              last = true
            }
            return (
              <div key={step.id} className={`flex items-center relative ${last ? '' : 'w-full'}`}> 
                {/* CIRCLE AND TEXT */}
                <div className="flex flex-col items-center gap-2 relative z-10 bg-slate-50/50">
                  {/* Circle */}
                  <div 
                    className={`
                      w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300
                      ${isCompleted ? 'bg-[#34d399] text-white shadow-md' : ''}
                      ${isCurrent ? 'bg-[#00A3E0] text-white shadow-md' : ''}
                      ${!isCompleted && !isCurrent ? 'bg-slate-100 text-slate-400 border border-slate-200' : ''}
                    `}
                  >
                    {step.id}
                  </div>
                  {/* Text */}
                  <span className={`text-sm font-medium ${isCurrent || isCompleted ? 'text-slate-800' : 'text-slate-400'} absolute -bottom-7 whitespace-nowrap`}>
                    {step.title}
                  </span>
                </div>
                
                {/* CONECTOR (LINEA DE TIEMPO) */}
                {index < STEPS.length - 1 && (
                  <div className="flex-1 h-[7px] bg-slate-200 relative w-full ">
                    <div 
                      className={`absolute top-0 left-0 h-full transition-all duration-500 ease-in-out`} 
                      style={{
                        width: isCompleted ? '100%' : '0%',
                        background: 'linear-gradient(90deg, #34d399 0%, #00eaec 100%)' // Gradiente verde a azul-cyan
                      }}
                    />
                  </div>
                )}
              </div>
            )
          })}
      </div>

      {/* STEP CONTENT */}
      {/* Forzamos el height fijo a un tamaño exacto h-[500px] para que se aktive el overflow-y-auto obligatoriamente */}
      <Card className="shadow-lg shadow-slate-200/40 border-slate-200/60 h-[550px] mt-10 rounded-2xl flex flex-col relative overflow-hidden bg-white">
        
        {currentStep === 1 && (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 h-full relative px-10  pt-6">
            <CardHeader className="flex-none bg-white z-10 pb-4">
              <div className="flex items-center gap-2 text-slate-800 mb-1">
                <Users className="w-5 h-5 text-slate-500" />
                <CardTitle className="text-lg">Paso 1 : Seleccionar Instructor Responsable del Grupo</CardTitle>
              </div>
              <CardDescription className="text-slate-500 pl-7">Selecciona al instructor que estará a cargo del grupo</CardDescription>
            </CardHeader>
            
            {/* Table Container with Scroll */}
            <div className="flex-1 z-10 overflow-y-auto px-6 pb-28 custom-scrollba">
              <Table>
                <TableHeader className="sticky top-0 z-10 shadow-sm border-b">
                  <TableRow className="border-b-2 hover:bg-transparent">
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead className="font-bold text-slate-800">Nombre</TableHead>
                    <TableHead className="font-bold text-slate-800">Correo</TableHead>
                    <TableHead className="font-bold text-slate-800 text-right">Cursos asignados</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <RadioGroup value={selectedInstructor} onValueChange={setSelectedInstructor} asChild>
                    <>
                      {MOCK_INSTRUCTORS.map((instructor) => (
                        <TableRow 
                          key={instructor.id} 
                          className="hover:bg-slate-50 cursor-pointer border-b border-slate-100" 
                          onClick={() => setSelectedInstructor(instructor.id)}
                        >
                          <TableCell className="w-[50px]">
                            <RadioGroupItem value={instructor.id} id={instructor.id} className="text-[#00A3E0] border-slate-300 fill-[#00A3E0]" />
                          </TableCell>
                          <TableCell className="font-medium text-slate-600 text-sm py-4">{instructor.name}</TableCell>
                          <TableCell className="text-slate-500 text-sm py-4">{instructor.email}</TableCell>
                          <TableCell className="text-right text-slate-500 text-sm py-4">{instructor.courses}</TableCell>
                        </TableRow>
                      ))}
                    </>
                  </RadioGroup>
                </TableBody>
              </Table>
            </div>
            
            {/* Bottom Gradient overlay & Button Box */}
            <div className="absolute bottom-0 left-0 w-full z-20 flex flex-col">
              {/* GRADIENTE FADE */}
              <div className="h-10 w-full bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
              <div className="bg-white px-8 pt-5 flex justify-end items-center">
                <Button 
                  onClick={() => setCurrentStep(2)}
                  disabled={!selectedInstructor}
                  className="bg-[#00A3E0] hover:bg-[#008cc0] text-white px-10 py-5 rounded-md text-base"
                >
                  Continuar
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex-1 flex flex-col animate-in fade-in zoom-in-95 duration-300 h-full px-10 pt-6 relative">
            <CardHeader className="flex-none bg-white z-10 pb-4">
              <div className="flex items-center gap-2 text-slate-800 mb-1">
                <Users className="w-5 h-5 text-slate-500" />
                <CardTitle className="text-lg">Paso 2 : Seleccionar Alumnos</CardTitle>
              </div>
              <CardDescription className="text-slate-500 pl-7 mb-4">Selecciona los alumnos que participarán en este grupo</CardDescription>
              <div className="pl-7">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSelectAllStudents}
                  className="w-fit text-slate-700 border-slate-300 hover:bg-slate-50"
                >
                  {selectedStudents.length === MOCK_STUDENTS.length ? "Deseleccionar todos" : "Seleccionar todos"}
                </Button>
              </div>
            </CardHeader>

            {/* Table Container with Scroll */}
            <div className="flex-1 overflow-y-auto px-6 pb-28 custom-scrollbar">
              <Table>
                <TableHeader className="bg-white sticky top-0 z-10 shadow-sm border-b">
                  <TableRow className="border-b-2 hover:bg-transparent">
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead className="font-bold text-slate-800">Nombre</TableHead>
                    <TableHead className="font-bold text-slate-800">Correo</TableHead>
                    <TableHead className="font-bold text-slate-800 text-right">Cursos asignados</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_STUDENTS.map((student) => (
                    <TableRow 
                      key={student.id} 
                      className="hover:bg-slate-50 border-b border-slate-100"
                    >
                      <TableCell className="w-[50px]">
                        <Checkbox 
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={() => handleToggleStudent(student.id)}
                          className="border-slate-300 data-[state=checked]:bg-[#00A3E0] data-[state=checked]:border-[#00A3E0] data-[checked]:bg-[#00A3E0] data-[checked]:border-[#00A3E0] text-white flex shrink-0"
                        />
                      </TableCell>
                      <TableCell 
                        className="font-medium text-slate-600 text-sm py-4 cursor-pointer"
                        onClick={() => handleToggleStudent(student.id)}
                      >
                        {student.name}
                      </TableCell>
                      <TableCell 
                        className="text-slate-500 text-sm py-4 cursor-pointer"
                        onClick={() => handleToggleStudent(student.id)}
                      >
                        {student.email}
                      </TableCell>
                      <TableCell 
                        className="text-right text-slate-500 text-sm py-4 cursor-pointer"
                        onClick={() => handleToggleStudent(student.id)}
                      >
                        {student.courses}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Bottom Gradient overlay & Button Box */}
            <div className="absolute bottom-0 left-0 w-full z-20 flex flex-col">
               {/* GRADIENTE FADE */}
               <div className="h-10 w-full bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
               <div className="bg-white px-8 pt-5 flex justify-between">
                <Button 
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="text-slate-600 px-10 py-5 rounded-md text-base"
                  >
                    Atrás
                </Button>
                <Button 
                  onClick={() => setCurrentStep(3)}
                  disabled={selectedStudents.length === 0}
                  className="bg-[#00A3E0] hover:bg-[#008cc0] text-white px-10 py-5 rounded-md text-base"
                >
                  Continuar
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-8 duration-500 h-full px-10 pt-6 relative">
            <CardHeader className="flex-none bg-white z-10 pb-4">
              <div className="flex items-center gap-2 text-slate-800 mb-1">
                <BookOpen className="w-5 h-5 text-slate-500" />
                <CardTitle className="text-lg">Paso 3 : Seleccionar Curso</CardTitle>
              </div>
              <CardDescription className="text-slate-500 pl-7">Determina el curso y finaliza la asignación</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 flex-1 items-center justify-center border-2 border-dashed border-slate-200 rounded-lg m-6 mb-24 bg-slate-50/50">
               <p className="text-slate-400 font-medium text-sm">Selector de Cursos aquí (Placeholder para el siguiente hito)</p>
            </CardContent>
            
            {/* Bottom Gradient overlay & Button Box */}
            <div className="absolute bottom-0 left-0 w-full z-20 flex flex-col">
               <div className="h-20 w-full bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
               <div className="bg-white px-8 pt-5 flex justify-between">
                <Button 
                    onClick={() => setCurrentStep(2)}
                    variant="outline"
                    className="text-slate-600 px-10 py-5 rounded-md text-base"
                  >
                    Atrás
                </Button>
                <Button 
                  onClick={() => {
                    alert("Asignación guardada con éxito")
                    setCurrentStep(1)
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-5 rounded-md text-base"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Finalizar Asignación
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      {/* Adding a simpler global style block for the custom scrollbar if standard tailwind doesn't cut it */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}} />
    </div>
  )
}
