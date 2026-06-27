import { prisma } from "../utils/prisma.js";
import type { TransactionContext, PaymentItem } from "../types/tenant.type.js";
import {
  sendConfirmationEmail,
  sendCancellationEmail,
  sendRejectionEmail,
} from "./email/email.service.js";

export const getTenantByUserId = async (userId: string) => {
  return await prisma.tenant.findUnique({ where: { user_id: userId } });
};

// Helper untuk mengecek kepemilikan tenant
export const verifyTenantOwnership = async (
  bookingId: string,
  userId: string,
) => {
  const tenant = await prisma.tenant.findUnique({ where: { user_id: userId } });
  if (!tenant) throw new Error("Anda tidak terdaftar sebagai tenant.");

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      room_unit: { room_type: { property: { tenant_id: tenant.id } } },
    },
  });

  if (!booking)
    throw new Error("Pesanan tidak ditemukan atau bukan milik properti Anda.");
  return true;
};

// 1. Tenant Menerima Pembayaran Manual
export const approvePaymentProcess = async (bookingId: string) => {
  const result = await prisma.$transaction(async (tx: TransactionContext) => {
    const updatedBooking = await tx.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED" },
      include: {
        users: true,
        room_unit: { include: { room_type: { include: { property: true } } } },
      },
    });

    await tx.payment.updateMany({
      where: { booking_id: bookingId, status: "SUBMITTED" },
      data: { status: "CONFIRMED", confirmed_at: new Date() },
    });

    return updatedBooking;
  });

  if (result) {
    await sendConfirmationEmail(result.users.email, result);
  }

  return result;
};

// 2. Tenant Menolak Pembayaran Manual
export const rejectPaymentProcess = async (bookingId: string) => {
  const result = await prisma.$transaction(async (tx: TransactionContext) => {
    // Kembalikan status booking ke WAITING_FOR_PAYMENT dan ambil data relasinya
    const updatedBooking = await tx.booking.update({
      where: { id: bookingId },
      data: { status: "WAITING_FOR_PAYMENT" },
      include: {
        users: true,
        room_unit: { include: { room_type: { include: { property: true } } } },
      },
    });

    // Tandai bukti transfer yang diunggah sebelumnya sebagai REJECTED
    await tx.payment.updateMany({
      where: { booking_id: bookingId, status: "SUBMITTED" },
      data: { status: "REJECTED" },
    });

    return updatedBooking;
  });

  // 📧 Eksekusi Poin: Kirim email penolakan pembayaran ke User
  if (result && result.users?.email) {
    await sendRejectionEmail(result.users.email, result);
  }

  return result;
};

// 3. Tenant Membatalkan Pesanan Secara Sepihak (SUDAH DIPERBARUI)
export const cancelBookingByTenantProcess = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { payment: true },
  });

  if (!booking) throw new Error("Pesanan tidak ditemukan");

  const hasUploadedPayment = booking.payment.some(
    (p: PaymentItem) => p.status === "SUBMITTED" || p.status === "CONFIRMED",
  );

  if (hasUploadedPayment) {
    throw new Error(
      "Tidak dapat membatalkan pesanan. User sudah mengunggah bukti pembayaran.",
    );
  }

  // Lakukan update SEKALIGUS mengambil data relasi untuk email
  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELED" },
    include: {
      users: true,
      room_unit: {
        include: { room_type: { include: { property: true } } },
      },
    },
  });

  // 📧 Eksekusi Poin: Kirim email pembatalan ke User
  if (updatedBooking && updatedBooking.users?.email) {
    await sendCancellationEmail(updatedBooking.users.email, updatedBooking);
  }

  return updatedBooking;
};

export const getBookingsByTenant = async (
  tenantId: string,
  search?: string,
  status?: string,
) => {
  const whereClause: any = {
    room_unit: {
      room_type: {
        property: {
          tenant_id: tenantId,
        },
      },
    },
  };

  if (status && status.trim() !== "" && status !== "Semua") {
    whereClause.status = status;
  }

  if (search && search.trim() !== "") {
    whereClause.users = {
      name: {
        contains: search,
        mode: "insensitive",
      },
    };
  }

  return await prisma.booking.findMany({
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
    include: {
      users: {
        select: {
          name: true,
          email: true,
        },
      },
      room_unit: {
        include: {
          room_type: {
            include: {
              property: true,
            },
          },
        },
      },
      payment: {
        orderBy: { confirmed_at: "desc" },
        take: 1,
      },
    },
  });
};

export const getBookingDetailByTenantProcess = async (
  bookingId: string,
  tenantId: string,
) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      room_unit: {
        room_type: {
          property: {
            tenant_id: tenantId,
          },
        },
      },
    },
    include: {
      users: { select: { name: true, email: true } },
      room_unit: { include: { room_type: { include: { property: true } } } },
      payment: true,
    },
  });

  return booking;
};
