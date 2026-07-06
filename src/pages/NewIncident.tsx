import { useState, useRef, type FormEvent } from 'react'
import type { Incident, TimelineEntry, ImmediateAction } from '../types'
import { stations, shifts, locations, categories, severities } from '../data/constants'

interface Props {
  onSave: (inc: Incident) => void
  onCancel: () => void
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function emptyInc(): Incident {
  const d = new Date()
  return {
    id: `INC-${Date.now()}`,
    station: 'Qasr Al Hokm',
    date: d.toISOString().slice(0, 10),
    day: days[d.getDay()],
    shift: 'Morning',
    smName: '',
    somName: '',
    reportedBy: '',
    sourceCCTV: false,
    sourceIntercom: false,
    sourcePassenger: false,
    sourceStaff: false,
    discoveryTime: '',
    occNotificationTime: '',
    occResponseTime: '',
    somArrivalTime: '',
    smArrivalTime: '',
    category: 'Passenger Medical',
    severity: 'Medium',
    description: '',
    location: 'Platform',
    emergencyCode: '',
    permitNumber: '',
    actions: [],
    supportRequested: '',
    occInstructions: '',
    finalResolution: '',
    cctvReference: '',
    intercomLog: '',
    images: [],
    somSignature: '',
    somSignTime: '',
    smSignature: '',
    smSignTime: '',
    submitterName: '',
    submitterTitle: '',
    submitterDept: '',
    submitterDate: '',
    submitterSignature: '',
    timeline: [],
    status: 'Open',
    createdAt: new Date().toISOString(),
    closedAt: '',
  }
}

export function NewIncident({ onSave, onCancel }: Props) {
  const [inc, setInc] = useState(emptyInc)
  const fileRef = useRef<HTMLInputElement>(null)

  const u = (updates: Partial<Incident>) => setInc(p => ({ ...p, ...updates }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSave(inc)
  }

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    Promise.all(files.map(f => new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(f)
    }))).then(urls => {
      u({ images: [...inc.images, ...urls] })
    })
  }

  const removeImage = (i: number) => u({ images: inc.images.filter((_, idx) => idx !== i) })

  const [tlTime, setTlTime] = useState('')
  const [tlDesc, setTlDesc] = useState('')
  const addTimeline = () => {
    if (!tlTime || !tlDesc) return
    const entry: TimelineEntry = { id: `tl-${Date.now()}`, timestamp: tlTime, description: tlDesc, createdBy: inc.smName || 'SM' }
    u({ timeline: [...inc.timeline, entry] })
    setTlTime(''); setTlDesc('')
  }

  const toggleSource = (key: 'sourceCCTV' | 'sourceIntercom' | 'sourcePassenger' | 'sourceStaff') =>
    u({ [key]: !inc[key] })

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-bold" style={{ color: 'var(--foreground)' }}>Metro Station Incident Form</p>
        <div className="flex gap-2">
          <button type="button" className="px-4 py-2 rounded text-[12px]" style={{ background: 'var(--border)', color: 'var(--muted-foreground)' }} onClick={onCancel}>Cancel</button>
          <button type="submit" className="px-4 py-2 rounded text-[12px] font-semibold" style={{ background: 'var(--primary)', color: 'var(--background)' }}>Save</button>
        </div>
      </div>

      {/* 1. Basic Info */}
      <div className="rounded border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--primary)' }}>1. Basic Information</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Station</label>
            <select className="inp" value={inc.station} onChange={e => u({ station: e.target.value })}>{stations.map(s => <option key={s.id}>{s.name}</option>)}</select></div>
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Date</label>
            <input type="date" className="inp" value={inc.date} onChange={e => u({ date: e.target.value, day: days[new Date(e.target.value).getDay()] })} /></div>
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Shift</label>
            <select className="inp" value={inc.shift} onChange={e => u({ shift: e.target.value as any })}>{shifts.map(s => <option key={s}>{s}</option>)}</select></div>
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Station Manager (SM)</label>
            <input className="inp" value={inc.smName} onChange={e => u({ smName: e.target.value })} placeholder="SM name" /></div>
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Station Operation Manager (SOM)</label>
            <input className="inp" value={inc.somName} onChange={e => u({ somName: e.target.value })} placeholder="SOM name" /></div>
        </div>
      </div>

      {/* 2. Source */}
      <div className="rounded border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--primary)' }}>2. Incident Source</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Reported By</label>
            <input className="inp" value={inc.reportedBy} onChange={e => u({ reportedBy: e.target.value })} placeholder="Reporter name" /></div>
          <div className="flex flex-col gap-1.5 justify-end">
            {[
              { key: 'sourceCCTV' as const, label: 'SOM observed via CCTV' },
              { key: 'sourceIntercom' as const, label: 'Received call from Intercom' },
              { key: 'sourcePassenger' as const, label: 'Passenger Report' },
              { key: 'sourceStaff' as const, label: 'Staff Report' },
            ].map(s => (
              <label key={s.key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={inc[s.key]} onChange={() => toggleSource(s.key)}
                  style={{ accentColor: 'var(--primary)' }} />
                <span className="text-[11px]" style={{ color: 'var(--foreground)' }}>{s.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Timings */}
      <div className="rounded border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--primary)' }}>3. Operational Timings</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { key: 'discoveryTime', label: 'Discovery Time' },
            { key: 'occNotificationTime', label: 'OCC Notification Time' },
            { key: 'occResponseTime', label: 'OCC Response Time' },
            { key: 'somArrivalTime', label: 'SOM Arrival Time' },
            { key: 'smArrivalTime', label: 'SM Arrival Time' },
          ].map(t => (
            <div key={t.key}><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>{t.label}</label>
              <input type="time" className="inp" value={(inc as any)[t.key]} onChange={e => u({ [t.key]: e.target.value })} /></div>
          ))}
        </div>
      </div>

      {/* 4. Details */}
      <div className="rounded border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--primary)' }}>4. Incident Details</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Incident Type</label>
            <select className="inp" value={inc.category} onChange={e => u({ category: e.target.value as any })}>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Severity</label>
            <select className="inp" value={inc.severity} onChange={e => u({ severity: e.target.value as any })}>{severities.map(s => <option key={s}>{s}</option>)}</select></div>
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Location in Station</label>
            <select className="inp" value={inc.location} onChange={e => u({ location: e.target.value as any })}>{locations.map(l => <option key={l}>{l}</option>)}</select></div>
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Emergency Code</label>
            <input className="inp" value={inc.emergencyCode} onChange={e => u({ emergencyCode: e.target.value })} /></div>
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Permit Number</label>
            <input className="inp" value={inc.permitNumber} onChange={e => u({ permitNumber: e.target.value })} /></div>
          <div className="col-span-4"><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Incident Description</label>
            <textarea className="inp" rows={2} value={inc.description} onChange={e => u({ description: e.target.value })} /></div>
        </div>
      </div>

      {/* 5. Immediate Action Taken */}
      <div className="rounded border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--primary)' }}>5. Immediate Action Taken</p>
        <div className="overflow-x-auto mb-3">
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="py-2 px-2 text-[10px] font-mono w-24" style={{ color: 'var(--muted-foreground)' }}>Time</th>
                <th className="py-2 px-2 text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>Action Taken</th>
                <th className="py-2 px-2 text-[10px] font-mono w-28" style={{ color: 'var(--muted-foreground)' }}>By</th>
                <th className="py-2 px-2 text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>Notes</th>
                <th className="py-2 px-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {inc.actions.map((a, i) => (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="py-1.5 px-2"><input type="time" className="inp" value={a.time} onChange={e => {
                    const copy = [...inc.actions]; copy[i] = { ...copy[i], time: e.target.value }; u({ actions: copy })
                  }} /></td>
                  <td className="py-1.5 px-2"><input className="inp" value={a.action} onChange={e => {
                    const copy = [...inc.actions]; copy[i] = { ...copy[i], action: e.target.value }; u({ actions: copy })
                  }} placeholder="Action" /></td>
                  <td className="py-1.5 px-2"><input className="inp" value={a.by} onChange={e => {
                    const copy = [...inc.actions]; copy[i] = { ...copy[i], by: e.target.value }; u({ actions: copy })
                  }} placeholder="Person" /></td>
                  <td className="py-1.5 px-2"><input className="inp" value={a.notes} onChange={e => {
                    const copy = [...inc.actions]; copy[i] = { ...copy[i], notes: e.target.value }; u({ actions: copy })
                  }} placeholder="Notes" /></td>
                  <td className="py-1.5 px-2">
                    <button type="button" className="w-5 h-5 rounded flex items-center justify-center text-[10px]" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
                      onClick={() => u({ actions: inc.actions.filter((_, idx) => idx !== i) })}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" className="px-3 py-1.5 rounded text-[11px]" style={{ background: 'var(--border)', color: 'var(--muted-foreground)' }}
          onClick={() => {
            const newAction: ImmediateAction = { id: `a-${Date.now()}`, time: '', action: '', by: '', notes: '' }
            u({ actions: [...inc.actions, newAction] })
          }}>
          + Add Action
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Support Requested</label>
            <select className="inp" value={inc.supportRequested} onChange={e => u({ supportRequested: e.target.value })}>
              <option value="">—</option><option>Security</option><option>Medical</option><option>Maintenance</option><option>Security + Medical</option><option>Medical + Maintenance</option><option>Security + Maintenance</option><option>All</option>
            </select></div>
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>OCC Instructions</label>
            <textarea className="inp" rows={2} value={inc.occInstructions} onChange={e => u({ occInstructions: e.target.value })} /></div>
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Final Resolution</label>
            <textarea className="inp" rows={2} value={inc.finalResolution} onChange={e => u({ finalResolution: e.target.value })} /></div>
        </div>
      </div>

      {/* 6. Attachments */}
      <div className="rounded border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--primary)' }}>6. Attachments</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>CCTV Snapshot Reference</label>
            <input className="inp" value={inc.cctvReference} onChange={e => u({ cctvReference: e.target.value })} placeholder="Reference number" /></div>
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Intercom Call Log</label>
            <input className="inp" value={inc.intercomLog} onChange={e => u({ intercomLog: e.target.value })} placeholder="Reference number" /></div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
        <div className="flex flex-wrap gap-2 mb-3">
          {inc.images.map((img, i) => (
            <div key={i} className="relative w-16 h-16 rounded overflow-hidden group" style={{ border: '1px solid var(--border)' }}>
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button type="button" className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100" style={{ background: 'rgba(0,0,0,0.7)', color: '#fff' }} onClick={() => removeImage(i)}>✕</button>
            </div>
          ))}
        </div>
        <button type="button" className="px-3 py-1.5 rounded text-[11px]" style={{ background: 'var(--border)', color: 'var(--muted-foreground)' }} onClick={() => fileRef.current?.click()}>
          + Upload Photos / Documents
        </button>
      </div>

      {/* 7. Signatures */}
      <div className="rounded border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--primary)' }}>7. Signatures</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(100,140,200,0.08)' }}>
                <th className="py-2 px-3 text-left text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>Party</th>
                <th className="py-2 px-3 text-left text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>Signature</th>
                <th className="py-2 px-3 text-left text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(100,140,200,0.04)' }}>
                <td className="py-2 px-3 text-[11px]" style={{ color: 'var(--foreground)' }}>SOM</td>
                <td className="py-2 px-3"><input className="inp" value={inc.somSignature} onChange={e => u({ somSignature: e.target.value })} placeholder="Signature" /></td>
                <td className="py-2 px-3"><input type="datetime-local" className="inp" value={inc.somSignTime} onChange={e => u({ somSignTime: e.target.value })} /></td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-[11px]" style={{ color: 'var(--foreground)' }}>SM</td>
                <td className="py-2 px-3"><input className="inp" value={inc.smSignature} onChange={e => u({ smSignature: e.target.value })} placeholder="Signature" /></td>
                <td className="py-2 px-3"><input type="datetime-local" className="inp" value={inc.smSignTime} onChange={e => u({ smSignTime: e.target.value })} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 8. Report Submission */}
      <div className="rounded border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--primary)' }}>8. Report Submission</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Name</label>
            <input className="inp" value={inc.submitterName} onChange={e => u({ submitterName: e.target.value })} placeholder="Submitter name" /></div>
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Title</label>
            <input className="inp" value={inc.submitterTitle} onChange={e => u({ submitterTitle: e.target.value })} placeholder="Job title" /></div>
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Department</label>
            <input className="inp" value={inc.submitterDept} onChange={e => u({ submitterDept: e.target.value })} placeholder="Department" /></div>
          <div><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Date</label>
            <input type="datetime-local" className="inp" value={inc.submitterDate} onChange={e => u({ submitterDate: e.target.value })} /></div>
          <div className="col-span-2"><label className="text-[9px] font-mono block mb-1" style={{ color: 'var(--muted-foreground)' }}>Signature</label>
            <input className="inp" value={inc.submitterSignature} onChange={e => u({ submitterSignature: e.target.value })} placeholder="Signature" /></div>
          <div className="col-span-2 flex items-end">
            <div className="text-[11px] font-mono py-2 px-3 rounded w-full" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: 'var(--primary)' }}>
              📧 <span className="font-semibold">camco.occline-1@camco.com.sa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--primary)' }}>Timeline & Comments</p>
        {inc.timeline.length > 0 && (
          <div className="space-y-1 mb-3 max-h-32 overflow-y-auto">
            {inc.timeline.map(t => (
              <div key={t.id} className="flex items-start gap-2 py-1 border-b border-dashed last:border-0 text-[11px]" style={{ borderColor: 'var(--border)' }}>
                <span className="font-mono shrink-0" style={{ color: 'var(--primary)' }}>{t.timestamp}</span>
                <span style={{ color: 'var(--foreground)' }}>{t.description}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2 items-end">
          <div className="w-20"><label className="text-[9px] font-mono block mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Time</label>
            <input type="time" className="inp" value={tlTime} onChange={e => setTlTime(e.target.value)} /></div>
          <div className="flex-1"><input className="inp" value={tlDesc} onChange={e => setTlDesc(e.target.value)} placeholder="Action description" /></div>
          <button type="button" className="px-3 py-1.5 rounded text-[11px]" style={{ background: 'var(--primary)', color: '#fff' }} onClick={addTimeline}>Add</button>
        </div>
      </div>

      <div className="flex justify-center py-4">
        <button type="submit" className="px-6 py-2.5 rounded text-[13px] font-semibold" style={{ background: 'var(--primary)', color: 'var(--background)' }}>
          Save Incident
        </button>
      </div>
    </form>
  )
}
