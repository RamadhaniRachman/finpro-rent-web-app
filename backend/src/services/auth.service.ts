import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import {
  generateAccessToken,
  generateVerificationToken,
  generateResetToken,
  verifyResetToken,
  verifyToken,
} from "../utils/jwt.js";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendEmailChangeVerificationEmail,
} from "./email.service.js";

export const registerUser = async (
  name: string,
  email: string,
  role: "USER" | "TENANT",
) => {
  const existingUser = await prisma.users.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email sudah terdaftar");

  // Create user with dummy password (will be overwritten upon verification)
  const dummyHash = await hashPassword(Math.random().toString(36));

  const user = await prisma.users.create({
    data: { name, email, password_hash: dummyHash, is_verified: false },
  });

  if (role === "TENANT") {
    await prisma.tenant.create({ data: { user_id: user.id, name } });
  }

  const token = generateVerificationToken({
    id: user.id,
    email: user.email,
    role,
  });
  await sendVerificationEmail(user.email, token);
  return { message: "Silakan cek email Anda untuk verifikasi akun" };
};

export const verifyAndSetPassword = async (token: string, password: string) => {
  const decoded = verifyToken(token);
  if (decoded.purpose !== "verification") throw new Error("Token tidak valid");

  const user = await prisma.users.findUnique({ where: { id: decoded.id } });
  if (!user) throw new Error("User tidak ditemukan");
  if (user.is_verified) throw new Error("Akun sudah terverifikasi");

  const hashed = await hashPassword(password);
  await prisma.users.update({
    where: { id: user.id },
    data: { password_hash: hashed, is_verified: true },
  });

  return { message: "Akun berhasil diverifikasi. Silakan login." };
};

export const login = async (
  email: string,
  password: string,
  requestedRole: "USER" | "TENANT",
) => {
  const user = await prisma.users.findUnique({
    where: { email },
    include: { tenant: true },
  });

  if (!user) throw new Error("Invalid email or password.");
  if (!user.is_verified)
    throw new Error("Harap verifikasi email Anda terlebih dahulu");

  if (!user.password_hash) {
    throw new Error(
      "Akun ini terdaftar via Google/Facebook. Silakan login menggunakan Social Login.",
    );
  }

  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) throw new Error("Invalid email or password.");

  if (requestedRole === "TENANT" && !user.tenant) {
    throw new Error("Akun ini tidak memiliki akses tenant");
  }

  const actualRole = user.tenant ? "TENANT" : "USER";
  const token = generateAccessToken({
    id: user.id,
    email: user.email,
    role: actualRole,
  });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: actualRole },
  };
};

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.users.findUnique({ where: { email } });

  // Silent return if user not found or if it's purely a Social Login account (no password_hash)
  if (!user || !user.password_hash) {
    return;
  }

  const actualRole = (await prisma.tenant.findUnique({
    where: { user_id: user.id },
  }))
    ? "TENANT"
    : "USER";

  const token = generateResetToken(
    { id: user.id, email: user.email, role: actualRole },
    user.password_hash,
  );

  await sendResetPasswordEmail(user.email, token);
};

export const resendVerificationEmail = async (email: string) => {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) throw new Error("Email tidak ditemukan.");
  if (user.is_verified)
    throw new Error("Akun ini sudah terverifikasi. Silakan langsung login.");

  const token = generateVerificationToken({
    id: user.id,
    email: user.email,
    role: "USER",
  });

  if (user.password_hash) {
    await sendEmailChangeVerificationEmail(user.email, token);
  } else {
    await sendVerificationEmail(user.email, token);
  }

  return {
    message: "Email verifikasi baru telah dikirim. Silakan cek inbox Anda.",
  };
};

export const verifyEmailUpdate = async (token: string) => {
  const decoded = verifyToken(token);
  if (decoded.purpose !== "verification") throw new Error("Token tidak valid.");

  const user = await prisma.users.findUnique({ where: { id: decoded.id } });
  if (!user) throw new Error("User tidak ditemukan.");

  await prisma.users.update({
    where: { id: user.id },
    data: { is_verified: true },
  });

  return { message: "Email berhasil diverifikasi." };
};

export const confirmPasswordReset = async (
  token: string,
  newPassword: string,
) => {
  const unverified = jwt.decode(token) as {
    id?: string;
    purpose?: string;
  } | null;
  if (!unverified?.id || unverified.purpose !== "reset") {
    throw new Error("Token tidak valid.");
  }

  const user = await prisma.users.findUnique({ where: { id: unverified.id } });
  if (!user) throw new Error("User tidak ditemukan.");

  if (!user.password_hash) {
    throw new Error(
      "Akun ini tidak memiliki password lokal (mungkin terdaftar via Social Login).",
    );
  }

  const decoded = verifyResetToken(token, user.password_hash);
  if (decoded.purpose !== "reset") throw new Error("Token tidak valid.");

  const hashed = await hashPassword(newPassword);
  await prisma.users.update({
    where: { id: user.id },
    data: { password_hash: hashed },
  });
};

/**
 * Handles Social Login/Register via the new user_providers table.
 */
export const socialLogin = async (
  email: string,
  name: string,
  provider: string,
  providerId: string,
  action: "LOGIN" | "REGISTER",
  requestedRole: "USER" | "TENANT",
) => {
  // 1. Cari data provider di tabel terpisah
  const providerRecord = await prisma.user_providers.findFirst({
    where: { provider_id: providerId, provider: provider },
  });

  let user: any = null;

  if (providerRecord) {
    // Jika provider ditemukan, ambil data user utamanya
    user = await prisma.users.findUnique({
      where: { id: providerRecord.user_id },
      include: { tenant: true },
    });
  }

  // 2. Jika tidak ketemu lewat provider_id, coba cari lewat email
  if (!user) {
    user = await prisma.users.findUnique({
      where: { email },
      include: { tenant: true },
    });

    // Jika user ada, tautkan provider baru ini ke akun tersebut
    if (user) {
      await prisma.user_providers.create({
        data: { user_id: user.id, provider, provider_id: providerId },
      });
      user = await prisma.users.update({
        where: { id: user.id },
        data: { is_verified: true },
        include: { tenant: true },
      });
    }
  }

  // ── REGISTER flow ────────────────────────────────────────────────────────
  if (action === "REGISTER") {
    if (!user) {
      // Buat akun utama di tabel users
      user = await prisma.users.create({
        data: { name, email, is_verified: true },
        include: { tenant: true },
      });
      // Buat relasi di tabel user_providers
      await prisma.user_providers.create({
        data: { user_id: user.id, provider, provider_id: providerId },
      });
    }

    if (requestedRole === "TENANT" && !user.tenant) {
      await prisma.tenant.create({ data: { user_id: user.id, name } });
      user = await prisma.users.findUnique({
        where: { id: user.id },
        include: { tenant: true },
      });
    }
  }

  // ── LOGIN flow ───────────────────────────────────────────────────────────
  if (action === "LOGIN") {
    if (!user) {
      throw new Error(
        "Akun dengan email ini belum terdaftar. Silakan registrasi terlebih dahulu.",
      );
    }
    if (requestedRole === "TENANT" && !user.tenant) {
      throw new Error(
        "Akun ini tidak terdaftar sebagai Tenant. Silakan gunakan akun Tenant yang valid.",
      );
    }
  }

  const actualRole = user.tenant ? "TENANT" : "USER";
  const token = generateAccessToken({
    id: user.id,
    email: user.email,
    role: actualRole,
  });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: actualRole },
  };
};
