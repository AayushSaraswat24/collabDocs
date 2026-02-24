'use client'

import { Editor } from '@tiptap/react'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Heading1, Heading2, Heading3,
  Code, Code2, Quote, Minus, Undo2, Redo2, Eraser,
} from 'lucide-react'

type Props = { editor: Editor | null }

function Btn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (

    <button type="button" onClick={onClick} title={title} aria-pressed={active}
      className={`
        w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-150
        ${
          active
            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
            : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100'
        }
      `}
    >
      {children}

    </button>
    
  )
}

function Sep() {
  return <div className="w-px h-5 bg-neutral-200 dark:bg-neutral-700 mx-1" />
}

export default function Toolbar({ editor }: Props) {
  if (!editor) return null

  const s = 16

  return (
    <div className="flex flex-wrap items-center gap-1 px-4 py-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-40 transition-colors">

      <Btn onClick={() => editor.chain().focus().undo().run()} title="Undo">
        <Undo2 size={s} />
      </Btn>

      <Btn onClick={() => editor.chain().focus().redo().run()} title="Redo">
        <Redo2 size={s} />
      </Btn>

      <Sep />

      <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
        <Bold size={s} />
      </Btn>

      <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
        <Italic size={s} />
      </Btn>

      <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
        <UnderlineIcon size={s} />
      </Btn>

      <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strike">
        <Strikethrough size={s} />
      </Btn>

      <Sep />

      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="H1">
        <Heading1 size={s} />
      </Btn>

      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="H2">
        <Heading2 size={s} />
      </Btn>

      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="H3">
        <Heading3 size={s} />
      </Btn>

      <Sep />

      <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
        <List size={s} />
      </Btn>

      <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List">
        <ListOrdered size={s} />
      </Btn>

      <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote">
        <Quote size={s} />
      </Btn>

      <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block">
        <Code2 size={s} />
      </Btn>

      <Sep />

      <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
        <Minus size={s} />
      </Btn>

      <Btn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear">
        <Eraser size={s} />
      </Btn>
    </div>
  )
}