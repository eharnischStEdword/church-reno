# Cursor context: St. Edward Church Renovation Quiz

Use this to get Cursor on the same page as this project.

## Project in one sentence
Internal web app for the Parish Leadership Team at St. Edward Church (Nashville, TN) to turn subjective renovation preferences into architect-ready language via a 7-section quiz and Claude AI.

## Tech stack
- **Frontend**: Vanilla HTML/CSS/JS (no framework). Entry points: `public/index.html` (quiz), `public/admin.html` (admin).
- **Backend**: Node.js + Express in `src/server.js`. API routes under `/api/`, admin under `/admin/` with `X-Admin-Password` header.
- **Database**: SQLite via `better-sqlite3`, path from env `DB_PATH` (default `./db/quiz.db`).
- **AI**: Anthropic Claude in `src/ai.js` — `generateIndividualReport()` (per-respondent) and `generateCompositeReport()` (group). Prompts are in the same file; output is JSON only.

## Key files
| Path | Purpose |
|------|--------|
| `public/index.html` | Quiz UI and flow |
| `public/app.js` | Quiz logic, results rendering (reference churches with links, “Decisions to Consider”) |
| `public/admin.html` + `public/js/admin.js` | Admin dashboard, view/regenerate results, composite report |
| `src/server.js` | Express app, routes, DB, calls into `src/ai.js` |
| `src/ai.js` | All AI prompts and report generation; reference churches as `{ name, url? }`, Kelvin guidance in Design Brief |

## Conventions
- Results JSON: `referenceChurches` can be strings (legacy) or `{ name, url? }`; frontend supports both and only links when URL is `http://` or `https://`.
- “Questions for You” in UI is labeled **“Decisions to Consider”** and holds topic bullets, not literal questions.
- When editing AI prompts: Design Brief and Light & Materials must include Kelvin scale context (daylight ≈5500K; 2700–3000K warmer, higher K cooler).

## Run locally
```bash
npm install
cp .env.example .env   # set ANTHROPIC_API_KEY, ADMIN_PASSWORD
npm run dev
```
App: http://localhost:3000 — Admin: http://localhost:3000/admin.html

## Paste this into Cursor
You can paste the following into a Cursor chat to align it with this project:

---
**Context:** This repo is the St. Edward Church Renovation Quiz — a Node/Express + vanilla JS app for a Catholic parish PLT. Quiz lives in `public/` (index.html, app.js); server and AI in `src/` (server.js, ai.js). SQLite DB. AI in `src/ai.js` returns JSON; reference churches may have `name` and optional `url`; Design Brief and lighting copy include Kelvin scale (5500K daylight, 2700–3000K warmer, higher K cooler). The results section “Questions for You” is labeled “Decisions to Consider” and lists topics, not questions. When changing prompts or results UI, keep reference church links (DOM-built for safety), Kelvin wording, and the Decisions to Consider heading consistent.
---
