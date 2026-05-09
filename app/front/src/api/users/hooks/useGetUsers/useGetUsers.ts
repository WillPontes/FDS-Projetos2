import { useQuery } from "@tanstack/react-query"
import { userQueryKeys } from "../../query-keys"
import { getUsersList } from "../../requests"
import type { ListUsersParams, ListUsersResponse } from "../../types"

export type { ListUsersParams, ListUsersResponse } from "../../types"

export const useGetUsers = (params?: ListUsersParams) => {
  return useQuery<ListUsersResponse, Error>({
    queryKey: userQueryKeys.list(params),
    queryFn: () => getUsersList(params),
  })
}
