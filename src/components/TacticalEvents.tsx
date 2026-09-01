import {
  Users,
  Shield,
  RotateCcw,
  Zap,
  PlayCircle,
} from "lucide-react";
import type { TacticalEvent } from "../lib/dataLoader";

interface TacticalEventsProps {
  events: TacticalEvent[];
}

const eventIcons: Record<string, React.ElementType> = {
  Formation: Users,
  Press: Shield,
  Rotation: RotateCcw,
  Transition: Zap,
  "Set Play": PlayCircle,
};

const eventColors: Record<string, string> = {
  Formation: "bg-purple-500/20 text-purple-300",
  Press: "bg-amber-500/20 text-amber-300",
  Rotation: "bg-cyan-500/20 text-cyan-300",
  Transition: "bg-green-500/20 text-green-300",
  "Set Play": "bg-blue-500/20 text-blue-300",
};

export function TacticalEvents({ events }: TacticalEventsProps) {
  return (
    <div className="rounded-xl border border-card-border bg-card overflow-hidden">
      <div className="border-b border-card-border px-4 py-2.5">
        <h4 className="text-sm font-semibold text-white">Tactical Events</h4>
      </div>
      <div className="max-h-48 overflow-y-auto p-2">
        {events.length > 0 ? (
          events.map((event) => {
            const Icon = eventIcons[event.type] || Zap;
            const colorClass =
              eventColors[event.type] || "bg-navy-600/30 text-navy-200";
            const teamBadge =
              event.team === "A"
                ? "bg-team-a/20 text-team-a-light"
                : "bg-team-b/20 text-team-b-light";

            return (
              <div
                key={event.id}
                className="flex items-start gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-navy-800/40"
              >
                <div
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${colorClass}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white">
                      {event.type}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${teamBadge}`}
                    >
                      Team {event.team}
                    </span>
                    {event.confidence > 0 && (
                      <span className="text-[9px] text-navy-500">
                        {(event.confidence * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-navy-300">
                    {event.description}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[10px] text-navy-400">
                  {event.time}
                </span>
              </div>
            );
          })
        ) : (
          <p className="px-3 py-4 text-center text-xs text-navy-400 italic">
            Awaiting tactical events CSV
          </p>
        )}
      </div>
    </div>
  );
}
