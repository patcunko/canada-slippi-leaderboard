/**
 * Run once to get your Slippi Firebase refresh token:
 *   node scripts/get-token.mjs your@email.com yourpassword
 *
 * Then add to .env.local:
 *   SLIPPI_REFRESH_TOKEN=<the refresh_token printed below>
 */

const FIREBASE_API_KEY = "AIzaSyAuQqc_wgqcUu3FqrICEPZ9Av_hPxMR_i4";
const [, , email, password] = process.argv;

if (!email || !password) {
  console.error("Usage: node scripts/get-token.mjs <email> <password>");
  process.exit(1);
}

const res = await fetch(
  `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  }
);

const data = await res.json();

if (data.error) {
  console.error("Login failed:", data.error.message);
  process.exit(1);
}

console.log("\nSuccess! Add this to your .env.local file:\n");
console.log(`SLIPPI_REFRESH_TOKEN=${data.refreshToken}`);
