import { EmissionChart } from "../../components/EmissionChart"

const transactionData = {
  co2: "{transactionData.co2}  kg",
  fuel: "{transactionData.fuel} L",
  vehicle: "{transactionData.vehicle}",
}
export const DashboardPage = () => {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">
        Impacto ambiental da transação
      </h1>

      <p className="mt-4 text-gray-500">
        Resultados ambientais após processamento da transação
      </p>

      <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold">
            CO₂ evitado
          </h2>

          <p className="mt-2 text-3xl font-bold">
            48kg
          </p>

          <span className="text-sm text-green-600">
            redução ambiental
          </span>
        </div>

        <div className="rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold">
            Combustível economizado
          </h2>

          <p className="mt-2 text-3xl font-bold">
            32L
          </p>

          <span className="text-sm text-blue-600">
            combustível poupado
          </span>
        </div>

        <div className="rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold">
            Tipo do veículo
          </h2>

          <p className="mt-2 text-3xl font-bold">
            Caminhão
          </p>

          <span className="text-sm text-gray-500">
            veículo processado
          </span>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-6 text-2xl font-semibold">
          Comparativo de emissão
        </h2>

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">
                  Cenário
                </th>

                <th className="p-4 text-left">
                  Emissão CO₂
                </th>

                <th className="p-4 text-left">
                  Combustível
                </th>

                <th className="p-4 text-left">
                  Eficiência
                </th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-t">
                <td className="p-4 font-medium">
                  Sem Taggy
                </td>

                <td className="p-4 text-red-500">
                  Alta
                </td>

                <td className="p-4">
                  52L
                </td>

                <td className="p-4">
                  Baixa
                </td>
              </tr>

              <tr className="border-t">
                <td className="p-4 font-medium">
                  Com Taggy
                </td>

                <td className="p-4 text-green-600">
                  Reduzida
                </td>

                <td className="p-4">
                  32L
                </td>

                <td className="p-4">
                  Alta
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <EmissionChart />
      </section>
    </main>
  )
}