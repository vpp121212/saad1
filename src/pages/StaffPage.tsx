import { useState } from 'react'
import type { StaffRole } from '../types'
import { staffRoles } from '../data/constants'
import { Search, UserPlus } from 'lucide-react'

interface StaffMember {
  id: string
  name: string
  jobNumber: string
  role: StaffRole
  station: string
  phone: string
  email: string
  status: 'On Duty' | 'On Task' | 'On Leave' | 'Inactive'
}

function makeStaff(overrides: Partial<StaffMember> = {}): StaffMember {
  return {
    id: `STF-${Date.now()}`,
    name: '', jobNumber: '', role: 'Station Manager (SM)', station: 'Qasr Al Hokm',
    phone: '', email: '', status: 'On Duty',
    ...overrides,
  }
}

const initialStaff: StaffMember[] = [
  { id: 'STF-001', name: 'Fahad Al Dosari', jobNumber: '2001', role: 'Station Manager (SM)', station: 'Qasr Al Hokm', phone: '0555123456', email: 'fahad@metro.sa', status: 'On Duty' },
  { id: 'STF-002', name: 'Khalid Al Harbi', jobNumber: '4001', role: 'Security', station: 'KAFD', phone: '0555123457', email: 'khalid@metro.sa', status: 'On Duty' },
  { id: 'STF-003', name: 'Salman Al Subaie', jobNumber: '5001', role: 'Maintenance', station: 'National Museum', phone: '0555123458', email: 'salman@metro.sa', status: 'On Task' },
  { id: 'STF-004', name: 'Naif Al Qahtani', jobNumber: '2002', role: 'Asst Station Manager (ASM)', station: 'KAFD', phone: '0555123459', email: 'naif@metro.sa', status: 'On Duty' },
  { id: 'STF-005', name: 'Saud Al Otaibi', jobNumber: '2003', role: 'Station Manager (SM)', station: 'National Museum', phone: '0555123460', email: 'saud@metro.sa', status: 'On Leave' },
  { id: 'STF-006', name: 'Faisal Al Shehrani', jobNumber: '2005', role: 'Station Manager (SM)', station: 'Qasr Al Hokm', phone: '0555123461', email: 'faisal@metro.sa', status: 'On Duty' },
  { id: 'STF-007', name: 'Abdulrahman Al Mutairi', jobNumber: '4002', role: 'Security', station: 'KAFD', phone: '0555123462', email: 'abdalrhman@metro.sa', status: 'On Task' },
  { id: 'STF-008', name: 'Mohammed Al Omari', jobNumber: '3001', role: 'Asst Station Manager (ASM)', station: 'Qasr Al Hokm', phone: '0555123463', email: 'mohammed@metro.sa', status: 'On Duty' },
]

export function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(makeStaff)
  const [editId, setEditId] = useState<string | null>(null)

  const filtered = staff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.jobNumber.includes(search) || s.station.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = () => {
    if (editId) {
      setStaff(prev => prev.map(s => s.id === editId ? { ...form } : s))
    } else {
      setStaff(prev => [makeStaff({ ...form, id: `STF-${Date.now()}` }), ...prev])
    }
    setShowForm(false)
    setEditId(null)
    setForm(makeStaff())
  }

  const handleEdit = (m: StaffMember) => {
    setForm(m)
    setEditId(m.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-[14px] font-bold" style={{ color: 'var(--foreground)' }}>Staff</p>
        <div className="flex items-center gap-2">
          <div className="relative w-48">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
            <input className="w-full pl-8 px-3 py-1.5 rounded text-[12px] outline-none font-mono box-border"
              placeholder="Search..." style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded text-[11px]" style={{ background: 'var(--primary)', color: 'var(--background)' }} onClick={() => { setForm(makeStaff()); setEditId(null); setShowForm(true) }}>
            <UserPlus size={12} /> Add Staff
          </button>
        </div>
      </div>

      {showForm && (
        <div className="rounded border p-4 grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Name</label>
            <input className="inp-w" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Job Number</label>
            <input className="inp-w" value={form.jobNumber} onChange={e => setForm(p => ({ ...p, jobNumber: e.target.value }))} /></div>
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Role</label>
            <select className="inp-w" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as StaffRole }))}>
              {staffRoles.map(r => <option key={r}>{r}</option>)}</select></div>
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Station</label>
            <input className="inp-w" value={form.station} onChange={e => setForm(p => ({ ...p, station: e.target.value }))} /></div>
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Phone</label>
            <input className="inp-w" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Email</label>
            <input className="inp-w" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></div>
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Status</label>
            <select className="inp-w" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as StaffMember['status'] }))}>
              <option>On Duty</option><option>On Task</option><option>On Leave</option><option>Inactive</option></select></div>
          <div className="flex items-end gap-1">
            <button className="px-3 py-1.5 rounded text-[11px]" style={{ background: 'var(--primary)', color: '#fff' }} onClick={handleSave}>
              {editId ? 'Update' : 'Add'}
            </button>
            <button className="px-3 py-1.5 rounded text-[11px]" style={{ background: 'var(--border)', color: 'var(--muted-foreground)' }} onClick={() => { setShowForm(false); setEditId(null) }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="rounded border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(100,140,200,0.08)' }}>
                {['Name', 'Job No.', 'Role', 'Station', 'Phone', 'Email', 'Status', ''].map(h => (
                  <th key={h} className="py-2.5 px-3 text-left text-[10px] font-mono uppercase tracking-widest whitespace-nowrap" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid rgba(100,140,200,0.04)' }}>
                  <td className="py-2.5 px-3"><span className="text-[12px]" style={{ color: 'var(--foreground)' }}>{s.name}</span></td>
                  <td className="py-2.5 px-3"><span className="text-[11px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{s.jobNumber}</span></td>
                  <td className="py-2.5 px-3"><span className="text-[11px] font-mono" style={{ color: 'var(--secondary-foreground)' }}>{s.role}</span></td>
                  <td className="py-2.5 px-3"><span className="text-[11px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{s.station}</span></td>
                  <td className="py-2.5 px-3"><span className="text-[11px]" style={{ color: 'var(--foreground)' }}>{s.phone}</span></td>
                  <td className="py-2.5 px-3"><span className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{s.email}</span></td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{
                      background: s.status === 'On Duty' ? 'rgba(34,197,94,0.15)' : s.status === 'On Task' ? 'rgba(245,158,11,0.15)' : s.status === 'On Leave' ? 'rgba(107,114,128,0.15)' : 'rgba(239,68,68,0.15)',
                      color: s.status === 'On Duty' ? '#22c55e' : s.status === 'On Task' ? '#f59e0b' : s.status === 'On Leave' ? '#6b7280' : '#ef4444',
                    }}>{s.status}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex gap-1">
                      <button className="text-[10px] px-1.5 py-0.5 rounded" style={{ color: 'var(--primary)' }} onClick={() => handleEdit(s)}>Edit</button>
                      <button className="text-[10px] px-1.5 py-0.5 rounded" style={{ color: '#ef4444' }} onClick={() => handleDelete(s.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[13px] font-mono" style={{ color: 'var(--muted-foreground)' }}>No staff found</div>
        )}
      </div>
    </div>
  )
}
