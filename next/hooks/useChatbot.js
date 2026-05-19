import axios from 'axios'
import cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

function normalizeMessagesApiPayload(raw) {
  if (raw == null) return []
  if (Array.isArray(raw)) return raw
  if (typeof raw === 'object' && Array.isArray(raw.messages)) return raw.messages
  return []
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

function summarizeErrorPayload(body, maxLen = 600) {
  if (body == null || body === '') return ''
  try {
    const s = typeof body === 'string' ? body.trim() : JSON.stringify(body)
    if (!s) return ''
    return s.length > maxLen ? `${s.slice(0, maxLen)}…` : s
  } catch {
    const s = String(body).trim()
    return s.length > maxLen ? `${s.slice(0, maxLen)}…` : s
  }
}

function chatbotError(message) {
  return new Error(`[Chatbot] ${message}`)
}

export default function useChatbot(initialThreadId = null, options = {}) {
  const { onThreadCreated } = options
  const [messages, setMessages] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [threadId, setThreadId] = useState(
    initialThreadId === undefined ? null : initialThreadId
  )
  const [pendingStreams, setPendingStreams] = useState([])
  const [newChatSending, setNewChatSending] = useState(false)
  const messagesRef = useRef([])

  const router = useRouter()
  const lastFetchedThreadIdRef = useRef(null)
  const fetchSeqRef = useRef(0)
  const pendingHistoryLoadsRef = useRef(0)
  const abortControllersByThreadRef = useRef(new Map())
  const threadIdRef = useRef(
    initialThreadId === undefined ? null : initialThreadId
  )
  const prevThreadIdRef = useRef(
    initialThreadId === undefined ? undefined : initialThreadId
  )
  const pendingStreamsRef = useRef([])
  const newChatSendingRef = useRef(false)

  const handleAuthError = useCallback(() => {
    cookies.remove('token')
    cookies.remove('userBD')
    router.push('/user/login')
  }, [router])

  useEffect(() => {
    if (initialThreadId === undefined) return
    setThreadId(initialThreadId)
  }, [initialThreadId])

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    threadIdRef.current = threadId
  }, [threadId])

  const isGenerating = useMemo(() => {
    if (newChatSending) return true
    const tid = threadId
    if (!tid) return false
    return pendingStreams.some(s => s.threadId === tid)
  }, [threadId, pendingStreams, newChatSending])

  useEffect(() => {
    pendingStreamsRef.current = pendingStreams
  }, [pendingStreams])

  useEffect(() => {
    newChatSendingRef.current = newChatSending
  }, [newChatSending])

  const isLoading = historyLoading

  const charQueueRef = useRef([])
  const isTypingRef = useRef(false)
  const currentBotMessageIdRef = useRef(null)
  const animationFrameRef = useRef(null)
  const toolStreamQueueRef = useRef([])
  const toolStreamRafRef = useRef(null)
  const toolStreamPumpRef = useRef(null)

  const { getAccessToken } = useChatbotAuth()
  const { refetch: refetchThreads } = useChatbotContext()

  const cancelToolStream = useCallback(targetThreadId => {
    const q = toolStreamQueueRef.current
    if (targetThreadId === undefined) {
      toolStreamQueueRef.current = []
    } else {
      toolStreamQueueRef.current = q.filter(j => j.streamThreadId !== targetThreadId)
    }
    const remaining = toolStreamQueueRef.current.length
    if (remaining === 0 && toolStreamRafRef.current != null) {
      cancelAnimationFrame(toolStreamRafRef.current)
      toolStreamRafRef.current = null
    } else if (remaining > 0 && toolStreamRafRef.current == null) {
      toolStreamRafRef.current = requestAnimationFrame(() => {
        toolStreamPumpRef.current?.()
      })
    }
  }, [])

  const detachTypingAnimation = useCallback(() => {
    charQueueRef.current = []
    isTypingRef.current = false
    currentBotMessageIdRef.current = null
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }, [])

  const fetchThreadMessages = useCallback(
    async (id, opts = {}) => {
      const silent = Boolean(opts?.silent)
      if (!id) {
        if (!silent) {
          setMessages([])
        }
        return
      }

      const navGen = fetchSeqRef.current
      if (!silent) {
        pendingHistoryLoadsRef.current++
        setHistoryLoading(true)
      }

      try {
        const accessToken = await getAccessToken()
        if (!accessToken) {
          handleAuthError()
          return
        }
        const response = await axios.get('/api/chatbot/messages', {
          params: { threadId: id, _ts: `${Date.now()}` },
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })

        if (navGen !== fetchSeqRef.current) {
          return
        }

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
        const items = normalizeMessagesApiPayload(raw)

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
        if (silent && threadIdRef.current !== id) {
          return
        }
        setMessages(sortMessagesChronologically(formattedMessages))
        lastFetchedThreadIdRef.current = id
      } catch (err) {
        console.error('Failed to fetch messages:', err)
      } finally {
        if (!silent) {
          pendingHistoryLoadsRef.current = Math.max(0, pendingHistoryLoadsRef.current - 1)
          if (pendingHistoryLoadsRef.current === 0) {
            setHistoryLoading(false)
          }
        }
      }
    },
    [getAccessToken, handleAuthError]
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const tick = () => {
      const tid = threadIdRef.current
      if (!tid) return

      const streamingThisThread =
        newChatSendingRef.current ||
        pendingStreamsRef.current.some(s => s.threadId === tid)

      const typingOrToolAnim =
        charQueueRef.current.length > 0 ||
        animationFrameRef.current != null ||
        toolStreamQueueRef.current.length > 0 ||
        toolStreamRafRef.current != null

      const assistantUiBusy = messagesRef.current.some(
        m => m.role === 'assistant' && (m.isLoading === true || m.isTyping === true)
      )

      if (streamingThisThread || typingOrToolAnim || assistantUiBusy) return

      fetchThreadMessages(tid, { silent: true })
    }

    const intervalId = window.setInterval(tick, 60_000);
    return () => window.clearInterval(intervalId)
  }, [fetchThreadMessages])

  useEffect(() => {
    const prev = prevThreadIdRef.current
    prevThreadIdRef.current = threadId
    if (prev != null && prev !== threadId) {
      fetchSeqRef.current++
      lastFetchedThreadIdRef.current = null
      detachTypingAnimation()
    }
  }, [threadId, detachTypingAnimation])

  useEffect(() => {
    if (threadId && threadId !== lastFetchedThreadIdRef.current) {
      fetchThreadMessages(threadId)
    } else if (!threadId) {
      setMessages([])
      lastFetchedThreadIdRef.current = null
    }
  }, [threadId, fetchThreadMessages])

  const createThread = useCallback(
    async firstMessage => {
      try {
        const accessToken = await getAccessToken()
        if (!accessToken) {
          handleAuthError()
          throw chatbotError(
            'Sessão não autorizada ou token indisponível. Faça login novamente.'
          )
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
          throw chatbotError(
            'Sessão não autorizada ou token indisponível. Faça login novamente.'
          )
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
    (text, streamThreadId) => {
      const normalized =
        typeof text === 'string' ? text : text != null ? String(text) : ''
      if (!normalized || threadIdRef.current !== streamThreadId) return

      const lineCount = normalized.split('\n').length
      const botId = currentBotMessageIdRef.current

      if (lineCount > 40) {
        setMessages(prev =>
          prev.map(msg => {
            if (msg.id !== botId) return msg
            const prefix = msg.content ? '\n\n' : ''
            return { ...msg, content: (msg.content || '') + prefix + normalized }
          })
        )

        charQueueRef.current = []
        isTypingRef.current = false

        return
      }

      charQueueRef.current.push(...normalized.split(''))

      if (!isTypingRef.current) {
        isTypingRef.current = true
        setMessages(prev => prev.map(msg => (msg.id === botId ? { ...msg, isTyping: true } : msg)))
        processQueue()
      }
    },
    [processQueue]
  )

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

    const jobThreadId = job.streamThreadId
    if (!jobThreadId || threadIdRef.current !== jobThreadId) {
      queue.shift()
      if (queue.length > 0) {
        toolStreamRafRef.current = requestAnimationFrame(() => {
          toolStreamPumpRef.current?.()
        })
      } else {
        toolStreamRafRef.current = null
      }
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
    (botMessageId, toolCallsIndex, eventType, data, streamThreadId) => {
      const q = toolStreamQueueRef.current
      if (eventType === 'tool_call') {
        const content = data.content ?? ''
        if (content.length > 0) {
          q.push({
            botMessageId,
            toolCallsIndex,
            streamThreadId,
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
            streamThreadId,
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
            streamThreadId,
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
      const viewThreadSnapshot = threadId
      const hadThreadInitially = Boolean(viewThreadSnapshot)
      if (!hadThreadInitially) {
        setNewChatSending(true)
      }

      let currentThreadId = viewThreadSnapshot
      let controller = null
      const botMessageId = crypto.randomUUID()
      const streamSessionId = crypto.randomUUID()
      let streamThreadId = null

      currentBotMessageIdRef.current = botMessageId

      const userMessage = {
        id: `user-${crypto.randomUUID()}`,
        role: 'user',
        content: content,
        status: 'SUCCESS'
      }

      let streamCompletedOk = false

      try {
        setMessages(prev => [...prev, userMessage])
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

        if (!currentThreadId) {
          currentThreadId = await createThread(content)
        }
        if (!currentThreadId) {
          if (threadIdRef.current === viewThreadSnapshot) {
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
          }
          return
        }

        if (!hadThreadInitially) {
          setNewChatSending(false)
        }

        streamThreadId = currentThreadId

        const streamMatchesView = () => threadIdRef.current === streamThreadId

        const accessToken = await getAccessToken()
        if (!accessToken) {
          handleAuthError()
          return
        }

        const existingCtl = abortControllersByThreadRef.current.get(streamThreadId)
        if (existingCtl) {
          existingCtl.abort()
          cancelToolStream(streamThreadId)
          detachTypingAnimation()
        }

        controller = new AbortController()
        abortControllersByThreadRef.current.set(streamThreadId, controller)

        setPendingStreams(prev => [...prev, { id: streamSessionId, threadId: streamThreadId }])

        const response = await fetch(`/api/chatbot/messages?threadId=${streamThreadId}`, {
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
          const detail = summarizeErrorPayload(errorBody)
          throw chatbotError(
            detail
              ? `Não foi possível enviar a mensagem ao chatbot (HTTP ${response.status}): ${detail}`
              : `Não foi possível enviar a mensagem ao chatbot (HTTP ${response.status}).`
          )
        }

        if (!response.body) {
          throw chatbotError(
            'O servidor respondeu sem corpo na resposta (streaming indisponível). Tente novamente em instantes.'
          )
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
                    if (!streamMatchesView()) break
                    const payload = event.data || {}
                    setMessages(prev =>
                      prev.map(msg => {
                        if (msg.id !== botMessageId) return msg
                        const idx = (msg.toolCalls || []).length
                        const partial =
                          event.type === 'tool_call'
                            ? stripForStreamingToolCall(payload)
                            : stripForStreamingToolOutput(payload)
                        scheduleToolStreamForEvent(
                          botMessageId,
                          idx,
                          event.type,
                          payload,
                          streamThreadId
                        )
                        return {
                          ...msg,
                          toolCalls: [...(msg.toolCalls || []), partial]
                        }
                      })
                    )
                    break
                  }

                  case 'final_answer':
                  case 'model_call_limit':
                  case 'error':
                    if (event.data?.content) {
                      addToQueue(event.data.content, streamThreadId)
                    }
                    break

                  case 'complete': {
                    if (!streamMatchesView()) break
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

        streamCompletedOk = true
      } catch (err) {
        const tid =
          typeof streamThreadId === 'string' && streamThreadId ? streamThreadId : currentThreadId
        if (err.name !== 'AbortError' && tid) {
          cancelToolStream(tid)
        }
        if (err.name === 'AbortError') return
        console.error(err)
        const errBotId = currentBotMessageIdRef.current || botMessageId
        if (threadIdRef.current === tid) {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === errBotId
                ? {
                    ...msg,
                    isLoading: false,
                    isError: true,
                    content: 'Ocorreu um erro. Por favor, tente novamente.'
                  }
                : msg
            )
          )
        }
      } finally {
        setNewChatSending(false)

        if (typeof streamSessionId === 'string' && streamSessionId) {
          setPendingStreams(prev => prev.filter(s => s.id !== streamSessionId))
        }

        const tid =
          typeof streamThreadId === 'string' && streamThreadId ? streamThreadId : currentThreadId

        if (tid && controller) {
          const mapCtl = abortControllersByThreadRef.current.get(tid)
          if (mapCtl === controller) {
            abortControllersByThreadRef.current.delete(tid)
          }
        }

        if (tid && threadIdRef.current === tid) {
          const finalBotId = currentBotMessageIdRef.current || botMessageId
          setMessages(prev =>
            prev.map(msg => (msg.id === finalBotId ? { ...msg, isLoading: false } : msg))
          )
        }

        if (tid && streamCompletedOk) {
          (async () => {
            const viewingThisThread = () => threadIdRef.current === tid
            const deadline = Date.now() + 120_000

            while (
              viewingThisThread() &&
              (charQueueRef.current.length > 0 || animationFrameRef.current != null) &&
              Date.now() < deadline
            ) {
              await new Promise(r => requestAnimationFrame(r))
            }

            await fetchThreadMessages(tid, { silent: true })
          })()
        }
      }
    },
    [
      threadId,
      createThread,
      getAccessToken,
      addToQueue,
      handleAuthError,
      cancelToolStream,
      scheduleToolStreamForEvent,
      detachTypingAnimation,
      fetchThreadMessages
    ]
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
    fetchSeqRef.current++
    detachTypingAnimation()
    setThreadId(null)
    setMessages([])
    lastFetchedThreadIdRef.current = null
  }, [detachTypingAnimation])

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (toolStreamRafRef.current) {
        cancelAnimationFrame(toolStreamRafRef.current)
      }
      cancelToolStream()
    }
  }, [cancelToolStream])

  return {
    messages,
    isLoading,
    isGenerating,
    threadId,
    sendMessage,
    createThread,
    syncThreadIdFromUrl: fetchThreadMessagesStable,
    fetchThreadMessages: fetchThreadMessagesStable,
    sendFeedback,
    resetChat
  }
}
