# Omni (Self-Hosted AI, No OpenAI Key)

This starter runs an open‑source LLM with **Ollama** and a Next.js UI.
- ✅ No OpenAI API key
- ✅ Your own model (Llama, Qwen, etc.)
- ✅ One-command Docker Compose to run everything

## Quick Start (Docker Compose)
1. Install Docker.
2. Run: `docker compose up --pull=always -d`
3. Open http://localhost:3000
4. (First run) The `ollama` container will pull the model on demand; you can also pre-pull:
   ```bash
   docker exec -it ollama ollama pull llama3.1:8b
   ```

## Local (without Docker)
- Install [Ollama](https://ollama.com) and run: `ollama serve`
- Pull a model: `ollama pull llama3.1:8b`
- Set env:
  ```bash
  export OLLAMA_BASE_URL=http://localhost:11434
  export OLLAMA_MODEL=llama3.1:8b
  npm i
  npm run dev
  ```

## Deploy
For a single VM/VPS, use the provided Docker Compose (works on Ubuntu, etc.).
If you deploy the Next.js app to Vercel, you must host Ollama somewhere reachable and set `OLLAMA_BASE_URL` to that server.

## Switch models
- `qwen2.5:7b`, `mistral:7b`, `llama3.1:8b`, etc.
- Update `OLLAMA_MODEL` env or compose file.

## API
- UI calls: `POST /api/chat` (streams text)
- Server talks to Ollama `/api/generate` with streaming JSON lines.

Enjoy owning your stack 🚀
