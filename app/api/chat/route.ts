import { NextRequest } from 'next/server'

export const runtime = 'nodejs' // we need fetch streaming control

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
const MODEL = process.env.OLLAMA_MODEL || 'llama3.1:8b'

export async function POST(req: NextRequest) {
  const { messages } = await req.json() as { messages: { role: string, content: string }[] }
  // Convert to a single prompt (basic chat template). You can switch to /v1/chat if you prefer.
  const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n') + '\nassistant:'

  const res = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: true,
      options: { temperature: 0.3 }
    })
  })

  if (!res.ok || !res.body) {
    return new Response('Failed to reach Ollama', { status: 502 })
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      const encoder = new TextEncoder()
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        for (const line of chunk.split('\n')) {
          if (!line.trim()) continue
          try {
            const obj = JSON.parse(line)
            if (obj.response) controller.enqueue(encoder.encode(obj.response))
          } catch {}
        }
      }
      controller.close()
    }
  })

  return new Response(stream, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
