import { DurableObject } from 'cloudflare:workers';

export interface Env {
  JOURNAL: DurableObjectNamespace;
  AI: Ai;
  ASSETS: Fetcher;
}


export class Journal extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Add an entry
    if (path === '/add') {
      const body = await request.json();
      const id = Date.now().toString();
      await this.ctx.storage.put(id, body);
      console.log('Stored entry:', id, body);
      return Response.json({ ok: true, id });
    }

    // List entries
    if (path === '/entries') {
      const entries = await this.ctx.storage.list();
      return Response.json(Object.fromEntries(entries));
    }

    // Graph data
    if (path === '/graph') {
      const entries = await this.ctx.storage.list();
      const points = [...entries].map(([_, entry]: any) => ({
        timestamp: entry.timestamp,
        anxiety: entry.anxiety
      }));
      return Response.json(points);
    }

    return new Response('Not found', { status: 404 });
  }
}


export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Serve frontend from public/ folder
    if (path === "/") {
      return env.ASSETS.fetch(request);
    }

    // Identify user (per-user journal)
    const userId = url.searchParams.get("user") || "guest";
    const journalId = env.JOURNAL.idFromName(userId);
    const stub = env.JOURNAL.get(journalId);

    // Add a journal entry
    if (path === "/add-entry" && request.method === "POST") {
      const body = await request.json() as { text: string };
      const text = body.text;

      // Function calling tool for structured output
      const tools = [
        {
          name: "analyzeJournalEntry",
          description: "Analyze a journal entry and return anxiety and a summary",
          parameters: {
            type: "object",
            properties: {
              anxiety: { type: "number", minimum: 0, maximum: 10 },
              summary: { type: "string" }
            },
            required: ["anxiety", "summary"]
          }
        }
      ];

      // Run AI
      const aiResult = await env.AI.run("@hf/nousresearch/hermes-2-pro-mistral-7b", {
        messages: [
          { role: "system", content: "You are a psychological assistant. After reading the user's journal entry, you will determine anxiety data points and summarise their entry. JSON format." },
          { role: "user", content: text }
        ],
        tools
      });

      // Extract structured output
      let parsed: { anxiety: number; summary: string } = {
        anxiety: 5,
        summary: "Unable to parse AI output."
      };
      if (aiResult.tool_calls?.length) {
        parsed = aiResult.tool_calls[0].arguments as { anxiety: number; summary: string };
      }

      // Build entry object
      const entry = {
        text,
        timestamp: Date.now(),
        anxiety: parsed.anxiety,
        summary: parsed.summary
      };

      // Store entry in DO
      const response = await stub.fetch("https://do/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry)
      });

      return new Response(await response.text(), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Get all entries
    if (path === "/entries") {
      const response = await stub.fetch("https://do/entries");
      return new Response(await response.text(), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Get graph data
    if (path === "/graph") {
      const response = await stub.fetch("https://do/graph");
      return new Response(await response.text(), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Not found", { status: 404 });
  }
};
