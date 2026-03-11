'use client'

import { Crown, Shield,  } from 'lucide-react'
import {Editor} from "@tiptap/react"
import { ExportDropDown } from './exportDropDown';
import { ColloboratorsList } from './colloboratorsList';
import DocumentVersionSheet from './versionSheet';
import * as Y from "yjs";

export interface Prop {
  status: "ready";
  documentId: string;
  role: "READ" | "WRITE";
  isOwner: boolean;
  docName: string;
}

interface OptionBarProps {
  joinState: Prop;
  editor: Editor | null;
  ydoc: Y.Doc;
}

export function OptionBar({ joinState,editor,ydoc }: OptionBarProps) {

  if(!editor) return ;

  return (
    <header 
     className="flex items-center justify-between h-14 px-2 sm:px-5 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 shrink-0 overflow-x-auto">

      <div className="flex items-center gap-2 shrink-0">

          <DocumentVersionSheet joinState={joinState} ydoc={ydoc} isWrite={joinState.role === "WRITE"}  />
        
      </div>

      <div className="hidden sm:flex flex-col items-center gap-0.5 min-w-0 flex-1 px-2">
        <h1 className="
          text-sm font-semibold
          text-neutral-800 dark:text-neutral-100
          truncate max-w-35 sm:max-w-55 md:max-w-[320px]
          tracking-tight
          font-['DM_Sans',sans-serif]
        ">
          {joinState.docName}
        </h1>

        <div className="hidden sm:flex items-center gap-1.5">
          {joinState.isOwner ? (
            <span className="
              flex items-center gap-1
              px-1.5 py-0.5 text-[9px] font-semibold
              rounded uppercase tracking-widest
              bg-amber-50 text-amber-600 border border-amber-200
              dark:bg-amber-950/30 dark:text-amber-500 dark:border-amber-900
            ">
              <Crown size={8} />
              Owner
            </span>
          ) : (
            <span className="
              flex items-center gap-1
              px-1.5 py-0.5 text-[9px] font-semibold
              rounded uppercase tracking-widest
              bg-neutral-100 text-neutral-400 border border-neutral-200
              dark:bg-neutral-800 dark:text-neutral-500 dark:border-neutral-700
            ">
              <Shield size={8} />
              {joinState.role === 'WRITE' ? 'Editor' : 'Viewer'}
            </span>
          )}

          {joinState.role === 'READ' && (
            <span className="
              px-1.5 py-0.5 text-[9px] font-semibold
              rounded uppercase tracking-widest
              bg-neutral-100 text-neutral-400 border border-neutral-200
              dark:bg-neutral-800 dark:text-neutral-500 dark:border-neutral-700
            ">
              Read only
            </span>
          )}
        </div>
      </div>


      <div className="flex items-center gap-2 shrink-0">

          <ColloboratorsList  owner={joinState.isOwner} documentId={joinState.documentId}/>
    
          <ExportDropDown editor={editor} fileName={joinState.docName} />  
               
      </div>

    </header>
  )
}