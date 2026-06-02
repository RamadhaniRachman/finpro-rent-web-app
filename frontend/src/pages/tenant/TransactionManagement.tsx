import React, { useState } from "react";
import TenantLayout from "../../components/layout/TenantLayout";

export default function TransactionManagement() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  return (
    <TenantLayout
      title="Manajemen Transaksi"
      subtitle="Kelola reservasi dan pembayaran tamu Anda"
    >
      {/* Filter Bar */}
      <section className="mb-8 flex flex-col md:flex-row gap-4 items-end justify-between">
        <div className="w-full md:w-96">
          <label className="font-label-md text-sm text-on-surface-variant mb-2 block">
            Cari Order ID atau Tamu
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full pl-11 pr-4 py-3 bg-white border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-secondary-container focus:border-primary transition-all outline-none"
              placeholder="Contoh: EE-12940..."
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            "Semua",
            "Menunggu Pembayaran",
            "Konfirmasi",
            "Diproses",
            "Dibatalkan",
          ].map((filter, idx) => (
            <button
              key={filter}
              className={`px-5 py-2.5 rounded-full font-label-md text-sm transition-all ${
                idx === 0
                  ? "bg-primary text-white"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* Table Container */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30">
                <th className="px-6 py-5 font-label-md text-sm text-on-surface-variant">
                  Order ID
                </th>
                <th className="px-6 py-5 font-label-md text-sm text-on-surface-variant">
                  Customer
                </th>
                <th className="px-6 py-5 font-label-md text-sm text-on-surface-variant">
                  Property
                </th>
                <th className="px-6 py-5 font-label-md text-sm text-on-surface-variant">
                  Check-in
                </th>
                <th className="px-6 py-5 font-label-md text-sm text-on-surface-variant">
                  Total Amount
                </th>
                <th className="px-6 py-5 font-label-md text-sm text-on-surface-variant">
                  Status
                </th>
                <th className="px-6 py-5 font-label-md text-sm text-on-surface-variant text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {/* Row 1: Menunggu Konfirmasi */}
              <tr className="hover:bg-surface-container-lowest transition-colors">
                <td className="px-6 py-5 font-label-md text-primary font-bold">
                  #EE-2041
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="font-bold">Aris Setiawan</span>
                    <span className="text-xs text-on-surface-variant">
                      aris.s@gmail.com
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">The Pine Whisper Cabin</td>
                <td className="px-6 py-5">12 Okt 2026</td>
                <td className="px-6 py-5 font-bold">Rp 3.450.000</td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#E7F3EF] text-[#1B3022]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B3022] mr-2"></span>
                    Menunggu Konfirmasi
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:opacity-90 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      visibility
                    </span>
                    Lihat Bukti
                  </button>
                </td>
              </tr>

              {/* Row 2: Menunggu Pembayaran */}
              <tr className="hover:bg-surface-container-lowest transition-colors">
                <td className="px-6 py-5 font-label-md text-primary font-bold">
                  #EE-2039
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="font-bold">Maya Indah</span>
                    <span className="text-xs text-on-surface-variant">
                      maya.i@outlook.com
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">Mossy Rock Retreat</td>
                <td className="px-6 py-5">15 Okt 2026</td>
                <td className="px-6 py-5 font-bold">Rp 1.200.000</td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-secondary-container/50 text-on-secondary-container">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2"></span>
                    Menunggu Pembayaran
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-error text-error rounded-lg text-sm hover:bg-error/5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      cancel
                    </span>
                    Batalkan
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-surface-container-lowest border-t border-outline-variant/30 flex items-center justify-between">
          <p className="text-sm text-on-surface-variant">
            Showing 2 of 24 transactions
          </p>
          <div className="flex gap-2">
            <button
              disabled
              className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container transition-all">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* 1. Modal Konfirmasi Pembayaran */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-primary-container/40 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          ></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest">
              <h3 className="text-xl font-bold text-primary">
                Konfirmasi Pembayaran
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-outline hover:text-error transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-8">
              <div className="mb-6">
                <p className="text-sm text-on-surface-variant mb-1">
                  Order ID:{" "}
                  <span className="text-primary font-bold">#EE-2041</span>
                </p>
                <p className="text-sm">
                  Tamu: <span className="font-bold">Aris Setiawan</span>
                </p>
              </div>
              <div className="rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-low p-2 mb-8 aspect-video overflow-hidden group cursor-zoom-in">
                <img
                  alt="Payment Receipt"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=600&auto=format&fit=crop"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="py-3 rounded-xl border-2 border-outline-variant text-primary font-bold hover:bg-surface-variant/20 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    close
                  </span>
                  Tolak
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="py-3 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    check_circle
                  </span>
                  Setujui
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Batalkan Pesanan */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-primary-container/40 backdrop-blur-sm"
            onClick={() => setShowCancelModal(false)}
          ></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-error-container/30 rounded-full flex items-center justify-center text-error mx-auto mb-4">
                <span className="material-symbols-outlined text-[32px]">
                  warning
                </span>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">
                Batalkan Pesanan?
              </h3>
              <p className="text-sm text-on-surface-variant mb-8">
                Tindakan ini tidak dapat dibatalkan. Tamu akan menerima
                notifikasi otomatis.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="w-full py-4 bg-error text-white rounded-xl font-bold hover:bg-error/90 transition-all"
                >
                  Ya, Batalkan Pesanan
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="w-full py-4 text-outline font-bold hover:bg-surface-container transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </TenantLayout>
  );
}
