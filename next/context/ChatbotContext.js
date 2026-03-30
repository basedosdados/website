import { createContext, useContext } from 'react';
import useThreads from '../hooks/useThreads';

const ChatbotContext = createContext(null);

export function ChatbotProvider({ children }) {
  const threadsData = useThreads();

  return (
    <ChatbotContext.Provider value={threadsData}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbotContext() {
  const context = useContext(ChatbotContext);
  if (context === null || context === undefined) {
    throw new Error('useChatbotContext must be used within a ChatbotProvider');
  }
  return context;
}

export default ChatbotContext;
