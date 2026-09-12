import type { JobApplication } from '../types'
import { PencilIcon, TrashIcon } from './Icons'
import { StatusBadge } from './StatusBadge'

interface ApplicationTableProps {
  applications: JobApplication[]
  onEdit: (application: JobApplication) => void
  onDelete: (application: JobApplication) => void
}

export function ApplicationTable({ applications, onEdit, onDelete }: ApplicationTableProps) {
  return (
    <div className="application-table-wrap">
      <table className="application-table">
        <caption className="sr-only">Job applications</caption>
        <thead><tr><th>Company</th><th>Job title</th><th>Status</th><th>Priority</th><th>Applied</th><th>Interview</th><th><span className="sr-only">Actions</span></th></tr></thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id}>
              <td><strong>{application.company}</strong><span>{application.location}</span></td>
              <td>{application.jobTitle || application.role}</td>
              <td><StatusBadge status={application.status} /></td>
              <td><span className={`priority priority-${(application.priority || 'Medium').toLowerCase()}`}>{application.priority || 'Medium'}</span></td>
              <td>{application.applicationDate || application.appliedDate}</td>
              <td>{application.interviewDate || '—'}</td>
              <td><div className="table-actions"><button type="button" aria-label={`Edit ${application.company}`} onClick={() => onEdit(application)}><PencilIcon /></button><button type="button" aria-label={`Delete ${application.company}`} onClick={() => onDelete(application)}><TrashIcon /></button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
