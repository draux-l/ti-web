"use client"

import * as React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Users, UserPlus, Pencil, Trash2, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useHeaderButton } from "@/contexts/HeaderButtonContext"
import apiClient from "@/lib/api-client"
import { useAuthStore } from "@/stores/auth.store"
import type { User, Specialty } from "@/types/auth.types"

const EMPTY_FORM = {
  id: 0,
  nombre: "",
  apellidos: "",
  dni: "",
  email: "",
  password: "",
  rol: "alumno",
  status: "Activo",
  position: "",
  specialtyId: "",
  phone: "",
}

type FormData = typeof EMPTY_FORM

export function AdminUsers() {
  const [activeTab, setActiveTab] = useState("alumnos")
  const [students, setStudents] = useState<User[]>([])
  const [instructors, setInstructors] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({ ...EMPTY_FORM })
  const [touched, setTouched] = useState({ nombre: false, apellidos: false, dni: false, email: false, password: false })
  const [errors, setErrors] = useState({ nombre: false, apellidos: false, dni: false, email: false, password: false })
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const { setHeaderButton } = useHeaderButton()
  const currentOrgId = useAuthStore((s) => s.user?.orgId)

  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true)
    try {
      const [studentsRes, instructorsRes] = await Promise.all([
        apiClient.get("/users", { params: { roleId: 4, pageSize: 500, orgId: currentOrgId } }),
        apiClient.get("/users", { params: { roleId: 3, pageSize: 500, orgId: currentOrgId } }),
      ])
      setStudents(studentsRes.data.data)
      setInstructors(instructorsRes.data.data)
    } catch {
      toast.error("Error al cargar usuarios", {
        description: "No se pudo conectar con el servidor.",
      })
    } finally {
      setIsLoadingUsers(false)
    }
  }, [currentOrgId])

  const fetchSpecialties = useCallback(async () => {
    try {
      const res = await apiClient.get("/specialties", { params: { pageSize: 500, orgId: currentOrgId } })
      setSpecialties(res.data.data)
    } catch {
      // specialties are optional, silent fail
    }
  }, [currentOrgId])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    if (isAddOpen || isEditOpen) {
      fetchSpecialties()
    }
  }, [isAddOpen, isEditOpen, fetchSpecialties])

  const validateForm = () => {
    const isAdd = isAddOpen
    const newErrors = {
      nombre: !formData.nombre.trim(),
      apellidos: !formData.apellidos.trim(),
      dni: !formData.dni.trim(),
      email: !formData.email.trim(),
      password: isAdd && !formData.password.trim(),
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }

  const userMatches = (user: User, query: string) => {
    const q = query.toLowerCase()
    return (
      (user.name || "").toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      (user.documentNumber || "").includes(query)
    )
  }

  const userStatusFilter = (user: User, filter: string) => {
    if (filter === "todos") return true
    if (filter === "Activo") return user.status === true
    if (filter === "Inactivo") return user.status === false
    return true
  }

  const filteredStudents = useMemo(() => {
    return students.filter((u) => userMatches(u, searchQuery) && userStatusFilter(u, statusFilter))
  }, [students, searchQuery, statusFilter])

  const filteredInstructors = useMemo(() => {
    return instructors.filter((u) => userMatches(u, searchQuery) && userStatusFilter(u, statusFilter))
  }, [instructors, searchQuery, statusFilter])

  useEffect(() => {
    setHeaderButton({
      icon: UserPlus,
      label: "Agregar",
      onClick: () => setIsAddOpen(true),
    })
    return () => setHeaderButton(null)
  }, [setHeaderButton])

  const resetForm = () => {
    setFormData({ ...EMPTY_FORM })
    setTouched({ nombre: false, apellidos: false, dni: false, email: false, password: false })
    setErrors({ nombre: false, apellidos: false, dni: false, email: false, password: false })
    setIsSubmitting(false)
  }

  const buildRequestBody = () => {
    const roleId = formData.rol === "alumno" ? 4 : 3
    const body: Record<string, unknown> = {
      email: formData.email.trim(),
      name: formData.nombre.trim(),
      lastName: formData.apellidos.trim(),
      documentNumber: formData.dni.trim(),
      username: formData.email.trim().split("@")[0],
      orgId: currentOrgId,
      roleId,
      status: formData.status === "Activo",
    }

    if (formData.password.trim()) {
      body.password = formData.password.trim()
    }

    if (roleId === 3) {
      if (formData.position.trim()) body.position = formData.position.trim()
      if (formData.phone.trim()) body.phone = formData.phone.replace(/[^0-9]/g, "")
      if (formData.specialtyId) body.specialtyId = Number(formData.specialtyId)
    }

    return body
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    setTouched({ nombre: true, apellidos: true, dni: true, email: true, password: true })
    if (!validateForm()) {
      setIsSubmitting(false)
      return
    }

    try {
      await apiClient.post("/users", buildRequestBody())
      toast.success("Usuario creado correctamente")
      setIsAddOpen(false)
      resetForm()
      fetchUsers()
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "No se pudo crear el usuario."
      toast.error("Error al crear usuario", { description: msg })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    setTouched({ nombre: true, apellidos: true, dni: true, email: true, password: false })
    if (!formData.nombre.trim() || !formData.apellidos.trim() || !formData.dni.trim() || !formData.email.trim()) {
      setIsSubmitting(false)
      return
    }

    try {
      await apiClient.patch(`/users/${formData.id}`, buildRequestBody())
      toast.success("Usuario actualizado correctamente")
      setIsEditOpen(false)
      resetForm()
      fetchUsers()
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "No se pudo actualizar el usuario."
      toast.error("Error al actualizar", { description: msg })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (userId: string) => {
    try {
      await apiClient.delete(`/users/${userId}`)
      toast.success("Usuario eliminado")
      fetchUsers()
    } catch {
      toast.error("Error al eliminar usuario")
    }
  }

  const openEdit = (user: User) => {
    const [nombre, ...apellidos] = (user.name || "").split(" ")
    const roleId = user.roleId
    setFormData({
      id: 0,
      nombre,
      apellidos: apellidos.join(" "),
      dni: user.documentNumber || "",
      email: user.email,
      password: "",
      rol: roleId === 3 ? "instructor" : "alumno",
      status: user.status ? "Activo" : "Inactivo",
      position: user.position || "",
      specialtyId: user.specialtyId ? String(user.specialtyId) : "",
      phone: user.phone || "",
    })
    setFormData((prev) => ({ ...prev, id: Number(user.id) || 0 }))

    setIsEditOpen(true)
  }

  const renderTable = (data: User[]) => {
    if (isLoadingUsers) {
      return (
        <div className="flex flex-col items-center gap-2 py-12 text-gray-500">
          <Loader2 className="size-6 animate-spin text-[#00AEEF]" />
          <span className="text-sm">Cargando usuarios...</span>
        </div>
      )
    }

    if (data.length === 0) {
      return (
        <div className="flex flex-col items-center gap-2 py-12 text-gray-500">
          <Users className="size-8 opacity-30" />
          <span className="text-sm">No se encontraron usuarios</span>
        </div>
      )
    }

    return (
      <div className="rounded-md border border-slate-200 mt-4 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-700">Nombre</TableHead>
              <TableHead className="font-semibold text-slate-700">Documento</TableHead>
              <TableHead className="font-semibold text-slate-700">Email</TableHead>
              <TableHead className="font-semibold text-slate-700">Estado</TableHead>
              <TableHead className="font-semibold text-slate-700 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user) => (
              <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.documentNumber || "-"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.status ? "default" : "secondary"}
                    className={user.status ? "bg-[#00A3E0] hover:bg-[#008cc0]" : "bg-slate-200 text-slate-600"}
                  >
                    {user.status ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(user)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="h-4 w-4 text-slate-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  const renderInstructorFields = () => (
    <>
      <div className="grid gap-2">
        <Label>Cargo</Label>
        <Input
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          placeholder="Ej: Instructor Senior VR"
        />
      </div>
      <div className="grid gap-2">
        <Label>Especialidad</Label>
        <Select value={formData.specialtyId} onValueChange={(v) => setFormData({ ...formData, specialtyId: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una especialidad" />
          </SelectTrigger>
          <SelectContent>
            {specialties.map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Telefono</Label>
        <Input
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Ej: 51999888777"
        />
        <p className="text-xs text-muted-foreground">Solo digitos, sin +, espacios ni guiones</p>
      </div>
    </>
  )

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Gestion de Usuarios</h1>
          <p className="text-sm text-gray-500 mt-1">Administra estudiantes e instructores de la plataforma</p>
        </div>
        <Dialog
          open={isAddOpen}
          onOpenChange={(val) => {
            setIsAddOpen(val)
            if (!val) resetForm()
          }}
        >
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="hidden md:flex items-center justify-center bg-[#00AEEF] hover:bg-[#33C4F4] text-white font-medium px-6 py-2.5 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-200"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Agregar Usuario
          </button>
          <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleAddSubmit}>
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nombre" className={errors.nombre && touched.nombre ? "text-red-500" : ""}>
                      Nombre
                    </Label>
                    <Input
                      id="nombre"
                      required
                      value={formData.nombre}
                      onChange={(e) => {
                        setFormData({ ...formData, nombre: e.target.value })
                        setTouched({ ...touched, nombre: true })
                      }}
                      onBlur={() => setTouched({ ...touched, nombre: true })}
                      className={errors.nombre && touched.nombre ? "border-red-500" : ""}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="apellidos" className={errors.apellidos && touched.apellidos ? "text-red-500" : ""}>
                      Apellidos
                    </Label>
                    <Input
                      id="apellidos"
                      required
                      value={formData.apellidos}
                      onChange={(e) => {
                        setFormData({ ...formData, apellidos: e.target.value })
                        setTouched({ ...touched, apellidos: true })
                      }}
                      onBlur={() => setTouched({ ...touched, apellidos: true })}
                      className={errors.apellidos && touched.apellidos ? "border-red-500" : ""}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dni" className={errors.dni && touched.dni ? "text-red-500" : ""}>
                    DNI
                  </Label>
                  <Input
                    id="dni"
                    required
                    value={formData.dni}
                    onChange={(e) => {
                      setFormData({ ...formData, dni: e.target.value })
                      setTouched({ ...touched, dni: true })
                    }}
                    onBlur={() => setTouched({ ...touched, dni: true })}
                    className={errors.dni && touched.dni ? "border-red-500" : ""}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className={errors.email && touched.email ? "text-red-500" : ""}>
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      setTouched({ ...touched, email: true })
                    }}
                    onBlur={() => setTouched({ ...touched, email: true })}
                    className={errors.email && touched.email ? "border-red-500" : ""}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className={errors.password && touched.password ? "text-red-500" : ""}>
                    Contrasena
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value })
                      setTouched({ ...touched, password: true })
                    }}
                    onBlur={() => setTouched({ ...touched, password: true })}
                    placeholder="Minimo 8 caracteres"
                    className={errors.password && touched.password ? "border-red-500" : ""}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Rol</Label>
                    <Select
                      value={formData.rol}
                      onValueChange={(v) => setFormData({ ...formData, rol: v, position: "", specialtyId: "", phone: "" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alumno">Alumno</SelectItem>
                        <SelectItem value="instructor">Instructor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Estado</Label>
                    <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Activo">Activo</SelectItem>
                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {formData.rol === "instructor" && renderInstructorFields()}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#00AEEF] hover:bg-[#33C4F4] text-white hover:scale-105 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    "Guardar"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="alumnos" className="gap-2">
            <Users className="w-4 h-4" />
            Alumnos ({students.length})
          </TabsTrigger>
          <TabsTrigger value="instructores" className="gap-2">
            <Users className="w-4 h-4" />
            Instructores ({instructors.length})
          </TabsTrigger>
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
                    placeholder="Buscar por nombre, email o documento..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {renderTable(filteredStudents)}
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
                    placeholder="Buscar por nombre, email o documento..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {renderTable(filteredInstructors)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={isEditOpen}
        onOpenChange={(val) => {
          setIsEditOpen(val)
          if (!val) resetForm()
        }}
      >
        <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-nombre">Nombre</Label>
                  <Input
                    id="edit-nombre"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-apellidos">Apellidos</Label>
                  <Input
                    id="edit-apellidos"
                    required
                    value={formData.apellidos}
                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-dni">DNI</Label>
                <Input
                  id="edit-dni"
                  required
                  value={formData.dni}
                  onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-password">Nueva contrasena (opcional)</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Dejar vacio para no cambiar"
                />
              </div>
              <div className="grid gap-2">
                <Label>Estado</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.rol === "instructor" && renderInstructorFields()}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#00AEEF] hover:bg-[#33C4F4] text-white hover:scale-105 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
