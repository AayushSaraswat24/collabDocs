"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import * as Y from "yjs";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { Awareness } from "y-protocols/awareness";
import { useMemo } from "react";
import Placeholder from "@tiptap/extension-placeholder";

type EditorProps = {
  ydoc: Y.Doc;
  // awareness: Awareness;
  readOnly: boolean;
};

export function Editor({ ydoc, readOnly }: EditorProps) {

//  const provider = useMemo(() => {
//     return {
//       awareness,
//       doc: ydoc,
//     };
//   }, [awareness, ydoc]);

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

      // CollaborationCaret.configure({
      //   provider, // just pass awareness
      // }),

      Placeholder.configure({
        placeholder: "Start typing here...",
      }),

    ],
  });


  return <EditorContent editor={editor} />;
  
}
