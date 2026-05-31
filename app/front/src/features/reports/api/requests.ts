const USER_ID = 1

export type ExportParams = {
  fromDate?: string  // YYYY-MM-DD
  toDate?: string    // YYYY-MM-DD
}

export function buildExportUrl(params: ExportParams = {}): string {
  const url = new URL("/api/reports/export", window.location.origin)
  url.searchParams.set("user_id", String(USER_ID))
  if (params.fromDate) url.searchParams.set("from_date", params.fromDate)
  if (params.toDate) url.searchParams.set("to_date", params.toDate)
  return url.toString()
}
