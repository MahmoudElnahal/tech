# Mahmoud El Nahal — Technical Portfolio

Live: **https://mahmoudelnahal.github.io/tech/** · QR mode: https://mahmoudelnahal.github.io/tech/#qr

Single-page portfolio for Agentic AI & AI Automation work: filterable projects with step-by-step architecture, a skill map linked to projects, an experience timeline, and a built-in AI assistant that answers questions about Mahmoud in English or Arabic.

## Files
- `index.html` — the whole site (data for projects, skills and experience lives in the `PROJECTS`, `SKILLS` and `EXP` arrays near the bottom; the AI assistant's knowledge is built from the same data).
- `qr.svg` / `qr.png` — QR code to this page (print-ready PNG).
- `og.jpg` — link preview image. `cv.pdf` — downloadable CV.
- `worker/worker.js` — optional Cloudflare Worker to run the chat on OpenAI or xAI Grok.

## AI assistant
By default it calls a keyless open-model gateway (Pollinations), so no API key is in the page. If the service is unreachable, it falls back to answers generated from the page data.

To switch to OpenAI or Grok:
1. Create a Cloudflare Worker with `worker/worker.js`.
2. Add the secret `OPENAI_API_KEY` (or `XAI_API_KEY` and the variable `PROVIDER=xai`).
3. In `index.html`, set `CHAT_CFG.endpoint` to the worker URL.
