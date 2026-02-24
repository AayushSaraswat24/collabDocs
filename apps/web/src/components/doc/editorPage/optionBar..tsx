interface prop {
      status: "ready";
      documentId: string;
      role: "READ" | "WRITE";
      isOwner: boolean;
      content: Uint8Array;
      docName: string;
}

export function OptionBar({joinState}: {joinState: prop}) {

    return (
         <header className="grid grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 py-3 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        
            {/* Left */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-32 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-dashed border-neutral-300 dark:border-neutral-700 opacity-40" />
            </div>
        
            {/* Center */}
            <div className="flex flex-col items-center gap-1 min-w-0">
              <h1 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate max-w-56 tracking-tight">
                {joinState.docName}
              </h1>
        
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded border uppercase tracking-wider
                  ${
                    joinState.role === "WRITE"
                      ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800"
                      : "bg-neutral-100 text-neutral-500 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"
                  }`}
                >
                  {joinState.role}
                </span>
        
                {joinState.isOwner && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded border uppercase tracking-wider bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800">
                    Owner
                  </span>
                )}
              </div>
            </div>
        
            {/* Right */}
            <div className="flex justify-end">
              <div className="h-8 w-32 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-dashed border-neutral-300 dark:border-neutral-700 opacity-40" />
            </div>
          </header>
        
    )
}