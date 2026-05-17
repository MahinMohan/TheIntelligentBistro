export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'Starters' | 'Mains' | 'Desserts' | 'Drinks';
  tags: string[];
  spiceLevel: 0 | 1 | 2 | 3;
}

export interface CartItem {
  itemId: string;
  quantity: number;
  modifier?: string;
}

export type ActionType =
  | { type: 'ADD_ITEM'; itemId: string; quantity: number; modifier?: string }
  | { type: 'REMOVE_ITEM'; itemId: string }
  | { type: 'UPDATE_QUANTITY'; itemId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'NONE' };

export interface ChatRequest {
  message: string;
  cartState: CartItem[];
  menuContext: MenuItem[];
}

export interface ChatResponse {
  reply: string;
  actions: ActionType[];
}
