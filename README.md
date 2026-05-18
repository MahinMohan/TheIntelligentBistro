# The Intelligent Bistro

A high-fidelity mobile restaurant ordering app powered by a conversational AI assistant named Sage. Users browse a premium menu, manage their cart, and place orders through natural language — "Add two spicy chicken sandwiches and a large water."

Built as part of the Viridien AI Full-Stack Engineering Internship assessment.

---

## Features

**Splash Screen**

<img src="assets/screenshots/splash.png" width="250"/>

**Menu Screen**

<img src="assets/screenshots/menu1.png" width="250"/> <img src="assets/screenshots/menu2.png" width="250"/>

- Scroll-aware animated header with restaurant branding
- Horizontally scrollable category tabs with animated gold active indicator
- 2-column card grid with skeleton loaders on initial load
- Tap any card to view full dish details
- Add to cart directly from the card with animated quantity stepper
- Floating cart button with live item count and subtotal
- Sage AI shortcut button for quick access to the assistant

**AI Chat Screen (Sage)**

<img src="assets/screenshots/chat1.png" width="250"/> <img src="assets/screenshots/chat2.png" width="250"/>

- Natural language ordering: "Add two wagyu burgers and a lemonade"
- AI always receives current cart state and full menu context
- Structured JSON actions applied atomically to the cart in real time
- ActionCard in chat thread shows exactly what changed with an Undo option
- Animated typing indicator while AI is responding
- Suggestion chips on empty state to guide first-time users
- Order history tracked and available for AI to reference

**Order History Screen**

<img src="assets/screenshots/orders1.png" width="250"/> <img src="assets/screenshots/orders2.png" width="250"/>

- Previous orders button appears in the cart after first order is placed
- Each order shows a unique ID, time elapsed, full item breakdown, and total
- Session grand total displayed when multiple orders are placed

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | React Native + Expo SDK 54 |
| Navigation | Expo Router (file-based) |
| Styling | NativeWind v4 + custom design tokens |
| State Management | Zustand |
| Animations | React Native Reanimated 3 + Moti |
| Fonts | Playfair Display + DM Sans |
| Backend | Node.js + Express |
| AI | Groq API (llama-3.3-70b-versatile) |
| Language | TypeScript throughout |

AI tools used during development: Cursor (Claude Sonnet)

---

## Project Structure

```
Viridien/
├── backend/
│   └── src/
│       ├── index.ts          Express server, API routes
│       ├── chatHandler.ts    Groq AI integration and system prompt
│       ├── menuData.ts       Menu data source of truth
│       └── types.ts          TypeScript interfaces
└── mobile(frontend)/
    ├── app/
    │   ├── _layout.tsx       Root layout, fonts, splash screen
    │   ├── (tabs)/
    │   │   ├── index.tsx     Menu screen
    │   │   ├── chat.tsx      AI chat screen
    │   │   └── cart.tsx      Cart screen
    │   ├── dish/[id].tsx     Dish detail screen
    │   └── orders.tsx        Order history screen
    └── src/
        ├── api/client.ts     Backend API client
        ├── components/       MenuCard, ChatBubble, FloatingCartButton, etc.
        ├── constants/        Color tokens
        ├── hooks/            useMenu, useCart, useChat
        ├── store/            cartStore, chatStore, orderStore (Zustand)
        └── types.ts          TypeScript interfaces
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/menu | Returns full menu data |
| POST | /api/chat | Accepts message + cart state, returns AI reply and actions |
| GET | /api/health | Health check |

### Chat request shape

```json
{
  "message": "Add two spicy chicken sandwiches and a large water",
  "cartState": [],
  "menuContext": [],
  "orderHistory": "No orders placed yet this session."
}
```

### Chat response shape

```json
{
  "reply": "Great choice! I've added those to your cart.",
  "actions": [
    { "type": "ADD_ITEM", "itemId": "main-004", "quantity": 2 },
    { "type": "ADD_ITEM", "itemId": "drink-004", "quantity": 1 }
  ]
}
```

Supported action types: `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`, `PLACE_ORDER`, `NONE`

---

## Setup and Running

### Prerequisites

- Node.js 18+
- npm 9+
- Expo Go app on your phone, or an Android/iOS emulator

---

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
```

Get a free Groq API key at [console.groq.com](https://console.groq.com).

```bash
npm run dev
```

The API starts at `http://localhost:3001`. Verify with:

```bash
curl http://localhost:3001/api/health
```

---

### 2. Mobile App

```bash
cd "mobile(frontend)"
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone.

**Important:** If testing on a physical device, update `BASE_URL` in `mobile(frontend)/src/api/client.ts` to your machine's local IP address:

```ts
const BASE_URL = 'http://your-local-ip:3001';
```

Find your IP by running `ipconfig` (Windows) or `ifconfig` (Mac/Linux). Both your phone and computer must be on the same WiFi network.

To test over any network without being on the same WiFi:

```bash
npm install -g ngrok
ngrok http 3001
# Use the generated https URL as BASE_URL
```

---

## Environment Variables

| Variable | Location | Description |
|---|---|---|
| `GROQ_API_KEY` | `backend/.env` | Groq API key for AI chat |
| `PORT` | `backend/.env` | Server port (default: 3001) |
| `BASE_URL` | `mobile(frontend)/src/api/client.ts` | Backend URL for the mobile app |

A `.env.example` file is included in the backend folder for reference.
