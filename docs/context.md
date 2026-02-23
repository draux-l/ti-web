# Resumen del Proyecto

Vamos a desarrollar una **Plataforma de Experiencias de Aprendizaje en Realidad Extendida (XR)**.  
El objetivo es crear un ecosistema completo (**Web + Backend + VR**) que permita distribuir y evaluar capacitaciones interactivas, similar al modelo de TRANSFR VR, pero utilizando una infraestructura propia alojada en servidores locales (Proxmox).

La primera validación del sistema será una experiencia piloto sobre el **Análisis de Fallas en Aceros de Perforación** para **Sandvik**.

---

# ¿De qué te encargarás tú en el Frontend?

Tú y tu compañero desarrollarán el **Portal Web**, el cual será la interfaz de control para todos los usuarios de la plataforma.

### Stack tecnológico:
- Next.js 14  
- React  
- Tailwind CSS  

---

# Responsabilidades clave para este MVP

## 1️⃣ Autenticación y Roles
- Crear el sistema de login y registro (incluyendo Google OAuth).
- Gestionar accesos para tres tipos de usuarios:
  - SuperAdmin
  - Instructores
  - Alumnos

---

## 2️⃣ Gestión de Cursos (LMS)
- Desarrollar dashboards para instructores.
- Permitir crear cursos.
- Inscribir alumnos.
- Asignar experiencias de aprendizaje.

---

## 3️⃣ Gestión de Contenido XR
- Implementar interfaz para:
  - Subir experiencias (archivos Addressables de Unity).
  - Actualizar versiones.
  - Editar información técnica.

---

## 4️⃣ Dashboard de Resultados
- Visualizar telemetría proveniente del visor VR.
- Mostrar:
  - Puntajes
  - Tiempos
  - Progreso detallado de los alumnos

---

## 5️⃣ Integración VR
- Crear un generador de PIN de 6 dígitos.
- Permitir inicio de sesión rápido en Meta Quest 3.
- Evitar el uso de contraseñas largas dentro del visor VR.