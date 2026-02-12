import { Card } from "@/components/ui/Card";

export function NarrativeSummary({ narrative }: { narrative: string }) {
  return (
    <Card>
      <h2 className="mb-3 text-lg font-semibold text-gray-900">Overall Narrative</h2>
      <p className="text-sm leading-relaxed text-gray-700">{narrative || "Not available."}</p>
    </Card>
  );
}
