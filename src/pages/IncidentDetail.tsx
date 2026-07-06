import { useState, useRef } from 'react'
import type { Incident, TimelineEntry } from '../types'
import { ArrowLeft, CheckCircle, Mail, ClipboardCopy, Download } from 'lucide-react'
import { exportToPdf } from '../utils/pdf'

interface Props {
  incident: Incident
  onBack: () => void
  onUpdate: (id: string, updates: Partial<Incident>) => void
  onClose: (id: string) => void
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--primary)' }}>{title}</p>
      {children}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string | number | boolean | null | undefined }) {
  if (typeof value === 'boolean') {
    if (!value) return null
    return (
      <div className="flex items-center gap-2 py-1.5 border-b border-dashed" style={{ borderColor: 'var(--border)' }}>
        <span className="text-[11px] font-mono shrink-0" style={{ color: 'var(--muted-foreground)', minWidth: 110 }}>{label}</span>
        <span className="text-[11px]" style={{ color: '#22c55e' }}>✓</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-dashed" style={{ borderColor: 'var(--border)' }}>
      <span className="text-[11px] font-mono shrink-0" style={{ color: 'var(--muted-foreground)', minWidth: 110 }}>{label}</span>
      <span className="text-[12px]" style={{ color: 'var(--foreground)' }}>{value || '—'}</span>
    </div>
  )
}

function buildMailBody(inc: Incident): string {
  const lines = [
    `Incident Notification - ${inc.id}`,
    '',
    '=== 1. Basic Information ===',
    `Station: ${inc.station}`,
    `Date: ${inc.date}`,
    `Shift: ${inc.shift}`,
    `SM: ${inc.smName || '—'}`,
    `SOM: ${inc.somName || '—'}`,
    '',
    '=== 2. Incident Source ===',
    `Reported by: ${inc.reportedBy || '—'}`,
    `CCTV: ${inc.sourceCCTV ? '✓' : '—'}, Intercom: ${inc.sourceIntercom ? '✓' : '—'}, Passenger: ${inc.sourcePassenger ? '✓' : '—'}, Staff: ${inc.sourceStaff ? '✓' : '—'}`,
    '',
    '=== 3. Operational Timings ===',
    `Discovery: ${inc.discoveryTime}`,
    `OCC Notif: ${inc.occNotificationTime}`,
    `OCC Resp: ${inc.occResponseTime}`,
    `SOM Arrival: ${inc.somArrivalTime}`,
    `SM Arrival: ${inc.smArrivalTime}`,
    '',
    '=== 4. Incident Details ===',
    `Type: ${inc.category} (${inc.severity})`,
    `Location: ${inc.location}`,
    `Description: ${inc.description}`,
    `Emergency Code: ${inc.emergencyCode}`,
    `Permit Number: ${inc.permitNumber}`,
    '',
    '=== 5. Immediate Action Taken ===',
  ]
  inc.actions.forEach(a => lines.push(`  ${a.time} | ${a.action} | ${a.by}${a.notes ? ` - ${a.notes}` : ''}`))
  lines.push(
    `Support Requested: ${inc.supportRequested}`,
    `OCC Instructions: ${inc.occInstructions}`,
    `Final Resolution: ${inc.finalResolution}`,
    '',
    '=== 6. Report Submission ===',
    `Submitted by: ${inc.submitterName || '—'} (${inc.submitterTitle || '—'}) - ${inc.submitterDept || '—'}`,
    `Date: ${inc.submitterDate || '—'}`,
    `Signature: ${inc.submitterSignature || '—'}`,
    `📧 camco.occline-1@camco.com.sa`,
  )
  if (inc.timeline.length) {
    lines.push('', '=== Timeline ===')
    inc.timeline.forEach(t => lines.push(`${t.timestamp}: ${t.description}`))
  }
  lines.push('', '=== Signatures ===',
    `SOM: ${inc.somSignature || '—'} (${inc.somSignTime || '—'})`,
    `SM: ${inc.smSignature || '—'} (${inc.smSignTime || '—'})`)
  if (inc.status === 'Closed') lines.push('', `✅ Closed: ${inc.closedAt}`)
  return lines.join('\n')
}

export function IncidentDetail({ incident, onBack, onUpdate, onClose }: Props) {
  const detailRef = useRef<HTMLDivElement>(null)
  const [tlTime, setTlTime] = useState('')
  const [tlDesc, setTlDesc] = useState('')
  const [showAddTl, setShowAddTl] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [galleryIdx, setGalleryIdx] = useState(0)
  const [pdfExporting, setPdfExporting] = useState(false)

  if (!incident) return <div className="text-center py-12">Incident not found</div>

  const addTimeline = () => {
    if (!tlTime || !tlDesc) return
    const entry: TimelineEntry = { id: `tl-${Date.now()}`, timestamp: tlTime, description: tlDesc, createdBy: incident.smName || 'SM' }
    onUpdate(incident.id, { timeline: [...incident.timeline, entry] })
    setTlTime(''); setTlDesc(''); setShowAddTl(false)
  }

  const [copied, setCopied] = useState(false)
  const [toEmail, setToEmail] = useState('')

  const handleExportPdf = async () => {
    if (!detailRef.current) return
    setPdfExporting(true)
    try {
      await exportToPdf(detailRef.current, `incident-${incident.id}`, `Incident Report - ${incident.id}`)
    } finally {
      setPdfExporting(false)
    }
  }

  const handleSendOutlook = () => {
    const subject = encodeURIComponent(`Incident Notification - ${incident.id} | ${incident.station} | ${incident.category}`)
    const body = encodeURIComponent(buildMailBody(incident))
    const a = document.createElement('a')
    a.href = `mailto:${toEmail}?subject=${subject}&body=${body}`
    a.click()
  }

  const handleCopyReport = () => {
    navigator.clipboard.writeText(buildMailBody(incident))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4" ref={detailRef}>
      <div className="flex items-center gap-2 flex-wrap">
        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded text-[11px] transition-all" style={{ background: 'var(--border)', color: 'var(--muted-foreground)' }} onClick={onBack}>
          <ArrowLeft size={11} /> Back
        </button>
        <div className="mr-auto" />
        <div className="flex items-center gap-1.5 flex-wrap">
          {incident.status !== 'Closed' && (
            <button className="flex items-center gap-1 px-2.5 py-1.5 rounded text-[11px] font-semibold transition-all" style={{ background: '#22c55e', color: '#fff' }} onClick={() => onClose(incident.id)}>
              <CheckCircle size={11} /> Close
            </button>
          )}
          <input type="text" placeholder="To: email" value={toEmail} onChange={e => setToEmail(e.target.value)}
            className="text-[11px] px-2 py-1.5 rounded border w-44" style={{ background: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }} />
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded text-[11px] transition-all disabled:opacity-40" style={{ background: '#0078d4', color: '#fff' }} onClick={handleSendOutlook} disabled={!toEmail} title="Send via Outlook">
            <Mail size={11} /> <span className="hide-mobile">Send</span>
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded text-[11px] transition-all" style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }} onClick={handleCopyReport} title="Copy report">
            <ClipboardCopy size={11} /> <span className="hide-mobile">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded text-[11px] transition-all disabled:opacity-50" style={{ background: 'var(--primary)', color: 'var(--background)' }} onClick={handleExportPdf} disabled={pdfExporting} title="Export PDF">
            <Download size={11} /> <span className="hide-mobile">{pdfExporting ? '...' : 'PDF'}</span>
          </button>
        </div>
      </div>

      {/* 1. Basic Info */}
      <Section title="1. Basic Information">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6">
          <Field label="Incident ID" value={incident.id} />
          <Field label="Station" value={incident.station} />
          <Field label="Date" value={incident.date} />
          <Field label="Shift" value={incident.shift} />
          <Field label="Station Manager (SM)" value={incident.smName} />
          <Field label="Station Operation Manager (SOM)" value={incident.somName} />
        </div>
      </Section>

      {/* 2. Source */}
      <Section title="2. Incident Source">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6">
          <Field label="Reported By" value={incident.reportedBy} />
          <Field label="SOM observed via CCTV" value={incident.sourceCCTV} />
          <Field label="Received call from Intercom" value={incident.sourceIntercom} />
          <Field label="Passenger Report" value={incident.sourcePassenger} />
          <Field label="Staff Report" value={incident.sourceStaff} />
        </div>
      </Section>

      {/* 3. Timings */}
      <Section title="3. Operational Timings">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6">
          <Field label="Discovery Time" value={incident.discoveryTime} />
          <Field label="OCC Notification Time" value={incident.occNotificationTime} />
          <Field label="OCC Response Time" value={incident.occResponseTime} />
          <Field label="SOM Arrival Time" value={incident.somArrivalTime} />
          <Field label="SM Arrival Time" value={incident.smArrivalTime} />
        </div>
      </Section>

      {/* 4. Details */}
      <Section title="4. Incident Details">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6">
          <Field label="Type" value={incident.category} />
          <Field label="Severity" value={incident.severity} />
          <Field label="Location" value={incident.location} />
          <Field label="Emergency Code" value={incident.emergencyCode} />
          <Field label="Permit Number" value={incident.permitNumber} />
        </div>
        <div className="mt-2">
          <Field label="Description" value={incident.description} />
        </div>
      </Section>

      {/* 5. Immediate Action Taken */}
      <Section title="5. Immediate Action Taken">
        {incident.actions.length > 0 ? (
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-left">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Time', 'Action Taken', 'By', 'Notes'].map(h => (
                    <th key={h} className="py-2 px-2 text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {incident.actions.map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-2 px-2 text-[12px] font-mono" style={{ color: 'var(--primary)' }}>{a.time}</td>
                    <td className="py-2 px-2 text-[12px]" style={{ color: 'var(--foreground)' }}>{a.action}</td>
                    <td className="py-2 px-2 text-[12px]" style={{ color: 'var(--foreground)' }}>{a.by}</td>
                    <td className="py-2 px-2 text-[11px]" style={{ color: 'var(--muted-foreground)' }}>{a.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[11px] font-mono mb-3" style={{ color: 'var(--muted-foreground)' }}>No actions recorded</p>
        )}
        <Field label="Support Requested" value={incident.supportRequested} />
        <Field label="OCC Instructions" value={incident.occInstructions} />
        <Field label="Final Resolution" value={incident.finalResolution} />
      </Section>

      {/* 6. Attachments */}
      <Section title="6. Attachments">
        <Field label="CCTV Snapshot Reference" value={incident.cctvReference} />
        <Field label="Intercom Call Log" value={incident.intercomLog} />
        {incident.images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {incident.images.map((img, i) => (
              <div key={i} className="w-20 h-20 rounded overflow-hidden cursor-pointer hover:scale-105 transition-transform" style={{ border: '1px solid var(--border)' }}
                onClick={() => { setShowGallery(true); setGalleryIdx(i) }}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Gallery Modal */}
      {showGallery && incident.images.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={() => setShowGallery(false)}>
          <div className="relative max-w-3xl max-h-[90vh] mx-4" onClick={e => e.stopPropagation()}>
            <img src={incident.images[galleryIdx]} alt="" className="max-w-full max-h-[80vh] rounded" style={{ objectFit: 'contain' }} />
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded text-[11px]" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
                  onClick={() => setGalleryIdx(i => (i - 1 + incident.images.length) % incident.images.length)}>Previous</button>
                <button className="px-3 py-1 rounded text-[11px]" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
                  onClick={() => setGalleryIdx(i => (i + 1) % incident.images.length)}>Next</button>
              </div>
              <span className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.6)' }}>{galleryIdx + 1} / {incident.images.length}</span>
            </div>
            <button className="absolute -top-8 left-0 text-[21px]" style={{ color: '#fff' }} onClick={() => setShowGallery(false)}>✕</button>
          </div>
        </div>
      )}

      {/* 7. Signatures */}
      <Section title="7. Signatures">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(100,140,200,0.08)' }}>
                {['Party', 'Signature', 'Date & Time'].map(h => (
                  <th key={h} className="py-2 px-3 text-left text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(100,140,200,0.04)' }}>
                <td className="py-2 px-3 text-[12px] font-mono" style={{ color: 'var(--foreground)' }}>SOM</td>
                <td className="py-2 px-3 text-[12px]" style={{ color: 'var(--foreground)' }}>{incident.somSignature || '—'}</td>
                <td className="py-2 px-3 text-[11px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{incident.somSignTime ? new Date(incident.somSignTime).toLocaleString('en-US') : '—'}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-[12px] font-mono" style={{ color: 'var(--foreground)' }}>SM</td>
                <td className="py-2 px-3 text-[12px]" style={{ color: 'var(--foreground)' }}>{incident.smSignature || '—'}</td>
                <td className="py-2 px-3 text-[11px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{incident.smSignTime ? new Date(incident.smSignTime).toLocaleString('en-US') : '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* 8. Report Submission */}
      <Section title="8. Report Submission">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6">
          <Field label="Name" value={incident.submitterName} />
          <Field label="Title" value={incident.submitterTitle} />
          <Field label="Department" value={incident.submitterDept} />
          <Field label="Date" value={incident.submitterDate ? new Date(incident.submitterDate).toLocaleString('en-US') : '—'} />
          <Field label="Signature" value={incident.submitterSignature} />
        </div>
        <div className="mt-3 pt-3 text-[11px] font-mono" style={{ borderTop: '1px solid var(--border)', color: 'var(--primary)' }}>
          📧 camco.occline-1@camco.com.sa
        </div>
      </Section>

      {/* Timeline */}
      <Section title="Timeline & Comments">
        {incident.timeline.length > 0 ? (
          <div className="space-y-0 mb-3">
            {incident.timeline.map(t => (
              <div key={t.id} className="flex items-start gap-2 py-2 border-b border-dashed last:border-0" style={{ borderColor: 'var(--border)' }}>
                <div className="flex flex-col items-center gap-0.5 mt-0.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--primary)' }} />
                  <div className="w-px h-full min-h-[24px]" style={{ background: 'var(--border)' }} />
                </div>
                <div>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--primary)' }}>{t.timestamp}</span>
                  <p className="text-[12px] mt-0.5" style={{ color: 'var(--foreground)' }}>{t.description}</p>
                  <span className="text-[9px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{t.createdBy}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] font-mono mb-3" style={{ color: 'var(--muted-foreground)' }}>No timeline entries</p>
        )}
        {showAddTl ? (
          <div className="flex gap-2 items-end">
            <div className="w-20"><label className="text-[9px] font-mono block mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Time</label>
              <input type="time" className="inp" value={tlTime} onChange={e => setTlTime(e.target.value)} /></div>
            <div className="flex-1"><input className="inp" value={tlDesc} onChange={e => setTlDesc(e.target.value)} placeholder="Description" /></div>
            <div className="flex gap-1">
              <button className="px-2 py-1 rounded text-[11px]" style={{ background: 'var(--primary)', color: '#fff' }} onClick={addTimeline}>Add</button>
              <button className="px-2 py-1 rounded text-[11px]" style={{ background: 'var(--border)', color: 'var(--muted-foreground)' }} onClick={() => { setShowAddTl(false); setTlTime(''); setTlDesc('') }}>Cancel</button>
            </div>
          </div>
        ) : (
          <button className="text-[11px] font-mono" style={{ color: 'var(--primary)' }} onClick={() => setShowAddTl(true)}>+ Add Timeline Entry</button>
        )}
      </Section>

      {incident.closedAt && (
        <div className="text-center py-3">
          <span className="text-[11px] font-mono" style={{ color: 'var(--chart-3)' }}>
            ✅ Incident closed on {new Date(incident.closedAt).toLocaleDateString('en-US')}
          </span>
        </div>
      )}
    </div>
  )
}
