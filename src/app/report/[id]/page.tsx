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
        const r = (data.report ?? data) as EvidenceReport;
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
