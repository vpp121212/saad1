import { useState, useEffect } from 'react'
import type { Incident, AppUser, Page } from './types'
import { stations } from './data/constants'
import { sampleIncidents } from './data/sample-data'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { TopBar } from './components/TopBar'
import { Dashboard } from './pages/Dashboard'
import { IncidentsList } from './pages/IncidentsList'
import { IncidentDetail } from './pages/IncidentDetail'
import { NewIncident } from './pages/NewIncident'
import { Reports } from './pages/Reports'
import { StaffPage } from './pages/StaffPage'
import { Stations } from './pages/Stations'
import { LoginPage } from './pages/LoginPage'

export default function App() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [page, setPage] = useState<Page>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [incidents, setIncidents] = useState<Incident[]>(sampleIncidents)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  }, [theme])

  useEffect(() => {
    const disableEvent = (e: Event) => { e.preventDefault(); return false }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) || (e.ctrlKey && ['u', 'U'].includes(e.key))) {
        e.preventDefault(); return false
      }
    }
    const onCopy = (e: ClipboardEvent) => { if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) e.preventDefault() }
    const onCut = (e: ClipboardEvent) => { if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) e.preventDefault() }
    document.addEventListener('contextmenu', disableEvent)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('copy', onCopy)
    document.addEventListener('cut', onCut)
    return () => {
      document.removeEventListener('contextmenu', disableEvent)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('copy', onCopy)
      document.removeEventListener('cut', onCut)
    }
  }, [])

  if (!user) return <LoginPage onLogin={(u) => setUser(u)} />

  const updateIncident = (id: string, updates: Partial<Incident>) =>
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i))

  const closeIncident = (id: string) =>
    updateIncident(id, { status: 'Closed', closedAt: new Date().toISOString() })

  const deleteIncident = (id: string) =>
    setIncidents(prev => prev.filter(i => i.id !== id))

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard incidents={incidents} onNavigate={(id) => { setSelectedId(id); setPage('incident-detail') }} />
      case 'incidents':
        return <IncidentsList incidents={incidents} onView={(id) => { setSelectedId(id); setPage('incident-detail') }} onDelete={deleteIncident} />
      case 'incident-detail':
        return <IncidentDetail incident={incidents.find(i => i.id === selectedId)!} onBack={() => setPage('incidents')} onUpdate={updateIncident} onClose={closeIncident} />
      case 'new-incident':
        return <NewIncident onSave={(inc) => { setIncidents(prev => [inc, ...prev]); setPage('incidents') }} onCancel={() => setPage('dashboard')} />
      case 'reports':
        return <Reports incidents={incidents} />
      case 'staff':
        return <StaffPage />
      case 'stations':
        return <Stations incidents={incidents} stations={stations} onNavigate={(id) => { setSelectedId(id); setPage('incident-detail') }} />
    }
  }

  const pageTitles: Record<Page, string> = {
    dashboard: 'Dashboard',
    incidents: 'Incidents',
    'incident-detail': 'Incident Detail',
    'new-incident': 'New Incident',
    reports: 'Reports',
    staff: 'Staff',
    stations: 'Stations',
  }

  const activeCount = incidents.filter(i => i.status !== 'Closed').length

  return (
    <div className={theme} style={{ background: 'var(--background)', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Sidebar
        open={sidebarOpen}
        page={page}
        onNavigate={(p) => { setPage(p); setSidebarOpen(false) }}
        onClose={() => setSidebarOpen(false)}
        activeCount={activeCount}
      />
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        activeCount={activeCount}
        user={user}
        onNavigateIncidents={() => { setPage('incidents'); setSidebarOpen(false) }}
      />
      <main style={{ paddingTop: 44, paddingBottom: 0, marginLeft: sidebarOpen ? 260 : 0 }} className="transition-all duration-300">
        <TopBar pageTitle={pageTitles[page]} user={user} onLogout={() => setUser(null)} />
        <div className="p-3 sm:p-5" style={{ minHeight: 'calc(100vh - 100px)' }}>
          {renderPage()}
        </div>
      </main>
    </div>
  )
}
