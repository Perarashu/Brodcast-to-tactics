import {
  Users,
  Timer,
  CircleDot,
  Activity,
  Zap,
  Gauge,
} from "lucide-react";
import type { Player, KeyMetrics, PossessionData } from "../lib/dataLoader";

interface SidebarProps {
  players: Player[];
  keyMetrics: KeyMetrics;
  possession: PossessionData;
}

function MetricRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-navy-800/50 px-3 py-2">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-navy-300" />
        <span className="text-xs text-navy-200">{label}</span>
      </div>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

export function Sidebar({ players, keyMetrics, possession }: SidebarProps) {
  const teamACount = players.filter((p) => p.team === "A").length;
  const teamBCount = players.filter((p) => p.team === "B").length;
  const teamAAvgSpeed =
    teamACount > 0
      ? (
          players
            .filter((p) => p.team === "A")
            .reduce((s, p) => s + p.speed, 0) / teamACount
        ).toFixed(1)
      : "—";
  const teamBAvgSpeed =
    teamBCount > 0
      ? (
          players
            .filter((p) => p.team === "B")
            .reduce((s, p) => s + p.speed, 0) / teamBCount
        ).toFixed(1)
      : "—";

  return (
    <aside className="flex w-64 flex-col gap-4 overflow-y-auto border-r border-card-border bg-navy-900/60 p-4">
      {/* Team A */}
      <div className="rounded-xl border border-team-a-border bg-team-a-bg p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-team-a" />
          <span className="text-sm font-semibold text-team-a-light">Team A</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div>
            <p className="text-xl font-bold text-white">{teamACount || "—"}</p>
            <p className="text-[10px] uppercase tracking-wider text-navy-300">
              Players
            </p>
          </div>
          <div>
            <p className="text-xl font-bold text-white">{teamAAvgSpeed}</p>
            <p className="text-[10px] uppercase tracking-wider text-navy-300">
              Avg MPH
            </p>
          </div>
        </div>
      </div>

      {/* Team B */}
      <div className="rounded-xl border border-team-b-border bg-team-b-bg p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-team-b" />
          <span className="text-sm font-semibold text-team-b-light">Team B</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div>
            <p className="text-xl font-bold text-white">{teamBCount || "—"}</p>
            <p className="text-[10px] uppercase tracking-wider text-navy-300">
              Players
            </p>
          </div>
          <div>
            <p className="text-xl font-bold text-white">{teamBAvgSpeed}</p>
            <p className="text-[10px] uppercase tracking-wider text-navy-300">
              Avg MPH
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics — only show metrics backed by pipeline data */}
      <div className="rounded-xl border border-card-border bg-card p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-navy-300">
          Key Metrics
        </h3>
        <div className="flex flex-col gap-2">
          <MetricRow
            icon={Gauge}
            label="Avg Speed"
            value={keyMetrics.avgSpeed > 0 ? `${keyMetrics.avgSpeed} mph` : "—"}
          />
          <MetricRow
            icon={Zap}
            label="Players Tracked"
            value={players.length > 0 ? players.length : "—"}
          />
        </div>
        <p className="mt-3 text-[9px] text-navy-500 italic">
          Passes, paint touches, turnovers — available when connected to event
          detection pipeline.
        </p>
      </div>

      {/* Ball Possession */}
      <div className="rounded-xl border border-card-border bg-card p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-navy-300">
          Ball Possession
        </h3>
        <div className="mb-2 flex items-center gap-3">
          <CircleDot className="h-3.5 w-3.5 text-team-a" />
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-navy-700">
            <div
              className="h-full rounded-full bg-team-a transition-all duration-500"
              style={{ width: `${possession.teamA}%` }}
            />
          </div>
          <span className="w-9 text-right text-sm font-semibold text-team-a-light">
            {possession.teamA}%
          </span>
        </div>
        <div className="flex items-center gap-3">
          <CircleDot className="h-3.5 w-3.5 text-team-b" />
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-navy-700">
            <div
              className="h-full rounded-full bg-team-b transition-all duration-500"
              style={{ width: `${possession.teamB}%` }}
            />
          </div>
          <span className="w-9 text-right text-sm font-semibold text-team-b-light">
            {possession.teamB}%
          </span>
        </div>
      </div>

      {/* Players Tracked */}
      <div className="rounded-xl border border-card-border bg-card p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-navy-300">
          Players Tracked
        </h3>
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-team-a" />
          <div>
            <p className="text-lg font-bold text-white">
              {players.length > 0 ? `${players.length} / 10` : "—"}
            </p>
            <p className="text-[10px] text-navy-300">
              {players.length > 0 ? "All players detected" : "Awaiting data"}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Activity className="h-5 w-5 text-green-400" />
          <div>
            <p className="text-lg font-bold text-white">
              <Timer className="mr-1 inline h-3.5 w-3.5" />
              {players.length > 0 ? "12:47" : "—"}
            </p>
            <p className="text-[10px] text-navy-300">Tracking duration</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
