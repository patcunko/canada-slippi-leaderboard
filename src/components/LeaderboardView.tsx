"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { SlippiPlayer, getRank, getCharacterName } from "@/lib/slippi";
import { PROVINCE_NAMES, PROVINCE_COLORS } from "@/config/players";
import PlayerRow from "./PlayerRow";
import { iconPath } from "./CharacterBubble";

const RANK_ICON: Record<string, string> = {
  "Bronze 1": "/ranks/bronze_1.svg", "Bronze 2": "/ranks/bronze_2.svg", "Bronze 3": "/ranks/bronze_3.svg",
  "Silver 1": "/ranks/silver_1.svg", "Silver 2": "/ranks/silver_2.svg", "Silver 3": "/ranks/silver_3.svg",
  "Gold 1": "/ranks/gold_1.svg", "Gold 2": "/ranks/gold_2.svg", "Gold 3": "/ranks/gold_3.svg",
  "Platinum 1": "/ranks/platinum_1.svg", "Platinum 2": "/ranks/platinum_2.svg", "Platinum 3": "/ranks/platinum_3.svg",
  "Diamond 1": "/ranks/diamond_1.svg", "Diamond 2": "/ranks/diamond_2.svg", "Diamond 3": "/ranks/diamond_3.svg",
  "Master 1": "/ranks/master_1.svg", "Master 2": "/ranks/master_2.svg", "Master 3": "/ranks/master_3.svg",
  "Grandmaster": "/ranks/grandmaster.svg",
};

function AverageStat({
  players,
  search,
  onSearch,
}: {
  players: SlippiPlayer[];
  search: string;
  onSearch: (v: string) => void;
}) {
  const placed = players.filter((p) => p.placed);
  const avg = placed.length > 0 ? placed.reduce((s, p) => s + p.ratingOrdinal, 0) / placed.length : null;
  const { name: rankName } = avg !== null ? getRank(avg, null) : { name: "" };
  const iconSrc = avg !== null ? RANK_ICON[rankName] : null;
  return (
    <div
      className="rounded-lg px-5 py-3 mb-5 flex items-center gap-4"
      style={{ background: "#2c2c2e", border: "1px solid #48484a" }}
    >
      {iconSrc && (
        <Image src={iconSrc} alt={rankName} width={40} height={40} className="object-contain" unoptimized />
      )}
      {avg !== null && (
        <>
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
          <div className="w-px self-stretch bg-[#48484a]" />
        </>
      )}
      <input
        type="text"
        placeholder="Search by name or tag…"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        className="flex-1 px-3 py-1.5 rounded text-sm bg-[#1c1c1e] text-[#f2f2f7] placeholder-[#636366] outline-none focus:ring-1 focus:ring-[#48484a]"
        style={{ border: "1px solid #3a3a3c" }}
      />
    </div>
  );
}

export default function LeaderboardView({ players, cachedAt }: { players: SlippiPlayer[]; cachedAt?: string }) {
  const [province, setProvince] = useState<string>("ALL");
  const [character, setCharacter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");

  const provinces = useMemo(() => {
    const set = new Set(players.map((p) => p.province));
    return Array.from(set).sort((a, b) => {
      const countA = players.filter((p) => p.province === a).length;
      const countB = players.filter((p) => p.province === b).length;
      return countB - countA || a.localeCompare(b);
    });
  }, [players]);

  const characters = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of players) {
      const main = p.characters[0]?.character;
      if (main) counts[main] = (counts[main] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([char]) => char);
  }, [players]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return players.filter(
      (p) =>
        (province === "ALL" || p.province === province) &&
        (character === "ALL" || p.characters[0]?.character === character) &&
        (!q || p.displayName.toLowerCase().includes(q) || p.connectCode.toLowerCase().includes(q))
    );
  }, [players, province, character, search]);

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
      <div className="flex flex-wrap gap-2 mb-3">
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
        {provinces.map((prov) => {
          const c = PROVINCE_COLORS[prov];
          return (
            <button
              key={prov}
              onClick={() => setProvince(prov)}
              title={PROVINCE_NAMES[prov] ?? prov}
              className="px-3 py-1 rounded text-xs font-semibold transition-colors"
              style={{
                background: province === prov ? (c?.bg ?? "#2c2c2e") : "#2c2c2e",
                color: province === prov ? (c?.text ?? "#aeaeb2") : (c?.text ?? "#aeaeb2"),
                border: `1px solid ${province === prov ? (c?.border ?? "#48484a") : "#48484a"}`,
              }}
            >
              {prov}
            </button>
          );
        })}
      </div>

      {/* Character filter pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setCharacter("ALL")}
          className="px-3 py-1 rounded text-xs font-semibold transition-colors"
          style={{
            background: character === "ALL" ? "#cc0000" : "#2c2c2e",
            color: character === "ALL" ? "#fff" : "#aeaeb2",
            border: `1px solid ${character === "ALL" ? "#cc0000" : "#48484a"}`,
          }}
        >
          All
        </button>
        {characters.map((char) => (
          <button
            key={char}
            onClick={() => setCharacter(char)}
            title={getCharacterName(char)}
            className="rounded-full overflow-hidden transition-all flex-shrink-0"
            style={{
              width: 32,
              height: 32,
              background: "#1c1c1e",
              border: `2px solid ${character === char ? "#cc0000" : "#48484a"}`,
              padding: 2,
              outline: character === char ? "2px solid #cc000044" : "none",
            }}
          >
            <Image
              src={iconPath(char)}
              alt={getCharacterName(char)}
              width={24}
              height={24}
              className="object-contain w-full h-full"
              unoptimized
            />
          </button>
        ))}
      </div>

      <AverageStat players={filtered} search={search} onSearch={setSearch} />

      {filtered.length === 0 ? (
        <div
          className="rounded-lg px-6 py-16 text-center border"
          style={{ background: "#2c2c2e", borderColor: "#48484a" }}
        >
          <p style={{ color: "#636366" }}>
            No players found
            {province !== "ALL" && ` in ${PROVINCE_NAMES[province] ?? province}`}
            {character !== "ALL" && ` maining ${getCharacterName(character)}`}.
          </p>
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
                  position={province === "ALL" && character === "ALL" ? globalRankMap[player.connectCode] : i + 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
