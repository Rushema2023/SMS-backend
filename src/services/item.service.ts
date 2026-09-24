import { prisma } from "../utils/prisma";
import { CreateItemInput, UpdateItemInput } from "../utils/schemas/item.schema";

// Every function here takes organizationId as a required argument, and
// every Prisma call filters by it. This is what keeps one organization
// from ever seeing or touching another organization's items — it's the
// core rule of a multi-tenant system, enforced at the data layer.

export async function listItems(organizationId: string) {
  return prisma.item.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getItem(organizationId: string, itemId: string) {
  const item = await prisma.item.findFirst({
    where: { id: itemId, organizationId },
  });
  if (!item) throw { status: 404, message: "Item not found" };
  return item;
}

export async function createItem(organizationId: string, input: CreateItemInput) {
  const existing = await prisma.item.findUnique({
    where: { organizationId_sku: { organizationId, sku: input.sku } },
  });
  if (existing) {
    throw { status: 409, message: "An item with this SKU already exists in your organization" };
  }

  return prisma.item.create({
    data: { ...input, organizationId },
  });
}

export async function updateItem(organizationId: string, itemId: string, input: UpdateItemInput) {
  // Confirm the item belongs to this org BEFORE updating —
  // otherwise a crafted itemId from another org could slip through.
  await getItem(organizationId, itemId);

  if (input.sku) {
    const matchingSku = await prisma.item.findUnique({
      where: { organizationId_sku: { organizationId, sku: input.sku } },
    });
    if (matchingSku && matchingSku.id !== itemId) {
      throw { status: 409, message: "An item with this SKU already exists in your organization" };
    }
  }

  return prisma.item.update({ where: { id: itemId }, data: input });
}

export async function deleteItem(organizationId: string, itemId: string) {
  await getItem(organizationId, itemId);
  await prisma.item.delete({ where: { id: itemId } });
}
