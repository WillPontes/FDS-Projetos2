import type { RawVehicle } from "../api/raw-vehicles";
import type { User, UserWithVehicle } from "../api/types";

export function joinUsersWithVehicles(
  users: User[],
  vehicles: RawVehicle[],
): UserWithVehicle[] {
  const vehicleByDriverId = new Map<number, RawVehicle>();

  for (const vehicle of vehicles) {
    if (vehicle.assigned_driver_id != null) {
      vehicleByDriverId.set(vehicle.assigned_driver_id, vehicle);
    }
  }

  return users.map((user) => {
    const vehicle = vehicleByDriverId.get(user.id);
    if (!vehicle) {
      return user;
    }

    const isFleetLinked = vehicle.organization_id != null;

    return {
      ...user,
      plate: vehicle.license_plate,
      vehicleId: vehicle.id,
      vehicleTag: vehicle.id_tag,
      isFleetLinked,
      fleetOrganizationId: isFleetLinked ? vehicle.organization_id : null,
    };
  });
}

export function findVehicleForUser(
  userId: number,
  vehicles: RawVehicle[],
): RawVehicle | undefined {
  return vehicles.find((vehicle) => vehicle.assigned_driver_id === userId);
}
