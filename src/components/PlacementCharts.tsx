import { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DepartmentPlacement, PlacementYearStat } from '../types/portal';

interface PlacementChartsProps {
  yearlyStats: PlacementYearStat[];
  departmentStats: DepartmentPlacement[];
}

export function PlacementCharts({ yearlyStats, departmentStats }: PlacementChartsProps) {
  const [annualMetric, setAnnualMetric] = useState<'salary' | 'rate'>('salary');
  const [deptMetric, setDeptMetric] = useState<'rate' | 'ctc'>('rate');

  const departmentChartData = departmentStats.map((d) => ({
    shortName:
      d.department
        .replace('Computer Science & AI', 'CS & AI')
        .replace('Commerce & Accounting', 'Commerce')
        .replace('Management Studies (BBA)', 'BBA')
        .replace('Biosciences & Biotechnology', 'Biosciences')
        .replace('Humanities & English', 'Humanities')
        .replace('Postgraduate Data & Commerce', 'PG Data/Com'),
    fullName: d.department,
    placementPct: Number(((d.placed / d.eligible) * 100).toFixed(1)),
    avgCtcLpa: d.avgCtcLpa,
    topOfferLpa: d.topOfferLpa,
    placed: d.placed,
    eligible: d.eligible,
  }));

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Chart: 5-Year Annual Placement & Salary Growth */}
      <div className="lg:col-span-6 border border-[#E5DFD5] bg-[#FBF9F5] p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#1C1917]">
              Annual Placement &amp; Salary Trends
            </h2>
            <p className="mt-1 text-xs text-[#78716C]">
              {annualMetric === 'salary'
                ? '5-year Highest & Median CTC progression (₹ LPA)'
                : '5-year Campus Placement Percentage & Total Offers'}
            </p>
          </div>

          <div className="inline-flex items-center gap-1 p-1 bg-[#F4F0E8] border border-[#E5DFD5] rounded-lg self-start">
            <button
              type="button"
              onClick={() => setAnnualMetric('salary')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                annualMetric === 'salary'
                  ? 'bg-[#FBF9F5] text-[#1C1917] border border-[#E5DFD5]'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              Salary Growth
            </button>
            <button
              type="button"
              onClick={() => setAnnualMetric('rate')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                annualMetric === 'rate'
                  ? 'bg-[#FBF9F5] text-[#1C1917] border border-[#E5DFD5]'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              Placement %
            </button>
          </div>
        </div>

        <div className="mt-6 h-[270px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {annualMetric === 'salary' ? (
              <AreaChart data={yearlyStats} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="highestCtcFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="medianCtcFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#854D0E" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#854D0E" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5DFD5" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: '#57534E', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                  axisLine={{ stroke: '#D6CEBE' }}
                  tickLine={false}
                />
                <YAxis
                  unit="L"
                  tick={{ fill: '#57534E', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FBF9F5',
                    borderColor: '#D6CEBE',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: '#1C1917',
                  }}
                  formatter={(value: unknown, name: unknown) => [
                    `₹${value} LPA`,
                    name === 'highestCtcLpa' ? 'Highest CTC' : 'Median CTC',
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                  formatter={(value) => (value === 'highestCtcLpa' ? 'Highest CTC (LPA)' : 'Median CTC (LPA)')}
                />
                <Area
                  type="monotone"
                  dataKey="highestCtcLpa"
                  stroke="#1E3A8A"
                  strokeWidth={2}
                  fill="url(#highestCtcFill)"
                />
                <Area
                  type="monotone"
                  dataKey="medianCtcLpa"
                  stroke="#854D0E"
                  strokeWidth={2}
                  fill="url(#medianCtcFill)"
                />
              </AreaChart>
            ) : (
              <BarChart data={yearlyStats} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5DFD5" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: '#57534E', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                  axisLine={{ stroke: '#D6CEBE' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[80, 100]}
                  unit="%"
                  tick={{ fill: '#57534E', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FBF9F5',
                    borderColor: '#D6CEBE',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: '#1C1917',
                  }}
                  formatter={(value: unknown) => [`${value}% Placed`, 'Placement Rate']}
                />
                <Bar dataKey="placementRate" fill="#1E3A8A" radius={[3, 3, 0, 0]} barSize={38} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right Chart: Department-Wise Placement % & Avg CTC */}
      <div className="lg:col-span-6 border border-[#E5DFD5] bg-[#FBF9F5] p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#1C1917]">
              Department Placement Breakdown
            </h2>
            <p className="mt-1 text-xs text-[#78716C]">
              {deptMetric === 'rate'
                ? 'Percentage of eligible students placed per school (2025–26)'
                : 'Average vs. Top CTC offered per school (₹ LPA)'}
            </p>
          </div>

          <div className="inline-flex items-center gap-1 p-1 bg-[#F4F0E8] border border-[#E5DFD5] rounded-lg self-start">
            <button
              type="button"
              onClick={() => setDeptMetric('rate')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                deptMetric === 'rate'
                  ? 'bg-[#FBF9F5] text-[#1C1917] border border-[#E5DFD5]'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              Placed %
            </button>
            <button
              type="button"
              onClick={() => setDeptMetric('ctc')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                deptMetric === 'ctc'
                  ? 'bg-[#FBF9F5] text-[#1C1917] border border-[#E5DFD5]'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              CTC by School
            </button>
          </div>
        </div>

        <div className="mt-6 h-[270px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {deptMetric === 'rate' ? (
              <BarChart
                data={departmentChartData}
                layout="vertical"
                margin={{ top: 4, right: 18, left: 16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5DFD5" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[80, 100]}
                  unit="%"
                  tick={{ fill: '#57534E', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                  axisLine={{ stroke: '#D6CEBE' }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="shortName"
                  width={90}
                  tick={{ fill: '#1C1917', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FBF9F5',
                    borderColor: '#D6CEBE',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: '#1C1917',
                  }}
                  formatter={(value: unknown, _name: unknown, props: { payload?: { placed?: number; eligible?: number } }) => {
                    const p = props?.payload;
                    return [
                      `${value}% (${p?.placed ?? 0}/${p?.eligible ?? 0} students)`,
                      'Placed',
                    ];
                  }}
                />
                <Bar dataKey="placementPct" fill="#1C1917" radius={[0, 3, 3, 0]} barSize={20} />
              </BarChart>
            ) : (
              <BarChart data={departmentChartData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5DFD5" vertical={false} />
                <XAxis
                  dataKey="shortName"
                  tick={{ fill: '#1C1917', fontSize: 10 }}
                  axisLine={{ stroke: '#D6CEBE' }}
                  tickLine={false}
                />
                <YAxis
                  unit="L"
                  tick={{ fill: '#57534E', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FBF9F5',
                    borderColor: '#D6CEBE',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: '#1C1917',
                  }}
                  formatter={(value: unknown, name: unknown) => [
                    `₹${value} LPA`,
                    name === 'topOfferLpa' ? 'Top Offer' : 'Average CTC',
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                  formatter={(value) => (value === 'topOfferLpa' ? 'Top Offer (LPA)' : 'Average CTC (LPA)')}
                />
                <Bar dataKey="avgCtcLpa" fill="#854D0E" radius={[3, 3, 0, 0]} barSize={18} />
                <Bar dataKey="topOfferLpa" fill="#1E3A8A" radius={[3, 3, 0, 0]} barSize={18} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
