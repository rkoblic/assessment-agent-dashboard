import type { StandardEvidenceReport } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { EVIDENCE_STATUS_COLORS, EVIDENCE_STATUS_LABELS, CONFIDENCE_COLORS } from "@/lib/constants";

export function StandardCard({ standard }: { standard: StandardEvidenceReport }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-gray-900">
          {standard.standard_code}: {standard.standard_description}
        </h4>
        <div className="flex shrink-0 gap-1">
          <Badge className={EVIDENCE_STATUS_COLORS[standard.status]}>
            {EVIDENCE_STATUS_LABELS[standard.status]}
          </Badge>
          <Badge className={CONFIDENCE_COLORS[standard.confidence]}>
            {standard.confidence}
          </Badge>
        </div>
      </div>
      {standard.evidence.length > 0 && (
        <div className="mb-2">
          <p className="mb-1 text-xs font-medium text-gray-500">Evidence:</p>
          <ul className="space-y-1">
            {standard.evidence.map((e, i) => (
              <li key={i} className="text-sm text-gray-600">
                {e}
              </li>
            ))}
          </ul>
        </div>
      )}
      {standard.learning_components && standard.learning_components.length > 0 && (
        <div>
          <p className="mb-1 text-xs font-medium text-gray-500">Learning Components:</p>
          <div className="flex flex-wrap gap-1">
            {standard.learning_components.map((lc) => (
              <Badge key={lc.code} className="border-gray-300 bg-gray-50 text-gray-700">
                {lc.code}: {lc.status}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
