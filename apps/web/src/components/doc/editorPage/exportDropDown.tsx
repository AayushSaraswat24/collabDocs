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
            <button className="cursor-pointer">
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
