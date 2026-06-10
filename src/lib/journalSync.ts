/** Dispatched after journal rows change in offline DB (create/update/delete). Same-tab listeners refresh UI. */
export const JOURNAL_DATA_CHANGED_EVENT = 'ca-journal-data-changed';

export function emitJournalDataChanged(companyId: string): void {
  if (typeof window === 'undefined' || !companyId) return;
  window.dispatchEvent(
    new CustomEvent(JOURNAL_DATA_CHANGED_EVENT, { detail: { companyId } }),
  );
}
