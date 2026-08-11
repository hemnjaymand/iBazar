import "dotenv/config";

console.log(
  "TEST DATABASE_URL:",
  process.env.DATABASE_URL ? "LOADED" : "NOT LOADED"
);