"use client"

import { useChat } from "@/hooks/useChat"
import { ChatButton } from "@/components/chat/ChatButton"
import { ChatDrawer } from "@/components/chat/ChatDrawer"
import { useAuthStore } from "@/stores/auth.store"

export function ChatWidget() {
  const chat = useChat()
  const userRoleId = useAuthStore((s) => s.user?.roleId)

  if (!userRoleId || (userRoleId !== 2 && userRoleId !== 3)) return null

  const handleOpen = () => {
    if (chat.conversations.length === 0) return

    if (userRoleId === 3 && chat.conversations.length >= 1) {
      const admin = chat.conversations[0]
      chat.selectConversation(admin.userId, admin.userName)
    } else if (userRoleId === 2 && chat.conversations.length === 1) {
      const inst = chat.conversations[0]
      chat.selectConversation(inst.userId, inst.userName)
    } else {
      chat.openDrawer()
    }
  }

  return (
    <>
      <ChatButton unreadTotal={chat.unreadTotal} onClick={handleOpen} />
      <ChatDrawer
        isOpen={chat.isDrawerOpen}
        onClose={chat.closeDrawer}
        messages={chat.messages}
        activeUserName={chat.activeUserName}
        isLoading={chat.isLoadingMessages}
        onSend={chat.sendMessage}
      />
    </>
  )
}
