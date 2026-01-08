# cf_ai_bullet-journal

A **personal bullet journal web app** built on **Cloudflare Workers** and **Durable Objects**, enhanced with **AI analysis**.  

Each user has a separate journal. Journal entries are analyzed for **anxiety levels** and summarized using an **AI model with function calling**.  

This project was developed using AI-assisted coding, but all AI prompts used are documented in `PROMPTS.md`.

---

## Features

- Per-user journals using **Durable Objects**  
- AI analysis of journal entries (anxiety score 0-10 + summary)  
- Simple **graph visualization** of anxiety over time 


---

## Steps Taken During Project

1. Started with a **basic Durable Object** storing entries at `/add`, `/entries`, `/graph` (index.ts)
2. Added **frontend** to display entries and draw anxiety graph using `<canvas>`  (/public)
3. Integrated **AI analysis** using a model to summarize and score entries  (index.ts)
4. Initially handled AI JSON parsing manually  
5. **Later discovered function calling** via Cloudflare Workers AI  
   - Allowed returning structured `{ anxiety, summary }` directly without manual parsing  
   - Improved reliability and reduced errors in backend

---

## How To Run

Deployed link is: https://bullet-journal.crochemoreagnes.workers.dev/

Write a journal entry in the designated text box, press "Add Entry" and wait for the entry to be plotted.

---

## Sources / References Used During Project

Youtube introduction to Workers + Cloudflare materials

Durable Objects: https://developers.cloudflare.com/durable-objects/get-started/

Function calling AI: https://developers.cloudflare.com/workers-ai/features/function-calling/


