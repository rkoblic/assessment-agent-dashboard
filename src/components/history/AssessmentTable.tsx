"use client";

import Link from "next/link";
import type { AssessmentListItem } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

export function AssessmentTable({ assessments }: { assessments: AssessmentListItem[] }) {
  if (assessments.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-gray-500">
        No assessments found.{" "}
        <Link href="/" className="text-blue-600 hover:underline">
          Start one
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-xs font-medium uppercase tracking-wider text-gray-500">
            <th className="px-4 py-3">Session</th>
            <th className="px-4 py-3">Mode</th>
            <th className="px-4 py-3">Persona</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Turns</th>
          </tr>
        </thead>
        <tbody>
          {assessments.map((a) => (
            <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3">
                <Link href={`/report/${a.id}`} className="text-blue-600 hover:underline">
                  {a.id.slice(0, 8)}...
                </Link>
              </td>
              <td className="px-4 py-3">
                <Badge
                  className={
                    a.mode === "synthetic"
                      ? "border-purple-300 bg-purple-100 text-purple-800"
                      : "border-blue-300 bg-blue-100 text-blue-800"
                  }
                >
                  {a.mode}
                </Badge>
              </td>
              <td className="px-4 py-3 text-gray-700">{a.persona_name ?? "—"}</td>
              <td className="px-4 py-3 text-gray-600">{a.started_at.slice(0, 10)}</td>
              <td className="px-4 py-3 text-gray-600">{a.turn_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
