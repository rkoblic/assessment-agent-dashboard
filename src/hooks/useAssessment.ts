"use client";

import { useCallback, useReducer, useRef } from "react";
import { connectSSE } from "@/lib/sse";
import type {
  AssessmentMode,
  AssessmentState,
  ChatMessage,
  AgentThinkingData,
  AgentQuestionData,
  AgentTaskData,
  LearnerResponseData,
  ObservationData,
  ModelUpdateData,
  StrategyShiftData,
  AssessmentCompleteData,
  EvidenceReport,
} from "@/lib/types";

// --- Reducer ---

type Action =
  | { type: "START_CONNECTION"; mode: AssessmentMode; personaName: string | null }
  | { type: "SESSION_STARTED"; sessionId: string }
  | { type: "AGENT_THINKING"; data: AgentThinkingData }
  | { type: "AGENT_QUESTION"; data: AgentQuestionData }
  | { type: "AGENT_TASK"; data: AgentTaskData }
  | { type: "LEARNER_RESPONSE"; data: LearnerResponseData }
  | { type: "OBSERVATION"; data: ObservationData }
  | { type: "MODEL_UPDATE"; data: ModelUpdateData }
  | { type: "STRATEGY_SHIFT"; data: StrategyShiftData }
  | { type: "ASSESSMENT_COMPLETE"; data: AssessmentCompleteData }
  | { type: "WAITING_FOR_INPUT" }
  | { type: "SUBMITTING_RESPONSE"; message: string }
  | { type: "ERROR"; error: string };

const initialState: AssessmentState = {
  sessionId: null,
  mode: "synthetic",
  personaName: null,
  status: "idle",
  messages: [],
  thinkingEvents: [],
  observations: [],
  strategyShifts: [],
  modelUpdates: [],
  report: null,
  error: null,
};

function makeMessage(
  role: "agent" | "learner",
  content: string,
  type: ChatMessage["type"],
  metadata?: ChatMessage["metadata"],
): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    type,
    metadata,
    timestamp: new Date(),
  };
}

function reducer(state: AssessmentState, action: Action): AssessmentState {
  switch (action.type) {
    case "START_CONNECTION":
      return {
        ...initialState,
        mode: action.mode,
        personaName: action.personaName,
        status: "connecting",
      };

    case "SESSION_STARTED":
      return { ...state, sessionId: action.sessionId, status: "active" };

    case "AGENT_THINKING":
      return {
        ...state,
        thinkingEvents: [...state.thinkingEvents, action.data],
      };

    case "AGENT_QUESTION":
      return {
        ...state,
        status: state.mode === "real" ? "waiting_for_input" : "active",
        messages: [
          ...state.messages,
          makeMessage("agent", action.data.question, "question", {
            target_standard: action.data.target_standard,
            depth: action.data.depth,
          }),
        ],
      };

    case "AGENT_TASK":
      return {
        ...state,
        status: state.mode === "real" ? "waiting_for_input" : "active",
        messages: [
          ...state.messages,
          makeMessage("agent", action.data.task_content, "task", {
            target_standard: action.data.target_standard,
            task_type: action.data.task_type,
          }),
        ],
      };

    case "LEARNER_RESPONSE":
      return {
        ...state,
        messages: [
          ...state.messages,
          makeMessage("learner", action.data.response, "response"),
        ],
      };

    case "OBSERVATION":
      return {
        ...state,
        observations: [...state.observations, action.data],
      };

    case "MODEL_UPDATE":
      return {
        ...state,
        modelUpdates: [...state.modelUpdates, action.data],
      };

    case "STRATEGY_SHIFT":
      return {
        ...state,
        strategyShifts: [...state.strategyShifts, action.data],
      };

    case "ASSESSMENT_COMPLETE":
      return {
        ...state,
        status: "complete",
        report: action.data.report,
      };

    case "WAITING_FOR_INPUT":
      return { ...state, status: "waiting_for_input" };

    case "SUBMITTING_RESPONSE":
      return {
        ...state,
        status: "active",
        messages: [
          ...state.messages,
          makeMessage("learner", action.message, "response"),
        ],
      };

    case "ERROR":
      return { ...state, status: "error", error: action.error };

    default:
      return state;
  }
}

// --- Hook ---

export function useAssessment() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const abortRef = useRef<AbortController | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const handleSSEEvent = useCallback((eventType: string, data: unknown) => {
    const d = data as Record<string, unknown>;
    switch (eventType) {
      case "session_started":
        sessionIdRef.current = d.session_id as string;
        dispatch({ type: "SESSION_STARTED", sessionId: d.session_id as string });
        break;
      case "agent_thinking":
        dispatch({ type: "AGENT_THINKING", data: d as unknown as AgentThinkingData });
        break;
      case "agent_question":
        dispatch({ type: "AGENT_QUESTION", data: d as unknown as AgentQuestionData });
        break;
      case "agent_task":
        dispatch({ type: "AGENT_TASK", data: d as unknown as AgentTaskData });
        break;
      case "learner_response":
        dispatch({ type: "LEARNER_RESPONSE", data: d as unknown as LearnerResponseData });
        break;
      case "observation":
        dispatch({ type: "OBSERVATION", data: d as unknown as ObservationData });
        break;
      case "model_update":
        dispatch({ type: "MODEL_UPDATE", data: d as unknown as ModelUpdateData });
        break;
      case "strategy_shift":
        dispatch({ type: "STRATEGY_SHIFT", data: d as unknown as StrategyShiftData });
        break;
      case "assessment_complete":
        dispatch({ type: "ASSESSMENT_COMPLETE", data: d as unknown as AssessmentCompleteData });
        break;
    }
  }, []);

  const startAssessment = useCallback(
    (mode: AssessmentMode, personaName?: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      dispatch({ type: "START_CONNECTION", mode, personaName: personaName ?? null });

      connectSSE({
        path: "/assess",
        body: { mode, persona_name: personaName ?? undefined },
        signal: controller.signal,
        onEvent: handleSSEEvent,
        onError: (err) => dispatch({ type: "ERROR", error: err.message }),
        onComplete: () => {
          // For real mode, the initial stream ends after the first question
          // The status will already be waiting_for_input from AGENT_QUESTION
        },
      });
    },
    [handleSSEEvent],
  );

  const submitResponse = useCallback(
    (message: string) => {
      const sessionId = sessionIdRef.current;
      if (!sessionId) return;

      dispatch({ type: "SUBMITTING_RESPONSE", message });

      const controller = new AbortController();
      abortRef.current = controller;

      connectSSE({
        path: `/assess/${sessionId}/respond`,
        body: { message },
        signal: controller.signal,
        onEvent: handleSSEEvent,
        onError: (err) => dispatch({ type: "ERROR", error: err.message }),
      });
    },
    [handleSSEEvent],
  );

  const cancelAssessment = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  return { state, startAssessment, submitResponse, cancelAssessment };
}
