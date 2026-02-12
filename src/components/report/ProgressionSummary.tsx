import { Card } from "@/components/ui/Card";

export function ProgressionSummary({ summary }: { summary: string }) {
  return (
    <Card>
      <h2 className="mb-3 text-lg font-semibold text-gray-900">Progression Summary</h2>
      <p className="text-sm leading-relaxed text-gray-700">{summary || "Not available."}</p>
    </Card>
  );
}
