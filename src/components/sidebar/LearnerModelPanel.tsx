import { Badge } from "@/components/ui/Badge";
import { EVIDENCE_STATUS_COLORS, EVIDENCE_STATUS_LABELS } from "@/lib/constants";
import type { ModelUpdateData } from "@/lib/types";

export function LearnerModelPanel({ updates }: { updates: ModelUpdateData[] }) {
  const latest = updates.length > 0 ? updates[updates.length - 1] : null;
  const assessed = latest?.standards_assessed ?? 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Learner Model
      </h3>
      <p className="mb-2 text-xs text-gray-500">{assessed}/11 standards assessed</p>
      {latest?.progression_position && (
        <p className="mb-2 text-xs text-blue-600">{latest.progression_position}</p>
      )}
      {latest?.summary && (
        <p className="text-sm text-gray-700">{latest.summary}</p>
      )}
      {!latest && (
        <Badge className={EVIDENCE_STATUS_COLORS["not_assessed"]}>
          {EVIDENCE_STATUS_LABELS["not_assessed"]}
        </Badge>
      )}
    </div>
  );
}
