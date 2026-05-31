import { create } from "zustand"
import type { User } from "@/types/auth.types"
import { saveToken, getToken, removeToken } from "@/utils/auth.utils"

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  login: (token: string, user: User) => void
  logout: () => void
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: (token, user) => {
    saveToken(token)
    set({ token, user, isAuthenticated: true, isLoading: false })
  },

  logout: () => {
    removeToken()
    set({ token: null, user: null, isAuthenticated: false, isLoading: false })
    import("@/lib/api-client").then((m) => {
      m.default.post("/auth/sign-out").catch(() => {})
    })
    window.location.href = "/login"
  },

  initialize: async () => {
    const token = getToken()
    if (!token) {
      set({ isLoading: false })
      return
    }

    try {
      const { default: apiClient } = await import("@/lib/api-client")
      const res = await apiClient.get("/auth/me")
      set({
        token,
        user: res.data as User,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch {
      removeToken()
      set({ token: null, user: null, isAuthenticated: false, isLoading: false })
    }
  },
}))
