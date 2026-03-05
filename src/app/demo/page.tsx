"use client";

import { useEffect, useState, useMemo } from "react";
import { fetchDemo } from "@/lib/api";
import type { DemoAssessment, DemoEvent } from "@/lib/api";
import type {
  ChatMessage,
  ObservationData,
  ModelUpdateData,
  StrategyShiftData,
} from "@/lib/types";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { DIRECTION_LABELS } from "@/lib/constants";

/**
 * Parse the pre-recorded demo events into chat messages + sidebar data,
 * revealing them incrementally to simulate a live assessment.
 */
function parseDemoEvents(events: DemoEvent[]) {
  const messages: ChatMessage[] = [];
  const observations: ObservationData[] = [];
  const modelUpdates: ModelUpdateData[] = [];
  const strategyShifts: StrategyShiftData[] = [];
  let report: Record<string, unknown> | null = null;

  for (const ev of events) {
    const d = ev.data;
    switch (ev.event) {
      case "agent_question":
        messages.push({
          id: `q-${messages.length}`,
          role: "agent",
          content: d.question as string,
          type: "question",
          metadata: {
            target_standard: d.target_standard as string,
            depth: d.depth as ChatMessage["metadata"] extends { depth?: infer D } ? D : never,
          },
          timestamp: new Date(),
        });
        break;
      case "agent_task":
        messages.push({
          id: `t-${messages.length}`,
          role: "agent",
          content: d.task_content as string,
          type: "task",
          metadata: { target_standard: d.target_standard as string },
          timestamp: new Date(),
        });
        break;
      case "learner_response":
        messages.push({
          id: `r-${messages.length}`,
          role: "learner",
          content: d.response as string,
          type: "response",
          timestamp: new Date(),
        });
        break;
      case "observation":
        observations.push(d as unknown as ObservationData);
        break;
      case "model_update":
        modelUpdates.push(d as unknown as ModelUpdateData);
        break;
      case "strategy_shift":
        strategyShifts.push(d as unknown as StrategyShiftData);
        break;
      case "assessment_complete":
        report = d.report as Record<string, unknown>;
        break;
    }
  }

  return { messages, observations, modelUpdates, strategyShifts, report };
}

export default function DemoPage() {
  const [demo, setDemo] = useState<DemoAssessment | null>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDemo()
      .then((d) => {
        setDemo(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  // Auto-play: reveal one event every 800ms
  useEffect(() => {
    if (!demo) return;
    if (visibleCount >= demo.events.length) return;

    const timer = setTimeout(() => {
      setVisibleCount((c) => c + 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [demo, visibleCount]);

  const parsed = useMemo(() => {
    if (!demo) return null;
    return parseDemoEvents(demo.events.slice(0, visibleCount));
  }, [demo, visibleCount]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !demo) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-red-600">Error: {error ?? "Failed to load demo"}</p>
      </div>
    );
  }

  const isComplete = visibleCount >= demo.events.length;

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Chat panel */}
      <div className="flex flex-1 flex-col">
        <div className="border-b border-gray-200 bg-white px-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Pre-recorded Demo &middot; Persona: <strong>{demo.persona.name}</strong> (Grade {demo.persona.grade_level})
              {isComplete && " \u00b7 Complete"}
            </span>
            <div className="flex gap-2">
              {!isComplete && (
                <button
                  onClick={() => setVisibleCount(demo.events.length)}
                  className="rounded bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200"
                >
                  Skip to end
                </button>
              )}
              {isComplete && (
                <button
                  onClick={() => setVisibleCount(0)}
                  className="rounded bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200"
                >
                  Replay
                </button>
              )}
            </div>
          </div>
        </div>
        <ChatContainer
          messages={parsed?.messages ?? []}
          isLoading={!isComplete}
        />
        {isComplete && parsed?.report && (
          <div className="border-t border-gray-200 bg-white p-4">
            <p className="text-sm font-medium text-green-700">
              Assessment complete — see the sidebar for agent internals and the full report below.
            </p>
          </div>
        )}
      </div>

      {/* Sidebar — agent internals */}
      <div className="hidden w-[400px] border-l border-gray-200 bg-gray-50 lg:block">
        <DemoSidebarStatic
          observations={parsed?.observations ?? []}
          modelUpdates={parsed?.modelUpdates ?? []}
          strategyShifts={parsed?.strategyShifts ?? []}
          messages={parsed?.messages ?? []}
          report={parsed?.report ?? null}
        />
      </div>
    </div>
  );
}

/**
 * Static version of the demo sidebar that works with pre-parsed data.
 */
function DemoSidebarStatic({
  observations,
  modelUpdates,
  strategyShifts,
  messages,
  report,
}: {
  observations: ObservationData[];
  modelUpdates: ModelUpdateData[];
  strategyShifts: StrategyShiftData[];
  messages: ChatMessage[];
  report: Record<string, unknown> | null;
}) {
  const maxLen = Math.max(
    observations.length,
    modelUpdates.length,
    strategyShifts.length,
  );

  const agentMsgs = messages.filter((m) => m.role === "agent");

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">Agent Internals</h2>
        <p className="text-xs text-gray-500">
          {modelUpdates.length > 0
            ? `${modelUpdates[modelUpdates.length - 1].standards_assessed}/11 standards assessed`
            : "Waiting for data..."}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {Array.from({ length: maxLen }, (_, i) => {
            const obs = observations[i];
            const mu = modelUpdates[i];
            const strat = strategyShifts[i];
            const agentMsg = agentMsgs[i];

            return (
              <div key={i} className="rounded-lg border border-gray-200 bg-white p-3">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs font-medium text-white">
                    Turn {i + 1}
                  </span>
                  {agentMsg && (
                    <span className="truncate text-xs text-gray-400">
                      {agentMsg.content.slice(0, 60)}...
                    </span>
                  )}
                </div>

                {obs && (
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gray-500">Observation</span>
                    <p className="mb-1 text-sm text-gray-700">{obs.response_reveals}</p>
                    <div className="flex flex-wrap gap-1">
                      {obs.evidence_for.map((e, j) => (
                        <Badge key={`f${j}`} className="border-green-300 bg-green-100 text-green-800">
                          + {e.standard_code}
                        </Badge>
                      ))}
                      {obs.evidence_against.map((e, j) => (
                        <Badge key={`a${j}`} className="border-red-300 bg-red-100 text-red-800">
                          - {e.standard_code}
                        </Badge>
                      ))}
                      {obs.misconceptions_detected.map((m, j) => (
                        <Badge key={`m${j}`} className="border-orange-300 bg-orange-100 text-orange-800">
                          {m}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {mu && (
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gray-500">Model Update</span>
                    <p className="text-sm text-gray-700">{mu.summary}</p>
                    {mu.progression_position && (
                      <p className="text-xs text-blue-600">{mu.progression_position}</p>
                    )}
                  </div>
                )}

                {strat && (
                  <div>
                    <span className="text-xs font-medium text-gray-500">Strategy</span>
                    <div className="mb-1">
                      <Badge className="border-purple-300 bg-purple-100 text-purple-800">
                        {DIRECTION_LABELS[strat.progression_direction] ?? strat.progression_direction}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{strat.next_move}</p>
                    {strat.gaps_in_evidence.length > 0 && (
                      <p className="mt-1 text-xs text-gray-500">
                        Gaps: {strat.gaps_in_evidence.join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {report && (
            <div className="rounded-lg border-2 border-green-300 bg-green-50 p-3">
              <span className="text-xs font-semibold text-green-800">Final Report</span>
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                {(report as Record<string, unknown>).overall_narrative as string}
              </p>
              {Array.isArray((report as Record<string, unknown>).recommended_next_steps) && (
                <div className="mt-2">
                  <span className="text-xs font-medium text-gray-500">Recommended Next Steps</span>
                  <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-700">
                    {((report as Record<string, unknown>).recommended_next_steps as string[]).map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
