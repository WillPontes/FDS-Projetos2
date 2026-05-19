import {
  Trees,
  BatteryCharging,
  Coffee,
} from "lucide-react"

const ludicMetrics = [
  {
    icon: (
      <Trees className="h-8 w-8 text-green-600" />
    ),
    value: "2,3",
    label: "árvores preservadas",
  },
  {
    icon: (
      <BatteryCharging className="h-8 w-8 text-blue-600" />
    ),
    value: "120",
    label: "cargas de celular economizadas",
  },
  {
    icon: (
      <Coffee className="h-8 w-8 text-amber-700" />
    ),
    value: "80",
    label: "filtros de café poupados",
  },
]

export const LudicCards = () => {
  return (
    <section className="mt-10">
      <h2 className="mb-6 text-2xl font-semibold">
        Tradução lúdica do impacto
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {ludicMetrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div>
              {metric.icon}
            </div>

            <h3 className="mt-4 text-3xl font-bold">
              {metric.value}
            </h3>

            <p className="mt-2 text-gray-500">
              {metric.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}