import { useEffect, useMemo, useState } from 'react'
import type { ApplicationDraft, ApplicationPriority, ApplicationStatus, JobApplication, SortOption } from './types'
import { sampleApplications } from './data'
import { loadApplications, saveApplications } from './utils/storage'
import { ApplicationCard } from './components/ApplicationCard'
import { ApplicationTable } from './components/ApplicationTable'
import { ApplicationModal } from './components/ApplicationModal'
import { BriefcaseIcon, ChevronDownIcon, MenuIcon, PlusIcon, SearchIcon, SlidersIcon, SparkleIcon, XIcon } from './components/Icons'
import './index.css'

const statuses: Array<'All' | ApplicationStatus> = ['All', 'Applied', 'Interview', 'Offer', 'Rejected', 'Wishlist']
const priorities: Array<'All' | ApplicationPriority> = ['All', 'High', 'Medium', 'Low']

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function getAccent(company: string) {
  const accents = ['#5e6ad2', '#0f766e', '#db2777', '#ea580c', '#4338ca', '#334155']
  return accents[company.length % accents.length]
}

export default function App() {
  const [applications, setApplications] = useState<JobApplication[]>(() => loadApplications(sampleApplications))
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | ApplicationStatus>('All')
  const [priorityFilter, setPriorityFilter] = useState<'All' | ApplicationPriority>('All')
  const [sort, setSort] = useState<SortOption>('newest')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState<JobApplication | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [feedback, setFeedback] = useState('')

  useEffect(() => saveApplications(applications), [applications])

  const metrics = useMemo(() => ({
    total: applications.length,
    active: applications.filter(({ status }) => !['Rejected', 'Wishlist'].includes(status)).length,
    interviews: applications.filter(({ status }) => status === 'Interview').length,
    offers: applications.filter(({ status }) => status === 'Offer').length,
    rejected: applications.filter(({ status }) => status === 'Rejected').length,
  }), [applications])

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase()
    return applications
      .filter((application) => statusFilter === 'All' || application.status === statusFilter)
      .filter((application) => priorityFilter === 'All' || application.priority === priorityFilter)
      .filter((application) => !query || [application.company, application.role, application.location, application.notes].some((field) => field.toLowerCase().includes(query)))
      .sort((a, b) => {
        if (sort === 'company') return a.company.localeCompare(b.company)
        if (sort === 'status') return a.status.localeCompare(b.status)
        const difference = new Date(`${a.appliedDate}T12:00:00`).valueOf() - new Date(`${b.appliedDate}T12:00:00`).valueOf()
        return sort === 'newest' ? -difference : difference
      })
  }, [applications, search, sort, statusFilter, priorityFilter])

  const openNew = () => { setEditing(null); setIsModalOpen(true) }
  const openEdit = (application: JobApplication) => { setEditing(application); setIsModalOpen(true) }
  const closeModal = () => { setIsModalOpen(false); setEditing(null) }
  const saveApplication = (draft: ApplicationDraft) => {
    if (editing) {
      setApplications((current) => current.map((item) => item.id === editing.id ? { ...item, ...draft, jobTitle: draft.role, applicationDate: draft.appliedDate, jobUrl: draft.url } : item))
    } else {
      setApplications((current) => [{ ...draft, id: makeId(), jobTitle: draft.role, applicationDate: draft.appliedDate, jobUrl: draft.url, accent: getAccent(draft.company) }, ...current])
    }
    setFeedback(editing ? 'Application updated successfully.' : 'Application added successfully.')
    closeModal()
  }
  const deleteApplication = (application: JobApplication) => {
    if (window.confirm(`Delete the ${application.company} application?`)) {
      setApplications((current) => current.filter((item) => item.id !== application.id))
      setFeedback('Application deleted.')
    }
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <div className="brand"><span className="brand-mark"><SparkleIcon /></span><span>horizon</span></div>
        <nav aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          <a className="nav-item active" href="#applications" onClick={() => setMobileNavOpen(false)}><BriefcaseIcon /> Applications <span className="nav-count">{applications.length}</span></a>
          <a className="nav-item" href="#insights" onClick={(event) => { event.preventDefault(); setMobileNavOpen(false) }}><SparkleIcon /> Insights <span className="soon-label">Soon</span></a>
        </nav>
        <div className="sidebar-bottom"><div className="upgrade-card"><span className="upgrade-icon"><SparkleIcon /></span><strong>Stay on track</strong><p>Keep every opportunity in one clear view.</p><button type="button" onClick={openNew}>Add an application <PlusIcon /></button></div><div className="profile"><div className="avatar">JD</div><div><strong>Jordan Davis</strong><span>Job seeker</span></div><ChevronDownIcon /></div></div>
      </aside>
      {mobileNavOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}
      <main className="main-content" id="applications">
        <header className="topbar"><button className="mobile-menu icon-button" type="button" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}><MenuIcon /></button><div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>Applications</strong></div><div className="topbar-actions"><button className="avatar topbar-avatar" type="button" aria-label="Open profile menu">JD</button></div></header>
        <div className="page-content">
          <div className="sr-only" aria-live="polite">{feedback}</div>
          <section className="page-heading"><div><p className="eyebrow">Wednesday, June 26, 2024</p><h1>Your applications</h1><p className="heading-copy">A calm place to keep your job search moving forward.</p></div><button className="button button-primary add-button" type="button" onClick={openNew}><PlusIcon /> Add application</button></section>
          <section className="metric-grid" aria-label="Application summary">
            <div className="metric-card"><span className="metric-label">Total applications</span><strong>{metrics.total}</strong><span className="metric-hint">Across your pipeline</span></div>
            <div className="metric-card"><span className="metric-label">Active search</span><strong>{metrics.active}</strong><span className="metric-hint"><span className="trend-dot" /> In progress</span></div>
            <div className="metric-card"><span className="metric-label">Interviews</span><strong>{metrics.interviews}</strong><span className="metric-hint">Keep preparing</span></div>
            <div className="metric-card highlight-metric"><span className="metric-label">Offers</span><strong>{metrics.offers}</strong><span className="metric-hint">Great work!</span><span className="metric-sparkle"><SparkleIcon /></span></div>
            <div className="metric-card"><span className="metric-label">Rejected</span><strong>{metrics.rejected}</strong><span className="metric-hint">Keep going</span></div>
          </section>
          <section className="applications-section">
            <div className="section-heading"><div><h2>All applications <span>{filteredApplications.length}</span></h2><p>Track every opportunity from first click to final decision.</p></div><div className="view-toggle" aria-label="View options"><button className={viewMode === 'cards' ? 'view-active' : ''} type="button" aria-label="Card view" aria-pressed={viewMode === 'cards'} onClick={() => setViewMode('cards')}><span /><span /><span /></button><button className={viewMode === 'table' ? 'view-active' : ''} type="button" aria-label="Table view" aria-pressed={viewMode === 'table'} onClick={() => setViewMode('table')}><span /><span /><span /></button></div></div>
            <div className="toolbar"><div className="search-field"><SearchIcon /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search applications..." aria-label="Search applications" />{search && <button type="button" aria-label="Clear search" onClick={() => setSearch('')}><XIcon /></button>}</div><button className={`filter-button ${showFilters || statusFilter !== 'All' ? 'filter-active' : ''}`} type="button" onClick={() => setShowFilters((current) => !current)}><SlidersIcon /> Filters {statusFilter !== 'All' && <span className="filter-count">1</span>}</button><label className="sort-select"><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} aria-label="Sort applications"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="company">Company A–Z</option><option value="status">Status</option></select><ChevronDownIcon /></label></div>
            {showFilters && <div className="filter-panel"><span className="filter-label">Status</span><div className="status-filters">{statuses.map((status) => <button key={status} type="button" className={statusFilter === status ? 'selected' : ''} onClick={() => setStatusFilter(status)}>{status}</button>)}</div><span className="filter-label">Priority</span><div className="status-filters">{priorities.map((priority) => <button key={priority} type="button" className={priorityFilter === priority ? 'selected' : ''} onClick={() => setPriorityFilter(priority)}>{priority}</button>)}</div>{(statusFilter !== 'All' || priorityFilter !== 'All') && <button className="clear-filter" type="button" onClick={() => { setStatusFilter('All'); setPriorityFilter('All') }}>Clear filters</button>}</div>}
            {filteredApplications.length > 0 ? (viewMode === 'cards' ? <div className="application-grid">{filteredApplications.map((application) => <ApplicationCard key={application.id} application={application} onEdit={openEdit} onDelete={deleteApplication} />)}</div> : <ApplicationTable applications={filteredApplications} onEdit={openEdit} onDelete={deleteApplication} />) : <div className="empty-state"><span className="empty-icon"><SearchIcon /></span><h3>No applications found</h3><p>Try a different search or clear your filters.</p><button type="button" className="button button-secondary" onClick={() => { setSearch(''); setStatusFilter('All'); setPriorityFilter('All') }}>Clear search and filters</button></div>}
          </section>
        </div>
      </main>
      {isModalOpen && <ApplicationModal application={editing} onClose={closeModal} onSave={saveApplication} />}
    </div>
  )
}
