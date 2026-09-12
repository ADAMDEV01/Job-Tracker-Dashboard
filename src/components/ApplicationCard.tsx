import { useState } from 'react'
import type { JobApplication } from '../types'
import { CalendarIcon, ExternalLinkIcon, MapPinIcon, MoreIcon, PencilIcon, TrashIcon } from './Icons'
import { StatusBadge } from './StatusBadge'

interface ApplicationCardProps {
  application: JobApplication
  onEdit: (application: JobApplication) => void
  onDelete: (application: JobApplication) => void
}

export function ApplicationCard({ application, onEdit, onDelete }: ApplicationCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const date = new Date(`${application.appliedDate}T12:00:00`)
  const formattedDate = Number.isNaN(date.valueOf())
    ? application.appliedDate
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <article className="application-card">
      <div className="card-topline">
        <div className="company-mark" style={{ backgroundColor: application.accent }} aria-hidden="true">
          {application.company.slice(0, 1).toUpperCase()}
        </div>
        <div className="company-details">
          <h3>{application.role}</h3>
          <p>{application.company}</p>
        </div>
        <div className="card-actions">
          <button className="icon-button" type="button" aria-label={`Actions for ${application.company}`} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            <MoreIcon />
          </button>
          {menuOpen && (
            <div className="action-menu" role="menu">
              <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); onEdit(application) }}><PencilIcon /> Edit application</button>
              <button type="button" role="menuitem" className="danger-action" onClick={() => { setMenuOpen(false); onDelete(application) }}><TrashIcon /> Delete</button>
            </div>
          )}
        </div>
      </div>
      <div className="card-meta">
        <span><MapPinIcon />{application.location}</span>
        <span><CalendarIcon />{formattedDate}</span>
      </div>
      <div className="card-bottomline">
        <StatusBadge status={application.status} />
        <span className="salary">{application.salary || 'Salary not listed'}</span>
      </div>
      {application.url && (
        <a className="company-link" href={application.url} target="_blank" rel="noreferrer">
          View job posting <ExternalLinkIcon />
        </a>
      )}
    </article>
  )
}
