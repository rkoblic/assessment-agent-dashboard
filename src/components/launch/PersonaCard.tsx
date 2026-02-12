"use client";

import type { Persona } from "@/lib/types";
import { PERSONA_DESCRIPTIONS } from "@/lib/constants";

interface Props {
  persona: Persona;
  selected: boolean;
  onSelect: () => void;
}

export function PersonaCard({ persona, selected, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      className={`rounded-lg border-2 p-4 text-left transition ${
        selected
          ? "border-blue-600 bg-blue-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="text-base font-semibold text-gray-900">{persona.name}</span>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
          Grade {persona.grade_level}
        </span>
      </div>
      <p className="text-sm text-gray-600">
        {PERSONA_DESCRIPTIONS[persona.name] ?? "Simulated learner persona."}
      </p>
    </button>
  );
}
