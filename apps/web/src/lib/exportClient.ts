export function exportPDF(docName: string) {
  const proseMirror = document.querySelector('.ProseMirror')
  if (!proseMirror) return

  const content = proseMirror.innerHTML
  const printWindow = window.open('', '_blank', 'width=900,height=650')
  if (!printWindow) return

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${docName}</title>
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body {
            font-family: Georgia, serif;
            font-size: 12pt;
            line-height: 1.8;
            color: #1a1a1a;
            background: white;
            padding: 2cm 2.5cm;
            max-width: 21cm;
            margin: 0 auto;
          }

          p { margin-bottom: 1em; }

          h1 {
            font-size: 22pt;
            font-weight: 700;
            margin: 1.5em 0 0.5em;
            color: #0d0d0d;
            line-height: 1.2;
          }

          h2 {
            font-size: 17pt;
            font-weight: 700;
            margin: 1.3em 0 0.4em;
            color: #0d0d0d;
          }

          h3 {
            font-size: 10pt;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #888;
            margin: 1.2em 0 0.3em;
          }

          strong { font-weight: 700; }
          em     { font-style: italic; }
          u      { text-decoration: underline; }
          s      { text-decoration: line-through; }

          blockquote {
            border-left: 2px solid #d4af7a;
            padding-left: 1.2rem;
            color: #6b6b6b;
            font-style: italic;
            margin: 1.2em 0;
          }

          ul {
            list-style: disc;
            padding-left: 1.5rem;
            margin-bottom: 1em;
          }

          ol {
            list-style: decimal;
            padding-left: 1.5rem;
            margin-bottom: 1em;
          }

          li { margin-bottom: 0.3em; }

          /* inline code */
          code {
            font-family: ui-monospace, monospace;
            font-size: 9pt;
            background: #fff0e8 !important;
            color: #c2410c !important;
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid #fddcca;
          }

          /* code block */
          pre {
            background: #18181b !important;
            color: #e4e4e7 !important;
            font-family: ui-monospace, monospace;
            font-size: 9pt;
            line-height: 1.6;
            padding: 16px 20px;
            border-radius: 8px;
            margin: 1.2em 0;
            white-space: pre-wrap;
            word-break: break-word;
          }

          /* reset code inside pre — pre handles the colors */
          pre code {
            background: transparent !important;
            color: inherit !important;
            padding: 0;
            border: none;
            font-size: inherit;
          }

          hr {
            border: none;
            height: 1px;
            background: #e5e5e5 !important;
            margin: 2em 0;
          }

          @page {
            size: A4;
            margin: 0;
          }

          pre, blockquote { page-break-inside: avoid; }
          h1, h2, h3      { page-break-after: avoid; }
          p               { orphans: 3; widows: 3; }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `)

  printWindow.document.close()

  printWindow.onload = () => {
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }
}