// @ts-nocheck — legacy mock store for settings/routing only
import type { VehicleFormData } from "@/features/fleet/schemas/vehicle-schema";
import type { GetVehiclesParams } from "@/features/fleet/api/types";
import type {
  FuelPriceByUF,
  TechnicalSpecs,
} from "@/features/settings/api/requests";
import type { RawVehicle } from "@/features/users/api/raw-vehicles";
import type { UpdateUserPayload, User } from "@/features/users/api/types";
import {
  filterBySearch,
  paginateItems,
  sortItems,
} from "@/lib/list-utils";
import { MOCK_FLEET_VEHICLES, type MockFleetVehicle } from "./fleet";
import { MOCK_RAW_VEHICLES } from "./raw-vehicles";
import { MOCK_FUEL_PRICES, MOCK_TECHNICAL_SPECS } from "./settings";
import { MOCK_USERS } from "./users";

function clone<T>(value: T): T {
  return structuredClone(value);
}

class MockStore {
  private users: User[] = clone(MOCK_USERS);
  private fleetVehicles: MockFleetVehicle[] = clone(MOCK_FLEET_VEHICLES);
  private rawVehicles: RawVehicle[] = clone(MOCK_RAW_VEHICLES);
  private technicalSpecs: TechnicalSpecs = clone(MOCK_TECHNICAL_SPECS);
  private fuelPrices: Record<string, FuelPriceByUF> = clone(MOCK_FUEL_PRICES);
  private nextFleetId = MOCK_FLEET_VEHICLES.length + 1;

  getUsers(): User[] {
    return clone(this.users);
  }

  getUserById(id: number): User | undefined {
    return clone(this.users.find((user) => user.id === id));
  }

  updateUser(id: number, payload: UpdateUserPayload): User {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new Error("Usuário não encontrado.");
    }
    this.users[index] = { ...this.users[index], ...payload };
    return clone(this.users[index]);
  }

  deleteUser(id: number): void {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new Error("Usuário não encontrado.");
    }
    this.users.splice(index, 1);
  }

  getRawVehicles(): RawVehicle[] {
    return clone(this.rawVehicles);
  }

  getFleetVehicles(params: GetVehiclesParams = {}): {
    items: MockFleetVehicle[];
    total: number;
  } {
    const {
      page = 1,
      pageSize = 10,
      sortBy,
      sortOrder = "asc",
      search,
      fuelType,
      region,
      dateFrom,
      dateTo,
    } = params;

    let items = [...this.fleetVehicles];

    if (fuelType) {
      items = items.filter(
        (vehicle) =>
          vehicle.fuelType === fuelType || vehicle.fuel_type === fuelType,
      );
    }

    if (region) {
      items = items.filter((vehicle) => vehicle.region === region);
    }

    if (dateFrom) {
      items = items.filter(
        (vehicle) =>
          vehicle.installation_date != null &&
          vehicle.installation_date >= dateFrom,
      );
    }

    if (dateTo) {
      items = items.filter(
        (vehicle) =>
          vehicle.installation_date != null &&
          vehicle.installation_date <= dateTo,
      );
    }

    items = filterBySearch(items, search, (vehicle) => [
      String(vehicle.id),
      vehicle.plate,
      vehicle.model,
      vehicle.fuelType,
      vehicle.fuel_type ?? "",
    ]);

    items = sortItems(items, sortBy, sortOrder, (vehicle, key) => {
      const value = vehicle[key as keyof MockFleetVehicle];
      if (typeof value === "number" || typeof value === "string") {
        return value;
      }
      return "";
    });

    const paginated = paginateItems(items, page, pageSize);
    return { items: clone(paginated.items), total: paginated.total };
  }

  getFleetVehicle(id: number): MockFleetVehicle {
    const vehicle = this.fleetVehicles.find((item) => item.id === id);
    if (!vehicle) {
      throw new Error("Veículo não encontrado.");
    }
    return clone(vehicle);
  }

  createFleetVehicle(data: VehicleFormData): MockFleetVehicle {
    const vehicle: MockFleetVehicle = {
      id: this.nextFleetId++,
      ...data,
      fuel_type: data.fuelType,
      installation_date: new Date().toISOString().slice(0, 10),
      region: "SP",
    };
    this.fleetVehicles.push(vehicle);
    return clone(vehicle);
  }

  updateFleetVehicle(
    id: number,
    data: Partial<VehicleFormData>,
  ): MockFleetVehicle {
    const index = this.fleetVehicles.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Veículo não encontrado.");
    }
    const updated: MockFleetVehicle = {
      ...this.fleetVehicles[index],
      ...data,
      fuel_type: data.fuelType ?? this.fleetVehicles[index].fuel_type,
    };
    this.fleetVehicles[index] = updated;
    return clone(updated);
  }

  getTechnicalSpecsBundle(): {
    specs: TechnicalSpecs;
    fuel_prices_by_uf: Record<string, FuelPriceByUF>;
  } {
    return {
      specs: clone(this.technicalSpecs),
      fuel_prices_by_uf: clone(this.fuelPrices),
    };
  }

  updateTechnicalSpecs(payload: Partial<TechnicalSpecs>): TechnicalSpecs {
    this.technicalSpecs = { ...this.technicalSpecs, ...payload };
    return clone(this.technicalSpecs);
  }

  getFuelPrices(): Record<string, FuelPriceByUF> {
    return clone(this.fuelPrices);
  }

  syncFuelPrices(): Record<string, FuelPriceByUF> {
    const now = new Date().toISOString();
    for (const uf of Object.keys(this.fuelPrices)) {
      this.fuelPrices[uf] = { ...this.fuelPrices[uf], updated_at: now };
    }
    return clone(this.fuelPrices);
  }

  updateFuelPrice(uf: string, payload: Partial<FuelPriceByUF>): FuelPriceByUF {
    const existing = this.fuelPrices[uf];
    if (!existing) {
      throw new Error(`UF ${uf} não encontrada.`);
    }
    this.fuelPrices[uf] = { ...existing, ...payload, uf };
    return clone(this.fuelPrices[uf]);
  }
}

export const mockStore = new MockStore();
