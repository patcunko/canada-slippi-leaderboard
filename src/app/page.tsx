import { Suspense } from "react";
import { fetchAllPlayers } from "@/lib/fetch-players";
import { PLAYERS, LEADERBOARD_TITLE, LEADERBOARD_REGION } from "@/config/players";
import LeaderboardView from "@/components/LeaderboardView";
import Timestamp from "@/components/Timestamp";

export default async function Home() {
  let players: import("@/lib/slippi").SlippiPlayer[] = [];
  let fetchError = false;
  if (PLAYERS.length > 0) {
    try {
      players = await fetchAllPlayers(PLAYERS);
    } catch {
      fetchError = true;
    }
  }

  return (
    <div className="min-h-screen bg-[#222224]">
      {/* Canadian header bar */}
      <div className="w-full px-6 py-3 flex items-center gap-3 bg-[#cc0000] border-b border-[#990000]">
        <span className="text-2xl leading-none">🍁</span>
        <span className="text-white font-bold text-lg tracking-wide">
          {LEADERBOARD_REGION} · Slippi
        </span>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#f2f2f7]">{LEADERBOARD_TITLE}</h1>
          <p className="mt-1 text-sm text-[#636366]">
            Updates every 12 hours · Last cached: <Suspense fallback={null}><Timestamp /></Suspense>
            <span className="ml-3">· {players.length} players</span>
          </p>
        </div>

        {players.length === 0 ? (
          <div className="rounded-lg px-6 py-16 text-center bg-[#2c2c2e] border border-[#48484a]">
            <p className="text-[#636366] text-base">
              {PLAYERS.length === 0
                ? "No players configured — add connect codes to src/config/players.ts"
                : fetchError
                ? "Could not load player data. The Slippi API may be temporarily unavailable."
                : "No player data returned."}
            </p>
          </div>
        ) : (
          <LeaderboardView players={players} />
        )}

        <p className="mt-5 text-xs text-[#48484a] text-center">
          Data from the unofficial Slippi GG API · Rankings may not reflect real-time standings
        </p>
      </div>
    </div>
  );
}
