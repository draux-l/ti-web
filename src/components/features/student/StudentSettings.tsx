"use client"

import { useState } from "react"
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
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

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
  const [user, setUser] = useState({
    first_name: "Ander",
    last_name: "García",
    username: "ander.garcia",
    preferred_language: "es",
  })

  const [emails, setEmails] = useState<EmailRecord[]>([
    { id: "1", address: "ander.garcia@correo.com", type: "personal", is_primary: true, verified_at: "2024-01-15T10:00:00Z" },
    { id: "2", address: "ander@trabajo.com", type: "work", is_primary: false, verified_at: null },
  ])

  const [phones, setPhones] = useState<PhoneRecord[]>([
    { id: "1", number: "+51 999 888 777", type: "mobile", is_primary: true },
    { id: "2", number: "+51 01 234 5678", type: "landline", is_primary: false },
  ])

  const [devices] = useState<GroupExperience[]>([
    { id: "1", name: "Quest 3 - Casa", platform: "metaquest", device_id: "MQ3-2024-001", last_sync: "2024-03-10T14:30:00Z" },
  ])

  const [notifications, setNotifications] = useState({
    courseReminders: true,
    gradeUpdates: true,
    newExperiences: false,
    systemAlerts: true,
  })

  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false)
  const [editingEmail, setEditingEmail] = useState<EmailRecord | null>(null)
  const [editingPhone, setEditingPhone] = useState<PhoneRecord | null>(null)
  const [emailForm, setEmailForm] = useState({ address: "", type: "personal" as EmailRecord["type"], is_primary: false })
  const [phoneForm, setPhoneForm] = useState({ number: "", type: "mobile" as PhoneRecord["type"], is_primary: false })

  const handleAddEmail = () => {
    setEditingEmail(null)
    setEmailForm({ address: "", type: "personal", is_primary: false })
    setEmailDialogOpen(true)
  }

  const handleEditEmail = (email: EmailRecord) => {
    setEditingEmail(email)
    setEmailForm({ address: email.address, type: email.type, is_primary: email.is_primary })
    setEmailDialogOpen(true)
  }

  const handleSaveEmail = () => {
    if (!emailForm.address) return
    if (editingEmail) {
      setEmails((prev) => prev.map((e) => e.id === editingEmail.id ? { ...e, ...emailForm } : emailForm.is_primary ? { ...e, is_primary: false } : e))
    } else {
      const newEmail: EmailRecord = { id: Date.now().toString(), ...emailForm, verified_at: null }
      setEmails((prev) => emailForm.is_primary ? [...prev.map((e) => ({ ...e, is_primary: false })), newEmail] : [...prev, newEmail])
    }
    setEmailDialogOpen(false)
  }

  const handleDeleteEmail = (id: string) => setEmails((prev) => prev.filter((e) => e.id !== id))

  const handleAddPhone = () => {
    setEditingPhone(null)
    setPhoneForm({ number: "", type: "mobile", is_primary: false })
    setPhoneDialogOpen(true)
  }

  const handleEditPhone = (phone: PhoneRecord) => {
    setEditingPhone(phone)
    setPhoneForm({ number: phone.number, type: phone.type, is_primary: phone.is_primary })
    setPhoneDialogOpen(true)
  }

  const handleSavePhone = () => {
    if (!phoneForm.number) return
    if (editingPhone) {
      setPhones((prev) => prev.map((p) => p.id === editingPhone.id ? { ...p, ...phoneForm } : phoneForm.is_primary ? { ...p, is_primary: false } : p))
    } else {
      const newPhone: PhoneRecord = { id: Date.now().toString(), ...phoneForm }
      setPhones((prev) => phoneForm.is_primary ? [...prev.map((p) => ({ ...p, is_primary: false })), newPhone] : [...prev, newPhone])
    }
    setPhoneDialogOpen(false)
  }

  const handleDeletePhone = (id: string) => setPhones((prev) => prev.filter((p) => p.id !== id))

  const handleGenerateXRAccessCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    alert(`Código de acceso XR generado: ${code}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E] md:text-3xl">Configuración</h1>
        <p className="mt-1 text-sm text-gray-500">Gestiona tu perfil y preferencias de la plataforma.</p>
      </div>

      <div className="grid gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm sm:grid-cols-3 lg:grid-cols-6 overflow-x-auto">
        <button className={`h-10 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${tab === "perfil" ? "bg-[#00AEEF] text-white" : "text-gray-600 hover:bg-slate-50"}`} onClick={() => setTab("perfil")}>Perfil</button>
        <button className={`h-10 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${tab === "correos" ? "bg-[#00AEEF] text-white" : "text-gray-600 hover:bg-slate-50"}`} onClick={() => setTab("correos")}>Correos</button>
        <button className={`h-10 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${tab === "telefonos" ? "bg-[#00AEEF] text-white" : "text-gray-600 hover:bg-slate-50"}`} onClick={() => setTab("telefonos")}>Teléfonos</button>
        <button className={`h-10 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${tab === "dispositivos" ? "bg-[#00AEEF] text-white" : "text-gray-600 hover:bg-slate-50"}`} onClick={() => setTab("dispositivos")}>Dispositivos</button>
        <button className={`h-10 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${tab === "notificaciones" ? "bg-[#00AEEF] text-white" : "text-gray-600 hover:bg-slate-50"}`} onClick={() => setTab("notificaciones")}>Notificaciones</button>
        <button className={`h-10 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${tab === "seguridad" ? "bg-[#00AEEF] text-white" : "text-gray-600 hover:bg-slate-50"}`} onClick={() => setTab("seguridad")}>Seguridad</button>
      </div>

      {tab === "perfil" && (
        <Card className="rounded-3xl bg-white shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-2"><User className="size-5 text-[#00AEEF]" />Perfil de Usuario</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"><p className="text-sm font-medium text-[#1A1A2E] sm:w-40">Nombre:</p><Input value={user.first_name} onChange={(e) => setUser(p => ({...p, first_name: e.target.value}))} className="h-10 flex-1 rounded-full bg-slate-50" /></div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"><p className="text-sm font-medium text-[#1A1A2E] sm:w-40">Apellido:</p><Input value={user.last_name} onChange={(e) => setUser(p => ({...p, last_name: e.target.value}))} className="h-10 flex-1 rounded-full bg-slate-50" /></div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"><p className="text-sm font-medium text-[#1A1A2E] sm:w-40">Usuario:</p><Input value={user.username} disabled className="h-10 flex-1 rounded-full bg-slate-50 text-gray-500" /></div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"><p className="text-sm font-medium text-[#1A1A2E] sm:w-40">Idioma:</p><Input value={user.preferred_language === "es" ? "Español" : user.preferred_language === "en" ? "English" : "Português"} disabled className="h-10 flex-1 rounded-full bg-slate-50 text-gray-500" /></div>
            </div>
            <Button className="rounded-full bg-[#00AEEF] text-white hover:bg-[#0098d1]"><Save className="size-4" />Guardar Cambios</Button>
          </CardContent>
        </Card>
      )}

      {tab === "correos" && (
        <Card className="rounded-3xl bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Mail className="size-5 text-[#00AEEF]" />Correos Electrónicos</CardTitle>
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
                    <span className="text-xs text-gray-500 capitalize">{email.type === "personal" ? "Personal" : email.type === "work" ? "Trabajo" : "Facturación"}</span>
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
            <CardTitle className="flex items-center gap-2"><Phone className="size-5 text-[#00AEEF]" />Teléfonos</CardTitle>
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
                    <span className="text-xs text-gray-500 capitalize">{phone.type === "mobile" ? "Móvil" : phone.type === "landline" ? "Fijo" : "Trabajo"}</span>
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
            <Button onClick={handleGenerateXRAccessCode} className="rounded-full bg-[#00AEEF] text-white hover:bg-[#0098d1]"><Key className="size-4" />Generar código XR</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Monitor className="size-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-[#1A1A2E]">{device.name}</div>
                    <div className="text-xs text-gray-500">{device.platform} • {device.device_id}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Última sync: {new Date(device.last_sync).toLocaleDateString("es-PE")}</span>
                  <Button variant="ghost" size="icon" className="size-8 rounded-full text-gray-400 hover:text-[#00AEEF]"><RefreshCw className="size-4" /></Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {tab === "notificaciones" && (
        <Card className="rounded-3xl bg-white shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="size-5 text-[#FFB800]" />Preferencias de Notificación</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <NotificationItem label="Recordatorios de cursos" value={notifications.courseReminders} onChange={(v) => setNotifications(p => ({...p, courseReminders: v}))} />
            <NotificationItem label="Actualizaciones de calificaciones" value={notifications.gradeUpdates} onChange={(v) => setNotifications(p => ({...p, gradeUpdates: v}))} />
            <NotificationItem label="Nuevas experiencias disponibles" value={notifications.newExperiences} onChange={(v) => setNotifications(p => ({...p, newExperiences: v}))} />
            <NotificationItem label="Alertas del sistema" value={notifications.systemAlerts} onChange={(v) => setNotifications(p => ({...p, systemAlerts: v}))} />
          </CardContent>
        </Card>
      )}

      {tab === "seguridad" && (
        <Card className="rounded-3xl bg-white shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="size-5 text-emerald-600" />Seguridad y Acceso</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
              <p className="mb-2 text-sm font-semibold text-[#1A1A2E]">Actualizar contraseña</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input type="password" placeholder="Nueva contraseña" className="h-10 rounded-full bg-white" />
                <Input type="password" placeholder="Confirmar contraseña" className="h-10 rounded-full bg-white" />
              </div>
            </div>
            <Button variant="outline" className="rounded-full border-[#00AEEF] text-[#00AEEF] hover:bg-blue-50"><Lock className="size-4" />Cambiar contraseña</Button>
          </CardContent>
        </Card>
      )}

      {emailDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">{editingEmail ? "Editar correo" : "Agregar correo"}</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Correo electrónico</Label>
                <Input value={emailForm.address} onChange={(e) => setEmailForm(p => ({...p, address: e.target.value}))} placeholder="correo@ejemplo.com" className="h-10 rounded-full" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tipo</Label>
                <select value={emailForm.type} onChange={(e) => setEmailForm(p => ({...p, type: e.target.value as EmailRecord["type"]}))} className="h-10 w-full rounded-full border border-gray-200 bg-slate-50 px-4">
                  <option value="personal">Personal</option>
                  <option value="work">Trabajo</option>
                  <option value="billing">Facturación</option>
                </select>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={emailForm.is_primary} onChange={(e) => setEmailForm(p => ({...p, is_primary: e.target.checked}))} className="rounded" />
                <span className="text-sm">Marcar como principal</span>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEmailDialogOpen(false)} className="rounded-full">Cancelar</Button>
              <Button onClick={handleSaveEmail} className="rounded-full bg-[#00AEEF] text-white hover:bg-[#0098d1]">Guardar</Button>
            </div>
          </div>
        </div>
      )}

      {phoneDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">{editingPhone ? "Editar teléfono" : "Agregar teléfono"}</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Número de teléfono</Label>
                <Input value={phoneForm.number} onChange={(e) => setPhoneForm(p => ({...p, number: e.target.value}))} placeholder="+51 999 888 777" className="h-10 rounded-full" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tipo</Label>
                <select value={phoneForm.type} onChange={(e) => setPhoneForm(p => ({...p, type: e.target.value as PhoneRecord["type"]}))} className="h-10 w-full rounded-full border border-gray-200 bg-slate-50 px-4">
                  <option value="mobile">Móvil</option>
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
              <Button onClick={handleSavePhone} className="rounded-full bg-[#00AEEF] text-white hover:bg-[#0098d1]">Guardar</Button>
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