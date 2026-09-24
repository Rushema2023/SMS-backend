import bcrypt from "bcryptjs";
import { prisma } from "../utils/prisma";
import { CreateUserInput, UpdateUserInput } from "../utils/schemas/user.schema";

const SALT_ROUNDS = 10;

// We never return passwordHash to the client — this shape is what every
// function below returns instead of the raw Prisma record.
const publicUser = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

export async function listUsers(organizationId: string) {
  return prisma.user.findMany({
    where: { organizationId },
    select: publicUser,
    orderBy: { createdAt: "desc" },
  });
}

export async function getUser(organizationId: string, userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId, organizationId },
    select: publicUser,
  });
  if (!user) throw { status: 404, message: "User not found" };
  return user;
}

export async function createUser(organizationId: string, input: CreateUserInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw { status: 409, message: "A user with this email already exists" };

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      role: input.role,
      passwordHash,
      organizationId,
    },
    select: publicUser,
  });
}

export async function updateUser(organizationId: string, userId: string, input: UpdateUserInput) {
  await getUser(organizationId, userId); // ensures it belongs to this org

  return prisma.user.update({
    where: { id: userId },
    data: input,
    select: publicUser,
  });
}

export async function deleteUser(organizationId: string, userId: string) {
  await getUser(organizationId, userId);
  await prisma.user.delete({ where: { id: userId } });
}
