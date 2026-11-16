import { useEffect, useState, FormEvent } from 'react';
import { CheckCircle2, Calendar, MapPin } from 'lucide-react';
import { INTER_COLLEGE_EVENTS } from '../data/collegeData';
import type { EventRegistration } from '../types/portal';

export function InterCollegePortal() {
  const [selectedEventId, setSelectedEventId] = useState(INTER_COLLEGE_EVENTS[0].id);
  const [participantName, setParticipantName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [teamMembers, setTeamMembers] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedPass, setConfirmedPass] = useState<EventRegistration | null>(null);
  const [recentPasses, setRecentPasses] = useState<EventRegistration[]>([]);

  useEffect(() => {
    fetch('/api/events/registrations')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.registrations) setRecentPasses(d.registrations);
      })
      .catch(() => {});
  }, []);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEventId,
          participantName,
          collegeName,
          email,
          phone,
          teamMembers,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not register for event.');
      } else {
        setConfirmedPass(data.registration);
        setRecentPasses((prev) => [data.registration, ...prev]);
        setParticipantName('');
        setCollegeName('');
        setEmail('');
        setPhone('');
        setTeamMembers('');
      }
    } catch {
      setErrorMsg('Network error submitting event registration.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-16 pt-8">
      <div className="border-b border-[#E5DFD5] pb-8">
        <p className="text-xs uppercase tracking-widest text-[#78716C]">
          External College Delegates &amp; National Competitions
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#1C1917]">
          Inter-College Event Application Portal
        </h1>
        <p className="mt-3 text-base text-[#44403C] max-w-2xl leading-relaxed">
          Open registration for visiting undergraduate and postgraduate teams across India. Select an upcoming
          symposium or hackathon to receive your official SKASC Delegate Entry Pass.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Events Catalog */}
        <div className="lg:col-span-7 space-y-5">
          {INTER_COLLEGE_EVENTS.map((evt) => {
            const isSelected = evt.id === selectedEventId;
            return (
              <article
                key={evt.id}
                className={`border p-6 transition-colors ${
                  isSelected
                    ? 'border-[#1E3A8A] bg-[#F4F0E8]'
                    : 'border-[#E5DFD5] bg-[#FBF9F5]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#78716C]">
                  <span>{evt.hostDepartment}</span>
                  <span className="font-mono text-[#1E3A8A] font-medium">
                    {evt.seatsRemaining} Team Slots Left
                  </span>
                </div>

                <h2 className="mt-2 font-serif text-2xl font-semibold text-[#1C1917]">{evt.title}</h2>
                <p className="mt-2 text-sm text-[#44403C] leading-relaxed">{evt.description}</p>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#57534E] font-mono">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#1E3A8A]" />
                    {evt.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#1E3A8A]" />
                    {evt.venue}
                  </span>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E5DFD5] flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-[#292524]">
                    <span className="font-semibold">Prize Pool:</span> {evt.prizePool} ·{' '}
                    <span className="font-mono">{evt.registrationFee}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedEventId(evt.id)}
                    className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#1E3A8A] text-[#FBF9F5]'
                        : 'bg-[#1C1917] text-[#FBF9F5] hover:bg-[#292524]'
                    }`}
                  >
                    {isSelected ? 'Selected for Application' : 'Apply for Event'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Application Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-[#E5DFD5] bg-[#F4F0E8] p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-semibold text-[#1C1917]">
              Delegate Application Form
            </h2>
            <p className="mt-1 text-sm text-[#57534E]">
              Instant gate-entry pass generated upon submission.
            </p>

            {confirmedPass && (
              <div className="mt-5 p-4 border border-[#14532D]/30 bg-[#14532D]/5 text-[#14532D] text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">
                      Delegate Pass Issued ·{' '}
                      <span className="font-mono">{confirmedPass.passCode}</span>
                    </p>
                    <p className="text-xs text-[#1C1917] mt-1">
                      {confirmedPass.participantName} ({confirmedPass.collegeName}) registered for{' '}
                      {confirmedPass.eventTitle}.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mt-4 p-3 border border-[#9A3412]/40 bg-[#9A3412]/5 text-sm text-[#9A3412]">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleRegister} className="mt-5 space-y-4">
              <div>
                <label htmlFor="evt-select" className="block text-xs font-medium text-[#44403C] mb-1">
                  Selected Inter-College Event
                </label>
                <select
                  id="evt-select"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                >
                  {INTER_COLLEGE_EVENTS.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="evt-name" className="block text-xs font-medium text-[#44403C] mb-1">
                  Team Lead / Participant Name
                </label>
                <input
                  id="evt-name"
                  type="text"
                  required
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="e.g., Vigneshwaran M"
                  className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                />
              </div>

              <div>
                <label htmlFor="evt-college" className="block text-xs font-medium text-[#44403C] mb-1">
                  Representing College / University
                </label>
                <input
                  id="evt-college"
                  type="text"
                  required
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g., Loyola College, Chennai"
                  className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="evt-email" className="block text-xs font-medium text-[#44403C] mb-1">
                    Email
                  </label>
                  <input
                    id="evt-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="delegate@college.edu"
                    className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="evt-phone" className="block text-xs font-medium text-[#44403C] mb-1">
                    Mobile
                  </label>
                  <input
                    id="evt-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="evt-team" className="block text-xs font-medium text-[#44403C] mb-1">
                  Co-Participants / Team Members (Optional)
                </label>
                <input
                  id="evt-team"
                  type="text"
                  value={teamMembers}
                  onChange={(e) => setTeamMembers(e.target.value)}
                  placeholder="Names separated by commas, or leave blank for solo"
                  className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 text-sm font-semibold bg-[#1E3A8A] text-[#FBF9F5] hover:bg-[#172554] disabled:opacity-60 rounded-md transition-colors cursor-pointer"
              >
                {submitting ? 'Generating Delegate Pass...' : 'Submit Inter-College Application'}
              </button>
            </form>
          </div>

          {recentPasses.length > 0 && (
            <div className="border border-[#E5DFD5] bg-[#FBF9F5] p-5">
              <h3 className="text-xs uppercase tracking-wider text-[#78716C] font-semibold">
                Recent Issued Passes
              </h3>
              <ul className="mt-3 divide-y divide-[#E5DFD5] text-xs">
                {recentPasses.slice(0, 4).map((p) => (
                  <li key={p.id} className="py-2.5">
                    <span className="font-mono font-medium text-[#1E3A8A]">{p.passCode}</span> ·{' '}
                    <span className="font-medium text-[#1C1917]">{p.participantName}</span> ({p.collegeName})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
