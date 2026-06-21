import { fetchAllPlayers } from "@/lib/slippi";
import { PLAYERS, LEADERBOARD_TITLE, LEADERBOARD_REGION } from "@/config/players";
import PlayerRow from "@/components/PlayerRow";

export const revalidate = 43200; // 12 hours

export default async function Home() {
  const players = PLAYERS.length > 0 ? await fetchAllPlayers(PLAYERS) : [];
  const updatedAt = new Date().toLocaleString("en-CA", {
    timeZone: "America/Toronto",
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
            {LEADERBOARD_REGION} · Slippi Ranked
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {LEADERBOARD_TITLE}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Updated every 12 hours · Last cached:{" "}
            <span className="text-zinc-400">{updatedAt} ET</span>
          </p>
        </div>

        {/* Table */}
        {players.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-16 text-center">
            <p className="text-zinc-500 text-lg">
              {PLAYERS.length === 0
                ? "No players configured yet. Add connect codes to src/config/players.ts"
                : "Could not load player data. The Slippi API may be temporarily unavailable."}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 text-center w-10">#</th>
                  <th className="py-3 px-4 text-left">Player</th>
                  <th className="py-3 px-4 text-center hidden sm:table-cell">Rank</th>
                  <th className="py-3 px-4 text-right">Rating</th>
                  <th className="py-3 px-4 text-center hidden md:table-cell">W / L</th>
                  <th className="py-3 px-4 text-left hidden lg:table-cell">Main</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, i) => (
                  <PlayerRow key={player.connectCode} player={player} position={i + 1} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-6 text-xs text-zinc-600 text-center">
          Data sourced from the unofficial Slippi GG API · May not reflect real-time rankings
        </p>
      </div>
    </div>
  );
}
