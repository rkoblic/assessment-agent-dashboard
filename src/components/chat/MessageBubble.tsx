import type { ChatMessage } from "@/lib/types";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isAgent = message.role === "agent";
  const isTask = message.type === "task";

  return (
    <div className={`flex ${isAgent ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isAgent
            ? isTask
              ? "border-2 border-blue-200 bg-blue-50 text-gray-900"
              : "bg-gray-100 text-gray-900"
            : "bg-blue-600 text-white"
        }`}
      >
        <div className="mb-1 text-xs font-medium opacity-70">
          {isAgent ? (isTask ? "Task" : "Agent") : "Learner"}
        </div>
        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        {message.metadata?.target_standard && (
          <div className="mt-1 text-xs opacity-50">
            Standard: {message.metadata.target_standard}
          </div>
        )}
      </div>
    </div>
  );
}
