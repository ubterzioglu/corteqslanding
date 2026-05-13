export const RESOURCE_DEPARTMENTS = ['Genel', 'İnsan Kaynakları', 'ARGE'] as const
export type ResourceDepartment = (typeof RESOURCE_DEPARTMENTS)[number]

export const RESOURCE_RECORD_KINDS = ['Link', 'Dosya', 'CV'] as const
export type ResourceRecordKind = (typeof RESOURCE_RECORD_KINDS)[number]

export const RESOURCE_ADDED_BY = ['Şahin', 'UBT', 'Baran', 'Burak', 'Diğer'] as const
export type ResourceAddedBy = (typeof RESOURCE_ADDED_BY)[number]

export interface ResourceEntryRow {
  id: string
  department: ResourceDepartment
  record_kind: ResourceRecordKind
  added_by: ResourceAddedBy
  title: string
  description: string | null
  url: string | null
  storage_bucket: string | null
  storage_path: string | null
  file_name: string | null
  person_first_name: string | null
  person_last_name: string | null
  person_role: string | null
  linkedin_url: string | null
  instagram_url: string | null
  website_url: string | null
  created_at: string
}

export interface ResourceEntry {
  id: string
  department: ResourceDepartment
  recordKind: ResourceRecordKind
  addedBy: ResourceAddedBy
  title: string
  description: string | null
  url: string | null
  storageBucket: string | null
  storagePath: string | null
  fileName: string | null
  personFirstName: string | null
  personLastName: string | null
  personRole: string | null
  linkedinUrl: string | null
  instagramUrl: string | null
  websiteUrl: string | null
  createdAt: string
}

export interface ResourceFormState {
  department: ResourceDepartment
  recordKind: ResourceRecordKind
  addedBy: ResourceAddedBy
  title: string
  description: string
  url: string
  personFirstName: string
  personLastName: string
  personRole: string
  linkedinUrl: string
  instagramUrl: string
  websiteUrl: string
}

export type ResourceSectionFilter = 'all' | ResourceDepartment
export type ResourceKindFilter = 'all' | ResourceRecordKind

export function createEmptyResourceFormState(): ResourceFormState {
  return {
    department: 'Genel',
    recordKind: 'Link',
    addedBy: 'UBT',
    title: '',
    description: '',
    url: '',
    personFirstName: '',
    personLastName: '',
    personRole: '',
    linkedinUrl: '',
    instagramUrl: '',
    websiteUrl: '',
  }
}

export function mapResourceEntryRow(row: ResourceEntryRow): ResourceEntry {
  return {
    id: row.id,
    department: row.department,
    recordKind: row.record_kind,
    addedBy: row.added_by,
    title: row.title,
    description: row.description,
    url: row.url,
    storageBucket: row.storage_bucket,
    storagePath: row.storage_path,
    fileName: row.file_name,
    personFirstName: row.person_first_name,
    personLastName: row.person_last_name,
    personRole: row.person_role,
    linkedinUrl: row.linkedin_url,
    instagramUrl: row.instagram_url,
    websiteUrl: row.website_url,
    createdAt: row.created_at,
  }
}

export function getResourceSectionFromQuery(
  section: string | string[] | undefined
): ResourceSectionFilter {
  const normalized = Array.isArray(section) ? section[0] : section

  if (normalized === 'insankaynaklari') {
    return 'İnsan Kaynakları'
  }

  if (normalized === 'arge') {
    return 'ARGE'
  }

  return 'all'
}

export function requiresStoredFile(entry: Pick<ResourceFormState, 'department' | 'recordKind'>): boolean {
  return entry.recordKind === 'CV' || (entry.recordKind === 'Dosya' && entry.department === 'ARGE')
}

export function requiresUrl(entry: Pick<ResourceFormState, 'department' | 'recordKind'>): boolean {
  if (entry.recordKind === 'Link') return true
  if (entry.recordKind === 'Dosya' && entry.department === 'Genel') return true
  return false
}

export function getStorageBucket(entry: Pick<ResourceFormState, 'department' | 'recordKind'>): string | null {
  if (entry.recordKind === 'CV') return 'cv-files'
  if (entry.recordKind === 'Dosya' && entry.department === 'ARGE') return 'arge-files'
  return null
}
