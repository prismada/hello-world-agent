import { query, type Options } from "@anthropic-ai/claude-agent-sdk";

/**
 * Hello World Agent - A simple greeting agent
 */

export const SYSTEM_PROMPT = `You are a friendly Hello World agent. When someone talks to you, greet them warmly and tell them a fun fact about the world. Keep responses brief and cheerful.`;

export function getOptions(): Options {
  return {
    systemPrompt: SYSTEM_PROMPT,
    model: "haiku",
    maxTurns: 10,
  };
}

export async function* streamAgent(prompt: string) {
  console.log(`[HelloWorld] ${prompt.substring(0, 50)}...`);

  for await (const msg of query({ prompt, options: getOptions() })) {
    if (msg.type === "assistant") {
      for (const b of (msg as any).message?.content || []) {
        if (b.type === "text") yield { type: "text", text: b.text };
      }
    }
    if ((msg as any).message?.usage) {
      const u = (msg as any).message.usage;
      yield { type: "usage", input: u.input_tokens || 0, output: u.output_tokens || 0 };
    }
    if ("result" in msg) yield { type: "result", text: msg.result };
  }
  yield { type: "done" };
}

async function main() {
  const prompt = process.argv[2] || "Hello!";
  for await (const msg of query({ prompt, options: getOptions() })) {
    if ("result" in msg) console.log(msg.result);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
