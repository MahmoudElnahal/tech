// Optional: run the portfolio chat on OpenAI or xAI Grok without exposing an API key.
// Deploy as a Cloudflare Worker, add secrets, then set CHAT_CFG.endpoint in index.html to the worker URL.
//
//   PROVIDER      "openai" (default) or "xai"
//   OPENAI_API_KEY / XAI_API_KEY   secret
//   MODEL         optional, e.g. "gpt-4o-mini" or "grok-3-mini"
//   ALLOWED_ORIGIN  optional, defaults to https://mahmoudelnahal.github.io

const PROVIDERS = {
  openai: { url: 'https://api.openai.com/v1/chat/completions', key: 'OPENAI_API_KEY', model: 'gpt-4o-mini' },
  xai: { url: 'https://api.x.ai/v1/chat/completions', key: 'XAI_API_KEY', model: 'grok-3-mini' },
};

export default {
  async fetch(req, env) {
    const origin = env.ALLOWED_ORIGIN || 'https://mahmoudelnahal.github.io';
    const cors = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (req.method !== 'POST') return new Response('POST only', { status: 405, headers: cors });

    let body;
    try { body = await req.json(); } catch { return new Response('bad json', { status: 400, headers: cors }); }
    const messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
    if (!messages.length || JSON.stringify(messages).length > 40000) {
      return new Response('bad request', { status: 400, headers: cors });
    }

    const p = PROVIDERS[env.PROVIDER || 'openai'];
    const r = await fetch(p.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env[p.key]}` },
      body: JSON.stringify({ model: env.MODEL || p.model, messages, temperature: 0.4, max_tokens: 600 }),
    });
    return new Response(await r.text(), {
      status: r.status,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  },
};
