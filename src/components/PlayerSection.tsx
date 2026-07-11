import { fetchAllPlayers } from "@/lib/fetch-players";
import { PLAYERS } from "@/config/players";
import LeaderboardView from "@/components/LeaderboardView";

export default async function PlayerSection() {
  const { players, cachedAt } = await fetchAllPlayers(PLAYERS);
  return <LeaderboardView players={players} cachedAt={cachedAt} />;
}
