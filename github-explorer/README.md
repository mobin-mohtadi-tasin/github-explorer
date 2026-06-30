# 🔭 DevScope — GitHub Profile Explorer

A sleek, full-stack GitHub profile explorer built with **React + Tailwind** (frontend) and **Node.js + Express** (backend).

## Features

- 🔍 **Search** any GitHub user instantly
- 📊 **Stats Dashboard** — stars, forks, followers, repos
- 🏆 **Developer Rank** (S → F) computed from activity score
- 🗓️ **Activity Heatmap** — 52-week contribution grid
- 🌐 **Language Breakdown** — interactive donut chart
- 📁 **Repo Explorer** — filter, sort, search across all public repos
- ⚡ **Recent Activity Feed** — commits, PRs, stars, forks
- 🌙 Dark mode (GitHub-style dark theme)

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, React Router v6, Tailwind CSS v3, Recharts, Framer Motion, Lucide Icons |
| Backend | Node.js, Express, Axios, express-rate-limit |
| API | GitHub REST API v3 (public, unauthenticated or with token) |

## Project Structure

```
github-explorer/
├── server/
│   ├── index.js          # Express API server (port 3001)
│   └── package.json
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── RepoCard.jsx
    │   │   ├── StatsGrid.jsx
    │   │   ├── RankBadge.jsx
    │   │   ├── LanguageChart.jsx
    │   │   ├── ActivityHeatmap.jsx
    │   │   └── EventFeed.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── UserProfile.jsx
    │   │   └── SearchPage.jsx
    │   ├── utils/
    │   │   ├── api.js
    │   │   └── helpers.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

## Setup & Run

### 1. Install dependencies

```bash
# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 2. (Optional) Add a GitHub Token for higher rate limits

GitHub's public API allows 60 requests/hour unauthenticated. With a token: 5000/hour.

Create a `.env` file in the `server/` folder:

```env
GITHUB_TOKEN=your_personal_access_token_here
```

Generate a token at: https://github.com/settings/tokens (no scopes needed for public data)

Then update `server/index.js` to load dotenv:

```bash
cd server && npm install dotenv
```

Add at the top of `index.js`:
```js
import 'dotenv/config'
```

### 3. Run both servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Running on http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Running on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

## API Endpoints (Backend)

| Method | Route | Description |
|---|---|---|
| GET | `/api/user/:username` | Full profile, repos, stats, events |
| GET | `/api/user/:username/repo/:repo` | Single repo detail |
| GET | `/api/search?q=&page=` | Search GitHub users |

## Ranking Algorithm

The developer rank score is computed as:

```
score = (total_stars × 3) + (total_forks × 2) + (followers × 1) + repo_count
```

| Rank | Score threshold |
|---|---|
| S | ≥ 1000 |
| A | ≥ 300 |
| B | ≥ 100 |
| C | ≥ 30 |
| D | ≥ 10 |
| F | < 10 |

## Possible Enhancements

- [ ] GitHub Token input in UI (client-side token support)
- [ ] Compare two users side-by-side
- [ ] Export profile as PDF card
- [ ] Organization profile support
- [ ] Trending developers leaderboard
- [ ] Commit history calendar with real contribution data (requires auth)
