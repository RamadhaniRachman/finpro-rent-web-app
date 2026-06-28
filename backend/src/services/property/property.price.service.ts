import { prisma } from "../../utils/prisma.js";
import type { modifier_type_enum } from "@prisma/client";
import type { PriceModifierInput } from "./property.helpers.js";
import { getTenantId, assertRoomTypeOwner } from "./property.helpers.js";

export const setPriceModifier = async (userId: string, roomTypeId: string, input: PriceModifierInput) => {
  const tenantId = await getTenantId(userId);
  await assertRoomTypeOwner(roomTypeId, tenantId);

  const start = new Date(input.startDate);
  const end = new Date(input.endDate);

  // Mencegah pengaturan harga di masa lalu (Mulai Hari Ini ke depan)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDateOnly = new Date(start);
  startDateOnly.setHours(0, 0, 0, 0);

  if (startDateOnly < today) {
    throw new Error("Gagal: Anda tidak dapat mengatur harga untuk tanggal yang sudah lewat.");
  }

  const isBlock = input.isAvailable === false || input.type === "UNAVAILABLE";

  // Mencegah Overlapping Tanggal 
  // Pengecualian: Jadwal Tutup Kamar BOLEH menimpa Jadwal Harga
  const overlappingModifier = await prisma.price_modifier.findFirst({
    where: {
      room_type_id: roomTypeId,
      start_date: { lte: end },
      end_date: { gte: start },
      is_available: !isBlock, // Hanya mencari tabrakan sesama Jenis (Harga vs Harga, Tutup vs Tutup)
    },
  });

  if (overlappingModifier) {
    throw new Error("Gagal: Tanggal yang Anda pilih bertabrakan dengan jadwal serupa yang sudah ada. Silakan pilih tanggal lain.");
  }

  const dbType = isBlock ? "PERCENTAGE" : input.type as modifier_type_enum;
  const dbValue = isBlock ? 0 : input.value;

  return prisma.price_modifier.create({
    data: {
      room_type_id: roomTypeId,
      start_date: start,
      end_date: end,
      modifier_type: dbType,
      modifier_value: dbValue,
      reason: input.reason || null,
      is_available: !isBlock,
    },
  });
};

export const deletePriceModifier = async (userId: string, modifierId: string) => {
  const tenantId = await getTenantId(userId);
  const modifier = await prisma.price_modifier.findUnique({
    where: { id: modifierId },
    include: { room_type: { include: { property: { select: { tenant_id: true } } } } },
  });
  
  if (!modifier) throw new Error("Price rule not found.");
  if (modifier.room_type.property.tenant_id !== tenantId) throw new Error("Access denied.");
  
  await prisma.price_modifier.delete({ where: { id: modifierId } });
  return { message: "Price rule deleted successfully." };
};
