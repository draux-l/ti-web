"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type Language = "es" | "en" | "pt" | "fr"

type Translations = {
  [key in Language]: {
    sidebar: {
      inicio: string
      usuarios: string
      cursos: string
      asignaciones: string
      ajustesSistema: string
      reportes: string
      instituciones: string
      misCursos: string
      miProgreso: string
      misGrupos: string
      calificaciones: string
      configuracion: string
      cerrarSesion: string
    }
    dashboard: {
      title: string
      subtitle: string
      assignBtn: string
      instructors: string
      instructorsSub: string
      students: string
      studentsSub: string
      courses: string
      coursesSub: string
      userDist: string
      userDistSub: string
      coursesAvail: string
      coursesAvailSub: string
      recentAct: string
    }
    topbar: {
      passwordChange: string
      es: string
      en: string
      pt: string
      fr: string
    }
  }
}

const translations: Translations = {
  es: {
    sidebar: {
      inicio: "Inicio", usuarios: "Usuarios", cursos: "Cursos", asignaciones: "Asignaciones", ajustesSistema: "Ajustes Sistema", reportes: "Reportes", instituciones: "Instituciones", misCursos: "Mis Cursos", miProgreso: "Mi Progreso", misGrupos: "Mis Grupos", calificaciones: "Calificaciones", configuracion: "Configuración", cerrarSesion: "Cerrar Sesión"
    },
    dashboard: {
      title: "Panel de Administración", subtitle: "Gestiona recursos y usuarios", assignBtn: "Asignar Alumno a Curso", instructors: "Instructores", instructorsSub: "Activos este periodo", students: "Alumnos", studentsSub: "Matriculados", courses: "Cursos", coursesSub: "Programas Activos", userDist: "Distribución de usuarios", userDistSub: "Distribución actual de estudiantes e instructores en el sistema LMS", coursesAvail: "Cursos Disponibles", coursesAvailSub: "Programas XR activos en la plataforma", recentAct: "Actividad reciente"
    },
    topbar: { passwordChange: "Cambiar contraseña", es: "Español", en: "Inglés", pt: "Portugués", fr: "Francés" }
  },
  en: {
    sidebar: {
      inicio: "Home", usuarios: "Users", cursos: "Courses", asignaciones: "Assignments", ajustesSistema: "System Settings", reportes: "Reports", instituciones: "Institutions", misCursos: "My Courses", miProgreso: "My Progress", misGrupos: "My Groups", calificaciones: "Grades", configuracion: "Settings", cerrarSesion: "Logout"
    },
    dashboard: {
      title: "Admin Dashboard", subtitle: "Manage resources and users", assignBtn: "Assign Student to Course", instructors: "Instructors", instructorsSub: "Active this term", students: "Students", studentsSub: "Enrolled", courses: "Courses", coursesSub: "Active Programs", userDist: "User Distribution", userDistSub: "Current distribution of students and instructors in the LMS", coursesAvail: "Available Courses", coursesAvailSub: "Active XR programs on platform", recentAct: "Recent activity"
    },
    topbar: { passwordChange: "Change password", es: "Spanish", en: "English", pt: "Portuguese", fr: "French" }
  },
  pt: {
    sidebar: {
      inicio: "Início", usuarios: "Usuários", cursos: "Cursos", asignaciones: "Atribuições", ajustesSistema: "Configurações do Sistema", reportes: "Relatórios", instituciones: "Instituições", misCursos: "Meus Cursos", miProgreso: "Meu Progresso", misGrupos: "Meus Grupos", calificaciones: "Notas", configuracion: "Configurações", cerrarSesion: "Sair"
    },
    dashboard: {
      title: "Painel de Administração", subtitle: "Gerenciar recursos e usuários", assignBtn: "Atribuir Aluno ao Curso", instructors: "Instrutores", instructorsSub: "Ativos este período", students: "Alunos", studentsSub: "Matriculados", courses: "Cursos", coursesSub: "Programas Ativos", userDist: "Distribuição de usuários", userDistSub: "Distribuição atual de alunos e instrutores no LMS", coursesAvail: "Cursos Disponíveis", coursesAvailSub: "Programas XR ativos na plataforma", recentAct: "Atividade recente"
    },
    topbar: { passwordChange: "Mudar senha", es: "Espanhol", en: "Inglês", pt: "Português", fr: "Francês" }
  },
  fr: {
    sidebar: {
      inicio: "Accueil", usuarios: "Utilisateurs", cursos: "Cours", asignaciones: "Affectations", ajustesSistema: "Paramètres Système", reportes: "Rapports", instituciones: "Institutions", misCursos: "Mes Cours", miProgreso: "Mes Progrès", misGrupos: "Mes Groupes", calificaciones: "Notes", configuracion: "Paramètres", cerrarSesion: "Déconnexion"
    },
    dashboard: {
      title: "Tableau de Bord", subtitle: "Gérer les ressources et utilisateurs", assignBtn: "Affecter un étudiant", instructors: "Instructeurs", instructorsSub: "Actifs ce trimestre", students: "Étudiants", studentsSub: "Inscrits", courses: "Cours", coursesSub: "Programmes Actifs", userDist: "Répartition des utilisateurs", userDistSub: "Répartition actuelle des étudiants et instructeurs dans le LMS", coursesAvail: "Cours Disponibles", coursesAvailSub: "Programmes XR actifs", recentAct: "Activité récente"
    },
    topbar: { passwordChange: "Changer le mot de passe", es: "Espagnol", en: "Anglais", pt: "Portugais", fr: "Français" }
  }
}

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (section: keyof Translations["es"], key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")
  const t = (section: keyof Translations["es"], key: string) => {
    // @ts-ignore
    return translations[language]?.[section]?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage must be used within LanguageProvider")
  return context
}
