# 📄 Product Requirements Document (PRD) / System Requirements
**Product Name:** Finpro Escapes
**Version:** 1.0.0
**Document Date:** 27 Juni 2026

---

## 1. Pendahuluan
### 1.1 Visi Produk
Finpro Escapes adalah platform penyewaan properti eco-travel yang menghubungkan tamu (User) dengan pemilik properti (Tenant). Platform ini bertujuan memberikan kemudahan dalam pemesanan akomodasi ramah lingkungan dengan sistem manajemen properti dan pemesanan yang terintegrasi penuh.

### 1.2 Target Pengguna (User Personas)
*   **User (Tamu):** Wisatawan yang mencari akomodasi eco-travel. Mereka ingin kemudahan mencari, melihat detail, memesan, dan membayar kamar.
*   **Tenant (Pemilik Properti):** Individu atau bisnis yang menyewakan properti mereka. Mereka membutuhkan alat yang efisien untuk mengelola properti, kamar, ketersediaan, harga dinamis (peak season), dan konfirmasi pembayaran manual maupun otomatis.

---

## 2. Kebutuhan Fungsional (Functional Requirements)

### 2.1 Modul Autentikasi dan Manajemen Pengguna
*   **Registrasi & Login:**
    *   Pengguna (User dan Tenant) harus dapat mendaftar dengan email dan password.
    *   Mendukung Social Login (Google OAuth).
    *   Harus ada alur verifikasi email untuk akun baru atau saat melakukan pembaruan email.
*   **Manajemen Profil:**
    *   User dan Tenant dapat mengedit profil (nama, nomor HP, foto profil/avatar).
    *   Fasilitas reset password melalui tautan yang dikirim ke email.

### 2.2 Modul Pencarian & Eksplorasi (Bagi User)
*   **Pencarian Properti:** User dapat mencari properti berdasarkan nama atau lokasi.
*   **Filter & Sortir:** User dapat menyaring properti berdasarkan ketersediaan tanggal, kota, kategori properti, dan rentang harga.
*   **Detail Properti:** User dapat melihat galeri foto, fasilitas, ulasan (rating & komentar), serta tipe kamar yang tersedia beserta harganya secara dinamis (mengikuti *price modifier* pada tanggal yang dipilih).

### 2.3 Modul Manajemen Properti (Bagi Tenant)
*   **Manajemen Properti Dasar:** Tenant dapat membuat, mengedit (CRUD), atau menghapus properti beserta foto-fotonya.
*   **Manajemen Kategori:** Tenant dapat membuat dan mengatur kategori tipe properti (contoh: Villa, Glamping).
*   **Manajemen Tipe Kamar & Unit:** Tenant dapat mengatur tipe kamar, menetapkan kapasitas, jumlah unit fisik (`room_unit`), serta fasilitas tiap kamar.
*   **Penyesuaian Harga Dinamis (Price Modifier):** Tenant dapat menentukan kenaikan/penurunan harga (persentase atau tetap) pada tanggal tertentu (misalnya *peak season* atau liburan) atau memblokir tanggal tertentu (tidak tersedia).

### 2.4 Modul Pemesanan & Pembayaran
*   **Booking Engine:** 
    *   User dapat melakukan pemesanan pada rentang tanggal tertentu. Sistem otomatis menunjuk unit (`room_unit`) yang tersedia.
    *   Harga yang dihitung otomatis menyesuaikan dengan *price modifier* jika rentang tanggal tersebut terkena harga khusus.
*   **Sistem Pembayaran:**
    *   **Manual Transfer:** User mengunggah foto bukti pembayaran. Tenant akan memverifikasi secara manual (Approve/Reject).
    *   **Payment Gateway (Midtrans):** Terintegrasi otomatis melalui Midtrans Snap. Sistem melakukan konfirmasi otomatis melalui *webhook*.
*   **Batas Waktu Pembayaran:** Jika dalam waktu 1 jam User tidak melakukan pembayaran, sistem *background job* (cron job yang berjalan setiap 5 menit) akan membatalkan pesanan secara otomatis (*auto-cancel*).
*   **Email Pengingat:** Sistem dapat mengirim email pengingat bagi User yang tagihannya belum dibayar mendekati tenggat waktu.

### 2.5 Modul Ulasan (Review)
*   User yang telah menyelesaikan penyewaan (*booking* berstatus CONFIRMED) dapat memberikan rating (1-5) dan komentar atas properti.
*   Tenant dapat membalas ulasan yang diberikan oleh User.

### 2.6 Modul Laporan & Dashboard (Bagi Tenant)
*   **Dashboard Statistik:** Tenant memiliki tampilan ringkasan metrik (total pendapatan, jumlah pemesanan, tingkat okupansi).
*   **Laporan Penjualan:** Data pemesanan dan penjualan yang dapat difilter berdasarkan rentang tanggal dan properti.
*   **Kalender Ketersediaan:** Tampilan visual untuk melihat ketersediaan kamar dan status pemesanan.

---

## 3. Kebutuhan Non-Fungsional (Non-Functional Requirements)

### 3.1 Keamanan (Security)
*   **Autentikasi (JWT):** Token disimpan secara aman dalam bentuk HTTP-only cookies untuk menghindari serangan XSS.
*   **Enkripsi Password:** Penyimpanan kata sandi di-hash menggunakan algoritma Bcrypt.
*   **Database Security:** Menggunakan Row Level Security (RLS) pada PostgreSQL/Supabase untuk memastikan isolasi data antar pengguna dan tenant.
*   **Keamanan Upload:** Validator ukuran dan tipe ekstensi (Multer) sebelum diunggah ke Cloudinary.

### 3.2 Performa dan Ketersediaan (Performance & Availability)
*   **Penjadwalan Otomatis:** *Cron jobs* berjalan optimal dan efisien agar tidak membebani server (pengecekan kedaluwarsa pesanan tiap 5 menit).
*   **Image Optimization:** Cloudinary menangani penyimpanan dan pengoptimalan ukuran gambar untuk _fast loading_ di antarmuka pengguna (Frontend).

### 3.3 Kompatibilitas
*   Aplikasi dikembangkan dalam bentuk Single Page Application (SPA) berbasis React yang harus responsif (Mobile, Tablet, Desktop view) menggunakan Tailwind CSS.

---

## 4. Arsitektur dan Teknologi (Tech Stack)

### 4.1 Frontend (Client-side)
*   **Framework:** React v18 + TypeScript + Vite.
*   **Routing & HTTP:** React Router DOM v6, Axios.
*   **UI/UX:** Tailwind CSS v3, Material Symbols, Font Plus Jakarta Sans.

### 4.2 Backend (Server-side)
*   **Framework:** Node.js v20 + Express (REST API) + TypeScript.
*   **Database & ORM:** PostgreSQL 15 (Supabase), Prisma ORM v7.8.
*   **File Storage:** Cloudinary.
*   **Payment Gateway:** Midtrans.
*   **Email Service:** Nodemailer.
*   **Task Scheduler:** node-cron.

---

## 5. Flow Pembayaran dan Status Pemesanan
Siklus hidup status pemesanan (`booking` status):
1.  **WAITING_FOR_PAYMENT**: Saat User pertama kali berhasil _checkout_ membuat pesanan.
2.  **WAITING_FOR_CONFIRMATION**: User selesai mengunggah bukti bayar atau _webhook payment gateway_ mendeteksi transaksi dibuat.
3.  **CONFIRMED**: Transaksi disetujui (oleh Tenant secara manual atau Midtrans).
4.  **CANCELED**: Tenggat 1 jam berlalu tanpa pembayaran, ditolak oleh Tenant, atau dibatalkan oleh pihak User.
