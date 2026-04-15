import axios from 'axios'
import cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useChatbotContext } from '../context/ChatbotContext'
import useChatbotAuth from './useChatbotAuth'

export default function useChatbot(initialThreadId = null, options = {}) {
  const { onThreadCreated } = options
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [threadId, setThreadId] = useState(initialThreadId)
  const [isGenerating, setIsGenerating] = useState(false)

  const router = useRouter()
  const lastFetchedThreadIdRef = useRef(null)

  const handleAuthError = useCallback(() => {
    cookies.remove('token')
    cookies.remove('userBD')
    router.push('/user/login')
  }, [router])

  useEffect(() => {
    setThreadId(initialThreadId)
  }, [initialThreadId])

  const abortControllerRef = useRef(null)
  const charQueueRef = useRef([])
  const isTypingRef = useRef(false)
  const currentBotMessageIdRef = useRef(null)
  const animationFrameRef = useRef(null)

  const { getAccessToken } = useChatbotAuth()
  const { refetch: refetchThreads } = useChatbotContext()

  const fetchThreadMessages = useCallback(
    async id => {
      if (!id) {
        setMessages([])
        return
      }

      setIsLoading(true)

      try {
        const accessToken = await getAccessToken()
        if (!accessToken) {
          handleAuthError()
          return
        }
        const response = await axios.get('/api/chatbot/messages', {
          params: { threadId: id },
          headers: { Authorization: `Bearer ${accessToken}` }
        })

        const formattedMessages = []
        response.data.forEach(pair => {
          formattedMessages.push({
            id: `user-${pair.id}`,
            role: 'user',
            content: pair.user_message,
            status: 'SUCCESS',
            created_at: pair.created_at
          })

          const toolCalls = (pair.events || [])
            .filter(ev => ev.type === 'tool_output' || ev.type === 'tool_call')
            .map(ev => ({ ...ev.data, type: ev.type }))

          formattedMessages.push({
            id: pair.id,
            role: 'assistant',
            content: pair.assistant_message,
            toolCalls: toolCalls,
            isLoading: false,
            isTyping: false,
            created_at: pair.created_at,
            rating: pair.feedback?.rating
          })
        })
        setMessages(formattedMessages)
        lastFetchedThreadIdRef.current = id
      } catch (err) {
        console.error('Failed to fetch messages:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [getAccessToken, handleAuthError]
  )

  useEffect(() => {
    if (threadId && !isGenerating && threadId !== lastFetchedThreadIdRef.current) {
      fetchThreadMessages(threadId)
    } else if (!threadId && !isGenerating) {
      setMessages([])
      lastFetchedThreadIdRef.current = null
    }
  }, [threadId, isGenerating, fetchThreadMessages])

  const createThread = useCallback(
    async firstMessage => {
      try {
        const accessToken = await getAccessToken()
        if (!accessToken) {
          handleAuthError()
          throw new Error('Unauthorized')
        }

        const title = firstMessage
          ? firstMessage.length > 30
            ? `${firstMessage.substring(0, 30)}...`
            : firstMessage
          : 'Nova conversa'

        const response = await axios.post(
          '/api/chatbot/threads',
          { title },
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        )

        const newThreadId = response.data.id
        setThreadId(newThreadId)
        lastFetchedThreadIdRef.current = newThreadId
        if (refetchThreads) refetchThreads()
        if (onThreadCreated) onThreadCreated(newThreadId)

        return newThreadId
      } catch (err) {
        console.error('Failed to create thread:', err)
        throw err
      }
    },
    [getAccessToken, handleAuthError, refetchThreads, onThreadCreated]
  )

  const sendFeedback = useCallback(
    async (id, rating) => {
      try {
        const accessToken = await getAccessToken()
        if (!accessToken) {
          handleAuthError()
          throw new Error('Unauthorized')
        }

        await axios.put(
          '/api/chatbot/feedback',
          {
            rating: rating
          },
          {
            params: { messageId: id },
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        )

        setMessages(prev => prev.map(msg => (msg.id === id ? { ...msg, rating: rating } : msg)))
        return true
      } catch (err) {
        console.error('Failed to send feedback:', err)
        return false
      }
    },
    [getAccessToken, handleAuthError]
  )

  const processQueue = useCallback(() => {
    if (charQueueRef.current.length > 0) {
      const charsToAppend = charQueueRef.current.splice(0, 5).join('')
      const botId = currentBotMessageIdRef.current

      setMessages(prev =>
        prev.map(msg => {
          if (msg.id !== botId) return msg
          return { ...msg, content: (msg.content || '') + charsToAppend }
        })
      )

      animationFrameRef.current = requestAnimationFrame(processQueue)
    } else {
      isTypingRef.current = false
      const botId = currentBotMessageIdRef.current
      if (botId) {
        setMessages(prev => prev.map(msg => (msg.id === botId ? { ...msg, isTyping: false } : msg)))
      }
      animationFrameRef.current = null
    }
  }, [])

  const addToQueue = useCallback(
    text => {
      if (!text) return

      const lineCount = text.split('\n').length
      const botId = currentBotMessageIdRef.current

      if (lineCount > 40) {
        setMessages(prev =>
          prev.map(msg => {
            if (msg.id !== botId) return msg
            const prefix = msg.content ? '\n\n' : ''
            return { ...msg, content: (msg.content || '') + prefix + text }
          })
        )

        charQueueRef.current = []
        isTypingRef.current = false

        return
      }

      charQueueRef.current.push(...text.split(''))

      if (!isTypingRef.current) {
        isTypingRef.current = true
        setMessages(prev => prev.map(msg => (msg.id === botId ? { ...msg, isTyping: true } : msg)))
        processQueue()
      }
    },
    [processQueue]
  )

  const sendMessage = useCallback(
    async content => {
      if (abortControllerRef.current) abortControllerRef.current.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller

      setIsLoading(true)
      setIsGenerating(true)
      charQueueRef.current = []
      let currentThreadId = threadId

      const userMessage = {
        id: `user-${crypto.randomUUID()}`,
        role: 'user',
        content: content,
        status: 'SUCCESS'
      }
      setMessages(prev => [...prev, userMessage])

      const botMessageId = crypto.randomUUID()
      currentBotMessageIdRef.current = botMessageId
      setMessages(prev => [
        ...prev,
        {
          id: botMessageId,
          role: 'assistant',
          content: '',
          isLoading: true,
          isTyping: false,
          toolCalls: []
        }
      ])

      try {
        if (!currentThreadId) {
          currentThreadId = await createThread(content)
        }
        if (!currentThreadId) {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === botMessageId
                ? {
                    ...msg,
                    isLoading: false,
                    isError: true,
                    content:
                      'Não foi possível iniciar uma conversa com o chatbot. Por favor, tente novamente.'
                  }
                : msg
            )
          )
          return
        }

        const accessToken = await getAccessToken()
        if (!accessToken) {
          handleAuthError()
          return
        }

        const response = await fetch(`/api/chatbot/messages?threadId=${currentThreadId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ content, stream: true }),
          signal: controller.signal
        })

        if (!response.ok) {
          throw new Error('Erro na requisição')
        }

        if (!response.body) {
          throw new Error('Sem corpo na resposta')
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (!done) {
            buffer += decoder.decode(value, { stream: true })
          }

          const lines = buffer.split('\n')
          buffer = done ? '' : lines.pop() || ''

          for (const line of lines) {
            if (!line.trim()) continue
            try {
              const event = JSON.parse(line)

              switch (event.type) {
                case 'tool_output':
                case 'tool_call':
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === botMessageId
                        ? {
                            ...msg,
                            toolCalls: [
                              ...(msg.toolCalls || []),
                              { ...event.data, type: event.type }
                            ]
                          }
                        : msg
                    )
                  )
                  break

                case 'final_answer':
                  if (event.data?.content) {
                    addToQueue(event.data.content)
                  }
                  break

                case 'error':
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === botMessageId
                        ? {
                            ...msg,
                            isError: true,
                            isLoading: false,
                            content: event.data?.error_details?.message
                          }
                        : msg
                    )
                  )
                  break

                case 'complete':
                  const completeId =
                    event.data?.run_id || event.data?.id || event.data?.message_id || botMessageId
                  currentBotMessageIdRef.current = completeId
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === botMessageId
                        ? {
                            ...msg,
                            id: completeId,
                            isLoading: false
                          }
                        : msg
                    )
                  )
                  break
              }
            } catch (e) {
              console.error('JSON Parse error', e)
            }
          }

          if (done) break
        }
      } catch (err) {
        if (err.name === 'AbortError') return
        console.error(err)
        setMessages(prev =>
          prev.map(msg =>
            msg.id === currentBotMessageIdRef.current
              ? {
                  ...msg,
                  isLoading: false,
                  isError: true,
                  content: 'Ocorreu um erro. Por favor, tente novamente.'
                }
              : msg
          )
        )
      } finally {
        setIsLoading(false)
        setIsGenerating(false)

        const finalBotId = currentBotMessageIdRef.current || botMessageId
        setMessages(prev =>
          prev.map(msg => (msg.id === finalBotId ? { ...msg, isLoading: false } : msg))
        )
      }
    },
    [threadId, createThread, getAccessToken, addToQueue, handleAuthError]
  )

  const fetchThreadMessagesStable = useCallback(
    id => {
      if (id !== threadId) {
        setThreadId(id)
      }
    },
    [threadId]
  )

  const resetChat = useCallback(() => {
    setThreadId(null)
    setMessages([])
    setIsLoading(false)
    setIsGenerating(false)
    lastFetchedThreadIdRef.current = null
  }, [])

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return {
    messages,
    isLoading,
    isGenerating,
    threadId,
    sendMessage,
    createThread,
    fetchThreadMessages: fetchThreadMessagesStable,
    sendFeedback,
    resetChat
  }
}
