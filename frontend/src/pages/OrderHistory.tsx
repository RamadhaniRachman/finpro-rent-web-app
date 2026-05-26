import React from "react";
import OrderCard from "../components/booking/OrderCard"; // Sesuaikan path import

export default function OrderHistory() {
  // Simulasi data dari backend (nanti diganti dengan fetch dari API kamu)
  const dummyOrders = [
    {
      title: "Whispering Pines Cabin",
      date: "Oct 12 - Oct 15, 2026",
      orderId: "EE-84729",
      price: "Rp 845.000",
      status: "Confirmed" as const,
      image:
        "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=600&auto=format&fit=crop",
    },
    {
      title: "Lakeside Echo Retreat",
      date: "Nov 02 - Nov 07, 2026",
      orderId: "EE-84730",
      price: "Rp 1.250.000",
      status: "Pending Payment" as const,
      image:
        "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=600&auto=format&fit=crop",
    },
  ];

  return (
    <div className="bg-surface min-h-screen font-body text-on-surface pb-24 md:pb-0">
      {/* Header Sederhana */}
      <header className="sticky top-0 z-50 bg-surface-white/80 backdrop-blur-md border-b border-outline-variant">
        <div className="flex justify-between items-center w-full px-6 md:px-12 h-16 max-w-7xl mx-auto">
          <div className="text-xl font-display font-bold text-primary">
            Finpro Escapes
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-surface-low rounded-full material-symbols-outlined text-primary transition-colors">
              notifications
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">
        {/* Judul Halaman */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            Bookings
          </h1>
          <p className="text-on-surface-variant">
            Review your past and upcoming retreats.
          </p>
        </div>

        {/* Tab Filter & Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div className="flex p-1 bg-surface-low rounded-lg w-full md:w-auto border border-outline-variant">
            <button className="flex-1 md:flex-none px-6 py-2 bg-surface-white text-primary font-bold text-sm rounded-md shadow-sm">
              Ongoing
            </button>
            <button className="flex-1 md:flex-none px-6 py-2 text-on-surface-variant hover:text-primary font-bold text-sm rounded-md transition-all">
              Completed
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input
              type="text"
              placeholder="Search order number or date..."
              className="w-full pl-12 pr-4 py-3 bg-surface-white border border-outline-variant rounded-lg text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Grid Kartu Pesanan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Render data dari array */}
          {dummyOrders.map((order, index) => (
            <OrderCard key={index} {...order} />
          ))}

          {/* Kartu "Add New" / Empty State */}
          <div className="bg-surface-low rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center p-8 min-h-[400px] text-center hover:bg-surface-dim transition-colors cursor-pointer group">
            <div className="w-16 h-16 bg-surface-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl text-primary">
                explore
              </span>
            </div>
            <h3 className="text-lg font-display font-bold text-primary mb-2">
              Plan Your Next Escape
            </h3>
            <p className="text-on-surface-variant text-sm mb-6 max-w-[250px]">
              Discover new sanctuaries designed for mindful travel.
            </p>
            {/* Tombol diubah menjadi rounded-full agar konsisten dengan gaya desain sebelumnya */}
            <button className="bg-primary text-on-primary font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
              Explore Properties
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
