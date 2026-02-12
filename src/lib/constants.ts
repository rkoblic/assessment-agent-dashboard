import type { EvidenceStatus, Confidence, MisconceptionStatus } from "./types";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "https://assessment-agent-production.up.railway.app";

export const EVIDENCE_STATUS_COLORS: Record<EvidenceStatus, string> = {
  demonstrated: "bg-green-100 text-green-800 border-green-300",
  partial: "bg-yellow-100 text-yellow-800 border-yellow-300",
  not_demonstrated: "bg-red-100 text-red-800 border-red-300",
  not_assessed: "bg-gray-100 text-gray-500 border-gray-300",
};

export const EVIDENCE_STATUS_LABELS: Record<EvidenceStatus, string> = {
  demonstrated: "Demonstrated",
  partial: "Partial",
  not_demonstrated: "Not Demonstrated",
  not_assessed: "Not Assessed",
};

export const CONFIDENCE_COLORS: Record<Confidence, string> = {
  high: "bg-blue-100 text-blue-800",
  medium: "bg-blue-50 text-blue-600",
  low: "bg-gray-100 text-gray-600",
};

export const MISCONCEPTION_STATUS_COLORS: Record<MisconceptionStatus, string> = {
  confirmed: "bg-red-100 text-red-800",
  suspected: "bg-orange-100 text-orange-800",
  cleared: "bg-green-100 text-green-800",
};

export const PERSONA_DESCRIPTIONS: Record<string, string> = {
  Mia: "Grade 3 learner with fragmented understanding. Knows unit fractions as pizza slices but struggles with non-unit fractions and number lines. Thinks bigger denominator means bigger fraction.",
  Derek:
    "Grade 4 learner who is procedural but not conceptual. Can find equivalent fractions mechanically but can't explain why. Adds unlike fractions by adding tops and bottoms separately.",
  Priya:
    "Grade 5 learner who is strong overall but has specific gaps. Solid on most concepts but thinks multiplying always makes bigger and doesn't understand fraction division conceptually.",
};

export const DIRECTION_LABELS: Record<string, string> = {
  probe_backward: "Probing Backward",
  probe_forward: "Probing Forward",
  probe_deeper: "Probing Deeper",
  probe_lateral: "Probing Lateral",
};
