'use client'
import Editor from '@monaco-editor/react'
import { useRef, useState } from 'react'

const DEFAULT_CODE = `// Write JS/HTML/CSS here. Runs in an isolated iframe.
const app = document.getElementById('app')
app.innerHTML = '<h2>Canvas running locally</h2><p>No server console needed.</p>'`

export default function ScriptCanvas() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  function run() {
    const iframe = iframeRef.current
    if (!iframe) return
    const doc = iframe.contentDocument!
    const html = \`<!doctype html><html><head><meta charset='utf-8'><style>body{font-family:ui-sans-serif;padding:16px}</style></head><body><div id="app"></div><script>\${code.replace(/<\\/script>/g, '<\\\\/script>')}<\\/script></body></html>\`
    doc.open(); doc.write(html); doc.close();
  }

  return (
    <div className="grid grid-rows-2 h-full">
      <div className="border-b">
        <div className="flex items-center justify-between p-2">
          <div className="text-sm text-neutral-500">Canvas (sandboxed)</div>
          <div className="flex gap-2">
            <button onClick={() => setCode(DEFAULT_CODE)} className="px-3 py-1 rounded-xl border">Reset</button>
            <button onClick={run} className="px-3 py-1 rounded-xl bg-brand text-white">Run ▶</button>
          </div>
        </div>
        <Editor height="calc(100% - 40px)" defaultLanguage="javascript" value={code} onChange={(v)=>setCode(v||'')} options={{ minimap:{enabled:false}, fontSize:14, theme:'vs-dark' }}/>
      </div>
      <iframe ref={iframeRef} className="w-full h-full bg-white" sandbox="allow-scripts"></iframe>
    </div>
  )
}
