'use client'

import { useState, useEffect } from 'react'
import { Editor } from '@tiptap/react'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Heading1, Heading2, Heading3,
  Code2, Quote, Minus, Undo2, Redo2, Eraser,
} from 'lucide-react'

type Props = { editor: Editor | null }

function Btn({onClick, active, title, children, disabled,}: {onClick: () => void ,
  active?: boolean , title: string , children: React.ReactNode,disabled?: boolean}) {
  return (
    <button type="button" onClick={onClick} title={title} aria-pressed={active} disabled={disabled}
      className={`
        w-8 h-8 flex items-center justify-center rounded-md transition-all duration-100 outline-none
        font-['DM_Sans',sans-serif] disabled:opacity-30 disabled:cursor-not-allowed
        ${active
          ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
          : `text-neutral-400 dark:text-neutral-500
             hover:bg-neutral-100 dark:hover:bg-neutral-800
             hover:text-neutral-800 dark:hover:text-neutral-200`
        }
      `}
    >
      {children}
    </button>
  )
}

function Sep() {
  return <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700 mx-0.5 shrink-0" />
}

function Group({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>
}

function useEditorActive(editor: Editor | null) {
  const [, forceUpdate] = useState(0)
// listening for cursor or conent change in tipTap so we can Re-render the toolbar using useState.
  useEffect(() => {
    if (!editor) return
    const update = () => forceUpdate(n => n + 1)
    editor.on('transaction', update)
    editor.on('selectionUpdate', update)
    return () => {
      editor.off('transaction', update)
      editor.off('selectionUpdate', update)
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
  if (!editor) return null


  const s = 14

  return (
    <div className="
      flex flex-wrap items-center gap-1
      px-4 py-2
      bg-white dark:bg-neutral-900
      border-b border-neutral-100 dark:border-neutral-800
      sticky top-0 z-40
      transition-colors
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
    </div>
  )
}