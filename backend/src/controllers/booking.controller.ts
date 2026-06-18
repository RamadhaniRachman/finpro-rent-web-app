import type { Request, Response } from "express";
import {
  createBookingProcess,
  getBookingDetails,
  cancelBookingById,
  getAllBookings,
  verifyBookingOwnership,
  getBookingsByTenant,
} from "../services/booking.service.js";

// ── Helper: verify ownership and respond if check fails ──────────────
// Helper ini SEKARANG HANYA dipakai untuk aksi yang tidak butuh fetch data utuh (seperti Cancel)
const checkOwnership = async (
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
    res.status(404).json({ error: err.message ?? "Pesanan tidak ditemukan." });
    return false;
  }
};

export const createBooking = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { roomTypeId, checkIn, checkOut } = req.body;

    // Tambahan efisiensi: Cegah error sebelum masuk ke service/Prisma
    if (!roomTypeId || !checkIn || !checkOut) {
      res.status(400).json({ error: "Data booking tidak lengkap." });
      return;
    }

    const booking = await createBookingProcess(
      userId,
      roomTypeId,
      new Date(checkIn),
      new Date(checkOut),
    );

    res.status(201).json({ message: "Booking berhasil dibuat", data: booking });
  } catch (error: any) {
    res
      .status(400)
      .json({ error: error.message || "Terjadi kesalahan pada server" });
  }
};

export const getBookingById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    if (!id) {
      res.status(400).json({ error: "ID pesanan tidak valid." });
      return;
    }

    // EFISIENSI: Hanya 1x hit database langsung mengambil detailnya
    const booking = await getBookingDetails(id);
    if (!booking) {
      res.status(404).json({ error: "Pesanan tidak ditemukan." });
      return;
    }

    // EFISIENSI: Cek kepemilikan secara langsung (tanpa perlu ke database lagi)
    if (booking.user_id !== userId) {
      res.status(403).json({ error: "Akses ditolak. Ini bukan pesanan Anda." });
      return;
    }

    res.status(200).json({ data: booking });
  } catch (error: any) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

export const cancelBookingProcess = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    if (!id) {
      res.status(400).json({ error: "ID pesanan tidak valid." });
      return;
    }

    // Di sini Helper checkOwnership sangat berguna dan efisien!
    const passed = await checkOwnership(id, userId, res);
    if (!passed) return;

    await cancelBookingById(id);
    res.status(200).json({ message: "Pesanan berhasil dibatalkan." });
  } catch (error: any) {
    console.error("Error canceling booking:", error);
    res
      .status(500)
      .json({ error: "Terjadi kesalahan saat membatalkan pesanan." });
  }
};

export const getBookings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { search, date } = req.query;
    const userId = req.user!.id;

    // Defensive programming ini dipertahankan karena query bisa berbentuk Array jika user iseng
    const searchQuery = typeof search === "string" ? search : undefined;
    const dateQuery = typeof date === "string" ? date : undefined;

    const bookings = await getAllBookings(userId, searchQuery, dateQuery);
    res.status(200).json({ data: bookings });
  } catch (error: any) {
    console.error("Error fetching bookings history:", error);
    res
      .status(500)
      .json({ error: "Terjadi kesalahan saat mengambil riwayat pesanan." });
  }
};

export const getTenantBookings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const tenantId = req.user!.id;
    const { search, status } = req.query;

    const searchQuery = typeof search === "string" ? search : undefined;
    const statusQuery = typeof status === "string" ? status : undefined;

    const bookings = await getBookingsByTenant(
      tenantId,
      searchQuery,
      statusQuery,
    );

    res.status(200).json({ data: bookings });
  } catch (error: any) {
    console.error("Error fetching tenant bookings:", error);
    res.status(500).json({
      error: "Terjadi kesalahan pada server saat mengambil data pesanan.",
    });
  }
};
