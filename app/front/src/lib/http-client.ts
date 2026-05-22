import ky, { isHTTPError } from "ky";

export const api = ky.create({
  timeout: false,
  retry: 1,
  hooks: {
    beforeError: [
      async (state) => {
        const { error } = state
        if (isHTTPError(error)) {
          try {
            const body = (await error.response.clone().json()) as { message?: string }
            if (body.message) {
              error.message = body.message
            }
          } catch {
            // response body wasn't JSON — keep default message
          }
        }
        return error
      },
    ],
  },
});
