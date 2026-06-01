"use client"

import { useState, useEffect } from "react"
import { Bell, Lock, Save, Shield, UserIcon, Phone, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import apiClient from "@/lib/api-client"
import { useAuthStore } from "@/stores/auth.store"

type Tab = "perfil" | "notificaciones" | "seguridad"

export function InstructorSettings() {
  const [tab, setTab] = useState<Tab>("perfil")
  const storeUser = useAuthStore((s) => s.user)
  const [isSaving, setIsSaving] = useState(false)

  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [position, setPosition] = useState("")
  const [phone, setPhone] = useState("")
  const [bio, setBio] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  useEffect(() => {
    if (storeUser) {
      setName(storeUser.name || "")
      setLastName(storeUser.lastName || "")
      setPosition(storeUser.position || "")
      setPhone(storeUser.phone || "")
    }
  }, [storeUser])

  const handleSaveProfile = async () => {
    if (!storeUser) return
    setIsSaving(true)
    try {
      await apiClient.patch(`/users/${storeUser.id}`, {
        name: name.trim(),
        lastName: lastName.trim(),
        position: position.trim() || null,
        phone: phone.replace(/[^0-9]/g, "") || null,
      })
      toast.success("Perfil actualizado correctamente")
    } catch {
      toast.error("Error al guardar cambios")
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Las contrasenas no coinciden")
      return
    }
    if (newPassword.length < 8) {
      toast.error("La contrasena debe tener al menos 8 caracteres")
      return
    }
    setIsChangingPassword(true)
    try {
      await apiClient.post("/auth/change-password", {
        currentPassword,
        newPassword,
      })
      toast.success("Contrasena actualizada correctamente")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "No se pudo cambiar la contrasena"
      toast.error(msg)
    } finally {
      setIsChangingPassword(false)
    }
  }

  const [alerts, setAlerts] = useState({ completions: true, retries: true, inactiveGroups: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E] md:text-3xl">Configuracion</h1>
        <p className="mt-1 text-sm text-gray-500">Ajusta tus preferencias de cuenta y seguridad del panel instructor.</p>
      </div>

      <div className="grid gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm sm:grid-cols-3">
        <button className={`h-10 rounded-xl text-sm font-medium transition-colors ${tab === "perfil" ? "bg-[#00AEEF] text-white" : "text-gray-600 hover:bg-slate-50"}`} onClick={() => setTab("perfil")}>Perfil</button>
        <button className={`h-10 rounded-xl text-sm font-medium transition-colors ${tab === "notificaciones" ? "bg-[#00AEEF] text-white" : "text-gray-600 hover:bg-slate-50"}`} onClick={() => setTab("notificaciones")}>Notificaciones</button>
        <button className={`h-10 rounded-xl text-sm font-medium transition-colors ${tab === "seguridad" ? "bg-[#00AEEF] text-white" : "text-gray-600 hover:bg-slate-50"}`} onClick={() => setTab("seguridad")}>Seguridad</button>
      </div>

      {tab === "perfil" && (
        <Card className="rounded-3xl bg-white shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-2"><UserIcon className="size-5 text-[#00AEEF]" />Perfil de Usuario</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"><p className="text-sm font-medium text-[#1A1A2E] sm:w-40">Nombres:</p><Input value={name} onChange={(e) => setName(e.target.value)} className="h-10 flex-1 rounded-full bg-slate-50" /></div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"><p className="text-sm font-medium text-[#1A1A2E] sm:w-40">Apellidos:</p><Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-10 flex-1 rounded-full bg-slate-50" /></div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"><p className="text-sm font-medium text-[#1A1A2E] sm:w-40">Cargo:</p><Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Ej: Instructor Senior VR" className="h-10 flex-1 rounded-full bg-slate-50" /></div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"><p className="text-sm font-medium text-[#1A1A2E] sm:w-40">Telefono:</p><div className="relative flex-1"><Phone className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" /><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="51999888777" className="h-10 rounded-full bg-slate-50 pl-10" /></div></div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"><p className="text-sm font-medium text-[#1A1A2E] sm:w-40">Especialidad:</p><Input value={storeUser?.specialty?.name || "No asignada"} disabled className="h-10 flex-1 rounded-full bg-slate-50 text-gray-500" /></div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"><p className="text-sm font-medium text-[#1A1A2E] sm:w-40">Biografia:</p><Input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Cuentanos sobre ti..." className="h-10 flex-1 rounded-full bg-slate-50" /></div>
            </div>
            <Button onClick={handleSaveProfile} disabled={isSaving} className="rounded-full bg-[#00AEEF] text-white hover:bg-[#0098d1]">
              {isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="size-4" />}
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </CardContent>
        </Card>
      )}

      {tab === "notificaciones" && (
        <Card className="rounded-3xl bg-white shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="size-5 text-[#FFB800]" />Preferencias de Notificacion</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <NotificationItem label="Evaluaciones completadas" value={alerts.completions} onChange={(v) => setAlerts(p => ({...p, completions: v}))} />
            <NotificationItem label="Solicitudes de reintento" value={alerts.retries} onChange={(v) => setAlerts(p => ({...p, retries: v}))} />
            <NotificationItem label="Alertas de grupos inactivos" value={alerts.inactiveGroups} onChange={(v) => setAlerts(p => ({...p, inactiveGroups: v}))} />
          </CardContent>
        </Card>
      )}

      {tab === "seguridad" && (
        <Card className="rounded-3xl bg-white shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="size-5 text-emerald-600" />Seguridad y Acceso</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
              <p className="mb-2 text-sm font-semibold text-[#1A1A2E]">Actualizar contrasena</p>
              <div className="grid gap-3">
                <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Contrasena actual" className="h-10 rounded-full bg-white" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nueva contrasena" className="h-10 rounded-full bg-white" />
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirmar contrasena" className="h-10 rounded-full bg-white" />
                </div>
              </div>
            </div>
            <Button onClick={handleChangePassword} disabled={isChangingPassword} variant="outline" className="rounded-full border-[#00AEEF] text-[#00AEEF] hover:bg-blue-50">
              {isChangingPassword ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Lock className="size-4" />}
              {isChangingPassword ? "Cambiando..." : "Cambiar contrasena"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function NotificationItem({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)} className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-left">
      <span className="text-sm font-medium text-[#1A1A2E]">{label}</span>
      <span className={`h-6 w-11 rounded-full p-1 transition-colors ${value ? "bg-[#00AEEF]" : "bg-gray-300"}`}><span className={`block size-4 rounded-full bg-white transition-transform ${value ? "translate-x-5" : "translate-x-0"}`} /></span>
    </button>
  )
}
