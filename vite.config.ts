import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const localApiKeyFromEnv = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY;

  return {
    plugins: [
    react(),
    // Dev-only: provide Netlify Functions endpoint locally.
    // This prevents `/.netlify/functions/gemini-plan` 404 when testing AI on localhost.
    {
      name: 'netlify-functions-dev-middleware',
      configureServer(devServer) {
        const isDev = process.env.NODE_ENV !== 'production';
        if (!isDev) return;

        const endpointPath = '/.netlify/functions/gemini-plan';
        const localApiKey = localApiKeyFromEnv;

        devServer.middlewares.use(endpointPath, async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.end('Method not allowed');
            return;
          }

          if (!localApiKey) {
            res.statusCode = 500;
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify({ error: 'GEMINI_API_KEY/VITE_GEMINI_API_KEY missing for local dev' }));
            return;
          }

          let raw = '';
          req.on('data', chunk => { raw += chunk; });
          req.on('end', async () => {
            try {
              const body = JSON.parse(raw || '{}');
              const { model, systemPrompt, history } = body ?? {};
              if (typeof model !== 'string' || typeof systemPrompt !== 'string' || !Array.isArray(history)) {
                res.statusCode = 400;
                res.setHeader('content-type', 'application/json');
                res.end(JSON.stringify({ error: 'Missing model/systemPrompt/history' }));
                return;
              }

              const contents = history.map((m: any) => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: String(m.text ?? '') }],
              }));

              const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
                {
                  method: 'POST',
                  headers: {
                    'content-type': 'application/json',
                    'x-goog-api-key': localApiKey,
                  },
                  body: JSON.stringify({
                    systemInstruction: { role: 'user', parts: [{ text: systemPrompt }] },
                    contents,
                    generationConfig: { temperature: 0.2 },
                  }),
                },
              );

              const text = await response.text();
              if (!response.ok) {
                res.statusCode = 502;
                res.setHeader('content-type', 'application/json');
                res.end(JSON.stringify({ error: `Gemini error: ${response.status} - ${text}` }));
                return;
              }

              const data = JSON.parse(text);
              const parts = data?.candidates?.[0]?.content?.parts;
              const assistantText = Array.isArray(parts)
                ? parts.map((p: any) => p?.text ?? '').join('').trim()
                : '';

              res.statusCode = 200;
              res.setHeader('content-type', 'application/json');
              res.end(JSON.stringify({ text: assistantText || '' }));
            } catch (e: any) {
              res.statusCode = 500;
              res.setHeader('content-type', 'application/json');
              res.end(JSON.stringify({ error: e?.message || 'Local Gemini proxy failed' }));
            }
          });
        });
      },
    },
    ],
    server: {
      port: 1066,
      strictPort: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'lucide-react': path.resolve(__dirname, './src/shims/lucide-react'),
        'radix-ui': path.resolve(__dirname, './src/shims/radix-ui'),
      },
    },
  };
});
