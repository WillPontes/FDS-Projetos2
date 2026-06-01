import ky, { isHTTPError } from "ky";
import { useAuthStore } from "@/features/auth/auth-store";
import { parseFastApiErrorBody, type ApiHTTPError } from "./api-error";

const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export const api = ky.create({
  prefix: apiBaseUrl,
  timeout: false,
  retry: 1,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const userId = useAuthStore.getState().user?.id;
        if (userId != null) {
          request.headers.set("X-User-Id", String(userId));
        }
      },
    ],
    beforeError: [
      ({ error }) => {
        if (
          isHTTPError(error) &&
          error.data != null &&
          typeof error.data === "object"
        ) {
          const detail = parseFastApiErrorBody(
            error.data as Parameters<typeof parseFastApiErrorBody>[0],
          );
          if (detail) {
            const apiError = error as ApiHTTPError;
            apiError.apiDetail = detail;
            error.message = detail;
          }
        }
        return error;
      },
    ],
  },
});
