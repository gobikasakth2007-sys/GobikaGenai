import { useState, FormEvent } from 'react';
import { CheckCircle2, Globe2 } from 'lucide-react';
import { GLOBAL_PARTNERS, IMAGES } from '../data/collegeData';
import { EditorialImage } from './EditorialImage';

export function GlobalPortal() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('B.Sc. Computer Science');
  const [targetUniversity, setTargetUniversity] = useState(GLOBAL_PARTNERS[0].university);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [inquiryId, setInquiryId] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/global/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, department, targetUniversity, notes }),
      });
      if (res.ok) {
        const data = await res.json();
        setInquiryId(data.inquiry?.id || 'GLB-CONFIRMED');
        setName('');
        setEmail('');
        setNotes('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-16 pt-8">
      <div className="border-b border-[#E5DFD5] pb-8">
        <p className="text-xs uppercase tracking-widest text-[#78716C]">
          Office of International Affairs &amp; Academic Mobility
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#1C1917]">
          Global Opportunities Portal
        </h1>
        <p className="mt-3 text-base text-[#44403C] max-w-2xl leading-relaxed">
          Semester abroad pathways, 2+1 degree articulation tracks, funded summer research internships, and
          bilateral MoUs connecting SKASC scholars with universities across Germany, the UK, Singapore, Australia,
          Malaysia, and Canada.
        </p>
      </div>

      {/* Feature Photo + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6">
          <EditorialImage
            src={IMAGES.globalConvocation}
            alt="International academic symposium and convocation hall"
            caption="Fig. 5 — Annual Global Academic Mobility & Articulation Colloquium."
            aspectClass="aspect-[4/3]"
          />
        </div>
        <div className="lg:col-span-6 space-y-5">
          <p className="text-xs uppercase tracking-widest text-[#78716C]">International Pathways</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
            Credit-Transferred Study Abroad Without Losing Academic Time
          </h2>
          <p className="text-sm text-[#44403C] leading-relaxed">
            Because Sri Krishna Arts and Science College operates under UGC Autonomous Choice-Based Credit System
            (CBCS), coursework and lab credits earned during semester exchanges at partner universities transfer
            seamlessly toward your Bharathiar-conferred SKASC degree.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E5DFD5]">
            <div>
              <p className="font-mono text-2xl font-medium text-[#1E3A8A] tabular-nums">6</p>
              <p className="text-xs text-[#57534E]">Active University MoUs</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-medium text-[#1C1917] tabular-nums">90</p>
              <p className="text-xs text-[#57534E]">Annual Mobility Seats</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-medium text-[#1C1917] tabular-nums">60%</p>
              <p className="text-xs text-[#57534E]">Max Tuition Stipend</p>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Universities Grid */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
          Partner Universities &amp; Scholarships
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GLOBAL_PARTNERS.map((partner) => (
            <article key={partner.id} className="border border-[#E5DFD5] bg-[#FBF9F5] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-[#78716C]">
                  <span className="inline-flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-[#1E3A8A]" />
                    {partner.country}
                  </span>
                  <span className="font-mono">MoU {partner.mouYear}</span>
                </div>
                <h3 className="mt-2 font-serif text-xl font-semibold text-[#1C1917]">{partner.university}</h3>
                <p className="mt-2 text-xs font-medium text-[#1E3A8A]">{partner.programs}</p>
                <p className="mt-2.5 text-sm text-[#44403C] leading-relaxed">{partner.summary}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#E5DFD5] space-y-1.5 text-xs">
                <p className="text-[#1C1917]">
                  <span className="font-semibold">Scholarship:</span> {partner.scholarshipAvailable}
                </p>
                <p className="font-mono text-[#57534E] tabular-nums">
                  {partner.seatsPerYear} Nominees / Academic Year
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* International Advisory Form */}
      <section className="border border-[#E5DFD5] bg-[#F4F0E8] p-6 sm:p-8 max-w-3xl">
        <h2 className="font-serif text-2xl font-semibold text-[#1C1917]">
          Request Global Mobility &amp; Scholarship Counseling
        </h2>
        <p className="mt-1 text-sm text-[#57534E]">
          Connect with the Office of International Affairs for eligibility verification and nomination timelines.
        </p>

        {inquiryId && (
          <div className="mt-5 p-4 border border-[#14532D]/30 bg-[#14532D]/5 text-[#14532D] text-sm flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <span>
              Advisory request logged (<span className="font-mono font-medium">{inquiryId}</span>). Our
              International Mobility Coordinator will contact you with nomination checklists.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="glb-name" className="block text-xs font-medium text-[#44403C] mb-1">
                Student / Applicant Name
              </label>
              <input
                id="glb-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
              />
            </div>
            <div>
              <label htmlFor="glb-email" className="block text-xs font-medium text-[#44403C] mb-1">
                Email Address
              </label>
              <input
                id="glb-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="glb-dept" className="block text-xs font-medium text-[#44403C] mb-1">
                Current / Prospective Degree
              </label>
              <input
                id="glb-dept"
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
              />
            </div>
            <div>
              <label htmlFor="glb-uni" className="block text-xs font-medium text-[#44403C] mb-1">
                Target Partner University
              </label>
              <select
                id="glb-uni"
                value={targetUniversity}
                onChange={(e) => setTargetUniversity(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
              >
                {GLOBAL_PARTNERS.map((g) => (
                  <option key={g.id} value={g.university}>
                    {g.university} ({g.country})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="glb-notes" className="block text-xs font-medium text-[#44403C] mb-1">
              Academic Track or Scholarship Questions
            </label>
            <textarea
              id="glb-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Interested in Semester V credit transfer or summer research..."
              className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 text-sm font-semibold bg-[#1E3A8A] text-[#FBF9F5] hover:bg-[#172554] rounded-md cursor-pointer"
          >
            {submitting ? 'Submitting Inquiry...' : 'Submit Global Opportunity Inquiry'}
          </button>
        </form>
      </section>
    </div>
  );
}
