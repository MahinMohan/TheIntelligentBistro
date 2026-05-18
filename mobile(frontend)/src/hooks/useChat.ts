import { useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';
import { sendChatMessage } from '../api/client';
import { MenuItem } from '../types';

let msgIdCounter = 0;
const nextId = () => `msg-${Date.now()}-${++msgIdCounter}`;

export function useChat(menu: MenuItem[]) {
  const { addMessage, setTyping } = useChatStore();
  const cartStore = useCartStore();
  const orderStore = useOrderStore();

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
        // Include order history so AI knows what's been placed
        const orderHistory = orderStore.getOrdersSummary();

        const response = await sendChatMessage(
          text,
          cartStore.items,
          menu,
          orderHistory
        );

        const hasRealActions = response.actions.some((a) => a.type !== 'NONE');

        if (hasRealActions) {
          cartStore.applyAIActions(response.actions, (itemsSnapshot) => {
            // Build and save the placed order
            const orderItems = itemsSnapshot.map((ci) => {
              const menuItem = menu.find((m) => m.id === ci.itemId);
              return {
                itemId: ci.itemId,
                name: menuItem?.name ?? ci.itemId,
                quantity: ci.quantity,
                price: menuItem?.price ?? 0,
              };
            });
            const subtotal = orderItems.reduce(
              (s, i) => s + i.price * i.quantity, 0
            );
            orderStore.placeOrder({
              items: orderItems,
              subtotal,
              total: subtotal * 1.08,
            });
          });
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
    [addMessage, setTyping, cartStore, orderStore, menu]
  );

  return { sendMessage };
}
