🎓 Tecsup Inmersivo

Ecosistema educativo híbrido que combina una plataforma de gestión web (LMS) con entornos de evaluación en Realidad Virtual (VR). Diseñado para instituciones técnicas que requieren simulaciones de alta fidelidad en áreas como Minería, Mecánica y Electricidad.

.
📋 Tabla de Contenidos

Descripción General
Stack Tecnológico
Arquitectura del Proyecto
Estructura de Carpetas
Roles y Permisos
Sistema de Autenticación
Flujo Crítico: El Puente VR
Design System
Gitflow
Instalación y Configuración
Variables de Entorno
Scripts Disponibles
Credenciales de Desarrollo


📌 Descripción General
Tecsup Inmersivo es una plataforma LMS de dos capas:
CapaTecnologíaPropósitoWeb (este repo)Next.js 14 + React + TailwindGestión, autenticación, dashboards por rolVRUnityEvaluaciones inmersivas con simulaciones
La capa web actúa como punto de control central: gestiona usuarios, cursos, roles, notas y genera el token de sincronización que conecta al alumno con el entorno VR.

🛠️ Stack Tecnológico
Frontend (este repositorio)
HerramientaVersiónUsoNext.js14App Router, SSR, API RoutesReact18UI componentsTypeScript5Tipado estáticoTailwind CSS3Estilos utilitariosZustandlatestEstado global (auth, sesión)ZodlatestValidación de formularios y schemasBiomelatestLinter + formatter
Backend (repositorio separado)
HerramientaUsoNestJSAPI REST, Guards, RBACPostgreSQLBase de datos principalPrismaORMJWTAutenticación statelessbcryptHash de contraseñasNodemailerEnvío de correos (PIN, recuperación)

🏗️ Arquitectura del Proyecto
┌─────────────────────────────────────────────────────────┐
│                     BROWSER / CLIENT                    │
│              Next.js 14 (App Router + SSR)              │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP / REST
┌───────────────────────▼─────────────────────────────────┐
│                   NestJS API (Backend)                  │
│          Auth · Users · Courses · PIN · RBAC            │
└───────────────────────┬─────────────────────────────────┘
                        │
          ┌─────────────▼─────────────┐
          │       PostgreSQL DB        │
          └───────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                  Unity VR App                           │
│        Valida PIN → Ejecuta simulación → Envía nota     │
└─────────────────────────────────────────────────────────┘

📁 Estructura de Carpetas
📁 tecsup-inmersivo-web/
├── 📁 src/
│   ├── 📁 app/                             # App Router (Next.js 14)
│   │   ├── 📁 (auth)/                      # Route group público
│   │   │   ├── 📁 login/
│   │   │   │   └── page.tsx               # Login: Google + Email/Password
│   │   │   ├── 📁 verify-pin/
│   │   │   │   └── page.tsx               # Formulario ingreso PIN 2FA
│   │   │   ├── 📁 forgot-password/
│   │   │   │   └── page.tsx               # Solicitar recuperación
│   │   │   ├── 📁 reset-password/
│   │   │   │   └── page.tsx               # Nueva contraseña + token
│   │   │   └── layout.tsx                 # Layout limpio sin navbar
│   │   │
│   │   ├── 📁 (dashboard)/                 # Route group privado (requiere auth)
│   │   │   ├── 📁 admin/
│   │   │   │   ├── page.tsx               # Dashboard Admin
│   │   │   │   └── layout.tsx             # Layout con sidebar Admin
│   │   │   ├── 📁 instructor/
│   │   │   │   ├── page.tsx               # Dashboard Instructor
│   │   │   │   └── layout.tsx             # Layout con sidebar Instructor
│   │   │   ├── 📁 student/
│   │   │   │   ├── 📁 pin/
│   │   │   │   │   └── page.tsx           # Generar PIN para VR
│   │   │   │   ├── page.tsx               # Dashboard Estudiante
│   │   │   │   └── layout.tsx             # Layout con sidebar Estudiante
│   │   │   └── 📁 profile/
│   │   │       └── page.tsx               # Editar perfil (todos los roles)
│   │   │
│   │   ├── layout.tsx                     # Root layout global
│   │   ├── page.tsx                       # Landing /
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   │
│   ├── 📁 components/
│   │   ├── 📁 ui/                         # Átomos: Button, Input, Card, Badge, Modal...
│   │   ├── 📁 layout/
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── InstructorSidebar.tsx
│   │   │   ├── StudentSidebar.tsx
│   │   │   └── Navbar.tsx
│   │   ├── 📁 guards/
│   │   │   └── RouteGuard.tsx             # Protección de rutas + redirección por rol
│   │   └── 📁 features/
│   │       ├── 📁 auth/
│   │       │   ├── LoginForm.tsx          # Formulario email + password
│   │       │   ├── GoogleButton.tsx       # Botón OAuth Google
│   │       │   ├── PinForm.tsx            # Formulario ingreso PIN 2FA
│   │       │   ├── ForgotPasswordForm.tsx
│   │       │   ├── ResetPasswordForm.tsx
│   │       │   └── LogoutButton.tsx
│   │       ├── 📁 profile/
│   │       │   └── EditProfileForm.tsx
│   │       └── 📁 pin/
│   │           └── PinDisplay.tsx         # Muestra PIN generado para VR
│   │
│   ├── 📁 lib/
│   │   ├── 📁 actions/                    # Server Actions Next.js 14
│   │   │   ├── auth.actions.ts            # login, verifyPin, logout, resetPassword
│   │   │   └── user.actions.ts            # updateProfile
│   │   └── 📁 api/
│   │       └── client.ts                  # Fetch base con headers JWT automáticos
│   │
│   ├── 📁 stores/
│   │   └── auth.store.ts                  # Zustand: usuario, rol, token, clearAuth()
│   │
│   ├── 📁 hooks/
│   │   ├── useAuth.ts                     # Consume auth.store
│   │   └── useRole.ts                     # Lógica de rol y redirección
│   │
│   ├── 📁 utils/
│   │   ├── auth.utils.ts                  # saveToken / getToken / removeToken (localStorage)
│   │   └── role.utils.ts                  # getRoleRedirect(role) → ruta destino
│   │
│   ├── 📁 validators/
│   │   ├── auth.schema.ts                 # Login, forgot-password, reset-password (Zod)
│   │   ├── pin.schema.ts                  # Validación formulario PIN
│   │   └── profile.schema.ts
│   │
│   ├── 📁 types/
│   │   ├── auth.types.ts                  # User, Role, JWTPayload
│   │   └── api.types.ts                   # Response types del backend
│   │
│   └── 📁 styles/
│       └── globals.css                    # Variables CSS + Tailwind base
│
├── 📁 public/
├── .env.local                             # Variables locales (no commitear)
├── .env.example                           # Template de variables (sí commitear)
├── .gitignore
├── biome.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── README.md

👥 Roles y Permisos
Jerarquía
SuperAdmin
    └── Admin (por institución)
            ├── Instructor
            └── Estudiante
Detalle de permisos
AcciónSuperAdminAdminInstructorEstudianteGestionar instituciones (multi-tenancy)✅❌❌❌Ver analíticas globales✅❌❌❌Gestionar usuarios✅✅❌❌Asignar cursos✅✅❌❌Control licencias VR✅✅❌❌Monitorear progreso de alumnos✅✅✅❌Sobreescribir notas VR (con justificación)❌❌✅❌Ver cursos asignados❌❌✅✅Generar PIN para VR❌❌❌✅

⚠️ Asignación de cursos: responsabilidad exclusiva del Admin institucional.


🔐 Sistema de Autenticación
Métodos soportados

Google OAuth 2.0 — Login rápido sin contraseña
Email + Contraseña — Login tradicional con bcrypt
Apple ID (próximamente)
Teléfono (próximamente)

Flujo de autenticación con PIN 2FA
1. Usuario ingresa credenciales (Google o Email/Password)
2. Backend valida credenciales
3. Backend genera PIN de 6 dígitos → lo guarda en DB con TTL de 5 min
4. Backend envía PIN al correo del usuario
5. Usuario ingresa PIN en el formulario /verify-pin
6. Backend valida PIN → genera JWT
7. Frontend guarda JWT en localStorage
8. Frontend redirige al dashboard según rol
Flujo de recuperación de contraseña
1. Usuario ingresa su email en /forgot-password
2. Backend genera token UUID + fecha expiración → guarda en DB
3. Backend envía enlace de recuperación al correo
4. Usuario hace clic en enlace → llega a /reset-password?token=...
5. Usuario ingresa nueva contraseña
6. Backend valida token, actualiza contraseña, invalida token
7. Frontend redirige a /login
Gestión del JWT en frontend
AcciónDóndeFunciónGuardar tokenutils/auth.utils.tssaveToken(jwt)Leer tokenutils/auth.utils.tsgetToken()Eliminar tokenutils/auth.utils.tsremoveToken()Estado globalstores/auth.store.tsZustand storeProtección de rutascomponents/guards/RouteGuard.tsxVerifica token + rol

🥽 Flujo Crítico: El Puente VR
Este es el flujo más importante del sistema: conecta la identidad del usuario web con la sesión en el casco VR.
┌──────────────────────────────────────────────────────┐
│  1. Alumno entra al dashboard web                    │
│  2. Selecciona "Generar PIN para VR"                 │
│  3. Web llama a POST /auth/pin                       │
│  4. Backend genera PIN de 6 dígitos (hasheado en DB) │
│  5. PIN se muestra en pantalla (TTL: ej. 10 min)     │
│  6. Alumno ingresa el PIN en las gafas VR (Unity)    │
│  7. Unity llama a POST /auth/pin/verify              │
│  8. Backend valida PIN → emite JWT especial para VR  │
│  9. Unity ejecuta la simulación/evaluación           │
│  10. Al finalizar, Unity envía nota a la DB          │
│  11. Nota queda disponible en el dashboard web       │
└──────────────────────────────────────────────────────┘

El PIN es efímero (de un solo uso) y tiene expiración automática. Una vez usado, se invalida inmediatamente.


🎨 Design System
Paleta de colores
TokenHexUsoprimary#00AEEFAzul Tecsup — botones principales, links, highlightsaction#FFB800Amarillo acción — CTAs secundarios, badgesbackground#F5F7FAFondo gris claro generalsurface#FFFFFFTarjetas, modales, panelestext-primary#1A1A2ETexto principaltext-muted#6B7280Texto secundario, placeholders
Principios de UI

Bordes redondeados: border-radius: 16px en tarjetas y modales
Sombras: suaves, tipo box-shadow: 0 2px 8px rgba(0,0,0,0.08)
Estética: minimalista e industrial — sin ornamentos innecesarios
Tipografía: limpia, legible, sin serifas

Configuración en Tailwind
ts// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: '#00AEEF',
      action: '#FFB800',
      background: '#F5F7FA',
    },
    borderRadius: {
      card: '16px',
    }
  }
}

🌿 Gitflow
Este proyecto usa Gitflow como estrategia de branching.
Ramas principales
RamaPropósitomainProducción — código estable y desplegadodevelopmentIntegración — base para todas las features
Ramas de trabajo
TipoNomenclaturaEjemploFeature (HU)feature/HU-XX-XX-descripcionfeature/HU-01-01-login-googleFixfix/descripcion-cortafix/pin-expiration-redirectReleaserelease/vX.X.Xrelease/v1.0.0Hotfixhotfix/descripcionhotfix/jwt-null-crash
Flujo de trabajo por Historia de Usuario
bash# 1. Partir siempre desde development actualizado
git checkout development
git pull origin development

# 2. Crear rama por HU completa
git checkout -b feature/HU-01-01-login-google

# 3. Commitear por tarea (TU)
git commit -m "TU-01-10: crear botón iniciar sesión con Google"
git commit -m "TU-01-11: redirigir al endpoint /auth/google"
git commit -m "TU-01-12: recibir JWT desde backend en callback"
git commit -m "TU-01-13: guardar JWT en localStorage"
git commit -m "TU-01-14: redirigir al dashboard según rol"

# 4. Al terminar la HU, merge a development (vía PR o directo)
git checkout development
git merge feature/HU-01-01-login-google

# 5. Crear siguiente rama desde development
git checkout -b feature/HU-01-02-login-email

Regla: 1 rama = 1 HU · 1 commit = 1 TU


⚙️ Instalación y Configuración
Prerequisitos

Node.js >= 18.17.0
npm >= 9 o pnpm >= 8

Pasos
bash# 1. Clonar el repositorio
git clone https://github.com/antigravity/tecsup-inmersivo-web.git
cd tecsup-inmersivo-web

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con los valores correspondientes

# 4. Correr en desarrollo
npm run dev
La aplicación estará disponible en http://localhost:3000.

🔑 Variables de Entorno
env# .env.example

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:4000

# Google OAuth (para el botón de Google en el frontend)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

⚠️ Nunca commitear .env.local. Solo .env.example va al repositorio.


📜 Scripts Disponibles
bashnpm run dev        # Servidor de desarrollo con hot reload
npm run build      # Build de producción
npm run start      # Servidor de producción (requiere build previo)
npm run lint       # Linter con Biome
npm run format     # Formatter con Biome
npm run type-check # Verificación de tipos TypeScript

👤 Credenciales de Desarrollo

Solo para ambiente local/desarrollo. No usar en producción.


UsuarioRolContraseñaanderEstudiante123456parejaInstructor123456adminAdmin123456superadminSuperAdmin123456

🤝 Equipo
Desarrollado por el equipo Antigravity para Tecsup..
