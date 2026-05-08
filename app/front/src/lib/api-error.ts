import { HTTPError } from "ky"

export function getErrorMessage(error: unknown): string {
  if (error instanceof HTTPError) {
    return error.message || `Erro ${error.response.status}: ${error.response.statusText}`
  }
  if (error instanceof Error) {
    return error.message
  }
  return "Ocorreu um erro inesperado"
}
