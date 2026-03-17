"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import * as Y from "yjs";

type JoinState =
  | { status: "idle" }
  | { status: "joining" }
  | {
      status: "ready";
      documentId: string;
      role: "READ" | "WRITE";
      isOwner: boolean;
      content: Uint8Array;
      docName: string;
    }
  | { status: "error"; error: string };

export function UseDocumentJoin(
  documentId: string,
  enabled: boolean,
  ydoc: Y.Doc
) {
  const [state, setState] = useState<JoinState>({ status: "idle" });

  useEffect(() => {
    if (!enabled) return;
    
    if (!documentId) {
      setState({ status: "error", error: "DOCUMENT_ID_REQUIRED" });
      return;
    }

   
    setState({ status: "joining" });

    socket.emit(
        "document:join",
        { documentId, clientId: ydoc.clientID },
        (res: any) => {
          if (!res?.ok) {
            setState({
              status: "error",
              error: res?.error ?? "JOIN_FAILED",
            });
            return;
          }

          Y.applyUpdate(ydoc, new Uint8Array(res.content), "remote");

          setState({
            status: "ready",
            documentId: res.documentId,
            role: res.role,
            isOwner: res.isOwner,
            content: new Uint8Array(res.content),
            docName: res.name,
          });
        }
      );
    
    
  }, [documentId, enabled,ydoc]);

  return state;
}
