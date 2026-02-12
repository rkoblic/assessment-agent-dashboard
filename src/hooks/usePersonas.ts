"use client";

import { useEffect, useState } from "react";
import { fetchPersonas } from "@/lib/api";
import type { Persona } from "@/lib/types";

export function usePersonas() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPersonas()
      .then(setPersonas)
      .catch(() => {
        // Fallback to hardcoded personas
        setPersonas([
          { name: "Mia", grade_level: 3 },
          { name: "Derek", grade_level: 4 },
          { name: "Priya", grade_level: 5 },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { personas, loading };
}
