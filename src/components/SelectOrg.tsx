"use client"

import { useState, useEffect, useRef } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import apiClient from "@/lib/api-client"

interface SelectOrgProps {
  value: string
  onChange: (value: string) => void
}

export function SelectOrg({ value, onChange }: SelectOrgProps) {
  const [open, setOpen] = useState(false)
  const [orgs, setOrgs] = useState<{ id: number; name: string }[]>([])
  const [search, setSearch] = useState("")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const doSearch = async (q: string) => {
    try {
      const res = await apiClient.get("/organizations", {
        params: { search: q || undefined, pageSize: 20 },
      })
      setOrgs(res.data.data || [])
    } catch {
      setOrgs([])
    }
  }

  useEffect(() => {
    if (open) doSearch("")
  }, [open])

  const onSearch = (q: string) => {
    setSearch(q)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(q), 300)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-slate-50/50"
        >
          {value
            ? orgs.find((o) => o.id === Number(value))?.name || "Seleccionar"
            : "Seleccionar organizacion"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar organizacion..." onValueChange={onSearch} />
          <CommandList>
            <CommandEmpty>No se encontraron organizaciones</CommandEmpty>
            <CommandGroup>
              {orgs.map((o) => (
                <CommandItem
                  key={o.id}
                  value={o.name}
                  onSelect={() => {
                    onChange(String(o.id))
                    setOpen(false)
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${value === String(o.id) ? "opacity-100" : "opacity-0"}`}
                  />
                  {o.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
