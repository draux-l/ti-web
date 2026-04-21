"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Home,
  Users,
  ClipboardList,
  Box,
  Settings,
  Building,
  BookOpen,
  TrendingUp,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Lock,
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
}



export function Sidebar({ role, userName, onLogout, onChangePassword }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { t } = useLanguage()

  const menuItems: Record<
    string,
    { label: string; href: string; icon: React.ElementType }[]
  > = {
    student: [
      { label: t("sidebar", "inicio"), href: "/dashboard/student", icon: Home },
      { label: t("sidebar", "misCursos"), href: "/dashboard/student/courses", icon: BookOpen },
      { label: t("sidebar", "miProgreso"), href: "/dashboard/student/progress", icon: TrendingUp },
    ],
    instructor: [
      { label: t("sidebar", "inicio"), href: "/dashboard/instructor", icon: Home },
      { label: t("sidebar", "misGrupos"), href: "/dashboard/instructor/groups", icon: Users },
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

  return (
    <aside
      className={`flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex h-16 items-center border-b border-gray-100 px-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[#00A3E0]">
          <span className="text-xl font-bold text-white">T</span>
        </div>
        {!isCollapsed && (
          <span className="ml-3 text-lg font-bold text-gray-900">
            Tecsup Inmersivo
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto rounded-full p-1.5 hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="size-5 text-gray-500" />
          ) : (
            <ChevronLeft className="size-5 text-gray-500" />
          )}
        </button>
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
        
        {/* Dedicated Configuration Item */}
        {onChangePassword && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex w-full items-center rounded-lg py-2.5 text-sm font-medium transition-colors ${
                  isCollapsed ? "justify-center px-0" : "gap-3 px-4"
                } text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus:outline-none`}
                title={isCollapsed ? t("sidebar", "configuracion") : undefined}
              >
                <Settings className="size-5 shrink-0" />
                {!isCollapsed && <span>{t("sidebar", "configuracion")}</span>}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              side="right"
              className="w-56 z-[100] shadow-xl border border-gray-200 bg-white"
            >
              <DropdownMenuItem 
                onClick={onChangePassword}
                className="cursor-pointer focus:bg-slate-100 py-2"
              >
                <Lock className="mr-2 h-4 w-4" />
                {t("topbar", "passwordChange")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </nav>

      <div className="border-t border-gray-100 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
          >
            <button
              className={`flex w-full items-center rounded-lg py-2 transition-colors hover:bg-gray-100 focus:outline-none border-none bg-transparent ${
                isCollapsed ? "justify-center px-0" : "px-2"
              }`}
            >
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
            </button>
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
                <Settings className="mr-2 h-4 w-4" />
                {t("topbar", "passwordChange")}
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
  )
}
