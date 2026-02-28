"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import * as Y from "yjs";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { Awareness } from "y-protocols/awareness";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Toolbar from "./toolbar";
import { OptionBar } from "../doc/editorPage/optionBar.";
import { Prop } from "../doc/editorPage/optionBar.";
import { Markdown } from 'tiptap-markdown'

type EditorUser = {
  id: string;
  name: string;
  color: string;
}

type EditorProps = {
  ydoc: Y.Doc;
  awareness: Awareness;
  readOnly: boolean;
  user: EditorUser;
  joinState: Prop;
};

export function Editor({ ydoc, awareness, readOnly, user,joinState }: EditorProps) {

 console.log("tipTap yjs ",ydoc.clientID)
  const provider = { awareness, doc: ydoc };

  const editor = useEditor({

    editable: !readOnly,

    immediatelyRender: false,

    extensions: [

      StarterKit.configure({
        undoRedo: false,
      }),

      Underline,

      Collaboration.configure({
        document: ydoc,
      }),

      Markdown.configure({
        html: false, 
        tightLists: true,
        linkify: true,
        transformPastedText: true,
      }),

      // caret for cursor rendering .
      CollaborationCaret.configure({
        provider,
        user, 
        render(user) {

        const cursor = document.createElement("span")
        cursor.classList.add("collab-cursor")


        const caret = document.createElement("span")
        caret.classList.add("collab-cursor__caret")
        caret.style.borderColor = user.color

        const label = document.createElement("span")
        label.classList.add("collab-cursor__label")
        label.style.backgroundColor = user.color
        label.textContent = user.name

        cursor.appendChild(label)
        cursor.appendChild(caret)

        return cursor
      },

      }),

      Placeholder.configure({
        placeholder: "Start typing here...",
      }),

    ],

  });

return (
  <div className="flex flex-col flex-1 min-h-0">

  <OptionBar joinState={joinState} editor={editor} />
  
      <div className="flex-1 min-h-0 flex flex-col py-6 px-4 gap-0">
        <div 
         className=" flex-1 min-h-0 mx-auto w-full max-w-4xl bg-white dark:bg-neutral-900
          border border-neutral-200 dark:border-neutral-800 rounded-xl
          shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)]
          dark:shadow-[0_1px_3px_rgba(0,0,0,0.2),0_8px_32px_rgba(0,0,0,0.3)] flex flex-col
          overflow-hidden transition-colors duration-200 ">

    <div className="flex flex-col h-full min-h-0">
      <Toolbar editor={editor} />
      
      <div className="flex-1 overflow-y-auto min-h-0 editor-scroll bg-neutral-50 dark:bg-neutral-950">

        <div className="min-h-full">
          <EditorContent className="m-0 p-0" editor={editor} />
        </div>
      </div>
    </div>

    </div>
  </div>
 </div>

)

}