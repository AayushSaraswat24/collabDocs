"use client";

import { useParams } from "next/navigation";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { useDocumentJoin } from "@/hooks/useDocumentJoin";

export default function DocPage() {
  const { id } = useParams();
  const socketStatus = useSocketConnection();

  const joinState = useDocumentJoin(
    id as string,
    socketStatus === "connected"
  );


  if (socketStatus === "connecting") {
    return <div>Connecting to server...</div>;
  }

  if (socketStatus === "error") {
    return <div>Server unreachable. Please try again.</div>;
  }

  if (socketStatus === "disconnected") {
    return <div>Disconnected. Reconnecting...</div>;
  }

  
  if (joinState.status === "joining") {
    return <div>Joining document...</div>;
  }

  if (joinState.status === "error") {
    return <div>Error: {joinState.error}</div>;
  }


  if (joinState.status === "ready") {
    return (
      <div>
        <h1>{joinState.docName}</h1>
        <p>
          Role: {joinState.role} {joinState.isOwner && "(Owner)"}
        </p>
        <pre>{joinState.content}</pre>
      </div>
    );
  }

  return null;
}

// yjs and tipTap text editior . i think socket server is ok now need to check the next js routes .

