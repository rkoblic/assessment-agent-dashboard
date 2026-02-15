# Assessment Agent Dashboard

Next.js frontend for the [Assessment Agent](https://github.com/rkoblic/assessment-agent) — an AI-powered adaptive assessment of learner understanding in fractions (CCSS-M, Grades 2-5).

**Live:** https://assessment-agent-dashboard.vercel.app

## Pages

| Route | Description |
|-------|-------------|
| `/` | Launch page — choose assessment mode and persona |
| `/assess` | Real learner chat — type responses to the agent's questions |
| `/assess/demo?persona=Mia` | Synthetic demo — watch an automated assessment with agent internals sidebar |
| `/report/[id]` | Evidence report — standards map, misconceptions, narrative, recommendations |
| `/assessments` | Assessment history — filterable table of past assessments |

## Architecture

- **SSE-over-POST** — Browser's `EventSource` only supports GET, so we use `fetch()` + `ReadableStream` with manual SSE frame parsing to stream from POST endpoints
- **`useReducer` state machine** — Handles rapid SSE events with 12 action types and status transitions: `idle` → `connecting` → `active` → `waiting_for_input` → `complete`
- **Two assessment flows:**
  - *Synthetic:* One long-lived SSE connection streams the full assessment
  - *Real:* Initial connection yields first question, then a new connection per learner response

## Setup

```bash
# Clone
git clone git@github.com:rkoblic/assessment-agent-dashboard.git
cd assessment-agent-dashboard

# Install dependencies
npm install

# Configure
cp .env.example .env.local
# Edit .env.local with the backend API URL

# Run dev server
npm run dev
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://assessment-agent-production.up.railway.app` | Backend API base URL |

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Launch page
│   ├── assess/
│   │   ├── page.tsx              # Real learner chat
│   │   └── demo/page.tsx         # Synthetic demo + sidebar
│   ├── report/[id]/page.tsx      # Evidence report
│   └── assessments/page.tsx      # History table
├── components/
│   ├── Header.tsx
│   ├── chat/                     # ChatContainer, MessageBubble, ChatInput, TypingIndicator
│   ├── sidebar/                  # DemoSidebar (chronological turn-based feed)
│   ├── report/                   # ReportHeader, StandardsMap, MisconceptionReport, etc.
│   ├── history/                  # AssessmentTable, FilterBar
│   ├── launch/                   # ModeSelector, PersonaCard
│   └── ui/                       # Badge, Card, Spinner
├── hooks/
│   ├── useAssessment.ts          # Core SSE + useReducer state machine
│   ├── usePersonas.ts            # GET /personas
│   └── useAssessmentHistory.ts   # GET /assessments
└── lib/
    ├── types.ts                  # TypeScript types mirroring backend
    ├── api.ts                    # REST fetch wrappers
    ├── sse.ts                    # SSE-over-POST streaming client
    ├── constants.ts              # Color maps, persona descriptions
    └── report-export.ts          # Markdown generation + download
```

## Deployment

Deployed on Vercel with automatic GitHub deployments. Set `NEXT_PUBLIC_API_URL` in the Vercel project environment variables.
