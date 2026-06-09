import { defineConfig } from "prisma/config"

// prisma.config.ts is evaluated before Prisma loads .env,
// so we prime process.env ourselves using Node 20.6+ built-in.
try {
  process.loadEnvFile(".env")
} catch {}

export default defineConfig({
  migrations: {
    seed: "tsx ./prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
})
