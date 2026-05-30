import { MapboxMap } from "@/components/map";

export const RegionalEmissionsMap = () => {
  return (
    <div className="flex min-h-[320px] flex-col gap-4 rounded border border-neutral-300 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
        Emissões & Eficiência por Região
      </p>

      <MapboxMap className="min-h-[280px] flex-1 rounded-md" />
    </div>
  );
};
