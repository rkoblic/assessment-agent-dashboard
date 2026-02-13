"use client";

import { useEffect, useRef } from "react";
import type { AssessmentState } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { DIRECTION_LABELS } from "@/lib/constants";

/**
 * Build a chronological feed of agent-internal events grouped by turn.
 *
 * The SSE events arrive in a consistent order per turn:
 *   thinking[i] → (agent question/task appears in chat) →
 *   (learner response appears in chat) → observation[i] →
 *   model_update[i] → strategy_shift[i]
 *
 * We group by index so the sidebar flows top-to-bottom matching the chat.
 */
function buildTimeline(state: AssessmentState) {
  const maxLen = Math.max(
    state.thinkingEvents.length,
    state.observations.length,
    state.modelUpdates.length,
    state.strategyShifts.length,
  );

  const turns: {
    turn: number;
    thinking?: string;
    observation?: typeof state.observations[0];
    modelUpdate?: typeof state.modelUpdates[0];
    strategy?: typeof state.strategyShifts[0];
    agentMessage?: string;
  }[] = [];

  for (let i = 0; i < maxLen; i++) {
    // Find the corresponding agent message for this turn (questions/tasks alternate with responses)
    const agentMsgs = state.messages.filter((m) => m.role === "agent");
    const agentMsg = agentMsgs[i];

    turns.push({
      turn: i + 1,
      thinking: state.thinkingEvents[i]?.text,
      observation: state.observations[i],
      modelUpdate: state.modelUpdates[i],
      strategy: state.strategyShifts[i],
      agentMessage: agentMsg?.content?.slice(0, 60),
    });
  }

  return turns;
}

export function DemoSidebar({ state }: { state: AssessmentState }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.thinkingEvents.length, state.observations.length, state.modelUpdates.length, state.strategyShifts.length]);

  const timeline = buildTimeline(state);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">Agent Internals</h2>
        <p className="text-xs text-gray-500">
          {state.modelUpdates.length > 0
            ? `${state.modelUpdates[state.modelUpdates.length - 1].standards_assessed}/11 standards assessed`
            : "Waiting for data..."}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {timeline.map((t) => (
            <div key={t.turn} className="rounded-lg border border-gray-200 bg-white p-3">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs font-medium text-white">
                  Turn {t.turn}
                </span>
                {t.agentMessage && (
                  <span className="truncate text-xs text-gray-400" title={t.agentMessage}>
                    {t.agentMessage}...
                  </span>
                )}
              </div>

              {t.thinking && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-500">Thinking</span>
                  <p className="text-sm italic text-gray-600">{t.thinking}</p>
                </div>
              )}

              {t.observation && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-500">Observation</span>
                  <p className="mb-1 text-sm text-gray-700">{t.observation.response_reveals}</p>
                  <div className="flex flex-wrap gap-1">
                    {t.observation.evidence_for.map((e, i) => (
                      <Badge key={`f${i}`} className="border-green-300 bg-green-100 text-green-800">
                        + {e.standard_code}
                      </Badge>
                    ))}
                    {t.observation.evidence_against.map((e, i) => (
                      <Badge key={`a${i}`} className="border-red-300 bg-red-100 text-red-800">
                        - {e.standard_code}
                      </Badge>
                    ))}
                    {t.observation.misconceptions_detected.map((m, i) => (
                      <Badge key={`m${i}`} className="border-orange-300 bg-orange-100 text-orange-800">
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {t.modelUpdate && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-500">Model Update</span>
                  <p className="text-sm text-gray-700">{t.modelUpdate.summary}</p>
                  {t.modelUpdate.progression_position && (
                    <p className="text-xs text-blue-600">{t.modelUpdate.progression_position}</p>
                  )}
                </div>
              )}

              {t.strategy && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Strategy</span>
                  <div className="mb-1">
                    <Badge className="border-purple-300 bg-purple-100 text-purple-800">
                      {DIRECTION_LABELS[t.strategy.progression_direction] ?? t.strategy.progression_direction}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{t.strategy.next_move}</p>
                  {t.strategy.gaps_in_evidence.length > 0 && (
                    <p className="mt-1 text-xs text-gray-500">
                      Gaps: {t.strategy.gaps_in_evidence.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
