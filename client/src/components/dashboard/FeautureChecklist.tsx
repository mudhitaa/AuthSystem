import { categories , categoryColors, features } from "../../schemas/Features";
import { SubHeading } from "../typography/Heading";

export default function FeatureChecklist() {
  return (
    <div>
      <div className="mb-5">
        <SubHeading text="What's implemented?" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div key={cat}>
            <div className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border mb-3 ${categoryColors[cat]}`}>
              {cat}
            </div>
            <div className="space-y-2">
              {features.filter((f) => f.category === cat).map((f) => (
                <div key={f.label} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-2.5 h-2.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{f.label}</p>
                    <p className="text-xs text-slate-500">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}