import * as Y from "yjs"
import { prisma } from "@collabdoc/db"

const DEBOUNCE_MS = 3000
const FORCE_SAVE_MS = 20000

type DocumentState = {
  ydoc: Y.Doc
  debounceTimer: NodeJS.Timeout | null
  lastSavedAt: number
  activeUsers: Map<string,string>
  updateHandler: () => void
  isFlushing: boolean
}

const documents = new Map<string, DocumentState>()

// LOAD OR CREATE

export async function loadDocument(documentId: string) {
  if (documents.has(documentId)) {
    return documents.get(documentId)!
  }

  const dbDoc = await prisma.document.findUnique({
    where: { id: documentId }
  })

  if (!dbDoc) throw new Error("DOCUMENT_NOT_FOUND")

  const ydoc = new Y.Doc()

  if (dbDoc.content) {
    Y.applyUpdate(ydoc, dbDoc.content)
  }

  const updateHandler = () => scheduleSave(documentId)

  ydoc.on("update", updateHandler)

  const state: DocumentState = {
    ydoc,
    debounceTimer: null,
    lastSavedAt: Date.now(),
    activeUsers: new Map<string,string>(),
    updateHandler,
    isFlushing: false
  }

  documents.set(documentId, state)

  return state
}


// APPLY UPDATE

export function applyYjsUpdate(documentId: string, update: Uint8Array) {
  const doc = documents.get(documentId)
  if (!doc) return false
  Y.applyUpdate(doc.ydoc, update)
  return true
}


// USERS

export function addUser(documentId: string, userId: string,socketId:string) {
  const doc = documents.get(documentId)
  if (!doc) return

  doc.activeUsers.set(socketId,userId)

}
// user leave . remove socket as same id can be open in multiple tabs.
export async function removeUser(documentId: string, socketId:string) {
  const doc = documents.get(documentId)
  if (!doc) return

  doc.activeUsers.delete(socketId)

  if (doc.activeUsers.size === 0) {
   await destroyDocument(documentId)
  }
}

// if user get kicked remove its all sockets connection from this doc.
export function removeUserByUserId(documentId: string, userId: string){
  const doc=documents.get(documentId);
  if(!doc) return ;

  for (const [socketId, uid] of doc.activeUsers.entries()) {
    if (uid === userId) {
      doc.activeUsers.delete(socketId)
    }
}
}

export function getActiveUsers(documentId: string) {
  const doc=documents.get(documentId)
  if(!doc) return new Set();

  return new Set(doc.activeUsers.values());
}

export function getYDoc(documentId: string) {
  return documents.get(documentId)?.ydoc
}


// PERSISTENCE

function scheduleSave(documentId: string) {
  const doc = documents.get(documentId)
  if (!doc) return

  if (doc.debounceTimer) clearTimeout(doc.debounceTimer)

  doc.debounceTimer = setTimeout(() => {
    flush(documentId)
  }, DEBOUNCE_MS)

  if (Date.now() - doc.lastSavedAt > FORCE_SAVE_MS ) {
    flush(documentId)
  }
}

export async function flush(documentId: string) {
  const doc = documents.get(documentId)
  if (!doc || doc.isFlushing) return

  doc.isFlushing=true;

  const update = Y.encodeStateAsUpdate(doc.ydoc)
try{

  await prisma.document.update({
    where: { id: documentId },
    data: { content: Buffer.from(update) }
  })
  console.log(`Update save for docId ${documentId}`)
  doc.lastSavedAt = Date.now()
  
}catch(error:any){
  console.error(`Failed to save document ${documentId}:`, error)

  if (error.code === "P1017") {
      console.log("Retrying flush after connection closed...")

      try {
        await prisma.document.update({
          where: { id: documentId },
          data: { content: Buffer.from(update) }
        })
        console.log("Retry successful")
      } catch (retryError) {
        console.error("Retry also failed:", retryError)
      }
    }

}
finally{
  doc.isFlushing = false
}

}


// REVERT

export async function revertDocument(
  documentId: string,
  versionContent: Uint8Array
) {
  const existing = documents.get(documentId)

  const existingUsers = existing?.activeUsers ?? new Map<string,string>()

  if (existing) {
    if (existing.debounceTimer) clearTimeout(existing.debounceTimer)

  
    existing.ydoc.off("update", existing.updateHandler)

    existing.ydoc.destroy()
  }

  const newDoc = new Y.Doc()
  Y.applyUpdate(newDoc, versionContent)

  const updateHandler = () => scheduleSave(documentId)
  newDoc.on("update", updateHandler)

  const newState: DocumentState = {
    ydoc: newDoc,
    debounceTimer: null,
    lastSavedAt: Date.now(),
    activeUsers: existingUsers,
    updateHandler,
    isFlushing: false
  }

  documents.set(documentId, newState)

  await flush(documentId)

  return newDoc
}

// DESTROY

export async function destroyDocument(documentId: string) {
  const doc = documents.get(documentId)
  if (!doc) return

  await flush(documentId)

  if (doc.debounceTimer) clearTimeout(doc.debounceTimer)


  doc.ydoc.off("update", doc.updateHandler)

  doc.ydoc.destroy()

  documents.delete(documentId)
}
