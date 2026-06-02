export interface Specialty {
  id: number
  code: string
  name: string
}

export interface User {
  id: string
  email: string
  name: string | null
  username: string | null
  orgId: number | null
  roleId: number | null
  emailVerified: boolean
  image: string | null
  createdAt: string
  updatedAt: string
  documentType: string | null
  documentNumber: string | null
  lastName: string | null
  preferredLanguage: string | null
  status: boolean
  position: string | null
  phone: string | null
  specialtyId: number | null
  specialty: Specialty | null
  bio: string | null
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  redirect: boolean
  token: string
  user: User
}

export interface ApiError {
  statusCode: number
  message: string
  error: string
}

export const ROLE_REDIRECT: Record<number, string> = {
  1: "/dashboard/superadmin",
  2: "/dashboard/admin",
  3: "/dashboard/instructor",
  4: "/dashboard/student",
}

export const ROLE_LABEL_MAP: Record<number, string> = {
  1: "superadmin",
  2: "admin",
  3: "instructor",
  4: "student",
}
