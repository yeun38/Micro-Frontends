# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Micro Frontend chatbot project using Vite Module Federation. The shell app (host) dynamically loads the chatbot component from a remote module at runtime.

## Commands

```bash
# Install dependencies
pnpm install

# Development - run all packages in parallel
pnpm dev

# Development - run individual packages
pnpm dev:shell    # Shell host app only (port 3000)
pnpm dev:chatbot  # Chatbot remote app only (port 3001)

# Build all packages
pnpm build

# Lint all packages
pnpm lint

# Preview built apps
pnpm preview

# WebSocket server for real-time chat (requires GEMINI_API_KEY in .env)
cd packages/chatbot && node server.js
```

## Architecture

**Monorepo Structure** (pnpm workspaces):
- `packages/shell` - Host application that loads remote modules (port 3000)
- `packages/chatbot` - Remote module exposing the Chatbot component (port 3001)

**Module Federation Flow**:
1. Shell app loads `remoteEntry.js` from chatbot at `http://localhost:3001/assets/remoteEntry.js`
2. Chatbot exposes `./Chatbot` component
3. Shell uses `React.lazy()` with Suspense for dynamic loading
4. React and React-DOM are shared dependencies

**WebSocket Server** (`packages/chatbot/server.js`):
- Runs on port 8080
- Integrates with Google Gemini 1.5 Flash API
- Maintains per-client chat sessions
- Falls back to local demo responses if server unavailable

## Key Files

- `packages/shell/src/App.tsx` - Main host component with lazy loading
- `packages/chatbot/src/Chatbot.tsx` - Main chatbot UI component (exposed via federation)
- `packages/chatbot/src/hooks/useWebSocket.ts` - WebSocket connection management with auto-reconnect
- `packages/chatbot/src/types/index.ts` - Message and ChatState interfaces
- `packages/chatbot/server.js` - Node.js WebSocket server with Gemini AI

## Tech Stack

- Vite 7.x with @originjs/vite-plugin-federation
- React 19 with TypeScript
- @vitejs/plugin-react-swc for fast compilation
- WebSocket (ws) + Google Generative AI (Gemini)

## Development Guidelines

- When creating new page components, always add a link to that page in the header
