"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Pencil, Trash2, Search, Loader2, Building } from "lucide-react"
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
import { isName } from "@/validators/form.validators"
import { SelectOrg } from "@/components/SelectOrg"

interface Department {
  id: number
  name: string
  description: string | null
  orgId: number
  status: boolean
}

const EMPTY_FORM = { id: 0, name: "", description: "", status: "Activo" }

export function AdminDepartments({ showOrgSelector }: { showOrgSelector?: boolean }) {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [nameError, setNameError] = useState("")
  const [descError, setDescError] = useState("")
  const { setHeaderButton } = useHeaderButton()
  const currentOrgId = useAuthStore((s) => s.user?.orgId)
  const [selectedOrgId, setSelectedOrgId] = useState("")

  const fetchDepartments = useCallback(async () => {
    setIsLoading(true)
    try {
      const params: Record<string, unknown> = { pageSize: 500 }
      if (!showOrgSelector) params.orgId = currentOrgId
      const res = await apiClient.get("/departments", { params })
      setDepartments(res.data.data)
    } catch {
      toast.error("Error al cargar departamentos")
    } finally {
      setIsLoading(false)
    }
  }, [currentOrgId, showOrgSelector])

  useEffect(() => {
    fetchDepartments()
  }, [fetchDepartments])

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
    if (isSubmitting || !formData.name.trim()) return
    if (!isName(formData.name)) {
      setNameError("Solo letras y espacios. Sin numeros ni caracteres especiales")
      return
    }
    if (formData.name.length > 25) {
      setNameError(`Maximo 25 caracteres (tienes ${formData.name.length})`)
      return
    }
    setNameError("")
    if (formData.description.length > 200) {
      setDescError(`Maximo 200 caracteres (tienes ${formData.description.length})`)
      return
    }
    setDescError("")
    setIsSubmitting(true)
    try {
      await apiClient.post("/departments", {
        orgId: showOrgSelector && selectedOrgId ? Number(selectedOrgId) : currentOrgId,
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status === "Activo",
      })
      toast.success("Departamento creado correctamente")
      setIsDialogOpen(false)
      resetForm()
      fetchDepartments()
    } catch (err: unknown) {
      const backend = (err as { response?: { data?: { errors?: { path: string[]; message: string }[] } } })?.response?.data?.errors
      if (backend) {
        for (const e of backend) {
          if (e.path[0] === "name") setNameError(e.message)
          else if (e.path[0] === "description") setDescError(e.message)
        }
      } else {
        toast.error("Error al crear departamento")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || !formData.name.trim()) return
    setIsSubmitting(true)
    try {
      await apiClient.patch(`/departments/${formData.id}`, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status === "Activo",
      })
      toast.success("Departamento actualizado correctamente")
      setIsEditDialogOpen(false)
      resetForm()
      fetchDepartments()
    } catch (err: unknown) {
      const backend = (err as { response?: { data?: { errors?: { path: string[]; message: string }[] } } })?.response?.data?.errors
      if (backend) {
        for (const e of backend) {
          if (e.path[0] === "name") setNameError(e.message)
          else if (e.path[0] === "description") setDescError(e.message)
        }
      } else {
        toast.error("Error al actualizar departamento")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEdit = (dept: Department) => {
    setFormData({
      id: dept.id,
      name: dept.name,
      description: dept.description || "",
      status: dept.status ? "Activo" : "Inactivo",
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    toast.warning("¿Eliminar este departamento?", {
      description: "Esta accion no se puede deshacer",
      action: {
        label: "Eliminar",
        onClick: () => {
          apiClient.delete(`/departments/${id}`)
            .then(() => {
              toast.success("Departamento eliminado")
              fetchDepartments()
            })
            .catch(() => toast.error("Error al eliminar departamento"))
        },
      },
      cancel: { label: "Cancelar", onClick: () => {} },
    })
  }

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Gestion de Departamentos</h1>
          <p className="text-sm text-gray-500 mt-1">Administra los departamentos de tu organizacion</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(v) => { setIsDialogOpen(v); if (!v) resetForm(); }}>
          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="hidden md:flex items-center justify-center bg-[#00AEEF] hover:bg-[#33C4F4] text-white font-medium px-6 py-2.5 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />Añadir Departamento
          </button>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Nuevo Departamento</DialogTitle>
                <DialogDescription>Completa los datos del nuevo departamento.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {showOrgSelector && (
                  <div className="flex flex-col gap-2">
                    <Label>Organizacion <span className="text-red-500">*</span></Label>
                    <SelectOrg value={selectedOrgId} onChange={setSelectedOrgId} />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" required maxLength={25} value={formData.name} onChange={(e) => { setFormData({...formData, name: e.target.value}); setNameError(""); }} placeholder="Ej: IT Department (solo letras, max 25)" className={nameError ? "border-red-500" : "bg-slate-50/50"} />
                  {nameError && <p className="text-xs text-red-500 mt-1">{nameError}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="desc">Descripcion</Label>
                  <Input id="desc" maxLength={200} value={formData.description} onChange={(e) => { setFormData({...formData, description: e.target.value}); setDescError(""); }} placeholder="Ej: Departamento de tecnologia (max 200)" className={descError ? "border-red-500" : "bg-slate-50/50"} />
                  {descError && <p className="text-xs text-red-500 mt-1">{descError}</p>}
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
          <CardTitle className="text-lg font-bold text-slate-800">Departamentos ({filtered.length})</CardTitle>
          <CardDescription>Visualiza y administra los departamentos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input placeholder="Buscar departamentos..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Nombre</TableHead>
                  <TableHead className="font-semibold text-slate-700">Descripcion</TableHead>
                  <TableHead className="font-semibold text-slate-700">Estado</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-12"><Loader2 className="size-6 animate-spin text-[#00AEEF] mx-auto" /></TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-12 text-gray-500">No se encontraron departamentos</TableCell></TableRow>
                ) : (
                  filtered.map((dept) => (
                    <TableRow key={dept.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-bold text-slate-900">{dept.name}</TableCell>
                      <TableCell className="text-slate-500 text-sm max-w-[300px] truncate">{dept.description || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={dept.status ? "default" : "secondary"} className={dept.status ? "bg-[#00A3E0]" : "bg-slate-200 text-slate-600"}>
                          {dept.status ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(dept)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(dept.id)}><Trash2 className="h-4 w-4 text-slate-500" /></Button>
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
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>Editar Departamento</DialogTitle>
              <DialogDescription>Modifica los datos del departamento.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-name">Nombre</Label>
                <Input id="edit-name" required maxLength={25} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-slate-50/50" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-desc">Descripcion</Label>
                <Input id="edit-desc" maxLength={200} value={formData.description} onChange={(e) => { setFormData({...formData, description: e.target.value}); setDescError(""); }} className={descError ? "border-red-500" : "bg-slate-50/50"} />
                {descError && <p className="text-xs text-red-500 mt-1">{descError}</p>}
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
