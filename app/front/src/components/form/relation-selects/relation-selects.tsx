import { useMemo } from "react";
import {
  ASYNC_ENTITY_PAGE_SIZE,
  AsyncEntitySelect,
} from "@/components/form/AsyncEntitySelect";
import { api } from "@/lib/http-client";
import { normalizePaginatedResponse } from "@/lib/paginated-response";
import type { Fleet, Organization, Vehicle } from "@/features/fleet/api/types";
import type { User } from "@/features/users/api/types";
import { getUsersPaginated } from "@/features/users/api/requests";
import { getVehicles } from "@/features/fleet/api/requests";

type IdRelationSelectProps = {
  value: number | undefined | null;
  onValueChange: (value: number | undefined) => void;
  placeholder?: string;
  emptyLabel?: string;
  disabled?: boolean;
  className?: string;
  allowEmpty?: boolean;
};

async function fetchOrganizationsPage(page: number, search: string) {
  const res = await api
    .get("/api/organizations", {
      searchParams: {
        page,
        page_size: ASYNC_ENTITY_PAGE_SIZE,
        ...(search ? { search } : {}),
        paginate: "true",
      },
    })
    .json();
  return normalizePaginatedResponse<Organization>(res);
}

async function fetchFleetsPage(
  page: number,
  search: string,
  organizationId?: number,
) {
  const res = await api
    .get("/api/fleets/", {
      searchParams: {
        page,
        page_size: ASYNC_ENTITY_PAGE_SIZE,
        ...(search ? { search } : {}),
        paginate: "true",
        ...(organizationId != null && { organization_id: organizationId }),
      },
    })
    .json();
  return normalizePaginatedResponse<Fleet>(res);
}

async function fetchVehiclesPage(
  page: number,
  search: string,
  filters?: {
    semFrota?: boolean;
    organizationId?: number;
    fleetId?: number;
  },
) {
  const res = await getVehicles({
    page,
    pageSize: ASYNC_ENTITY_PAGE_SIZE,
    search: search || undefined,
    semFrota: filters?.semFrota,
    organizationId: filters?.organizationId,
    fleetId: filters?.fleetId,
  });
  return normalizePaginatedResponse<Vehicle>(res);
}

const getOrgValue = (org: Organization) => org.id;
const getOrgLabel = (org: Organization) => org.name || `#${org.id}`;
const getFleetValue = (fleet: Fleet) => fleet.id;
const getFleetLabel = (fleet: Fleet) =>
  fleet.name ? `#${fleet.id} · ${fleet.name}` : `#${fleet.id}`;
const getVehicleValue = (vehicle: Vehicle) => vehicle.id;
const getVehicleLabel = (vehicle: Vehicle) =>
  vehicle.license_plate
    ? `${vehicle.license_plate} (TAG ${vehicle.id_tag})`
    : `#${vehicle.id}`;
const getUserValue = (user: User) => user.id;
const getUserLabel = (user: User) =>
  user.name ? `#${user.id} · ${user.name}` : `#${user.id}`;

export function OrganizationsRelationSelect({
  value,
  onValueChange,
  placeholder = "Selecione a organização",
  emptyLabel = "Sem organização",
  disabled,
  className,
  allowEmpty = true,
}: IdRelationSelectProps) {
  return (
    <AsyncEntitySelect<Organization>
      mode="single"
      value={
        value != null
          ? ({ id: value, name: "", cnpj: null } as Organization)
          : null
      }
      onChange={(item) =>
        onValueChange(item ? (item as Organization).id : undefined)
      }
      queryKey={["organizations", "relation-select"]}
      fetchPage={fetchOrganizationsPage}
      getOptionValue={getOrgValue}
      getOptionLabel={getOrgLabel}
      placeholder={placeholder}
      emptyLabel={emptyLabel}
      disabled={disabled}
      className={className}
      allowEmpty={allowEmpty}
    />
  );
}

type FleetsRelationSelectProps = IdRelationSelectProps & {
  organizationId?: number;
  noneLabel?: string;
};

export function FleetsRelationSelect({
  value,
  onValueChange,
  organizationId,
  placeholder = "Selecione uma frota",
  noneLabel = "Sem frota",
  disabled,
  className,
  allowEmpty = true,
}: FleetsRelationSelectProps) {
  return (
    <AsyncEntitySelect<Fleet>
      mode="single"
      value={
        value != null
          ? ({ id: value, name: "", organization_id: organizationId ?? 0 } as Fleet)
          : null
      }
      onChange={(item) =>
        onValueChange(item ? (item as Fleet).id : undefined)
      }
      queryKey={["fleets", "relation-select", organizationId]}
      fetchPage={(page, search) => fetchFleetsPage(page, search, organizationId)}
      getOptionValue={getFleetValue}
      getOptionLabel={getFleetLabel}
      placeholder={placeholder}
      emptyLabel={noneLabel}
      disabled={disabled}
      className={className}
      allowEmpty={allowEmpty}
    />
  );
}

type VehiclesRelationSelectProps = {
  mode?: "single" | "multiple";
  value: number | number[] | undefined | null;
  onValueChange: (value: number | number[] | undefined) => void;
  placeholder?: string;
  emptyLabel?: string;
  disabled?: boolean;
  className?: string;
  allowEmpty?: boolean;
  semFrota?: boolean;
  organizationId?: number;
  fleetId?: number;
  excludeIds?: number[];
};

export function VehiclesRelationSelect({
  mode = "single",
  value,
  onValueChange,
  placeholder = "Selecione um veículo",
  emptyLabel = "Sem veículo",
  disabled,
  className,
  allowEmpty = true,
  semFrota,
  organizationId,
  fleetId,
  excludeIds,
}: VehiclesRelationSelectProps) {
  const filterKey = useMemo(
    () => [semFrota, organizationId, fleetId] as const,
    [semFrota, organizationId, fleetId],
  );

  if (mode === "multiple") {
    const selectedIds = Array.isArray(value) ? value : [];
    return (
      <AsyncEntitySelect<Vehicle>
        mode="multiple"
        value={
          selectedIds.map(
            (id) =>
              ({
                id,
                license_plate: "",
                id_tag: "",
                model: "",
                fuel_type: "gasolina_c",
              }) as Vehicle,
          )
        }
        onChange={(items) => {
          const ids = (items as Vehicle[]).map((item) => item.id);
          onValueChange(ids);
        }}
        queryKey={["vehicles", "relation-select", "multiple", ...filterKey]}
        fetchPage={(page, search) =>
          fetchVehiclesPage(page, search, {
            semFrota,
            organizationId,
            fleetId,
          })
        }
        getOptionValue={getVehicleValue}
        getOptionLabel={getVehicleLabel}
        renderOption={(vehicle) => getVehicleLabel(vehicle)}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        allowEmpty={allowEmpty}
        excludeIds={excludeIds}
        multipleSummary={(count) => `${count} veículo${count === 1 ? "" : "s"} selecionado${count === 1 ? "" : "s"}`}
      />
    );
  }

  return (
    <AsyncEntitySelect<Vehicle>
      mode="single"
      value={
        value != null && !Array.isArray(value)
          ? ({
              id: value,
              license_plate: "",
              id_tag: "",
              model: "",
              fuel_type: "gasolina_c",
            } as Vehicle)
          : null
      }
      onChange={(item) =>
        onValueChange(item ? (item as Vehicle).id : undefined)
      }
      queryKey={["vehicles", "relation-select", "single", ...filterKey]}
      fetchPage={(page, search) =>
        fetchVehiclesPage(page, search, {
          semFrota,
          organizationId,
          fleetId,
        })
      }
      getOptionValue={getVehicleValue}
      getOptionLabel={getVehicleLabel}
      renderOption={(vehicle) => getVehicleLabel(vehicle)}
      placeholder={placeholder}
      emptyLabel={emptyLabel}
      disabled={disabled}
      className={className}
      allowEmpty={allowEmpty}
      excludeIds={excludeIds}
    />
  );
}

type UsersRelationSelectProps = IdRelationSelectProps & {
  role?: User["role"];
  organizationId?: number;
  linkableToOrganizationId?: number;
  excludeIds?: number[];
};

export function UsersRelationSelect({
  value,
  onValueChange,
  role,
  organizationId,
  linkableToOrganizationId,
  excludeIds,
  placeholder = "Selecione um usuário",
  emptyLabel,
  disabled,
  className,
  allowEmpty = false,
}: UsersRelationSelectProps) {
  return (
    <AsyncEntitySelect<User>
      mode="single"
      value={
        value != null
          ? ({
              id: value,
              name: "",
              email: "",
              role: role ?? "motorista",
              organization_id: organizationId ?? null,
            } as User)
          : null
      }
      onChange={(item) =>
        onValueChange(item ? (item as User).id : undefined)
      }
      queryKey={[
        "users",
        "relation-select",
        role,
        organizationId,
        linkableToOrganizationId,
      ]}
      fetchPage={(page, search) =>
        getUsersPaginated({
          page,
          pageSize: ASYNC_ENTITY_PAGE_SIZE,
          search: search || undefined,
          role,
          organization_id: organizationId,
          linkable_to_organization_id: linkableToOrganizationId,
        })
      }
      getOptionValue={getUserValue}
      getOptionLabel={getUserLabel}
      renderOption={(user) => (
        <span>
          #{user.id} · {user.name}
          {user.email ? (
            <span className="text-neutral-500"> · {user.email}</span>
          ) : null}
        </span>
      )}
      placeholder={placeholder}
      emptyLabel={emptyLabel}
      disabled={disabled}
      className={className}
      allowEmpty={allowEmpty}
      excludeIds={excludeIds}
    />
  );
}

// Keep backward-compatible exports
export const OrganizationsCombobox = OrganizationsRelationSelect;
export const FleetsCombobox = FleetsRelationSelect;
