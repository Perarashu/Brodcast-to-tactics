import { fetchCSV } from "./csv";

// ── Team assignments ───────────────────────────────────────────────
export const TEAM_A_IDS = new Set([7, 10, 14, 16, 17]);
export const TEAM_B_IDS = new Set([2, 4, 11, 12, 13]);

// ── CSV row types matching V1 pipeline schemas ─────────────────────
// player_coordinates_with_teams.csv — frame-by-frame player observations
// Columns: frame,player_id,x1,y1,x2,y2,center_x,center_y,_width,_height,team,jersey_color,court_x,court_y
interface CoordRow {
  frame: string;
  player_id: string;
  x1: string;
  y1: string;
  x2: string;
  y2: string;
  center_x: string;
  center_y: string;
  _width: string;
  _height: string;
  team: string;
  jersey_color: string;
  court_x: string;
  court_y: string;
  [key: string]: string;
}

// tactical_events.csv — per-frame event data with possession and pass info
// Columns: frame,ball_x,ball_y,ball_available,ball_zone,possession_player,possession_team,
//   possessor_x,possessor_y,possessor_team,possessor_zone,event_type,
//   previous_possession_player,previous_possession_team,possession_change,team_change,
//   team_a_possession,team_b_possession,pass_event,pass_from_player,pass_to_player,
//   pass_from_team,pass_to_team,pass_confidence
interface TacticalRow {
  frame: string;
  ball_x: string;
  ball_y: string;
  ball_available: string;
  ball_zone: string;
  possession_player: string;
  possession_team: string;
  possessor_x: string;
  possessor_y: string;
  possessor_team: string;
  possessor_zone: string;
  event_type: string;
  previous_possession_player: string;
  previous_possession_team: string;
  possession_change: string;
  team_change: string;
  team_a_possession: string;
  team_b_possession: string;
  pass_event: string;
  pass_from_player: string;
  pass_to_player: string;
  pass_from_team: string;
  pass_to_team: string;
  pass_confidence: string;
  [key: string]: string;
}

// ── Public types consumed by components ────────────────────────────
export interface Player {
  id: number;
  jersey: number;
  x: number; // 0-100 normalized court position
  y: number;
  speed: number;
  label: string;
  team: "A" | "B";
}

export interface TacticalEvent {
  id: string;
  time: string;
  type: "Formation" | "Press" | "Rotation" | "Set Play" | "Transition";
  description: string;
  team: "A" | "B";
  confidence: number;
}

export interface PossessionData {
  teamA: number;
  teamB: number;
  timeline: { time: string; teamA: number; teamB: number }[];
}

export interface KeyMetrics {
  totalPasses: number;
  avgSpeed: number;
  formationChanges: number;
  turnovers: number;
  shotAttempts: number;
  paintTouches: number;
}

// ── Constants for coordinate normalization ──────────────────────────
// Based on calibrate.py reference rectangle (16×19 ft → scaled to full court)
// The homography maps pixel coords to real court coords in feet
const COURT_X_MIN = 0;
const COURT_X_MAX = 60; // half-court width in feet
const COURT_Y_MIN = 0;
const COURT_Y_MAX = 50; // half-court length in feet

function normalizeCourt(val: number, min: number, max: number): number {
  return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
}

// ── Loader functions ───────────────────────────────────────────────

export async function loadPlayers(): Promise<Player[]> {
  const rows = await fetchCSV<CoordRow>("/player_coordinates_with_teams.csv");
  if (rows.length === 0) return [];

  // Filter to only valid player rows (not ball)
  const playerRows = rows.filter(
    (r) => r.player_id && r.court_x && r.court_y && r.team !== "",
  );

  // Get the latest frame for current positions
  const maxFrame = Math.max(...playerRows.map((r) => Number(r.frame)));
  const latestFrame = playerRows.filter((r) => Number(r.frame) === maxFrame);

  return latestFrame.map((r) => {
    const playerId = Number(r.player_id);
    const team: "A" | "B" = TEAM_A_IDS.has(playerId) ? "A" : "B";

    // Compute average speed from frame-to-frame displacement
    const allFrames = playerRows.filter(
      (x) => x.player_id === r.player_id,
    );
    let avgSpeed = 0;
    if (allFrames.length > 1) {
      let totalDist = 0;
      for (let i = 1; i < allFrames.length; i++) {
        const dx =
          Number(allFrames[i].court_x) -
          Number(allFrames[i - 1].court_x);
        const dy =
          Number(allFrames[i].court_y) -
          Number(allFrames[i - 1].court_y);
        totalDist += Math.sqrt(dx * dx + dy * dy);
      }
      avgSpeed = totalDist / (allFrames.length - 1);
    }

    return {
      id: playerId,
      jersey: playerId,
      x: normalizeCourt(
        Number(r.court_x),
        COURT_X_MIN,
        COURT_X_MAX,
      ),
      y: normalizeCourt(
        Number(r.court_y),
        COURT_Y_MIN,
        COURT_Y_MAX,
      ),
      speed: Math.round(avgSpeed * 10) / 10,
      label: team === "A" ? `Team A` : `Team B`,
      team,
    };
  });
}

export async function loadPossession(): Promise<PossessionData> {
  // Derive possession from tactical_events.csv which has team_a_possession, team_b_possession
  const rows = await fetchCSV<TacticalRow>("/tactical_events.csv");
  if (rows.length === 0) {
    return { teamA: 50, teamB: 50, timeline: [] };
  }

  // Use the latest frame's possession percentages
  const latest = rows[rows.length - 1];
  const teamA = Number(latest.team_a_possession) || 50;
  const teamB = Number(latest.team_b_possession) || 50;

  // Build timeline — sample every 30th frame to keep it readable
  const sampleRate = Math.max(1, Math.floor(rows.length / 40));
  const timeline = rows
    .filter((_, i) => i % sampleRate === 0)
    .map((r) => ({
      time: `F${r.frame}`,
      teamA: Number(r.team_a_possession) || 50,
      teamB: Number(r.team_b_possession) || 50,
    }));

  return { teamA, teamB, timeline };
}

export async function loadTacticalEvents(): Promise<TacticalEvent[]> {
  const rows = await fetchCSV<TacticalRow>("/tactical_events.csv");

  // Filter to frames with meaningful events (possession changes, passes, or team changes)
  const events = rows.filter(
    (r) =>
      r.event_type === "pass" ||
      r.possession_change === "true" ||
      r.team_change === "true" ||
      r.pass_event === "true",
  );

  return events.map((r, i) => {
    const team: "A" | "B" =
      r.possession_team === "0" ? "A" : "B";
    const isPass = r.pass_event === "true";
    const isPossessionChange = r.possession_change === "true";
    const isTeamChange = r.team_change === "true";

    let type: TacticalEvent["type"];
    let description: string;

    if (isPass) {
      type = "Set Play";
      const fromId = r.pass_from_player;
      const toId = r.pass_to_player;
      description = `Pass: #${fromId} → #${toId}`;
      if (r.pass_confidence) {
        description += ` (${(Number(r.pass_confidence) * 100).toFixed(0)}%)`;
      }
    } else if (isTeamChange) {
      type = "Transition";
      description = `Possession change to Team ${team}`;
    } else if (isPossessionChange) {
      type = "Rotation";
      description = `Ball secured by #${r.possession_player} (Team ${team})`;
    } else {
      type = "Formation";
      description = `${r.event_type} at zone ${r.possessor_zone || "unknown"}`;
    }

    return {
      id: `evt-${i}`,
      time: `F${r.frame}`,
      type,
      description,
      team,
      confidence: r.pass_confidence ? Number(r.pass_confidence) : 0,
    };
  });
}

export async function loadKeyMetrics(): Promise<KeyMetrics> {
  // Derive metrics from tactical_events.csv
  const rows = await fetchCSV<TacticalRow>("/tactical_events.csv");

  const totalPasses = rows.filter((r) => r.pass_event === "true").length;
  const teamChanges = rows.filter((r) => r.team_change === "true").length;

  return {
    totalPasses,
    avgSpeed: 0, // Requires multi-frame coordinate deltas — computed per-player in loadPlayers
    formationChanges: teamChanges,
    turnovers: 0, // Not directly available from V1 tactical events
    shotAttempts: 0, // Not available from V1 pipeline
    paintTouches: 0, // Not available from V1 pipeline
  };
}


