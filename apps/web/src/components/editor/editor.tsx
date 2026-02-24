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
};

export function Editor({ ydoc, awareness, readOnly, user }: EditorProps) {

 
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
  <div className="flex flex-col h-full min-h-0">
    <Toolbar editor={editor} />

    {/* Scrollable writing area */}
    <div className="flex-1 overflow-y-auto min-h-0 editor-scroll bg-neutral-50 dark:bg-neutral-950">
      {/* Paper-like writing surface */}
      <div className="min-h-full">
        <EditorContent className="m-0 p-0" editor={editor} />
      </div>
    </div>
  </div>
)

}