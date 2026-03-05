import { API_BASE } from "./constants";
import type {
  Persona,
  AssessmentListItem,
  Standard,
  ProgressionLevel,
  Misconception,
} from "./types";

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

export function fetchPersonas() {
  return fetchJSON<Persona[]>("/personas");
}

export function fetchAssessments() {
  return fetchJSON<AssessmentListItem[]>("/assessments");
}

export function fetchAssessment(id: string) {
  return fetchJSON<Record<string, unknown>>(`/assessments/${id}`);
}

export function fetchStandards() {
  return fetchJSON<Standard[]>("/domain/standards");
}

export function fetchProgressions() {
  return fetchJSON<ProgressionLevel[]>("/domain/progressions");
}

export function fetchMisconceptions() {
  return fetchJSON<Misconception[]>("/domain/misconceptions");
}

export function fetchDemo() {
  return fetchJSON<DemoAssessment>("/demo");
}

export async function fetchPrompt(): Promise<string> {
  const res = await fetch(`${API_BASE}/prompt`);
  if (!res.ok) throw new Error(`API error ${res.status}: /prompt`);
  return res.text();
}

export interface DemoAssessment {
  session_id: string;
  persona: { name: string; grade_level: number };
  events: DemoEvent[];
}

export interface DemoEvent {
  event: string;
  data: Record<string, unknown>;
}
