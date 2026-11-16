import { useState } from 'react';
import { BookOpen, Search, X } from 'lucide-react';
import { FACULTY_PROFILES } from '../data/collegeData';
import type { FacultyProfile } from '../types/portal';

export function FacultyPortal() {
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyProfile | null>(null);

  const departments = ['All', ...Array.from(new Set(FACULTY_PROFILES.map((f) => f.department)))];

  const filtered = FACULTY_PROFILES.filter((f) => {
    const matchesDept = departmentFilter === 'All' || f.department === departmentFilter;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      f.name.toLowerCase().includes(q) ||
      f.researchFocus.toLowerCase().includes(q) ||
      f.phdUniversity.toLowerCase().includes(q);
    return matchesDept && matchesQuery;
  });

  return (
    <div className="space-y-10 pb-16 pt-8">
      <div className="border-b border-[#E5DFD5] pb-8">
        <p className="text-xs uppercase tracking-widest text-[#78716C]">
          Academic Leadership &amp; Doctoral Scholarship
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#1C1917]">
          Faculty Details &amp; Study Background
        </h1>
        <p className="mt-3 text-base text-[#44403C] max-w-2xl leading-relaxed">
          Inspect the academic lineage, doctoral alma maters, funded research grants, and patents of our Deans,
          Heads of Department, and senior professors.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {departments.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setDepartmentFilter(dept)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                departmentFilter === dept
                  ? 'bg-[#1C1917] text-[#FBF9F5] border-[#1C1917]'
                  : 'bg-[#F4F0E8] text-[#57534E] border-[#E5DFD5] hover:text-[#1C1917]'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search professor, PhD university, topic"
            className="w-full pl-9 pr-3 py-2 text-sm bg-[#F4F0E8] border border-[#D6CEBE] rounded-md text-[#1C1917]"
          />
        </div>
      </div>

      {/* Faculty Grid */}
      {filtered.length === 0 ? (
        <div className="border border-[#E5DFD5] bg-[#F4F0E8] p-10 text-center text-sm text-[#57534E]">
          No faculty profiles matched your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((fac) => (
            <article
              key={fac.id}
              className="border border-[#E5DFD5] bg-[#FBF9F5] p-6 flex flex-col justify-between"
            >
              <div>
                <p className="text-xs text-[#78716C]">
                  {fac.department} · {fac.qualification}
                </p>
                <h2 className="mt-1.5 font-serif text-2xl font-semibold text-[#1C1917]">{fac.name}</h2>
                <p className="text-sm font-medium text-[#1E3A8A] mt-0.5">{fac.designation}</p>

                <dl className="mt-5 space-y-2.5 text-sm border-t border-[#E5DFD5] pt-4">
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-[#78716C]">Doctoral Study</dt>
                    <dd className="text-[#292524] mt-0.5">{fac.phdUniversity}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-[#78716C]">Research Specialization</dt>
                    <dd className="text-[#44403C] mt-0.5">{fac.researchFocus}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5DFD5] flex items-center justify-between gap-4">
                <div className="text-xs text-[#57534E] font-mono tabular-nums">
                  {fac.publications} Papers · {fac.patents} Patents · {fac.experienceYears} Yrs
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFaculty(fac)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3A8A] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Study Background
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Study Background Modal */}
      {selectedFaculty && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="faculty-modal-title"
          className="fixed inset-0 z-50 bg-[#1C1917]/50 flex items-center justify-center p-4"
        >
          <div className="bg-[#FBF9F5] border border-[#D6CEBE] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#E5DFD5] pb-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#78716C]">
                  Academic Lineage &amp; Curriculum Vitae
                </p>
                <h2 id="faculty-modal-title" className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
                  {selectedFaculty.name}
                </h2>
                <p className="text-sm text-[#1E3A8A] mt-0.5">
                  {selectedFaculty.designation} · {selectedFaculty.department}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFaculty(null)}
                aria-label="Close faculty profile"
                className="w-9 h-9 inline-flex items-center justify-center border border-[#E5DFD5] rounded-md text-[#44403C] hover:bg-[#F4F0E8] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <dl className="mt-6 divide-y divide-[#E5DFD5] text-sm">
              <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-xs uppercase tracking-wider text-[#78716C]">Doctorate (Ph.D.)</dt>
                <dd className="sm:col-span-2 text-[#1C1917] font-medium">{selectedFaculty.phdUniversity}</dd>
              </div>
              <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-xs uppercase tracking-wider text-[#78716C]">Master’s Alma Mater</dt>
                <dd className="sm:col-span-2 text-[#292524]">{selectedFaculty.mastersAlmaMater}</dd>
              </div>
              <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-xs uppercase tracking-wider text-[#78716C]">Bachelor’s Alma Mater</dt>
                <dd className="sm:col-span-2 text-[#292524]">{selectedFaculty.bachelorsAlmaMater}</dd>
              </div>
              <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-xs uppercase tracking-wider text-[#78716C]">Research Focus</dt>
                <dd className="sm:col-span-2 text-[#292524]">{selectedFaculty.researchFocus}</dd>
              </div>
              <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-xs uppercase tracking-wider text-[#78716C]">Research Grants</dt>
                <dd className="sm:col-span-2 font-mono text-xs text-[#1E3A8A] font-medium">
                  {selectedFaculty.grantsWon}
                </dd>
              </div>
              <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-xs uppercase tracking-wider text-[#78716C]">Output &amp; Tenure</dt>
                <dd className="sm:col-span-2 font-mono text-xs text-[#292524] tabular-nums">
                  {selectedFaculty.publications} Peer-Reviewed Papers · {selectedFaculty.patents} Patents ·{' '}
                  {selectedFaculty.experienceYears} Years Teaching
                </dd>
              </div>
              <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-xs uppercase tracking-wider text-[#78716C]">Chambers &amp; Email</dt>
                <dd className="sm:col-span-2 text-[#292524]">
                  {selectedFaculty.officeRoom} ·{' '}
                  <span className="font-mono text-xs text-[#1E3A8A]">{selectedFaculty.email}</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
