# The Intelligent Bistro

A high-fidelity mobile restaurant ordering app with a conversational AI interface powered by GPT-4o. Users browse a premium menu, manage a cart, and place orders through natural language — "Add two spicy chicken sandwiches and a large water."

---

## Architecture Overview

```
Viridien/
├── backend/          Node.js + Express + OpenAI API
│   └── src/
│       ├── index.ts          Express server entry
│       ├── chatHandler.ts    GPT-4o integration
│       ├── menuData.ts       Menu data source of truth
│       └── types.ts          Shared TypeScript types
└── mobile/           React Native (Expo SDK 54)
    ├── app/
    │   ├── _layout.tsx       Root layout (fonts, gesture handler)
    │   └── (tabs)/
    │       ├── _layout.tsx   Tab bar
    │       ├── index.tsx     Menu Screen
    │       ├── chat.tsx      AI Chat Screen
    │       └── cart.tsx      Cart Screen
    └── src/
        ├── api/client.ts     Backend API calls
        ├── components/       Reusable UI components
        ├── constants/colors  Design tokens
        ├── data/menu.ts      Local menu fallback
        ├── hooks/            useMenu, useCart, useChat
        ├── store/            Zustand cartStore + chatStore
        └── types.ts          Shared TypeScript types
```

### Data Flow

1. **Menu Screen** → `useMenu` fetches `/api/menu` → renders 2-column card grid
2. **Chat Screen** → user types → `useChat` → `POST /api/chat` with message + cartState + menuContext → GPT-4o returns `{ reply, actions }` → `applyAIActions` updates Zustand cart atomically → all screens re-render in real time
3. **Cart Screen** → reads directly from Zustand cart store → renders quantities, totals

---

## Environment Variables

### Backend (`backend/.env`)

```env
OPENAI_API_KEY=sk-...   # Your OpenAI API key — required
PORT=3001               # Default port (optional)
```

### Mobile

The API base URL is in `mobile/src/api/client.ts`:
```ts
const BASE_URL = 'http://localhost:3001';
```
> **Physical device:** Change `localhost` to your machine's local IP (e.g. `192.168.1.100`).

---

## Setup & Running

### Prerequisites
- Node.js 18+
- npm 9+
- Expo Go app on your phone, **or** Android Studio / Xcode for emulator

### 1 — Backend

```bash
cd backend
npm install
# Make sure OPENAI_API_KEY is set in .env
npm run dev
```

The API will start at **http://localhost:3001**. Test it:
```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/api/menu
```

### 2 — Mobile App

```bash
cd mobile
npm install
npx expo start
```

This opens the **Expo Dev Menu** in your terminal. Then:

| How to run | Steps |
|---|---|
| **Expo Go (phone)** | Scan the QR code with the Expo Go app |
| **Android Emulator** | Press `a` in the terminal (needs Android Studio) |
| **iOS Simulator** | Press `i` (macOS + Xcode only) |
| **Web browser** | Press `w` (limited native feature support) |

> **Tip:** If you're on a physical device and the app can't reach the backend, update `BASE_URL` in `mobile/src/api/client.ts` to your machine's local IP address.

---

## Key Features

- **Menu Screen** — scroll-aware animated header, category filter tabs, 2-column card grid with skeleton loaders, floating cart button with live subtotal
- **AI Chat Screen** — GPT-4o natural language ordering, animated message bubbles, ActionCard showing cart changes with Undo, suggestion chips on empty state, 3-dot typing indicator
- **Cart Screen** — quantity steppers, animated rows with MotiView, order summary with 8% tax, place order success animation, beautiful empty state

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | React Native + Expo SDK 54 |
| Navigation | Expo Router (file-based) |
| State | Zustand |
| Animations | React Native Reanimated 3 + Moti |
| Fonts | Playfair Display + DM Sans (Google Fonts) |
| Backend | Node.js + Express |
| AI | OpenAI GPT-4o via official SDK |
| Language | TypeScript throughout |
