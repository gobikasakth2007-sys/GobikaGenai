import { useEffect, useState, FormEvent } from 'react';
import { Award, CheckCircle2, Search } from 'lucide-react';
import { PROGRAMS, SCHOLARSHIP_OPPORTUNITIES } from '../data/collegeData';
import type { AdmissionApplication } from '../types/portal';

function parseRupeeFee(feeStr: string): number {
  const digits = feeStr.replace(/[^\d]/g, '');
  return Number(digits) || 0;
}

export function AdmissionsPortal() {
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'UG' | 'PG' | 'PhD'>('ALL');
  const [scholarshipCategory, setScholarshipCategory] = useState<string>('All');
  const [selectedProgramCode, setSelectedProgramCode] = useState<string>(PROGRAMS[0].code);
  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [qualifyingScore, setQualifyingScore] = useState('');
  const [boardOrUniversity, setBoardOrUniversity] = useState('Tamil Nadu State Board');
  const [hostelRequired, setHostelRequired] = useState(false);
  const [scholarshipTrack, setScholarshipTrack] = useState('None (General Merit Admission)');

  // Interactive Scholarship Estimator State
  const [estProgramCode, setEstProgramCode] = useState<string>(PROGRAMS[0].code);
  const [estScorePct, setEstScorePct] = useState<number>(92);
  const [estTrack, setEstTrack] = useState<'merit' | 'sports' | 'firstgen'>('merit');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedApp, setSubmittedApp] = useState<AdmissionApplication | null>(null);

  const [lookupQuery, setLookupQuery] = useState('');
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);

  const fetchApplications = async (q = '') => {
    setLoadingApps(true);
    try {
      const res = await fetch(`/api/admissions${q ? `?q=${encodeURIComponent(q)}` : ''}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications ?? []);
      }
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredPrograms =
    levelFilter === 'ALL' ? PROGRAMS : PROGRAMS.filter((p) => p.level === levelFilter);

  const scholarshipCategories = ['All', 'Merit', 'Sports & NCC', 'Need & First-Gen', 'Government', 'Research'];
  const visibleScholarships =
    scholarshipCategory === 'All'
      ? SCHOLARSHIP_OPPORTUNITIES
      : SCHOLARSHIP_OPPORTUNITIES.filter((s) => s.category === scholarshipCategory);

  // Scholarship Estimator Computation
  const estProgram = PROGRAMS.find((p) => p.code === estProgramCode) ?? PROGRAMS[0];
  const baseAnnualFee = parseRupeeFee(estProgram.annualFee);
  let waiverPct = 0;
  let waiverReason = 'Standard tuition applies below 75% in general merit';
  if (estTrack === 'sports') {
    waiverPct = estScorePct >= 80 ? 100 : 50;
    waiverReason = 'Sports & NCC Excellence Track (50%–100% subject to trial certificate)';
  } else if (estTrack === 'firstgen') {
    waiverPct = estScorePct >= 75 ? 25 : 0;
    waiverReason = estScorePct >= 75 ? 'First-Generation Graduate Bursary (25% Concession)' : 'Requires ≥ 75% qualifying marks';
  } else {
    if (estScorePct >= 95) {
      waiverPct = 100;
      waiverReason = 'VLBJ Academic Merit Tier I (95%+ aggregate)';
    } else if (estScorePct >= 90) {
      waiverPct = 50;
      waiverReason = 'VLBJ Academic Merit Tier II (90%–94.9% aggregate)';
    } else if (estScorePct >= 85) {
      waiverPct = 25;
      waiverReason = 'VLBJ Academic Merit Tier III (85%–89.9% aggregate)';
    }
  }
  const estimatedWaiverAmount = Math.round((baseAnnualFee * waiverPct) / 100);
  const netAnnualFee = baseAnnualFee - estimatedWaiverAmount;

  const handleApplySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantName,
          email,
          phone,
          programCode: selectedProgramCode,
          qualifyingScore,
          boardOrUniversity,
          hostelRequired,
          scholarshipTrack:
            scholarshipTrack === 'None (General Merit Admission)' ? undefined : scholarshipTrack,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || 'Unable to submit application.');
      } else {
        setSubmittedApp(data.application);
        setApplicantName('');
        setEmail('');
        setPhone('');
        setQualifyingScore('');
        setHostelRequired(false);
        await fetchApplications(lookupQuery);
      }
    } catch {
      setSubmitError('Network error while submitting admission application.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackSearch = (e: FormEvent) => {
    e.preventDefault();
    fetchApplications(lookupQuery);
  };

  return (
    <div className="space-y-12 pb-16 pt-8">
      <div className="border-b border-[#E5DFD5] pb-8">
        <p className="text-xs uppercase tracking-widest text-[#78716C]">
          Academic Cycle 2026–2027 · Merit, Scholarships &amp; Counseling Track
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#1C1917]">
          Admission Portal
        </h1>
        <p className="mt-3 text-base text-[#44403C] max-w-2xl leading-relaxed">
          Review degree eligibility, annual tuition schedules, and institutional scholarship schemes across UG, PG,
          and Doctoral programs. Submit your online application to generate an official tracking reference.
        </p>
      </div>

      {/* Program Matrix */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-serif text-2xl font-semibold text-[#1C1917]">
            Degree Programs &amp; Seat Matrix
          </h2>
          <div className="inline-flex items-center gap-1 p-1 bg-[#F4F0E8] border border-[#E5DFD5] rounded-lg self-start">
            {(['ALL', 'UG', 'PG', 'PhD'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevelFilter(lvl)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  levelFilter === lvl
                    ? 'bg-[#FBF9F5] text-[#1C1917] shadow-xs border border-[#E5DFD5]'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                {lvl === 'ALL' ? 'All Degrees' : lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto border border-[#E5DFD5] bg-[#FBF9F5]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5DFD5] bg-[#F4F0E8] text-xs uppercase tracking-wider text-[#57534E]">
                <th className="py-3.5 px-4 font-semibold">Program</th>
                <th className="py-3.5 px-4 font-semibold">Level</th>
                <th className="py-3.5 px-4 font-semibold">Eligibility</th>
                <th className="py-3.5 px-4 font-semibold text-right">Annual Fee</th>
                <th className="py-3.5 px-4 font-semibold text-right">Intake</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DFD5] text-sm">
              {filteredPrograms.map((prog) => (
                <tr key={prog.code} className="hover:bg-[#F4F0E8]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-[#1C1917]">{prog.name}</div>
                    <div className="text-xs text-[#78716C] mt-0.5">
                      {prog.code} · {prog.department} · {prog.duration}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[#44403C]">{prog.level}</td>
                  <td className="py-3.5 px-4 text-xs text-[#44403C] max-w-xs">{prog.eligibility}</td>
                  <td className="py-3.5 px-4 font-mono text-right tabular-nums text-[#1C1917]">
                    {prog.annualFee}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-right tabular-nums text-[#44403C]">
                    {prog.intake}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProgramCode(prog.code);
                        document.getElementById('admission-form-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-xs font-semibold text-[#1E3A8A] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Scholarship Opportunities & Interactive Waiver Estimator */}
      <section className="border-t border-[#E5DFD5] pt-10 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#854D0E]">
              <Award className="w-4 h-4" />
              Financial Aid &amp; Tuition Waivers
            </div>
            <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
              Scholarship Opportunities (2026–27)
            </h2>
            <p className="mt-2 text-sm text-[#44403C] max-w-2xl leading-relaxed">
              Over ₹3.8 Crore in annual merit, sports, first-generation, and government scholarships are disbursed to
              eligible scholars at SKASC. Select a scheme to attach it directly to your admission application.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {scholarshipCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setScholarshipCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  scholarshipCategory === cat
                    ? 'bg-[#1C1917] text-[#FBF9F5] border-[#1C1917]'
                    : 'bg-[#F4F0E8] text-[#57534E] border-[#E5DFD5] hover:text-[#1C1917]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Scholarship Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleScholarships.map((sch) => (
            <article
              key={sch.id}
              className="border border-[#E5DFD5] bg-[#FBF9F5] p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#78716C]">
                  <span>{sch.category}</span>
                  <span className="font-mono">Due {sch.deadline}</span>
                </div>
                <h3 className="mt-2 font-serif text-xl font-semibold text-[#1C1917]">{sch.name}</h3>
                <p className="mt-1.5 font-mono text-sm font-medium text-[#1E3A8A]">{sch.waiverRange}</p>
                <p className="mt-3 text-xs text-[#292524] leading-relaxed">
                  <span className="font-semibold">Eligibility:</span> {sch.eligibility}
                </p>
                <p className="mt-2 text-xs text-[#57534E] leading-relaxed">{sch.benefitDetail}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#E5DFD5] flex items-center justify-between">
                <span className="text-xs text-[#78716C]">Attach to Admission Form</span>
                <button
                  type="button"
                  onClick={() => {
                    setScholarshipTrack(sch.name);
                    document.getElementById('admission-form-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs font-semibold text-[#1E3A8A] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Apply with Scheme
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Interactive Tuition Waiver Estimator */}
        <div className="border border-[#E5DFD5] bg-[#F4F0E8] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-serif text-2xl font-semibold text-[#1C1917]">
              Scholarship Tuition Waiver Estimator
            </h3>
            <p className="text-sm text-[#44403C]">
              Preview your estimated annual tuition waiver based on your qualifying percentage and scholarship category.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label htmlFor="est-prog" className="block text-xs font-medium text-[#44403C] mb-1">
                  Target Program
                </label>
                <select
                  id="est-prog"
                  value={estProgramCode}
                  onChange={(e) => setEstProgramCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                >
                  {PROGRAMS.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.code} ({p.annualFee})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="est-track" className="block text-xs font-medium text-[#44403C] mb-1">
                  Scholarship Track
                </label>
                <select
                  id="est-track"
                  value={estTrack}
                  onChange={(e) => setEstTrack(e.target.value as 'merit' | 'sports' | 'firstgen')}
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                >
                  <option value="merit">VLBJ Merit Waiver</option>
                  <option value="sports">Sports &amp; NCC Excellence</option>
                  <option value="firstgen">First-Generation Bursary</option>
                </select>
              </div>

              <div>
                <label htmlFor="est-score" className="block text-xs font-medium text-[#44403C] mb-1">
                  Qualifying Score ({estScorePct}%)
                </label>
                <input
                  id="est-score"
                  type="range"
                  min={60}
                  max={100}
                  value={estScorePct}
                  onChange={(e) => setEstScorePct(Number(e.target.value))}
                  className="w-full accent-[#1E3A8A] mt-2"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 border border-[#D6CEBE] bg-[#FBF9F5] p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#57534E]">
              <span>Base Annual Fee</span>
              <span className="font-mono tabular-nums">₹{baseAnnualFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#14532D] font-medium">
              <span>Estimated Waiver ({waiverPct}%)</span>
              <span className="font-mono tabular-nums">− ₹{estimatedWaiverAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-3 border-t border-[#E5DFD5] flex items-baseline justify-between">
              <span className="text-sm font-semibold text-[#1C1917]">Estimated Net Annual Tuition</span>
              <span className="font-mono text-2xl font-medium text-[#1E3A8A] tabular-nums">
                ₹{netAnnualFee.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[11px] text-[#78716C]">{waiverReason}</p>
          </div>
        </div>
      </section>

      {/* Application Form + Tracker Split */}
      <section id="admission-form-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-[#E5DFD5]">
        {/* Form */}
        <div className="lg:col-span-7 border border-[#E5DFD5] bg-[#F4F0E8]/55 p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-semibold text-[#1C1917]">
            Online Admission Application
          </h2>
          <p className="mt-1 text-sm text-[#57534E]">
            No application fee required for initial merit &amp; scholarship registration.
          </p>

          {submittedApp && (
            <div className="mt-5 p-4 border border-[#14532D]/30 bg-[#14532D]/5 text-[#14532D]">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold">
                    Application Registered · Reference{' '}
                    <span className="font-mono">{submittedApp.id}</span>
                  </p>
                  <p className="mt-1 text-xs text-[#1C1917]">
                    {submittedApp.applicantName} applied for {submittedApp.programName}
                    {submittedApp.scholarshipTrack ? ` (${submittedApp.scholarshipTrack})` : ''}. Status:{' '}
                    {submittedApp.status}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {submitError && (
            <div className="mt-5 p-3 border border-[#9A3412]/40 bg-[#9A3412]/5 text-sm text-[#9A3412]">
              {submitError}
            </div>
          )}

          <form onSubmit={handleApplySubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="adm-name" className="block text-xs font-medium text-[#44403C] mb-1.5">
                  Applicant Full Name
                </label>
                <input
                  id="adm-name"
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="e.g., Aaravinth Subramanian"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-[#1C1917]"
                />
              </div>
              <div>
                <label htmlFor="adm-email" className="block text-xs font-medium text-[#44403C] mb-1.5">
                  Email Address
                </label>
                <input
                  id="adm-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.edu"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-[#1C1917]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="adm-phone" className="block text-xs font-medium text-[#44403C] mb-1.5">
                  Mobile Number
                </label>
                <input
                  id="adm-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98422 00000"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-[#1C1917]"
                />
              </div>
              <div>
                <label htmlFor="adm-program" className="block text-xs font-medium text-[#44403C] mb-1.5">
                  Preferred Degree Program
                </label>
                <select
                  id="adm-program"
                  value={selectedProgramCode}
                  onChange={(e) => setSelectedProgramCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-[#1C1917]"
                >
                  {PROGRAMS.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.code} — {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="adm-score" className="block text-xs font-medium text-[#44403C] mb-1.5">
                  Qualifying Exam Score (% or CGPA)
                </label>
                <input
                  id="adm-score"
                  type="text"
                  required
                  value={qualifyingScore}
                  onChange={(e) => setQualifyingScore(e.target.value)}
                  placeholder="e.g., 92.4% or 8.8 CGPA"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-[#1C1917]"
                />
              </div>
              <div>
                <label htmlFor="adm-board" className="block text-xs font-medium text-[#44403C] mb-1.5">
                  Qualifying Board / University
                </label>
                <input
                  id="adm-board"
                  type="text"
                  value={boardOrUniversity}
                  onChange={(e) => setBoardOrUniversity(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-[#1C1917]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="adm-scholarship" className="block text-xs font-medium text-[#44403C] mb-1.5">
                Scholarship Opportunity Consideration
              </label>
              <select
                id="adm-scholarship"
                value={scholarshipTrack}
                onChange={(e) => setScholarshipTrack(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-[#1C1917]"
              >
                <option value="None (General Merit Admission)">None (General Merit Admission)</option>
                {SCHOLARSHIP_OPPORTUNITIES.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.waiverRange})
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2.5 text-sm text-[#44403C] pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={hostelRequired}
                onChange={(e) => setHostelRequired(e.target.checked)}
                className="w-4 h-4 accent-[#1E3A8A]"
              />
              Request campus residential hostel accommodation upon admission
            </label>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 text-sm font-semibold text-[#FBF9F5] bg-[#1E3A8A] hover:bg-[#172554] disabled:opacity-60 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {submitting ? 'Submitting Application...' : 'Submit Admission Application'}
              </button>
            </div>
          </form>
        </div>

        {/* Tracker */}
        <div className="lg:col-span-5 border border-[#E5DFD5] bg-[#FBF9F5] p-6 sm:p-8 flex flex-col">
          <h2 className="font-serif text-2xl font-semibold text-[#1C1917]">
            Application Status Tracker
          </h2>
          <p className="mt-1 text-sm text-[#57534E]">
            Search by Reference ID (e.g., SKASC-2026-4102) or applicant name.
          </p>

          <form onSubmit={handleTrackSearch} className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                placeholder="Search ID, name, or email"
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#F4F0E8] border border-[#D6CEBE] rounded-md text-[#1C1917]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-[#1C1917] text-[#FBF9F5] rounded-md hover:bg-[#292524] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Lookup
            </button>
          </form>

          <div className="mt-6 divide-y divide-[#E5DFD5] overflow-y-auto max-h-[420px]">
            {loadingApps ? (
              <p className="py-6 text-sm text-[#78716C]">Loading admission registry...</p>
            ) : applications.length === 0 ? (
              <p className="py-6 text-sm text-[#78716C]">No matching application records found.</p>
            ) : (
              applications.map((app) => (
                <div key={app.id} className="py-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-medium text-[#1E3A8A]">{app.id}</span>
                    <span className="text-xs text-[#57534E]">{app.status}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-[#1C1917]">{app.applicantName}</p>
                  <p className="text-xs text-[#78716C] mt-0.5">
                    {app.programName} · Score: {app.qualifyingScore} · {app.submittedAt}
                  </p>
                  {app.scholarshipTrack && (
                    <p className="text-xs text-[#854D0E] mt-1">
                      Scholarship: {app.scholarshipTrack}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
