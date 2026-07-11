"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LEADERBOARD_REGION } from "@/config/players";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/resources", label: "Resources" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-[#cc0000] border-b border-[#990000]">
      <div className="w-full px-6 py-3 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <img src="/maple-leaf.svg" alt="" aria-hidden="true" style={{ width: 28, height: 28 }} />
          <span className="text-white font-bold text-lg tracking-wide whitespace-nowrap">
            {LEADERBOARD_REGION} · SSBM
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? "border-white text-white"
                    : "border-transparent text-white/70 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex-shrink-0">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdJgzCGLwyrMuMij9gt5oCyeQId5a1-6qYA4gpvZsYqIpD3TA/viewform?usp=publish-editor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-[#cc0000] font-semibold text-sm px-3 py-1.5 rounded hover:bg-[#f2f2f7] transition-colors whitespace-nowrap"
          >
            + Add your tag
          </a>
        </div>
      </div>
    </header>
  );
}
