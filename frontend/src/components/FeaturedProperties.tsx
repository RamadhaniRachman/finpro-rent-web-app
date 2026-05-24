import { Link } from "react-router-dom"; // 1. Import Link dari React Router
import PropertyCard from "./PropertyCard";

const PROPERTIES = [
  {
    id: 1,
    name: "The Mossy Cabin",
    location: "Bandung, Jawa Barat",
    price: 185,
    rating: 4.9,
    ecoFeature: "Solar Powered",
    imageUrl:
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Pine Grove Villa",
    location: "Bali, Indonesia",
    price: 240,
    rating: 4.8,
    ecoFeature: "Zero Waste",
    imageUrl:
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Waterfall Sanctuary",
    location: "Lombok, NTB",
    price: 310,
    rating: 5.0,
    ecoFeature: "Water Positive",
    imageUrl:
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Jungle Treehouse",
    location: "Yogyakarta, Jawa Tengah",
    price: 165,
    rating: 4.7,
    ecoFeature: "Off-Grid",
    imageUrl:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Riverside Bamboo Pod",
    location: "Flores, NTT",
    price: 195,
    rating: 4.8,
    ecoFeature: "Carbon Neutral",
    imageUrl:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Mountain Eco Lodge",
    location: "Raja Ampat, Papua",
    price: 420,
    rating: 5.0,
    ecoFeature: "Marine Protected",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop",
  },
];

export default function FeaturedProperties() {
  return (
    <section aria-label="Featured properties">
      {/* Jika class container-page & section-gap ini buatanmu di CSS lama, biarkan saja. 
          Atau bisa diganti full Tailwind: className="max-w-7xl mx-auto px-6 py-12" */}
      <div className="container-page section-gap">
        {/* Header - Sudah Full Tailwind! */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="material-symbols-outlined text-[15px] text-green-700 font-light">
                eco
              </span>
              <p className="text-sm font-bold uppercase tracking-wider text-green-700">
                Our Top Picks
              </p>
            </div>
            <h2 className="text-3xl font-display font-bold text-gray-900">
              Featured Eco-Retreats
            </h2>
          </div>

          <a
            href="#"
            className="flex items-center gap-1 text-sm font-medium text-green-900 hover:text-green-700 transition-colors"
          >
            View all
            <span className="material-symbols-outlined text-[16px] font-light">
              arrow_forward
            </span>
          </a>
        </div>

        {/* Grid Kartu */}
        <div className="property-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROPERTIES.map((p) => (
            // 2. Ini dia bagian pentingnya! Membungkus PropertyCard dengan Link
            <Link
              key={p.id}
              to={`/property/${p.id}`}
              className="block transition-transform hover:-translate-y-1"
            >
              <PropertyCard {...p} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
