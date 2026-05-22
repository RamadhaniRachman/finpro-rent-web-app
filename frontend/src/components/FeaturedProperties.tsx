import PropertyCard from './PropertyCard';

const PROPERTIES = [
  { id: 1, name: 'The Mossy Cabin',       location: 'Bandung, Jawa Barat',  price: 185, rating: 4.9, ecoFeature: 'Solar Powered',  imageUrl: 'https://res.cloudinary.com/dpxovlms4/image/upload/v1779440989/finpro/assets/mossy_cabin.jpg' },
  { id: 2, name: 'Pine Grove Villa',       location: 'Bali, Indonesia',       price: 240, rating: 4.8, ecoFeature: 'Zero Waste',     imageUrl: 'https://res.cloudinary.com/dpxovlms4/image/upload/v1779440989/finpro/assets/pine_grove.jpg' },
  { id: 3, name: 'Waterfall Sanctuary',    location: 'Lombok, NTB',           price: 310, rating: 5.0, ecoFeature: 'Water Positive', imageUrl: 'https://res.cloudinary.com/dpxovlms4/image/upload/v1779440991/finpro/assets/waterfall_sanctuary.jpg' },
  { id: 4, name: 'Jungle Treehouse',       location: 'Yogyakarta, Jawa Tengah', price: 165, rating: 4.7, ecoFeature: 'Off-Grid',    imageUrl: 'https://res.cloudinary.com/dpxovlms4/image/upload/v1779440992/finpro/assets/jungle_treehouse.jpg' },
  { id: 5, name: 'Riverside Bamboo Pod',   location: 'Flores, NTT',           price: 195, rating: 4.8, ecoFeature: 'Carbon Neutral', imageUrl: 'https://res.cloudinary.com/dpxovlms4/image/upload/v1779440992/finpro/assets/riverside_pod.jpg' },
  { id: 6, name: 'Mountain Eco Lodge',     location: 'Raja Ampat, Papua',     price: 420, rating: 5.0, ecoFeature: 'Marine Protected', imageUrl: 'https://res.cloudinary.com/dpxovlms4/image/upload/v1779440993/finpro/assets/mountain_lodge.jpg' },
];

export default function FeaturedProperties() {
  return (
    <section aria-label="Featured properties">
      <div className="container-page section-gap">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15, color: 'var(--secondary)', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>eco</span>
              <p className="text-overline" style={{ color: 'var(--secondary)' }}>Our Top Picks</p>
            </div>
            <h2 className="text-headline-md" style={{ color: 'var(--on-surface)' }}>Featured Eco-Retreats</h2>
          </div>
          <a href="#" className="text-label-md" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
            View all
            <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>arrow_forward</span>
          </a>
        </div>

        {/* Grid */}
        <div className="property-grid">
          {PROPERTIES.map(p => <PropertyCard key={p.id} {...p} />)}
        </div>
      </div>
    </section>
  );
}
