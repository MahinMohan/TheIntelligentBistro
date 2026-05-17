import { create } from 'zustand';
import * as Haptics from 'expo-haptics';
import { CartItem, AIActionType } from '../types';

interface CartStore {
  items: CartItem[];
  addItem: (itemId: string, quantity?: number, modifier?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyAIActions: (actions: AIActionType[]) => void;
  getTotalItems: () => number;
  getItemQuantity: (itemId: string) => number;
}

const triggerHaptic = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
    // Haptics not available on all platforms — fail silently
  });
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (itemId, quantity = 1, modifier) => {
    triggerHaptic();
    set((state) => {
      const existing = state.items.find((i) => i.itemId === itemId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.itemId === itemId ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }
      return { items: [...state.items, { itemId, quantity, modifier }] };
    });
  },

  removeItem: (itemId) => {
    triggerHaptic();
    set((state) => ({ items: state.items.filter((i) => i.itemId !== itemId) }));
  },

  updateQuantity: (itemId, quantity) => {
    triggerHaptic();
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.itemId === itemId ? { ...i, quantity } : i
      ),
    }));
  },

  clearCart: () => {
    triggerHaptic();
    set({ items: [] });
  },

  // Atomically apply all actions from AI response
  applyAIActions: (actions) => {
    actions.forEach((action) => {
      switch (action.type) {
        case 'ADD_ITEM':
          get().addItem(action.itemId, action.quantity, action.modifier);
          break;
        case 'REMOVE_ITEM':
          get().removeItem(action.itemId);
          break;
        case 'UPDATE_QUANTITY':
          get().updateQuantity(action.itemId, action.quantity);
          break;
        case 'CLEAR_CART':
          get().clearCart();
          break;
        case 'NONE':
          break;
      }
    });
  },

  getTotalItems: () =>
    get().items.reduce((sum, item) => sum + item.quantity, 0),

  getItemQuantity: (itemId) => {
    const item = get().items.find((i) => i.itemId === itemId);
    return item?.quantity ?? 0;
  },
}));
