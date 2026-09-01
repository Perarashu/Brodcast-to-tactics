import { useState, useEffect } from "react";
import {
  loadPlayers,
  loadPossession,
  loadTacticalEvents,
  loadKeyMetrics,
  type Player,
  type TacticalEvent,
  type PossessionData,
  type KeyMetrics,
} from "./dataLoader";

export interface DashboardData {
  players: Player[];
  possession: PossessionData;
  tacticalEvents: TacticalEvent[];
  keyMetrics: KeyMetrics;
  loading: boolean;
  error: string | null;
}

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    players: [],
    possession: { teamA: 50, teamB: 50, timeline: [] },
    tacticalEvents: [],
    keyMetrics: {
      totalPasses: 0,
      avgSpeed: 0,
      formationChanges: 0,
      turnovers: 0,
      shotAttempts: 0,
      paintTouches: 0,
    },
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [players, possession, tacticalEvents, keyMetrics] =
          await Promise.all([
            loadPlayers(),
            loadPossession(),
            loadTacticalEvents(),
            loadKeyMetrics(),
          ]);

        if (!cancelled) {
          setData({
            players,
            possession,
            tacticalEvents,
            keyMetrics,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setData((prev) => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : "Failed to load data",
          }));
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}
