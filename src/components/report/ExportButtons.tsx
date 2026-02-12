"use client";

import type { EvidenceReport } from "@/lib/types";
import { downloadMarkdown } from "@/lib/report-export";

export function ExportButtons({ report }: { report: EvidenceReport }) {
  return (
    <div className="flex gap-2" data-no-print>
      <button
        onClick={() => downloadMarkdown(report)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Download Markdown
      </button>
      <button
        onClick={() => window.print()}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Print / PDF
      </button>
    </div>
  );
}
