'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Download,
  ExternalLink,
  Eye,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import AccordionCard from '@/components/dashboard/AccordionCard'
import { getSupabaseBrowserClient } from '@/lib/dashboard/supabase'
import { safeHref, sanitizeError, sanitizeUrl, validateArgeFile, validateCvFile } from '@/lib/security'
import {
  createEmptyResourceFormState,
  getResourceSectionFromQuery,
  getStorageBucket,
  MANUAL_RESOURCE_IMPORT_BATCH,
  MANUAL_RESOURCE_SOURCE_FOLDER,
  mapResourceEntryRow,
  requiresStoredFile,
  requiresUrl,
  RESOURCE_ADDED_BY,
  RESOURCE_DEPARTMENTS,
  RESOURCE_RECORD_KINDS,
  type ResourceDepartment,
  type ResourceEntry,
  type ResourceEntryRow,
  type ResourceFormState,
  type ResourceKindFilter,
  type ResourceRecordKind,
  type ResourceSectionFilter,
} from '@/lib/dashboard/resource-items'

const INPUT_CLS =
  'w-full rounded-xl border border-[rgba(66,133,244,0.15)] bg-white px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

const BTN_CLS =
  'inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all disabled:opacity-60'

const FILTER_BTN_CLS =
  'rounded-full border px-3 py-2 text-xs font-semibold tracking-wide transition-all'

const SELECT_FIELDS =
  'id, department, record_kind, added_by, title, description, url, storage_bucket, storage_path, file_name, person_first_name, person_last_name, person_role, linkedin_url, instagram_url, website_url, source_folder, source_subfolder, source_snapshot_date, import_batch, created_at'

function normalizeOptionalText(value: string): string | null {
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : null
}

function buildTitleFromCv(formState: ResourceFormState): string {
  const fullName = `${formState.personFirstName} ${formState.personLastName}`.trim()
  return fullName || formState.title.trim() || 'CV Kaydı'
}

function formatSnapshotDate(value: string | null): string {
  if (!value) return 'Tarih yok'

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value

  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsed)
}

export default function LinkManager() {
  const [searchParams] = useSearchParams()
  const [entries, setEntries] = useState<ResourceEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formState, setFormState] = useState<ResourceFormState>(createEmptyResourceFormState)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingState, setEditingState] = useState<ResourceFormState>(createEmptyResourceFormState)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartments, setSelectedDepartments] = useState<Set<ResourceDepartment>>(new Set())
  const [selectedKinds, setSelectedKinds] = useState<Set<ResourceRecordKind>>(new Set())
  const [selectedAddedBy, setSelectedAddedBy] = useState<Set<string>>(new Set())

  const supabase = getSupabaseBrowserClient()
  const isEditing = editingId !== null

  const loadEntries = useCallback(async () => {
    if (!supabase) {
      setError('Supabase bağlantısı yapılandırılmamış.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data, error: fetchErr } = await supabase
        .from('resource_entries')
        .select(SELECT_FIELDS)
        .order('created_at', { ascending: false })

      if (fetchErr) throw fetchErr

      setEntries((data as ResourceEntryRow[]).map(mapResourceEntryRow))
    } catch (loadError) {
      setError(sanitizeError(loadError, 'Kayıtlar yüklenemedi.'))
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    void loadEntries()
  }, [loadEntries])

  useEffect(() => {
    const section = getResourceSectionFromQuery(searchParams.get('section') ?? undefined)
    if (section !== 'all') {
      setSelectedDepartments(new Set([section]))
    }
  }, [searchParams])

  const filteredEntries = useMemo(
    () =>
      entries.filter((entry) => {
        const matchesDepartment = selectedDepartments.size === 0 || selectedDepartments.has(entry.department)
        const matchesKind = selectedKinds.size === 0 || selectedKinds.has(entry.recordKind)
        const matchesAddedBy = selectedAddedBy.size === 0 || selectedAddedBy.has(entry.addedBy)

        const term = searchTerm.toLowerCase().trim()
        const matchesSearch =
          term === '' ||
          entry.title.toLowerCase().includes(term) ||
          (entry.description?.toLowerCase().includes(term) ?? false) ||
          (entry.fileName?.toLowerCase().includes(term) ?? false) ||
          (entry.personFirstName?.toLowerCase().includes(term) ?? false) ||
          (entry.personLastName?.toLowerCase().includes(term) ?? false) ||
          (entry.personRole?.toLowerCase().includes(term) ?? false) ||
          entry.sourceFolder.toLowerCase().includes(term) ||
          (entry.sourceSubfolder?.toLowerCase().includes(term) ?? false)

        return matchesDepartment && matchesKind && matchesAddedBy && matchesSearch
      }),
    [entries, selectedDepartments, selectedKinds, selectedAddedBy, searchTerm]
  )

  const hasActiveFilters = selectedDepartments.size > 0 || selectedKinds.size > 0 || selectedAddedBy.size > 0 || searchTerm.trim() !== ''

  function clearAllFilters() {
    setSelectedDepartments(new Set())
    setSelectedKinds(new Set())
    setSelectedAddedBy(new Set())
    setSearchTerm('')
  }

  function toggleDepartmentFilter(section: ResourceSectionFilter) {
    if (section === 'all') {
      setSelectedDepartments(new Set())
      return
    }

    setSelectedDepartments((current) => {
      const next = new Set(current)
      if (next.has(section)) {
        next.delete(section)
      } else {
        next.add(section)
      }
      return next
    })
  }

  function toggleKindFilter(kind: ResourceKindFilter) {
    if (kind === 'all') {
      setSelectedKinds(new Set())
      return
    }

    setSelectedKinds((current) => {
      const next = new Set(current)
      if (next.has(kind)) {
        next.delete(kind)
      } else {
        next.add(kind)
      }
      return next
    })
  }

  function handleFormState<K extends keyof ResourceFormState>(key: K, value: ResourceFormState[K]) {
    setFormState((state) => ({ ...state, [key]: value }))
  }

  function handleEditingState<K extends keyof ResourceFormState>(key: K, value: ResourceFormState[K]) {
    setEditingState((state) => ({ ...state, [key]: value }))
  }

  function validateSelectedFile(nextState: ResourceFormState, file: File | null): string | null {
    if (!file) return 'Lütfen dosya seçin.'
    if (nextState.recordKind === 'CV') return validateCvFile(file)
    return validateArgeFile(file)
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase) {
      setError('Supabase bağlantısı yapılandırılmamış.')
      return
    }

    const needsUrl = requiresUrl(formState)
    const needsStoredFile = requiresStoredFile(formState)
    const bucket = getStorageBucket(formState)

    if (needsUrl && !formState.url.trim()) {
      setError('Bu kayıt için URL zorunlu.')
      return
    }

    if (needsStoredFile) {
      const fileError = validateSelectedFile(formState, selectedFile)
      if (fileError) {
        setError(fileError)
        return
      }
    }

    setIsSubmitting(true)
    setError(null)

    let uploadedStoragePath: string | null = null

    try {
      if (needsStoredFile && selectedFile && bucket) {
        const fileExt = selectedFile.name.split('.').pop()
        const filePath = `${crypto.randomUUID()}.${fileExt}`
        const { error: uploadErr } = await supabase.storage.from(bucket).upload(filePath, selectedFile)
        if (uploadErr) throw uploadErr
        uploadedStoragePath = filePath
      }

      const payload = {
        department: formState.department,
        record_kind: formState.recordKind,
        added_by: formState.addedBy,
        title: formState.recordKind === 'CV' ? buildTitleFromCv(formState) : formState.title.trim(),
        description: normalizeOptionalText(formState.description),
        url: needsUrl ? sanitizeUrl(formState.url) : null,
        storage_bucket: uploadedStoragePath ? bucket : null,
        storage_path: uploadedStoragePath,
        file_name: uploadedStoragePath ? selectedFile?.name ?? null : null,
        person_first_name: formState.recordKind === 'CV' ? normalizeOptionalText(formState.personFirstName) : null,
        person_last_name: formState.recordKind === 'CV' ? normalizeOptionalText(formState.personLastName) : null,
        person_role: formState.recordKind === 'CV' ? normalizeOptionalText(formState.personRole) : null,
        linkedin_url: formState.recordKind === 'CV' ? normalizeOptionalText(sanitizeUrl(formState.linkedinUrl)) : null,
        instagram_url: formState.recordKind === 'CV' ? normalizeOptionalText(sanitizeUrl(formState.instagramUrl)) : null,
        website_url: formState.recordKind === 'CV' ? normalizeOptionalText(sanitizeUrl(formState.websiteUrl)) : null,
        source_folder: MANUAL_RESOURCE_SOURCE_FOLDER,
        source_subfolder: null,
        source_snapshot_date: null,
        import_batch: MANUAL_RESOURCE_IMPORT_BATCH,
      }

      const { data, error: insertErr } = await supabase
        .from('resource_entries')
        .insert(payload)
        .select(SELECT_FIELDS)
        .single()

      if (insertErr || !data) throw insertErr ?? new Error('Kayıt eklenemedi.')

      setEntries((prev) => [mapResourceEntryRow(data as ResourceEntryRow), ...prev])
      setFormState(createEmptyResourceFormState())
      setSelectedFile(null)
    } catch (createError) {
      if (uploadedStoragePath && bucket) {
        await supabase.storage.from(bucket).remove([uploadedStoragePath])
      }
      setError(sanitizeError(createError, 'Kayıt eklenemedi.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  function startEdit(entry: ResourceEntry) {
    setEditingId(entry.id)
    setEditingState({
      department: entry.department,
      recordKind: entry.recordKind,
      addedBy: entry.addedBy,
      title: entry.title,
      description: entry.description ?? '',
      url: entry.url ?? '',
      personFirstName: entry.personFirstName ?? '',
      personLastName: entry.personLastName ?? '',
      personRole: entry.personRole ?? '',
      linkedinUrl: entry.linkedinUrl ?? '',
      instagramUrl: entry.instagramUrl ?? '',
      websiteUrl: entry.websiteUrl ?? '',
    })
    setError(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingState(createEmptyResourceFormState())
  }

  async function handleUpdate(entry: ResourceEntry) {
    if (!supabase) return

    const needsUrl = requiresUrl(editingState)

    if (needsUrl && !editingState.url.trim()) {
      setError('Bu kayıt için URL zorunlu.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const payload = {
        department: editingState.department,
        record_kind: editingState.recordKind,
        added_by: editingState.addedBy,
        title: editingState.recordKind === 'CV' ? buildTitleFromCv(editingState) : editingState.title.trim(),
        description: normalizeOptionalText(editingState.description),
        url: needsUrl ? sanitizeUrl(editingState.url) : entry.url,
        person_first_name: editingState.recordKind === 'CV' ? normalizeOptionalText(editingState.personFirstName) : null,
        person_last_name: editingState.recordKind === 'CV' ? normalizeOptionalText(editingState.personLastName) : null,
        person_role: editingState.recordKind === 'CV' ? normalizeOptionalText(editingState.personRole) : null,
        linkedin_url: editingState.recordKind === 'CV' ? normalizeOptionalText(sanitizeUrl(editingState.linkedinUrl)) : null,
        instagram_url: editingState.recordKind === 'CV' ? normalizeOptionalText(sanitizeUrl(editingState.instagramUrl)) : null,
        website_url: editingState.recordKind === 'CV' ? normalizeOptionalText(sanitizeUrl(editingState.websiteUrl)) : null,
      }

      const { data, error: updateErr } = await supabase
        .from('resource_entries')
        .update(payload)
        .eq('id', entry.id)
        .select(SELECT_FIELDS)
        .single()

      if (updateErr || !data) throw updateErr ?? new Error('Kayıt güncellenemedi.')

      setEntries((prev) => prev.map((item) => (item.id === entry.id ? mapResourceEntryRow(data as ResourceEntryRow) : item)))
      cancelEdit()
    } catch (updateError) {
      setError(sanitizeError(updateError, 'Kayıt güncellenemedi.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(entry: ResourceEntry) {
    if (!supabase) return
    if (typeof window !== 'undefined' && !window.confirm('Bu kayıt silinsin mi?')) return

    setIsSubmitting(true)
    setError(null)

    try {
      if (entry.storageBucket && entry.storagePath) {
        const { error: storageErr } = await supabase.storage.from(entry.storageBucket).remove([entry.storagePath])
        if (storageErr) throw storageErr
      }

      const { error: deleteErr } = await supabase.from('resource_entries').delete().eq('id', entry.id)
      if (deleteErr) throw deleteErr

      setEntries((prev) => prev.filter((item) => item.id !== entry.id))
      if (editingId === entry.id) cancelEdit()
    } catch (deleteError) {
      setError(sanitizeError(deleteError, 'Kayıt silinemedi.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleOpenStoredFile(entry: ResourceEntry, shouldDownload: boolean) {
    if (!supabase || !entry.storageBucket || !entry.storagePath) return

    try {
      const { data, error: signedErr } = await supabase.storage
        .from(entry.storageBucket)
        .createSignedUrl(entry.storagePath, 300)

      if (signedErr || !data) throw signedErr ?? new Error('Dosya URL üretilemedi.')

      if (shouldDownload) {
        const anchor = document.createElement('a')
        anchor.href = data.signedUrl
        anchor.download = entry.fileName ?? entry.title
        anchor.click()
        return
      }

      window.open(data.signedUrl, '_blank')
    } catch (fileError) {
      setError(sanitizeError(fileError, 'Dosya açılamadı.'))
    }
  }

  function renderFormFields(state: ResourceFormState, mode: 'create' | 'edit') {
    const stateSetter = mode === 'create' ? handleFormState : handleEditingState
    const isCv = state.recordKind === 'CV'
    const isGeneralFile = state.recordKind === 'Dosya' && state.department === 'Genel'
    const needsUpload = requiresStoredFile(state)

    return (
      <>
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Bölüm</span>
          <select
            value={state.department}
            onChange={(event) => stateSetter('department', event.target.value as ResourceDepartment)}
            className={INPUT_CLS}
          >
            {RESOURCE_DEPARTMENTS.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Kayıt Türü</span>
          <select
            value={state.recordKind}
            onChange={(event) => stateSetter('recordKind', event.target.value as ResourceRecordKind)}
            className={INPUT_CLS}
          >
            {RESOURCE_RECORD_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {kind}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Ekleyen</span>
          <select
            value={state.addedBy}
            onChange={(event) => stateSetter('addedBy', event.target.value as ResourceFormState['addedBy'])}
            className={INPUT_CLS}
          >
            {RESOURCE_ADDED_BY.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
        </label>

        {!isCv && (
          <label className="space-y-2 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Başlık</span>
            <input
              type="text"
              value={state.title}
              onChange={(event) => stateSetter('title', event.target.value)}
              placeholder="Kayıt başlığı"
              className={INPUT_CLS}
              required
            />
          </label>
        )}

        <label className={`space-y-2 ${isCv ? '' : 'sm:col-span-2'}`}>
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            {isCv ? 'Açıklama / Not' : 'Açıklama'}
          </span>
          <input
            type="text"
            value={state.description}
            onChange={(event) => stateSetter('description', event.target.value)}
            placeholder={isCv ? 'Aday hakkında not' : 'Kısa açıklama'}
            className={INPUT_CLS}
          />
        </label>

        {isCv && (
          <>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">İsim</span>
              <input
                type="text"
                value={state.personFirstName}
                onChange={(event) => stateSetter('personFirstName', event.target.value)}
                placeholder="İsim"
                className={INPUT_CLS}
                required
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Soyisim</span>
              <input
                type="text"
                value={state.personLastName}
                onChange={(event) => stateSetter('personLastName', event.target.value)}
                placeholder="Soyisim"
                className={INPUT_CLS}
                required
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Rol</span>
              <input
                type="text"
                value={state.personRole}
                onChange={(event) => stateSetter('personRole', event.target.value)}
                placeholder="Pozisyon"
                className={INPUT_CLS}
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">LinkedIn</span>
              <input
                type="url"
                value={state.linkedinUrl}
                onChange={(event) => stateSetter('linkedinUrl', event.target.value)}
                placeholder="https://linkedin.com/in/..."
                className={INPUT_CLS}
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Instagram</span>
              <input
                type="url"
                value={state.instagramUrl}
                onChange={(event) => stateSetter('instagramUrl', event.target.value)}
                placeholder="https://instagram.com/..."
                className={INPUT_CLS}
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Website</span>
              <input
                type="url"
                value={state.websiteUrl}
                onChange={(event) => stateSetter('websiteUrl', event.target.value)}
                placeholder="https://ornek.com"
                className={INPUT_CLS}
              />
            </label>
          </>
        )}

        {requiresUrl(state) && (
          <label className={`${isGeneralFile ? 'sm:col-span-2' : 'sm:col-span-2'} space-y-2`}>
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              {isGeneralFile ? 'Dosya Linki' : 'URL'}
            </span>
            <input
              type="url"
              value={state.url}
              onChange={(event) => stateSetter('url', event.target.value)}
              placeholder="https://..."
              className={INPUT_CLS}
              required
            />
          </label>
        )}

        {needsUpload && mode === 'create' && (
          <label className="space-y-2 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Dosya</span>
            <input
              type="file"
              accept={state.recordKind === 'CV' ? '.pdf,.doc,.docx' : '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.gif,.svg,.webp,.zip,.rar,.7z,.txt,.csv,.md,.json'}
              onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
              className={INPUT_CLS}
              required
            />
          </label>
        )}
      </>
    )
  }

  return (
    <section className="space-y-6" aria-labelledby="link-manager-heading">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="link-manager-heading" className="text-xl font-semibold text-gray-900">
            Birleşik Kaynak Merkezi
          </h2>
          <a
            href={safeHref(
              'https://drive.google.com/drive/folders/1TYFEdjDPOLOMWAf_MScs6XJXRW9FHh-r?usp=drive_link'
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-primary-200 bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100"
          >
            <ExternalLink size={14} aria-hidden="true" />
            Drive Klasör Kısayolu
          </a>
        </div>
        <p className="max-w-3xl text-sm text-gray-500">
          Genel linkleri, İK CV kayıtlarını ve ARGE dosya-linklerini tek akışta yönetin.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="docs-surface p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Bölüm Filtresi</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(['all', ...RESOURCE_DEPARTMENTS] as const).map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => toggleDepartmentFilter(section)}
                className={`${FILTER_BTN_CLS} ${
                  (section === 'all' && selectedDepartments.size === 0) ||
                  (section !== 'all' && selectedDepartments.has(section))
                    ? 'border-primary-300 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-primary-200 hover:text-primary-700'
                }`}
              >
                {section === 'all' ? 'Tümü' : section}
              </button>
            ))}
          </div>
        </div>

        <div className="docs-surface p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Kayıt Türü</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(['all', ...RESOURCE_RECORD_KINDS] as const).map((kind) => (
              <button
                key={kind}
                type="button"
                onClick={() => toggleKindFilter(kind)}
                className={`${FILTER_BTN_CLS} ${
                  (kind === 'all' && selectedKinds.size === 0) ||
                  (kind !== 'all' && selectedKinds.has(kind))
                    ? 'border-primary-300 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-primary-200 hover:text-primary-700'
                }`}
              >
                {kind === 'all' ? 'Tümü' : kind}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AccordionCard
        defaultOpenId="new-resource"
        items={[
          {
            id: 'new-resource',
            title: 'Yeni Kayıt Ekle',
            accentColor: '#1A6DC2',
            children: (
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {renderFormFields(formState, 'create')}

                <div className="flex items-end sm:col-span-2 lg:col-span-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60"
                  >
                    {requiresStoredFile(formState) ? (
                      <Upload size={16} className="mr-1 inline" aria-hidden="true" />
                    ) : (
                      <Plus size={16} className="mr-1 inline" aria-hidden="true" />
                    )}
                    {isSubmitting ? 'Kaydediliyor...' : 'Kaydı oluştur'}
                  </button>
                </div>
              </form>
            ),
          },
        ]}
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-[rgba(66,133,244,0.1)] bg-white/80 p-8 text-center text-sm text-gray-400">
          Yükleniyor…
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          Seçili filtrelerde kayıt bulunamadı.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry) => {
            const rowIsEditing = editingId === entry.id
            const state = rowIsEditing ? editingState : null

            return (
              <div
                key={entry.id}
                className="space-y-4 rounded-2xl border border-[rgba(66,133,244,0.1)] bg-white p-4 shadow-[0_10px_20px_rgba(60,64,67,0.04)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-primary-200 bg-primary-50 px-2.5 py-1 font-semibold text-primary-700">
                        {entry.department}
                      </span>
                      <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 font-semibold text-gray-600">
                        {entry.recordKind}
                      </span>
                      <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-gray-500">
                        {entry.addedBy}
                      </span>
                    </div>
                    {!rowIsEditing && (
                      <>
                        <h3 className="text-base font-semibold text-gray-900">{entry.title}</h3>
                        {entry.description && (
                          <p className="max-w-3xl text-sm text-gray-600">{entry.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                          <span>Kaynak klasör: {entry.sourceFolder}</span>
                          {entry.sourceSubfolder ? <span>Alt klasör: {entry.sourceSubfolder}</span> : null}
                          <span>Tarih: {formatSnapshotDate(entry.sourceSnapshotDate)}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {rowIsEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => void handleUpdate(entry)}
                          disabled={isSubmitting}
                          className={`${BTN_CLS} border border-green-200 bg-green-50 text-green-700 hover:bg-green-100`}
                        >
                          <Save size={14} aria-hidden="true" />
                          Kaydet
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          disabled={isSubmitting}
                          className={`${BTN_CLS} border border-gray-200 text-gray-500 hover:text-gray-700`}
                        >
                          <X size={14} aria-hidden="true" />
                          İptal
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEdit(entry)}
                        disabled={isSubmitting || isEditing}
                        className={`${BTN_CLS} border border-gray-200 text-gray-500 hover:text-gray-700`}
                      >
                        <Pencil size={14} aria-hidden="true" />
                        Düzenle
                      </button>
                    )}

                    {entry.storageBucket && entry.storagePath ? (
                      <>
                        <button
                          type="button"
                          onClick={() => void handleOpenStoredFile(entry, false)}
                          className={`${BTN_CLS} border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100`}
                        >
                          <Eye size={14} aria-hidden="true" />
                          Görüntüle
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleOpenStoredFile(entry, true)}
                          className={`${BTN_CLS} border border-green-200 bg-green-50 text-green-700 hover:bg-green-100`}
                        >
                          <Download size={14} aria-hidden="true" />
                          İndir
                        </button>
                      </>
                    ) : entry.url ? (
                      <a
                        href={safeHref(entry.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${BTN_CLS} border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100`}
                      >
                        <ExternalLink size={14} aria-hidden="true" />
                        URL
                      </a>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => void handleDelete(entry)}
                      disabled={isSubmitting}
                      className={`${BTN_CLS} border border-red-200 bg-red-50 text-red-600 hover:bg-red-100`}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                      Sil
                    </button>
                  </div>
                </div>

                {rowIsEditing && state ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {renderFormFields(state, 'edit')}
                    {entry.storageBucket && entry.fileName && (
                      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-500 sm:col-span-2 lg:col-span-3">
                        Dosya değişimi bu sürümde kapalı. Mevcut dosya: {entry.fileName}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-3 text-sm text-gray-600 md:grid-cols-2 xl:grid-cols-3">
                    {entry.fileName && (
                      <div className="rounded-xl bg-gray-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Dosya</p>
                        <p className="mt-1">{entry.fileName}</p>
                      </div>
                    )}

                    <div className="rounded-xl bg-gray-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Kaynak</p>
                      <p className="mt-1">{entry.sourceFolder}</p>
                      <p className="text-xs text-gray-500">{entry.sourceSubfolder ?? 'Alt klasör yok'}</p>
                    </div>

                    <div className="rounded-xl bg-gray-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Import</p>
                      <p className="mt-1">{formatSnapshotDate(entry.sourceSnapshotDate)}</p>
                      <p className="text-xs text-gray-500">{entry.importBatch}</p>
                    </div>

                    {entry.recordKind === 'CV' && (
                      <>
                        <div className="rounded-xl bg-gray-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Aday</p>
                          <p className="mt-1">
                            {entry.personFirstName ?? '—'} {entry.personLastName ?? ''}
                          </p>
                          <p className="text-xs text-gray-500">{entry.personRole ?? 'Rol yok'}</p>
                        </div>
                        <div className="rounded-xl bg-gray-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Sosyal Linkler</p>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {entry.linkedinUrl && (
                              <a href={safeHref(entry.linkedinUrl)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700">
                                LinkedIn <ExternalLink size={12} aria-hidden="true" />
                              </a>
                            )}
                            {entry.instagramUrl && (
                              <a href={safeHref(entry.instagramUrl)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700">
                                Instagram <ExternalLink size={12} aria-hidden="true" />
                              </a>
                            )}
                            {entry.websiteUrl && (
                              <a href={safeHref(entry.websiteUrl)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700">
                                Website <ExternalLink size={12} aria-hidden="true" />
                              </a>
                            )}
                            {!entry.linkedinUrl && !entry.instagramUrl && !entry.websiteUrl && <span>—</span>}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
