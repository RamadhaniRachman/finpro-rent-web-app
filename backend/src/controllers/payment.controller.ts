import type { Request, Response } from "express";
import { processPaymentUpload } from "../services/payment.service.js";
import { prisma } from "../utils/prisma.js";
import { snap } from "../utils/midtrans.js";

import { verifyBookingOwnership } from "../services/booking.service.js"; // 👈 Import dari service booking

const checkBookingOwnership = async (
  bookingId: string,
  userId: string,
  res: Response,
): Promise<boolean> => {
  try {
    const isOwner = await verifyBookingOwnership(bookingId, userId);
    if (!isOwner) {
      res.status(403).json({ error: "Akses ditolak. Ini bukan pesanan Anda." });
      return false;
    }
    return true;
  } catch (err: any) {
    res.status(404).json({ error: "Pesanan tidak ditemukan." });
    return false;
  }
};

export const uploadPaymentProof = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { bookingId, amount, method } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: "Bukti pembayaran wajib diunggah" });
      return;
    }

    const passed = await checkBookingOwnership(bookingId, userId, res);
    if (!passed) return;
    const proofUrl = file.path;

    const result = await processPaymentUpload(
      bookingId,
      Number(amount),
      method,
      proofUrl,
    );

    res.status(201).json({
      message: "Bukti berhasil diunggah ke Cloudinary",
      data: result[0],
    });
  } catch (error: any) {
    res
      .status(400)
      .json({ error: error.message || "Terjadi kesalahan sistem" });
  }
};

// midtrans
export const createSnapToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { orderId } = req.params;

    if (!orderId || orderId === "undefined") {
      res.status(400).json({ message: "Order ID tidak valid." });
      return;
    }

    // 1. Ambil data HANYA SEKALI, lengkap dengan relasi 'users' yang dibutuhkan Midtrans
    const booking = await prisma.booking.findUnique({
      where: { id: orderId as string },
      include: {
        users: true,
      },
    });

    if (!booking) {
      res.status(404).json({ message: "Booking tidak ditemukan." });
      return;
    }

    // 2. CEK KEPEMILIKAN SECARA LANGSUNG (Tanpa Double Query)
    if (booking.user_id !== userId) {
      res.status(403).json({
        message: "Forbidden. Akses ditolak karena ini bukan pesanan Anda.",
      });
      return;
    }

    if (booking.status !== "WAITING_FOR_PAYMENT") {
      res
        .status(400)
        .json({ message: "Booking ini tidak sedang menunggu pembayaran." });
      return;
    }

    // 3. Kirim data ke Midtrans
    const parameter = {
      transaction_details: {
        order_id: `${booking.id}-${Date.now()}`,
        gross_amount: Math.round(Number(booking.total_price)),
      },
      customer_details: {
        first_name: booking.users.name,
        email: booking.users.email,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    res.status(200).json({
      message: "Snap token berhasil dibuat",
      token: transaction.token,
    });
  } catch (error: any) {
    console.error("Midtrans Error:", error);
    res.status(500).json({ message: "Gagal memproses payment gateway." });
  }
};

export const handleMidtransNotification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const statusResponse = await (snap as any).transaction.notification(
      req.body,
    );

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    const realBookingId =
      orderId.length > 36 ? orderId.substring(0, 36) : orderId;

    let newStatus: any = "WAITING_FOR_PAYMENT";

    if (transactionStatus === "capture" || transactionStatus === "settlement") {
      if (fraudStatus === "accept" || !fraudStatus) {
        newStatus = "CONFIRMED";
      }
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      newStatus = "CANCELED";
    } else if (transactionStatus === "pending") {
      newStatus = "WAITING_FOR_PAYMENT";
    }

    await prisma.booking.update({
      where: { id: realBookingId },
      data: { status: newStatus },
    });

    console.log(
      `✅ Status pesanan ${realBookingId} berhasil diupdate menjadi ${newStatus}`,
    );
    res.status(200).json({ status: "ok" });
  } catch (error: any) {
    console.error("❌ Gagal memproses notifikasi Midtrans:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const syncPaymentStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      res.status(400).json({ error: "Order ID wajib dikirim." });
      return;
    }

    const userId = req.user!.id;
    const realBookingId =
      orderId.length > 36 ? orderId.substring(0, 36) : orderId;

    // EFISIENSI: Gunakan select alih-alih include penuh jika hanya butuh ID
    const booking = await prisma.booking.findUnique({
      where: { id: realBookingId },
      select: {
        user_id: true,
        room_unit: {
          select: {
            room_type: {
              select: {
                property: {
                  select: {
                    tenant: {
                      select: {
                        user_id: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!booking) {
      res.status(404).json({ error: "Pesanan tidak ditemukan." });
      return;
    }

    const isUserOwner = booking.user_id === userId;
    const isTenantOwner =
      booking.room_unit?.room_type?.property?.tenant?.user_id === userId;

    if (!isUserOwner && !isTenantOwner) {
      res.status(403).json({
        error: "Akses ditolak. Anda tidak memiliki hak atas pesanan ini.",
      });
      return;
    }

    const statusResponse = await (snap as any).transaction.status(orderId);
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    let newStatus: any = "WAITING_FOR_PAYMENT";

    if (transactionStatus === "capture" || transactionStatus === "settlement") {
      if (fraudStatus === "accept" || !fraudStatus) {
        newStatus = "CONFIRMED";
      }
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      newStatus = "CANCELED";
    } else if (transactionStatus === "pending") {
      newStatus = "WAITING_FOR_PAYMENT";
    }

    await prisma.booking.update({
      where: { id: realBookingId },
      data: { status: newStatus },
    });

    console.log(
      `✅ Status pesanan ${realBookingId} berhasil disinkronkan menjadi ${newStatus}`,
    );
    res.status(200).json({ status: newStatus });
  } catch (error: any) {
    console.error("❌ Gagal menyinkronkan status pembayaran:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};
