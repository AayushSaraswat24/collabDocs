"use client";

import { useParams } from "next/navigation";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { useDocumentJoin } from "@/hooks/useDocumentJoin";
import { useYjsSocketSync } from "@/hooks/useYjsSocketSync";
import * as Y from "yjs";
import { useMemo, useEffect, useState } from "react";
import { Editor } from "@/components/editor/editor";
import { Awareness } from "y-protocols/awareness";
import { getRandomColor } from "@/utils/randomCursorColor";
import { useSession } from "next-auth/react";

export default function DocPage() {
  const { id } = useParams();
  const socketStatus = useSocketConnection();
  const {data:session}=useSession();

  const [ydoc, setYdoc] = useState(() => new Y.Doc());
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

useYjsSocketSync(ready ? joinState.documentId : "", ydoc,setYdoc ,awareness);

  useEffect(() => {
    return () => {
      ydoc.destroy();
      awareness.destroy();
    };
  }, [ydoc,awareness]);


if (socketStatus === "connecting") {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <div className="w-6 h-6 rounded-full border-2 border-zinc-300 border-t-zinc-700 animate-spin" />
      <p className="text-sm text-zinc-500 tracking-wide">Connecting to server...</p>
    </div>
  );
}

if (socketStatus === "error") {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-500 text-lg">✕</div>
      <p className="text-sm font-medium text-red-500">Server unreachable</p>
      <p className="text-xs text-zinc-400">Check your connection and try again</p>
    </div>
  );
}

if (socketStatus === "disconnected") {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 text-zinc-400 text-lg">⊘</div>
      <p className="text-sm font-medium text-zinc-500">Connection closed</p>
    </div>
  );
}

if (joinState.status === "joining") {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <div className="w-6 h-6 rounded-full border-2 border-zinc-300 border-t-zinc-700 animate-spin" />
      <p className="text-sm text-zinc-500 tracking-wide">Joining document...</p>
    </div>
  );
}

if (joinState.status === "error") {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-500 text-lg">✕</div>
      <p className="text-sm font-medium text-red-500">Failed to join document</p>
      <p className="text-xs text-zinc-400 max-w-xs text-center">{joinState.error}</p>
    </div>
  );
}

if (joinState.status !== "ready") return null;

return (
  <div className="flex flex-col flex-1 min-h-0 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">

        {session?.user && (
          <Editor
            key={ydoc.clientID} // re-mount editor on ydoc change to prevent desync
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

 // make other function work special feature for owner , document versioning . need to make a function that will listen for other event and show them by toast . check where you have used the env variable and if that accessible without next_public prefix . make the ui responsive .

 // tasks --
 // 1. add versioning -- all write user can save and revert version .
 // 2. add listener for remaining emits from server to show toast .
 // 3. check env variable usage and prefix with NEXT_PUBLIC_ on next js app .

// added the version fetch and saving feature . we don't need any explicit delete option as we auto delete version on creation when it exceed 10 versions . think about whether on rollback i delete the present version like the one on which im rolling back is that allright or not . then i have implemented a listener to rollback listen so we just need to provide a button based on role to click on revert and then check if that works well . 