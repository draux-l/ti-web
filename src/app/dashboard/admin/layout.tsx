"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/Sidebar"

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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const userName = "Administrador"
  const role = "admin"

  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [passwords, setPasswords] = useState({ old: "", new: "", repeat: "" })

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

  return (
    <div className="relative h-screen bg-slate-50">
      <Sidebar 
        role={role} 
        userName={userName} 
        onLogout={handleLogout}
        onChangePassword={() => setIsPasswordModalOpen(true)}
        isCollapsed={isCollapsed}
        onToggleCollapse={setIsCollapsed}
      />
      
      <div className="flex flex-col flex-1 h-full min-w-0">
        <main 
          className="flex-1 overflow-y-auto p-8 relative bg-slate-50 transition-all duration-300 ease-in-out"
          style={{ marginLeft: isCollapsed ? "5rem" : "16rem" }}
        >
          {children}
        </main>
      </div>

      <Dialog open={isPasswordModalOpen} onOpenChange={(val) => { setIsPasswordModalOpen(val); if (!val) setPasswords({ old: "", new: "", repeat: "" }) }}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handlePasswordSubmit}>
            <DialogHeader>
              <DialogTitle>Cambiar contraseña</DialogTitle>
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