import { useState, useEffect, useCallback, useRef } from "react"
import apiClient from "@/lib/api-client"
import { useAuthStore } from "@/stores/auth.store"

export interface Conversation {
  userId: string
  userName: string
  userRole: string
  userRoleId: number
  lastMessage: string | null
  lastMessageAt: string | null
  unreadCount: number
}

export interface Message {
  id: number
  senderId: string
  receiverId: string
  content: string
  readAt: string | null
  createdAt: string
}

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [activeUserId, setActiveUserId] = useState<string | null>(null)
  const [activeUserName, setActiveUserName] = useState("")
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const currentUserId = useAuthStore((s) => s.user?.id)
  const userRoleId = useAuthStore((s) => s.user?.roleId)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchConversations = useCallback(async () => {
    if (!currentUserId) return
    try {
      const res = await apiClient.get("/conversations")
      setConversations(res.data)
    } catch {
      // silent — endpoint might not exist yet
    }
  }, [currentUserId])

  const fetchMessages = useCallback(async (userId: string) => {
    if (!currentUserId) return
    setIsLoadingMessages(true)
    try {
      const res = await apiClient.get(`/conversations/${userId}/messages`, {
        params: { pageSize: 100 },
      })
      setMessages(res.data.data)
    } catch {
      setMessages([])
    } finally {
      setIsLoadingMessages(false)
    }
  }, [currentUserId])

  const selectConversation = useCallback((userId: string, userName: string) => {
    setActiveUserId(userId)
    setActiveUserName(userName)
    setIsDrawerOpen(true)
    fetchMessages(userId)
  }, [fetchMessages])

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false)
    setActiveUserId(null)
    setActiveUserName("")
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    if (!activeUserId || !content.trim()) return
    await apiClient.post(`/conversations/${activeUserId}/messages`, {
      content: content.trim(),
    })
    fetchMessages(activeUserId)
    fetchConversations()
  }, [activeUserId, fetchMessages, fetchConversations])

  const openDirectChat = useCallback((userId: string, userName: string) => {
    selectConversation(userId, userName)
  }, [selectConversation])

  useEffect(() => {
    if (!currentUserId) return
    fetchConversations()
    intervalRef.current = setInterval(fetchConversations, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [currentUserId, fetchConversations])

  useEffect(() => {
    if (activeUserId) {
      const msgInterval = setInterval(() => fetchMessages(activeUserId), 5000)
      return () => clearInterval(msgInterval)
    }
  }, [activeUserId, fetchMessages])

  const unreadTotal = conversations.reduce((sum, c) => sum + c.unreadCount, 0)

  const openDrawer = useCallback(() => setIsDrawerOpen(true), [])

  return {
    conversations,
    messages,
    activeUserId,
    activeUserName,
    isDrawerOpen,
    isLoadingMessages,
    unreadTotal,
    userRoleId,
    selectConversation,
    closeDrawer,
    openDrawer,
    sendMessage,
    openDirectChat,
    fetchMessages,
  }
}
