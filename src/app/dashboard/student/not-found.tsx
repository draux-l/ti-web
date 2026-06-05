import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <FileQuestion className="size-12 text-slate-300" />
      <h2 className="text-xl font-semibold text-slate-900">Seccion no encontrada</h2>
      <p className="text-sm text-slate-500">
        Esta seccion no existe dentro del dashboard.
      </p>
    </div>
  )
}
