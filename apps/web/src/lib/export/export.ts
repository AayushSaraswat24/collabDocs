import { Editor } from '@tiptap/react'

  const exportAsPlainText = (editor: Editor | null,fileName:string) => {
    if (!editor) return
    const text = editor.getText()
    downloadFile(text, fileName, 'text/plain')
  }

  const exportAsMarkdown = (editor: Editor | null,fileName:string) => {
    if (!editor) return

    const markdown = (editor.storage as any).markdown.getMarkdown()
    downloadFile(markdown, fileName, 'text/markdown')
  }

  export { exportAsPlainText, exportAsMarkdown }


function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}