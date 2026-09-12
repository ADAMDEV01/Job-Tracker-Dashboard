import type { JobApplication } from '../types'

const STORAGE_KEY = 'horizon-job-applications'

export function loadApplications(fallback: JobApplication[]): JobApplication[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return fallback
    }

    const parsed: unknown = JSON.parse(stored)
    return Array.isArray(parsed) ? (parsed as JobApplication[]) : fallback
  } catch {
    return fallback
  }
}

export function saveApplications(applications: JobApplication[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
  } catch {
    // Storage can be unavailable in private browsing; the in-memory state still works.
  }
}

export function clearApplications(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore unavailable storage.
  }
}
