import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.js"; // sesuaikan path-nya

export const cancelExpiredBookings = async (req: Request, res: Response) => {
  try {
    const result = await prisma.booking.updateMany({
      where: {
        status: "WAITING_FOR_PAYMENT", // Sesuaikan dengan status di skemamu
        expires_at: { lte: new Date() },
      },
      data: { status: "CANCELED" }, // Sesuaikan dengan status di skemamu
    });

    console.log(
      `[CRON] Berhasil membatalkan ${result.count} pesanan kadaluarsa.`,
    );

    // Wajib merespons agar Vercel tahu tugasnya selesai
    res.status(200).json({
      success: true,
      message: `Canceled ${result.count} expired bookings.`,
    });
  } catch (error) {
    console.error("[CRON Error] Gagal membatalkan pesanan:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
