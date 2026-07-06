import type { Incident } from '../types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface Props {
  incidents: Incident[]
  onNavigate: (id: string) => void
}

export function Dashboard({ incidents, onNavigate }: Props) {
  const active = incidents.filter(i => i.status !== 'Closed')
  const open = incidents.filter(i => i.status === 'Open')
  const inProgress = incidents.filter(i => i.status === 'In Progress')
  const closed = incidents.filter(i => i.status === 'Closed')

  const severityData = [
    { name: 'Critical', value: incidents.filter(i => i.severity === 'Critical').length, color: '#ef4444' },
    { name: 'High', value: incidents.filter(i => i.severity === 'High').length, color: '#f97316' },
    { name: 'Medium', value: incidents.filter(i => i.severity === 'Medium').length, color: '#f59e0b' },
    { name: 'Low', value: incidents.filter(i => i.severity === 'Low').length, color: '#22c55e' },
  ]

  const statusData = [
    { name: 'Open', value: open.length, color: '#ef4444' },
    { name: 'In Progress', value: inProgress.length, color: '#f59e0b' },
    { name: 'Closed', value: closed.length, color: '#22c55e' },
  ]

  const dailyData = [
    { day: 'Sat', count: incidents.filter(i => i.day === 'Saturday').length },
    { day: 'Sun', count: incidents.filter(i => i.day === 'Sunday').length },
    { day: 'Mon', count: incidents.filter(i => i.day === 'Monday').length },
    { day: 'Tue', count: incidents.filter(i => i.day === 'Tuesday').length },
    { day: 'Wed', count: incidents.filter(i => i.day === 'Wednesday').length },
    { day: 'Thu', count: incidents.filter(i => i.day === 'Thursday').length },
    { day: 'Fri', count: incidents.filter(i => i.day === 'Friday').length },
  ]

  const recent = [...incidents].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8)

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Incidents', value: incidents.length, color: 'var(--foreground)', sub: 'All incidents' },
          { label: 'Active', value: active.length, color: '#ef4444', sub: 'In progress' },
          { label: 'Closed', value: closed.length, color: '#22c55e', sub: 'Resolved' },
          { label: 'Critical', value: incidents.filter(i => i.severity === 'Critical').length, color: '#ef4444', sub: 'Requires immediate action' },
        ].map((s, i) => (
          <div key={i} className="rounded border p-4 flex flex-col" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <span className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--muted-foreground)' }}>{s.label}</span>
            <span className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</span>
            <span className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{s.sub}</span>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Severity Pie */}
        <div className="rounded border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--muted-foreground)' }}>Incidents by Severity</p>
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={severityData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                  {severityData.map(e => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pie */}
        <div className="rounded border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--muted-foreground)' }}>Incident Status</p>
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                  {statusData.map(e => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Daily Activity */}
      <div className="rounded border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--muted-foreground)' }}>Incidents by Day</p>
        <div style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: 'var(--popover)', border: '1px solid rgba(100,140,200,0.15)', borderRadius: 4, fontSize: 10, fontFamily: 'Geist Mono, monospace' }} />
              <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="rounded border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>Recent Incidents</p>
          <button className="text-[11px] font-mono" style={{ color: 'var(--primary)' }} onClick={() => { const first = recent[0]; if (first) onNavigate(first.id) }}>View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(100, 140, 200, 0.08)' }}>
                {['ID', 'Type', 'Station', 'Severity', 'Status', 'Shift', 'Time'].map(h => (
                  <th key={h} className="py-2.5 px-3 text-left text-[10px] font-mono uppercase tracking-widest whitespace-nowrap" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map(inc => (
                <tr key={inc.id} className="cursor-pointer transition-colors" style={{ borderBottom: '1px solid rgba(100, 140, 200, 0.04)' }}
                  onClick={() => onNavigate(inc.id)}>
                  <td className="py-2.5 px-3"><span className="text-[11px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{inc.id}</span></td>
                  <td className="py-2.5 px-3"><span className="text-[12px]" style={{ color: 'var(--foreground)' }}>{inc.category}</span></td>
                  <td className="py-2.5 px-3"><span className="text-[12px] font-mono" style={{ color: 'var(--secondary-foreground)' }}>{inc.station}</span></td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{
                      background: inc.severity === 'Critical' ? 'rgba(239,68,68,0.15)' : inc.severity === 'High' ? 'rgba(249,115,22,0.15)' : inc.severity === 'Medium' ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)',
                      color: inc.severity === 'Critical' ? '#ef4444' : inc.severity === 'High' ? '#f97316' : inc.severity === 'Medium' ? '#f59e0b' : '#22c55e',
                    }}>{inc.severity}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] font-mono" style={{
                      color: inc.status === 'Open' ? '#ef4444' : inc.status === 'In Progress' ? '#f59e0b' : '#22c55e',
                    }}>{inc.status}</span>
                  </td>
                  <td className="py-2.5 px-3"><span className="text-[11px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{inc.shift}</span></td>
                  <td className="py-2.5 px-3"><span className="text-[11px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{inc.discoveryTime}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
