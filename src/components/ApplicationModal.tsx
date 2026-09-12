import { useEffect, useState } from 'react'
import type { ApplicationDraft, ApplicationPriority, ApplicationStatus, JobApplication } from '../types'
import { XIcon } from './Icons'

const statuses: ApplicationStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected', 'Wishlist']
const priorities: ApplicationPriority[] = ['Low', 'Medium', 'High']

const emptyDraft: ApplicationDraft = {
  company: '',
  role: '',
  jobTitle: '',
  location: '',
  status: 'Applied',
  priority: 'Medium',
  appliedDate: new Date().toISOString().slice(0, 10),
  applicationDate: new Date().toISOString().slice(0, 10),
  interviewDate: '',
  salary: '',
  url: '',
  jobUrl: '',
  notes: '',
}

interface ApplicationModalProps {
  application?: JobApplication | null
  onClose: () => void
  onSave: (draft: ApplicationDraft) => void
}

export function ApplicationModal({ application, onClose, onSave }: ApplicationModalProps) {
  const [draft, setDraft] = useState<ApplicationDraft>(application ?? emptyDraft)

  useEffect(() => {
    setDraft(application ?? emptyDraft)
  }, [application])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const update = (field: keyof ApplicationDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <div><p className="eyebrow">{application ? 'Update your pipeline' : 'Grow your pipeline'}</p><h2 id="modal-title">{application ? 'Edit application' : 'Add application'}</h2></div>
          <button className="icon-button close-button" type="button" aria-label="Close dialog" onClick={onClose}><XIcon /></button>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); if (draft.company.trim() && draft.role.trim()) onSave(draft) }}>
          <div className="form-grid">
            <label>Company <span className="required">*</span><input autoFocus required value={draft.company} onChange={(event) => update('company', event.target.value)} placeholder="e.g. Acme Inc." /></label>
            <label>Role <span className="required">*</span><input required value={draft.role} onChange={(event) => update('role', event.target.value)} placeholder="e.g. Product Designer" /></label>
            <label>Location<input value={draft.location} onChange={(event) => update('location', event.target.value)} placeholder="Remote · US" /></label>
            <label>Status<select value={draft.status} onChange={(event) => update('status', event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
            <label>Priority<select value={draft.priority} onChange={(event) => update('priority', event.target.value)}>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label>
            <label>Date applied<input type="date" value={draft.appliedDate} onChange={(event) => update('appliedDate', event.target.value)} /></label>
            <label>Interview date<input type="date" value={draft.interviewDate} onChange={(event) => update('interviewDate', event.target.value)} /></label>
            <label>Salary range<input value={draft.salary} onChange={(event) => update('salary', event.target.value)} placeholder="$120k – $150k" /></label>
            <label className="full-width">Job posting URL<input type="url" value={draft.url} onChange={(event) => update('url', event.target.value)} placeholder="https://" /></label>
            <label className="full-width">Notes<textarea value={draft.notes} onChange={(event) => update('notes', event.target.value)} placeholder="Add a reminder, contact, or next step..." rows={3} /></label>
          </div>
          <div className="modal-footer"><button type="button" className="button button-secondary" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary">{application ? 'Save changes' : 'Add application'}</button></div>
        </form>
      </section>
    </div>
  )
}
