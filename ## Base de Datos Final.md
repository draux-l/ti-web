## Base de Datos Final 
---

### Organization
| Campo | Tipo | Clave | Obligatorio | Descripción |
|---|---|---|---|---|
| `id` | integer | PK | Sí | — |
| `name` | varchar(25) | — | Sí | Nombre de la organización |
| `slug` | varchar(100) | UQ | Sí | Identificador URL único |
| `RUC` | varchar(20) | UQ | Sí | Registro único de contribuyente |
| `logo` | varchar(255) | — | Sí | URL del logo |
| `country` | varchar(48) | — | Sí | País |
| `status` | boolean | — | Sí | Activa / inactiva |
| `last_activity_at` | timestamp | — | No | Última actividad de cualquier usuario |
| `total_users` | integer | — | No | Contador desnormalizado para dashboards |
| `total_groups` | integer | — | No | Contador desnormalizado para dashboards |
| `storage_used_mb` | float | — | No | MB de recursos consumidos |
| `created_at` | timestamp | — | Sí | Auditoría |
| `updated_at` | timestamp | — | Sí | Auditoría |
| `deleted_at` | timestamp | — | No | Soft delete |

---

### Role
| Campo | Tipo | Clave | Obligatorio | Descripción |
|---|---|---|---|---|
| `id` | integer | PK | Sí | — |
| `name` | varchar(20) | — | Sí | Nombre del rol |
| `code` | varchar(20) | UQ | Sí | Ej: super_admin, org_admin, instructor, student |
| `description` | text | — | No | Descripción del rol |
| `created_at` | timestamp | — | Sí | Auditoría |

---

### Permission
| Campo | Tipo | Clave | Obligatorio | Descripción |
|---|---|---|---|---|
| `id` | integer | PK | Sí | — |
| `name` | varchar(100) | — | Sí | Nombre legible |
| `code` | varchar(50) | UQ | Sí | Ej: exp.execute, group.create |
| `module` | varchar(50) | — | Sí | Ej: experience, group, user |
| `action` | varchar(20) | — | Sí | Ej: create, read, update, delete |
| `description` | text | — | No | Qué permite hacer |
| `status` | boolean | — | Sí | Activo / inactivo |
| `created_at` | timestamp | — | Sí | Auditoría |

---

### Role_Permission
| Campo | Tipo | Clave | Obligatorio | Descripción |
|---|---|---|---|---|
| `permission_id` | integer | PK, FK → Permission.id | Sí | — |
| `role_id` | integer | PK, FK → Role.id | Sí | — |

---

### User
| Campo | Tipo | Clave | Obligatorio | Descripción |
|---|---|---|---|---|
| `id` | integer | PK | Sí | — |
| `org_id` | integer | FK → Organization.id | Sí | Ancla multi-tenant |
| `role_id` | integer | FK → Role.id | Sí | Rol del usuario en el sistema |
| `first_name` | varchar(50) | — | Sí | Nombre |
| `last_name` | varchar(50) | — | Sí | Apellido |
| `username` | varchar(50) | UQ | Sí | Para login, único en toda la BD |
| `document` | enum(DNI, RUC) | UQ | Sí | Documento de identidad |
| `password` | varchar(255) | — | Sí | Hash de contraseña |
| `status` | boolean | — | Sí | Activo / inactivo |
| `last_login` | timestamp | — | No | Último acceso |
| `login_count` | integer | — | No | Total de accesos al sistema |
| `failed_login_count` | integer | — | No | Intentos fallidos — seguridad |
| `last_ip` | varchar(45) | — | No | Última IP de conexión |
| `preferred_language` | varchar(10) | — | No | Ej: es, en |
| `created_at` | timestamp | — | Sí | Auditoría |
| `updated_at` | timestamp | — | Sí | Auditoría |
| `deleted_at` | timestamp | — | No | Soft delete |

---

### Phone
| Campo | Tipo | Clave | Obligatorio | Descripción |
|---|---|---|---|---|
| `id` | integer | PK | Sí | — |
| `phone` | varchar(15) | — | Sí | Número telefónico |
| `type` | enum(mobile, landline, work) | — | No | Tipo de teléfono |
| `is_primary` | boolean | — | Sí | Número principal |
| `user_id` | integer | FK → User.id | No | Nulo si pertenece a org |
| `organization_id` | integer | FK → Organization.id | No | Nulo si pertenece a user |

---

### Email
| Campo | Tipo | Clave | Obligatorio | Descripción |
|---|---|---|---|---|
| `id` | integer | PK | Sí | — |
| `email` | varchar(255) | UQ | Sí | Correo electrónico |
| `type` | enum(personal, work, billing) | — | No | Tipo de correo |
| `is_primary` | boolean | — | Sí | Correo principal |
| `verified_at` | timestamp | — | No | Fecha de verificación del correo |
| `user_id` | integer | FK → User.id | No | Nulo si pertenece a org |
| `organization_id` | integer | FK → Organization.id | No | Nulo si pertenece a user |

---

### Department
| Campo | Tipo | Clave | Obligatorio | Descripción |
|---|---|---|---|---|
| `id` | integer | PK | Sí | Corregido de varchar(255) a integer |
| `organization_id` | integer | FK → Organization.id | Sí | Aislamiento multi-tenant |
| `name` | varchar(25) | — | Sí | Nombre del departamento |
| `description` | text | — | Sí | Descripción |
| `status` | boolean | — | Sí | Activo / inactivo |
| `created_at` | timestamp | — | Sí | Auditoría |
| `updated_at` | timestamp | — | Sí | Auditoría |

---

### Specialty
| Campo | Tipo | Clave | Obligatorio | Descripción |
|---|---|---|---|---|
| `id` | integer | PK | Sí | — |
| `department_id` | integer | FK → Department.id | Sí | — |
| `name` | varchar(25) | — | Sí | Nombre de la especialidad |
| `code` | varchar(10) | — | Sí | Código corto |
| `description` | text | — | Sí | Descripción |
| `image` | varchar(255) | — | No | URL de imagen o ícono representativo |
| `status` | boolean | — | Sí | Activa / inactiva |
| `created_at` | timestamp | — | Sí | Auditoría |
| `updated_at` | timestamp | — | Sí | Auditoría |

---

### Course
| Campo | Tipo | Clave | Obligatorio | Descripción |
|---|---|---|---|---|
| `id` | integer | PK | Sí | — |
| `specialty_id` | integer | FK → Specialty.id | Sí | Corregido de "Tipo" a integer |
| `name` | varchar(50) | — | Sí | Nombre del curso |
| `description` | text | — | Sí | Descripción |
| `image` | varchar(255) | — | No | URL de imagen representativa |
| `status` | boolean | — | Sí | Activo / inactivo |
| `created_at` | timestamp | — | Sí | Auditoría |
| `updated_at` | timestamp | — | Sí | Auditoría |

---

### Experience
| Campo | Tipo | Clave | Obligatorio | Descripción |
|---|---|---|---|---|
| `id` | integer | PK | Sí | — |
| `course_id` | integer | FK → Course.id | Sí | Corregido de "Tipo" a integer |
| `name` | varchar(50) | — | Sí | Nombre de la experiencia |
| `description` | text | — | Sí | Descripción |
| `type` | enum(VR, video, document, slides, induction) | — | Sí | Tipo de recurso de aprendizaje |
| `image` | varchar(255) | — | No | URL de imagen o thumbnail |
| `duration` | integer | — | Sí | Duración en segundos |
| `score` | float | — | Sí | Puntaje máximo posible |
| `status` | varchar(15) | — | Sí | Disponible / inactivo |
| `attemps` | integer | — | Sí | Intentos permitidos |
| `order` | integer | — | Sí | Posición dentro del curso |
| `avg_score` | float | — | No | Puntaje promedio — desnormalizado |
| `avg_time_spent` | integer | — | No | Segundos promedio — desnormalizado |
| `total_completions` | integer | — | No | Total de completaciones — desnormalizado |
| `total_attempts` | integer | — | No | Total de intentos globales — desnormalizado |
| `difficulty_rating` | float | — | No | Calculado: 1 - (completions / total_attempts) |
| `created_at` | timestamp | — | Sí | Auditoría |
| `updated_at` | timestamp | — | Sí | Auditoría |

---

### Group
| Campo | Tipo | Clave | Obligatorio | Descripción |
|---|---|---|---|---|
| `id` | integer | PK | Sí | — |
| `org_id` | integer | FK → Organization.id | Sí | Aislamiento multi-tenant |
| `course_id` | integer | FK → Course.id | Sí | Curso asignado al grupo |
| `name` | varchar(50) | — | Sí | Nombre del grupo |
| `code` | varchar(20) | UQ | Sí | Código único del grupo |
| `status` | boolean | — | Sí | Activo / disuelto |
| `start_date` | date | — | No | Fecha de inicio |
| `end_date` | date | — | No | Fecha de fin |
| `created_at` | timestamp | — | Sí | Auditoría |
| `updated_at` | timestamp | — | Sí | Auditoría |

---

### User_Group
| Campo | Tipo | Clave | Obligatorio | Descripción |
|---|---|---|---|---|
| `user_id` | integer | PK, FK → User.id | Sí | — |
| `group_id` | integer | PK, FK → Group.id | Sí | — |
| `role_in_group` | enum(leader, member) | — | No | Rol dentro del grupo |
| `status` | enum(active, inactive, removed) | — | Sí | Estado del usuario en el grupo |
| `joined_at` | timestamp | — | Sí | Fecha de ingreso al grupo |

---

### Group_Experience
| Campo | Tipo | Clave | Obligatorio | Descripción |
|---|---|---|---|---|
| `group_id` | integer | PK, FK → Group.id | Sí | — | 
| `attemps` | integer | — | No | Intentos utilizados |
| `status` | varchar(15) | — | Sí | completed / in_progress / failed / pending |
| `mandatory` | boolean | — | Sí | Si es obligatoria para el grupo |
| `started_at` | timestamp | — | No | Cuándo comenzaron |
| `completed_at` | timestamp | — | No | Cuándo la completaron |
| `time_spent` | integer | — | No | Segundos totales activos |
| `interactions_count` | integer | — | No | Total de interacciones registradas |
| `pause_count` | integer | — | No | Cantidad de pausas |
| `skip_count` | integer | — | No | Cantidad de saltos de contenido |
| `device_type` | enum(vr_headset, desktop, mobile, tablet) | — | No | Dispositivo usado |
| `platform` | varchar(50) | — | No | Sistema operativo o visor VR |
| `ip_address` | varchar(45) | — | No | IP de la sesión |
| `session_id` | varchar(100) | — | No | Identificador único de sesión |
| `error_count` | integer | — | No | Errores técnicos durante la sesión |

---

### Activity_Log
| Campo | Tipo | Clave | Obligatorio | Descripción |
|---|---|---|---|---|
| `id` | integer | PK | Sí | — |
| `user_id` | integer | FK → User.id | Sí | Quién ejecutó la acción |
| `org_id` | integer | FK → Organization.id | Sí | A qué org pertenece |
| `action` | varchar(100) | — | Sí | Ej: login, complete_experience, create_group |
| `entity` | varchar(50) | — | No | Tabla afectada: Group, Experience, User |
| `entity_id` | integer | — | No | ID del registro afectado |
| `metadata` | json | — | No | Datos adicionales del evento |
| `ip_address` | varchar(45) | — | No | IP desde donde se ejecutó |
| `created_at` | timestamp | — | Sí | Cuándo ocurrió |

---


