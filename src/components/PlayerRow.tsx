"use client";
import Image from "next/image";
import { SlippiPlayer } from "@/lib/slippi";
import { PROVINCE_COLORS } from "@/config/players";
import RankBadge, { TIER_TEXT } from "./RankBadge";
import CharacterBubbles, { iconPath } from "./CharacterBubble";
import { useState } from "react";

const MEDAL: Record<number, string> = { 1: "#f5c518", 2: "#a0a0b0", 3: "#cd7f3c" };

function CrownIcon({ color }: { color: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={color}>
      <path d="M3 8l4 3 5-6 5 6 4-3-2 10H5L3 8zm2 12h14v2H5v-2z" />
    </svg>
  );
}

export default function PlayerRow({
  player,
  position,
  onSelect,
}: {
  player: SlippiPlayer;
  position: number;
  onSelect: (player: SlippiPlayer) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const provinceColor = PROVINCE_COLORS[player.province] ?? { text: "#ff4444", bg: "#cc000022", border: "#cc000055" };
  const accent = TIER_TEXT[player.rankTier];
  const isTop = position === 1;
  const winRate =
    player.wins + player.losses > 0
      ? ((player.wins / (player.wins + player.losses)) * 100).toFixed(1)
      : null;

  return (
    <tr
      style={{
        backgroundColor: hovered ? "#3a3a3c" : isTop ? "#f5c51811" : "transparent",
        boxShadow: isTop ? "inset 0 0 0 1px #f5c51888" : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border-b border-[#2f2f31] transition-colors"
    >
      {/* Position */}
      <td className="py-4 px-5 text-center w-14">
        <div className="flex flex-col items-center gap-0.5">
          {isTop && <CrownIcon color={MEDAL[1]} />}
          <span
            className="text-xl font-bold"
            style={{ color: MEDAL[position] ?? "#636366" }}
          >
            {position}
          </span>
        </div>
      </td>

      {/* Player */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div
            className="rounded-full overflow-hidden flex-shrink-0"
            style={{ width: 32, height: 32, background: "#111113", border: `2px solid ${accent}` }}
          >
            <Image
              src={iconPath(player.characters[0]?.character ?? "")}
              alt=""
              width={32}
              height={32}
              className="object-contain p-0.5"
              unoptimized
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelect(player)}
                className="font-semibold text-[#f2f2f7] hover:text-[#21BA45] transition-colors text-left"
              >
                {player.displayName}
              </button>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{ background: provinceColor.bg, color: provinceColor.text, border: `1px solid ${provinceColor.border}` }}
              >
                {player.province}
              </span>
            </div>
            <span className="text-xs mt-0.5 text-[#636366]">{player.connectCode}</span>
          </div>
        </div>
      </td>

      {/* Characters */}
      <td className="py-4 px-4 hidden sm:table-cell text-center">
        {player.placed ? (
          <div className="flex justify-center">
            <CharacterBubbles characters={player.characters} />
          </div>
        ) : (
          <span className="text-xs text-[#636366]">—</span>
        )}
      </td>

      {/* Rank */}
      <td className="py-4 px-4 hidden md:table-cell text-center">
        <div className="flex justify-center">
          <RankBadge rank={player.rank} tier={player.rankTier} />
        </div>
      </td>

      {/* Rating */}
      <td className="py-4 px-4 text-right">
        <span
          className="text-base font-semibold font-mono tabular-nums"
          style={{ color: player.placed ? "#f2f2f7" : "#636366" }}
        >
          {player.placed ? player.ratingOrdinal.toFixed(1) : "—"}
        </span>
      </td>

      {/* W / L */}
      <td className="py-4 px-5 text-center hidden lg:table-cell">
        {player.placed ? (
          <span className="font-mono text-sm tabular-nums">
            <span style={{ color: "#30d158" }}>{player.wins}</span>
            <span className="text-[#636366]"> / </span>
            <span style={{ color: "#ff9f0a" }}>{player.losses}</span>
            {winRate && (
              <span className="ml-2 text-xs text-[#636366]">{winRate}%</span>
            )}
          </span>
        ) : (
          <span className="text-xs text-[#636366]">Not placed</span>
        )}
      </td>
    </tr>
  );
}
