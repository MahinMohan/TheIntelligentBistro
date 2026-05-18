import { CartItem, MenuItem, ChatAPIResponse } from '../types';

// Change this to your machine's local IP when testing on a physical device
// e.g. 'http://192.168.1.100:3001'
const BASE_URL = 'http://your-local-ip:3001'; // replace with your machine's local IP

export async function fetchMenu(): Promise<MenuItem[]> {
  const res = await fetch(`${BASE_URL}/api/menu`);
  if (!res.ok) throw new Error(`Menu fetch failed: ${res.status}`);
  return res.json() as Promise<MenuItem[]>;
}

export async function sendChatMessage(
  message: string,
  cartState: CartItem[],
  menuContext: MenuItem[],
  orderHistory?: string
): Promise<ChatAPIResponse> {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, cartState, menuContext, orderHistory }),
  });
  if (!res.ok) throw new Error(`Chat API failed: ${res.status}`);
  return res.json() as Promise<ChatAPIResponse>;
}
