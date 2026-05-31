import { useMemo } from "react";
import { useGetUsers } from "../useGetUsers";
import {
  filterBySearch,
  paginateItems,
  sortItems,
} from "@/lib/list-utils";
import type { User, UserRole } from "../../api/types";

type UseGetUsersFilteredParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: UserRole | "all";
  organizationId?: number | "all";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export const useGetUsersFiltered = ({
  page = 1,
  pageSize = 10,
  search,
  role = "all",
  organizationId,
  sortBy,
  sortOrder = "asc",
}: UseGetUsersFilteredParams = {}) => {
  const query = useGetUsers();

  const data = useMemo(() => {
    if (!query.data) return undefined;

    let items = query.data;

    if (role !== "all") {
      items = items.filter((user) => user.role === role);
    }

    if (organizationId != null && organizationId !== "all") {
      items = items.filter((user) => user.organization_id === organizationId);
    }

    items = filterBySearch(items, search, (user) => [user.name, user.email]);

    items = sortItems(items, sortBy, sortOrder, (user, key) => {
      const record = user as User & Record<string, unknown>;
      const value = record[key];
      if (typeof value === "string" || typeof value === "number") return value;
      return "";
    });

    return paginateItems(items, page, pageSize);
  }, [query.data, search, role, organizationId, sortBy, sortOrder, page, pageSize]);

  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
