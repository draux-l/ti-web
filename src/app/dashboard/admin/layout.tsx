"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/Sidebar"
import { LogOut, Settings, Globe, Lock } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { setLanguage, t } = useLanguage()
  const userName = "Administrador"
  const role = "admin"

  const [mounted, setMounted] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [passwords, setPasswords] = useState({ old: "", new: "", repeat: "" })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    router.push("/login")
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.new !== passwords.repeat) {
      alert("Las contraseñas nuevas no coinciden")
      return
    }
    alert("Contraseña actualizada exitosamente")
    setIsPasswordModalOpen(false)
    setPasswords({ old: "", new: "", repeat: "" })
  }

  if (!mounted) {
    return (
      <div className="flex h-screen bg-slate-50 w-full overflow-hidden opacity-0">
        <div className="flex-1" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50 w-full overflow-hidden">
      <Sidebar role={role} userName={userName} onLogout={handleLogout} onChangePassword={() => setIsPasswordModalOpen(true)} />
      
      <div className="flex flex-col flex-1 h-full min-w-0">
        <header className="h-16 flex items-center justify-end px-8 border-b border-slate-200 bg-white shadow-sm flex-shrink-0 gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full p-2 text-slate-500 hover:text-[#00A3E0] hover:bg-blue-50 transition-colors">
              <Globe className="w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 z-[100] shadow-xl border border-gray-200 bg-white">
              <DropdownMenuItem onClick={() => setLanguage("es")} className="cursor-pointer focus:bg-slate-100 py-2">{t('topbar', 'es')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("en")} className="cursor-pointer focus:bg-slate-100 py-2">{t('topbar', 'en')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("pt")} className="cursor-pointer focus:bg-slate-100 py-2">{t('topbar', 'pt')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("fr")} className="cursor-pointer focus:bg-slate-100 py-2">{t('topbar', 'fr')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative bg-slate-50">
          {children}
        </main>
      </div>

      <Dialog open={isPasswordModalOpen} onOpenChange={(val) => { setIsPasswordModalOpen(val); if (!val) setPasswords({ old: "", new: "", repeat: "" }) }}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handlePasswordSubmit}>
            <DialogHeader>
              <DialogTitle>{t('topbar', 'passwordChange')}</DialogTitle>
              <DialogDescription>
                Ingresa tu contraseña actual y la nueva contraseña que deseas utilizar.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="old">Contraseña Anterior</Label>
                <Input required id="old" type="password" value={passwords.old} onChange={e => setPasswords({...passwords, old: e.target.value})} className="bg-slate-50/50" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="new">Nueva Contraseña</Label>
                <Input required id="new" type="password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="bg-slate-50/50" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="repeat">Repetir Contraseña</Label>
                <Input required id="repeat" type="password" value={passwords.repeat} onChange={e => setPasswords({...passwords, repeat: e.target.value})} className="bg-slate-50/50" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsPasswordModalOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-[#00A3E0] hover:bg-[#008cc0] text-white">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}