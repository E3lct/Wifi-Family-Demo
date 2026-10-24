// OpenAI-compatible SSE; a network chunk may end anywhere in a JSON line.
export async function readChatStream(body, onText) {
  if (!body) throw new Error('服务未返回可读取的数据流');
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let answer = '';
  let finished = false;
  const processLine = (line) => {
    if (!line.startsWith('data:')) return;
    const data = line.slice(5).trim();
    if (!data) return;
    if (data === '[DONE]') { finished = true; return; }
    const event = JSON.parse(data);
    if (event.error) throw new Error('模型服务返回错误');
    const text = event.choices?.[0]?.delta?.content;
    if (typeof text === 'string') { answer += text; onText(answer); }
  };
  try {
    while (!finished) {
      const { done, value } = await reader.read();
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop();
      for (const line of lines) { processLine(line); if (finished) break; }
      if (done) { if (!finished && buffer.trim()) processLine(buffer); break; }
    }
    if (!answer.trim()) throw new Error('服务返回了空回复，请重试');
    return answer;
  } finally {
    try { await reader.cancel(); } finally { reader.releaseLock(); }
  }
}
