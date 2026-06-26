import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";

export const cancelExpiredBookings = async (req: Request, res: Response) => {
  try {
    const result = await prisma.booking.updateMany({
      where: {
        // Pastikan ejaan WAITING_FOR_PAYMENT sama persis dengan yang ada di schema.prisma
        status: "WAITING_FOR_PAYMENT",
        expires_at: { lte: new Date() },
      },
      data: { status: "CANCELED" },
    });

    console.log(`[CRON] Berhasil membatalkan ${result.count} pesanan.`);
    res.status(200).json({ success: true, count: result.count });
  } catch (error) {
    console.error("[CRON Error]:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
