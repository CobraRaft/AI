'use client'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import ScriptCanvas from '../components/ScriptCanvas'

type Msg = { role: 'user'|'assistant', content: string }

export default function Page() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [tab, setTab] = useState<'chat'|'canvas'>('chat')
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}) },[messages.length])

  async function send(e?: React.FormEvent) {
    e?.preventDefault()
    if (!input.trim()) return
    const userMsg: Msg = { role: 'user', content: input }
    setMessages(m => [...m, userMsg])
    setInput('')
    // Stream from our API (which talks to Ollama)
    const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ messages: [...messages, userMsg] }) })
    if (!res.ok) { setMessages(m=>[...m, {role:'assistant', content: 'Error: '+res.statusText}]); return }
    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let done = false
    let acc = ''
    setMessages(m=>[...m, { role:'assistant', content:'' }])
    while (!done) {
      const { value, done: d } = await reader.read()
      done = d
      if (value) {
        const chunk = decoder.decode(value, { stream: true })
        acc += chunk
        setMessages(m => {
          const copy = m.slice()
          copy[copy.length-1] = { role:'assistant', content: acc }
          return copy
        })
      }
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-4 grid gap-4">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Omni (your own AI)</h1>
        <nav className="flex gap-2">
          <button onClick={() => setTab('chat')} className={clsx('px-3 py-1.5 rounded-xl border', tab==='chat'?'bg-brand text-white border-transparent':'border-neutral-300')}>Chat</button>
          <button onClick={() => setTab('canvas')} className={clsx('px-3 py-1.5 rounded-xl border', tab==='canvas'?'bg-brand text-white border-transparent':'border-neutral-300')}>Canvas</button>
        </nav>
      </header>

      <section className="h-[70dvh] rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        {tab === 'chat' ? (
          <div className="h-full grid grid-rows-[1fr_auto]">
            <div className="overflow-y-auto p-3 space-y-2">
              {messages.map((m, i) => (
                <div key={i} className={clsx('max-w-[80%] rounded-2xl px-4 py-2 text-sm', m.role==='user'?'bg-brand text-white ml-auto':'bg-neutral-100')}>
                  {m.content}
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <form onSubmit={send} className="p-3 flex gap-2 border-t">
              <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Talk to your self-hosted model…" className="flex-1 px-3 py-2 rounded-xl border"/>
              <button className="px-4 py-2 rounded-xl bg-brand text-white">Send</button>
            </form>
          </div>
        ) : <ScriptCanvas/>}
      </section>
      <p className="text-sm text-neutral-500">Runs with <code>ollama</code>. No OpenAI key.</p>
    </main>
  )
}
