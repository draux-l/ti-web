"use client"

import { MessageCircle } from "lucide-react"

interface Props {
  unreadTotal: number
  onClick: () => void
}

export function ChatButton({ unreadTotal, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-4 right-4 z-40 flex size-14 items-center justify-center rounded-full bg-[#00AEEF] text-white shadow-lg hover:bg-[#0098d1] hover:scale-105 transition-all duration-200"
    >
      <MessageCircle className="size-6" />
      {unreadTotal > 0 && (
        <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {unreadTotal > 9 ? "9+" : unreadTotal}
        </span>
      )}
    </button>
  )
}
