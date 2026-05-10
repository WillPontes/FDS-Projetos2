import { useQuery } from "@tanstack/react-query"
import { userQueryKeys } from "../../api/query-keys"
import { getUsersList } from "../../api/requests"
import type { ListUsersParams, ListUsersResponse } from "../../api/types"

export type { ListUsersParams, ListUsersResponse } from "../../api/types"

export const useGetUsers = (params?: ListUsersParams) => {
  return useQuery<ListUsersResponse, Error>({
    queryKey: userQueryKeys.list(params),
    queryFn: () => getUsersList(params),
  })
}
