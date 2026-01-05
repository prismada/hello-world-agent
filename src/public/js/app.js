// Hello World Agent - Single file UI
const $ = id => document.getElementById(id);

let sessionId = null;

async function chat(message) {
  const res = await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId })
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
      if (line.trim()) {
        try {
          const chunk = JSON.parse(line);
          if (chunk.type === 'text' || chunk.type === 'result') {
            $('content').textContent += chunk.text;
          } else if (chunk.type === 'usage') {
            const tokens = chunk.input + chunk.output;
            const cost = (chunk.input * 0.25 + chunk.output * 1.25) / 1e6;
            $('tokens').textContent = tokens;
            $('cost').textContent = cost.toFixed(4);
          } else if (chunk.type === 'done') {
            $('status').classList.remove('visible');
            $('btn').disabled = false;
            $('btn').textContent = 'Send';
          }
        } catch {}
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = $('form');
  const input = $('input');
  const btn = $('btn');

  input.value = 'Hello!';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = input.value.trim();
    if (!msg) return;

    btn.disabled = true;
    btn.textContent = 'Sending...';
    $('content').textContent = '';
    $('status').classList.add('visible', 'searching');
    $('statusText').textContent = 'Thinking...';
    $('results').classList.add('visible');

    await chat(msg);
  });
});
