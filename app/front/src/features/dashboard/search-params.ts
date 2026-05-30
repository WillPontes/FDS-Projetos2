import {
  parseAsIsoDate,
  parseAsStringEnum,
} from "nuqs";

import { FUEL_TYPE_OPTIONS } from "./constants";

const fuelTypeValues = FUEL_TYPE_OPTIONS.map((option) => option.value);

export const dashboardSearchParams = {
  fuel: parseAsStringEnum(fuelTypeValues),
  from: parseAsIsoDate,
  to: parseAsIsoDate,
};
