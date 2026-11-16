import { useState, FormEvent } from 'react';
import { CheckCircle2, Lock, MailCheck, Search, ShieldAlert, X } from 'lucide-react';
import { DEPARTMENT_PLACEMENTS, PLACEMENT_YEARS, PROGRAMS, RECRUITERS } from '../data/collegeData';
import type { PlacementHelpRequest } from '../types/portal';
import { PlacementCharts } from './PlacementCharts';

const OFFICIAL_EMAIL_PATTERN = /^[a-z0-9._%+-]+@skasc\.(ac|edu)\.in$/i;

export function PlacementsPortal() {
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [recruiterSearch, setRecruiterSearch] = useState<string>('');
  const latest = PLACEMENT_YEARS[PLACEMENT_YEARS.length - 1];
  const sectors = ['All', ...Array.from(new Set(RECRUITERS.map((r) => r.sector)))];

  const normalizedQuery = recruiterSearch.trim().toLowerCase();
  const filteredRecruiters = RECRUITERS.filter((r) => {
    const matchesSector = selectedSector === 'All' || r.sector === selectedSector;
    if (!normalizedQuery) return matchesSector;
    const matchesQuery =
      r.name.toLowerCase().includes(normalizedQuery) ||
      r.sector.toLowerCase().includes(normalizedQuery) ||
      r.eligibility.toLowerCase().includes(normalizedQuery) ||
      r.roles.toLowerCase().includes(normalizedQuery);
    return matchesSector && matchesQuery;
  });

  // Student-only Placement Help Gate & Form
  const [emailInput, setEmailInput] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState(PROGRAMS[0].name);
  const [assistanceType, setAssistanceType] = useState<PlacementHelpRequest['assistanceType']>(
    'Resume & Portfolio Review',
  );
  const [targetCompanyOrRole, setTargetCompanyOrRole] = useState('');
  const [details, setDetails] = useState('');
  const [submittingHelp, setSubmittingHelp] = useState(false);
  const [helpError, setHelpError] = useState<string | null>(null);
  const [submittedTicket, setSubmittedTicket] = useState<PlacementHelpRequest | null>(null);
  const [myTickets, setMyTickets] = useState<PlacementHelpRequest[]>([]);

  const handleVerifyEmail = async (e: FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    const trimmed = emailInput.trim().toLowerCase();

    if (!OFFICIAL_EMAIL_PATTERN.test(trimmed)) {
      setEmailError(
        'Access denied: Please enter an official SKASC student email ending in @skasc.ac.in (personal Gmail/Outlook accounts are not permitted).',
      );
      return;
    }

    setVerifying(true);
    try {
      const res = await fetch(`/api/placements/help?email=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (!res.ok) {
        setEmailError(data.error || 'Could not verify college email.');
      } else {
        setVerifiedEmail(trimmed);
        setMyTickets(data.requests ?? []);
      }
    } catch {
      setEmailError('Network error while verifying official email.');
    } finally {
      setVerifying(false);
    }
  };

  const handleHelpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!verifiedEmail) return;
    setHelpError(null);
    setSubmittingHelp(true);
    try {
      const res = await fetch('/api/placements/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collegeEmail: verifiedEmail,
          studentName,
          rollNumber,
          department,
          assistanceType,
          targetCompanyOrRole,
          details,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setHelpError(data.error || 'Unable to submit placement assistance request.');
      } else {
        setSubmittedTicket(data.request);
        setMyTickets((prev) => [data.request, ...prev]);
        setTargetCompanyOrRole('');
        setDetails('');
      }
    } catch {
      setHelpError('Network error submitting placement support request.');
    } finally {
      setSubmittingHelp(false);
    }
  };

  return (
    <div className="space-y-12 pb-16 pt-8">
      <div className="border-b border-[#E5DFD5] pb-8">
        <p className="text-xs uppercase tracking-widest text-[#78716C]">
          Career Development &amp; Corporate Relations Cell
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#1C1917]">
          Placement Details Portal
        </h1>
        <p className="mt-3 text-base text-[#44403C] max-w-2xl leading-relaxed">
          Verified multi-year campus recruitment outcomes, compensation bands, and department-wise placement ratios
          for graduating cohorts of Sri Krishna Arts and Science College.
        </p>
      </div>

      {/* Key Metrics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 border border-[#E5DFD5] bg-[#F4F0E8] divide-y lg:divide-y-0 lg:divide-x divide-[#E5DFD5]">
        <div className="p-6">
          <p className="text-xs uppercase tracking-wider text-[#78716C]">2025–26 Placement Rate</p>
          <p className="mt-2 font-mono text-3xl font-medium text-[#1C1917] tabular-nums">
            {latest.placementRate}%
          </p>
          <p className="mt-1 text-xs text-[#57534E]">{latest.placedCount.toLocaleString()} offers secured</p>
        </div>
        <div className="p-6">
          <p className="text-xs uppercase tracking-wider text-[#78716C]">Highest Package</p>
          <p className="mt-2 font-mono text-3xl font-medium text-[#1E3A8A] tabular-nums">
            ₹{latest.highestCtcLpa} LPA
          </p>
          <p className="mt-1 text-xs text-[#57534E]">FinTech &amp; Product Engineering</p>
        </div>
        <div className="p-6">
          <p className="text-xs uppercase tracking-wider text-[#78716C]">Median CTC</p>
          <p className="mt-2 font-mono text-3xl font-medium text-[#1C1917] tabular-nums">
            ₹{latest.medianCtcLpa} LPA
          </p>
          <p className="mt-1 text-xs text-[#57534E]">Up +26.8% since 2021–22</p>
        </div>
        <div className="p-6">
          <p className="text-xs uppercase tracking-wider text-[#78716C]">Visiting Recruiters</p>
          <p className="mt-2 font-mono text-3xl font-medium text-[#1C1917] tabular-nums">
            {latest.recruitersCount}
          </p>
          <p className="mt-1 text-xs text-[#57534E]">Fortune 500 &amp; Product Firms</p>
        </div>
      </section>

      {/* Interactive Recharts Data Visualizations */}
      <PlacementCharts yearlyStats={PLACEMENT_YEARS} departmentStats={DEPARTMENT_PLACEMENTS} />

      {/* School-Wise Placement Matrix Table */}
      <section className="border border-[#E5DFD5] bg-[#FBF9F5] p-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="font-serif text-2xl font-semibold text-[#1C1917]">
            School-Wise Placement Matrix
          </h2>
          <p className="text-xs text-[#78716C]">2025–26 graduating cohort tabular ledger</p>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#E5DFD5] text-xs uppercase tracking-wider text-[#57534E]">
                <th className="py-2.5 pr-3 font-semibold">Department</th>
                <th className="py-2.5 px-3 font-semibold text-right">Placed / Eligible</th>
                <th className="py-2.5 px-3 font-semibold text-right">Placement %</th>
                <th className="py-2.5 px-3 font-semibold text-right">Avg CTC</th>
                <th className="py-2.5 pl-3 font-semibold text-right">Top Offer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DFD5]">
              {DEPARTMENT_PLACEMENTS.map((d) => {
                const pct = ((d.placed / d.eligible) * 100).toFixed(1);
                return (
                  <tr key={d.department}>
                    <td className="py-3 pr-3 font-medium text-[#1C1917]">{d.department}</td>
                    <td className="py-3 px-3 text-right font-mono text-xs tabular-nums text-[#44403C]">
                      {d.placed} / {d.eligible}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-xs tabular-nums text-[#14532D] font-medium">
                      {pct}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-xs tabular-nums text-[#44403C]">
                      ₹{d.avgCtcLpa.toFixed(1)} LPA
                    </td>
                    <td className="py-3 pl-3 text-right font-mono text-xs tabular-nums font-medium text-[#1E3A8A]">
                      ₹{d.topOfferLpa.toFixed(1)} LPA
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Top Recruiters */}
      <section className="space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#1C1917]">
              Leading Corporate Recruiters (2025–26)
            </h2>
            <p className="mt-1 text-xs text-[#78716C]">
              Showing {filteredRecruiters.length} of {RECRUITERS.length} verified recruiting partners
            </p>
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={recruiterSearch}
              onChange={(e) => setRecruiterSearch(e.target.value)}
              placeholder="Search company, sector, or eligibility (e.g. 6.5 CGPA, B.Com)"
              aria-label="Filter recruiters by name, sector, or eligibility criteria"
              className="w-full pl-9 pr-9 py-2 text-sm bg-[#F4F0E8] border border-[#D6CEBE] rounded-md text-[#1C1917]"
            />
            {recruiterSearch && (
              <button
                type="button"
                onClick={() => setRecruiterSearch('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {sectors.map((sector) => (
            <button
              key={sector}
              type="button"
              onClick={() => setSelectedSector(sector)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedSector === sector
                  ? 'bg-[#1C1917] text-[#FBF9F5] border-[#1C1917]'
                  : 'bg-[#F4F0E8] text-[#57534E] border-[#E5DFD5] hover:text-[#1C1917]'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>

        {filteredRecruiters.length === 0 ? (
          <div className="border border-[#E5DFD5] bg-[#F4F0E8] p-8 text-center">
            <p className="text-sm text-[#44403C]">
              No companies matched your current search or sector filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setRecruiterSearch('');
                setSelectedSector('All');
              }}
              className="mt-3 px-4 py-1.5 text-xs font-semibold bg-[#1C1917] text-[#FBF9F5] rounded-md cursor-pointer"
            >
              Reset Recruiter Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E5DFD5] border border-[#E5DFD5]">
            {filteredRecruiters.map((rec) => (
              <div key={rec.name} className="bg-[#FBF9F5] p-5 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-[#78716C]">{rec.sector}</p>
                  <h3 className="mt-1.5 font-serif text-xl font-semibold text-[#1C1917]">{rec.name}</h3>
                  <p className="mt-2 text-xs text-[#292524] leading-relaxed">{rec.roles}</p>
                  <p className="mt-2.5 text-xs text-[#57534E] leading-relaxed">
                    <span className="font-medium text-[#1C1917]">Eligibility:</span> {rec.eligibility}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#E5DFD5] flex items-center justify-between text-xs">
                  <span className="font-mono font-medium text-[#1E3A8A] tabular-nums">{rec.packageRange}</span>
                  <span className="font-mono text-[#44403C] tabular-nums">{rec.hires2026} hires</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Student-Only Placement Assistance Form */}
      <section className="border-t border-[#E5DFD5] pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#1E3A8A] uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              SKASC Enrolled Student Access Only
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
              Student Placement Support &amp; Mentorship Desk
            </h2>
            <p className="text-sm text-[#44403C] leading-relaxed">
              Current SKASC students can request one-on-one resume critiques, mock technical panels, aptitude
              coaching, and recruiter drive clarifications. Authentication requires your official college email ID
              ending in <span className="font-mono text-[#1C1917]">@skasc.ac.in</span>.
            </p>

            {verifiedEmail && myTickets.length > 0 && (
              <div className="mt-6 border border-[#E5DFD5] bg-[#FBF9F5] p-5">
                <p className="text-xs uppercase tracking-wider text-[#78716C] font-semibold">
                  Your Placement Support Tickets
                </p>
                <ul className="mt-3 divide-y divide-[#E5DFD5] text-xs">
                  {myTickets.map((t) => (
                    <li key={t.id} className="py-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-medium text-[#1E3A8A]">{t.id}</span>
                        <span className="text-[#14532D] font-medium">{t.status}</span>
                      </div>
                      <p className="mt-1 font-medium text-[#1C1917]">{t.assistanceType}</p>
                      <p className="text-[#57534E] mt-0.5">
                        Target: {t.targetCompanyOrRole} · {t.submittedAt}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 border border-[#E5DFD5] bg-[#F4F0E8] p-6 sm:p-8">
            {!verifiedEmail ? (
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#1C1917]">
                  Verify Official College Email ID
                </h3>
                <p className="mt-1 text-sm text-[#57534E]">
                  Enter your institutional student address (for example,{' '}
                  <span className="font-mono text-[#1C1917]">24bscs108@skasc.ac.in</span>) to unlock the placement
                  assistance form.
                </p>

                {emailError && (
                  <div className="mt-4 p-3.5 border border-[#9A3412]/40 bg-[#9A3412]/5 text-xs sm:text-sm text-[#9A3412] flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{emailError}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyEmail} className="mt-5 flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="rollno@skasc.ac.in"
                    aria-label="Official SKASC student email ID"
                    className="flex-1 px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-[#1C1917]"
                  />
                  <button
                    type="submit"
                    disabled={verifying}
                    className="px-5 py-2.5 text-sm font-semibold bg-[#1E3A8A] text-[#FBF9F5] hover:bg-[#172554] disabled:opacity-60 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {verifying ? 'Verifying...' : 'Verify & Unlock Form'}
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D6CEBE] pb-4">
                  <div className="flex items-center gap-2 text-xs text-[#14532D] font-medium">
                    <MailCheck className="w-4 h-4" />
                    <span>
                      Verified Student ID: <span className="font-mono">{verifiedEmail}</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setVerifiedEmail(null);
                      setSubmittedTicket(null);
                      setMyTickets([]);
                    }}
                    className="text-xs font-medium text-[#1E3A8A] hover:underline cursor-pointer"
                  >
                    Switch Email
                  </button>
                </div>

                {submittedTicket && (
                  <div className="mt-5 p-4 border border-[#14532D]/30 bg-[#14532D]/5 text-[#14532D] text-sm flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">
                        Placement Support Request Logged ·{' '}
                        <span className="font-mono">{submittedTicket.id}</span>
                      </p>
                      <p className="text-xs text-[#1C1917] mt-1">
                        {submittedTicket.assistanceType} assigned to Placement Cell Mentor for{' '}
                        {submittedTicket.rollNumber}.
                      </p>
                    </div>
                  </div>
                )}

                {helpError && (
                  <div className="mt-4 p-3 border border-[#9A3412]/40 bg-[#9A3412]/5 text-sm text-[#9A3412]">
                    {helpError}
                  </div>
                )}

                <form onSubmit={handleHelpSubmit} className="mt-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="plc-name" className="block text-xs font-medium text-[#44403C] mb-1">
                        Student Full Name
                      </label>
                      <input
                        id="plc-name"
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g., Praveen Kumar R"
                        className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="plc-roll" className="block text-xs font-medium text-[#44403C] mb-1">
                        College Roll Number
                      </label>
                      <input
                        id="plc-roll"
                        type="text"
                        required
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        placeholder="e.g., 24BSCS108"
                        className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="plc-dept" className="block text-xs font-medium text-[#44403C] mb-1">
                        Degree Program
                      </label>
                      <select
                        id="plc-dept"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                      >
                        {PROGRAMS.map((p) => (
                          <option key={p.code} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="plc-type" className="block text-xs font-medium text-[#44403C] mb-1">
                        Placement Assistance Type
                      </label>
                      <select
                        id="plc-type"
                        value={assistanceType}
                        onChange={(e) =>
                          setAssistanceType(e.target.value as PlacementHelpRequest['assistanceType'])
                        }
                        className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                      >
                        <option value="Resume & Portfolio Review">Resume &amp; Portfolio Review</option>
                        <option value="Mock Technical Interview">Mock Technical Interview</option>
                        <option value="Aptitude & Coding Mentorship">Aptitude &amp; Coding Mentorship</option>
                        <option value="Recruiter Drive Guidance">Recruiter Drive Guidance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="plc-target" className="block text-xs font-medium text-[#44403C] mb-1">
                      Target Recruiter / Role
                    </label>
                    <input
                      id="plc-target"
                      type="text"
                      value={targetCompanyOrRole}
                      onChange={(e) => setTargetCompanyOrRole(e.target.value)}
                      placeholder="e.g., Zoho MTS, Deloitte Risk Advisory, Goldman Sachs Analyst"
                      className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="plc-details" className="block text-xs font-medium text-[#44403C] mb-1">
                      Specific Preparation Needs / Query
                    </label>
                    <textarea
                      id="plc-details"
                      rows={3}
                      required
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Describe your interview schedule, coding tracks, or resume review needs..."
                      className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingHelp}
                    className="px-6 py-2.5 text-sm font-semibold bg-[#1E3A8A] text-[#FBF9F5] hover:bg-[#172554] disabled:opacity-60 rounded-md transition-colors cursor-pointer"
                  >
                    {submittingHelp ? 'Submitting Request...' : 'Submit Placement Help Request'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
