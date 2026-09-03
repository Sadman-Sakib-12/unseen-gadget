import { prisma } from "@unseen-gadget/database";
import { NotFoundError } from "../utils/errors";

export async function getAddresses(userId: string) {
  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: "desc" },
  });

  return addresses;
}

export async function createAddress(userId: string, isDefault: boolean, data: { name: string; phone: string; address: string; city: string; zipCode?: string }) {
  // If setting as default, unset previous defaults
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: {
      userId,
      name: data.name,
      phone: data.phone,
      address: data.address,
      city: data.city,
      zipCode: data.zipCode,
      isDefault: isDefault,
    },
  });

  // If this is the first address or explicitly set as default, it's the default
  if (isDefault) {
    // Already unset previous defaults above, this one is default
  } else {
    // If this is the first address for the user, make it default
    const count = await prisma.address.count({ where: { userId } });
    if (count === 1) {
      await prisma.address.update({
        where: { id: address.id },
        data: { isDefault: true },
      });
    }
  }

  return address;
}

export async function getDefaultAddress(userId: string) {
  const address = await prisma.address.findFirst({
    where: { userId, isDefault: true },
  });

  return address;
}

export async function updateAddress(userId: string, addressId: string, isDefault: boolean) {
  // Check ownership
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!address) {
    throw new NotFoundError("Address not found or access denied");
  }

  // If setting as default, unset previous defaults (excluding current)
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true, NOT: { id: addressId } },
      data: { isDefault: false },
    });
  }

  const updated = await prisma.address.update({
    where: { id: addressId },
    data: { isDefault: isDefault },
  });

  return updated;
}

export async function deleteAddress(userId: string, addressId: string) {
  // Check ownership
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!address) {
    throw new NotFoundError("Address not found or access denied");
  }

  await prisma.address.delete({
    where: { id: addressId },
  });

  return { deleted: true };
}