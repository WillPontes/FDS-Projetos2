export const DashboardPage = () => {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">
        Dashboard Comparativo
      </h1>

      <p className="mt-4 text-gray-500">
        Comparação entre veículos elétricos e combustão
      </p>

      <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold">
            Emissão de CO₂
          </h2>

          <p className="mt-2 text-3xl font-bold">
            72%
          </p>

          <span className="text-sm text-green-600">
            redução média
          </span>
        </div>

        <div className="rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold">
            Economia anual
          </h2>

          <p className="mt-2 text-3xl font-bold">
            R$ 8.400
          </p>

          <span className="text-sm text-blue-600">
            por veículo
          </span>
        </div>

        <div className="rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold">
            Sustentabilidade
          </h2>

          <p className="mt-2 text-3xl font-bold">
            Alta
          </p>

          <span className="text-sm text-gray-500">
            impacto positivo
          </span>
        </div>
      </section>
      <section className="mt-10">
  <h2 className="text-2xl font-semibold mb-6">
    Comparação de veículos
  </h2>

  <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
    <table className="w-full">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-4 text-left">Tipo</th>
          <th className="p-4 text-left">CO₂</th>
          <th className="p-4 text-left">Custo anual</th>
          <th className="p-4 text-left">Sustentabilidade</th>
        </tr>
      </thead>

      <tbody>
        <tr className="border-t">
          <td className="p-4 font-medium">
            Elétrico
          </td>

          <td className="p-4 text-green-600">
            Baixo
          </td>

          <td className="p-4">
            R$ 4.000
          </td>

          <td className="p-4">
            Alta
          </td>
        </tr>

        <tr className="border-t">
          <td className="p-4 font-medium">
            Combustão
          </td>

          <td className="p-4 text-red-500">
            Alto
          </td>

          <td className="p-4">
            R$ 12.400
          </td>

          <td className="p-4">
            Baixa
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</section>
    </main>
  )
}