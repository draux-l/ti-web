"use client"

import { useState } from "react"
import { Users, UserPlus, GraduationCap, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  { id: 3, name: "Jorge Silva", dni: "43456789", email: "jorge.silva@tecsup.edu.pe", status: "Mantenimiento" }, // just showing a different status
]

export default function UsersManagementPage() {
  const [activeTab, setActiveTab] = useState("alumnos")

  const renderTable = (data: typeof MOCK_ALUMNOS) => (
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
          {data.map((user) => (
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
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-[#00A3E0] hover:bg-blue-50">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50">
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
        <Dialog>
          {/* Base UI no utiliza asChild, así que le aplicamos las clases del Button directamente al Trigger */}
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background disabled:pointer-events-none disabled:opacity-50 h-10 bg-[#00A3E0] hover:bg-[#008cc0] shadow-md shadow-blue-500/20 text-white font-medium transition-all px-6">
            <UserPlus className="w-4 h-4 mr-2" />
            Añadir Usuario
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
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
                  <Input id="nombre" placeholder="Ej: Juan" className="bg-slate-50/50" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="apellidos">Apellidos</Label>
                  <Input id="apellidos" placeholder="Ej: Pérez García" className="bg-slate-50/50" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="dni">DNI</Label>
                <Input id="dni" placeholder="Ej: 43567890" className="bg-slate-50/50" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email Institucional</Label>
                <Input id="email" type="email" placeholder="nombre.apellido@tecsup.edu.pe" className="bg-slate-50/50" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="rol">Rol</Label>
                <Select defaultValue="alumno">
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
              <DialogClose className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 ring-offset-background transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                Cancelar
              </DialogClose>
              <Button type="submit" className="bg-[#00A3E0] hover:bg-[#008cc0] text-white">Crear Usuario</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm border-slate-200/60 mt-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-slate-800">Usuarios Registrados</CardTitle>
          <CardDescription>Gestiona instructores y alumnos de la institución</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="alumnos" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px] bg-slate-100/80 p-1">
              <TabsTrigger 
                value="alumnos" 
                className="data-[state=active]:bg-white data-[state=active]:text-[#00A3E0] data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Alumnos (5)
              </TabsTrigger>
              <TabsTrigger 
                value="instructores"
                className="data-[state=active]:bg-white data-[state=active]:text-[#00A3E0] data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <Users className="w-4 h-4 mr-2" />
                Instructores (3)
              </TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="alumnos" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                {renderTable(MOCK_ALUMNOS)}
              </TabsContent>
              <TabsContent value="instructores" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                {renderTable(MOCK_INSTRUCTORES)}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
