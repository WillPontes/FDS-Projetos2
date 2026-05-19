import { EmissionChart } from "./components/EmissionChart";
import { LudicCards } from "./components/LudicCards";
import { Leaf, Truck, Fuel } from "lucide-react"

const transactionData = {
  co2: "{transactionData.co2}  kg",
  fuel: "{transactionData.fuel} L",
  vehicle: "{transactionData.vehicle}",
};

export const DashboardPage = () => {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">
        Impacto ambiental da transação
      </h1>

      <p className="mt-4 text-gray-500">
        Resultados ambientais após processamento da transação
      </p>

      <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-green-100 px-5 py-3 shadow-sm">
  <div className="text-3xl">
    🌱
  </div>

  <div>
    <p className="text-sm font-medium text-green-700">
      EcoScore A+
    </p>

    <p className="text-xs text-green-600">
      Excelente eficiência ambiental
    </p>
  </div>
</div>

      <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
          
          <h2 className="text-lg font-semibold">
            CO₂ evitado
          </h2>
        </div>

          <p className="mt-2 text-3xl font-bold">
            48kg
          </p>

          <span className="text-sm text-green-600">
            redução ambiental
          </span>
        </div>

        <div className="rounded-xl border p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Fuel className="h-5 w-5 text-blue-600" />

            <h2 className="text-lg font-semibold">
              Combustível economizado
            </h2>
          </div>

          <p className="mt-2 text-3xl font-bold">
            32L
          </p>

          <span className="text-sm text-blue-600">
            combustível poupado
          </span>
        </div>

        <div className="rounded-xl border p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-gray-600" />

            <h2 className="text-lg font-semibold">
              Tipo de veículo
            </h2>
          </div>

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
                <td className="p-4 font-medium text-red-500">
                  ❌ Sem Taggy
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
                <td className="p-4 font-medium text-green-600">
                  ✅ Com Taggy
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
        <LudicCards />
      </section>

      <section className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              📈 Eficiência sustentável
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Desempenho ambiental da operação analisada
            </p>
          </div>

          <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            +78% eficiente
          </div>
        </div>

        <div className="mt-6 h-5 overflow-hidden rounded-full bg-gray-200">
          <div className="h-full w-[78%] rounded-full bg-green-600 transition-all duration-500" />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
            🌱 Menor emissão
          </span>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
            ⛽ Economia operacional
          </span>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
            🚛 Logística otimizada
          </span>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border bg-green-50 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="text-4xl">
            🌍
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-green-700">
              Resultado da operação
            </h2>

            <p className="text-sm text-green-600">
              Resumo inteligente da análise ambiental
            </p>
          </div>
        </div>

        <p className="mt-6 text-lg leading-8 text-gray-700">
          A utilização da
          <span className="font-bold text-green-700">
            {" "}Taggy
          </span>
          {" "}nesta operação reduziu aproximadamente
          <span className="font-bold text-green-700">
            {" "}38% das emissões de CO₂
          </span>
          {" "}e gerou uma economia estimada de
          <span className="font-bold text-green-700">
            {" "}20 litros de combustível.
          </span>
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            🌱 Sustentabilidade elevada
          </span>

          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            ⛽ Redução de combustível
          </span>

          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
            📊 Operação otimizada
          </span>
        </div>
      </section>
      <footer className="mt-10 border-t pt-6 text-sm text-gray-500">
  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
    <p>
      📅 Última análise realizada hoje às 22:47
    </p>

    <p>
      📊  Dados estimados com base nas métricas operacionais da Taggy
    </p>
  </div>
</footer>
    </main>
  )
}