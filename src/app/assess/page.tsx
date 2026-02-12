"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAssessment } from "@/hooks/useAssessment";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatInput } from "@/components/chat/ChatInput";
import { Spinner } from "@/components/ui/Spinner";

export default function RealAssessPage() {
  const router = useRouter();
  const { state, startAssessment, submitResponse } = useAssessment();

  useEffect(() => {
    startAssessment("real");
  }, [startAssessment]);

  useEffect(() => {
    if (state.status === "complete" && state.sessionId) {
      router.push(`/report/${state.sessionId}`);
    }
  }, [state.status, state.sessionId, router]);

  if (state.status === "connecting") {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="text-center">
          <Spinner className="mx-auto mb-2" />
          <p className="text-sm text-gray-500">Connecting to assessment agent...</p>
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="text-center">
          <p className="mb-2 text-red-600">Error: {state.error}</p>
          <button
            onClick={() => startAssessment("real")}
            className="text-sm text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <ChatContainer
        messages={state.messages}
        isLoading={state.status === "active"}
      />
      <ChatInput
        onSubmit={submitResponse}
        disabled={state.status !== "waiting_for_input"}
      />
    </div>
  );
}
