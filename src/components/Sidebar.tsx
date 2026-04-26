"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Home,
  Users,
  ClipboardList,
  Settings,
  Building,
  BookOpen,
  TrendingUp,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Lock,
  Layout,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useLanguage } from "@/contexts/LanguageContext"

interface SidebarProps {
  role: "student" | "instructor" | "admin" | "superadmin"
  userName: string
  onLogout: () => void
  onChangePassword?: () => void
  onSettings?: () => void
  isCollapsed?: boolean
  onToggleCollapse?: (collapsed: boolean) => void
}

export function Sidebar({ role, userName, onLogout, onChangePassword, onSettings, isCollapsed: controlledCollapsed, onToggleCollapse }: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const isCollapsed = controlledCollapsed ?? internalCollapsed
  const pathname = usePathname()
  const { t } = useLanguage()

  const menuItems: Record<string, { label: string; href: string; icon: React.ElementType }[]> = {
    student: [
      { label: t("sidebar", "inicio"), href: "/dashboard/student", icon: Home },
      { label: t("sidebar", "misCursos"), href: "/dashboard/student/courses", icon: BookOpen },
      { label: t("sidebar", "miProgreso"), href: "/dashboard/student/progress", icon: TrendingUp },
    ],
    instructor: [
      { label: t("sidebar", "inicio"), href: "/dashboard/instructor", icon: Home },
      { label: t("sidebar", "misCursos"), href: "/dashboard/instructor/courses", icon: BookOpen },
      { label: t("sidebar", "misGrupos"), href: "/dashboard/instructor/groups", icon: Users },
      { label: t("sidebar", "controlExperiencias"), href: "/dashboard/instructor/experiences", icon: Layout },
      { label: t("sidebar", "calificaciones"), href: "/dashboard/instructor/grades", icon: BarChart3 },
    ],
    admin: [
      { label: t("sidebar", "inicio"), href: "/dashboard/admin", icon: Home },
      { label: t("sidebar", "usuarios"), href: "/dashboard/admin/users", icon: Users },
      { label: t("sidebar", "cursos"), href: "/dashboard/admin/courses", icon: BookOpen },
      { label: t("sidebar", "asignaciones"), href: "/dashboard/admin/assignments", icon: ClipboardList },
    ],
    superadmin: [
      { label: t("sidebar", "inicio"), href: "/dashboard/superadmin", icon: Home },
      { label: t("sidebar", "instituciones"), href: "/dashboard/superadmin/institutions", icon: Building },
      { label: t("sidebar", "reportes"), href: "/dashboard/superadmin/reports", icon: BarChart3 },
      { label: t("sidebar", "ajustesSistema"), href: "/dashboard/superadmin/system", icon: Settings },
    ],
  }

  const items = menuItems[role] || []

  const handleToggle = () => {
    const newState = !isCollapsed
    if (onToggleCollapse) {
      onToggleCollapse(newState)
    } else {
      setInternalCollapsed(newState)
    }
  }

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-screen flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out overflow-hidden z-10 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex h-16 items-center border-b border-gray-100 px-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#00A3E0]">
            <span className="text-xl font-bold text-white">T</span>
          </div>
          {!isCollapsed && (
            <div className="ml-3 flex flex-col">
              <span className="text-lg font-bold text-gray-900">TECSUP</span>
              <span className="text-xs text-gray-500">RUC: 20117592899</span>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {items.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-lg py-2.5 text-sm font-medium transition-colors ${
                  isCollapsed ? "justify-center px-0" : "gap-3 px-4"
                } ${
                  isActive
                    ? "bg-blue-50 text-[#00A3E0]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="size-5 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            )
})}
        </nav>

        <div className="border-t border-gray-100 p-4">
          <DropdownMenu>
            <DropdownMenuTrigger className={`flex w-full items-center rounded-lg py-2 transition-colors hover:bg-gray-100 focus:outline-none border-none bg-transparent ${
              isCollapsed ? "justify-center px-0" : "px-2"
            }`}>
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                  {userName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="ml-3 flex flex-col items-start text-sm overflow-hidden">
                  <span className="font-semibold text-gray-700 truncate w-full text-left">{userName}</span>
                  <span className="text-xs text-gray-500 capitalize">{role}</span>
                </div>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              side="right"
              className="w-56 z-[100] shadow-xl border border-gray-200 bg-white"
            >
              {onChangePassword && (
                <DropdownMenuItem 
                  onClick={onChangePassword}
                  className="cursor-pointer focus:bg-slate-100 py-2"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  {t("topbar", "passwordChange")}
                </DropdownMenuItem>
              )}
              {onSettings && (
                <DropdownMenuItem 
                  onClick={onSettings}
                  className="cursor-pointer focus:bg-slate-100 py-2"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  {t("sidebar", "configuracion")}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onLogout}
                className="cursor-pointer focus:bg-red-50 text-red-600 py-2"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t("sidebar", "cerrarSesion")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <button
        onClick={handleToggle}
        className="fixed top-1/2 -translate-y-1/2 z-20 flex size-8 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-100 transition-all duration-300 ease-in-out"
        style={{
          left: isCollapsed ? "4rem" : "15rem",
        }}
      >
        {isCollapsed ? (
          <ChevronRight className="size-4 text-gray-600" />
        ) : (
          <ChevronLeft className="size-4 text-gray-500" />
        )}
      </button>
    </>
  )
}