import { prisma } from "../utils/prisma.js";

export const processPaymentUpload = async (
  bookingId: string,
  amount: number,
  method: any,
  proofUrl: string,
) => {
  // 1. Ambil data booking dan status payment yang ada saat ini
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { payment: true },
  });

  if (!booking) throw new Error("Booking tidak ditemukan.");

  // 2. Gembok Validasi: Cek status saat ini
  // Hanya boleh upload jika status masih WAITING_FOR_PAYMENT
  // atau pembayaran sebelumnya REJECTED (sehingga user bisa coba lagi)
  const isEligibleToUpload =
    booking.status === "WAITING_FOR_PAYMENT" ||
    booking.payment.every((p) => p.status === "REJECTED");

  if (!isEligibleToUpload) {
    throw new Error(
      "Anda tidak dapat mengunggah bukti pembayaran pada status pesanan saat ini.",
    );
  }

  // 3. Transaksi DB
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
