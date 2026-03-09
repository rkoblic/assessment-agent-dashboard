# Assessment Agent Dashboard

Next.js frontend for the assessment agent.

## Stack

- **Framework**: Next.js 16 (app router) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State**: React useReducer (no external state library)

## Key structure

- `src/lib/api.ts` — REST API client (fetchPersonas, fetchAssessments, fetchDemo, fetchPrompt, etc.)
- `src/lib/sse.ts` — SSE streaming client for POST-based assessment endpoints
- `src/lib/types.ts` — All TypeScript types mirroring backend models
- `src/lib/constants.ts` — API_BASE (env: NEXT_PUBLIC_API_URL), color/label mappings
- `src/hooks/useAssessment.ts` — Core assessment state machine + SSE event handling
- `src/components/chat/` — ChatContainer, MessageBubble, TypingIndicator
- `src/components/sidebar/` — DemoSidebar + panels (observation, strategy, learner model)
- `src/components/Header.tsx` — Global nav (Launch, Demo, Prompt, History)

## Routes

- `/` — Launch page (mode + persona selection)
- `/assess` — Real learner interactive assessment
- `/assess/demo` — Live synthetic assessment (calls API, streams SSE)
- `/demo` — Pre-recorded demo (no API key needed, auto-plays from /demo endpoint)
- `/prompt` — System prompt viewer (fetches from /prompt endpoint)
- `/assessments` — Assessment history list
- `/report/[id]` — Full assessment report

## Backend

API: `rkoblic/assessment-agent` (FastAPI, deployed on Railway).
Default API URL: `https://assessment-agent-production.up.railway.app`
Override via `NEXT_PUBLIC_API_URL` env var.
Backend repo lives at `/Users/rachelkoblic/assessment_agent` locally.
