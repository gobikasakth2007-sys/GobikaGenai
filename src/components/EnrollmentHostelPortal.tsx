import { useEffect, useState, FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ENROLLMENT_SUMMARY, IMAGES, PROGRAMS } from '../data/collegeData';
import type { HostelBlock, HostelRequest } from '../types/portal';
import { EditorialImage } from './EditorialImage';

export function EnrollmentHostelPortal() {
  const [hostels, setHostels] = useState<HostelBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupFilter, setGroupFilter] = useState<string>('All');

  // Hostel Request Form
  const [studentName, setStudentName] = useState('');
  const [registerOrAppId, setRegisterOrAppId] = useState('');
  const [email, setEmail] = useState('');
  const [selectedHostelId, setSelectedHostelId] = useState('hst-kurinji');
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [reservedRecord, setReservedRecord] = useState<HostelRequest | null>(null);

  const loadHostels = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hostel');
      if (res.ok) {
        const data = await res.json();
        const blocks: HostelBlock[] = data.hostels ?? [];
        setHostels(blocks);
        if (blocks.length > 0) {
          const firstBlock = blocks.find((b) => b.id === selectedHostelId) || blocks[0];
          setSelectedHostelId(firstBlock.id);
          if (firstBlock.roomTypes.length > 0 && !selectedRoomType) {
            setSelectedRoomType(firstBlock.roomTypes[0].type);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHostels();
  }, []);

  const currentFormBlock = hostels.find((h) => h.id === selectedHostelId) ?? hostels[0];

  const handleHostelChange = (id: string) => {
    setSelectedHostelId(id);
    const blk = hostels.find((h) => h.id === id);
    if (blk && blk.roomTypes.length > 0) {
      setSelectedRoomType(blk.roomTypes[0].type);
    }
  };

  const handleReserveSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/hostel/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          registerOrAppId,
          email,
          hostelId: selectedHostelId,
          roomType: selectedRoomType,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not reserve bed.');
      } else {
        setReservedRecord(data.request);
        if (data.hostels) {
          setHostels(data.hostels);
        }
        setStudentName('');
        setRegisterOrAppId('');
        setEmail('');
      }
    } catch {
      setErrorMsg('Network error submitting hostel reservation.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalHostelBeds = hostels.reduce((sum, h) => sum + h.totalBeds, 0);
  const totalOccupied = hostels.reduce((sum, h) => sum + h.occupiedBeds, 0);
  const totalVacant = totalHostelBeds - totalOccupied;

  const groups = ['All', "Men's Residence", "Women's Residence", 'PG & International'];
  const visibleHostels =
    groupFilter === 'All' ? hostels : hostels.filter((h) => h.residentGroup === groupFilter);

  return (
    <div className="space-y-12 pb-16 pt-8">
      <div className="border-b border-[#E5DFD5] pb-8">
        <p className="text-xs uppercase tracking-widest text-[#78716C]">
          Academic Year {ENROLLMENT_SUMMARY.academicYear} · Registrar &amp; Chief Warden Registry
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#1C1917]">
          Total Enrollment Details &amp; Hostel Availability
        </h1>
        <p className="mt-3 text-base text-[#44403C] max-w-2xl leading-relaxed">
          Transparent student headcount across UG, PG, and Doctoral schools alongside live bed vacancy across all
          five on-campus residential halls.
        </p>
      </div>

      {/* Total Enrollment Summary */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl font-semibold text-[#1C1917]">
          Institutional Enrollment Ledger ({ENROLLMENT_SUMMARY.academicYear})
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 border border-[#E5DFD5] bg-[#F4F0E8] divide-y lg:divide-y-0 lg:divide-x divide-[#E5DFD5]">
          <div className="p-6">
            <p className="text-xs uppercase tracking-wider text-[#78716C]">Total Active Scholars</p>
            <p className="mt-2 font-mono text-3xl font-medium text-[#1C1917] tabular-nums">
              {ENROLLMENT_SUMMARY.totalEnrolled.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[#57534E]">
              {ENROLLMENT_SUMMARY.womenSharePercent}% Women · {ENROLLMENT_SUMMARY.menSharePercent}% Men
            </p>
          </div>
          <div className="p-6">
            <p className="text-xs uppercase tracking-wider text-[#78716C]">Undergraduate Cohort</p>
            <p className="mt-2 font-mono text-3xl font-medium text-[#1C1917] tabular-nums">
              {ENROLLMENT_SUMMARY.ugCount.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[#57534E]">Across 28 Autonomous UG Streams</p>
          </div>
          <div className="p-6">
            <p className="text-xs uppercase tracking-wider text-[#78716C]">PG &amp; Ph.D. Scholars</p>
            <p className="mt-2 font-mono text-3xl font-medium text-[#1C1917] tabular-nums">
              {(ENROLLMENT_SUMMARY.pgCount + ENROLLMENT_SUMMARY.phdCount).toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[#57534E]">
              {ENROLLMENT_SUMMARY.pgCount.toLocaleString()} PG · {ENROLLMENT_SUMMARY.phdCount} Doctoral
            </p>
          </div>
          <div className="p-6">
            <p className="text-xs uppercase tracking-wider text-[#78716C]">Live Hostel Beds Vacant</p>
            <p className="mt-2 font-mono text-3xl font-medium text-[#1E3A8A] tabular-nums">
              {loading ? '—' : totalVacant}
            </p>
            <p className="mt-1 text-xs text-[#57534E]">
              Out of {totalHostelBeds.toLocaleString()} Residential Beds
            </p>
          </div>
        </div>

        {/* Program Enrollment Table */}
        <div className="overflow-x-auto border border-[#E5DFD5] bg-[#FBF9F5]">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#E5DFD5] bg-[#F4F0E8] text-xs uppercase tracking-wider text-[#57534E]">
                <th className="py-3 px-4 font-semibold">Program</th>
                <th className="py-3 px-4 font-semibold">School</th>
                <th className="py-3 px-4 font-semibold text-right">Sanctioned Intake</th>
                <th className="py-3 px-4 font-semibold text-right">Current Enrolled</th>
                <th className="py-3 px-4 font-semibold text-right">Fill Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DFD5]">
              {PROGRAMS.slice(0, 8).map((p) => {
                const pct = Math.round((p.enrolled / p.intake) * 100);
                return (
                  <tr key={p.code}>
                    <td className="py-3 px-4 font-medium text-[#1C1917]">{p.name}</td>
                    <td className="py-3 px-4 text-xs text-[#57534E]">{p.department}</td>
                    <td className="py-3 px-4 font-mono text-right tabular-nums text-[#44403C]">{p.intake}</td>
                    <td className="py-3 px-4 font-mono text-right tabular-nums text-[#1C1917]">{p.enrolled}</td>
                    <td className="py-3 px-4 font-mono text-right tabular-nums text-[#1E3A8A]">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Live Hostel Availability */}
      <section className="space-y-6 border-t border-[#E5DFD5] pt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
              On-Campus Hostel Availability
            </h2>
            <p className="mt-1 text-sm text-[#57534E]">
              Live room inventory updated directly upon seat reservation.
            </p>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {groups.map((grp) => (
              <button
                key={grp}
                type="button"
                onClick={() => setGroupFilter(grp)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  groupFilter === grp
                    ? 'bg-[#1C1917] text-[#FBF9F5] border-[#1C1917]'
                    : 'bg-[#F4F0E8] text-[#57534E] border-[#E5DFD5] hover:text-[#1C1917]'
                }`}
              >
                {grp}
              </button>
            ))}
          </div>
        </div>

        {/* Residential Architecture & Study Room Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditorialImage
            src={IMAGES.hostelResidence}
            alt="On-campus student residential hostel courtyard and sandstone facade at SKASC"
            caption="Kurinji & Marutham Residential Courtyard — shaded gardens, biometric entry, and dining halls."
            aspectClass="aspect-[4/3]"
          />
          <EditorialImage
            src={IMAGES.hostelStudyRoom}
            alt="Contemporary twin-sharing student hostel study room interior at SKASC"
            caption="Twin-Sharing & Single AC Study Suites — dedicated oak study desks, bookshelves, and 1 Gbps Wi-Fi."
            aspectClass="aspect-[4/3]"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5">
            {loading ? (
              <p className="text-sm text-[#78716C]">Loading hostel occupancy...</p>
            ) : (
              visibleHostels.map((blk) => {
                const vacant = blk.totalBeds - blk.occupiedBeds;
                return (
                  <article key={blk.id} className="border border-[#E5DFD5] bg-[#FBF9F5] p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs text-[#78716C]">
                          {blk.residentGroup} · Warden: {blk.warden}
                        </p>
                        <h3 className="mt-1 font-serif text-xl font-semibold text-[#1C1917]">{blk.name}</h3>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-lg font-medium text-[#1E3A8A] tabular-nums">
                          {vacant} Beds Vacant
                        </p>
                        <p className="font-mono text-xs text-[#78716C] tabular-nums">
                          {blk.occupiedBeds} / {blk.totalBeds} Occupied
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 divide-y divide-[#E5DFD5] border-t border-[#E5DFD5] text-sm">
                      {blk.roomTypes.map((rt) => (
                        <div key={rt.type} className="py-2.5 flex items-center justify-between gap-4">
                          <span className="text-[#292524]">{rt.type}</span>
                          <div className="flex items-center gap-4 font-mono text-xs tabular-nums">
                            <span className="text-[#57534E]">{rt.annualFee}/yr</span>
                            <span className={rt.availableBeds > 0 ? 'text-[#14532D] font-semibold' : 'text-[#9A3412]'}>
                              {rt.availableBeds} open
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 pt-3 border-t border-[#E5DFD5] text-xs text-[#57534E]">
                      {blk.amenities.join(' · ')}
                    </p>
                  </article>
                );
              })
            )}
          </div>

          {/* Hostel Seat Reservation Form */}
          <div className="lg:col-span-5 border border-[#E5DFD5] bg-[#F4F0E8] p-6 sm:p-8">
            <h3 className="font-serif text-2xl font-semibold text-[#1C1917]">
              Request Hostel Bed Allocation
            </h3>
            <p className="mt-1 text-sm text-[#57534E]">
              Enter your Admission Reference or Roll Number to lock a vacant bed.
            </p>

            {reservedRecord && (
              <div className="mt-5 p-4 border border-[#14532D]/30 bg-[#14532D]/5 text-[#14532D] text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">
                      Bed Reserved · ID <span className="font-mono">{reservedRecord.id}</span>
                    </p>
                    <p className="text-xs text-[#1C1917] mt-1">
                      {reservedRecord.hostelName} ({reservedRecord.roomType})
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

            <form onSubmit={handleReserveSubmit} className="mt-5 space-y-4">
              <div>
                <label htmlFor="hst-name" className="block text-xs font-medium text-[#44403C] mb-1">
                  Student Full Name
                </label>
                <input
                  id="hst-name"
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g., Shreya Venkataraman"
                  className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                />
              </div>

              <div>
                <label htmlFor="hst-appid" className="block text-xs font-medium text-[#44403C] mb-1">
                  Admission ID / Roll Number
                </label>
                <input
                  id="hst-appid"
                  type="text"
                  required
                  value={registerOrAppId}
                  onChange={(e) => setRegisterOrAppId(e.target.value)}
                  placeholder="e.g., SKASC-2026-4102"
                  className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                />
              </div>

              <div>
                <label htmlFor="hst-email" className="block text-xs font-medium text-[#44403C] mb-1">
                  Email Address
                </label>
                <input
                  id="hst-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.edu"
                  className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                />
              </div>

              <div>
                <label htmlFor="hst-block" className="block text-xs font-medium text-[#44403C] mb-1">
                  Residence Block
                </label>
                <select
                  id="hst-block"
                  value={selectedHostelId}
                  onChange={(e) => handleHostelChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                >
                  {hostels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.residentGroup})
                    </option>
                  ))}
                </select>
              </div>

              {currentFormBlock && (
                <div>
                  <label htmlFor="hst-room" className="block text-xs font-medium text-[#44403C] mb-1">
                    Room Category
                  </label>
                  <select
                    id="hst-room"
                    value={selectedRoomType}
                    onChange={(e) => setSelectedRoomType(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                  >
                    {currentFormBlock.roomTypes.map((r) => (
                      <option key={r.type} value={r.type} disabled={r.availableBeds === 0}>
                        {r.type} — {r.annualFee} ({r.availableBeds} open)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || hostels.length === 0}
                className="w-full py-2.5 text-sm font-semibold bg-[#1E3A8A] text-[#FBF9F5] hover:bg-[#172554] disabled:opacity-60 rounded-md transition-colors cursor-pointer"
              >
                {submitting ? 'Reserving Bed...' : 'Confirm Hostel Seat Request'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
