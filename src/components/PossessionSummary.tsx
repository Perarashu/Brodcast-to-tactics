import type { PossessionData } from "../lib/dataLoader";

interface PossessionSummaryProps {
  possession: PossessionData;
}

export function PossessionSummary({ possession }: PossessionSummaryProps) {
  const { teamA, teamB, timeline } = possession;

  return (
    <div className="rounded-xl border border-card-border bg-card overflow-hidden">
      <div className="border-b border-card-border px-4 py-2.5">
        <h4 className="text-sm font-semibold text-white">Possession Summary</h4>
      </div>
      <div className="p-4">
        {/* Main bar */}
        <div className="mb-4">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-medium text-team-a-light">
              Team A
            </span>
            <span className="text-xs font-medium text-navy-300">
              Ball Possession
            </span>
            <span className="text-xs font-medium text-team-b-light">
              Team B
            </span>
          </div>
          <div className="flex h-8 overflow-hidden rounded-lg bg-navy-700">
            <div
              className="flex items-center justify-center bg-team-a text-xs font-bold text-white transition-all duration-700"
              style={{ width: `${teamA}%` }}
            >
              {teamA}%
            </div>
            <div
              className="flex items-center justify-center bg-team-b text-xs font-bold text-white transition-all duration-700"
              style={{ width: `${teamB}%` }}
            >
              {teamB}%
            </div>
          </div>
        </div>

        {/* Timeline */}
        {timeline.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-wider text-navy-400">
              Possession Over Time
            </p>
            <div className="flex items-end gap-1">
              {timeline.map((point) => (
                <div
                  key={point.time}
                  className="group relative flex-1"
                >
                  <div className="flex h-12 flex-col justify-end gap-px">
                    <div
                      className="rounded-t bg-team-b transition-all duration-300 group-hover:bg-team-b-light"
                      style={{ height: `${point.teamB * 0.48}px` }}
                    />
                    <div
                      className="rounded-t bg-team-a transition-all duration-300 group-hover:bg-team-a-light"
                      style={{ height: `${point.teamA * 0.48}px` }}
                    />
                  </div>
                  <p className="mt-1 text-center text-[9px] text-navy-400">
                    {point.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
