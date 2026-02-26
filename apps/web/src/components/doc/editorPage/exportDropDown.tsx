"use client"

import {Editor} from "@tiptap/react"
import { DropdownMenu, DropdownMenuTrigger,DropdownMenuContent, DropdownMenuItem,} from "@/components/ui/dropdown-menu"

import { exportAsMarkdown, exportAsPlainText } from "@/lib/export/export";
import { exportPDF } from "@/lib/exportClient";

export function ExportDropDown({ editor, fileName }: { editor: Editor | null; fileName: string }) {

    if(!editor) return null;

    return (
       
        <DropdownMenu>
            <DropdownMenuTrigger asChild>

            <button className="cursor-pointer flex items-center gap-1 px-3 py-1.5
            text-xs font-medium tracking-wide
            text-neutral-400 dark:text-neutral-600
            border border-dashed border-neutral-200 dark:border-neutral-700
            rounded-lg 
            hover:border-neutral-300 hover:text-neutral-600
            dark:hover:border-neutral-600 dark:hover:text-neutral-400
            transition-all duration-150
            font-['DM_Sans',sans-serif]">
                Export
            </button>
            
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="mt-2 ">
            <DropdownMenuItem className="cursor-pointer"
                onClick={() => { exportPDF(fileName) }}
            >
                PDF
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer"
                onClick={() => exportAsPlainText(editor,fileName)}
            >
              PlainText
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer"
                onClick={() => exportAsMarkdown(editor,fileName)}
            >
              Markdown
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )

}
