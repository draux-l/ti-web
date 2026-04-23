"use client"

import { useState, useMemo } from "react"
import { Check, ChevronRight, UserCircle, Users, BookOpen, Search, Filter, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

const STEPS = [
  { id: 1, title: "Instructor", icon: UserCircle },
  { id: 2, title: "Alumnos", icon: Users },
  { id: 3, title: "Curso", icon: BookOpen },
]

const MOCK_INSTRUCTORS = [
  { id: "inst1", name: "ANGELES ALIAGA, SUSANA ANDREA", email: "angeles@gmail.com", courses: "", dni: "12345678", telefono: "987654321", especialidad: "Desarrollo" },
  { id: "inst2", name: "GELDRA CHAPELL, ZONIA MARTINA", email: "angeles@gmail.com", courses: "", dni: "23456789", telefono: "987654322", especialidad: "Redes" },
  { id: "inst3", name: "PADILLA VILLANUEVA, WILLIAM EDGAR", email: "angeles@gmail.com", courses: "", dni: "34567890", telefono: "987654323", especialidad: "Diseño" },
  { id: "inst4", name: "ACUÑA ZUÑIGA, RAMON ALBERTO", email: "angeles@gmail.com", courses: "", dni: "45678901", telefono: "987654324", especialidad: "Desarrollo" },
  { id: "inst5", name: "ANSIE PLAZA, SUSANA ANDREA", email: "angeles@gmail.com", courses: "", dni: "56789012", telefono: "987654325", especialidad: "Redes" },
  { id: "inst6", name: "MENDOZA CASTRO, CARLOS", email: "angeles@gmail.com", courses: "", dni: "67890123", telefono: "987654326", especialidad: "Ciberseguridad" },
  { id: "inst7", name: "SILVA PEREZ, MARIA", email: "angeles@gmail.com", courses: "", dni: "78901234", telefono: "987654327", especialidad: "Diseño" },
  { id: "inst8", name: "QUISPE CHURA, JOSE", email: "angeles@gmail.com", courses: "", dni: "89012345", telefono: "987654328", especialidad: "Desarrollo" },
  { id: "inst9", name: "FLORES CONDORI, ANA", email: "angeles@gmail.com", courses: "", dni: "90123456", telefono: "987654329", especialidad: "Ciberseguridad" },
  { id: "inst10", name: "RODRIGUEZ PAZ, LUIS", email: "angeles@gmail.com", courses: "", dni: "01234567", telefono: "987654330", especialidad: "Redes" },
]

const MOCK_STUDENTS = [...MOCK_INSTRUCTORS]

export function AdminAssignments() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedInstructor, setSelectedInstructor] = useState<string>("")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [searchQueryName, setSearchQueryName] = useState("")
  const [filterType, setFilterType] = useState<string>("")
  const [filterQuery, setFilterQuery] = useState("")

  const filteredInstructors = useMemo(() => {
    return MOCK_INSTRUCTORS.filter((instructor) => {
      const matchesName = instructor.name.toLowerCase().includes(searchQueryName.toLowerCase())
      let matchesFilter = true
      if (filterType && filterQuery) {
        if (filterType === "dni") matchesFilter = instructor.dni.includes(filterQuery)
        else if (filterType === "telefono") matchesFilter = instructor.telefono.includes(filterQuery)
        else if (filterType === "especialidad") matchesFilter = instructor.especialidad.toLowerCase() === filterQuery.toLowerCase()
      }
      return matchesName && matchesFilter
    })
  }, [searchQueryName, filterType, filterQuery])

  const handleSelectAllStudents = () => {
    if (selectedStudents.length === MOCK_STUDENTS.length) setSelectedStudents([])
    else setSelectedStudents(MOCK_STUDENTS.map(s => s.id))
  }

  const handleToggleStudent = (id: string) => {
    setSelectedStudents(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-">
      <div className="w-full flex justify-between px-10 pt-6"> 
        {STEPS.map((step, index) => {
          const isCompleted = step.id < currentStep
          const isCurrent = step.id === currentStep
          const last = index === STEPS.length - 1
          return (
            <div key={step.id} className={`flex items-center relative ${last ? '' : 'w-full'}`}> 
              <div className="flex flex-col items-center gap-2 relative z-10 bg-slate-50/50">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${isCompleted ? 'bg-[#34d399] text-white shadow-md' : ''} ${isCurrent ? 'bg-[#00A3E0] text-white shadow-md' : ''} ${!isCompleted && !isCurrent ? 'bg-slate-100 text-slate-400 border border-slate-200' : ''}`}>
                  {step.id}
                </div>
                <span className={`text-xs font-medium ${isCurrent || isCompleted ? 'text-slate-800' : 'text-slate-400'} absolute -bottom-7 whitespace-nowrap`}>
                  {step.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className="flex-1 h-[7px] bg-slate-200 relative w-full">
                  <div className={`absolute top-0 left-0 h-full transition-all duration-500 ease-in-out`} style={{ width: isCompleted ? '100%' : '0%', background: 'linear-gradient(90deg, #34d399 0%, #00eaec 100%)' }} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <Card className="shadow-lg shadow-slate-200/40 border-slate-200/60 h-[470px] mt-10 rounded-2xl flex flex-col relative overflow-hidden bg-white">
        {currentStep === 1 && (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 h-full relative px-10 pt-6">
            <CardHeader className="flex-none bg-white z-10 pb-4">
              <div className="flex items-center gap-2 text-slate-800 mb-1">
                <Users className="w-5 h-5 text-slate-500" />
                <CardTitle className="text-sm 2xl:text-lg">Paso 1: Seleccionar Instructor Responsable del Grupo</CardTitle>
              </div>
              <CardDescription className="text-sm 2xl:text-base text-slate-500 pl-7">Selecciona al instructor que estará a cargo del grupo</CardDescription>
            </CardHeader>
            <div className="flex items-center gap-4 px-4 pb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input type="text" placeholder="Buscar instructores..." className="w-full bg-slate-100/50 border-slate-200 pl-9 text-sm" value={searchQueryName} onChange={(e) => setSearchQueryName(e.target.value)} />
              </div>
              <Select value={filterType} onValueChange={(val) => { setFilterType(val); setFilterQuery(""); }}>
                <SelectTrigger className="w-[140px] bg-white border-slate-200 text-slate-700"><Filter className="w-4 h-4 mr-2 text-slate-500" /><SelectValue placeholder="Filtrar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="telefono">Teléfono</SelectItem>
                  <SelectItem value="dni">DNI</SelectItem>
                  <SelectItem value="especialidad">Especialidad</SelectItem>
                </SelectContent>
              </Select>
              {filterType && filterType !== "especialidad" && (
                <div className="relative w-[200px]">
                  <Input type="text" placeholder={`Buscar por ${filterType}...`} className="w-full bg-white border-slate-200 text-sm" value={filterQuery} onChange={(e) => setFilterQuery(e.target.value)} />
                  {filterQuery && <button onClick={() => setFilterQuery("")} className="absolute right-2 top-2.5 text-slate-400"><X className="h-4 w-4" /></button>}
                </div>
              )}
              {filterType === "especialidad" && (
                <Select value={filterQuery} onValueChange={setFilterQuery}>
                  <SelectTrigger className="w-[200px] bg-white border-slate-200 text-slate-700"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Desarrollo">Desarrollo</SelectItem>
                    <SelectItem value="Redes">Redes</SelectItem>
                    <SelectItem value="Diseño">Diseño</SelectItem>
                    <SelectItem value="Ciberseguridad">Ciberseguridad</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="flex-1 z-10 overflow-y-auto px-6 pb-28">
              <RadioGroup value={selectedInstructor} onValueChange={setSelectedInstructor}>
                <Table>
                  <TableHeader className="sticky top-0 z-10 shadow-sm border-b">
                    <TableRow className="border-b-2 text-xs">
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead className="font-bold text-slate-800">Nombre</TableHead>
                      <TableHead className="font-bold text-slate-800">Correo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInstructors.map((instructor) => (
                      <TableRow 
                        key={instructor.id} 
                        className="text-[10px] hover:bg-slate-50 cursor-pointer border-b border-slate-100" 
                        onClick={() => setSelectedInstructor(instructor.id)}
                      >
                        <TableCell className="w-[50px]">
                          <RadioGroupItem value={instructor.id} className="text-[#00A3E0] border-slate-300" />
                        </TableCell>
                        <TableCell className="font-medium text-slate-600 2xl:text-sm py-2">{instructor.name}</TableCell>
                        <TableCell className="text-slate-500 2xl:text-sm py-2">{instructor.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </RadioGroup>
            </div>
            <div className="absolute bottom-0 left-0 w-full z-20 flex flex-col">
              <div className="h-10 w-full bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
              <div className="bg-white px-8 pt-5 flex justify-end items-center">
                <Button onClick={() => setCurrentStep(2)} disabled={!selectedInstructor} className="bg-[#00A3E0] hover:bg-[#008cc0] text-white px-10 py-5 rounded-md text-base">Continuar<ChevronRight className="w-5 h-5 ml-1" /></Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex-1 flex flex-col animate-in fade-in zoom-in-95 duration-300 h-full px-10 pt-6 relative">
            <CardHeader className="flex-none bg-white z-10 pb-4">
              <div className="flex items-center gap-2 text-slate-800 mb-1"><Users className="w-5 h-5 text-slate-500" /><CardTitle className="text-sm 2xl:text-lg">Paso 2: Seleccionar Alumnos</CardTitle></div>
              <CardDescription className="text-sm 2xl:text-base text-slate-500 pl-7 mb-4">Selecciona los alumnos que participarán en este grupo</CardDescription>
              <Button variant="outline" size="sm" onClick={handleSelectAllStudents} className="w-fit text-slate-700 border-slate-300 hover:bg-slate-50">
                {selectedStudents.length === MOCK_STUDENTS.length ? "Deseleccionar todos" : "Seleccionar todos"}
              </Button>
            </CardHeader>
            <div className="flex-1 overflow-y-auto px-6 pb-28">
              <Table>
                <TableHeader className="bg-white sticky top-0 z-10 shadow-sm border-b">
                  <TableRow className="border-b-2 text-xs"><TableHead className="w-[50px]"></TableHead><TableHead className="font-bold text-slate-800">Nombre</TableHead><TableHead className="font-bold text-slate-800">Correo</TableHead><TableHead className="font-bold text-slate-800 text-right">Cursos</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_STUDENTS.map((student) => (
                    <TableRow key={student.id} className="text-[10px] hover:bg-slate-50 border-b border-slate-100">
                      <TableCell className="w-[50px]"><Checkbox checked={selectedStudents.includes(student.id)} onCheckedChange={() => handleToggleStudent(student.id)} className="border-slate-300" /></TableCell>
                      <TableCell className="font-medium text-slate-600 2xl:text-sm py-2 cursor-pointer" onClick={() => handleToggleStudent(student.id)}>{student.name}</TableCell>
                      <TableCell className="text-slate-500 2xl:text-sm py-2 cursor-pointer" onClick={() => handleToggleStudent(student.id)}>{student.email}</TableCell>
                      <TableCell className="text-right text-slate-500 2xl:text-sm py-2 cursor-pointer" onClick={() => handleToggleStudent(student.id)}>{student.courses}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="absolute bottom-0 left-0 w-full z-20 flex flex-col">
              <div className="h-10 w-full bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
              <div className="bg-white px-8 pt-5 flex justify-between">
                <Button onClick={() => setCurrentStep(1)} variant="outline" className="text-slate-600 px-10 py-5 rounded-md text-base">Atrás</Button>
                <Button onClick={() => setCurrentStep(3)} disabled={selectedStudents.length === 0} className="bg-[#00A3E0] hover:bg-[#008cc0] text-white px-10 py-5 rounded-md text-base">Continuar<ChevronRight className="w-5 h-5 ml-1" /></Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-8 duration-500 h-full px-10 pt-6 relative">
            <CardHeader className="flex-none bg-white z-10 pb-4">
              <div className="flex items-center gap-2 text-slate-800 mb-1"><BookOpen className="w-5 h-5 text-slate-500" /><CardTitle className="text-sm 2xl:text-lg">Paso 3: Seleccionar Curso</CardTitle></div>
              <CardDescription className="text-sm 2xl:text-base text-slate-500 pl-7">Determina el curso y finaliza la asignación</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 flex-1 items-center justify-center border-2 border-dashed border-slate-200 rounded-lg m-6 mb-24 bg-slate-50/50">
              <p className="text-slate-400 font-medium text-sm">Selector de Cursos aquí (Placeholder para el siguiente hito)</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 w-full z-20 flex flex-col">
              <div className="h-20 w-full bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
              <div className="bg-white px-8 pt-5 flex justify-between">
                <Button onClick={() => setCurrentStep(2)} variant="outline" className="text-slate-600 px-10 py-5 rounded-md text-base">Atrás</Button>
                <Button onClick={() => { alert("Asignación guardada con éxito"); setCurrentStep(1); }} className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-5 rounded-md text-base"><Check className="w-5 h-5 mr-2" />Finalizar Asignación</Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}