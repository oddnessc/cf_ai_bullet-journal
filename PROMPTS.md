# PROMPTS.md

This file documents all AI prompts used during the development of the `cf_ai_bullet-journal` project.  

AI-assisted coding was used to speed up development, troubleshoot errors, and implement new features such as **function calling**.

---

## Prompt 1: 

Give me a basic frontend framework for a bullet journal. Include a text area for entry, a submit button, an area to display entries, and a canvas for plotting a graph of anxiety over time. 

**Purpose:**  
- To quickly create a frontend skeleton for the app  
- Enabled submitting entries, displaying them, and plotting anxiety over time  

**Result:**  
- `index.html` with text area, submit button, entries div, and canvas  
- `app.js` with JavaScript for handling submit, fetching entries, and drawing graph  

---

## Prompt 2: 

Rewrite the backend AI integration so that it uses function calling, returning JSON with "anxiety" and "summary" fields instead of parsing raw AI output.


**Purpose:**  
- Improve reliability of AI output handling  
- Avoid manual JSON parsing errors (`JSON.parse`)  
- Ensure AI returns structured data directly to Durable Object  

**Result:**  
- AI tool definition added to backend  
- Durable Object stores structured `{ anxiety, summary }` along with entry text and timestamp  
- Errors from AI output parsing eliminated  

---

## Prompt 3: 

Errors on 'AI' or 'JOURNAL' not recognised in my Worker. Identify the problem and fix it.


**Purpose:**  
- Debug TypeScript errors in Worker environment  
- Ensure proper bindings for AI and Durable Objects in `wrangler.jsonc`  


**Result:**  
- Ran "npx wrangler typegen" command in my terminal, fixed the problem

