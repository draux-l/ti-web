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
import apiClient from "@/lib/api-client"

interface Organization {
  id: number
  name: string
  ruc: string
  country: string
  logo: string | null
}

const EMPTY_FORM = { id: 0, name: "", ruc: "", country: "PE", logo: "" }

export function AdminOrganizations() {
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const PAGE_SIZE = 20

  const fetchOrgs = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await apiClient.get("/organizations", { params: { page, pageSize: PAGE_SIZE } })
      setOrgs(res.data.data)
      setTotalPages(res.data.meta.totalPages)
      setTotal(res.data.meta.total)
    } catch {
      toast.error("Error al cargar organizaciones")
    } finally {
      setIsLoading(false)
    }
  }, [page])

  useEffect(() => { fetchOrgs() }, [fetchOrgs])

  const resetForm = () => { setFormData(EMPTY_FORM); setIsSubmitting(false) }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || !formData.name.trim() || !formData.ruc.trim()) return
    setIsSubmitting(true)
    try {
      await apiClient.post("/organizations", {
        name: formData.name.trim(),
        ruc: formData.ruc.trim(),
        country: formData.country.trim() || "PE",
        logo: formData.logo.trim() || undefined,
      })
      toast.success("Organizacion creada")
      setIsDialogOpen(false)
      resetForm()
      fetchOrgs()
    } catch { toast.error("Error al crear organizacion") }
    finally { setIsSubmitting(false) }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || !formData.name.trim()) return
    setIsSubmitting(true)
    try {
      await apiClient.patch(`/organizations/${formData.id}`, {
        name: formData.name.trim(),
        ruc: formData.ruc.trim(),
        country: formData.country.trim(),
        logo: formData.logo.trim() || undefined,
      })
      toast.success("Organizacion actualizada")
      setIsEditDialogOpen(false)
      resetForm()
      fetchOrgs()
    } catch { toast.error("Error al actualizar") }
    finally { setIsSubmitting(false) }
  }

  const openEdit = (org: Organization) => {
    setFormData({ id: org.id, name: org.name, ruc: org.ruc, country: org.country, logo: org.logo || "" })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    toast.warning("¿Eliminar esta organizacion?", {
      description: "Esta accion no se puede deshacer",
      action: {
        label: "Eliminar",
        onClick: () => {
          apiClient.delete(`/organizations/${id}`)
            .then(() => { toast.success("Organizacion eliminada"); fetchOrgs() })
            .catch(() => toast.error("Error al eliminar"))
        },
      },
      cancel: { label: "Cancelar", onClick: () => {} },
    })
  }

  const filtered = orgs.filter((o) =>
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.ruc.includes(searchQuery)
  )

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Gestion de Organizaciones</h1>
          <p className="text-sm text-gray-500 mt-1">Administra las organizaciones del sistema</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(v) => { setIsDialogOpen(v); if (!v) resetForm() }}>
          <button type="button" onClick={() => setIsDialogOpen(true)} className="hidden md:flex items-center justify-center bg-[#00AEEF] hover:bg-[#33C4F4] text-white font-medium px-6 py-2.5 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-200">
            <Plus className="w-4 h-4 mr-2" />Añadir Organizacion
          </button>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCreate}>
              <DialogHeader><DialogTitle>Nueva Organizacion</DialogTitle><DialogDescription>Completa los datos de la organizacion.</DialogDescription></DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-2"><Label>Nombre</Label><Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Ej: Tecsup" className="bg-slate-50/50" /></div>
                <div className="flex flex-col gap-2"><Label>RUC</Label><Input required value={formData.ruc} onChange={(e) => setFormData({...formData, ruc: e.target.value})} placeholder="Ej: 20123456789" className="bg-slate-50/50" /></div>
                <div className="flex flex-col gap-2"><Label>Pais</Label><Input value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} placeholder="PE" className="bg-slate-50/50" /></div>
                <div className="flex flex-col gap-2"><Label>Logo URL (opcional)</Label><Input value={formData.logo} onChange={(e) => setFormData({...formData, logo: e.target.value})} placeholder="https://..." className="bg-slate-50/50" /></div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-[#00AEEF] hover:bg-[#33C4F4] text-white disabled:opacity-50">{isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}{isSubmitting ? "Creando..." : "Guardar"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm border-slate-200/60">
        <CardHeader className="pb-4"><CardTitle className="text-lg font-bold text-slate-800">Organizaciones ({filtered.length})</CardTitle><CardDescription>Visualiza y administra las organizaciones</CardDescription></CardHeader>
        <CardContent>
          <div className="relative max-w-sm mb-4"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" /><Input placeholder="Buscar por nombre o RUC..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Nombre</TableHead>
                  <TableHead className="font-semibold text-slate-700">RUC</TableHead>
                  <TableHead className="font-semibold text-slate-700">Pais</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-12"><Loader2 className="size-6 animate-spin text-[#00AEEF] mx-auto" /></TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-12 text-gray-500">No se encontraron organizaciones</TableCell></TableRow>
                ) : (
                  filtered.map((org) => (
                    <TableRow key={org.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-bold text-slate-900">{org.name}</TableCell>
                      <TableCell className="text-slate-600">{org.ruc}</TableCell>
                      <TableCell><Badge variant="outline">{org.country}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(org)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(org.id)}><Trash2 className="h-4 w-4 text-slate-500" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-500">
                  Pagina {page} de {totalPages} ({total} registros)
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                    Anterior
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={(v) => { setIsEditDialogOpen(v); if (!v) resetForm() }}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleEdit}>
            <DialogHeader><DialogTitle>Editar Organizacion</DialogTitle><DialogDescription>Modifica los datos de la organizacion.</DialogDescription></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2"><Label>Nombre</Label><Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-slate-50/50" /></div>
              <div className="flex flex-col gap-2"><Label>RUC</Label><Input required value={formData.ruc} onChange={(e) => setFormData({...formData, ruc: e.target.value})} className="bg-slate-50/50" /></div>
              <div className="flex flex-col gap-2"><Label>Pais</Label><Input value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="bg-slate-50/50" /></div>
              <div className="flex flex-col gap-2"><Label>Logo URL (opcional)</Label><Input value={formData.logo} onChange={(e) => setFormData({...formData, logo: e.target.value})} className="bg-slate-50/50" /></div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#00AEEF] hover:bg-[#33C4F4] text-white disabled:opacity-50">{isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}{isSubmitting ? "Guardando..." : "Guardar Cambios"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
