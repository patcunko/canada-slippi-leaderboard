"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { SlippiPlayer, getRank, getCharacterName } from "@/lib/slippi";
import { PROVINCE_NAMES, PROVINCE_COLORS, LEADERBOARD_TITLE } from "@/config/players";
import PlayerRow from "./PlayerRow";
import { iconPath } from "./CharacterBubble";
import PlayerProfileModal from "./PlayerProfileModal";
import { RANK_ICON } from "./RankBadge";

function PeopleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#ff6b6b">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7v1H4v-1z" />
    </svg>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-xl px-4 py-3 flex items-center gap-3"
      style={{ background: "#18181a", border: `1px solid ${accent}33` }}
    >
      <div
        className="rounded-full flex items-center justify-center flex-shrink-0"
        style={{ width: 40, height: 40, background: `${accent}1a` }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest font-bold text-[#8e8e93]">{label}</p>
        <p className="text-xl font-bold font-mono tabular-nums text-[#f2f2f7] mt-0.5">
          {value} {sub && <span className="text-sm font-normal text-[#636366]">{sub}</span>}
        </p>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px my-5" style={{ background: "#2f2f31" }} />;
}

export default function LeaderboardView({ players, cachedAt }: { players: SlippiPlayer[]; cachedAt?: string }) {
  const [province, setProvince] = useState<string>("ALL");
  const [character, setCharacter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [selectedPlayer, setSelectedPlayer] = useState<SlippiPlayer | null>(null);

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

  const placed = filtered.filter((p) => p.placed);
  const avg = placed.length > 0 ? placed.reduce((s, p) => s + p.ratingOrdinal, 0) / placed.length : null;
  const { name: avgRankName } = avg !== null ? getRank(avg, null) : { name: "" };
  const avgIconSrc = avg !== null ? RANK_ICON[avgRankName] : null;

  return (
    <>
      <div
        className="relative overflow-hidden rounded-2xl mb-5 px-6 py-6"
        style={{ background: "#18181a", border: "1px solid #2f2f31" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 100% at 0% 0%, #cc000033, transparent 60%)" }}
        />

        <div className="relative">
          {/* Title + stats */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-[#f2f2f7]">{LEADERBOARD_TITLE}</h1>
              <p className="mt-1 text-sm text-[#8e8e93]">Canada Slippi GG Ranked Leaderboard</p>
              {cachedAt && (
                <p className="mt-2 text-xs text-[#636366]">Last fetched: {cachedAt} ET · Updates every 12 hours</p>
              )}
            </div>

            {avg !== null && (
              <div className="flex flex-wrap gap-3">
                <StatCard
                  icon={
                    avgIconSrc ? (
                      <Image src={avgIconSrc} alt={avgRankName} width={26} height={26} className="object-contain" unoptimized />
                    ) : null
                  }
                  label="Average Rating"
                  value={avg.toFixed(1)}
                  sub={avgRankName}
                  accent="#f5c518"
                />
                <StatCard icon={<PeopleIcon />} label="Placed Players" value={placed.length} accent="#ff6b6b" />
              </div>
            )}
          </div>

          <Divider />

          {/* Province filter pills */}
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#8e8e93] mb-2">Region</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setProvince("ALL")}
                className="px-3 py-1 rounded text-xs font-semibold transition-colors"
                style={{
                  background: province === "ALL" ? "#cc0000" : "#232325",
                  color: province === "ALL" ? "#fff" : "#aeaeb2",
                  border: `1px solid ${province === "ALL" ? "#cc0000" : "#3a3a3c"}`,
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
                      background: province === prov ? (c?.bg ?? "#232325") : "#232325",
                      color: province === prov ? (c?.text ?? "#aeaeb2") : (c?.text ?? "#aeaeb2"),
                      border: `1px solid ${province === prov ? (c?.border ?? "#3a3a3c") : "#3a3a3c"}`,
                    }}
                  >
                    {prov}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px my-3" style={{ background: "#2f2f31" }} />

          {/* Character filter pills */}
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#8e8e93] mb-2">Character</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCharacter("ALL")}
                className="px-3 py-1 rounded text-xs font-semibold transition-colors"
                style={{
                  background: character === "ALL" ? "#cc0000" : "#232325",
                  color: character === "ALL" ? "#fff" : "#aeaeb2",
                  border: `1px solid ${character === "ALL" ? "#cc0000" : "#3a3a3c"}`,
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
                    border: `2px solid ${character === char ? "#cc0000" : "#3a3a3c"}`,
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
          </div>

          <Divider />

          {/* Search */}
          <input
            type="text"
            placeholder="Search by name or tag…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm bg-[#232325] text-[#f2f2f7] placeholder-[#636366] outline-none focus:ring-1 focus:ring-[#48484a]"
            style={{ border: "1px solid #3a3a3c" }}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          className="rounded-lg px-6 py-16 text-center border"
          style={{ background: "#18181a", borderColor: "#2f2f31" }}
        >
          <p style={{ color: "#636366" }}>
            No players found
            {province !== "ALL" && ` in ${PROVINCE_NAMES[province] ?? province}`}
            {character !== "ALL" && ` maining ${getCharacterName(character)}`}.
          </p>
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden border" style={{ background: "#18181a", borderColor: "#2f2f31" }}>
          <table className="w-full text-sm">
            <thead>
              <tr
                className="text-[10px] uppercase tracking-widest font-semibold border-b"
                style={{ color: "#636366", borderColor: "#2f2f31" }}
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
                  onSelect={setSelectedPlayer}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedPlayer && (
        <PlayerProfileModal
          player={selectedPlayer}
          players={players}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </>
  );
}
