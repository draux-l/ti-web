"use client"

import { Loader2 } from "lucide-react"
import type { Conversation } from "@/hooks/useChat"

interface Props {
  conversations: Conversation[]
  onSelect: (userId: string, userName: string) => void
  isLoading?: boolean
}

export function ConversationList({ conversations, onSelect, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse flex items-center gap-3 bg-slate-100 rounded-lg p-3">
            <div className="size-10 rounded-full bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 bg-slate-200 rounded" />
              <div className="h-2 w-40 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">No hay conversaciones</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {conversations.map((conv) => (
        <button
          key={conv.userId}
          type="button"
          onClick={() => onSelect(conv.userId, conv.userName)}
          className="flex items-center gap-3 rounded-lg bg-[#f8fafc] px-3 py-2.5 border border-slate-100 hover:bg-slate-100 transition-colors text-left"
        >
          <div className="relative shrink-0">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#00AEEF]/10">
              <span className="text-sm font-bold text-[#00AEEF]">
                {conv.userName.substring(0, 2).toUpperCase()}
              </span>
            </div>
            {conv.unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {conv.unreadCount}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-slate-700 truncate">
                {conv.userName}
              </span>
              {conv.lastMessageAt && (
                <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                  {new Date(conv.lastMessageAt).toLocaleTimeString("es-PE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>
            {conv.lastMessage && (
              <p className="text-[12px] text-slate-500 truncate mt-0.5">
                {conv.lastMessage}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
