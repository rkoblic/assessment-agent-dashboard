import { Badge } from "@/components/ui/Badge";
import type { ObservationData } from "@/lib/types";

export function ObservationPanel({ observations }: { observations: ObservationData[] }) {
  if (observations.length === 0) return null;
  const latest = observations[observations.length - 1];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Observation
      </h3>
      <p className="mb-2 text-sm text-gray-700">{latest.response_reveals}</p>
      {latest.evidence_for.length > 0 && (
        <div className="mb-1 flex flex-wrap gap-1">
          {latest.evidence_for.map((e, i) => (
            <Badge key={i} className="border-green-300 bg-green-100 text-green-800">
              + {e.standard_code}
            </Badge>
          ))}
        </div>
      )}
      {latest.evidence_against.length > 0 && (
        <div className="mb-1 flex flex-wrap gap-1">
          {latest.evidence_against.map((e, i) => (
            <Badge key={i} className="border-red-300 bg-red-100 text-red-800">
              - {e.standard_code}
            </Badge>
          ))}
        </div>
      )}
      {latest.misconceptions_detected.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {latest.misconceptions_detected.map((m, i) => (
            <Badge key={i} className="border-orange-300 bg-orange-100 text-orange-800">
              {m}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
