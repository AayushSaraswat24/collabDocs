'use client'

import { useState, useEffect } from 'react'
import { Editor } from '@tiptap/react'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Heading1, Heading2, Heading3,
  Code2, Quote, Minus, Undo2, Redo2, Eraser,
} from 'lucide-react'
import { Btn } from './toolbarHelper'
import { Sep } from './toolbarHelper'
import { Group } from './toolbarHelper'
import { handleAI } from '@/lib/editor/toolbarHelper'

type Props = { editor: Editor | null }

function useEditorActive(editor: Editor | null) {
  const [, forceUpdate] = useState(0)
// listening for cursor or conent change in tipTap so we can Re-render the toolbar using useState.
  useEffect(() => {

    if (!editor) return
    const update = () => forceUpdate(n => n + 1)
    
    editor.on('transaction', update)
    editor.on('selectionUpdate', update)
    editor.on('blur', update)

    return () => {
      editor.off('transaction', update)
      editor.off('selectionUpdate', update)
      editor.off('blur', update)
    }
  }, [editor])

  if (!editor) return {
    isBold: false, isItalic: false, isUnderline: false, isStrike: false,
    isH1: false, isH2: false, isH3: false,
    isBullet: false, isOrdered: false, isBlockquote: false, isCodeBlock: false,
  }

  return {
    isBold: editor.isActive('bold'),
    isItalic: editor.isActive('italic'),
    isUnderline: editor.isActive('underline'),
    isStrike: editor.isActive('strike'),
    isH1: editor.isActive('heading', { level: 1 }),
    isH2: editor.isActive('heading', { level: 2 }),
    isH3: editor.isActive('heading', { level: 3 }),
    isBullet: editor.isActive('bulletList'),
    isOrdered: editor.isActive('orderedList'),
    isBlockquote: editor.isActive('blockquote'),
    isCodeBlock: editor.isActive('codeBlock'),
  }
}


export default function Toolbar({ editor }: Props) {

   const editorState = useEditorActive(editor)
   const [aiAction, setAiAction] = useState<null | "rewrite" | "grammar" | "summary">(null)

   if (!editor) return null
  if (!editor.isEditable) return null ;
  // gonna work fine as im reRendering this component on select or other changes on editor.
  const hasSelection = editor.state.selection.from !== editor.state.selection.to
  
  const aiBtn =
  ` px-2 py-1 text-xs rounded transition-colors cursor-pointer text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent `

  const s = 14

  return (
    <div 
      className="
      flex items-center gap-1
      overflow-x-auto
      whitespace-nowrap
      px-4 py-2
      bg-white dark:bg-neutral-900
      border-b border-neutral-100 dark:border-neutral-800
      sticky top-0 z-40
    ">
      <Group>
        <Btn onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo2 size={s} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo2 size={s} />
        </Btn>
      </Group>

      <Sep />

      <Group>
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editorState.isBold} title="Bold">
          <Bold size={s} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editorState.isItalic} title="Italic">
          <Italic size={s} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editorState.isUnderline} title="Underline">
          <UnderlineIcon size={s} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editorState.isStrike} title="Strikethrough">
          <Strikethrough size={s} />
        </Btn>
      </Group>

      <Sep />

      <Group>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editorState.isH1} title="Heading 1">
          <Heading1 size={s} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editorState.isH2} title="Heading 2">
          <Heading2 size={s} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editorState.isH3} title="Heading 3">
          <Heading3 size={s} />
        </Btn>
      </Group>

      <Sep />

      <Group>
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editorState.isBullet} title="Bullet List">
          <List size={s} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editorState.isOrdered} title="Numbered List">
          <ListOrdered size={s} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editorState.isBlockquote} title="Quote">
          <Quote size={s} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editorState.isCodeBlock} title="Code Block">
          <Code2 size={s} />
        </Btn>
      </Group>

      <Sep />

      <Group>
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
          <Minus size={s} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear formatting">
          <Eraser size={s} />
        </Btn>
      </Group>

      <Sep />

      <div className="items-center gap-0.5 flex">
        
        <button
          disabled={!hasSelection || aiAction !== null}
          onClick={() =>
            handleAI("/api/ai/rewrite", editor, () => setAiAction("rewrite"), () => setAiAction(null))
          }
          className={aiBtn}
        >
          {aiAction === "rewrite" ? "AI working..." : "Rewrite"}
        </button>

        <button
          disabled={!hasSelection || aiAction !== null}
          onClick={() =>
            handleAI("/api/ai/grammar", editor, () => setAiAction("grammar"), () => setAiAction(null))
          }
          className={aiBtn}
        >
          {aiAction === "grammar" ? "AI working..." : "Grammar"}
        </button>

        <button
          disabled={!hasSelection || aiAction !== null}
          onClick={() =>
            handleAI("/api/ai/summary", editor, () => setAiAction("summary"), () => setAiAction(null))
          }
          className={aiBtn}
        >
          {aiAction === "summary" ? "AI working..." : "Summary"}
        </button>

      </div>

    </div>
  )
}
