import type { ApplicationStatus } from '../types'

const statusClass: Record<ApplicationStatus, string> = {
  Applied: 'status-applied',
  Interview: 'status-interview',
  Offer: 'status-offer',
  Rejected: 'status-rejected',
  Wishlist: 'status-wishlist',
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <span className={`status-badge ${statusClass[status]}`}><span className="status-dot" />{status}</span>
}
