export type Transaction = {
  id: number;
  user_id: number | null;
  vehicle_id: number | null;
  organization_id: number | null;
  plate: string | null;
  context: string;
  uf: string | null;
  elapsed_time_sec: number | null;
  is_digital: boolean;
  co2_avoided_kg: number | null;
  fuel_saved_liters: number | null;
  time_saved_sec: number | null;
  financial_savings_brl: number | null;
  water_saved_liters: number | null;
  parameters_snapshot: Record<string, unknown>;
  created_at: string;
};

export type GetTransactionsParams = {
  page?: number;
  pageSize?: number;
  organizationId?: number;
  plate?: string;
  context?: string;
  uf?: string;
  fromDate?: string;
  toDate?: string;
};

export type GetTransactionsResponse = {
  items: Transaction[];
  total: number;
};
