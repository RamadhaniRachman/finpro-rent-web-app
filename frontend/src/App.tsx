import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import semua halaman yang sudah kita buat
import LandingPage from "./pages/LandingPage";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderHistory from "./pages/OrderHistory";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Halaman Utama (Daftar Kamar) */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. Halaman Ringkasan Pesanan & Total Harga */}
        <Route path="/checkout/:id" element={<Checkout />} />

        {/* 3. Halaman Upload Struk & Timer Pembayaran */}
        <Route path="/payment/:id" element={<Payment />} />

        {/* 4. Halaman Riwayat Pesanan User */}
        <Route path="/bookings" element={<OrderHistory />} />
      </Routes>
    </BrowserRouter>
  );
}
