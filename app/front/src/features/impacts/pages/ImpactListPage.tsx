import { Link } from "@tanstack/react-router"
import { useEffect } from "react" 
import { Menu, User, Leaf, Droplet, Clock } from "lucide-react"

export const ImpactPage = () => {
  // --- LÓGICA PARA ESCONDER O HEADER GLOBAL SEM MEXER EM OUTROS ARQUIVOS ---
  useEffect(() => {
    // Procuramos o header original do seu projeto usando o tipo correto do TS
    const globalHeader = document.querySelector('header.h-14') as HTMLElement | null;
    
    if (globalHeader) {
      globalHeader.style.display = 'none'; // Esconde o header global cinza
    }

    // Função de limpeza: Quando sair da página, o header antigo reaparece nas outras telas
    return () => {
      if (globalHeader) {
        globalHeader.style.display = 'flex';
      }
    };
  }, []);
  // -----------------------------------------------------------------------

  const items = [
    { id: 1, name: "Praça do Pedágio A25", date: "10/08/2024 às 10:21:03", co2: "240g", water: "150ml", time: "8min" },
    { id: 2, name: "Praça do Pedágio B12", date: "08/08/2024 às 10:21:03", co2: "240g", water: "150ml", time: "8min" },
    { id: 3, name: "Praça do Pedágio A25", date: "06/08/2024 às 10:21:03", co2: "240g", water: "150ml", time: "8min" },
    { id: 4, name: "Praça do Pedágio C04", date: "03/08/2024 às 10:21:03", co2: "240g", water: "150ml", time: "8min" },
    { id: 5, name: "Praça do Pedágio B12", date: "01/08/2024 às 10:21:03", co2: "240g", water: "150ml", time: "8min" },
  ];

  return (
    <div className="absolute inset-0 bg-zinc-50 text-slate-800 font-sans antialiased flex flex-col items-center overflow-hidden">
      
      {/* SEU HEADER CUSTOMIZADO DO TAGGY */}
      <header className="sticky top-0 z-50 bg-white flex items-center justify-between px-6 py-4 border-b border-zinc-100 shrink-0 w-full shadow-sm">
        {/* O botão agora envia perfeitamente o sinal de toggle */}
        <button 
          type="button" 
          onClick={() => {
            window.dispatchEvent(new CustomEvent("toggle-sidebar"));
          }} 
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

      {/* ÁREA DE CONTEÚDO COM SCROLL PRÓPRIO */}
      <main className="w-full flex flex-col items-center flex-1 overflow-y-auto">
        <div className="w-full max-w-4xl p-4 md:p-8 flex flex-col gap-6">
          
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Minhas Passagens
            </h1>
          </div>

          {/* CARD: Resumo Total */}
          <div className="border border-zinc-200 rounded-2xl p-6 bg-white shadow-sm w-full">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-4">
              Resumo Total
            </span>
            <div className="grid grid-cols-3 text-center">
              <div className="flex flex-col gap-1">
                <span className="text-3xl md:text-4xl font-bold text-slate-950">147</span>
                <span className="text-xs font-medium text-zinc-400">Passagens</span>
              </div>
              <div className="flex flex-col gap-1 border-x border-zinc-100">
                <span className="text-3xl md:text-4xl font-bold text-slate-950">342</span>
                <span className="text-xs font-medium text-zinc-400">kg CO₂</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-3xl md:text-4xl font-bold text-slate-950">18</span>
                <span className="text-xs font-medium text-zinc-400">Horas</span>
              </div>
            </div>
          </div>

          {/* CARD: Lista de Passagens */}
          <div className="border border-zinc-200 rounded-2xl p-6 bg-white shadow-sm w-full mb-10">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-4">
              Últimas Passagens
            </span>
            <div className="flex flex-col">
              {items.map((item, index) => (
                <div key={item.id} className={`py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${index !== items.length - 1 ? "border-b border-zinc-100" : ""}`}>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                    <span className="text-xs text-zinc-400 font-medium">{item.date}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-medium text-zinc-500">
                    <div className="flex items-center gap-1 bg-zinc-50 px-2 py-1 rounded border border-zinc-100">
                      <Leaf className="w-3.5 h-3.5 text-[#006437]" />
                      <span>{item.co2}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-zinc-50 px-2 py-1 rounded border border-zinc-100">
                      <Droplet className="w-3.5 h-3.5 text-blue-500" />
                      <span>{item.water}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-zinc-50 px-2 py-1 rounded border border-zinc-100">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};