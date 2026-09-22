import bcrypt from "bcryptjs";
import { prisma } from "../utils/prisma";
import { signToken } from "../utils/jwt";
import { RegisterInput, LoginInput } from "../utils/schemas/auth.schema";

const SALT_ROUNDS = 10;

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    // Thrown errors get caught by the controller and turned into HTTP responses.
    throw { status: 409, message: "A user with this email already exists" };
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  // Create the organization and its first user together. Using a nested
  // write keeps this atomic — if anything fails, nothing is saved.
  const organization = await prisma.organization.create({
    data: {
      name: input.organizationName,
      users: {
        create: {
          name: input.name,
          email: input.email,
          passwordHash,
          role: "ADMIN", // the person who creates the org is its first admin
        },
      },
    },
    include: { users: true },
  });

  const user = organization.users[0];

  const token = signToken({
    userId: user.id,
    organizationId: organization.id,
    role: user.role,
  });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    organization: { id: organization.id, name: organization.name },
  };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw { status: 401, message: "Invalid email or password" };
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatches) {
    throw { status: 401, message: "Invalid email or password" };
  }

  const token = signToken({
    userId: user.id,
    organizationId: user.organizationId,
    role: user.role,
  });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}
