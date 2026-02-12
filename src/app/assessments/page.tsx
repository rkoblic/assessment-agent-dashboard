"use client";

import { useState, useMemo } from "react";
import type { AssessmentMode } from "@/lib/types";
import { useAssessmentHistory } from "@/hooks/useAssessmentHistory";
import { AssessmentTable } from "@/components/history/AssessmentTable";
import { FilterBar } from "@/components/history/FilterBar";
import { Spinner } from "@/components/ui/Spinner";

export default function AssessmentsPage() {
  const { assessments, loading, error } = useAssessmentHistory();
  const [modeFilter, setModeFilter] = useState<AssessmentMode | "all">("all");

  const filtered = useMemo(() => {
    if (modeFilter === "all") return assessments;
    return assessments.filter((a) => a.mode === modeFilter);
  }, [assessments, modeFilter]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Assessment History</h1>
        <FilterBar modeFilter={modeFilter} onModeChange={setModeFilter} />
      </div>
      <AssessmentTable assessments={filtered} />
    </div>
  );
}
