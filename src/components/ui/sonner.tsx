"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast rounded-2xl shadow-lg border border-slate-200 !bg-white text-slate-900",
          title: "text-base font-semibold !text-slate-900",
          description: "text-sm !text-slate-700 mt-1",
          actionButton: "bg-[#00AEEF] hover:bg-[#0098d1] text-white rounded-full px-4 py-2 text-sm font-medium",
          cancelButton: "bg-white hover:bg-slate-100 text-slate-900 rounded-full px-4 py-2 text-sm font-medium border border-slate-200",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
