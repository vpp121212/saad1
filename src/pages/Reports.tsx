import { useState, useRef } from 'react'
import type { Incident } from '../types'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from 'recharts'
import {
  Download, FileText, BarChart3, PieChart as PieIcon, TrendingUp,
  Clock, AlertTriangle, CheckCircle, Activity, ShieldAlert, Zap,
} from 'lucide-react'
import { exportToPdf } from '../utils/pdf'

interface Props {
  incidents: Incident[]
}

function KpiCard({ icon: Icon, label, value, color, sub }: { icon: typeof Activity; label: string; value: string | number; color: string; sub: string }) {
  return (
    <div className="rounded-xl border p-4 flex items-start gap-3 transition-all hover:scale-[1.02] duration-200" style={{
      background: 'var(--card)', borderColor: 'var(--border)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div className="min-w-0">
        <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>{label}</span>
        <p className="text-2xl font-bold font-mono mt-0.5" style={{ color }}>{value}</p>
        <span className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{sub}</span>
      </div>
    </div>
  )
}

const statusColors: Record<string, string> = {
  Open: '#ef4444', 'In Progress': '#f59e0b', Closed: '#22c55e',
}
const severityColors: Record<string, string> = {
  Critical: '#ef4444', High: '#f97316', Medium: '#f59e0b', Low: '#22c55e',
}

export function Reports({ incidents }: Props) {
  const reportRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<'overview' | 'shift' | 'category' | 'station'>('overview')
  const [exporting, setExporting] = useState(false)

  const active = incidents.filter(i => i.status !== 'Closed')
  const open = incidents.filter(i => i.status === 'Open')
  const inProgress = incidents.filter(i => i.status === 'In Progress')
  const closed = incidents.filter(i => i.status === 'Closed')

  const statusData = [
    { name: 'Open', value: open.length, color: '#ef4444' },
    { name: 'In Progress', value: inProgress.length, color: '#f59e0b' },
    { name: 'Closed', value: closed.length, color: '#22c55e' },
  ]

  const shiftData = [
    { name: 'Morning', count: incidents.filter(i => i.shift === 'Morning').length },
    { name: 'Evening', count: incidents.filter(i => i.shift === 'Evening').length },
    { name: 'Night', count: incidents.filter(i => i.shift === 'Night').length },
  ]

  const catCounts = incidents.reduce<Record<string, number>>((acc, i) => {
    acc[i.category] = (acc[i.category] || 0) + 1
    return acc
  }, {})
  const categoryData = Object.entries(catCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)

  const stationCounts = incidents.reduce<Record<string, number>>((acc, i) => {
    acc[i.station] = (acc[i.station] || 0) + 1
    return acc
  }, {})
  const stationData = Object.entries(stationCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)

  const severityCounts = incidents.reduce<Record<string, number>>((acc, i) => {
    acc[i.severity] = (acc[i.severity] || 0) + 1
    return acc
  }, {})
  const severityData = Object.entries(severityCounts).map(([name, count]) => ({
    name, count, color: severityColors[name] || '#6b7280',
  }))

  const dailyData = [
    { day: 'Sat', count: incidents.filter(i => i.day === 'Saturday').length },
    { day: 'Sun', count: incidents.filter(i => i.day === 'Sunday').length },
    { day: 'Mon', count: incidents.filter(i => i.day === 'Monday').length },
    { day: 'Tue', count: incidents.filter(i => i.day === 'Tuesday').length },
    { day: 'Wed', count: incidents.filter(i => i.day === 'Wednesday').length },
    { day: 'Thu', count: incidents.filter(i => i.day === 'Thursday').length },
    { day: 'Fri', count: incidents.filter(i => i.day === 'Friday').length },
  ]

  const avgResponse = incidents.filter(i => i.occResponseTime).length
    ? incidents.filter(i => i.occResponseTime).reduce((s, i) => {
        const det = i.discoveryTime.split(':').map(Number)
        const res = i.occResponseTime.split(':').map(Number)
        const diff = (res[0] * 60 + res[1]) - (det[0] * 60 + det[1])
        return s + (diff >= 0 ? diff : 0)
      }, 0) / incidents.filter(i => i.occResponseTime).length
    : 0

  const handleExportPdf = async () => {
    if (!reportRef.current) return
    setExporting(true)
    try {
      await exportToPdf(reportRef.current, `report-${Date.now()}`, 'Incident Analytics')
    } finally {
      setExporting(false)
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="rounded-lg border px-3 py-2 text-[11px] font-mono" style={{ background: 'var(--popover)', borderColor: 'var(--border)' }}>
          <p style={{ color: 'var(--foreground)' }}>{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} style={{ color: p.color || 'var(--muted-foreground)' }}>{p.name || 'Count'}: {p.value}</p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Reports & Analytics</p>
          <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {incidents.length} total incidents · {active.length} active
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-semibold transition-all hover:opacity-85 disabled:opacity-50"
            style={{ background: 'var(--primary)', color: 'var(--background)' }}
            onClick={handleExportPdf}
            disabled={exporting}
          >
            <Download size={13} />
            {exporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard icon={Activity} label="Total Incidents" value={incidents.length} color="var(--foreground)" sub="All time" />
        <KpiCard icon={AlertTriangle} label="Active" value={active.length} color="#ef4444" sub="Open / In progress" />
        <KpiCard icon={CheckCircle} label="Resolved" value={closed.length} color="#22c55e" sub="Closed" />
        <KpiCard icon={Clock} label="Avg Response" value={`${avgResponse.toFixed(0)}m`} color="var(--primary)" sub="Discovery to OCC" />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard icon={ShieldAlert} label="Critical" value={incidents.filter(i => i.severity === 'Critical').length} color="#ef4444" sub="Requires immediate action" />
        <KpiCard icon={Zap} label="High" value={incidents.filter(i => i.severity === 'High').length} color="#f97316" sub="Urgent" />
        <KpiCard icon={BarChart3} label="Categories" value={categoryData.length} color="var(--primary)" sub="Unique types" />
        <KpiCard icon={TrendingUp} label="Stations" value={stationData.length} color="var(--foreground)" sub="Affected" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        {[
          { k: 'overview' as const, l: 'Overview', icon: PieIcon },
          { k: 'shift' as const, l: 'Shifts', icon: Clock },
          { k: 'category' as const, l: 'Categories', icon: BarChart3 },
          { k: 'station' as const, l: 'Stations', icon: FileText },
        ].map(({ k, l, icon: Icon }) => (
          <button key={k} className="flex-1 py-2.5 text-[11px] font-mono flex items-center justify-center gap-1.5 transition-all" style={{
            background: view === k ? 'var(--primary)' : 'var(--card)',
            color: view === k ? '#fff' : 'var(--muted-foreground)',
          }} onClick={() => setView(k)}>
            <Icon size={12} /> {l}
          </button>
        ))}
      </div>

      {/* Charts Area */}
      <div ref={reportRef} className="space-y-4">
        {view === 'overview' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard title="Status Distribution" subtitle="Current state of all incidents">
                <div className="flex items-center justify-center gap-6 h-full w-full">
                  <PieChart width={200} height={200}>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={48} outerRadius={75} dataKey="value"
                      paddingAngle={2}
                      labelLine={false}>
                      {statusData.map(e => <Cell key={e.name} fill={e.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="middle" align="right" layout="vertical"
                      iconType="circle" iconSize={10}
                      formatter={(value: string) => {
                        const item = statusData.find(d => d.name === value)
                        return (
                          <span className="text-[12px] font-mono" style={{ color: 'var(--muted-foreground)' }}>
                            {value} <span className="font-semibold" style={{ color: 'var(--foreground)' }}>({item?.value ?? 0})</span>
                          </span>
                        )
                      }}
                    />
                  </PieChart>
                </div>
              </ChartCard>
              <ChartCard title="Severity Distribution" subtitle="Impact level breakdown">
                <BarChart data={severityData} layout="vertical">
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'var(--foreground)' }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={32}>
                    {severityData.map(e => <Cell key={e.name} fill={e.color} />)}
                  </Bar>
                </BarChart>
              </ChartCard>
            </div>
            <ChartCard title="Daily Activity" subtitle="Incidents per day of the week">
              <AreaChart data={dailyData} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="dailyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} strokeOpacity={0.4} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontWeight: 500 }} axisLine={false} tickLine={false} dy={5} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} allowDecimals={false} dx={-5} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="count" stroke="var(--primary)" fill="url(#dailyGrad)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--primary)', stroke: 'var(--card)', strokeWidth: 2 }} activeDot={{ r: 6, fill: 'var(--primary)', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ChartCard>
          </>
        )}

        {view === 'shift' && (
          <ChartCard title="Incidents by Shift" subtitle="Distribution across Morning, Evening, and Night">
            <BarChart data={shiftData}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} strokeOpacity={0.4} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontWeight: 500 }} axisLine={false} tickLine={false} dy={5} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={48}>
                {shiftData.map((_, i) => (
                  <Cell key={i} fill={['#f59e0b', '#3b82f6', '#6366f1'][i]} />
                ))}
              </Bar>
            </BarChart>
          </ChartCard>
        )}

        {view === 'category' && (
          <ChartCard title="Top Categories" subtitle="Most frequent incident types">
            <BarChart data={categoryData.slice(0, 10)} layout="vertical">
              <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" horizontal={false} strokeOpacity={0.4} />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'var(--foreground)', fontWeight: 500 }} axisLine={false} tickLine={false} width={130} />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="catGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={1} />
                </linearGradient>
              </defs>
              <Bar dataKey="count" fill="url(#catGrad)" radius={[0, 8, 8, 0]} barSize={24} />
            </BarChart>
          </ChartCard>
        )}

        {view === 'station' && (
          <ChartCard title="Incidents by Station" subtitle="Most affected stations">
            <BarChart data={stationData} layout="vertical">
              <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" horizontal={false} strokeOpacity={0.4} />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'var(--foreground)', fontWeight: 500 }} axisLine={false} tickLine={false} width={130} />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="stationGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={1} />
                </linearGradient>
              </defs>
              <Bar dataKey="count" fill="url(#stationGrad)" radius={[0, 8, 8, 0]} barSize={24} />
            </BarChart>
          </ChartCard>
        )}
      </div>

      {/* Summary Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>Incident Summary</p>
          <span className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{incidents.length} records</span>
        </div>
        <div className="overflow-x-auto" style={{ maxHeight: 240 }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['ID', 'Station', 'Category', 'Severity', 'Status', 'Date'].map(h => (
                  <th key={h} className="py-2 px-3 text-left text-[10px] font-mono uppercase tracking-widest sticky top-0" style={{ color: 'var(--muted-foreground)', background: 'var(--card)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...incidents].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(inc => (
                <tr key={inc.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="py-2 px-3 text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{inc.id}</td>
                  <td className="py-2 px-3 text-[11px]" style={{ color: 'var(--foreground)' }}>{inc.station}</td>
                  <td className="py-2 px-3 text-[10px] font-mono" style={{ color: 'var(--secondary-foreground)' }}>{inc.category}</td>
                  <td className="py-2 px-3">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{
                      background: `${severityColors[inc.severity] || '#6b7280'}18`,
                      color: severityColors[inc.severity] || '#6b7280',
                    }}>{inc.severity}</span>
                  </td>
                  <td className="py-2 px-3">
                    <span className="text-[9px] font-mono" style={{ color: statusColors[inc.status] || 'var(--muted-foreground)' }}>{inc.status}</span>
                  </td>
                  <td className="py-2 px-3 text-[9px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{inc.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-5 transition-all" style={{
      background: 'var(--card)', borderColor: 'var(--border)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    }}>
      <div className="mb-4">
        <p className="text-[12px] font-semibold" style={{ color: 'var(--foreground)' }}>{title}</p>
        <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{subtitle}</p>
      </div>
      <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
