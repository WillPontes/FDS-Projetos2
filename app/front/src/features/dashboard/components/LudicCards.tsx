const ludicMetrics = [
  {
    icon: "🌳",
    value: "2,3",
    label: "árvores preservadas",
  },
  {
    icon: "📱",
    value: "120",
    label: "cargas de celular economizadas",
  },
  {
    icon: "☕",
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
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <div className="text-5xl">
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