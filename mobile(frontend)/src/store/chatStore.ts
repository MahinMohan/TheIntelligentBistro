import { create } from 'zustand';
import { ChatMessage } from '../types';

interface ChatStore {
  messages: ChatMessage[];
  isTyping: boolean;
  addMessage: (message: ChatMessage) => void;
  setTyping: (typing: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isTyping: false,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setTyping: (typing) => set({ isTyping: typing }),

  clearMessages: () => set({ messages: [] }),
}));
