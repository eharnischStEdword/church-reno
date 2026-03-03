# St. Edward Church Renovation Vision Quiz

An internal alignment tool for the Parish Leadership Team at St. Edward Church (Nashville, TN) to translate subjective renovation preferences into precise architectural language.

## What This Does

Each PLT member takes a 7-section quiz covering liturgical priorities, sanctuary design, lighting, materials, sacred art, and atmosphere. The app processes their answers through Claude AI and produces:

- **Individual results**: A specific architectural interpretation with real church references, material suggestions, and flagged contradictions
- **Group composite**: Consensus items, divergence camps, and a draft design brief an architect could actually use

## Setup

### Prerequisites
- Node.js 18+
- Anthropic API key

### Local Development

```bash
git clone https://github.com/eharnischStEdword/church-reno.git
cd church-reno
npm install
cp .env.example .env
# Edit .env with your API key and admin password
npm run dev
```

### Environment Variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `ADMIN_PASSWORD` | Password for the admin dashboard |
| `PORT` | Server port (default: 3000) |
| `DB_PATH` | SQLite database path (default: ./db/quiz.db) |

### Deploy to Render

1. Push to GitHub
2. Create a new Web Service on Render, connect this repo
3. Render will auto-detect settings from `render.yaml`
4. Add your `ANTHROPIC_API_KEY` and `ADMIN_PASSWORD` in Render's environment variables
5. Add a 1GB disk mounted at `/opt/render/project/data`

## Admin Access

Navigate to `/admin.html` and enter the admin password. From there you can:
- View all responses
- See individual AI-generated reports
- Generate the group composite report
- Regenerate reports if needed

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JS
- **Backend**: Node.js + Express
- **Database**: SQLite (better-sqlite3)
- **AI**: Anthropic Claude API
- **Hosting**: Render.com
