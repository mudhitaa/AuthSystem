import { stack } from "../../schemas/Tech";
import { SubHeading } from "../typography/Heading";

export default function TechStack() {
  return (
    <div>
      <div className="mb-3">
        <SubHeading text="Tech stack" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stack.map((item) => (
          <div key={item.name} className={`rounded-xl border p-5 ${item.color}`}>

            {/* HEADER */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <SubHeading text={item.name} />
                <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-2 ${item.accent}`}>
                  {item.category}
                </span>
              </div>
            </div>
           
            <div className="mb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Why</p>
              <p className="text-xs text-slate-600 leading-relaxed">{item.why}</p>
            </div>

            <div className="mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">How it's used</p>
              <p className="text-xs text-slate-600 leading-relaxed">{item.how}</p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {item.features.map((f) => (
                <span key={f} className="text-xs bg-white/70 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                  {f}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}