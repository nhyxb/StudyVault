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

    const buttons: Array<{ element: HTMLButtonElement; handler: () => void; timer?: number }> = []

    root.querySelectorAll('pre').forEach((pre) => {
      if (pre.querySelector('.code-copy')) return

      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'code-copy'
      button.textContent = '复制'
      button.setAttribute('aria-label', '复制代码')

      const handleClick = async () => {
        const code = pre.querySelector('code')
        if (!code) return
        try {
          await navigator.clipboard.writeText(code.textContent ?? '')
          button.textContent = '已复制'
        } catch {
          button.textContent = '复制失败'
        }
        const timer = window.setTimeout(() => {
          button.textContent = '复制'
        }, 1600)
        
        // 保存 timer 引用以便清理
        const buttonData = buttons.find(b => b.element === button)
        if (buttonData) {
          buttonData.timer = timer
        }
      }

      button.addEventListener('click', handleClick)
      pre.appendChild(button)
      
      buttons.push({ element: button, handler: handleClick })
    })

    // 清理函数：移除所有事件监听器、定时器和按钮元素
    return () => {
      buttons.forEach(({ element, handler, timer }) => {
        element.removeEventListener('click', handler)
        if (timer !== undefined) {
          window.clearTimeout(timer)
        }
        element.remove()
      })
    }
  }, [html])

  return <div ref={ref} className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
}
