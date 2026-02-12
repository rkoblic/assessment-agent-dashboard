"use client";

import type { AssessmentMode } from "@/lib/types";

interface Props {
  modeFilter: AssessmentMode | "all";
  onModeChange: (mode: AssessmentMode | "all") => void;
}

export function FilterBar({ modeFilter, onModeChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-600">Mode:</label>
      <select
        value={modeFilter}
        onChange={(e) => onModeChange(e.target.value as AssessmentMode | "all")}
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
      >
        <option value="all">All</option>
        <option value="synthetic">Synthetic</option>
        <option value="real">Real</option>
      </select>
    </div>
  );
}
