"use client";
import Image from "next/image";
import { getCharacterName, SlippiCharacter } from "@/lib/slippi";
import { iconPath } from "@/lib/character-icons";

export { iconPath };

const RING_COLOR = "#21BA45"; // Slippi green
const RING_BG    = "#2c2c2e";
const SIZE = 36;
const STROKE = 2.5;
const R = (SIZE / 2) - STROKE;
const CIRC = 2 * Math.PI * R;

function CharBubble({
  character,
  pct,
}: {
  character: string;
  pct: number; // 0–1
}) {
  const name = getCharacterName(character);
  const src = iconPath(character);
  const dash = CIRC * pct;
  const gap  = CIRC - dash;

  return (
    <div title={`${name} (${Math.round(pct * 100)}%)`} className="relative flex-shrink-0" style={{ width: SIZE, height: SIZE }}>
      <svg
        width={SIZE}
        height={SIZE}
        className="absolute inset-0"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle cx={SIZE/2} cy={SIZE/2} r={R} fill="none" stroke={RING_BG} strokeWidth={STROKE} />
        <circle
          cx={SIZE/2} cy={SIZE/2} r={R}
          fill="none"
          stroke={RING_COLOR}
          strokeWidth={STROKE}
          strokeDasharray={`${dash} ${gap}`}
          strokeLinecap="round"
        />
      </svg>
      <div
        className="absolute rounded-full overflow-hidden"
        style={{ inset: STROKE + 1, background: "#1c1c1e" }}
      >
        <Image
          src={src}
          alt={name}
          fill
          className="object-contain p-0.5"
          unoptimized
        />
      </div>
    </div>
  );
}

export default function CharacterBubbles({ characters }: { characters: SlippiCharacter[] }) {
  const totalGames = characters.reduce((s, c) => s + c.gameCount, 0);
  const shown = characters.slice(0, 3);
  const extra = characters.length - shown.length;

  return (
    <div className="flex items-center gap-1.5">
      {shown.map((c) => (
        <CharBubble
          key={c.character}
          character={c.character}
          pct={totalGames > 0 ? c.gameCount / totalGames : 0}
        />
      ))}
      {extra > 0 && (
        <div
          className="rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
          style={{ width: SIZE, height: SIZE, background: "#3a3a3c", color: "#aeaeb2", border: "2px solid #48484a" }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}
