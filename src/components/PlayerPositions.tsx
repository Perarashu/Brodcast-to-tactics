import type { Player } from "../lib/dataLoader";

interface PlayerPositionsProps {
  players: Player[];
}

function PlayerRow({
  player,
  teamColor,
}: {
  player: Player;
  teamColor: "a" | "b";
}) {
  const borderColor =
    teamColor === "a" ? "border-team-a/30" : "border-team-b/30";
  const dotColor = teamColor === "a" ? "bg-team-a" : "bg-team-b";
  const textColor =
    teamColor === "a" ? "text-team-a-light" : "text-team-b-light";

  return (
    <div
      className={`flex items-center justify-between rounded-lg border ${borderColor} bg-navy-800/40 px-3 py-2 transition-colors hover:bg-navy-700/40`}
    >
      <div className="flex items-center gap-2.5">
        <div className={`h-2 w-2 rounded-full ${dotColor}`} />
        <span className="text-sm font-semibold text-white">#{player.jersey}</span>
        <span className={`text-xs ${textColor}`}>{player.label}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-navy-300">{player.speed} ft</span>
        <span className="font-mono text-[10px] text-navy-400">
          ({player.x.toFixed(0)}, {player.y.toFixed(0)})
        </span>
      </div>
    </div>
  );
}

export function PlayerPositions({ players }: PlayerPositionsProps) {
  const teamAPlayers = players.filter((p) => p.team === "A");
  const teamBPlayers = players.filter((p) => p.team === "B");

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Team A */}
      <div className="rounded-xl border border-card-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-team-a" />
          <h4 className="text-sm font-semibold text-team-a-light">
            Team A — Starting 5
          </h4>
        </div>
        <div className="flex flex-col gap-1.5">
          {teamAPlayers.length > 0 ? (
            teamAPlayers.map((p) => (
              <PlayerRow key={p.id} player={p} teamColor="a" />
            ))
          ) : (
            <p className="text-xs text-navy-400 italic">
              Awaiting player coordinates CSV
            </p>
          )}
        </div>
      </div>

      {/* Team B */}
      <div className="rounded-xl border border-card-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-team-b" />
          <h4 className="text-sm font-semibold text-team-b-light">
            Team B — Starting 5
          </h4>
        </div>
        <div className="flex flex-col gap-1.5">
          {teamBPlayers.length > 0 ? (
            teamBPlayers.map((p) => (
              <PlayerRow key={p.id} player={p} teamColor="b" />
            ))
          ) : (
            <p className="text-xs text-navy-400 italic">
              Awaiting player coordinates CSV
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
