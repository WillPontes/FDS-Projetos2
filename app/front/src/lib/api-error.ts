import { HTTPError } from "ky"

const INTERNAL_ERROR_MESSAGE = "Erro interno. Tente novamente."

type FastApiValidationItem = {
  msg?: string
  message?: string
}

type FastApiErrorBody = {
  detail?: string | FastApiValidationItem[]
  message?: string
}

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

function normalizeDetailKey(detail: string): string {
  return detail.trim().toLowerCase()
}

const DETAIL_TO_USER_MESSAGE: Record<string, string> = {
  "license plate already exists": "Já existe um veículo com esta placa.",
  "tag already exists": "Já existe um veículo com esta tag.",
  "já existe um usuário com este email.": "Já existe um usuário com este email.",
  "acesso negado.": "Acesso negado.",
  "usuário não encontrado.": "Usuário não encontrado.",
  "organização não encontrada.": "Organização não encontrada.",
  "frota não encontrada.": "Frota não encontrada.",
  "gestor deve vincular veículo à própria org/frota.":
    "Gestor deve vincular veículo à própria organização ou frota.",
  "veículo não encontrado.": "Veículo não encontrado.",
  "veículo não vinculado a esta frota.": "Veículo não vinculado a esta frota.",
  "motorista de org só pode ter um veículo.":
    "Motorista da organização só pode ter um veículo.",
  "apenas motoristas podem ter veículos vinculados.":
    "Apenas motoristas podem ter veículos vinculados.",
  "vehicle not found": "Veículo não encontrado.",
  "fuel prices not found.": "Preços de combustível não encontrados.",
}

const ALLOWLIST_DETAILS = new Set(
  Object.values(DETAIL_TO_USER_MESSAGE).map(normalizeDetailKey),
)

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

export function extractApiDetail(error: unknown): string | undefined {
  if (error instanceof HTTPError) {
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

export function mapApiDetailToUserMessage(
  detail: string,
  _status?: number,
): string | undefined {
  const key = normalizeDetailKey(detail)
  const mapped = DETAIL_TO_USER_MESSAGE[key]
  if (mapped) {
    return mapped
  }

  if (ALLOWLIST_DETAILS.has(key)) {
    return detail.trim()
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
    const mapped = mapApiDetailToUserMessage(detail, status)
    if (mapped) {
      return mapped
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
