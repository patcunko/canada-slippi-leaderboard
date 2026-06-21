"use client";
import { SlippiPlayer } from "@/lib/slippi";
import RankBadge from "./RankBadge";
import CharacterBubbles from "./CharacterBubble";
import { useState } from "react";

const MEDAL: Record<number, string> = { 1: "#f5c518", 2: "#a0a0b0", 3: "#cd7f3c" };

export default function PlayerRow({
  player,
  position,
}: {
  player: SlippiPlayer;
  position: number;
}) {
  const [hovered, setHovered] = useState(false);
  const winRate =
    player.wins + player.losses > 0
      ? ((player.wins / (player.wins + player.losses)) * 100).toFixed(1)
      : null;

  return (
    <tr
      style={{ backgroundColor: hovered ? "#3a3a3c" : "transparent" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border-b border-[#48484a] transition-colors"
    >
      {/* Position */}
      <td className="py-4 px-5 text-center w-14">
        <span
          className="text-xl font-bold"
          style={{ color: MEDAL[position] ?? "#636366" }}
        >
          {position}
        </span>
      </td>

      {/* Player */}
      <td className="py-4 px-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <a
              href={`https://slippi.gg/user/${player.connectCode.replace("#", "-")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#f2f2f7] hover:text-[#21BA45] transition-colors"
            >
              {player.displayName}
            </a>
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{ background: "#cc000022", color: "#ff4444", border: "1px solid #cc000044" }}
            >
              {player.province}
            </span>
          </div>
          <span className="text-xs mt-0.5 text-[#636366]">{player.connectCode}</span>
        </div>
      </td>

      {/* Characters */}
      <td className="py-4 px-4 hidden sm:table-cell">
        {player.placed ? (
          <CharacterBubbles characters={player.characters} />
        ) : (
          <span className="text-xs text-[#636366]">—</span>
        )}
      </td>

      {/* Rank */}
      <td className="py-4 px-4 hidden md:table-cell">
        <RankBadge rank={player.rank} tier={player.rankTier} />
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
      <td className="py-4 px-5 text-right hidden lg:table-cell">
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
