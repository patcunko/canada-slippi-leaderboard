# Canada Slippi Leaderboard

A Next.js leaderboard for Canadian Slippi Ranked players. Fetches live data from the Slippi GG API and refreshes every 12 hours via Vercel ISR.

## Adding / Removing Players

Edit [`src/config/players.ts`](src/config/players.ts) and add connect codes to the `PLAYERS` array:

```ts
export const PLAYERS: string[] = [
  "SORA#123",
  "WOLF#456",
];
```

Push to GitHub and Vercel will redeploy automatically. The leaderboard also refreshes data every 12 hours without a redeploy.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Deploy — no environment variables required

## Notes

- Data is cached for 12 hours via Next.js ISR (`export const revalidate = 43200`)
- Player ratings come from the unofficial Slippi GG GraphQL API and may change without notice
- Players with fewer than 5 ranked games show as "Unranked"
