import { prisma } from "../utils/prisma.js";

// Transaksi DB untuk menjamin kedua proses sukses atau gagal bersamaan
export const processPaymentUpload = async (
  bookingId: string,
  amount: number,
  method: any,
  proofUrl: string,
) => {
  return await prisma.$transaction([
    prisma.payment.create({
      data: {
        booking_id: bookingId,
        amount,
        method,
        proof_url: proofUrl,
        status: "SUBMITTED",
      },
    }),
    prisma.booking.update({
      where: { id: bookingId },
      data: { status: "WAITING_FOR_CONFIRMATION" },
    }),
  ]);
};

// Tambahkan di bawah fungsi getBookingDetails yang sudah ada
export const cancelBookingById = async (id: string) => {
  return await prisma.booking.update({
    where: { id },
    data: {
      status: "CANCELED", // Pastikan "CANCELED" sesuai dengan penulisan Enum di skema Prisma kamu
    },
  });
};
