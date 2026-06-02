"use client"

import { useState, useEffect } from "react"
import {
  User,
  Mail,
  Phone,
  Smartphone,
  Bell,
  Shield,
  Lock,
  Save,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Monitor,
  RefreshCw,
  Key,
  Loader2,
} from "lucide-react"

import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import apiClient from "@/lib/api-client"
import { useAuthStore } from "@/stores/auth.store"

type Tab = "perfil" | "correos" | "telefonos" | "dispositivos" | "notificaciones" | "seguridad"

interface EmailRecord {
  id: string
  address: string
  type: "personal" | "work" | "billing"
  is_primary: boolean
  verified_at: string | null
}

interface PhoneRecord {
  id: string
  number: string
  type: "mobile" | "landline" | "work"
  is_primary: boolean
}

interface GroupExperience {
  id: string
  name: string
  platform: string
  device_id: string
  last_sync: string
}

export function StudentSettings() {
  const [tab, setTab] = useState<Tab>("perfil")
  const storeUser = useAuthStore((s) => s.user)
  const [isSaving, setIsSaving] = useState(false)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  useEffect(() => {
    if (storeUser) {
      setFirstName(storeUser.name || "")
      setLastName(storeUser.lastName || "")
    }
  }, [storeUser])

  const fetchEmails = async () => {
    if (!storeUser) return
    setIsLoadingEmails(true)
    try {
      const res = await apiClient.get(`/users/${storeUser.id}/emails`)
      setEmails(res.data.map((e: { id: string; email: string; type: string; isPrimary: boolean; verifiedAt: string | null }) => ({
        id: e.id,
        address: e.email,
        type: e.type.toLowerCase() as EmailRecord["type"],
        is_primary: e.isPrimary,
        verified_at: e.verifiedAt,
      })))
    } catch { /* silent */ } finally { setIsLoadingEmails(false) }
  }

  const fetchPhones = async () => {
    if (!storeUser) return
    setIsLoadingPhones(true)
    try {
      const res = await apiClient.get(`/users/${storeUser.id}/phones`)
      setPhones(res.data.map((p: { id: string; phone: string; type: string; isPrimary: boolean }) => ({
        id: p.id,
        number: p.phone,
        type: p.type.toLowerCase() as PhoneRecord["type"],
        is_primary: p.isPrimary,
      })))
    } catch { /* silent */ } finally { setIsLoadingPhones(false) }
  }

  const fetchDevices = async () => {
    if (!storeUser) return
    setIsLoadingDevices(true)
    try {
      const res = await apiClient.get(`/users/${storeUser.id}/devices`)
      setDevices(res.data.map((d: { id: string; name: string; platform: string; deviceId: string; lastSyncAt: string | null }) => ({
        id: d.id,
        name: d.name,
        platform: d.platform,
        device_id: d.deviceId,
        last_sync: d.lastSyncAt || "",
      })))
    } catch { /* silent */ } finally { setIsLoadingDevices(false) }
  }

  useEffect(() => { fetchEmails() }, [storeUser])
  useEffect(() => { fetchPhones() }, [storeUser])
  useEffect(() => { fetchDevices() }, [storeUser])

  const handleSaveProfile = async () => {
    if (!storeUser) return
    setIsSaving(true)
    try {
      await apiClient.patch(`/users/${storeUser.id}`, {
        name: firstName.trim(),
        lastName: lastName.trim(),
      })
      toast.success("Perfil actualizado correctamente")
    } catch {
      toast.error("Error al guardar cambios")
    } finally {
      setIsSaving(false)
    }
  }

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)

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

  const [isGeneratingPin, setIsGeneratingPin] = useState(false)

  const handleGenerateXRAccessCode = async () => {
    setIsGeneratingPin(true)
    try {
      const res = await apiClient.post("/xr-auth/generate-pin")
      const { pin } = res.data
      toast.success(`Codigo de acceso XR: ${pin}`, {
        description: "Ingresa este codigo en tu dispositivo VR. Expira en 5 minutos.",
        duration: 10000,
      })
    } catch {
      toast.error("Error al generar el codigo XR")
    } finally {
      setIsGeneratingPin(false)
    }
  }

  const [emails, setEmails] = useState<EmailRecord[]>([])
  const [isLoadingEmails, setIsLoadingEmails] = useState(false)

  const [phones, setPhones] = useState<PhoneRecord[]>([])
  const [isLoadingPhones, setIsLoadingPhones] = useState(false)

  const [devices, setDevices] = useState<GroupExperience[]>([])
  const [isLoadingDevices, setIsLoadingDevices] = useState(false)

  const [notifications, setNotifications] = useState({
    courseReminders: true,
    gradeUpdates: true,
    newExperiences: false,
    systemAlerts: true,
  })

  useEffect(() => {
    if (!storeUser) return
    apiClient.get(`/users/${storeUser.id}/notification-preferences`)
      .then((res) => {
        const prefs = { courseReminders: true, gradeUpdates: true, newExperiences: false, systemAlerts: true }
        for (const p of res.data) prefs[p.key as keyof typeof prefs] = p.enabled
        setNotifications(prefs)
      })
      .catch(() => {})
  }, [storeUser])

  const saveNotification = async (key: string, enabled: boolean) => {
    setNotifications((p) => ({ ...p, [key]: enabled }))
    if (!storeUser) return
    try {
      await apiClient.patch(`/users/${storeUser.id}/notification-preferences`, {
        preferences: { [key]: enabled },
      })
    } catch {
      setNotifications((p) => ({ ...p, [key]: !enabled }))
    }
  }

  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false)
  const [editingEmail, setEditingEmail] = useState<EmailRecord | null>(null)
  const [editingPhone, setEditingPhone] = useState<PhoneRecord | null>(null)
  const [emailForm, setEmailForm] = useState({ address: "", type: "personal" as EmailRecord["type"], is_primary: false })
  const [emailError, setEmailError] = useState("")
  const [phoneForm, setPhoneForm] = useState({ number: "", type: "mobile" as PhoneRecord["type"], is_primary: false })
  const [phoneError, setPhoneError] = useState("")

  const handleAddEmail = () => {
    setEditingEmail(null)
    setEmailForm({ address: "", type: "personal", is_primary: false })
    setEmailError("")
    setEmailDialogOpen(true)
  }

  const handleEditEmail = (email: EmailRecord) => {
    setEditingEmail(email)
    setEmailForm({ address: email.address, type: email.type, is_primary: email.is_primary })
    setEmailError("")
    setEmailDialogOpen(true)
  }

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  const handleSaveEmail = async () => {
    if (!emailForm.address || !storeUser) return
    if (!isValidEmail(emailForm.address)) {
      setEmailError("Correo electronico invalido")
      return
    }
    try {
      if (editingEmail) {
        await apiClient.patch(`/users/${storeUser.id}/emails/${editingEmail.id}`, {
          email: emailForm.address,
          type: emailForm.type.toUpperCase(),
          isPrimary: emailForm.is_primary,
        })
      } else {
        await apiClient.post(`/users/${storeUser.id}/emails`, {
          email: emailForm.address,
          type: emailForm.type.toUpperCase(),
          isPrimary: emailForm.is_primary,
        })
      }
      setEmailDialogOpen(false)
      fetchEmails()
    } catch { toast.error("Error al guardar correo") }
  }

  const handleDeleteEmail = async (id: string) => {
    if (!storeUser) return
    try {
      await apiClient.delete(`/users/${storeUser.id}/emails/${id}`)
      fetchEmails()
    } catch { toast.error("Error al eliminar correo") }
  }

  const handleAddPhone = () => {
    setEditingPhone(null)
    setPhoneForm({ number: "", type: "mobile", is_primary: false })
    setPhoneError("")
    setPhoneDialogOpen(true)
  }

  const handleEditPhone = (phone: PhoneRecord) => {
    setEditingPhone(phone)
    setPhoneForm({ number: phone.number, type: phone.type, is_primary: phone.is_primary })
    setPhoneError("")
    setPhoneDialogOpen(true)
  }

  const isValidPhone = (v: string) => { const d = v.replace(/[^0-9]/g, ""); return d.length >= 7 && d.length <= 12 }

  const handleSavePhone = async () => {
    if (!phoneForm.number || !storeUser) return
    const digits = phoneForm.number.replace(/[^0-9]/g, "")
    if (digits.length < 7 || digits.length > 12) {
      setPhoneError("Solo numeros, entre 7 y 12 digitos")
      return
    }
    try {
      if (editingPhone) {
        await apiClient.patch(`/users/${storeUser.id}/phones/${editingPhone.id}`, {
          phone: digits,
          type: phoneForm.type.toUpperCase(),
          isPrimary: phoneForm.is_primary,
        })
      } else {
        await apiClient.post(`/users/${storeUser.id}/phones`, {
          phone: digits,
          type: phoneForm.type.toUpperCase(),
          isPrimary: phoneForm.is_primary,
        })
      }
      setPhoneDialogOpen(false)
      fetchPhones()
    } catch { toast.error("Error al guardar telefono") }
  }

  const handleDeletePhone = async (id: string) => {
    if (!storeUser) return
    try {
      await apiClient.delete(`/users/${storeUser.id}/phones/${id}`)
      fetchPhones()
    } catch { toast.error("Error al eliminar telefono") }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E] md:text-3xl">Configuracion</h1>
        <p className="mt-1 text-sm text-gray-500">Gestiona tu perfil y preferencias de la plataforma.</p>
      </div>

      <div className="grid gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm sm:grid-cols-3 lg:grid-cols-6 overflow-x-auto">
        <button className={`h-10 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${tab === "perfil" ? "bg-[#00AEEF] text-white" : "text-gray-600 hover:bg-slate-50"}`} onClick={() => setTab("perfil")}>Perfil</button>
        <button className={`h-10 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${tab === "correos" ? "bg-[#00AEEF] text-white" : "text-gray-600 hover:bg-slate-50"}`} onClick={() => setTab("correos")}>Correos</button>
        <button className={`h-10 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${tab === "telefonos" ? "bg-[#00AEEF] text-white" : "text-gray-600 hover:bg-slate-50"}`} onClick={() => setTab("telefonos")}>Telefonos</button>
        <button className={`h-10 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${tab === "dispositivos" ? "bg-[#00AEEF] text-white" : "text-gray-600 hover:bg-slate-50"}`} onClick={() => setTab("dispositivos")}>Dispositivos</button>
        <button className={`h-10 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${tab === "notificaciones" ? "bg-[#00AEEF] text-white" : "text-gray-600 hover:bg-slate-50"}`} onClick={() => setTab("notificaciones")}>Notificaciones</button>
        <button className={`h-10 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${tab === "seguridad" ? "bg-[#00AEEF] text-white" : "text-gray-600 hover:bg-slate-50"}`} onClick={() => setTab("seguridad")}>Seguridad</button>
      </div>

      {tab === "perfil" && (
        <Card className="rounded-3xl bg-white shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-2"><User className="size-5 text-[#00AEEF]" />Perfil de Usuario</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"><p className="text-sm font-medium text-[#1A1A2E] sm:w-40">Nombre:</p><Input value={firstName} disabled className="h-10 flex-1 rounded-full bg-slate-50 text-gray-500" /></div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"><p className="text-sm font-medium text-[#1A1A2E] sm:w-40">Apellido:</p><Input value={lastName} disabled className="h-10 flex-1 rounded-full bg-slate-50 text-gray-500" /></div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"><p className="text-sm font-medium text-[#1A1A2E] sm:w-40">Usuario:</p><Input value={storeUser?.username || ""} disabled className="h-10 flex-1 rounded-full bg-slate-50 text-gray-500" /></div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"><p className="text-sm font-medium text-[#1A1A2E] sm:w-40">Email:</p><Input value={storeUser?.email || ""} disabled className="h-10 flex-1 rounded-full bg-slate-50 text-gray-500" /></div>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "correos" && (
        <Card className="rounded-3xl bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Mail className="size-5 text-[#00AEEF]" />Correos Electronicos</CardTitle>
            <Button onClick={handleAddEmail} className="rounded-full bg-[#00AEEF] text-white hover:bg-[#0098d1]"><Plus className="size-4" />Agregar</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {emails.map((email) => (
              <div key={email.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Mail className="size-5 text-gray-400" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#1A1A2E]">{email.address}</span>
                      {email.is_primary && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Principal</Badge>}
                      {!email.verified_at && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100"><AlertCircle className="size-3 mr-1" />Pendiente</Badge>}
                    </div>
                    <span className="text-xs text-gray-500 capitalize">{email.type === "personal" ? "Personal" : email.type === "work" ? "Trabajo" : "Facturacion"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEditEmail(email)} className="size-8 rounded-full text-gray-400 hover:text-[#00AEEF]"><Edit2 className="size-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteEmail(email.id)} className="size-8 rounded-full text-gray-400 hover:text-red-500"><Trash2 className="size-4" /></Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {tab === "telefonos" && (
        <Card className="rounded-3xl bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Phone className="size-5 text-[#00AEEF]" />Telefonos</CardTitle>
            <Button onClick={handleAddPhone} className="rounded-full bg-[#00AEEF] text-white hover:bg-[#0098d1]"><Plus className="size-4" />Agregar</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {phones.map((phone) => (
              <div key={phone.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Phone className="size-5 text-gray-400" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#1A1A2E]">{phone.number}</span>
                      {phone.is_primary && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Principal</Badge>}
                    </div>
                    <span className="text-xs text-gray-500 capitalize">{phone.type === "mobile" ? "Movil" : phone.type === "landline" ? "Fijo" : "Trabajo"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEditPhone(phone)} className="size-8 rounded-full text-gray-400 hover:text-[#00AEEF]"><Edit2 className="size-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeletePhone(phone.id)} className="size-8 rounded-full text-gray-400 hover:text-red-500"><Trash2 className="size-4" /></Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {tab === "dispositivos" && (
        <Card className="rounded-3xl bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Smartphone className="size-5 text-[#00AEEF]" />Dispositivos XR</CardTitle>
            <Button onClick={handleGenerateXRAccessCode} disabled={isGeneratingPin} className="rounded-full bg-[#00AEEF] text-white hover:bg-[#0098d1]">
              {isGeneratingPin ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Key className="size-4" />}
              {isGeneratingPin ? "Generando..." : "Generar codigo XR"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Monitor className="size-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-[#1A1A2E]">{device.name}</div>
                    <div className="text-xs text-gray-500">{device.platform} - {device.device_id}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Ultima sync: {new Date(device.last_sync).toLocaleDateString("es-PE")}</span>
                  <Button variant="ghost" size="icon" className="size-8 rounded-full text-gray-400 hover:text-[#00AEEF]"><RefreshCw className="size-4" /></Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {tab === "notificaciones" && (
        <Card className="rounded-3xl bg-white shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="size-5 text-[#FFB800]" />Preferencias de Notificacion</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <NotificationItem label="Recordatorios de cursos" value={notifications.courseReminders} onChange={(v) => saveNotification("courseReminders", v)} />
            <NotificationItem label="Actualizaciones de calificaciones" value={notifications.gradeUpdates} onChange={(v) => saveNotification("gradeUpdates", v)} />
            <NotificationItem label="Nuevas experiencias disponibles" value={notifications.newExperiences} onChange={(v) => saveNotification("newExperiences", v)} />
            <NotificationItem label="Alertas del sistema" value={notifications.systemAlerts} onChange={(v) => saveNotification("systemAlerts", v)} />
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

      {emailDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">{editingEmail ? "Editar correo" : "Agregar correo"}</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Correo electronico</Label>
                <Input value={emailForm.address} onChange={(e) => { setEmailForm(p => ({...p, address: e.target.value})); setEmailError(""); }} placeholder="correo@ejemplo.com" className={`h-10 rounded-full ${emailError ? "border-red-500" : ""}`} />
                {emailError && <p className="text-xs text-red-500">{emailError}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tipo</Label>
                <select value={emailForm.type} onChange={(e) => setEmailForm(p => ({...p, type: e.target.value as EmailRecord["type"]}))} className="h-10 w-full rounded-full border border-gray-200 bg-slate-50 px-4">
                  <option value="personal">Personal</option>
                  <option value="work">Trabajo</option>
                  <option value="billing">Facturacion</option>
                </select>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={emailForm.is_primary} onChange={(e) => setEmailForm(p => ({...p, is_primary: e.target.checked}))} className="rounded" />
                <span className="text-sm">Marcar como principal</span>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEmailDialogOpen(false)} className="rounded-full">Cancelar</Button>
              <Button onClick={handleSaveEmail} disabled={!isValidEmail(emailForm.address)} className="rounded-full bg-[#00AEEF] text-white hover:bg-[#0098d1] disabled:opacity-50">Guardar</Button>
            </div>
          </div>
        </div>
      )}

      {phoneDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">{editingPhone ? "Editar telefono" : "Agregar telefono"}</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Numero de telefono</Label>
                <Input value={phoneForm.number} onChange={(e) => { const digits = e.target.value.replace(/[^0-9]/g, ""); setPhoneForm(p => ({...p, number: digits})); setPhoneError(""); }} placeholder="51999888777" maxLength={12} className={`h-10 rounded-full ${phoneError ? "border-red-500" : ""}`} />
                {phoneError && <p className="text-xs text-red-500">{phoneError}</p>}
                <p className="text-xs text-gray-400">Solo numeros, entre 7 y 12 digitos</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tipo</Label>
                <select value={phoneForm.type} onChange={(e) => setPhoneForm(p => ({...p, type: e.target.value as PhoneRecord["type"]}))} className="h-10 w-full rounded-full border border-gray-200 bg-slate-50 px-4">
                  <option value="mobile">Movil</option>
                  <option value="landline">Fijo</option>
                  <option value="work">Trabajo</option>
                </select>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={phoneForm.is_primary} onChange={(e) => setPhoneForm(p => ({...p, is_primary: e.target.checked}))} className="rounded" />
                <span className="text-sm">Marcar como principal</span>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setPhoneDialogOpen(false)} className="rounded-full">Cancelar</Button>
              <Button onClick={handleSavePhone} disabled={!isValidPhone(phoneForm.number)} className="rounded-full bg-[#00AEEF] text-white hover:bg-[#0098d1] disabled:opacity-50">Guardar</Button>
            </div>
          </div>
        </div>
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
