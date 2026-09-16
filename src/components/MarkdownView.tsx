import { useEffect, useRef } from 'react'

interface MarkdownViewProps {
  html: string
}

/**
 * 渲染构建期生成的 Markdown HTML，并为代码块注入“复制”按钮。
 */
export default function MarkdownView({ html }: MarkdownViewProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    root.querySelectorAll('pre').forEach((pre) => {
      if (pre.querySelector('.code-copy')) return

      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'code-copy'
      button.textContent = '复制'
      button.setAttribute('aria-label', '复制代码')

      button.addEventListener('click', async () => {
        const code = pre.querySelector('code')
        if (!code) return
        try {
          await navigator.clipboard.writeText(code.textContent ?? '')
          button.textContent = '已复制'
        } catch {
          button.textContent = '复制失败'
        }
        window.setTimeout(() => {
          button.textContent = '复制'
        }, 1600)
      })

      pre.appendChild(button)
    })
  }, [html])

  return <div ref={ref} className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
}
