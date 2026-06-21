"use client";
import { useState, useMemo } from "react";
import { SlippiPlayer } from "@/lib/slippi";
import { PROVINCE_NAMES } from "@/config/players";
import PlayerRow from "./PlayerRow";

export default function LeaderboardView({ players }: { players: SlippiPlayer[] }) {
  const [province, setProvince] = useState<string>("ALL");

  const provinces = useMemo(() => {
    const set = new Set(players.map((p) => p.province));
    return Array.from(set).sort((a, b) => {
      // Sort by player count descending, then alphabetically
      const countA = players.filter((p) => p.province === a).length;
      const countB = players.filter((p) => p.province === b).length;
      return countB - countA || a.localeCompare(b);
    });
  }, [players]);

  const filtered = useMemo(
    () => (province === "ALL" ? players : players.filter((p) => p.province === province)),
    [players, province]
  );

  // Global rank positions (across all players, not just filtered)
  const rankMap = useMemo(
    () => Object.fromEntries(players.map((p, i) => [p.connectCode, i + 1])),
    [players]
  );

  return (
    <>
      {/* Province filter pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setProvince("ALL")}
          className="px-3 py-1 rounded text-xs font-semibold transition-colors"
          style={{
            background: province === "ALL" ? "#cc0000" : "#2c2c2e",
            color: province === "ALL" ? "#fff" : "#aeaeb2",
            border: `1px solid ${province === "ALL" ? "#cc0000" : "#48484a"}`,
          }}
        >
          All
        </button>
        {provinces.map((prov) => (
          <button
            key={prov}
            onClick={() => setProvince(prov)}
            title={PROVINCE_NAMES[prov] ?? prov}
            className="px-3 py-1 rounded text-xs font-semibold transition-colors"
            style={{
              background: province === prov ? "#cc0000" : "#2c2c2e",
              color: province === prov ? "#fff" : "#aeaeb2",
              border: `1px solid ${province === prov ? "#cc0000" : "#48484a"}`,
            }}
          >
            {prov}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          className="rounded-lg px-6 py-16 text-center border"
          style={{ background: "#2c2c2e", borderColor: "#48484a" }}
        >
          <p style={{ color: "#636366" }}>No players found for {PROVINCE_NAMES[province] ?? province}.</p>
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden border" style={{ background: "#2c2c2e", borderColor: "#48484a" }}>
          <table className="w-full text-sm">
            <thead>
              <tr
                className="text-[10px] uppercase tracking-widest font-semibold border-b"
                style={{ color: "#636366", borderColor: "#48484a" }}
              >
                <th className="py-3 px-5 text-center w-14">Rank</th>
                <th className="py-3 px-4 text-left">Player</th>
                <th className="py-3 px-4 text-left hidden sm:table-cell">Characters</th>
                <th className="py-3 px-4 text-left hidden md:table-cell">Tier</th>
                <th className="py-3 px-4 text-right">Rating</th>
                <th className="py-3 px-5 text-right hidden lg:table-cell">W / L</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((player) => (
                <PlayerRow
                  key={player.connectCode}
                  player={player}
                  position={rankMap[player.connectCode]}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
