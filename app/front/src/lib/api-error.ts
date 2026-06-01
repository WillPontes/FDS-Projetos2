import { HTTPError } from "ky"

export const INTERNAL_ERROR_MESSAGE = "Erro interno. Tente novamente."

type FastApiValidationItem = {
  msg?: string
  message?: string
}

type FastApiErrorBody = {
  detail?: string | FastApiValidationItem[]
  message?: string
}

export type ApiHTTPError = HTTPError & { apiDetail?: string }

/** Normalizes FastAPI error JSON into a single detail string. */
export function parseFastApiErrorBody(body: FastApiErrorBody): string | undefined {
  if (body.message?.trim()) {
    return body.message.trim()
  }

  const { detail } = body
  if (typeof detail === "string" && detail.trim()) {
    return detail.trim()
  }

  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0]
    const msg = first?.msg ?? first?.message
    if (typeof msg === "string" && msg.trim()) {
      return msg.trim()
    }
  }

  return undefined
}

function isTechnicalMessage(message: string): boolean {
  const lower = message.toLowerCase()
  return (
    lower.startsWith("request failed") ||
    lower.startsWith("http error") ||
    lower.includes("status code") ||
    lower.startsWith("erro 4") ||
    lower.startsWith("erro 5") ||
    /^failed to fetch/i.test(message)
  )
}

function isInternalLeakMessage(message: string): boolean {
  const lower = message.toLowerCase()
  return (
    lower.includes("jwt_secret") ||
    lower.includes("traceback") ||
    lower.startsWith("erro interno:") ||
    lower.includes("validation error for")
  )
}

function isUserFacingDetail(detail: string): boolean {
  if (!detail.trim()) return false
  if (isTechnicalMessage(detail)) return false
  if (isInternalLeakMessage(detail)) return false
  return true
}

/** Legacy EN→PT map for responses not yet migrated. */
const LEGACY_DETAIL_MAP: Record<string, string> = {
  "license plate already exists": "Já existe um veículo com esta placa.",
  "tag already exists": "Já existe um veículo com esta tag.",
  "vehicle not found": "Veículo não encontrado.",
  "fleet not found": "Frota não encontrada.",
  "goal not found": "Meta não encontrada.",
  "current weekly goal not found": "Meta semanal atual não encontrada.",
  "transaction not found": "Transação não encontrada.",
  "fuel prices not found.": "Preços de combustível não encontrados.",
  "user stats not found": "Estatísticas do usuário não encontradas.",
}

function mapLegacyDetail(detail: string): string | undefined {
  const mapped = LEGACY_DETAIL_MAP[detail.trim().toLowerCase()]
  return mapped
}

export function extractApiDetail(error: unknown): string | undefined {
  if (error instanceof HTTPError) {
    const withDetail = error as ApiHTTPError
    if (withDetail.apiDetail?.trim()) {
      return withDetail.apiDetail.trim()
    }
    const msg = error.message?.trim()
    if (msg && !isTechnicalMessage(msg)) {
      return msg
    }
  }

  if (error instanceof Error) {
    const msg = error.message?.trim()
    if (msg && !isTechnicalMessage(msg)) {
      return msg
    }
  }

  return undefined
}

export function getHttpStatus(error: unknown): number | undefined {
  if (error instanceof HTTPError) {
    return error.response.status
  }
  return undefined
}

export type ToastErrorOptions = {
  fallback: string
}

export function getToastErrorMessage(
  error: unknown,
  options: ToastErrorOptions,
): string {
  const status = getHttpStatus(error)

  if (status != null && status >= 500) {
    return INTERNAL_ERROR_MESSAGE
  }

  const detail = extractApiDetail(error)
  if (detail) {
    const legacy = mapLegacyDetail(detail)
    if (legacy) {
      return legacy
    }
    if (isUserFacingDetail(detail)) {
      return detail.trim()
    }
  }

  if (
    error instanceof TypeError &&
    error.message.toLowerCase().includes("fetch")
  ) {
    return INTERNAL_ERROR_MESSAGE
  }

  return options.fallback
}

/** @deprecated Use getToastErrorMessage for UI; kept for dev/logging. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof HTTPError) {
    const detail = extractApiDetail(error)
    if (detail) {
      return detail
    }
    return `Erro ${error.response.status}: ${error.response.statusText}`
  }
  if (error instanceof Error) {
    return error.message
  }
  return "Ocorreu um erro inesperado"
}
