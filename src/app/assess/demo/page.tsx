"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAssessment } from "@/hooks/useAssessment";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { DemoSidebar } from "@/components/sidebar/DemoSidebar";
import { Spinner } from "@/components/ui/Spinner";

function DemoContent() {
  const searchParams = useSearchParams();
  const persona = searchParams.get("persona") ?? "Mia";
  const { state, startAssessment } = useAssessment();

  useEffect(() => {
    startAssessment("synthetic", persona);
  }, [startAssessment, persona]);

  if (state.status === "connecting") {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="text-center">
          <Spinner className="mx-auto mb-2" />
          <p className="text-sm text-gray-500">Starting synthetic assessment with {persona}...</p>
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
            onClick={() => startAssessment("synthetic", persona)}
            className="text-sm text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <div className="flex flex-1 flex-col">
        <div className="border-b border-gray-200 bg-white px-4 py-2">
          <span className="text-sm text-gray-500">
            Synthetic Demo &middot; Persona: <strong>{persona}</strong>
            {state.status === "complete" && " \u00b7 Complete"}
          </span>
        </div>
        <ChatContainer
          messages={state.messages}
          isLoading={state.status === "active"}
        />
        {state.status === "complete" && state.sessionId && (
          <div className="border-t border-gray-200 bg-white p-4">
            <Link
              href={`/report/${state.sessionId}`}
              className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              View Report
            </Link>
          </div>
        )}
      </div>
      <div className="hidden w-[400px] border-l border-gray-200 bg-gray-50 lg:block">
        <DemoSidebar state={state} />
      </div>
    </div>
  );
}

export default function DemoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <DemoContent />
    </Suspense>
  );
}
