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

  // awareness to track all user cursor . heartbeat style algo .
  const awareness = useMemo(() => new Awareness(ydoc), [ydoc]);
  const cursorColor = useMemo(()=> getRandomColor(),[]);

  const user = useMemo(() => ({
    id: session?.user?.id ?? "",
    name: session?.user?.name ?? "Anonymous",
    color: cursorColor,
  }), [session?.user?.id, session?.user?.name, cursorColor])


  useEffect(() => {
    if (joinState.status !== "ready") return;

    if (!joinState.content) return;
    
    if(socketStatus !== "connected") return ;

    const update = joinState.content;
    console.log("initial content update triggered ")
    if (update.length > 0) {
      Y.applyUpdate(ydoc, update,"remote");
    }
  }, [joinState.status]);



  useYjsSocketSync( joinState.status === "ready" ? joinState.documentId : "", ydoc, awareness,user);

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
      {session?.user && (
        <Editor
          ydoc={ydoc}
          awareness={awareness}
          readOnly={joinState.role === "READ"}
          user={user}
        />
      )}
    </div>
  );

}

// build ui for tipTap and no user cursor is rendered need to check that too . i have set in my buffer to keep track of user connected which will cause unexpected error if same user open 2 browser bcz only one socketId / userId registered there for 2 tab of single user and if one disconnect it will delete and my set will have none so it might cause some unexpected behavior or issue . so upon disconnect the awareness of user got auto remove after 30 second bcz of heartbeat style . but before that handle the set of user issue in buffer of doc .