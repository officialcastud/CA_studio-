function jsonError(message, status = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export default async function handler(request) {
  if (request.method !== 'POST') {
    return jsonError('Method not allowed', 405);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON body', 400);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonError('GEMINI_API_KEY is not configured on the server', 500);
  }

  const { model, systemPrompt, history } = body ?? {};
  if (typeof model !== 'string' || typeof systemPrompt !== 'string' || !Array.isArray(history)) {
    return jsonError('Missing model/systemPrompt/history', 400);
  }

  const contents = history.map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: String(m.text ?? '') }],
  }));

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-goog-api-key': apiKey,
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
      return jsonError(`Gemini error: ${response.status} - ${text}`, 502);
    }

    const data = JSON.parse(text);
    const parts = data?.candidates?.[0]?.content?.parts;
    const assistantText = Array.isArray(parts)
      ? parts.map((p) => p?.text ?? '').join('').trim()
      : '';

    return new Response(JSON.stringify({ text: assistantText || '' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (e) {
    return jsonError(e?.message || 'Gemini request failed', 500);
  }
}

