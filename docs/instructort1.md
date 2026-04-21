# Prompt: Desarrollo de Dashboard del Instructor - Tecsup Inmersivo

Actúa como un **Desarrollador Frontend Senior** experto en **React, Tailwind CSS** y librerías de visualización de datos como **Recharts**. Tu objetivo es construir la interfaz netamente para el rol de **Instructor** de la plataforma educativa "Tecsup Inmersivo".

## 1. Sistema de Diseño (Estética Visual)
La interfaz debe ser idéntica al panel del alumno, siguiendo un estilo **Modern SaaS / Bento Grid**:
- **Paleta de Colores:**
  - Primario: `#00AEEF` (Azul Cyan brillante) para botones y elementos activos.
  - Secundario: `#FFB800` (Amarillo) para métricas de progreso.
  - Fondo: `bg-slate-50` (Gris muy claro) para el área de contenido y blanco para el Sidebar.
- **Componentes:**
  - **Tarjetas (Cards):** Bordes muy redondeados (`rounded-3xl`), fondo blanco y sombras muy tenues.
  - **Botones:** Estilo "píldora" (totalmente redondeados) con iconos de **Lucide-react**.
  - **Tipografía:** Limpia y moderna (ej. Inter o Geist).

## 2. Estructura de Navegación (Sidebar)
El Sidebar debe ser minimalista y contener:
- **Inicio** (Icono: Home)
- **Gestión de Grupos** (Icono: Users)
- **Control de Experiencias** (Icono: Layout)
- **Calificaciones y Progreso** (Icono: TrendingUp)
- **Configuración** (Icono: Settings)

## 3. Vistas y Casos de Uso a Programar

### A. Vista de Inicio (Dashboard Principal)
- **Header:** Título "Bienvenido de vuelta, Instructor" y un botón superior derecho resaltado que diga **"Visualizar vista de alumno"**.
- **Tarjetas de Métricas (KPIs):** Tres tarjetas grandes superiores con iconos:
  - Tarjeta Azul: "8 Grupos Activos".
  - Tarjeta Amarilla: "74% Progreso Promedio".
  - Tarjeta Gris: "15 Experiencias por Vencer".

### B. Gestión de grupos
- Interfaz de cuadrícula donde cada Grupos es una tarjeta.
- Opción para **Crear Grupos**.
- Dentro de cada tarjeta, incluir una lista simplificada de alumnos con botones de acción para:
  - **Asignar estudiantes al grupo.**
  - **Quitar estudiante de un grupo.**

### C. Control de Experiencias
Lista de actividades o retos con las siguientes funcionalidades interactivas:
- **Asignar experiencias al grupo:** Selector para vincular una tarea a un grupo.
- **Reprogramar fecha:** Un input de tipo fecha estilizado para cambiar entregas.
- **Rehabilitar experiencia vencida:** Un botón de tipo "switch" o toggle para abrir el acceso a tareas caducadas.
- **Aumentar intentos máximos:** Un contador numérico (`input number` con botones +/-) para modificar las oportunidades del alumno.

### D. Seguimiento y Notas
- **Gráficos:** Un componente de Recharts que muestre la "Evolución de Notas del grupo".
- **Tabla de Calificaciones:** Una tabla moderna donde la columna **"Puntuación Final"** sea un campo editable (`input`) para que el instructor pueda actualizar la nota del alumno en tiempo real.
- **Progreso Visual:** Barras de progreso delgadas para cada experiencia asignada.

## 4. Especificaciones Técnicas
- Usa **componentes funcionales** de React.
- Maneja los estados con `useState` para que la interfaz sea interactiva (que se puedan abrir modales, cambiar números y editar tablas).
- Asegura que el diseño sea **responsivo** y mantenga la coherencia visual de "Tecsup Inmersivo".