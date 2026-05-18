import { create } from 'zustand';

export interface PlacedOrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface PlacedOrder {
  id: string;
  items: PlacedOrderItem[];
  subtotal: number;
  total: number;
  placedAt: Date;
}

interface OrderStore {
  orders: PlacedOrder[];
  placeOrder: (order: Omit<PlacedOrder, 'id' | 'placedAt'>) => void;
  getOrdersSummary: () => string;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],

  placeOrder: (order) => {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: PlacedOrder = {
      ...order,
      id: `#IB-${suffix}`,
      placedAt: new Date(),
    };
    set((state) => ({ orders: [...state.orders, newOrder] }));
  },

  // Returns a plain-text summary for the AI to reference
  getOrdersSummary: () => {
    const { orders } = get();
    if (orders.length === 0) return 'No orders placed yet this session.';
    return orders
      .map((o, i) => {
        const mins = Math.floor((Date.now() - new Date(o.placedAt).getTime()) / 60000);
        const itemList = o.items.map((it) => `${it.quantity}x ${it.name}`).join(', ');
        return `Order ${i + 1} (${mins} min ago): ${itemList} — Total $${o.total.toFixed(2)}`;
      })
      .join('\n');
  },
}));
