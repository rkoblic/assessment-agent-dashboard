"use client";

import type { AssessmentMode } from "@/lib/types";

interface Props {
  selected: AssessmentMode | null;
  onSelect: (mode: AssessmentMode) => void;
}

const modes: { mode: AssessmentMode; title: string; description: string }[] = [
  {
    mode: "real",
    title: "Real Learner",
    description: "Conduct a live assessment with a real student. The agent will ask questions and adapt based on responses.",
  },
  {
    mode: "synthetic",
    title: "Synthetic Demo",
    description: "Watch the agent assess a simulated learner persona. See agent internals including thinking, observations, and strategy.",
  },
];

export function ModeSelector({ selected, onSelect }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {modes.map(({ mode, title, description }) => (
        <button
          key={mode}
          onClick={() => onSelect(mode)}
          className={`rounded-lg border-2 p-6 text-left transition ${
            selected === mode
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </button>
      ))}
    </div>
  );
}
