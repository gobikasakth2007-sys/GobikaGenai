import { useState } from 'react';
import { Check } from 'lucide-react';
import { CULTURAL_CLUBS, CULTURAL_FESTIVALS, IMAGES } from '../data/collegeData';
import { EditorialImage } from './EditorialImage';

export function CulturalsPortal() {
  const [joinedClubs, setJoinedClubs] = useState<string[]>([]);

  const toggleClub = (clubId: string) => {
    setJoinedClubs((prev) =>
      prev.includes(clubId) ? prev.filter((id) => id !== clubId) : [...prev, clubId],
    );
  };

  return (
    <div className="space-y-12 pb-16 pt-8">
      <div className="border-b border-[#E5DFD5] pb-8">
        <p className="text-xs uppercase tracking-widest text-[#78716C]">
          Performing Arts, Heritage &amp; Student Societies
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#1C1917]">
          Culturals &amp; Festivals Portal
        </h1>
        <p className="mt-3 text-base text-[#44403C] max-w-2xl leading-relaxed">
          From the three-day Krishnotsav stage to classical Bharatham recitals and Pongal harvest traditions,
          creative expression sits at the centre of student life at SKASC.
        </p>
      </div>

      {/* Hero Stage Photo */}
      <EditorialImage
        src={IMAGES.culturalsStage}
        alt="Classical dance ensemble performing at the SKASC Convention Auditorium during Krishnotsav"
        caption="Fig. 3 — Classical and contemporary arts showcase at the 2,200-seat Sri Krishna Convention Auditorium."
        aspectClass="aspect-[16/9]"
      />

      {/* Annual Festivals Calendar */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
          Annual Cultural Calendar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CULTURAL_FESTIVALS.map((fest) => (
            <article key={fest.id} className="border border-[#E5DFD5] bg-[#FBF9F5] p-6">
              <div className="flex items-center justify-between text-xs text-[#78716C]">
                <span className="font-mono font-medium text-[#854D0E]">{fest.month}</span>
                <span>{fest.scale}</span>
              </div>
              <h3 className="mt-2 font-serif text-2xl font-semibold text-[#1C1917]">{fest.title}</h3>
              <p className="mt-2 text-sm text-[#44403C] leading-relaxed">{fest.description}</p>
              <div className="mt-4 pt-4 border-t border-[#E5DFD5]">
                <p className="text-xs uppercase tracking-wider text-[#78716C] mb-2">Flagship Showcases</p>
                <p className="text-xs text-[#292524] leading-relaxed">
                  {fest.flagshipEvents.join(' · ')}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Student Cultural Societies */}
      <section className="space-y-6 border-t border-[#E5DFD5] pt-10">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
            Active Cultural Clubs &amp; Societies
          </h2>
          <p className="mt-1 text-sm text-[#57534E]">
            Register your interest for upcoming weekly auditions and studio sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CULTURAL_CLUBS.map((club) => {
            const joined = joinedClubs.includes(club.id);
            return (
              <div
                key={club.id}
                className="border border-[#E5DFD5] bg-[#F4F0E8]/60 p-6 flex flex-col justify-between"
              >
                <div>
                  <p className="text-xs text-[#78716C]">
                    {club.category} · {club.membersCount} Members
                  </p>
                  <h3 className="mt-1.5 font-serif text-xl font-semibold text-[#1C1917]">{club.name}</h3>
                  <p className="mt-2 text-sm text-[#44403C] leading-relaxed">{club.description}</p>
                  <p className="mt-3 font-mono text-xs text-[#57534E]">
                    {club.meetingSchedule} · Lead: {club.facultyLead}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E5DFD5] flex items-center justify-between">
                  <span className="text-xs text-[#57534E]">
                    {joined ? 'Audition slot requested' : 'Open for 2026–27 intake'}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleClub(club.id)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      joined
                        ? 'bg-[#14532D] text-[#FBF9F5]'
                        : 'bg-[#1C1917] text-[#FBF9F5] hover:bg-[#292524]'
                    }`}
                  >
                    {joined && <Check className="w-3.5 h-3.5" />}
                    {joined ? 'Registered' : 'Join Society'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
