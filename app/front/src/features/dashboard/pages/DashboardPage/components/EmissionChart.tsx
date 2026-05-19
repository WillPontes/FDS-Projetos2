import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  {
    tipo: "Sem Taggy",
    emissao: 90,
  },
  {
    tipo: "Com Taggy",
    emissao: 45,
  },
]

export const EmissionChart = () => {
    return (
    <div className="h-[300px] w-full rounded-2xl border bg-white p-4">
      <h2 className="mb-4 text-xl font-semibold">
        Emissão de CO₂
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="tipo" />
          <YAxis />
          <Tooltip />

          <Bar
            dataKey="emissao"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}