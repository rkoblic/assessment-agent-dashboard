"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchAssessment } from "@/lib/api";
import type { EvidenceReport } from "@/lib/types";
import { Spinner } from "@/components/ui/Spinner";
import { ReportHeader } from "@/components/report/ReportHeader";
import { ProgressionSummary } from "@/components/report/ProgressionSummary";
import { StandardsMap } from "@/components/report/StandardsMap";
import { MisconceptionReport } from "@/components/report/MisconceptionReport";
import { NarrativeSummary } from "@/components/report/NarrativeSummary";
import { Recommendations } from "@/components/report/Recommendations";
import { ConversationLog } from "@/components/report/ConversationLog";
import { ExportButtons } from "@/components/report/ExportButtons";

export default function ReportPage() {
  const params = useParams<{ id: string }>();
  const [report, setReport] = useState<EvidenceReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssessment(params.id)
      .then((data) => {
        // Backend nests report fields under data.report and uses
        // "evidence_map" instead of "standards_evidence_map".
        // Top-level has: id, mode, persona_name, started_at, etc.
        const nested = data.report as Record<string, unknown> | undefined;
        const r: EvidenceReport = {
          session_id: data.id as string,
          mode: data.mode as EvidenceReport["mode"],
          persona_name: (data.persona_name as string) ?? null,
          started_at: data.started_at as string,
          ended_at: (data.ended_at as string) ?? "",
          turn_count: data.turn_count as number,
          progression_summary: (nested?.progression_summary as string) ?? "",
          standards_evidence_map: (nested?.evidence_map ?? nested?.standards_evidence_map ?? []) as EvidenceReport["standards_evidence_map"],
          misconception_report: (nested?.misconception_report ?? []) as EvidenceReport["misconception_report"],
          overall_narrative: (nested?.overall_narrative as string) ?? "",
          recommended_next_steps: (nested?.recommended_next_steps ?? []) as string[],
          stop_reason: (nested?.stop_reason as EvidenceReport["stop_reason"]) ?? "sufficient_evidence",
          conversation_log: (data.conversation ?? []) as EvidenceReport["conversation_log"],
        };
        setReport(r);
      })
      .catch((err) => setError(err.message));
  }, [params.id]);

  if (error) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-red-600">Error loading report: {error}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between">
        <ReportHeader report={report} />
        <ExportButtons report={report} />
      </div>
      <div className="space-y-6">
        <ProgressionSummary summary={report.progression_summary} />
        <StandardsMap standards={report.standards_evidence_map} />
        <MisconceptionReport misconceptions={report.misconception_report} />
        <NarrativeSummary narrative={report.overall_narrative} />
        <Recommendations steps={report.recommended_next_steps} />
        <ConversationLog turns={report.conversation_log} />
      </div>
    </div>
  );
}
