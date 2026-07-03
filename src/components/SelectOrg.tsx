"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import apiClient from "@/lib/api-client"

interface SelectOrgProps {
  value: string
  onChange: (value: string) => void
}

export function SelectOrg({ value, onChange }: SelectOrgProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{ id: number; name: string }[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const doSearch = async (q: string) => {
    try {
      const res = await apiClient.get("/organizations", {
        params: { search: q || undefined, pageSize: 20 },
      })
      setResults(res.data.data || [])
      setShowDropdown(true)
    } catch {
      setResults([])
    }
  }

  const onType = (q: string) => {
    setQuery(q)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(q), 300)
  }

  useEffect(() => {
    if (!showDropdown) doSearch("")
  }, [showDropdown])

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => onType(e.target.value)}
          placeholder="Buscar organizacion por nombre..."
          className="bg-slate-50/50 pr-8"
        />
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
      </div>
      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {results.length === 0 ? (
            <p className="px-3 py-2 text-sm text-gray-500">Sin resultados</p>
          ) : (
            results.map((o) => (
              <div
                key={o.id}
                className="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer transition-colors"
                onClick={() => {
                  onChange(String(o.id))
                  setQuery(o.name)
                  setShowDropdown(false)
                }}
              >
                {o.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
