import { useState } from 'react';
import { actorConfig, flows } from '../../types/ForAuthFlow';
import { SubHeading } from '../typography/Heading';

export default function AuthFlows() {
  const [activeFlow, setActiveFlow] = useState(flows[0].id);
  const flow = flows.find((f) => f.id === activeFlow)!;

  return (
    <div>
      <div className="mb-5">
        <SubHeading text="Auth flows" />

      </div>

      {/* FLOW TABS */}
      <div className="flex flex-wrap gap-2 mb-5">
        {flows.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFlow(f.id)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition
              ${activeFlow === f.id
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
          >
            {f.title}
          </button>
        ))}
      </div>

      {/* ACTOR LEGEND */}
      <div className="flex flex-wrap gap-3 mb-5">
        {Object.entries(actorConfig).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${val.dot}`} />
            <span className="text-xs text-slate-500">{val.label}</span>
          </div>
        ))}
      </div>

      {/* STEPS */}
      <div className="space-y-2">
        {flow.steps.map((step, i) => {
          const actor = actorConfig[step.actor];
          return (
            <div key={i} className="flex gap-3 items-start">

              {/*  NUMBERING */}
              <div className="flex flex-col items-center shrink-0">
                
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                {i < flow.steps.length - 1 && (
                  <div className="w-px h-6 bg-slate-200 mt-1" />
                )}
              </div>

              {/* CONTENT */}
              <div className="flex-1 bg-white border border-slate-100 rounded-xl p-3 mb-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${actor.bg} ${actor.text}`}>
                    {actor.label}
                  </span>
                  <span className="text-sm font-medium text-slate-800">{step.text}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{step.detail}</p>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}