import { useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import { useCartStore } from '../store/cartStore';
import { sendChatMessage } from '../api/client';
import { MenuItem } from '../types';

let msgIdCounter = 0;
const nextId = () => `msg-${Date.now()}-${++msgIdCounter}`;

export function useChat(menu: MenuItem[]) {
  const { addMessage, setTyping } = useChatStore();
  const cartStore = useCartStore();

  const sendMessage = useCallback(
    async (text: string) => {
      const userMsg = {
        id: nextId(),
        role: 'user' as const,
        content: text,
        timestamp: new Date(),
      };
      addMessage(userMsg);
      setTyping(true);

      try {
        const response = await sendChatMessage(text, cartStore.items, menu);

        // Apply cart mutations atomically before adding the AI reply
        const hasRealActions = response.actions.some((a) => a.type !== 'NONE');
        if (hasRealActions) {
          cartStore.applyAIActions(response.actions);
        }

        addMessage({
          id: nextId(),
          role: 'assistant',
          content: response.reply,
          timestamp: new Date(),
          actions: hasRealActions ? response.actions : undefined,
          isActionCard: hasRealActions,
        });
      } catch {
        addMessage({
          id: nextId(),
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please try again.",
          timestamp: new Date(),
        });
      } finally {
        setTyping(false);
      }
    },
    [addMessage, setTyping, cartStore, menu]
  );

  return { sendMessage };
}
