"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import * as Y from "yjs";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { Awareness } from "y-protocols/awareness";
import { useEffect } from "react";
import Placeholder from "@tiptap/extension-placeholder";

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

  // no useMemo needed — ydoc and awareness are stable refs from parent
  // useEditor only reads this once on mount anyway
  const provider = { awareness, doc: ydoc };

  const editor = useEditor({
    editable: !readOnly,
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        undoRedo: false,
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCaret.configure({
        provider,
        user, 
         render(user) {
    const cursor = document.createElement("span")
    cursor.classList.add("collab-cursor")

    // the blinking caret line
    const caret = document.createElement("span")
    caret.classList.add("collab-cursor__caret")
    caret.style.borderColor = user.color

    // the name label above
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


  useEffect(() => {
    if (!user.name || !user.id) return;
    awareness.setLocalStateField("user", {
      id: user.id,
      name: user.name,
      color: user.color,
    });
  }, [user.id, user.name, user.color, awareness]);


  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!readOnly);
  }, [readOnly, editor]);

  return <EditorContent editor={editor} />;
}