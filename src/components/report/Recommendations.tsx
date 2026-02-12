import { Card } from "@/components/ui/Card";

export function Recommendations({ steps }: { steps: string[] }) {
  if (steps.length === 0) return null;

  return (
    <Card>
      <h2 className="mb-3 text-lg font-semibold text-gray-900">Recommended Next Steps</h2>
      <ul className="space-y-2">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-2 text-sm text-gray-700">
            <span className="shrink-0 font-medium text-blue-600">{i + 1}.</span>
            {step}
          </li>
        ))}
      </ul>
    </Card>
  );
}
