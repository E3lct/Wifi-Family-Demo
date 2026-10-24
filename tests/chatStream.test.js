import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readChatStream } from '../src/utils/chatStream.js';
const encoder = new TextEncoder();
function body(chunks) {
  return new ReadableStream({ start(c) { chunks.forEach(x => c.enqueue(x)); c.close(); } });
}
test('handles every byte split including UTF-8 and CRLF', async () => {
  const data = encoder.encode('data: {"choices":[{"delta":{"content":"你好"}}]}\r\ndata: {"choices":[{"delta":{"content":"！"}}]}\ndata: [DONE]\n');
  for (let i = 1; i < data.length; i++) {
    const updates = [];
    assert.equal(await readChatStream(body([data.slice(0,i),data.slice(i)]), t => updates.push(t)), '你好！');
    assert.equal(updates.at(-1), '你好！');
  }
});
test('handles trailing line without newline and ignores SSE metadata', async () => {
  assert.equal(await readChatStream(body([encoder.encode(': heartbeat\nevent: message\ndata:{"choices":[{"delta":{"content":"ok"}}]}')]), () => {}), 'ok');
});
test('stops at DONE and cancels unread body', async () => {
  let cancelled = false;
  const stream = new ReadableStream({ start(c) { c.enqueue(encoder.encode('data:{"choices":[{"delta":{"content":"ok"}}]}\ndata:[DONE]\ndata:bad\n')); }, cancel() { cancelled = true; } });
  assert.equal(await readChatStream(stream, () => {}), 'ok');
  assert.equal(cancelled, true);
});
test('reports empty, malformed and service-error streams', async () => {
  for (const value of ['data:[DONE]\n', 'data:bad\n', 'data:{"error":{"message":"bad"}}\n']) {
    await assert.rejects(readChatStream(body([encoder.encode(value)]), () => {}));
  }
  await assert.rejects(readChatStream(null, () => {}));
});
