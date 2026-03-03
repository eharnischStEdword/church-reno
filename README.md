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
# Edit .env with your API key
npm run dev
```

### Environment Variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `PORT` | Server port (default: 3000) |
| `DB_PATH` | SQLite database path (default: ./db/quiz.db) |

### Deploy to Render

1. Push to GitHub
2. Create a new Web Service on Render, connect this repo
3. Render will auto-detect settings from `render.yaml`
4. Add your `ANTHROPIC_API_KEY` in Render's environment variables (admin has no password)
5. Add disk and env (see **Render: disk + keep-awake** below).

### Render: disk + keep-awake (step-by-step)

**A. Persistent disk and DB_PATH (so responses don’t vanish)**

- In [Render Dashboard](https://dashboard.render.com) → your **st-edward-quiz** (or the service name you use) → **Disks** in the left sidebar.
- Click **Add Disk**.
  - **Name**: `quiz-data` (or any name).
  - **Mount Path**: `/opt/render/project/data` (exactly).
  - **Size**: 1 GB.
- Save. Render will redeploy.
- In the same service go to **Environment**.
  - Add (or edit) **DB_PATH** = `/opt/render/project/data/quiz.db` (no quotes).
- Redeploy if you added DB_PATH after the disk was created.

After deploy, in **Logs** you should see: `Database path: /opt/render/project/data/quiz.db`.

**B. Keep the instance awake (UptimeRobot)**

- Go to [UptimeRobot](https://uptimerobot.com) and sign up (free) or log in.
- Click **+ Add New Monitor**.
  - **Monitor Type**: HTTP(s).
  - **Friendly Name**: e.g. `St Edward Quiz`.
  - **URL**: `https://YOUR-RENDER-URL.onrender.com/health`  
    (replace `YOUR-RENDER-URL` with your actual service URL, e.g. `st-edward-quiz-xxxx`).
  - **Monitoring Interval**: 5 minutes (or 10–14 minutes if you prefer).
- Click **Create Monitor**.

Done. The monitor will hit `/health` on that interval so the free-tier instance doesn’t spin down.

## Admin Access

Navigate to `/admin.html` (no password). From there you can:
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
