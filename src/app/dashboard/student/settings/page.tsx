"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import {
  User,
  Mail,
  Phone,
  Smartphone,
  Plus,
  Monitor,
  RefreshCw,
  Key,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

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

interface UserProfile {
  first_name: string
  last_name: string
  username: string
  document: string
  document_type: "DNI" | "RUC"
  preferred_language: string
}

const emailTypes = [
  { value: "personal", label: "Personal" },
  { value: "work", label: "Trabajo" },
  { value: "billing", label: "Facturación" },
] as const

const phoneTypes = [
  { value: "mobile", label: "Móvil" },
  { value: "landline", label: "Fijo" },
  { value: "work", label: "Trabajo" },
] as const

const languages = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
  { value: "pt", label: "Português" },
] as const

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState("profile")
  const [user, setUser] = React.useState<UserProfile>({
    first_name: "Ander",
    last_name: "García",
    username: "ander.garcia",
    document: "12345678",
    document_type: "DNI",
    preferred_language: "es",
  })

  const [emails, setEmails] = React.useState<EmailRecord[]>([
    {
      id: "1",
      address: "ander.garcia@correo.com",
      type: "personal",
      is_primary: true,
      verified_at: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      address: "ander@trabajo.com",
      type: "work",
      is_primary: false,
      verified_at: null,
    },
  ])

  const [phones, setPhones] = React.useState<PhoneRecord[]>([
    { id: "1", number: "+51 999 888 777", type: "mobile", is_primary: true },
    { id: "2", number: "+51 01 234 5678", type: "landline", is_primary: false },
  ])

  const [devices, setDevices] = React.useState<GroupExperience[]>([
    {
      id: "1",
      name: "Quest 3 - Casa",
      platform: "metaquest",
      device_id: "MQ3-2024-001",
      last_sync: "2024-03-10T14:30:00Z",
    },
  ])

  const [emailDialogOpen, setEmailDialogOpen] = React.useState(false)
  const [phoneDialogOpen, setPhoneDialogOpen] = React.useState(false)
  const [editingEmail, setEditingEmail] = React.useState<EmailRecord | null>(null)
  const [editingPhone, setEditingPhone] = React.useState<PhoneRecord | null>(null)

  const [emailForm, setEmailForm] = React.useState({
    address: "",
    type: "personal" as EmailRecord["type"],
    is_primary: false,
  })

  const [phoneForm, setPhoneForm] = React.useState({
    number: "",
    type: "mobile" as PhoneRecord["type"],
    is_primary: false,
  })

  const handleAddEmail = () => {
    setEditingEmail(null)
    setEmailForm({ address: "", type: "personal", is_primary: false })
    setEmailDialogOpen(true)
  }

  const handleEditEmail = (email: EmailRecord) => {
    setEditingEmail(email)
    setEmailForm({
      address: email.address,
      type: email.type,
      is_primary: email.is_primary,
    })
    setEmailDialogOpen(true)
  }

  const handleSaveEmail = () => {
    if (!emailForm.address) return

    if (editingEmail) {
      setEmails((prev) =>
        prev.map((e) =>
          e.id === editingEmail.id
            ? { ...e, ...emailForm }
            : emailForm.is_primary
            ? { ...e, is_primary: false }
            : e
        )
      )
    } else {
      const newEmail: EmailRecord = {
        id: Date.now().toString(),
        ...emailForm,
        verified_at: null,
      }
      setEmails((prev) =>
        emailForm.is_primary
          ? [...prev.map((e) => ({ ...e, is_primary: false })), newEmail]
          : [...prev, newEmail]
      )
    }
    setEmailDialogOpen(false)
  }

  const handleDeleteEmail = (id: string) => {
    setEmails((prev) => prev.filter((e) => e.id !== id))
  }

  const handleAddPhone = () => {
    setEditingPhone(null)
    setPhoneForm({ number: "", type: "mobile", is_primary: false })
    setPhoneDialogOpen(true)
  }

  const handleEditPhone = (phone: PhoneRecord) => {
    setEditingPhone(phone)
    setPhoneForm({
      number: phone.number,
      type: phone.type,
      is_primary: phone.is_primary,
    })
    setPhoneDialogOpen(true)
  }

  const handleSavePhone = () => {
    if (!phoneForm.number) return

    if (editingPhone) {
      setPhones((prev) =>
        prev.map((p) =>
          p.id === editingPhone.id
            ? { ...p, ...phoneForm }
            : phoneForm.is_primary
            ? { ...p, is_primary: false }
            : p
        )
      )
    } else {
      const newPhone: PhoneRecord = {
        id: Date.now().toString(),
        ...phoneForm,
      }
      setPhones((prev) =>
        phoneForm.is_primary
          ? [...prev.map((p) => ({ ...p, is_primary: false })), newPhone]
          : [...prev, newPhone]
      )
    }
    setPhoneDialogOpen(false)
  }

  const handleDeletePhone = (id: string) => {
    setPhones((prev) => prev.filter((p) => p.id !== id))
  }

  const handleGenerateXRAccessCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    alert(`Código de acceso XR generado: ${code}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500">Gestiona tu perfil y preferencias</p>
      </div>

      <Tabs value={activeTab}>
        <TabsList>
          <TabsTrigger 
            value="profile" 
            className="min-w-[140px]"
            onClick={() => router.push("/dashboard/student/settings")}
          >
            <User className="mr-2 size-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger 
            value="emails" 
            className="min-w-[140px]"
            onClick={() => router.push("/dashboard/student/settings?tab=emails")}
          >
            <Mail className="mr-2 size-4" />
            Correos
          </TabsTrigger>
          <TabsTrigger 
            value="phones" 
            className="min-w-[140px]"
            onClick={() => router.push("/dashboard/student/settings?tab=phones")}
          >
            <Phone className="mr-2 size-4" />
            Teléfonos
          </TabsTrigger>
          <TabsTrigger 
            value="devices" 
            className="min-w-[140px]"
            onClick={() => router.push("/dashboard/student/settings?tab=devices")}
          >
            <Smartphone className="mr-2 size-4" />
            Dispositivos XR
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Información del Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Nombre</Label>
                  <Input
                    id="first_name"
                    value={user.first_name}
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, first_name: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Apellido</Label>
                  <Input
                    id="last_name"
                    value={user.last_name}
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, last_name: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Idioma preferido</Label>
                <Select>
                  <SelectTrigger placeholder="Seleccionar idioma">
                    <SelectValue>
                      {languages.find((l) => l.value === user.preferred_language)?.label}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem
                        key={lang.value}
                        value={lang.value}
                        onClick={() =>
                          setUser((prev) => ({
                            ...prev,
                            preferred_language: lang.value,
                          }))
                        }
                      >
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Usuario</Label>
                <Input value={user.username} disabled className="bg-muted/50" />
                <p className="text-xs text-muted-foreground">
                  El nombre de usuario no puede ser modificado
                </p>
              </div>

              <div className="space-y-2">
                <Label>
                  Documento ({user.document_type})
                </Label>
                <Input
                  value={user.document}
                  disabled
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">
                  Por seguridad, el documento no puede ser modificado
                </p>
              </div>

              <Button className="mt-4">
                <Check className="mr-2 size-4" />
                Guardar cambios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Correos electrónicos</CardTitle>
              <Button size="sm" onClick={handleAddEmail}>
                <Plus className="mr-2 size-4" />
                Agregar correo
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emails.map((email) => (
                  <div
                    key={email.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="size-5 text-gray-400" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{email.address}</span>
                          {email.is_primary && (
                            <Badge variant="success">Principal</Badge>
                          )}
                          {!email.verified_at && (
                            <Badge variant="warning">
                              <AlertCircle className="mr-1 size-3" />
                              Pendiente de verificación
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 capitalize">
                          {emailTypes.find((t) => t.value === email.type)?.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleEditEmail(email)}
                      >
                        <Edit2 className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDeleteEmail(email.id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                {emails.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No hay correos registrados
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingEmail ? "Editar correo" : "Agregar correo"}
                </DialogTitle>
                <DialogDescription>
                  {editingEmail
                    ? "Modifica los datos del correo"
                    : "Añade un nuevo correo electrónico"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email-address">Correo electrónico</Label>
                  <Input
                    id="email-address"
                    type="email"
                    value={emailForm.address}
                    onChange={(e) =>
                      setEmailForm((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue>
                        {emailTypes.find((t) => t.value === emailForm.type)?.label}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {emailTypes.map((type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value}
                          onClick={() =>
                            setEmailForm((prev) => ({
                              ...prev,
                              type: type.value,
                            }))
                          }
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={emailForm.is_primary}
                    onChange={(e) =>
                      setEmailForm((prev) => ({
                        ...prev,
                        is_primary: e.target.checked,
                      }))
                    }
                    className="rounded border-input"
                  />
                  <span className="text-sm">Marcar como principal</span>
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEmailDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSaveEmail}>Guardar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="phones">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Teléfonos</CardTitle>
              <Button size="sm" onClick={handleAddPhone}>
                <Plus className="mr-2 size-4" />
                Agregar teléfono
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {phones.map((phone) => (
                  <div
                    key={phone.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Phone className="size-5 text-gray-400" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{phone.number}</span>
                          {phone.is_primary && (
                            <Badge variant="success">Principal</Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 capitalize">
                          {phoneTypes.find((t) => t.value === phone.type)?.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleEditPhone(phone)}
                      >
                        <Edit2 className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDeletePhone(phone.id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                {phones.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No hay teléfonos registrados
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Dialog open={phoneDialogOpen} onOpenChange={setPhoneDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingPhone ? "Editar teléfono" : "Agregar teléfono"}
                </DialogTitle>
                <DialogDescription>
                  {editingPhone
                    ? "Modifica los datos del teléfono"
                    : "Añade un nuevo número de teléfono"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Número de teléfono</Label>
                  <Input
                    id="phone-number"
                    value={phoneForm.number}
                    onChange={(e) =>
                      setPhoneForm((prev) => ({
                        ...prev,
                        number: e.target.value,
                      }))
                    }
                    placeholder="+51 999 888 777"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue>
                        {phoneTypes.find((t) => t.value === phoneForm.type)?.label}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {phoneTypes.map((type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value}
                          onClick={() =>
                            setPhoneForm((prev) => ({
                              ...prev,
                              type: type.value,
                            }))
                          }
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={phoneForm.is_primary}
                    onChange={(e) =>
                      setPhoneForm((prev) => ({
                        ...prev,
                        is_primary: e.target.checked,
                      }))
                    }
                    className="rounded border-input"
                  />
                  <span className="text-sm">Marcar como principal</span>
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPhoneDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSavePhone}>Guardar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="devices">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Dispositivos vinculados</CardTitle>
              <Button onClick={handleGenerateXRAccessCode}>
                <Key className="mr-2 size-4" />
                Generar código XR
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Monitor className="size-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{device.name}</div>
                        <div className="text-xs text-gray-500">
                          {device.platform} • {device.device_id}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        Última sincronización:{" "}
                        {new Date(device.last_sync).toLocaleString("es-PE")}
                      </span>
                      <Button variant="ghost" size="icon-sm">
                        <RefreshCw className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {devices.length === 0 && (
                  <div className="text-center py-8">
                    <Smartphone className="mx-auto size-12 text-gray-300" />
                    <p className="mt-2 text-gray-500">
                      No hay dispositivos vinculados
                    </p>
                    <p className="text-xs text-gray-400">
                      Genera un código XR para vincular un nuevo visor
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}