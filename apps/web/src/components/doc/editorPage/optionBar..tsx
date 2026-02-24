'use client'

import { Users, ChevronDown, Cpu, History, Crown, Shield, Download } from 'lucide-react'
import { exportPDF } from '@/lib/exportClient'

interface Prop {
  status: "ready";
  documentId: string;
  role: "READ" | "WRITE";
  isOwner: boolean;
  content: Uint8Array;
  docName: string;
}

export function OptionBar({ joinState }: { joinState: Prop }) {

  function handleExportPDF() {
    exportPDF(joinState.docName)
  }
 // on the basis on data-optionbar attribute 
  return (
    <header data-optionbar 
     className="
      flex items-center justify-between
      px-5 py-0
      h-14
      bg-white dark:bg-neutral-900
      border-b border-neutral-100 dark:border-neutral-800
      shrink-0
    ">

      {/* ── Left: future actions placeholder ── */}
      <div className="flex items-center gap-2 w-64">
        {/* AI Button — future */}
        <button className="
          flex items-center gap-1.5 px-3 py-1.5
          text-xs font-medium tracking-wide
          text-neutral-400 dark:text-neutral-600
          border border-dashed border-neutral-200 dark:border-neutral-700
          rounded-lg
          hover:border-neutral-300 hover:text-neutral-600
          dark:hover:border-neutral-600 dark:hover:text-neutral-400
          transition-all duration-150
          font-['DM_Sans',sans-serif]
        ">
          <Cpu size={12} />
          AI
        </button>

        {/* Version History — future */}
        <button className="
          flex items-center gap-1.5 px-3 py-1.5
          text-xs font-medium tracking-wide
          text-neutral-400 dark:text-neutral-600
          border border-dashed border-neutral-200 dark:border-neutral-700
          rounded-lg
          hover:border-neutral-300 hover:text-neutral-600
          dark:hover:border-neutral-600 dark:hover:text-neutral-400
          transition-all duration-150
          font-['DM_Sans',sans-serif]
        ">
          <History size={12} />
          History
        </button>
      </div>

      {/* ── Center: doc name + badges ── */}
      <div className="flex flex-col items-center gap-0.5 min-w-0 flex-1">
        <h1 className="
          text-sm font-semibold
          text-neutral-800 dark:text-neutral-100
          truncate max-w-64
          tracking-tight
          font-['DM_Sans',sans-serif]
        ">
          {joinState.docName}
        </h1>

        <div className="flex items-center gap-1.5">
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

      {/* ── Right: collaborators + menu ── */}
      <div className="flex items-center gap-2 justify-end w-64">

        {/* Active users — future */}
        <button className="
          flex items-center gap-1.5 px-3 py-1.5
          text-xs font-medium tracking-wide
          text-neutral-400 dark:text-neutral-600
          border border-dashed border-neutral-200 dark:border-neutral-700
          rounded-lg
          hover:border-neutral-300 hover:text-neutral-600
          dark:hover:border-neutral-600 dark:hover:text-neutral-400
          transition-all duration-150
          font-['DM_Sans',sans-serif]
        ">
          <Users size={12} />
          Collaborators
        </button>

        {/* Owner actions dropdown — future */}
        {joinState.isOwner && (
          <button className="
            flex items-center gap-1 px-3 py-1.5
            text-xs font-medium tracking-wide
            text-neutral-400 dark:text-neutral-600
            border border-dashed border-neutral-200 dark:border-neutral-700
            rounded-lg
            hover:border-neutral-300 hover:text-neutral-600
            dark:hover:border-neutral-600 dark:hover:text-neutral-400
            transition-all duration-150
            font-['DM_Sans',sans-serif]
          ">
            Manage
            <ChevronDown size={10} />
          </button>
        )}

        <button
          onClick={handleExportPDF}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium tracking-wide  bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-all duration-150"
        >
          <Download size={12} />
          Export PDF
        </button>

      </div>

    </header>
  )
}