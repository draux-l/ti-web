"use client"

import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { Users, UserPlus, Pencil, Trash2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useHeaderButton } from "@/contexts/HeaderButtonContext"

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

export function AdminUsers() {
  const [activeTab, setActiveTab] = useState("alumnos")
  const [alumnos, setAlumnos] = useState(MOCK_ALUMNOS)
  const [instructores, setInstructores] = useState(MOCK_INSTRUCTORES)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [formData, setFormData] = useState({ id: 0, nombre: "", apellidos: "", dni: "", email: "", rol: "alumno", status: "Activo" })
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const { setHeaderButton } = useHeaderButton()

  const filteredAlumnos = useMemo(() => {
    return alumnos.filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.dni.includes(searchQuery)
      const matchesStatus = statusFilter === "todos" || user.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [alumnos, searchQuery, statusFilter])

  const filteredInstructores = useMemo(() => {
    return instructores.filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.dni.includes(searchQuery)
      const matchesStatus = statusFilter === "todos" || user.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [instructores, searchQuery, statusFilter])

  useEffect(() => {
    setHeaderButton({
      icon: UserPlus,
      label: "Agregar",
      onClick: () => setIsAddOpen(true),
    })
    return () => setHeaderButton(null)
  }, [setHeaderButton])

  const resetForm = () => setFormData({ id: 0, nombre: "", apellidos: "", dni: "", email: "", rol: "alumno", status: "Activo" })

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fullName = `${formData.nombre} ${formData.apellidos}`.trim()
    const newUser = { id: Date.now(), name: fullName, dni: formData.dni, email: formData.email, status: formData.status }
    if (formData.rol === "alumno") setAlumnos([...alumnos, newUser])
    else setInstructores([...instructores, newUser])
    setIsAddOpen(false)
    resetForm()
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fullName = `${formData.nombre} ${formData.apellidos}`.trim()
    const updatedUser = { id: formData.id, name: fullName, dni: formData.dni, email: formData.email, status: formData.status }
    if (formData.rol === "alumno") setAlumnos(alumnos.map(a => a.id === formData.id ? updatedUser : a))
    else setInstructores(instructores.map(i => i.id === formData.id ? updatedUser : i))
    setIsEditOpen(false)
    resetForm()
  }

  const handleDelete = (id: number, rol: string) => {
    if (rol === "alumno") setAlumnos(alumnos.filter(a => a.id !== id))
    else setInstructores(instructores.filter(i => i.id !== id))
  }

  const openEdit = (user: { id: number; name: string; dni: string; email: string; status: string }, rol: string) => {
    const [nombre, ...apellidos] = user.name.split(" ")
    setFormData({ id: user.id, nombre, apellidos: apellidos.join(" "), dni: user.dni, email: user.email, rol, status: user.status })
    setIsEditOpen(true)
  }

  const renderTable = (data: typeof MOCK_ALUMNOS, rol: string) => (
    <div className="rounded-md border border-slate-200 mt-4 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-semibold text-slate-700">Nombre</TableHead>
            <TableHead className="font-semibold text-slate-700">DNI</TableHead>
            <TableHead className="font-semibold text-slate-700">Email</TableHead>
            <TableHead className="font-semibold text-slate-700">Estado</TableHead>
            <TableHead className="font-semibold text-slate-700 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user) => (
            <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.dni}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.status === "Activo" ? "default" : "secondary"} className={user.status === 'Activo' ? 'bg-[#00A3E0] hover:bg-[#008cc0]' : 'bg-slate-200 text-slate-600'}>{user.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(user, rol)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id, rol)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestión de Usuarios</h1>
          <p className="text-sm text-slate-500 mt-1">Administra estudiantes e instructores de la plataforma</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={(val) => { setIsAddOpen(val); if (!val) resetForm(); }}>
          <button 
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="hidden md:flex items-center justify-center bg-[#00A3E0] hover:bg-[#008cc0] text-white font-medium px-4 py-2 rounded-md"
          >
            <UserPlus className="w-4 h-4 mr-2" />Agregar Usuario
          </button>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleAddSubmit}>
              <DialogHeader><DialogTitle>Agregar Nuevo Usuario</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2"><Label htmlFor="nombre">Nombre</Label><Input id="nombre" required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} /></div>
                  <div className="grid gap-2"><Label htmlFor="apellidos">Apellidos</Label><Input id="apellidos" required value={formData.apellidos} onChange={e => setFormData({...formData, apellidos: e.target.value})} /></div>
                </div>
                <div className="grid gap-2"><Label htmlFor="dni">DNI</Label><Input id="dni" required value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} /></div>
                <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2"><Label>Rol</Label><Select value={formData.rol} onValueChange={(v) => setFormData({...formData, rol: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="alumno">Alumno</SelectItem><SelectItem value="instructor">Instructor</SelectItem></SelectContent></Select></div>
                  <div className="grid gap-2"><Label>Estado</Label><Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Activo">Activo</SelectItem><SelectItem value="Inactivo">Inactivo</SelectItem></SelectContent></Select></div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-[#00A3E0] hover:bg-[#008cc0] text-white">Guardar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="alumnos" className="gap-2"><Users className="w-4 h-4" />Alumnos ({filteredAlumnos.length})</TabsTrigger>
          <TabsTrigger value="instructores" className="gap-2"><Users className="w-4 h-4" />Instructores ({filteredInstructores.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="alumnos" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Alumnos</CardTitle>
              <CardDescription>Alumnos registrados en la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input 
                    placeholder="Buscar por nombre, email o DNI..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]"><SelectValue placeholder="Todos" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {renderTable(filteredAlumnos, "alumno")}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="instructores" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Instructores</CardTitle>
              <CardDescription>Instructores registrados en la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input 
                    placeholder="Buscar por nombre, email o DNI..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]"><SelectValue placeholder="Todos" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {renderTable(filteredInstructores, "instructor")}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog open={isEditOpen} onOpenChange={(val) => { setIsEditOpen(val); if (!val) resetForm(); }}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader><DialogTitle>Editar Usuario</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label htmlFor="edit-nombre">Nombre</Label><Input id="edit-nombre" required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} /></div>
                <div className="grid gap-2"><Label htmlFor="edit-apellidos">Apellidos</Label><Input id="edit-apellidos" required value={formData.apellidos} onChange={e => setFormData({...formData, apellidos: e.target.value})} /></div>
              </div>
              <div className="grid gap-2"><Label htmlFor="edit-dni">DNI</Label><Input id="edit-dni" required value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} /></div>
              <div className="grid gap-2"><Label htmlFor="edit-email">Email</Label><Input id="edit-email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
              <div className="grid gap-2"><Label>Estado</Label><Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}><SelectTrigger><SelectValue placeholder="Selecciona un estado" /></SelectTrigger><SelectContent><SelectItem value="Activo">Activo</SelectItem><SelectItem value="Inactivo">Inactivo</SelectItem><SelectItem value="Mantenimiento">Mantenimiento</SelectItem></SelectContent></Select></div>
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