import type { StandardEvidenceReport } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { StandardCard } from "./StandardCard";

export function StandardsMap({ standards }: { standards: StandardEvidenceReport[] }) {
  const byGrade = standards.reduce<Record<string, StandardEvidenceReport[]>>((acc, s) => {
    const grade = s.standard_code.split(".")[0];
    (acc[grade] ??= []).push(s);
    return acc;
  }, {});

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Standards Evidence Map</h2>
      {Object.entries(byGrade)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([grade, stds]) => (
          <div key={grade} className="mb-4 last:mb-0">
            <h3 className="mb-2 text-sm font-medium text-gray-500">Grade {grade}</h3>
            <div className="space-y-3">
              {stds.map((s) => (
                <StandardCard key={s.standard_code} standard={s} />
              ))}
            </div>
          </div>
        ))}
    </Card>
  );
}
