import * as Y from "yjs"
import { prisma } from "@collabdoc/db"

const DEBOUNCE_MS = 2000
const FORCE_SAVE_MS = 20_000

type PersistenceState = {
  debounceTimer: NodeJS.Timeout | null
  lastSavedAt: number
}

const persistenceMap = new Map<string, PersistenceState>()

export function attachPersistence(documentId: string, ydoc: Y.Doc) {
  if (persistenceMap.has(documentId)) return

  const state: PersistenceState = {
    debounceTimer: null,
    lastSavedAt: Date.now(),
  }

  persistenceMap.set(documentId, state)

  ydoc.on("update", () => {
    scheduleSave(documentId, ydoc)
  })
}

function scheduleSave(documentId: string, ydoc: Y.Doc) {
  const state = persistenceMap.get(documentId)
  if (!state) return

  const now = Date.now()

  if (state.debounceTimer) {
    clearTimeout(state.debounceTimer)
  }

  state.debounceTimer = setTimeout(() => {
    flush(documentId, ydoc)
  }, DEBOUNCE_MS)

  if (now - state.lastSavedAt >= FORCE_SAVE_MS) {
    flush(documentId, ydoc)
  }
}

async function flush(documentId: string, ydoc: Y.Doc) {
  const state = persistenceMap.get(documentId)
  if (!state) return

  try {
    const snapshot = Y.encodeStateAsUpdate(ydoc)

    const buffer= Buffer.from(snapshot)

    await prisma.document.update({
      where: { id: documentId },
      data: { content: buffer },
    })

    state.lastSavedAt = Date.now()
  } catch (err) {
    console.error("Failed to persist document:", err)
  }
}

export async function flushAndDestroy(documentId: string, ydoc: Y.Doc) {
  await flush(documentId, ydoc)

  const state = persistenceMap.get(documentId)
  if (state?.debounceTimer) {
    clearTimeout(state.debounceTimer)
  }

  persistenceMap.delete(documentId)
  ydoc.destroy()
}
