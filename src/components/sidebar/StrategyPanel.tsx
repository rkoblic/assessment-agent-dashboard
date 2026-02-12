import { Badge } from "@/components/ui/Badge";
import { DIRECTION_LABELS } from "@/lib/constants";
import type { StrategyShiftData } from "@/lib/types";

export function StrategyPanel({ shifts }: { shifts: StrategyShiftData[] }) {
  if (shifts.length === 0) return null;
  const latest = shifts[shifts.length - 1];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Strategy
      </h3>
      <div className="mb-2">
        <Badge className="border-purple-300 bg-purple-100 text-purple-800">
          {DIRECTION_LABELS[latest.progression_direction] ?? latest.progression_direction}
        </Badge>
      </div>
      <p className="text-sm text-gray-700">{latest.next_move}</p>
      {latest.gaps_in_evidence.length > 0 && (
        <div className="mt-2">
          <span className="text-xs font-medium text-gray-500">Gaps: </span>
          <span className="text-xs text-gray-600">{latest.gaps_in_evidence.join(", ")}</span>
        </div>
      )}
    </div>
  );
}
