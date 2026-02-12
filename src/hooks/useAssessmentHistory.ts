"use client";

import { useEffect, useState } from "react";
import { fetchAssessments } from "@/lib/api";
import type { AssessmentListItem } from "@/lib/types";

export function useAssessmentHistory() {
  const [assessments, setAssessments] = useState<AssessmentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssessments()
      .then(setAssessments)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { assessments, loading, error };
}
