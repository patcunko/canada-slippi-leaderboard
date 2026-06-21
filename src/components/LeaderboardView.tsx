"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { SlippiPlayer, getRank } from "@/lib/slippi";
import { PROVINCE_NAMES } from "@/config/players";
import PlayerRow from "./PlayerRow";

const RANK_ICON: Record<string, string> = {
  "Bronze 1": "/ranks/bronze_1.svg", "Bronze 2": "/ranks/bronze_2.svg", "Bronze 3": "/ranks/bronze_3.svg",
  "Silver 1": "/ranks/silver_1.svg", "Silver 2": "/ranks/silver_2.svg", "Silver 3": "/ranks/silver_3.svg",
  "Gold 1": "/ranks/gold_1.svg", "Gold 2": "/ranks/gold_2.svg", "Gold 3": "/ranks/gold_3.svg",
  "Platinum 1": "/ranks/platinum_1.svg", "Platinum 2": "/ranks/platinum_2.svg", "Platinum 3": "/ranks/platinum_3.svg",
  "Diamond 1": "/ranks/diamond_1.svg", "Diamond 2": "/ranks/diamond_2.svg", "Diamond 3": "/ranks/diamond_3.svg",
  "Master 1": "/ranks/master_1.svg", "Master 2": "/ranks/master_2.svg", "Master 3": "/ranks/master_3.svg",
  "Grandmaster": "/ranks/grandmaster.svg",
};

function AverageStat({ players }: { players: SlippiPlayer[] }) {
  const placed = players.filter((p) => p.placed);
  if (placed.length === 0) return null;
  const avg = placed.reduce((s, p) => s + p.ratingOrdinal, 0) / placed.length;
  const { name: rankName } = getRank(avg, null);
  const iconSrc = RANK_ICON[rankName];
  return (
    <div
      className="rounded-lg px-5 py-3 mb-5 flex items-center gap-4"
      style={{ background: "#2c2c2e", border: "1px solid #48484a" }}
    >
      {iconSrc && (
        <Image src={iconSrc} alt={rankName} width={40} height={40} className="object-contain" unoptimized />
      )}
      <div>
        <p className="text-[10px] uppercase tracking-widest font-semibold text-[#636366]">Average Rating</p>
        <p className="text-xl font-bold font-mono tabular-nums text-[#f2f2f7] mt-0.5">
          {avg.toFixed(1)} <span className="text-sm font-normal text-[#636366]">{rankName}</span>
        </p>
      </div>
      <div className="w-px self-stretch bg-[#48484a]" />
      <div>
        <p className="text-[10px] uppercase tracking-widest font-semibold text-[#636366]">Placed Players</p>
        <p className="text-xl font-bold font-mono tabular-nums text-[#f2f2f7] mt-0.5">{placed.length}</p>
      </div>
    </div>
  );
}

export default function LeaderboardView({ players, cachedAt }: { players: SlippiPlayer[]; cachedAt?: string }) {
  const [province, setProvince] = useState<string>("ALL");

  const provinces = useMemo(() => {
    const set = new Set(players.map((p) => p.province));
    return Array.from(set).sort((a, b) => {
      const countA = players.filter((p) => p.province === a).length;
      const countB = players.filter((p) => p.province === b).length;
      return countB - countA || a.localeCompare(b);
    });
  }, [players]);

  const filtered = useMemo(
    () => (province === "ALL" ? players : players.filter((p) => p.province === province)),
    [players, province]
  );

  // Global rank map — only used when showing all provinces
  const globalRankMap = useMemo(
    () => Object.fromEntries(players.map((p, i) => [p.connectCode, i + 1])),
    [players]
  );

  return (
    <>
      {cachedAt && (
        <p className="text-xs text-[#48484a] mb-4">Last fetched: {cachedAt} ET · Updates every 12 hours</p>
      )}

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

      <AverageStat players={filtered} />

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
                <th className="py-3 px-4 text-center hidden sm:table-cell">Characters</th>
                <th className="py-3 px-4 text-center hidden md:table-cell">Tier</th>
                <th className="py-3 px-4 text-right">Rating</th>
                <th className="py-3 px-5 text-center hidden lg:table-cell">W / L</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((player, i) => (
                <PlayerRow
                  key={player.connectCode}
                  player={player}
                  position={province === "ALL" ? globalRankMap[player.connectCode] : i + 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
