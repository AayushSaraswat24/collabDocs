"use client";

import { useParams } from "next/navigation";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { useDocumentJoin } from "@/hooks/useDocumentJoin";
import { useYjsSocketSync } from "@/hooks/useYjsSocketSync";
import * as Y from "yjs";
import { useMemo, useEffect } from "react";
import { Editor } from "@/components/editor/editor";
import { Awareness } from "y-protocols/awareness";
import { getRandomColor } from "@/utils/randomCursorColor";
import { useSession } from "next-auth/react";

export default function DocPage() {
  const { id } = useParams();
  const socketStatus = useSocketConnection();
  const {data:session}=useSession();

  const joinState = useDocumentJoin(
    id as string,
    socketStatus === "connected"
  );

  const ydoc = useMemo(() => new Y.Doc(), []);

    // awareness is yjs function to track all the users cursor position and by passing it to tiptap it render cursor . we pass awareness to tipTap for rendering and updating user cursor position and attach listener to awareness to send updates to server and also listen them to apply to show other user cursor positon .

  const awareness = useMemo(() => new Awareness(ydoc), [ydoc]);

  useEffect(() => {
  if (!session?.user) return;

  awareness.setLocalStateField("user", {
    id: session.user.id,
    name: session.user.name,
    color: getRandomColor(),
  });
}, [session?.user?.id, session?.user?.name]);


  useEffect(() => {
    if(joinState.status === "ready"){
      Y.applyUpdate(ydoc, joinState.content);

    }
  }, [joinState, ydoc]);


  useYjsSocketSync( joinState.status === "ready" ? joinState.documentId : "", ydoc, awareness);

  useEffect(() => {
    return () => {
      ydoc.destroy();
      awareness.destroy();
    };
  }, [ydoc,awareness]);


  if (socketStatus === "connecting") {
    return <div>Connecting to server...</div>;
  }

  if (socketStatus === "error") {
    return <div>Server unreachable.</div>;
  }

  if (socketStatus === "disconnected") {
    return <div>Reconnecting...</div>;
  }

  if (joinState.status === "joining") {
    return <div>Joining document...</div>;
  }

  if (joinState.status === "error") {
    return <div>Error: {joinState.error}</div>;
  }

  if (joinState.status !== "ready") return null;

  return (
    <div className="flex flex-col flex-1">
      <h1>{joinState.docName}</h1>
      <p>
        Role: {joinState.role} {joinState.isOwner && "(Owner)"}
      </p>

      <Editor
        ydoc={ydoc}
        awareness={awareness}
        readOnly={joinState.role === "READ"}
      />
    </div>
  );

}

// figure out the undefined doc runtime error .