import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { Role,CollaborationInviteStatus } from "../generated/prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({ connectionString });

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? [ "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export { Role ,CollaborationInviteStatus};
