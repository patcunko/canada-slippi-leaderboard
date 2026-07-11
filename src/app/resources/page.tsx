import Image from "next/image";
import { iconPath } from "@/lib/character-icons";
import { CHARACTERS } from "@/lib/characters";

const GENERAL_DISCORDS = [
  { label: "Super Smash Bros. Melee", href: "https://discord.gg/UnqjgxJM5A", src: "/discord-icons/melee-legacy.png" },
  { label: "Slippi", href: "https://discord.gg/YRzDxT5", src: "/discord-icons/slippi.png" },
  { label: "The Melee Workshop", href: "https://discord.gg/fFS6uQk", src: "/discord-icons/melee-workshop.png" },
  { label: "m-ex", href: "https://discord.gg/XxdFN9JnMX", src: "/discord-icons/m-ex.png" },
  { label: "Smash Stadium", href: "https://discord.gg/mq69ZzM", src: "/discord-icons/smash-stadium.png" },
];

const MATCHMAKING_DISCORDS = [
  { label: "Melee Online", href: "https://discord.gg/KczB6au", src: "/discord-icons/melee-online.gif" },
  { label: "Melee Newbie Netplay", href: "https://discord.com/invite/RcVaemu", src: "/discord-icons/melee-newbie-netplay.gif" },
  { label: "Alarach", href: "https://discord.gg/fdtcZaTg9n", src: "/discord-icons/alarach.png" },
  { label: "Turnip Teams Lounge", href: "https://discord.gg/k7ZuNmh7ed", src: "/discord-icons/turnip-teams-lounge.png" },
];

const CANADA_DISCORDS = [
  { label: "Alberta", href: "https://discord.gg/6CKt5VcXrP", src: "/discord-icons/canada-alberta.gif" },
  { label: "Atlantic", href: "https://discord.com/invite/54M8ah7357", src: "/discord-icons/canada-atlantic.png" },
  { label: "British Columbia", href: "https://linktr.ee/British_Columbia_FGC", src: "/discord-logo.webp" },
  { label: "UBC Melee", href: "https://discord.gg/4keGJpc9GD", src: "/discord-icons/canada-ubc.png" },
  { label: "Manitoba", href: "https://discord.gg/wFYAU2BWN4", src: "/discord-icons/canada-manitoba.png" },
  { label: "Mississauga", href: "https://discord.gg/ryWcyF2JmU", src: "/discord-icons/canada-mississauga.png" },
  { label: "Montréal", href: "https://discord.gg/EweTYKSJuP", src: "/discord-icons/canada-montreal.png" },
  { label: "New Brunswick", href: "https://discord.gg/KRxXJ7JYxz", src: "/discord-icons/canada-new-brunswick.png" },
  { label: "Nova Scotia", href: "https://discord.gg/TvnXUV46Yp", src: "/discord-icons/canada-nova-scotia.png" },
  { label: "Ottawa/Gatineau", href: "https://discord.gg/jgWxnQPPpe", src: "/discord-icons/canada-ottawa-gatineau.png" },
  { label: "Toronto", href: "https://discord.gg/Xryb8RZn2j", src: "/discord-icons/canada-toronto.png" },
  { label: "Saskatchewan", href: "https://discord.gg/Hs9gkzAZYD", src: "/discord-icons/canada-saskatchewan.gif" },
];

const CHARACTER_DISCORDS: Record<string, string> = {
  bowser: "https://discord.com/invite/4jpjZkB",
  cptfalcon: "https://discord.com/invite/DEY5p65",
  dk: "https://discord.com/invite/VaF5sUd",
  doc: "https://discord.gg/0w4Z5Y1vxgiJt6sd",
  falco: "https://discord.com/invite/HUxvTdy",
  fox: "https://discord.com/invite/9rp6qNR",
  ganon: "https://discord.com/invite/0ylqBnK8H2MJ4NlY",
  ice_climbers: "https://discord.com/invite/0uiUkioTeExTGw9f",
  jigglypuff: "https://discord.com/invite/0x4uq2ABzu6gnICT",
  kirby: "https://discord.com/invite/0iihTeNw0FN9vBSo",
  link: "https://discord.com/invite/HQfW88DUQK",
  luigi: "https://discord.com/invite/0xLggx3U7EICyMm5",
  mario: "https://discord.com/invite/011DBAILLCrymRCgS",
  marth: "https://discord.com/invite/01352PHCHms6PyCv9",
  mewtwo: "https://discord.com/invite/5cS8eeT",
  mr_game_and_watch: "https://discord.com/invite/011LmbPc0LSeiNS0V",
  ness: "https://discord.com/invite/011MSaTVv85q69DV5",
  peach: "https://discord.com/invite/aKkhbcr",
  pichu: "https://discord.gg/bzD5Pfc",
  pikachu: "https://discord.gg/FTVFfkHHfm",
  roy: "https://discord.gg/8FsVMyP6K3",
  samus: "https://discord.com/invite/M3nS3kR",
  sheik: "https://discord.com/invite/tkwQs8v",
  yoshi: "https://discord.com/invite/0vWHh31xabrT8h7H",
  young_link: "https://discord.com/invite/0uRZflcDyAOMeAPK",
  zelda: "https://discord.com/invite/0cfhZQyx53mAuwty",
};

const GUIDE_LINKS = [
  {
    label: "Slippi Netplay Setup",
    desc: "Official guide to setting up Slippi netplay",
    href: "https://slippi.gg/netplay",
    src: "/slippi-logo.png",
  },
  {
    label: "UnclePunch Training Mode",
    desc: "Enhanced training mode mod for Melee",
    href: "https://github.com/UnclePunch/Training-Mode",
    src: "/unclepunch-logo.png",
  },
  {
    label: "Melee Frame Data",
    desc: "Frame data reference for every character",
    href: "https://meleeframedata.com/",
    src: "/melee-icon.png",
  },
];

function LinkPill({ label, href, src }: { label: string; href: string; src: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="pl-1.5 pr-3 py-1.5 rounded-full flex items-center gap-2 bg-[#111113] text-[#aeaeb2] border border-[#2f2f31] hover:border-[#cc0000] hover:text-[#f2f2f7] transition-colors"
    >
      <div className="rounded-full overflow-hidden flex-shrink-0" style={{ width: 24, height: 24 }}>
        <Image src={src} alt="" width={24} height={24} className="object-cover" unoptimized />
      </div>
      <span className="text-xs font-semibold">{label}</span>
    </a>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#636366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6M10 14 21 3" />
    </svg>
  );
}

function SectionHeader({
  title,
  desc,
  src,
  rounded,
  frame,
}: {
  title: string;
  desc: string;
  src: string;
  rounded: string;
  frame: boolean;
}) {
  return (
    <div className="px-6 py-5 flex items-center gap-4 border-b" style={{ borderColor: "#2f2f31" }}>
      <div
        className={`${rounded} overflow-hidden flex-shrink-0`}
        style={{
          width: 44,
          height: 44,
          background: frame ? "#111113" : "transparent",
          border: frame ? "2px solid #cc0000" : "none",
        }}
      >
        <Image src={src} alt="" width={44} height={44} className="object-contain p-0.5" unoptimized />
      </div>
      <div>
        <h2 className="font-semibold text-lg text-[#f2f2f7]">{title}</h2>
        <p className="text-sm text-[#8e8e93] mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-[#222224]">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div
          className="relative overflow-hidden rounded-2xl mb-5 px-6 py-6"
          style={{ background: "#18181a", border: "1px solid #2f2f31" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 100% at 0% 0%, #cc000033, transparent 60%)" }}
          />
          <div className="relative">
            <h1 className="text-2xl font-extrabold text-[#f2f2f7]">Resources</h1>
            <p className="mt-1 text-sm text-[#8e8e93]">Guides, tools, and links for the community</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg overflow-hidden border" style={{ background: "#18181a", borderColor: "#2f2f31" }}>
            <SectionHeader
              title="Practice Saves"
              desc="Pick a character to find their downloadable save files."
              src={iconPath("fox")}
              rounded="rounded-full"
              frame
            />
            <div className="px-6 py-6 grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 gap-3">
              {CHARACTERS.map((c) => (
                <a
                  key={c.slug}
                  href={`https://www.savemelee.rest/character/${c.saveMeleeSlug}/1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={c.name}
                  className="rounded-full overflow-hidden flex-shrink-0 border-2 border-[#3a3a3c] hover:border-[#cc0000] transition-colors"
                  style={{ width: 44, height: 44, background: "#111113" }}
                >
                  <Image
                    src={iconPath(c.slug)}
                    alt={c.name}
                    width={44}
                    height={44}
                    className="object-contain p-0.5"
                    unoptimized
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border" style={{ background: "#18181a", borderColor: "#2f2f31" }}>
            <SectionHeader
              title="Guides"
              desc="Practice setup and walkthroughs."
              src="/slippi-logo.png"
              rounded="rounded-lg"
              frame={false}
            />
            <div className="px-6 py-6 flex flex-col gap-3">
              {GUIDE_LINKS.map((g) => (
                <a
                  key={g.href}
                  href={g.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg px-4 py-3 flex items-center gap-4 border transition-colors hover:border-[#cc0000]"
                  style={{ background: "#111113", borderColor: "#2f2f31" }}
                >
                  <div
                    className="rounded-lg overflow-hidden flex-shrink-0"
                    style={{ width: 44, height: 44, background: "#18181a" }}
                  >
                    <Image src={g.src} alt="" width={44} height={44} className="object-contain p-0.5" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#f2f2f7]">{g.label}</p>
                    <p className="text-xs text-[#8e8e93] mt-0.5">{g.desc}</p>
                  </div>
                  <ExternalLinkIcon />
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border" style={{ background: "#18181a", borderColor: "#2f2f31" }}>
            <SectionHeader
              title="Links"
              desc="Discord and other community links."
              src="/discord-logo.webp"
              rounded="rounded-lg"
              frame={false}
            />
            <div className="px-6 py-6 flex flex-col gap-5">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#8e8e93] mb-2">General</p>
                <div className="flex flex-wrap gap-2">
                  {GENERAL_DISCORDS.map((d) => (
                    <LinkPill key={d.href} label={d.label} href={d.href} src={d.src} />
                  ))}
                </div>
              </div>

              <div className="h-px" style={{ background: "#2f2f31" }} />

              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#8e8e93] mb-2">Matchmaking</p>
                <div className="flex flex-wrap gap-2">
                  {MATCHMAKING_DISCORDS.map((d) => (
                    <LinkPill key={d.href} label={d.label} href={d.href} src={d.src} />
                  ))}
                </div>
              </div>

              <div className="h-px" style={{ background: "#2f2f31" }} />

              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#8e8e93] mb-2">Character</p>
                <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-2">
                  {CHARACTERS.filter((c) => CHARACTER_DISCORDS[c.slug]).map((c) => (
                    <a
                      key={c.slug}
                      href={CHARACTER_DISCORDS[c.slug]}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={c.name}
                      className="rounded-full overflow-hidden flex-shrink-0 border-2 border-[#3a3a3c] hover:border-[#cc0000] transition-colors"
                      style={{ width: 36, height: 36, background: "#111113" }}
                    >
                      <Image
                        src={iconPath(c.slug)}
                        alt={c.name}
                        width={36}
                        height={36}
                        className="object-contain p-0.5"
                        unoptimized
                      />
                    </a>
                  ))}
                </div>
              </div>

              <div className="h-px" style={{ background: "#2f2f31" }} />

              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#8e8e93] mb-2">Canada</p>
                <div className="flex flex-wrap gap-2">
                  {CANADA_DISCORDS.map((d) => (
                    <LinkPill key={d.href} label={d.label} href={d.href} src={d.src} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
