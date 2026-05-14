import axios from 'axios'
import cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useChatbotContext } from '../context/ChatbotContext'
import useChatbotAuth from './useChatbotAuth'

function messageSortTime(createdAt) {
  if (createdAt == null) return null
  const t = new Date(createdAt).getTime()
  return Number.isFinite(t) ? t : null
}

function sortMessagesChronologically(list) {
  return [...list].sort((a, b) => {
    const ta = messageSortTime(a.created_at)
    const tb = messageSortTime(b.created_at)
    if (ta != null && tb != null && ta !== tb) return ta - tb
    if (ta != null && tb == null) return -1
    if (ta == null && tb != null) return 1
    return String(a.id).localeCompare(String(b.id), undefined, { numeric: true })
  })
}

function patchToolCallEvent(msg, toolCallsIndex, patch) {
  const toolCalls = [...(msg.toolCalls || [])]
  const prevEv = toolCalls[toolCallsIndex]
  if (!prevEv) return msg

  if (patch.kind === 'callContent') {
    toolCalls[toolCallsIndex] = { ...prevEv, content: patch.text }
    return { ...msg, toolCalls }
  }

  if (patch.kind === 'callArgsJson') {
    const list = [...(prevEv.tool_calls || [])]
    const i = patch.callIndex
    const call = list[i]
    if (!call) return { ...msg, toolCalls }
    list[i] = { ...call, streamArgsJson: patch.text }
    toolCalls[toolCallsIndex] = { ...prevEv, tool_calls: list }
    return { ...msg, toolCalls }
  }

  if (patch.kind === 'callArgsJsonFinalize') {
    const list = [...(prevEv.tool_calls || [])]
    const i = patch.callIndex
    const call = list[i]
    if (!call) return { ...msg, toolCalls }
    const { streamArgsJson: _drop, ...rest } = call
    list[i] = rest
    toolCalls[toolCallsIndex] = { ...prevEv, tool_calls: list }
    return { ...msg, toolCalls }
  }

  if (patch.kind === 'outputContent') {
    const list = [...(prevEv.tool_outputs || [])]
    const i = patch.outputIndex
    const row = list[i]
    if (!row) return { ...msg, toolCalls }
    list[i] = { ...row, content: patch.text }
    toolCalls[toolCallsIndex] = { ...prevEv, tool_outputs: list }
    return { ...msg, toolCalls }
  }

  return msg
}

function stripForStreamingToolCall(data) {
  return {
    ...data,
    type: 'tool_call',
    content: '',
    tool_calls: (data.tool_calls || []).map(c => ({ ...c, streamArgsJson: '' }))
  }
}

function stripForStreamingToolOutput(data) {
  return {
    ...data,
    type: 'tool_output',
    tool_outputs: (data.tool_outputs || []).map(o => ({ ...o, content: '' }))
  }
}

function formatStreamErrorDetails(data) {
  const ed = data?.error_details
  if (ed == null) return ''
  if (typeof ed === 'string') return ed
  if (typeof ed?.message === 'string') return ed.message
  if (typeof ed?.detail === 'string') return ed.detail
  try {
    return JSON.stringify(ed, null, 2)
  } catch {
    return String(ed)
  }
}

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
  const toolStreamQueueRef = useRef([])
  const toolStreamRafRef = useRef(null)
  const toolStreamPumpRef = useRef(null)

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

        const normalizeEvents = events => {
          if (!events) return []
          let list = events
          if (typeof events === 'string') {
            try {
              list = JSON.parse(events)
            } catch {
              return []
            }
          }
          if (!Array.isArray(list)) return []
          return list
            .filter(ev => ev && (ev.type === 'tool_output' || ev.type === 'tool_call'))
            .map(ev => ({ ...(ev.data || {}), type: ev.type }))
        }

        const raw = response.data
        const items = Array.isArray(raw) ? raw : raw && typeof raw === 'object' ? [raw] : []

        const formattedMessages = items.map(msg => {
          const isUser = String(msg.role || '').toUpperCase() === 'USER'
          const createdAt = msg.created_at ?? msg.createdAt
          const base = {
            id: isUser ? `user-${msg.id}` : msg.id,
            role: isUser ? 'user' : 'assistant',
            content: msg.content ?? '',
            status: msg.status || 'SUCCESS',
            created_at: createdAt
          }
          if (isUser) return base
          return {
            ...base,
            toolCalls: normalizeEvents(msg.events),
            isLoading: false,
            isTyping: false
          }
        })
        setMessages(sortMessagesChronologically(formattedMessages))
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
          ? firstMessage.length > 50
            ? `${firstMessage.substring(0, 50)}`
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

  const cancelToolStream = useCallback(() => {
    toolStreamQueueRef.current = []
    if (toolStreamRafRef.current != null) {
      cancelAnimationFrame(toolStreamRafRef.current)
      toolStreamRafRef.current = null
    }
  }, [])

  const ensureToolStreamPump = useCallback(() => {
    if (toolStreamRafRef.current != null) return
    toolStreamRafRef.current = requestAnimationFrame(() => {
      toolStreamPumpRef.current?.()
    })
  }, [])

  const toolStreamPump = useCallback(() => {
    const queue = toolStreamQueueRef.current
    const job = queue[0]
    if (!job) {
      toolStreamRafRef.current = null
      return
    }

    const nextPos = Math.min((job.pos || 0) + 12, job.fullText.length)
    const slice = job.fullText.slice(0, nextPos)
    job.pos = nextPos
    const isDone = nextPos >= job.fullText.length

    if (job.patchKind === 'callArgsJson') {
      setMessages(prev =>
        prev.map(msg => {
          if (msg.id !== job.botMessageId) return msg
          let next = patchToolCallEvent(msg, job.toolCallsIndex, {
            kind: 'callArgsJson',
            callIndex: job.callIndex,
            text: slice
          })
          if (isDone) {
            next = patchToolCallEvent(next, job.toolCallsIndex, {
              kind: 'callArgsJsonFinalize',
              callIndex: job.callIndex
            })
          }
          return next
        })
      )
    } else {
      const patch =
        job.patchKind === 'callContent'
          ? { kind: 'callContent', text: slice }
          : { kind: 'outputContent', outputIndex: job.outputIndex, text: slice }
      setMessages(prev =>
        prev.map(msg => {
          if (msg.id !== job.botMessageId) return msg
          return patchToolCallEvent(msg, job.toolCallsIndex, patch)
        })
      )
    }

    if (isDone) queue.shift()

    if (toolStreamQueueRef.current.length > 0) {
      toolStreamRafRef.current = requestAnimationFrame(() => {
        toolStreamPumpRef.current?.()
      })
    } else {
      toolStreamRafRef.current = null
    }
  }, [setMessages])

  toolStreamPumpRef.current = toolStreamPump

  const scheduleToolStreamForEvent = useCallback(
    (botMessageId, toolCallsIndex, eventType, data) => {
      const q = toolStreamQueueRef.current
      if (eventType === 'tool_call') {
        const content = data.content ?? ''
        if (content.length > 0) {
          q.push({
            botMessageId,
            toolCallsIndex,
            patchKind: 'callContent',
            fullText: content,
            pos: 0
          })
        }
        const calls = data.tool_calls || []
        for (let i = 0; i < calls.length; i++) {
          q.push({
            botMessageId,
            toolCallsIndex,
            patchKind: 'callArgsJson',
            callIndex: i,
            fullText: JSON.stringify(calls[i]?.args ?? {}, null, 2),
            pos: 0
          })
        }
      } else if (eventType === 'tool_output') {
        const outs = data.tool_outputs || []
        for (let i = 0; i < outs.length; i++) {
          const raw = outs[i]?.content ?? outs[i]?.output ?? outs[i]?.result
          const text =
            typeof raw === 'string' ? raw : raw != null ? JSON.stringify(raw, null, 2) : ''
          q.push({
            botMessageId,
            toolCallsIndex,
            patchKind: 'outputContent',
            outputIndex: i,
            fullText: text,
            pos: 0
          })
        }
      }
      ensureToolStreamPump()
    },
    [ensureToolStreamPump]
  )

  const sendMessage = useCallback(
    async content => {
      if (abortControllerRef.current) abortControllerRef.current.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller

      setIsLoading(true)
      setIsGenerating(true)
      charQueueRef.current = []
      cancelToolStream()
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
          let errorBody = null
          try {
            errorBody = await response.clone().json()
          } catch {
            try {
              errorBody = await response.clone().text()
            } catch {
            }
          }
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
              flushSync(() => {
                switch (event.type) {
                  case 'tool_output':
                  case 'tool_call': {
                    const payload = event.data || {}
                    setMessages(prev =>
                      prev.map(msg => {
                        if (msg.id !== botMessageId) return msg
                        const idx = (msg.toolCalls || []).length
                        const partial =
                          event.type === 'tool_call'
                            ? stripForStreamingToolCall(payload)
                            : stripForStreamingToolOutput(payload)
                        scheduleToolStreamForEvent(botMessageId, idx, event.type, payload)
                        return {
                          ...msg,
                          toolCalls: [...(msg.toolCalls || []), partial]
                        }
                      })
                    )
                    break
                  }

                  case 'final_answer':
                    if (event.data?.content) {
                      addToQueue(event.data.content)
                    }
                    break

                  case 'error': {
                    const errText = formatStreamErrorDetails(event.data)
                    if (errText) {
                      addToQueue(errText)
                    }
                    break
                  }

                  case 'complete': {
                    const completeId =
                      event.data?.message_id || event.data?.id || event.data?.run_id || botMessageId
                    for (const job of toolStreamQueueRef.current) {
                      if (job.botMessageId === botMessageId) job.botMessageId = completeId
                    }
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
                }
              })
            } catch (e) {
              console.error('Falha ao interpretar linha do stream', { line, err: e })
            }
          }

          if (done) break
        }
      } catch (err) {
        cancelToolStream()
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
    [threadId, createThread, getAccessToken, addToQueue, handleAuthError, cancelToolStream, scheduleToolStreamForEvent]
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
      if (toolStreamRafRef.current) {
        cancelAnimationFrame(toolStreamRafRef.current)
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
