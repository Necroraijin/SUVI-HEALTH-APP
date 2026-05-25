import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'suvi' | 'doctor';
  timestamp: string;
}

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setTyping: (typing: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isTyping: false,
  addMessage: (msg) => set((state) => ({
    messages: [
      ...state.messages,
      {
        ...msg,
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString(),
      }
    ]
  })),
  setTyping: (isTyping) => set({ isTyping }),
}));
