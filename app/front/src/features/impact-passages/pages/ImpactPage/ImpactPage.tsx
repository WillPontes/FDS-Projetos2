import { useState, useEffect } from "react"
import { Menu, User, Leaf, Droplet, Scroll, Percent } from "lucide-react"
import { cn } from "@/lib/utils"
import { useGetImpactSummary } from "../../hooks/useGetImpactSummary"

type EcoTab = "carbono" | "agua" | "papel"

export const ImpactPage = () => {
  const [activeTab, setActiveTab] = useState<EcoTab>("carbono")
  const { data: summary } = useGetImpactSummary()

  useEffect(() => {
    const globalHeader = document.querySelector('header.h-14') as HTMLElement | null
    if (globalHeader) globalHeader.style.display = 'none'
    return () => {
      if (globalHeader) globalHeader.style.display = 'flex'
    }
  }, [])

  const ecoScoreContent = {
    carbono: {
      title: "15 árvores",
      subtitle: "plantadas e crescendo por 1 ano",
      techValue: "Valor técnico: 342 kg de CO2",
      icon: <Leaf className="w-12 h-12 text-emerald-600" />,
    },
    agua: {
      title: "8.500 litros",
      subtitle: "de água poupados",
      techValue: "Valor técnico: 8.500L de água",
      icon: <Droplet className="w-12 h-12 text-blue-500" />,
    },
    papel: {
      title: "650 metros",
      subtitle: "de papel evitados",
      techValue: "Valor técnico: 650m de papel",
      icon: <Scroll className="w-12 h-12 text-green-700" />,
    },
  }

  return (
    <div className="absolute inset-0 bg-zinc-50 text-slate-800 font-sans antialiased flex flex-col items-center overflow-hidden">
      
      {/* HEADER PERSONALIZADO DO TAGGY */}
      <header className="sticky top-0 z-50 bg-white flex items-center justify-between px-6 py-4 border-b border-zinc-100 shrink-0 w-full shadow-sm">
        <button 
          type="button" 
          onClick={() => window.dispatchEvent(new CustomEvent("toggle-sidebar"))} 
          className="p-1 hover:bg-zinc-100 rounded-md transition-colors"
        >
          <Menu className="w-6 h-6 text-slate-700" />
        </button>
        
        <div className="flex items-center gap-1 font-bold text-2xl tracking-tight text-slate-900">
          <span>Taggy</span>
          <span className="w-3 h-5 bg-[#7CB305] rounded-tr-full rounded-bl-full transform rotate-12 inline-block"></span>
        </div>

        <button type="button" className="p-1 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors">
          <User className="w-5 h-5 text-zinc-500" />
        </button>
      </header>

      {/* CONTEÚDO PRINCIPAL (DASHBOARD ECO) */}
      <main className="w-full flex flex-col items-center flex-1 overflow-y-auto mt-6">
        <div className="w-full max-w-2xl p-4 md:pb-8 flex flex-col gap-6">
          
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Meu Impacto Sustentável</h1>

          {/* Card 1: Dias economizados */}
          <div className="border border-zinc-200 rounded-2xl p-6 bg-white shadow-sm w-full">
            <span className="text-5xl font-black tracking-tight text-slate-900 block mb-1">
              {summary?.totalDaysWithoutLines || 0}
            </span>
            <span className="text-xs font-semibold text-zinc-400">Dias economizados sem filas de pedágio</span>
          </div>

          {/* Card 2: Impacto Lúdico Interativo */}
          <div className="border border-zinc-200 rounded-2xl bg-white shadow-sm w-full flex flex-col overflow-hidden">
            <div className="p-6 pb-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-4">Impacto Lúdico</span>

              <div className="grid grid-cols-3 bg-zinc-100 p-1 rounded-xl text-xs font-semibold text-zinc-500 mb-6">
                {(["carbono", "agua", "papel"] as EcoTab[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "py-2 rounded-lg transition-all capitalize", 
                      activeTab === tab ? "bg-[#7CB305] text-white font-bold shadow-sm" : "hover:text-zinc-900"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex flex-col items-center text-center py-4">
                <div className="w-24 h-24 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center shadow-inner mb-4">
                  {ecoScoreContent[activeTab].icon}
                </div>
                <span className="text-xs text-zinc-400 font-medium mb-1">Você economizou o equivalente a:</span>
                <span className="text-4xl font-black text-slate-900 tracking-tight mb-1">{ecoScoreContent[activeTab].title}</span>
                <span className="text-xs font-semibold text-zinc-500 mb-4">{ecoScoreContent[activeTab].subtitle}</span>
              </div>
            </div>
            <div className="bg-zinc-50/50 border-t border-zinc-100 py-4 px-6 text-center">
              <span className="text-sm font-bold text-[#7CB305]">{ecoScoreContent[activeTab].techValue}</span>
            </div>
          </div>

          {/* Card 3: Meta Semanal com Preenchimento Dinâmico */}
          <div className="border border-zinc-200 rounded-2xl p-6 bg-white shadow-sm w-full mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-800">Meta semanal</span>
              <span className="text-xs font-medium text-zinc-400">x/x passagens</span>
            </div>
            <div className="w-full bg-zinc-100 rounded-full h-5 overflow-hidden p-0.5 border border-zinc-200">
              <div className="bg-emerald-800 h-full rounded-full transition-all duration-500" style={{ width: `${summary?.metaPercentage || 0}%` }} />
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-zinc-500">
              <Percent className="w-3.5 h-3.5" />
              <span>{summary?.metaPercentage || 0}% completo</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}