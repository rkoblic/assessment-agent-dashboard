// Enums mirroring backend src/types.py

export type AssessmentMode = "real" | "synthetic";
export type EvidenceStatus = "demonstrated" | "partial" | "not_demonstrated" | "not_assessed";
export type Confidence = "low" | "medium" | "high";
export type MisconceptionStatus = "confirmed" | "suspected" | "cleared";
export type DepthLevel = "recall" | "conceptual" | "application" | "transfer";
export type TaskType =
  | "compare_fractions"
  | "order_fractions"
  | "find_equivalent"
  | "place_on_number_line"
  | "compute"
  | "decompose"
  | "word_problem";
export type ProgressionDirection =
  | "probe_backward"
  | "probe_forward"
  | "probe_deeper"
  | "probe_lateral";
export type StopReason = "sufficient_evidence" | "max_turns" | "learner_disengaged";

// SSE event data interfaces

export interface SessionStartedData {
  session_id: string;
}

export interface AgentThinkingData {
  text: string;
}

export interface AgentQuestionData {
  question: string;
  target_standard: string;
  depth: DepthLevel;
}

export interface AgentTaskData {
  task_type: TaskType;
  task_content: string;
  target_standard: string;
}

export interface LearnerResponseData {
  response: string;
}

export interface ObservationData {
  response_reveals: string;
  evidence_for: Array<{
    standard_code: string;
    learning_component?: string;
    confidence: Confidence;
  }>;
  evidence_against: Array<{
    standard_code: string;
    learning_component?: string;
    confidence: Confidence;
  }>;
  misconceptions_detected: string[];
  misconceptions_ruled_out: string[];
}

export interface ModelUpdateData {
  summary: string;
  progression_position: string;
  standards_assessed: number;
}

export interface StrategyShiftData {
  current_picture: string;
  gaps_in_evidence: string[];
  next_move: string;
  progression_direction: ProgressionDirection;
}

export interface AssessmentCompleteData {
  report: EvidenceReport;
  session_id: string;
}

// Report types

export interface LearningComponentReport {
  code: string;
  description: string;
  status: string;
}

export interface StandardEvidenceReport {
  standard_code: string;
  standard_description: string;
  status: EvidenceStatus;
  confidence: Confidence;
  evidence: string[];
  learning_components?: LearningComponentReport[];
}

export interface MisconceptionReport {
  description: string;
  status: MisconceptionStatus;
  evidence: string;
}

export interface ConversationTurn {
  turn_number: number;
  role: "agent" | "learner";
  content: string;
  tool_calls: Record<string, unknown>[];
  timestamp: string;
}

export interface EvidenceReport {
  session_id: string;
  mode: AssessmentMode;
  persona_name: string | null;
  started_at: string;
  ended_at: string;
  turn_count: number;
  progression_summary: string;
  standards_evidence_map: StandardEvidenceReport[];
  misconception_report: MisconceptionReport[];
  overall_narrative: string;
  recommended_next_steps: string[];
  stop_reason: StopReason;
  conversation_log: ConversationTurn[];
}

// API response types

export interface Persona {
  name: string;
  grade_level: number;
}

export interface Standard {
  code: string;
  grade: number;
  description: string;
  learning_components: { code: string; description: string }[];
}

export interface ProgressionLevel {
  grade: number;
  label: string;
  standards: string[];
  prerequisites: string[];
  next_levels: string[];
}

export interface Misconception {
  id: string;
  category: string;
  description: string;
  example: string;
  related_standards: string[];
}

export interface AssessmentListItem {
  id: string;
  mode: AssessmentMode;
  persona_name: string | null;
  started_at: string;
  ended_at: string | null;
  turn_count: number;
}

// UI state types

export interface ChatMessage {
  id: string;
  role: "agent" | "learner";
  content: string;
  type: "question" | "task" | "response";
  metadata?: {
    target_standard?: string;
    depth?: DepthLevel;
    task_type?: TaskType;
  };
  timestamp: Date;
}

export interface AssessmentState {
  sessionId: string | null;
  mode: AssessmentMode;
  personaName: string | null;
  status: "idle" | "connecting" | "active" | "waiting_for_input" | "complete" | "error";
  messages: ChatMessage[];
  thinkingEvents: AgentThinkingData[];
  observations: ObservationData[];
  strategyShifts: StrategyShiftData[];
  modelUpdates: ModelUpdateData[];
  report: EvidenceReport | null;
  error: string | null;
}
