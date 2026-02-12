"use client";

import { useState } from "react";
import type { ConversationTurn } from "@/lib/types";
import { Card } from "@/components/ui/Card";

export function ConversationLog({ turns }: { turns: ConversationTurn[] }) {
  const [open, setOpen] = useState(false);

  if (turns.length === 0) return null;

  return (
    <Card>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
      >
        <h2 className="text-lg font-semibold text-gray-900">
          Conversation Log ({turns.length} turns)
        </h2>
        <span className="text-gray-400">{open ? "Collapse" : "Expand"}</span>
      </button>
      {open && (
        <div className="mt-4 space-y-3">
          {turns.map((turn) => (
            <div
              key={turn.turn_number}
              className={`rounded-lg p-3 ${
                turn.role === "agent" ? "bg-gray-50" : "bg-blue-50"
              }`}
            >
              <div className="mb-1 text-xs font-medium text-gray-500">
                Turn {turn.turn_number} &middot; {turn.role}
              </div>
              <p className="whitespace-pre-wrap text-sm text-gray-700">{turn.content}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
