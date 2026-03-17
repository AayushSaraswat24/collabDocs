# 🚀 CollabDoc — Real-Time Collaborative Document Editor

Real-time collaborative document editor built with CRDTs, designed to demonstrate scalable architecture, multi-user synchronization, and modern full-stack engineering practices.

🔗 **Live App**: https://collab-docs-web.vercel.app/  
🔐 Sign In: /signin  
📄 Documents: /docs  

---

## ✨ Features

-  **CRDT-based Real-Time Collaboration**
  - Conflict-free editing using **Yjs**
  - No data loss or overwrites during concurrent edits

-  **Multi-User Presence**
  - Live cursors with user awareness
  - Real-time document updates across all clients

-  **AI-Powered Editor**
  - Summarize content
  - Rewrite text professionally
  - Improve grammar

-  **Auto-Save & Persistence**
  - Continuous background saving
  - Recovery-safe document state

-  **Authentication & Access Control**
  - Secure login via NextAuth
  - Owner / collaborator roles
  - Controlled document permissions

- 🕓 **Version History**
  - Lightweight document version tracking

- 📤 **Export Options**
  - Export documents as:
    - PDF
    - Markdown
    - Plain Text

---

## 🧠 Architecture Overview

### 🔄 Real-Time Sync (CRDT)

- Uses **Yjs** for conflict-free replicated data types
- Each client maintains a shared document state
- Updates are merged deterministically (no conflicts)

---

### ⚡ WebSocket Layer

- Custom **Socket.IO server (Express)**
- Handles:
  - Document sync
  - Awareness (cursor positions)
- Authentication handled via **token in handshake**

---

### 🧩 Monorepo Structure
- Single source of truth for database schema
- Shared Prisma client across services

---

### 🗄️ Data Layer

- **PostgreSQL + Prisma ORM**
- Session storage via Prisma adapter (NextAuth)
- Redis used for **AI rate limiting**

---

### ⚙️ In-Memory Optimization

- Active documents are cached in-memory
- Reduces DB reads during collaboration
- Cleanup logic removes unused documents to prevent memory leaks

---

### 🔐 Authentication Flow

- Uses **NextAuth (JWT strategy)**
- Token passed manually via:
  - HTTP requests
  - WebSocket handshake
- Required due to:
  - Cross-origin frontend (Vercel)
  - Backend hosted separately(render)

---

## 🤖 AI Integration

AI features are implemented via backend routes:

- `/summarize`
- `/rewrite`
- `/grammar-fix`

Includes:
- Rate limiting (Redis)
- Secure API handling
- Optimized response flow

---

## ⚠️ Challenges & Learnings

### 1. Cursor Sync Bug (Yjs Awareness)
- Issue: Cursors not updating correctly across users
- Fix: Deep dive into Yjs awareness protocol
- Learning: Real-time systems fail in subtle ways — docs matter

---

### 2. WebSocket Authentication Across Origins
- Issue: Browser does not send cookies in cross-origin sockets
- Fix: Manual token injection in Socket.IO handshake
- Learning: Auth in WebSockets ≠ Auth in HTTP

---

### 3. Monorepo Deployment Complexity
- Issue: Build & deployment coordination across services
- Fix: Structured build pipeline and shared packages
- Learning: Monorepos require clear ownership boundaries

---

## ⚖️ Trade-offs & Design Decisions

- Chose **Socket.IO over WebRTC**
  - Easier server control and debugging

- Used **in-memory cache**
  - Faster performance
  - Requires cleanup strategy

---

## 🛠️ Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- TipTap Editor

### Backend
- Express.js
- Socket.IO

### Realtime
- Yjs (CRDT engine)

### Database
- PostgreSQL
- Prisma ORM

### Auth
- NextAuth (JWT + Prisma Adapter)

### Infra / Others
- Redis (rate limiting)
- Monorepo architecture

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/AayushSaraswat24/collabDocs/

# Install dependencies
npm install

# Run frontend
cd apps/web
npm run dev

# Run backend
cd apps/server
npm run dev
