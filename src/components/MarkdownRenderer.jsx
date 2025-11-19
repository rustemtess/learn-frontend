import { useEffect, useRef } from 'react'

function MarkdownRenderer({ content }) {
  const contentRef = useRef(null)

  useEffect(() => {
    if (!contentRef.current || !content) return

    // Simple markdown parser
    let html = content
      // Code blocks with language (must be first to avoid processing inside code)
      .replace(/```(\w+)?\n([\s\S]*?)```/gim, (match, lang, code) => {
        const language = lang || 'javascript'
        return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="language-${language} text-sm">${escapeHtml(code.trim())}</code></pre>`
      })
    
    // Process line by line for better control
    const lines = html.split('\n')
    const processed = []
    let inList = false
    let listItems = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // Skip empty lines
      if (!line.trim()) {
        if (inList) {
          // Close list
          processed.push(`<ul class="list-disc ml-6 mb-4 space-y-1">${listItems.join('')}</ul>`)
          listItems = []
          inList = false
        }
        processed.push('')
        continue
      }
      
      // Skip if line is inside code block
      if (line.includes('<pre') || line.includes('</pre>')) {
        processed.push(line)
        continue
      }
      
      // Headers
      if (line.startsWith('### ')) {
        if (inList) {
          processed.push(`<ul class="list-disc ml-6 mb-4 space-y-1">${listItems.join('')}</ul>`)
          listItems = []
          inList = false
        }
        processed.push(`<h3 class="text-lg font-semibold text-js-text mt-6 mb-3">${line.substring(4)}</h3>`)
      } else if (line.startsWith('## ')) {
        if (inList) {
          processed.push(`<ul class="list-disc ml-6 mb-4 space-y-1">${listItems.join('')}</ul>`)
          listItems = []
          inList = false
        }
        processed.push(`<h2 class="text-xl font-semibold text-js-text mt-8 mb-4">${line.substring(3)}</h2>`)
      } else if (line.startsWith('# ')) {
        if (inList) {
          processed.push(`<ul class="list-disc ml-6 mb-4 space-y-1">${listItems.join('')}</ul>`)
          listItems = []
          inList = false
        }
        processed.push(`<h1 class="text-2xl font-bold text-js-text mt-8 mb-4">${line.substring(2)}</h1>`)
      }
      // List items
      else if (line.match(/^[\*\-] /)) {
        inList = true
        const content = line.substring(2)
        listItems.push(`<li class="text-js-text-muted">${processInline(content)}</li>`)
      } else if (line.match(/^\d+\. /)) {
        inList = true
        const content = line.substring(line.indexOf('.') + 2)
        listItems.push(`<li class="text-js-text-muted">${processInline(content)}</li>`)
      }
      // Regular paragraph
      else {
        if (inList) {
          processed.push(`<ul class="list-disc ml-6 mb-4 space-y-1">${listItems.join('')}</ul>`)
          listItems = []
          inList = false
        }
        processed.push(`<p class="text-js-text-muted leading-relaxed mb-4">${processInline(line)}</p>`)
      }
    }
    
    // Close any remaining list
    if (inList) {
      processed.push(`<ul class="list-disc ml-6 mb-4 space-y-1">${listItems.join('')}</ul>`)
    }
    
    contentRef.current.innerHTML = processed.join('\n')
  }, [content])
  
  function processInline(text) {
    return text
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-js-blue px-2 py-0.5 rounded text-sm font-mono">$1</code>')
      // Bold
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-js-text">$1</strong>')
  }

  return (
    <div 
      ref={contentRef}
      className="prose prose-sm max-w-none markdown-content"
      style={{ whiteSpace: 'normal' }}
    />
  )
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, m => map[m])
}

export default MarkdownRenderer
