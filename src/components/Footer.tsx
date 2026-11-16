import { PORTALS } from '../data/collegeData';
import type { PortalId } from '../types/portal';

interface FooterProps {
  onSelectPortal: (portal: PortalId) => void;
}

export function Footer({ onSelectPortal }: FooterProps) {
  const handleLink = (id: PortalId) => {
    onSelectPortal(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#E5DFD5] bg-[#F4F0E8] text-[#44403C]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#D6CEBE]">
          <div className="md:col-span-5">
            <p className="font-serif text-xl font-semibold text-[#1C1917]">
              Sri Krishna Arts and Science College
            </p>
            <p className="mt-2 text-sm leading-relaxed max-w-md">
              Autonomous Institution · Affiliated to Bharathiar University · Re-accredited by NAAC with ‘A+’ Grade
              (3.41 CGPA).
            </p>
            <p className="mt-4 text-xs text-[#57534E]">
              Sugunapuram, Kuniamuthur P.O., Coimbatore – 641008, Tamil Nadu, India
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            {PORTALS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleLink(p.id)}
                className="text-left text-[#44403C] hover:text-[#1E3A8A] hover:underline py-0.5 cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#78716C]">
          <p>© 2026 Sri Krishna Arts and Science College, Coimbatore. All institutional records verified for 2026–27.</p>
          <p className="font-mono">admissions@skasc.ac.in · +91 422 267 8400</p>
        </div>
      </div>
    </footer>
  );
}
