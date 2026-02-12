import type { EvidenceReport } from "./types";

export function reportToMarkdown(report: EvidenceReport): string {
  const name = report.persona_name ?? "Anonymous";
  const date = report.started_at.slice(0, 10);
  const lines: string[] = [
    "# Evidence of Learning Report",
    "",
    `**Learner**: ${name}`,
    `**Date**: ${date}`,
    "**Domain**: Fractions (CCSS-M Grades 2-5)",
    `**Assessment Duration**: ${report.turn_count} turns`,
    "",
    "---",
    "",
    "## Progression Summary",
    "",
    report.progression_summary || "Not available.",
    "",
    "---",
    "",
    "## Standards Evidence Map",
    "",
  ];

  for (const std of report.standards_evidence_map) {
    lines.push(`### ${std.standard_code}: ${std.standard_description}`);
    lines.push(`- **Status**: ${std.status}`);
    lines.push(`- **Confidence**: ${std.confidence}`);
    if (std.evidence?.length) {
      lines.push("- **Evidence**:");
      for (const e of std.evidence) {
        lines.push(`  - ${e}`);
      }
    }
    if (std.learning_components?.length) {
      lines.push("- **Learning Components**:");
      for (const lc of std.learning_components) {
        lines.push(`  - ${lc.code}: ${lc.description} — ${lc.status}`);
      }
    }
    lines.push("");
  }

  lines.push("---", "", "## Misconception Report", "");
  for (const m of report.misconception_report) {
    lines.push(`### ${m.description}`);
    lines.push(`- **Status**: ${m.status}`);
    lines.push(`- **Evidence**: ${m.evidence}`);
    lines.push("");
  }

  lines.push("---", "", "## Overall Narrative", "");
  lines.push(report.overall_narrative || "Not available.");
  lines.push("", "---", "", "## Recommended Next Steps", "");
  for (const step of report.recommended_next_steps) {
    lines.push(`- ${step}`);
  }

  return lines.join("\n");
}

export function downloadMarkdown(report: EvidenceReport): void {
  const md = reportToMarkdown(report);
  const blob = new Blob([md], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `assessment-report-${report.session_id.slice(0, 8)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
