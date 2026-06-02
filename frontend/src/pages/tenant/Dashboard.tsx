import React from "react";
import TenantLayout from "../../components/layout/TenantLayout";

export default function Dashboard() {
  // Mendapatkan tanggal hari ini
  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <TenantLayout
      title="Dashboard Overview"
      subtitle="Pantau performa dan ringkasan properti Anda"
    >
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Welcome Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-display-lg text-4xl font-bold text-primary mb-2">
              Welcome back, Sarah!
            </h2>
            <p className="text-on-surface-variant font-body-lg flex items-center gap-2">
              <span
                className="material-symbols-outlined text-secondary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                calendar_month
              </span>
              {currentDate}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2.5 rounded-full border border-outline text-on-surface font-label-md hover:bg-surface-container transition-all">
              Download Report
            </button>
            <button className="px-6 py-2.5 rounded-full bg-secondary text-white font-label-md hover:shadow-md transition-all">
              Add Property
            </button>
          </div>
        </section>

        {/* Key Metrics Row (Bento Style) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <div className="p-6 bg-surface-container-lowest rounded-[2rem] shadow-sm border border-outline-variant hover:border-secondary transition-all group cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-secondary-container text-on-secondary-container group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <span className="text-secondary font-label-md flex items-center gap-1 font-bold">
                <span className="material-symbols-outlined text-sm">
                  trending_up
                </span>
                +12%
              </span>
            </div>
            <p className="text-on-surface-variant font-label-md mb-1 text-sm">
              Total Revenue
            </p>
            <h3 className="text-2xl font-bold text-primary">Rp 45.200.000</h3>
          </div>

          {/* Active Bookings */}
          <div className="p-6 bg-surface-container-lowest rounded-[2rem] shadow-sm border border-outline-variant hover:border-secondary transition-all group cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">
                  event_available
                </span>
              </div>
              <span className="text-on-surface-variant text-xs">
                Current stays
              </span>
            </div>
            <p className="text-on-surface-variant font-label-md mb-1 text-sm">
              Active Bookings
            </p>
            <h3 className="text-2xl font-bold text-primary">12</h3>
          </div>

          {/* Property Occupancy */}
          <div className="p-6 bg-surface-container-lowest rounded-[2rem] shadow-sm border border-outline-variant hover:border-secondary transition-all group cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-primary-fixed text-on-primary-fixed group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">bed</span>
              </div>
              <span className="text-on-surface-variant text-xs">Average</span>
            </div>
            <p className="text-on-surface-variant font-label-md mb-1 text-sm">
              Property Occupancy
            </p>
            <h3 className="text-2xl font-bold text-primary">85%</h3>
          </div>

          {/* Average Rating */}
          <div className="p-6 bg-surface-container-lowest rounded-[2rem] shadow-sm border border-outline-variant hover:border-secondary transition-all group cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-secondary-fixed text-on-secondary-fixed group-hover:scale-110 transition-transform">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              </div>
              <div className="px-3 py-1 rounded-full inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container text-xs font-bold">
                Top Rated
              </div>
            </div>
            <p className="text-on-surface-variant font-label-md mb-1 text-sm">
              Average Rating
            </p>
            <h3 className="text-2xl font-bold text-primary">4.9/5.0</h3>
          </div>
        </section>

        {/* Middle Section: Chart and Activity */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 p-8 bg-surface-container-lowest rounded-[2.5rem] shadow-sm border border-outline-variant">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="text-xl font-bold text-primary">
                  Revenue Overview
                </h4>
                <p className="text-on-surface-variant text-sm">
                  Monthly earnings for the past 6 months
                </p>
              </div>
              <select className="bg-surface-container-low border-none rounded-full px-4 py-2 font-label-md text-sm text-on-surface focus:ring-secondary outline-none cursor-pointer">
                <option>Last 6 Months</option>
                <option>Year to Date</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between gap-4 px-2">
              {/* Dummy Bar Charts */}
              {[
                { month: "Jan", height: "40%", label: "Rp 4.2M" },
                { month: "Feb", height: "55%", label: "Rp 5.1M" },
                { month: "Mar", height: "45%", label: "Rp 4.8M" },
                { month: "Apr", height: "75%", label: "Rp 7.5M" },
                { month: "May", height: "85%", label: "Rp 8.2M" },
                { month: "Jun", height: "95%", label: "Rp 9.8M", active: true },
              ].map((data, idx) => (
                <div
                  key={idx}
                  className="flex-1 group flex flex-col items-center gap-3"
                >
                  <div
                    className={`w-full rounded-t-xl relative transition-colors ${
                      data.active
                        ? "bg-primary-container group-hover:bg-primary"
                        : "bg-surface-container-high group-hover:bg-secondary-container"
                    }`}
                    style={{ height: data.height }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {data.label}
                    </div>
                  </div>
                  <span
                    className={`text-xs ${
                      data.active
                        ? "text-primary font-bold"
                        : "text-on-surface-variant"
                    }`}
                  >
                    {data.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Check-ins */}
          <div className="p-8 bg-surface-container-lowest rounded-[2.5rem] shadow-sm border border-outline-variant">
            <h4 className="text-xl font-bold text-primary mb-6">
              Upcoming Check-ins
            </h4>
            <div className="space-y-4">
              {[
                {
                  name: "Michael Chen",
                  prop: "Forest Pine Retreat",
                  date: "Tomorrow",
                  time: "2:00 PM",
                  img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
                  bg: "bg-secondary-fixed",
                },
                {
                  name: "Elena Rodriguez",
                  prop: "Sage Lake Cottage",
                  date: "June 24",
                  time: "3:00 PM",
                  img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
                  bg: "bg-primary-fixed",
                },
                {
                  name: "Jameson Blake",
                  prop: "Moss Ridge Villa",
                  date: "June 26",
                  time: "11:00 AM",
                  img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jameson",
                  bg: "bg-tertiary-fixed",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-surface-container-low transition-all cursor-pointer border border-transparent hover:border-outline-variant"
                >
                  <div
                    className={`w-12 h-12 rounded-full overflow-hidden shrink-0 ${item.bg}`}
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="text-on-surface font-bold text-sm">
                      {item.name}
                    </p>
                    <p className="text-on-surface-variant text-xs">
                      {item.prop}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold text-sm ${
                        item.date === "Tomorrow"
                          ? "text-primary"
                          : "text-on-surface"
                      }`}
                    >
                      {item.date}
                    </p>
                    <p className="text-on-surface-variant text-xs">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 text-secondary font-bold text-sm hover:bg-surface-container-low rounded-xl transition-all">
              View All Activity
            </button>
          </div>
        </section>

        {/* Bottom Section: Top Performer Card & Promo */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Performer Card */}
          <div className="lg:col-span-1">
            <div className="relative group overflow-hidden bg-surface-container-lowest rounded-[2.5rem] shadow-sm border border-outline-variant flex flex-col h-full">
              <div className="h-48 overflow-hidden">
                <img
                  alt="Top Performing Property"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src="https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=600&auto=format&fit=crop"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="text-lg font-bold text-primary">
                    Forest Pine Retreat
                  </h5>
                  <div className="px-3 py-1 rounded-full inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                    <span className="material-symbols-outlined text-[14px]">
                      eco
                    </span>
                    Solar Powered
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-6 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">
                    location_on
                  </span>
                  <span className="text-sm">Ubud, Bali</span>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-outline-variant pt-6">
                  <div>
                    <p className="text-on-surface-variant text-xs font-bold mb-1 uppercase tracking-wider">
                      Earnings (Mo)
                    </p>
                    <p className="text-secondary font-bold">Rp 18.500.000</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant text-xs font-bold mb-1 uppercase tracking-wider">
                      Occupancy
                    </p>
                    <p className="text-primary font-bold">98%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Promo Banner */}
          <div className="lg:col-span-2 p-8 bg-primary text-white rounded-[2.5rem] relative overflow-hidden flex flex-col justify-center">
            {/* Atmospheric Effect */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-secondary blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-secondary-container blur-3xl"></div>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-grow text-center md:text-left">
                <h4 className="text-3xl font-bold mb-4">
                  New "Eco-Rating" feature is live!
                </h4>
                <p className="text-white/80 font-body-lg mb-6">
                  Your properties now show their sustainability score to
                  travelers. Properties with high scores see up to 24% more
                  bookings.
                </p>
                <button className="bg-white text-primary px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg">
                  Improve Your Score
                </button>
              </div>
              <div className="w-40 h-40 shrink-0 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                <span className="material-symbols-outlined text-6xl text-secondary-fixed">
                  eco
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-secondary text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-50 hover:bg-secondary-container hover:text-on-secondary-container group">
        <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform">
          add
        </span>
      </button>
    </TenantLayout>
  );
}
