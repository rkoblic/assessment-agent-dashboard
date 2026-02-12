"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AssessmentMode } from "@/lib/types";
import { usePersonas } from "@/hooks/usePersonas";
import { ModeSelector } from "@/components/launch/ModeSelector";
import { PersonaCard } from "@/components/launch/PersonaCard";
import { Spinner } from "@/components/ui/Spinner";

export default function LaunchPage() {
  const router = useRouter();
  const { personas, loading } = usePersonas();
  const [mode, setMode] = useState<AssessmentMode | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

  const handleStart = () => {
    if (!mode) return;
    if (mode === "real") {
      router.push("/assess");
    } else {
      router.push(`/assess/demo${selectedPersona ? `?persona=${selectedPersona}` : ""}`);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Assessment Agent</h1>
      <p className="mb-8 text-gray-600">
        AI-powered adaptive assessment of learner understanding in fractions (CCSS-M Grades 2-5).
      </p>

      <div className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Choose Mode</h2>
        <ModeSelector selected={mode} onSelect={setMode} />
      </div>

      {mode === "synthetic" && (
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Choose Persona</h2>
          {loading ? (
            <Spinner />
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              {personas.map((p) => (
                <PersonaCard
                  key={p.name}
                  persona={p}
                  selected={selectedPersona === p.name}
                  onSelect={() => setSelectedPersona(p.name)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleStart}
        disabled={!mode || (mode === "synthetic" && !selectedPersona)}
        className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        Start Assessment
      </button>
    </div>
  );
}
