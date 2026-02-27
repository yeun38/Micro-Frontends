# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Micro Frontend chatbot project demonstrating two different architecture approaches:
1. **Module Federation (MFE)**: Runtime dynamic loading using Vite Module Federation
2. **Monolithic**: Traditional build-time bundling with all code in a single bundle

This allows comparison between the two approaches.

## Commands

```bash
# Install dependencies
pnpm install

# Development - run all packages in parallel
pnpm dev

# Development - run individual packages
pnpm dev:shell      # Shell host app only (port 3000)
pnpm dev:chatbot    # Chatbot remote app only (port 3001)
pnpm dev:monolithic # Monolithic app only (port 3002)

# Development - run by architecture type
pnpm dev:mfe        # Run MFE (shell + chatbot together)

# Build all packages
pnpm build
pnpm build:mfe        # Build MFE packages only
pnpm build:monolithic # Build monolithic package only

# Lint all packages
pnpm lint

# Preview built apps
pnpm preview

# WebSocket server for real-time chat (requires GEMINI_API_KEY in .env)
cd packages/chatbot && node server.js
```

## Architecture

**Monorepo Structure** (pnpm workspaces):
- `packages/shell` - MFE Host application that loads remote modules (port 3000)
- `packages/chatbot` - MFE Remote module exposing the Chatbot component (port 3001)
- `packages/monolithic` - Traditional monolithic app with all code bundled together (port 3002)

### Module Federation (MFE) Approach

**Module Federation Flow**:
1. Shell app loads `remoteEntry.js` from chatbot at `http://localhost:3001/assets/remoteEntry.js`
2. Chatbot exposes `./Chatbot` component
3. Shell uses `React.lazy()` with Suspense for dynamic loading
4. React and React-DOM are shared dependencies

### Monolithic (Traditional) Approach

**Build Time Integration**:
1. All components are imported directly at build time
2. Chatbot component is bundled together with the main app
3. No runtime module loading - everything is in a single bundle
4. Simpler configuration with no Module Federation setup

**Key Differences**:
| Feature | MFE (Module Federation) | Monolithic |
|---------|------------------------|------------|
| Bundle | Separate bundles | Single bundle |
| Loading | Runtime (lazy) | Build time |
| Deploy | Independent | Together |
| Complexity | Higher | Lower |

**WebSocket Server** (`packages/chatbot/server.js`):
- Runs on port 8080
- Integrates with Google Gemini 1.5 Flash API
- Maintains per-client chat sessions
- Falls back to local demo responses if server unavailable

## Key Files

**MFE (Module Federation)**:
- `packages/shell/src/App.tsx` - Main host component with lazy loading
- `packages/shell/src/hooks/useTheme.ts` - Theme preference hook with localStorage persistence
- `packages/chatbot/src/Chatbot.tsx` - Main chatbot UI component (exposed via federation)
- `packages/chatbot/src/hooks/useWebSocket.ts` - WebSocket connection management with auto-reconnect
- `packages/chatbot/src/types/index.ts` - Message and ChatState interfaces
- `packages/chatbot/server.js` - Node.js WebSocket server with Gemini AI

**Monolithic**:
- `packages/monolithic/src/App.tsx` - Main app with direct Chatbot import (no lazy loading)
- `packages/monolithic/src/components/Chatbot/Chatbot.tsx` - Chatbot UI (directly bundled)
- `packages/monolithic/src/hooks/useWebSocket.ts` - Same WebSocket hook (copied)
- `packages/monolithic/vite.config.ts` - Simple Vite config without Module Federation

## Tech Stack

- Vite 7.x with @originjs/vite-plugin-federation
- React 19 with TypeScript
- @vitejs/plugin-react-swc for fast compilation
- WebSocket (ws) + Google Generative AI (Gemini)

## Development Guidelines

- When creating new page components, always add a link to that page in the header
