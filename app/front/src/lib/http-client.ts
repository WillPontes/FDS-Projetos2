import ky, { isHTTPError } from "ky";
import { useAuthStore } from "@/features/auth/auth-store";

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
      async (state) => {
        const { error } = state;
        if (isHTTPError(error)) {
          try {
            const body = (await error.response.clone().json()) as {
              message?: string;
            };
            if (body.message) {
              error.message = body.message;
            }
          } catch {
            // response body wasn't JSON — keep default message
          }
        }
        return error;
      },
    ],
  },
});
