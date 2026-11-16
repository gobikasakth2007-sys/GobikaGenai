import { useState } from 'react';
import { FACILITIES, IMAGES } from '../data/collegeData';
import { EditorialImage } from './EditorialImage';

export function FacilitiesPortal() {
  const [category, setCategory] = useState<string>('All');
  const categories = ['All', 'Research & Labs', 'Academic & Library', 'Student Welfare', 'Sustainable Campus'];

  const visible =
    category === 'All' ? FACILITIES : FACILITIES.filter((f) => f.category === category);

  return (
    <div className="space-y-12 pb-16 pt-8">
      <div className="border-b border-[#E5DFD5] pb-8">
        <p className="text-xs uppercase tracking-widest text-[#78716C]">
          Laboratory, Digital &amp; Welfare Infrastructure
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#1C1917]">
          Facilities Portal
        </h1>
        <p className="mt-3 text-base text-[#44403C] max-w-2xl leading-relaxed">
          From NVIDIA A100 AI computing clusters and DBT-sponsored biotechnology suites to our 48-bus radial transit
          network and 1.4 MW solar microgrid.
        </p>
      </div>

      {/* Research Lab Visual Feature */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7">
          <EditorialImage
            src={IMAGES.biotechLab}
            alt="Biotechnology and computing research laboratory at Sri Krishna Arts and Science College"
            caption="Fig. 4 — Mendel Biosciences & Turing Compute Instrumentation Wing."
            aspectClass="aspect-[4/3]"
          />
        </div>
        <div className="lg:col-span-5 space-y-4">
          <p className="text-xs uppercase tracking-widest text-[#78716C]">Instrumentation Standard</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
            Research-Grade Facilities Open to Undergraduates
          </h2>
          <p className="text-sm text-[#44403C] leading-relaxed">
            Unlike institutions that restrict advanced instruments to doctoral cohorts, SKASC provides mentored
            undergraduate access to RT-PCR thermal cyclers, HPLC chromatography, and GPU compute clusters starting
            in Semester III.
          </p>
          <dl className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E5DFD5]">
            <div>
              <dt className="text-xs text-[#78716C]">Compute Bandwidth</dt>
              <dd className="font-mono text-lg font-medium text-[#1C1917] mt-1">10 Gbps Dual Fiber</dd>
            </div>
            <div>
              <dt className="text-xs text-[#78716C]">Solar Offset</dt>
              <dd className="font-mono text-lg font-medium text-[#1C1917] mt-1">1.4 MW Rooftop</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Curated Architectural Facilities Gallery */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-[#E5DFD5] pt-10">
        <EditorialImage
          src={IMAGES.aiComputingLab}
          alt="AI and Computer Science workstation laboratory at SKASC"
          caption="AI, Cloud & Cybersecurity Computing Studio (840 Workstations)."
          aspectClass="aspect-[4/3]"
        />
        <EditorialImage
          src={IMAGES.libraryInterior}
          alt="Dr. A.P.J. Abdul Kalam Central Library reading atrium"
          caption="Dr. Kalam Central Library — 1,12,400 Volumes & IEEE/Springer E-Journals."
          aspectClass="aspect-[4/3]"
        />
        <EditorialImage
          src={IMAGES.solarCampusWalkway}
          alt="Solar-powered green campus walkway at Sri Krishna Arts and Science College"
          caption="1.4 MW Rooftop Solar Microgrid & Rain-Tree Shaded Walkways."
          aspectClass="aspect-[4/3]"
        />
      </section>

      {/* Filter & Facility Cards */}
      <section className="space-y-6">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                category === cat
                  ? 'bg-[#1C1917] text-[#FBF9F5] border-[#1C1917]'
                  : 'bg-[#F4F0E8] text-[#57534E] border-[#E5DFD5] hover:text-[#1C1917]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((fac) => (
            <article key={fac.id} className="border border-[#E5DFD5] bg-[#FBF9F5] p-6 flex flex-col justify-between">
              <div>
                {fac.imageUrl && (
                  <div className="mb-4">
                    <EditorialImage
                      src={fac.imageUrl}
                      alt={fac.name}
                      aspectClass="aspect-[4/3]"
                    />
                  </div>
                )}
                <p className="text-xs text-[#78716C]">{fac.category}</p>
                <h3 className="mt-1.5 font-serif text-xl font-semibold text-[#1C1917]">{fac.name}</h3>
                <p className="mt-2.5 text-sm text-[#44403C] leading-relaxed">{fac.description}</p>
              </div>
              <dl className="mt-5 pt-4 border-t border-[#E5DFD5] space-y-2 text-xs">
                <div className="flex justify-between gap-2">
                  <dt className="text-[#78716C]">Specification</dt>
                  <dd className="text-right text-[#1C1917] font-medium">{fac.specification}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#78716C]">Scale / Hours</dt>
                  <dd className="text-right font-mono text-[#1E3A8A]">
                    {fac.capacityOrCount} · {fac.accessHours}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
