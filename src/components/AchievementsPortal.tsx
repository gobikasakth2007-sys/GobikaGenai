import { useState, FormEvent } from 'react';
import { CheckCircle2, Medal, Trophy } from 'lucide-react';
import { ACHIEVEMENTS, IMAGES, SPORTS_CHAMPIONSHIPS } from '../data/collegeData';
import { EditorialImage } from './EditorialImage';

export function AchievementsPortal() {
  const [activeView, setActiveView] = useState<'all' | 'sports' | 'chronicle'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const categories = ['All', 'Accreditation', 'Research', 'Academics', 'Sports & Culture'];

  // Sports Quota & Varsity Trial Form
  const [athleteName, setAthleteName] = useState('');
  const [email, setEmail] = useState('');
  const [sport, setSport] = useState('Track & Field Athletics');
  const [highestLevel, setHighestLevel] = useState('State / National School Games');
  const [preferredTrialDate, setPreferredTrialDate] = useState('2026-12-05');
  const [submittingTrial, setSubmittingTrial] = useState(false);
  const [trialError, setTrialError] = useState<string | null>(null);
  const [trialPass, setTrialPass] = useState<{
    id: string;
    athleteName: string;
    sport: string;
    preferredTrialDate: string;
  } | null>(null);

  const filteredChronicle =
    categoryFilter === 'All'
      ? ACHIEVEMENTS
      : ACHIEVEMENTS.filter((a) => a.category === categoryFilter);

  const handleTrialSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTrialError(null);
    setSubmittingTrial(true);
    try {
      const res = await fetch('/api/sports/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athleteName,
          email,
          sport,
          highestLevel,
          preferredTrialDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTrialError(data.error || 'Could not register sports trial.');
      } else {
        setTrialPass(data.trial);
        setAthleteName('');
        setEmail('');
      }
    } catch {
      setTrialError('Network error submitting sports trial registration.');
    } finally {
      setSubmittingTrial(false);
    }
  };

  return (
    <div className="space-y-12 pb-16 pt-8">
      <div className="border-b border-[#E5DFD5] pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#78716C]">
            Athletics, Varsity Championships &amp; Institutional Chronicle (1997–2026)
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#1C1917]">
            Sports &amp; Achievements Portal
          </h1>
          <p className="mt-3 text-base text-[#44403C] max-w-2xl leading-relaxed">
            Celebrating varsity championship laurels, synthetic track &amp; indoor stadium facilities, and three
            decades of academic accreditation and research milestones from 1997 to 2026.
          </p>
        </div>

        <div className="inline-flex items-center gap-1 p-1 bg-[#F4F0E8] border border-[#E5DFD5] rounded-lg self-start shrink-0">
          {(
            [
              { id: 'all', label: 'All Highlights' },
              { id: 'sports', label: 'Sports & Trials' },
              { id: 'chronicle', label: '1997–2026 Timeline' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveView(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === tab.id
                  ? 'bg-[#FBF9F5] text-[#1C1917] border border-[#E5DFD5]'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sports & Athletics Section */}
      {(activeView === 'all' || activeView === 'sports') && (
        <section className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-7">
              <EditorialImage
                src={IMAGES.sportsComplex}
                alt="Sri Krishna Arts and Science College 400m synthetic athletic track, basketball courts, and cricket pavilion"
                caption="SKASC Athletics Stadium, Floodlit Basketball Courts & Cricket Pavilion — Kuniamuthur Campus."
                aspectClass="aspect-[16/9]"
              />
            </div>

            <div className="lg:col-span-5 border border-[#E5DFD5] bg-[#F4F0E8] p-6 flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#78716C]">
                  Department of Physical Education
                </p>
                <h2 className="mt-2 font-serif text-2xl font-semibold text-[#1C1917]">
                  Varsity Standing &amp; Athletic Infrastructure
                </h2>
                <p className="mt-3 text-sm text-[#44403C] leading-relaxed">
                  Our 8-lane synthetic athletic track, floodlit basketball courts, turf cricket oval, and four indoor
                  sprung-wood badminton courts train over 420 varsity athletes competing across AIU South Zone and
                  Khelo India University championships.
                </p>
              </div>

              <dl className="mt-6 pt-5 border-t border-[#D6CEBE] grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs text-[#78716C]">AIU &amp; State Golds (2023–26)</dt>
                  <dd className="font-mono text-2xl font-medium text-[#1E3A8A] tabular-nums mt-1">34 Medals</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#78716C]">Sports Quota Waiver</dt>
                  <dd className="font-mono text-2xl font-medium text-[#1C1917] tabular-nums mt-1">Up to 100%</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Championship Teams Grid */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#854D0E]" />
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
                Varsity Sports &amp; Championship Laurels
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SPORTS_CHAMPIONSHIPS.map((item) => (
                <article
                  key={item.id}
                  className="border border-[#E5DFD5] bg-[#FBF9F5] p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#78716C]">
                      <span className="font-medium text-[#854D0E]">{item.sport}</span>
                      <span className="font-mono">{item.year}</span>
                    </div>
                    <h3 className="mt-2 font-serif text-xl font-semibold text-[#1C1917]">{item.title}</h3>
                    <p className="mt-1 text-xs font-medium text-[#1E3A8A]">{item.level}</p>
                    <p className="mt-2.5 text-sm text-[#44403C] leading-relaxed">{item.highlights}</p>
                  </div>
                  <p className="mt-4 pt-3 border-t border-[#E5DFD5] text-xs text-[#57534E]">
                    {item.coach}
                  </p>
                </article>
              ))}
            </div>
          </div>

          {/* Sports Quota & Varsity Selection Trial Registration */}
          <div className="border border-[#E5DFD5] bg-[#F4F0E8] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#1E3A8A]">
                <Medal className="w-4 h-4" />
                Sports Scholarship &amp; Quota Trials 2026–27
              </div>
              <h2 className="font-serif text-2xl font-semibold text-[#1C1917]">
                Register for Varsity Selection Trials
              </h2>
              <p className="text-sm text-[#44403C] leading-relaxed">
                District, State, National, and AIU-level student athletes applying for admission under the Sports
                Excellence Waiver (50%–100% tuition + hostel accommodation) can book a physical selection trial
                slot at the Kuniamuthur Stadium.
              </p>
            </div>

            <div className="lg:col-span-7">
              {trialPass && (
                <div className="mb-5 p-4 border border-[#14532D]/30 bg-[#14532D]/5 text-[#14532D] text-sm flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">
                      Trial Call Slip Issued · <span className="font-mono">{trialPass.id}</span>
                    </p>
                    <p className="text-xs text-[#1C1917] mt-1">
                      {trialPass.athleteName} scheduled for {trialPass.sport} trials on{' '}
                      <span className="font-mono">{trialPass.preferredTrialDate}</span>. Bring original merit
                      certificates.
                    </p>
                  </div>
                </div>
              )}

              {trialError && (
                <div className="mb-4 p-3 border border-[#9A3412]/40 bg-[#9A3412]/5 text-sm text-[#9A3412]">
                  {trialError}
                </div>
              )}

              <form onSubmit={handleTrialSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="spt-name" className="block text-xs font-medium text-[#44403C] mb-1">
                      Athlete Full Name
                    </label>
                    <input
                      id="spt-name"
                      type="text"
                      required
                      value={athleteName}
                      onChange={(e) => setAthleteName(e.target.value)}
                      placeholder="e.g., Dharshini K"
                      className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="spt-email" className="block text-xs font-medium text-[#44403C] mb-1">
                      Email Address
                    </label>
                    <input
                      id="spt-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="athlete@example.edu"
                      className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="spt-sport" className="block text-xs font-medium text-[#44403C] mb-1">
                      Discipline
                    </label>
                    <select
                      id="spt-sport"
                      value={sport}
                      onChange={(e) => setSport(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                    >
                      {SPORTS_CHAMPIONSHIPS.map((s) => (
                        <option key={s.id} value={s.sport}>
                          {s.sport}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="spt-level" className="block text-xs font-medium text-[#44403C] mb-1">
                      Highest Representation
                    </label>
                    <select
                      id="spt-level"
                      value={highestLevel}
                      onChange={(e) => setHighestLevel(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                    >
                      <option value="National / Khelo India Medalist">National / Khelo India</option>
                      <option value="State / National School Games">State / School Games</option>
                      <option value="Inter-University / District Winner">District / Zone Winner</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="spt-date" className="block text-xs font-medium text-[#44403C] mb-1">
                      Preferred Trial Date
                    </label>
                    <input
                      id="spt-date"
                      type="date"
                      value={preferredTrialDate}
                      onChange={(e) => setPreferredTrialDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingTrial}
                  className="px-5 py-2.5 text-sm font-semibold bg-[#1E3A8A] text-[#FBF9F5] hover:bg-[#172554] disabled:opacity-60 rounded-md transition-colors cursor-pointer"
                >
                  {submittingTrial ? 'Booking Trial Slot...' : 'Book Varsity Trial Slot'}
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Chronological Achievements Section */}
      {(activeView === 'all' || activeView === 'chronicle') && (
        <section className="space-y-8 border-t border-[#E5DFD5] pt-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#78716C]">
                1997 Founding to 2026 Present Day
              </p>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
                Institutional Achievements Chronicle
              </h2>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-[#1C1917] text-[#FBF9F5] border-[#1C1917]'
                      : 'bg-[#F4F0E8] text-[#57534E] border-[#E5DFD5] hover:text-[#1C1917]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[#E5DFD5] divide-y divide-[#E5DFD5]">
            {filteredChronicle.map((item) => (
              <article
                key={item.id}
                className="py-7 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start"
              >
                <div className="md:col-span-3">
                  <p className="font-mono text-2xl font-medium text-[#1E3A8A] tabular-nums">{item.year}</p>
                  <p className="text-xs text-[#78716C] mt-1">{item.era}</p>
                </div>
                <div className="md:col-span-6">
                  <p className="text-xs text-[#854D0E] font-medium">{item.category}</p>
                  <h3 className="mt-1 font-serif text-2xl font-semibold text-[#1C1917]">{item.title}</h3>
                  <p className="mt-2 text-sm text-[#44403C] leading-relaxed">{item.detail}</p>
                </div>
                <div className="md:col-span-3 md:text-right">
                  {item.metric && (
                    <span className="inline-block font-mono text-xs font-medium text-[#1C1917] bg-[#F4F0E8] border border-[#E5DFD5] px-3 py-1.5">
                      {item.metric}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
