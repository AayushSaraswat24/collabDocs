"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

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

export function useDocumentJoin(
  documentId: string,
  enabled: boolean
) {
  const [state, setState] = useState<JoinState>({ status: "idle" });

  useEffect(() => {
    if (!enabled) return;
    if (!documentId) {
      setState({ status: "error", error: "DOCUMENT_ID_REQUIRED" });
      return;
    }

    setState({ status: "joining" });

    socket.emit("document:join", { documentId }, (res: any) => {
      if (!res?.ok) {
        setState({
          status: "error",
          error: res?.error ?? "JOIN_FAILED",
        });
        return;
      }

      setState({
        status: "ready",
        documentId: res.documentId,
        role: res.role,
        isOwner: res.isOwner,
        content:new Uint8Array(res.content),
        docName: res.name,
      });
    });
  }, [documentId, enabled]);

  return state;
}
