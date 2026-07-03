"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Message } from "@/hooks/useChat"
import { useAuthStore } from "@/stores/auth.store"

interface Props {
  isOpen: boolean
  onClose: () => void
  messages: Message[]
  activeUserName: string
  isLoading: boolean
  onSend: (content: string) => void
}

export function ChatDrawer({ isOpen, onClose, messages, activeUserName, isLoading, onSend }: Props) {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentUserId = useAuthStore((s) => s.user?.id)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    setInput("")
  }, [isOpen])

  const handleSend = () => {
    if (!input.trim()) return
    onSend(input)
    setInput("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-gray-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-[#00AEEF]/10">
            <span className="text-xs font-bold text-[#00AEEF]">
              {activeUserName.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <span className="font-semibold text-gray-900 text-sm">{activeUserName}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="size-8 rounded-full">
          <X className="size-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-[#00AEEF]" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-12">No hay mensajes aun</p>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === currentUserId
            return (
              <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    isMine
                      ? "bg-[#00AEEF] text-white rounded-br-md"
                      : "bg-gray-100 text-gray-800 rounded-bl-md"
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isMine ? "text-white/70" : "text-gray-400"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString("es-PE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-3 flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribe un mensaje..."
          className="rounded-full bg-gray-50 border-gray-200"
          maxLength={2000}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!input.trim()}
          className="size-9 rounded-full bg-[#00AEEF] hover:bg-[#0098d1] disabled:opacity-50 shrink-0"
        >
          <Send className="size-4 text-white" />
        </Button>
      </div>
    </div>
  )
}
