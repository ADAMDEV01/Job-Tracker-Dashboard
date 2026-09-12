export type ApplicationStatus =
  | 'Applied'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Wishlist'

export type SortOption = 'newest' | 'oldest' | 'company' | 'status'
export type ApplicationPriority = 'Low' | 'Medium' | 'High'

export interface JobApplication {
  id: string
  company: string
  role: string
  jobTitle: string
  location: string
  status: ApplicationStatus
  priority: ApplicationPriority
  appliedDate: string
  applicationDate: string
  interviewDate: string
  salary: string
  url: string
  jobUrl: string
  notes: string
  accent: string
}

export interface ApplicationDraft {
  company: string
  role: string
  jobTitle: string
  location: string
  status: ApplicationStatus
  priority: ApplicationPriority
  appliedDate: string
  applicationDate: string
  interviewDate: string
  salary: string
  url: string
  jobUrl: string
  notes: string
}
