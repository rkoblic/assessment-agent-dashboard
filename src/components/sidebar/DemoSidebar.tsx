import type { AssessmentState } from "@/lib/types";
import { ThinkingPanel } from "./ThinkingPanel";
import { ObservationPanel } from "./ObservationPanel";
import { StrategyPanel } from "./StrategyPanel";
import { LearnerModelPanel } from "./LearnerModelPanel";

export function DemoSidebar({ state }: { state: AssessmentState }) {
  return (
    <div className="flex flex-col gap-3 overflow-y-auto p-4">
      <h2 className="text-sm font-semibold text-gray-900">Agent Internals</h2>
      <LearnerModelPanel updates={state.modelUpdates} />
      <StrategyPanel shifts={state.strategyShifts} />
      <ObservationPanel observations={state.observations} />
      <ThinkingPanel events={state.thinkingEvents} />
    </div>
  );
}
