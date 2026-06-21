import { cacheLife, cacheTag } from "next/cache";
import { fetchAllPlayers } from "@/lib/fetch-players";
import { PLAYERS } from "@/config/players";
import LeaderboardView from "@/components/LeaderboardView";

export default async function PlayerSection() {
  "use cache";
  cacheLife("hours");
  cacheTag("players-v3");

  const players = await fetchAllPlayers(PLAYERS);
  return <LeaderboardView players={players} />;
}
