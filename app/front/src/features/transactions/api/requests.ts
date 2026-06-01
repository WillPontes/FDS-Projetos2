import { api } from "@/lib/http-client";
import type { GetTransactionsParams, GetTransactionsResponse } from "./types";

export async function getTransactions(
  params: GetTransactionsParams = {},
): Promise<GetTransactionsResponse> {
  return api
    .get("/api/transactions/", {
      searchParams: {
        paginate: "true",
        page: params.page ?? 1,
        page_size: params.pageSize ?? 10,
        ...(params.organizationId != null && {
          organization_id: params.organizationId,
        }),
        ...(params.plate && { plate: params.plate }),
        ...(params.context && { context: params.context }),
        ...(params.uf && { uf: params.uf }),
        ...(params.fromDate && { from_date: params.fromDate }),
        ...(params.toDate && { to_date: params.toDate }),
      },
    })
    .json<GetTransactionsResponse>();
}
