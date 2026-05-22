const STATS = [
  { icon: 'park',           value: '12,480', label: 'Trees Planted'   },
  { icon: 'cottage',        value: '340+',   label: 'Eco Properties'  },
  { icon: 'public',         value: '28',     label: 'Countries'       },
  { icon: 'verified',       value: '100%',   label: 'Verified Stays'  },
];

export default function Sustainability() {
  return (
    <section aria-label="Our sustainability mission" style={{ background: 'var(--surface-container-low)' }}>
      <div className="container-page section-gap">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">

          {/* Image */}
          <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '16/10', position: 'relative', flexShrink: 0 }}>
            <img
              src="https://res.cloudinary.com/dpxovlms4/image/upload/v1779440988/finpro/assets/sustainability.jpg"
              alt="Person planting a tree in a forest"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Text content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingLeft: '2%' }}>
            {/* Icon */}
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--secondary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: 'var(--on-secondary-container)' }}>park</span>
            </div>

            <h2 className="text-headline-md" style={{ color: 'var(--on-surface)', marginTop: 8 }}>Traveling with a Conscience.</h2>

            <p className="text-body-lg" style={{ color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
              For every booking, we plant a tree to restore local ecosystems. We believe that exploration shouldn't come at the cost of the environment. Our curated properties meet strict sustainability standards, ensuring your stay leaves a positive impact.
            </p>

            <div style={{ marginTop: 8 }}>
              <button className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center' }}>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
