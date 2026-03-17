import { Editor } from "@tiptap/react"
import { toast } from "sonner"

export async function handleAI(
  route: string,
  editor: Editor,
  start: () => void,
  end: () => void
) {
  const { from, to } = editor.state.selection
  const text = editor.state.doc.textBetween(from, to, " ")

  if (!text) return

  try {
    start()

    // Insert placeholder with initial empty paragraph to prevent placeholder from showing
    editor
      .chain()
      .focus()
      .deleteRange({ from, to })
      .insertContentAt(from, { 
        type: "aiPlaceholder",
        content: [{ type: "paragraph" }]
      })
      .run()

    const res = await fetch(route, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentText: text }),
      credentials: "include",
    })

    const reader = res.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) return

    let paragraphPos: number | null = null

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)

      editor
        .chain()
        .focus()
        .command(({ tr }) => {

          // If paragraph not created yet → replace placeholder
          if (paragraphPos === null) {

            tr.doc.descendants((node, pos) => {
              if (node.type.name === "aiPlaceholder") {
                paragraphPos = pos
                return false
              }
            })

            if (paragraphPos === null) return false

            const paragraph = editor.schema.nodes.paragraph.create(
              {},
              editor.schema.text(chunk)
            )

            tr.replaceWith(
              paragraphPos,
              paragraphPos + tr.doc.nodeAt(paragraphPos)!.nodeSize,
              paragraph
            )

            return true
          }

          // Paragraph already exists → append text
          const node = tr.doc.nodeAt(paragraphPos)

          if (!node) return false

          tr.insertText(chunk, paragraphPos + 1 + node.content.size)

          return true
        })
        .run()
    }

  } catch {
    toast.error("AI request failed")
  } finally {
    end()
  }
}