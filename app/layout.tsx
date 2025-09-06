import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Omni (Self-Hosted AI)',
  description: 'Local/open-source LLM via Ollama. No OpenAI key.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  )
}
