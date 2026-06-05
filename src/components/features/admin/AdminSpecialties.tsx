"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useHeaderButton } from "@/contexts/HeaderButtonContext"
import apiClient from "@/lib/api-client"
import { useAuthStore } from "@/stores/auth.store"
import { isName, isAlphaNumeric } from "@/validators/form.validators"

interface Department {
  id: number
  name: string
}

interface Specialty {
  id: number
  code: string
  name: string
  description: string | null
  image: string | null
  departmentId: number
  status: boolean
  department?: Department
}

const EMPTY_FORM = { id: 0, code: "", name: "", description: "", image: "", departmentId: "", status: "Activo" }

export function AdminSpecialties() {
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [codeError, setCodeError] = useState("")
  const [nameError, setNameError] = useState("")
  const { setHeaderButton } = useHeaderButton()
  const currentOrgId = useAuthStore((s) => s.user?.orgId)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [specRes, deptRes] = await Promise.all([
        apiClient.get("/specialties", { params: { pageSize: 500, orgId: currentOrgId } }),
        apiClient.get("/departments", { params: { pageSize: 500, orgId: currentOrgId } }),
      ])
      setSpecialties(specRes.data.data)
      setDepartments(deptRes.data.data)
    } catch {
      toast.error("Error al cargar especialidades")
    } finally {
      setIsLoading(false)
    }
  }, [currentOrgId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    setHeaderButton({
      icon: Plus,
      label: "Añadir",
      onClick: () => setIsDialogOpen(true),
    })
    return () => setHeaderButton(null)
  }, [setHeaderButton])

  const resetForm = () => {
    setFormData(EMPTY_FORM)
    setIsSubmitting(false)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    if (!formData.name.trim() || !formData.code.trim() || !formData.description.trim() || !formData.departmentId) {
      toast.error("Completa todos los campos requeridos")
      return
    }
    if (!isAlphaNumeric(formData.code)) { setCodeError("Solo letras, numeros y guiones"); return }
    setCodeError("")
    if (!isName(formData.name)) { setNameError("Solo letras y espacios"); return }
    setNameError("")
    setIsSubmitting(true)
    try {
      await apiClient.post("/specialties", {
        departmentId: Number(formData.departmentId),
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim(),
        image: formData.image.trim() || undefined,
        status: formData.status === "Activo",
      })
      toast.success("Especialidad creada correctamente")
      setIsDialogOpen(false)
      resetForm()
      fetchData()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error al crear especialidad"
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || !formData.name.trim()) return
    setIsSubmitting(true)
    try {
      await apiClient.patch(`/specialties/${formData.id}`, {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase() || undefined,
        description: formData.description.trim() || undefined,
        image: formData.image.trim() || undefined,
        status: formData.status === "Activo",
      })
      toast.success("Especialidad actualizada correctamente")
      setIsEditDialogOpen(false)
      resetForm()
      fetchData()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error al actualizar especialidad"
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEdit = (spec: Specialty) => {
    setFormData({
      id: spec.id,
      code: spec.code,
      name: spec.name,
      description: spec.description || "",
      image: spec.image || "",
      departmentId: String(spec.departmentId),
      status: spec.status ? "Activo" : "Inactivo",
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    toast.warning("¿Eliminar esta especialidad?", {
      description: "Esta accion no se puede deshacer",
      action: {
        label: "Eliminar",
        onClick: () => {
          apiClient.delete(`/specialties/${id}`)
            .then(() => {
              toast.success("Especialidad eliminada")
              fetchData()
            })
            .catch(() => toast.error("Error al eliminar especialidad"))
        },
      },
      cancel: { label: "Cancelar", onClick: () => {} },
    })
  }

  const departmentName = (deptId: number) => {
    const d = departments.find((x) => x.id === deptId)
    return d?.name || "-"
  }

  const filtered = specialties.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Gestion de Especialidades</h1>
          <p className="text-sm text-gray-500 mt-1">Administra las especialidades de tu organizacion</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(v) => { setIsDialogOpen(v); if (!v) resetForm(); }}>
          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="hidden md:flex items-center justify-center bg-[#00AEEF] hover:bg-[#33C4F4] text-white font-medium px-6 py-2.5 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />Añadir Especialidad
          </button>
          <DialogContent className="sm:max-w-[450px]">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Nueva Especialidad</DialogTitle>
                <DialogDescription>Completa los datos de la nueva especialidad.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="spec-dept">Departamento</Label>
                  <Select value={formData.departmentId} onValueChange={(v) => setFormData({...formData, departmentId: v})}>
                    <SelectTrigger className="bg-slate-50/50"><SelectValue placeholder="Seleccionar departamento" /></SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="spec-code">Codigo</Label>
                    <Input id="spec-code" required value={formData.code} onChange={(e) => { setFormData({...formData, code: e.target.value}); setCodeError(""); }} placeholder="Ej: VR" maxLength={10} className={codeError ? "border-red-500" : "bg-slate-50/50"} />
                    {codeError && <p className="text-xs text-red-500 mt-1">{codeError}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="spec-name">Nombre</Label>
                    <Input id="spec-name" required value={formData.name} onChange={(e) => { setFormData({...formData, name: e.target.value}); setNameError(""); }} placeholder="Ej: Realidad Virtual" maxLength={25} className={nameError ? "border-red-500" : "bg-slate-50/50"} />
                    {nameError && <p className="text-xs text-red-500 mt-1">{nameError}</p>}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="spec-desc">Descripcion</Label>
                  <Input id="spec-desc" required maxLength={100} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Breve descripcion" className="bg-slate-50/50" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="spec-image">Imagen (opcional)</Label>
                  <Input id="spec-image" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} placeholder="https://..." className="bg-slate-50/50" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Estado</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                    <SelectTrigger className="bg-slate-50/50"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-[#00AEEF] hover:bg-[#33C4F4] text-white disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                  {isSubmitting ? "Creando..." : "Guardar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm border-slate-200/60">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-slate-800">Especialidades ({filtered.length})</CardTitle>
          <CardDescription>Visualiza y administra las especialidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input placeholder="Buscar especialidades..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Codigo</TableHead>
                  <TableHead className="font-semibold text-slate-700">Nombre</TableHead>
                  <TableHead className="font-semibold text-slate-700">Departamento</TableHead>
                  <TableHead className="font-semibold text-slate-700">Estado</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-12"><Loader2 className="size-6 animate-spin text-[#00AEEF] mx-auto" /></TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-12 text-gray-500">No se encontraron especialidades</TableCell></TableRow>
                ) : (
                  filtered.map((spec) => (
                    <TableRow key={spec.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-mono text-slate-500">{spec.code}</TableCell>
                      <TableCell className="font-bold text-slate-900">{spec.name}</TableCell>
                      <TableCell className="text-slate-600">{spec.department?.name || departmentName(spec.departmentId)}</TableCell>
                      <TableCell>
                        <Badge variant={spec.status ? "default" : "secondary"} className={spec.status ? "bg-[#00A3E0]" : "bg-slate-200 text-slate-600"}>
                          {spec.status ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(spec)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(spec.id)}><Trash2 className="h-4 w-4 text-slate-500" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={(v) => { setIsEditDialogOpen(v); if (!v) resetForm(); }}>
        <DialogContent className="sm:max-w-[450px]">
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>Editar Especialidad</DialogTitle>
              <DialogDescription>Modifica los datos de la especialidad. El departamento no se puede cambiar.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label>Departamento</Label>
                <Input value={departmentName(Number(formData.departmentId) || 0)} disabled className="bg-slate-50/50 text-gray-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-code">Codigo</Label>
                  <Input id="edit-code" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} maxLength={10} className="bg-slate-50/50" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-name">Nombre</Label>
                  <Input id="edit-name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} maxLength={25} className="bg-slate-50/50" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-desc">Descripcion</Label>
                <Input id="edit-desc" maxLength={100} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="bg-slate-50/50" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-image">Imagen (opcional)</Label>
                <Input id="edit-image" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} placeholder="https://..." className="bg-slate-50/50" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Estado</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                  <SelectTrigger className="bg-slate-50/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#00AEEF] hover:bg-[#33C4F4] text-white disabled:opacity-50">
                {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}
