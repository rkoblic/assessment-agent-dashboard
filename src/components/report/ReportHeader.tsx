import type { EvidenceReport } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

export function ReportHeader({ report }: { report: EvidenceReport }) {
  const name = report.persona_name ?? "Anonymous";
  const date = report.started_at.slice(0, 10);

  return (
    <div className="mb-6">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Evidence of Learning Report</h1>
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <span>
          <strong>Learner:</strong> {name}
        </span>
        <span>
          <strong>Date:</strong> {date}
        </span>
        <span>
          <strong>Domain:</strong> Fractions (CCSS-M Grades 2-5)
        </span>
        <span>
          <strong>Turns:</strong> {report.turn_count}
        </span>
        <Badge className={report.mode === "synthetic" ? "bg-purple-100 text-purple-800 border-purple-300" : "bg-blue-100 text-blue-800 border-blue-300"}>
          {report.mode === "synthetic" ? "Synthetic" : "Real"}
        </Badge>
      </div>
    </div>
  );
}
