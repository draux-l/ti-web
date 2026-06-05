import { Loader2 } from "lucide-react"

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <Loader2 className="size-8 animate-spin text-[#00AEEF]" />
    </div>
  )
}
