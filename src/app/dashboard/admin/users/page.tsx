"use client"

import { useState } from "react"
import { Users, UserPlus, GraduationCap, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const MOCK_ALUMNOS = [
  { id: 1, name: "Ana García Pérez", dni: "47890123", email: "ana.garcia@tecsup.edu.pe", status: "Activo" },
  { id: 2, name: "Luis Rodriguez Silva", dni: "48901234", email: "luis.rodriguez@tecsup.edu.pe", status: "Activo" },
  { id: 3, name: "Carmen Fernández Vega", dni: "49912345", email: "carmen.fernandez@tecsup.edu.pe", status: "Activo" },
  { id: 4, name: "Roberto Martínez Castro", dni: "50123456", email: "roberto.martinez@tecsup.edu.pe", status: "Inactivo" },
  { id: 5, name: "Laura Sánchez Ríos", dni: "51234567", email: "laura.sanchez@tecsup.edu.pe", status: "Activo" },
]

const MOCK_INSTRUCTORES = [
  { id: 1, name: "Carlos Mendoza", dni: "41234567", email: "carlos.mendoza@tecsup.edu.pe", status: "Activo" },
  { id: 2, name: "Maria Gonzalez López", dni: "42345678", email: "maria.gonzalez@tecsup.edu.pe", status: "Activo" },
  { id: 3, name: "Jorge Silva", dni: "43456789", email: "jorge.silva@tecsup.edu.pe", status: "Mantenimiento" },
]

export default function UsersManagementPage() {
  const [activeTab, setActiveTab] = useState("alumnos")
  
  const [alumnos, setAlumnos] = useState(MOCK_ALUMNOS)
  const [instructores, setInstructores] = useState(MOCK_INSTRUCTORES)

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  // Combined Form Data
  const [formData, setFormData] = useState({
    id: 0,
    nombre: "",
    apellidos: "",
    dni: "",
    email: "",
    rol: "alumno",
    status: "Activo"
  })

  // Handle Add user
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fullName = `${formData.nombre} ${formData.apellidos}`.trim()
    const newUser = {
      id: Date.now(),
      name: fullName,
      dni: formData.dni,
      email: formData.email,
      status: formData.status
    }
    
    if (formData.rol === "alumno") {
      setAlumnos([...alumnos, newUser])
      if(activeTab !== "alumnos") setActiveTab("alumnos")
    } else {
      setInstructores([...instructores, newUser])
      if(activeTab !== "instructores") setActiveTab("instructores")
    }
    
    setIsAddOpen(false)
    resetForm()
  }

  // Handle Edit User
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedUser = {
      id: formData.id,
      name: formData.nombre, // In edit we'll just put the full name in "nombre" for simplicity, or we can just use name directly.
      dni: formData.dni,
      email: formData.email,
      status: formData.status
    }

    if (formData.rol === "alumno") {
      setAlumnos(alumnos.map(a => a.id === updatedUser.id ? updatedUser : a))
    } else {
      setInstructores(instructores.map(i => i.id === updatedUser.id ? updatedUser : i))
    }

    setIsEditOpen(false)
    resetForm()
  }

  const openEditModal = (user: any, role: string) => {
    setFormData({
      id: user.id,
      nombre: user.name, // using full name in nombre field for edit
      apellidos: "",
      dni: user.dni,
      email: user.email,
      rol: role,
      status: user.status
    })
    setIsEditOpen(true)
  }

  const deleteUser = (id: number, role: string) => {
    if (window.confirm("¿Estás seguro que deseas eliminar este usuario?")) {
      if (role === "alumno") {
        setAlumnos(alumnos.filter(a => a.id !== id))
      } else {
        setInstructores(instructores.filter(i => i.id !== id))
      }
    }
  }

  const resetForm = () => {
    setFormData({ id: 0, nombre: "", apellidos: "", dni: "", email: "", rol: "alumno", status: "Activo" })
  }

  const renderTable = (data: typeof MOCK_ALUMNOS, role: string) => (
    <div className="rounded-md border border-slate-200 mt-4 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-semibold text-slate-700">Nombre Completo</TableHead>
            <TableHead className="font-semibold text-slate-700">DNI</TableHead>
            <TableHead className="font-semibold text-slate-700">Email</TableHead>
            <TableHead className="font-semibold text-slate-700">Estado</TableHead>
            <TableHead className="font-semibold text-slate-700 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-slate-500">No hay usuarios registrados</TableCell>
            </TableRow>
          ) : data.map((user) => (
            <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
              <TableCell className="font-medium text-slate-900">{user.name}</TableCell>
              <TableCell className="text-slate-500">{user.dni}</TableCell>
              <TableCell className="text-slate-500">{user.email}</TableCell>
              <TableCell>
                <Badge 
                  variant={user.status === "Activo" ? "default" : "secondary"}
                  className={`
                    ${user.status === 'Activo' && 'bg-[#00A3E0] hover:bg-[#008cc0]'}
                    ${user.status === 'Inactivo' && 'bg-slate-200 text-slate-600 hover:bg-slate-300'}
                    ${user.status === 'Mantenimiento' && 'bg-amber-100 text-amber-700 hover:bg-amber-200'}
                  `}
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button onClick={() => openEditModal(user, role)} variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-[#00A3E0] hover:bg-blue-50">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => deleteUser(user.id, role)} variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
            Gestión de Usuarios
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra instructores y alumnos de tu institución
          </p>
        </div>
        
        {/* ADD USER DIALOG */}
        <Dialog open={isAddOpen} onOpenChange={(val) => { setIsAddOpen(val); if(!val) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background h-10 bg-[#00A3E0] hover:bg-[#008cc0] shadow-md shadow-blue-500/20 text-white font-medium transition-all px-6">
              <UserPlus className="w-4 h-4 mr-2" />
              Añadir Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddSubmit}>
              <DialogHeader>
                <DialogTitle>Nuevo Usuario</DialogTitle>
                <DialogDescription>
                  Completa los datos del nuevo usuario
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input id="nombre" required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} placeholder="Ej: Juan" className="bg-slate-50/50" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="apellidos">Apellidos</Label>
                    <Input id="apellidos" required value={formData.apellidos} onChange={e => setFormData({...formData, apellidos: e.target.value})} placeholder="Ej: Pérez García" className="bg-slate-50/50" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="dni">DNI</Label>
                  <Input id="dni" required value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} placeholder="Ej: 43567890" className="bg-slate-50/50" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email Institucional</Label>
                  <Input id="email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="nombre.apellido@tecsup.edu.pe" className="bg-slate-50/50" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="rol">Rol</Label>
                  <Select value={formData.rol} onValueChange={v => setFormData({...formData, rol: v})}>
                    <SelectTrigger id="rol" className="bg-slate-50/50">
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alumno">Alumno</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-[#00A3E0] hover:bg-[#008cc0] text-white">Crear Usuario</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm border-slate-200/60 mt-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-slate-800">Usuarios Registrados</CardTitle>
          <CardDescription>Gestiona instructores y alumnos de la institución</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px] bg-slate-100/80 p-1">
              <TabsTrigger 
                value="alumnos" 
                className="data-[state=active]:bg-white data-[state=active]:text-[#00A3E0] data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Alumnos ({alumnos.length})
              </TabsTrigger>
              <TabsTrigger 
                value="instructores"
                className="data-[state=active]:bg-white data-[state=active]:text-[#00A3E0] data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <Users className="w-4 h-4 mr-2" />
                Instructores ({instructores.length})
              </TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="alumnos" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                {renderTable(alumnos, "alumno")}
              </TabsContent>
              <TabsContent value="instructores" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                {renderTable(instructores, "instructor")}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* EDIT USER DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={(val) => { setIsEditOpen(val); if(!val) resetForm(); }}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
              <DialogDescription>
                Modifica los datos del usuario seleccionado.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-nombre">Nombre Completo</Label>
                <Input id="edit-nombre" required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="bg-slate-50/50" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-dni">DNI</Label>
                <Input id="edit-dni" required value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} className="bg-slate-50/50" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-email">Email Institucional</Label>
                <Input id="edit-email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-slate-50/50" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-status">Estado</Label>
                <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                  <SelectTrigger id="edit-status" className="bg-slate-50/50">
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                    <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-[#00A3E0] hover:bg-[#008cc0] text-white">Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}
