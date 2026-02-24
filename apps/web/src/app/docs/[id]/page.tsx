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
import { OptionBar } from "@/components/doc/editorPage/optionBar.";

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
    
   <div className="flex flex-col flex-1 min-h-0 gap-4 bg-neutral-100 dark:bg-neutral-950 transition-colors duration-200">
  <OptionBar joinState={joinState} />

  <main className="flex-1 min-h-0 mx-auto w-full max-w-6xl px-4 pb-4">
    <div className="h-full overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col transition-colors duration-200">
      {session?.user && (
        <Editor
          ydoc={ydoc}
          awareness={awareness}
          readOnly={joinState.role === "READ"}
          user={user}
        />
      )}
    </div>
  </main>
</div>

);

}
 // make the editor scrollable instead of make it grow .