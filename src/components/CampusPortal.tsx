import { useState } from 'react';
import { MapPin, Clock } from 'lucide-react';
import { CAMPUS_ZONES, IMAGES } from '../data/collegeData';
import { EditorialImage } from './EditorialImage';

export function CampusPortal() {
  const [activeZoneId, setActiveZoneId] = useState(CAMPUS_ZONES[0].id);
  const activeZone = CAMPUS_ZONES.find((z) => z.id === activeZoneId) ?? CAMPUS_ZONES[0];

  return (
    <div className="space-y-12 pb-16 pt-8">
      <div className="border-b border-[#E5DFD5] pb-8">
        <p className="text-xs uppercase tracking-widest text-[#78716C]">
          Sugunapuram, Kuniamuthur · Coimbatore 641008
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#1C1917]">
          College Campus Portal
        </h1>
        <p className="mt-3 text-base text-[#44403C] max-w-2xl leading-relaxed">
          Explore the 42-acre botanical academic estate of Sri Krishna Arts and Science College—spanning limestone
          teaching pavilions, the three-tier Kalam Library atrium, a 2,200-seat convention auditorium, and computing
          research wings.
        </p>
      </div>

      {/* Interactive Campus Zone Explorer */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-2">
          <p className="text-xs uppercase tracking-widest text-[#78716C] mb-3">
            Select Campus Precinct
          </p>
          {CAMPUS_ZONES.map((zone) => {
            const active = zone.id === activeZone.id;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => setActiveZoneId(zone.id)}
                className={`w-full text-left p-4 border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#1C1917] text-[#FBF9F5] border-[#1C1917]'
                    : 'bg-[#FBF9F5] text-[#1C1917] border-[#E5DFD5] hover:bg-[#F4F0E8]'
                }`}
              >
                <p className={`font-mono text-[11px] ${active ? 'text-[#D6CEBE]' : 'text-[#78716C]'}`}>
                  {zone.blockCode}
                </p>
                <p className="mt-1 font-serif text-lg font-semibold">{zone.name}</p>
                <p className={`mt-1 text-xs ${active ? 'text-[#E5DFD5]' : 'text-[#57534E]'}`}>
                  {zone.capacity} · {zone.areaSqFt}
                </p>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-8 border border-[#E5DFD5] bg-[#FBF9F5] p-6 sm:p-8">
          <EditorialImage
            src={activeZone.imageUrl || IMAGES.campusHero}
            alt={activeZone.name}
            caption={`${activeZone.blockCode} — ${activeZone.name} (${activeZone.areaSqFt})`}
            aspectClass="aspect-[16/9]"
          />

          <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-[#57534E] border-b border-[#E5DFD5] pb-4">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#1E3A8A]" />
              {activeZone.blockCode}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-[#1E3A8A]" />
              {activeZone.hours}
            </span>
            <span className="font-mono">{activeZone.capacity}</span>
          </div>

          <h2 className="mt-5 font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
            {activeZone.name}
          </h2>
          <p className="mt-3 text-base text-[#44403C] leading-relaxed">{activeZone.description}</p>

          <div className="mt-6 pt-5 border-t border-[#E5DFD5]">
            <p className="text-xs uppercase tracking-wider text-[#78716C] mb-3">Architectural &amp; Academic Highlights</p>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-[#1C1917]">
              {activeZone.highlights.map((item) => (
                <li key={item} className="p-3 bg-[#F4F0E8] border border-[#E5DFD5]">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Library Spotlight */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-[#E5DFD5] pt-12 items-center">
        <div className="lg:col-span-6">
          <EditorialImage
            src={IMAGES.libraryInterior}
            alt="Dr. A.P.J. Abdul Kalam Central Library interior reading atrium"
            caption="Fig. 2 — Three-level reading atrium inside Dr. Kalam Central Library."
            aspectClass="aspect-[4/3]"
          />
        </div>
        <div className="lg:col-span-6 space-y-4">
          <p className="text-xs uppercase tracking-widest text-[#78716C]">Campus Wayfinding &amp; Transit</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
            Pedestrian Green Corridors &amp; Accessibility
          </h2>
          <p className="text-base text-[#44403C] leading-relaxed">
            The Kuniamuthur campus is structured around vehicle-free shaded pedestrian walkways connecting the
            academic blocks, residences, dining pavilion, and athletic fields. Covered sky-bridges link Computing,
            Biosciences, and Commerce wings during Coimbatore’s monsoon season.
          </p>
          <dl className="grid grid-cols-2 gap-4 pt-3 border-t border-[#E5DFD5] text-sm">
            <div>
              <dt className="text-xs text-[#78716C]">Distance from Coimbatore Junction</dt>
              <dd className="font-mono font-medium text-[#1C1917] mt-1">8.4 km (NH-83 Palakkad Rd)</dd>
            </div>
            <div>
              <dt className="text-xs text-[#78716C]">Campus Tree Canopy</dt>
              <dd className="font-mono font-medium text-[#1C1917] mt-1">1,840 Native Shade Trees</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}
