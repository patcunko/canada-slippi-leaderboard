import { SlippiPlayer, getCharacterName } from "@/lib/slippi";
import RankBadge from "./RankBadge";

const POSITION_STYLES: Record<number, string> = {
  1: "text-yellow-400 font-bold",
  2: "text-slate-300 font-bold",
  3: "text-amber-600 font-bold",
};

export default function PlayerRow({
  player,
  position,
}: {
  player: SlippiPlayer;
  position: number;
}) {
  const winRate =
    player.wins + player.losses > 0
      ? ((player.wins / (player.wins + player.losses)) * 100).toFixed(1)
      : "—";

  const mainChar = player.characters[0];

  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
      <td className="py-3 px-4 text-center w-10">
        <span className={POSITION_STYLES[position] ?? "text-zinc-400"}>
          {position}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-col gap-0.5">
          <a
            href={`https://slippi.gg/user/${player.connectCode.replace("#", "-")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white hover:text-indigo-400 transition-colors"
          >
            {player.displayName}
          </a>
          <span className="text-xs text-zinc-500">{player.connectCode}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-center hidden sm:table-cell">
        <RankBadge rank={player.rank} tier={player.rankTier} />
      </td>
      <td className="py-3 px-4 text-right font-mono tabular-nums">
        {player.placed ? player.ratingOrdinal.toFixed(1) : "—"}
      </td>
      <td className="py-3 px-4 text-center text-sm text-zinc-400 hidden md:table-cell">
        {player.placed ? (
          <span>
            <span className="text-green-400">{player.wins}W</span>
            {" / "}
            <span className="text-red-400">{player.losses}L</span>
            <span className="ml-1 text-zinc-500">({winRate}%)</span>
          </span>
        ) : (
          <span className="text-zinc-600">Not placed</span>
        )}
      </td>
      <td className="py-3 px-4 text-sm text-zinc-400 hidden lg:table-cell">
        {mainChar ? getCharacterName(mainChar.character) : "—"}
      </td>
    </tr>
  );
}
