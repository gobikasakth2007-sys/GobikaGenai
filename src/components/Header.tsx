import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PORTALS } from '../data/collegeData';
import type { PortalId } from '../types/portal';

interface HeaderProps {
  activePortal: PortalId;
  onSelectPortal: (portal: PortalId) => void;
}

const TOP_NAV_LINKS: Array<{ id: PortalId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'faculty', label: 'Academics' },
  { id: 'placements', label: 'Placements' },
  { id: 'campus', label: 'Campus' },
  { id: 'global', label: 'Global' },
];

export function Header({ activePortal, onSelectPortal }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (id: PortalId) => {
    onSelectPortal(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-sm border-b border-[#E5DFD5]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => handleNav('overview')}
          className="text-left font-serif text-lg sm:text-xl font-semibold tracking-tight text-[#1C1917] hover:text-[#1E3A8A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Sri Krishna Arts &amp; Science
        </button>

        {/* Zone 2: 5 single-line navigation links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6 lg:gap-7">
          {TOP_NAV_LINKS.map((item) => {
            const isActive = activePortal === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#1E3A8A] border-[#1E3A8A]'
                    : 'text-[#57534E] border-transparent hover:text-[#1C1917] hover:border-[#D6CEBE]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary CTA button + mobile menu trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('admissions')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold tracking-wide text-[#FBF9F5] bg-[#1E3A8A] hover:bg-[#172554] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Apply Now
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close portal menu' : 'Open portal menu'}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-[#E5DFD5] text-[#1C1917] hover:bg-[#F4F0E8] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile full-portal navigation sheet */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5DFD5] bg-[#FBF9F5] px-4 py-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {PORTALS.map((portal) => {
              const active = activePortal === portal.id;
              return (
                <button
                  key={portal.id}
                  type="button"
                  onClick={() => handleNav(portal.id)}
                  className={`text-left px-3 py-2.5 rounded-md text-sm transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#1E3A8A] text-[#FBF9F5] font-medium'
                      : 'text-[#1C1917] hover:bg-[#F4F0E8]'
                  }`}
                >
                  {portal.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
