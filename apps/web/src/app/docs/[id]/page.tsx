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

  const ydoc = useMemo(() => new Y.Doc(), []);
  // awareness to track all user cursor . heartbeat style algo .
  const awareness = useMemo(() => new Awareness(ydoc), [ydoc]);
  const cursorColor = useMemo(()=> getRandomColor(),[]);

  const joinState = useDocumentJoin(
    id as string,
    socketStatus === "connected",
    ydoc
  );

  const user = useMemo(() => ({
    id: session?.user?.id ?? "",
    name: session?.user?.name ?? "Anonymous",
    color: cursorColor,
  }), [session?.user?.id, session?.user?.name, cursorColor])

  useEffect(() => {
  if (!user?.id) return;

  awareness.setLocalState({
    user
  });
}, [user]);

const ready = joinState.status === "ready" && !!user.id;

useYjsSocketSync(ready ? joinState.documentId : "", ydoc, awareness);

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
  <div className="flex flex-col flex-1 min-h-0 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">

        {session?.user && (
          <Editor
            ydoc={ydoc}
            awareness={awareness}
            readOnly={joinState.role === "READ"}
            user={user}
            joinState={joinState}
          />
        )}

  </div>
)

}
 // make other function work special feature for owner , document versioning . reduce editor next line gap while press enter .add leave document option for non owner  . need to make a function that will listen for other event and show them by toast . check where you have used the env variable and if that accessible without next_public prefix . update join error like it will keep showing reconnecting even if server return this document doesn't exists . add leave logic for non owner and update the colloboration list ui upon successfully kicking user but that gonna work for only owner .