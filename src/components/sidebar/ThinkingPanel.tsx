import type { AgentThinkingData } from "@/lib/types";

export function ThinkingPanel({ events }: { events: AgentThinkingData[] }) {
  if (events.length === 0) return null;
  const latest = events[events.length - 1];

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Agent Thinking
      </h3>
      <p className="text-sm italic text-gray-600">{latest.text}</p>
    </div>
  );
}
