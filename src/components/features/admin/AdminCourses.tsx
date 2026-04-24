"use client"

import { useState, useEffect, useMemo } from "react"
import { BookOpen, Plus, Pencil, Trash2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useHeaderButton } from "@/contexts/HeaderButtonContext"

const MOCK_COURSES = [
  { id: 1, name: "Fundamentos de Realidad Virtual", specialty: "Desarrollo", description: "Introducción a los conceptos básicos de VR y entornos inmersivos.", students: 14, status: "Activo" },
  { id: 2, name: "Desarrollo de Experiencias AR", specialty: "Diseño", description: "Creación de aplicaciones de realidad aumentada interactiva.", students: 19, status: "Activo" },
  { id: 3, name: "Unity XR Basics", specialty: "Desarrollo", description: "Aprende los fundamentos de Unity para XR.", students: 8, status: "Inactivo" },
  { id: 4, name: "Diseño de Experiencias Inmersivas", specialty: "Diseño", description: "Principios de diseño para experiencias VR/AR.", students: 12, status: "Activo" },
]

export function AdminCourses() {
  const [courses, setCourses] = useState(MOCK_COURSES)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ id: 0, name: "", specialty: "", description: "", status: "Activo" })
  const [searchQuery, setSearchQuery] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("todos")
  const { setHeaderButton } = useHeaderButton()

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSpecialty = specialtyFilter === "todos" || course.specialty === specialtyFilter
      return matchesSearch && matchesSpecialty
    })
  }, [courses, searchQuery, specialtyFilter])

  useEffect(() => {
    setHeaderButton({
      icon: Plus,
      label: "Añadir",
      onClick: () => setIsDialogOpen(true),
    })
    return () => setHeaderButton(null)
  }, [setHeaderButton])

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault()
    setCourses([...courses, { ...formData, id: courses.length + 1, students: 0 }])
    setIsDialogOpen(false)
    setFormData({ id: 0, name: "", specialty: "", description: "", status: "Activo" })
  }

  const handleEditCourse = (e: React.FormEvent) => {
    e.preventDefault()
    setCourses(courses.map(c => c.id === formData.id ? { ...c, name: formData.name, specialty: formData.specialty, description: formData.description, status: formData.status } : c))
    setIsEditDialogOpen(false)
    setFormData({ id: 0, name: "", specialty: "", description: "", status: "Activo" })
  }

  const openEditModal = (course: { id: number; name: string; specialty: string; description: string; status: string }) => {
    setFormData({ id: course.id, name: course.name, specialty: course.specialty, description: course.description, status: course.status })
    setIsEditDialogOpen(true)
  }

  const handleDeleteCourse = (id: number) => {
    if (window.confirm("¿Seguro que deseas eliminar este curso?")) {
      setCourses(courses.filter(c => c.id !== id))
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">
            Gestión de Cursos
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra los programas y cursos de la plataforma
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <button 
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="hidden md:flex items-center justify-center bg-[#00A3E0] hover:bg-[#008cc0] shadow-md shadow-blue-500/20 text-white font-medium transition-all px-6 py-2 rounded-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Añadir Curso
          </button>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddCourse}>
              <DialogHeader>
                <DialogTitle>Nuevo Curso</DialogTitle>
                <DialogDescription>Completa los detalles del nuevo curso.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Nombre del Curso</Label>
                  <Input id="name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Ej: Realidad Mixta Avanzada" className="bg-slate-50/50" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="specialty">Especialidad</Label>
                  <Select value={formData.specialty} onValueChange={(v) => setFormData({...formData, specialty: v})}>
                    <SelectTrigger className="bg-slate-50/50"><SelectValue placeholder="Seleccionar Especialidad" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Desarrollo">Desarrollo</SelectItem>
                      <SelectItem value="Redes">Redes</SelectItem>
                      <SelectItem value="Diseño">Diseño</SelectItem>
                      <SelectItem value="Ciberseguridad">Ciberseguridad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input id="description" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Breve descripción del curso" className="bg-slate-50/50" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                    <SelectTrigger className="bg-slate-50/50"><SelectValue placeholder="Estado" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-[#00A3E0] hover:bg-[#008cc0] text-white">Guardar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm border-slate-200/60 mt-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-slate-800">Cursos Registrados ({filteredCourses.length})</CardTitle>
          <CardDescription>Visualiza y administra todos los cursos disponibles en la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input 
                placeholder="Buscar por nombre o descripción..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Todas las especialidades" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="Desarrollo">Desarrollo</SelectItem>
                <SelectItem value="Diseño">Diseño</SelectItem>
                <SelectItem value="Redes">Redes</SelectItem>
                <SelectItem value="Ciberseguridad">Ciberseguridad</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border border-slate-200 mt-4 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">ID</TableHead>
                  <TableHead className="font-semibold text-slate-700">Nombre del Curso</TableHead>
                  <TableHead className="font-semibold text-slate-700">Especialidad</TableHead>
                  <TableHead className="font-semibold text-slate-700">Descripción</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-center">Alumnos</TableHead>
                  <TableHead className="font-semibold text-slate-700">Estado</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-slate-400">#00{course.id}</TableCell>
                    <TableCell className="font-bold text-slate-900">{course.name}</TableCell>
                    <TableCell className="text-slate-600 font-medium">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">{course.specialty}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm max-w-[250px] truncate">{course.description}</TableCell>
                    <TableCell className="text-slate-500 text-center font-medium">{course.students}</TableCell>
                    <TableCell>
                      <Badge variant={course.status === "Activo" ? "default" : "secondary"} className={course.status === 'Activo' ? 'bg-[#00A3E0] hover:bg-[#008cc0]' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}>
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button onClick={() => openEditModal(course)} variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-[#00A3E0] hover:bg-blue-50">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDeleteCourse(course.id)} variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleEditCourse}>
            <DialogHeader>
              <DialogTitle>Editar Curso</DialogTitle>
              <DialogDescription>Modifica los detalles del curso seleccionado.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-name">Nombre del Curso</Label>
                <Input id="edit-name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-slate-50/50" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-specialty">Especialidad</Label>
                <Select value={formData.specialty} onValueChange={(v) => setFormData({...formData, specialty: v})}>
                  <SelectTrigger className="bg-slate-50/50"><SelectValue placeholder="Seleccionar Especialidad" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Desarrollo">Desarrollo</SelectItem>
                    <SelectItem value="Redes">Redes</SelectItem>
                    <SelectItem value="Diseño">Diseño</SelectItem>
                    <SelectItem value="Ciberseguridad">Ciberseguridad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-description">Descripción</Label>
                <Input id="edit-description" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="bg-slate-50/50" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-status">Estado</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                  <SelectTrigger className="bg-slate-50/50"><SelectValue placeholder="Estado" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-[#00A3E0] hover:bg-[#008cc0] text-white">Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}