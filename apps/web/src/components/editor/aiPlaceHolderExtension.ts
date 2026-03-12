import { Node, mergeAttributes } from "@tiptap/core"

export const AiPlaceholder = Node.create({
  name: "aiPlaceholder",

  group: "block",

  content: "text*",

  selectable: false,

  isolating: true,

  parseHTML() {
    return [
      {
        tag: "div[data-ai-placeholder]",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-ai-placeholder": "",
        contenteditable: "false",
        spellcheck: "false", 
        class: "text-neutral-400 italic pointer-events-none select-none",
      }),
      0,
    ]
  },
})