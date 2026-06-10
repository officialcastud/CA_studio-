function jsonError(message, status = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGeminiWithRetry(model, apiKey, systemPrompt, contents, maxRetries = 3) {
  let lastError = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
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
      
      if (response.ok) {
        const data = JSON.parse(text);
        const parts = data?.candidates?.[0]?.content?.parts;
        const assistantText = Array.isArray(parts)
          ? parts.map((p) => p?.text ?? '').join('').trim()
          : '';
        return { success: true, text: assistantText };
      }
      
      // Check if it's a retryable error (503, 429, 500)
      if (response.status === 503 || response.status === 429 || response.status === 500) {
        lastError = { status: response.status, text, model };
        // Exponential backoff: 1s, 2s, 4s
        if (attempt < maxRetries - 1) {
          await sleep(Math.pow(2, attempt) * 1000);
          continue;
        }
      } else {
        // Non-retryable error
        return { success: false, error: `Gemini error: ${response.status} - ${text}`, status: response.status };
      }
    } catch (e) {
      lastError = { error: e?.message || 'Network error', model };
      if (attempt < maxRetries - 1) {
        await sleep(Math.pow(2, attempt) * 1000);
        continue;
      }
    }
  }
  
  return { 
    success: false, 
    error: lastError?.text || lastError?.error || 'Max retries exceeded',
    status: lastError?.status || 503,
    retriable: true
  };
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

  const { model, systemPrompt, history, fallbackModels } = body ?? {};
  if (typeof model !== 'string' || typeof systemPrompt !== 'string' || !Array.isArray(history)) {
    return jsonError('Missing model/systemPrompt/history', 400);
  }

  const contents = history.map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: String(m.text ?? '') }],
  }));

  // Build list of models to try: primary + fallbacks
  const modelsToTry = [model];
  if (Array.isArray(fallbackModels)) {
    for (const fb of fallbackModels) {
      if (typeof fb === 'string' && fb.trim() && !modelsToTry.includes(fb.trim())) {
        modelsToTry.push(fb.trim());
      }
    }
  }

  let lastError = null;
  
  for (const currentModel of modelsToTry) {
    const result = await callGeminiWithRetry(currentModel, apiKey, systemPrompt, contents, 2);
    
    if (result.success) {
      return new Response(JSON.stringify({ text: result.text || '', model: currentModel }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }
    
    lastError = result;
    
    // If it's not a retryable error (like 400, 404), don't try other models
    if (!result.retriable && result.status !== 503 && result.status !== 429 && result.status !== 500) {
      break;
    }
  }

  const errorMsg = lastError?.error || 'All models failed';
  return jsonError(errorMsg, 502);
}

