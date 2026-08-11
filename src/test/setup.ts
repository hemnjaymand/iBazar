import "dotenv/config";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.test",
});

import { config } from "dotenv";

const result = config({
  path: ".env.test",
});

console.log("ENV TEST:", result.error ?? "loaded");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "DEFINED" : "MISSING");