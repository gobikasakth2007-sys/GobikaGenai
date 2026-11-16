import { PORTALS } from '../data/collegeData';
import type { PortalId } from '../types/portal';

interface PortalRailProps {
  activePortal: PortalId;
  onSelectPortal: (portal: PortalId) => void;
}

export function PortalRail({ activePortal, onSelectPortal }: PortalRailProps) {
  return (
    <div className="bg-[#F4F0E8] border-b border-[#E5DFD5]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
        <div
          role="tablist"
          aria-label="Institutional Portals"
          className="flex items-center sm:flex-wrap gap-1 sm:gap-1.5 overflow-x-auto sm:overflow-visible py-2.5 no-scrollbar"
        >
          {PORTALS.map((portal, index) => {
            const isActive = activePortal === portal.id;
            return (
              <button
                key={portal.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => {
                  onSelectPortal(portal.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#1C1917] text-[#FBF9F5]'
                    : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#EBE6DF]'
                }`}
              >
                <span className="font-mono text-[11px] opacity-65 mr-1.5 tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {portal.shortLabel}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
