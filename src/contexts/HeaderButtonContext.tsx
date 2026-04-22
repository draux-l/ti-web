"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface HeaderButton {
  icon: React.ElementType
  label: string
  onClick: () => void
}

interface HeaderButtonContextType {
  headerButton: HeaderButton | null
  setHeaderButton: (button: HeaderButton | null) => void
}

const HeaderButtonContext = createContext<HeaderButtonContextType>({
  headerButton: null,
  setHeaderButton: () => {},
})

export function HeaderButtonProvider({ children }: { children: ReactNode }) {
  const [headerButton, setHeaderButton] = useState<HeaderButton | null>(null)
  return (
    <HeaderButtonContext.Provider value={{ headerButton, setHeaderButton }}>
      {children}
    </HeaderButtonContext.Provider>
  )
}

export function useHeaderButton() {
  return useContext(HeaderButtonContext)
}