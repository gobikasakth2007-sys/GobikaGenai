import { ArrowRight } from 'lucide-react';
import { ENROLLMENT_SUMMARY, IMAGES, PLACEMENT_YEARS, PORTALS } from '../data/collegeData';
import type { PortalId } from '../types/portal';
import { EditorialImage } from './EditorialImage';

interface OverviewPortalProps {
  onSelectPortal: (portal: PortalId) => void;
  onOpenChatWithPrompt: (prompt: string) => void;
}

export function OverviewPortal({ onSelectPortal, onOpenChatWithPrompt }: OverviewPortalProps) {
  const latestPlacement = PLACEMENT_YEARS[PLACEMENT_YEARS.length - 1];

  return (
    <div className="space-y-16 pb-16">
      {/* Marquee Hero Section */}
      <section className="pt-8 sm:pt-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="md:col-span-5 flex flex-col justify-between py-2">
            <div>
              <p className="text-xs tracking-widest uppercase text-[#78716C] font-medium border-[#78766c] bg-[#000000]">
                Kuniamuthur, Coimbatore · Est. 1997 · Autonomous
              </p>
              <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1917] leading-[1.12] tracking-tight">
                Sri Krishna Arts and Science College
              </h1>
              <p className="mt-4 text-sm sm:text-base leading-relaxed max-w-xl bg-[#7f3232] font-bold text-[#060404]">
                An autonomous NAAC A+ accredited institution affiliated to Bharathiar University, uniting rigorous
                scientific inquiry, commerce scholarship, and holistic residential life across a 42-acre Coimbatore
                campus.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-[#E5DFD5] flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onSelectPortal('admissions')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#FBF9F5] bg-[#1E3A8A] hover:bg-[#172554] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Admissions 2026–27
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpenChatWithPrompt('Help me explore the portals on this website')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#1C1917] bg-[#F4F0E8] hover:bg-[#EBE6DF] border border-[#D6CEBE] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Ask Campus Guide
              </button>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col">
            <EditorialImage
              src={IMAGES.campusHero}
              alt="Sri Krishna Arts and Science College main limestone academic pavilions and rain-tree promenade in Coimbatore"
              caption="Fig. 1 — Main Academic Pavilion & Botanical Courtyard, Kuniamuthur Campus (42 Acres)."
              aspectClass="aspect-[16/10] md:h-full md:min-h-[340px]"
              className="h-full flex flex-col"
            />
          </div>
        </div>

        {/* Full-Width 4-Column Institutional Proof Strip */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 border border-[#E5DFD5] bg-[#F4F0E8] divide-y lg:divide-y-0 lg:divide-x divide-[#E5DFD5]">
          <div className="p-6">
            <p className="text-xs uppercase tracking-wider text-[#78716C]">Total Enrollment</p>
            <p className="mt-2 font-mono text-2xl sm:text-3xl font-medium text-[#1C1917] tabular-nums">
              {ENROLLMENT_SUMMARY.totalEnrolled.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[#57534E]">UG, PG &amp; PhD Scholars · 1:18 Ratio</p>
          </div>
          <div className="p-6">
            <p className="text-xs uppercase tracking-wider text-[#78716C]">Placement Record</p>
            <p className="mt-2 font-mono text-2xl sm:text-3xl font-medium text-[#1C1917] tabular-nums">
              {latestPlacement.placementRate}%
            </p>
            <p className="mt-1 text-xs text-[#57534E]">
              ₹{latestPlacement.highestCtcLpa} LPA Peak · {latestPlacement.recruitersCount} Recruiters
            </p>
          </div>
          <div className="p-6">
            <p className="text-xs uppercase tracking-wider text-[#78716C]">National Standing</p>
            <p className="mt-2 font-mono text-2xl sm:text-3xl font-medium text-[#1C1917] tabular-nums">
              NAAC A+
            </p>
            <p className="mt-1 text-xs text-[#57534E]">3.41 CGPA · NIRF Top-100 Band</p>
          </div>
          <div className="p-6">
            <p className="text-xs uppercase tracking-wider text-[#78716C]">Institutional Heritage</p>
            <p className="mt-2 font-mono text-2xl sm:text-3xl font-medium text-[#1C1917] tabular-nums">
              1997–2026
            </p>
            <p className="mt-1 text-xs text-[#57534E]">29 Years · 48 Granted Patents</p>
          </div>
        </div>
      </section>

      {/* Principal's Editorial Note + Quick Operational Strip */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-[#E5DFD5] pt-12">
        <div className="lg:col-span-4">
          <p className="text-xs uppercase tracking-widest text-[#78716C]">Academic Dispatch</p>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
            From the Principal’s Chambers
          </h2>
          <p className="mt-3 text-xs text-[#57534E]">
            Dr. R. Jagajeevan · M.B.A., M.Phil., Ph.D.
          </p>
        </div>
        <div className="lg:col-span-8 max-w-2xl">
          <p className="text-base text-[#292524] leading-[1.8] first-letter:text-5xl first-letter:font-serif first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#1E3A8A]">
            Since our founding under the VLBJ Trust in 1997, Sri Krishna Arts and Science College has held that
            undergraduate and postgraduate education thrives when foundational theory meets immediate laboratory,
            commercial, and cultural practice. Across our 11 specialized digital portals, prospective scholars, parents,
            and visiting delegates can inspect live placement records, faculty doctoral backgrounds, hostel bed
            availability, and international exchange pathways with complete institutional transparency.
          </p>
        </div>
      </section>

      {/* Curated Directory of All Portals */}
      <section className="border-t border-[#E5DFD5] pt-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#78716C]">Unified Campus Architecture</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-[#1C1917]">
              Complete Institutional Portal Directory
            </h2>
          </div>
          <p className="text-sm text-[#57534E]">
            Select any portal below or use the guided assistant to navigate directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E5DFD5] border border-[#E5DFD5]">
          {PORTALS.filter((p) => p.id !== 'overview').map((portal, idx) => (
            <button
              key={portal.id}
              type="button"
              onClick={() => {
                onSelectPortal(portal.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group text-left bg-[#FBF9F5] hover:bg-[#F4F0E8] p-6 transition-colors flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#78716C]">
                  <span className="font-mono tabular-nums">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="capitalize">{portal.sectionGroup}</span>
                </div>
                <h3 className="mt-3 font-serif text-xl font-semibold text-[#1C1917] group-hover:text-[#1E3A8A] transition-colors">
                  {portal.label}
                </h3>
                <p className="mt-2 text-sm text-[#57534E] leading-relaxed">{portal.summary}</p>
              </div>
              <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3A8A]">
                Enter Portal
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
