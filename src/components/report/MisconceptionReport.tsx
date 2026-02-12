import type { MisconceptionReport as MisconceptionReportType } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MISCONCEPTION_STATUS_COLORS } from "@/lib/constants";

export function MisconceptionReport({ misconceptions }: { misconceptions: MisconceptionReportType[] }) {
  if (misconceptions.length === 0) return null;

  return (
    <Card>
      <h2 className="mb-3 text-lg font-semibold text-gray-900">Misconception Report</h2>
      <div className="space-y-3">
        {misconceptions.map((m, i) => (
          <div key={i} className="rounded-lg border border-gray-200 p-3">
            <div className="mb-1 flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-gray-900">{m.description}</p>
              <Badge className={MISCONCEPTION_STATUS_COLORS[m.status]}>
                {m.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{m.evidence}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
