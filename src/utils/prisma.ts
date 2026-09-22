import { PrismaClient } from "@prisma/client";

// In development, ts-node-dev/nodemon restarts can create many PrismaClient
// instances and exhaust DB connections. This pattern ensures we reuse one.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
