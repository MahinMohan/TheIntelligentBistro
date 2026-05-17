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

export type AIActionType =
  | { type: 'ADD_ITEM'; itemId: string; quantity: number; modifier?: string }
  | { type: 'REMOVE_ITEM'; itemId: string }
  | { type: 'UPDATE_QUANTITY'; itemId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'NONE' };

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: AIActionType[];
  isActionCard?: boolean;
}

export interface ChatAPIResponse {
  reply: string;
  actions: AIActionType[];
}

export type MenuCategory = 'All' | 'Starters' | 'Mains' | 'Desserts' | 'Drinks';
