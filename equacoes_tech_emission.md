

## 🧮 Exemplos Práticos de Cálculo

### Exemplo 1 — Emissão de CO₂ por litro de combustível

**Dado:** Um veículo abasteceu 40 litros de gasolina C.

**Fórmula:**
```
CO₂_fóssil (kg) = Volume (L) × FE_combustível (kgCO₂/L)
```

**Cálculo (fração fóssil apenas):**
- Gasolina C com 27% de etanol anidro → fração fóssil ≈ 73% de gasolina pura
- FE gasolina pura ≈ 2,28 kgCO₂/L
- FE gasolina C (fração fóssil) ≈ 2,28 × 0,73 ≈ **1,66 kgCO₂/L**
- Emissão = 40 L × 1,66 kgCO₂/L = **66,4 kg CO₂**

> 📌 Metodologia de cálculo baseada em: Inventário Nacional 2024 (IEMA), Tabela 4.1.1.1.1.a–c.
---

---
### Exemplo 2 — Emissão de CO₂ por quilômetro percorrido (Bottom-up)

**Dado:** Automóvel flex rodando a gasolina C, autonomia de 13 km/L.

**Fórmula:**
```
E (gCO₂/km) = FE_CO₂ (g/km)                     [direto do ensaio CETESB]
```

ou, usando consumo e autonomia:

```
E (gCO₂/km) = FE_combustível (gCO₂/L) ÷ Autonomia (km/L)
```

**Cálculo:**
- FE gasolina C (fóssil) ≈ 1.660 gCO₂/L (= 1,66 kgCO₂/L)
- Autonomia = 13 km/L
- E = 1.660 ÷ 13 ≈ **127,7 gCO₂/km**

> 📌 **Fonte da autonomia de referência:** CETESB, *Metodologia*, 2024, p. 15–16.  
> 📌 **Fator de emissão por km:** CETESB, Tabela 7 — https://cetesb.sp.gov.br/veicular/tabela-7-fatores-medios-de-emissao-de-veiculos-leves-novos-1/

---
## 🚌 Emissões de CO₂ para Veículos Pesados (Diesel)

Para caminhões e ônibus, os fatores de emissão dos motores são originalmente expressos em **g/kWh** e convertidos para **g/km** usando:

```
(gPoluente/km) = (gPoluente/gDiesel) × (gDiesel/L) ÷ (km/L)
```

Onde:
```
(gPoluente/gDiesel) = (gPoluente/kWh) ÷ (gDiesel/kWh)
```

> 📌 **Fonte:** CETESB, *Metodologia*, 2024, p. 15–16 (Equações 3 e 4).  
> Autonomia de ônibus urbanos: dados da SPTRANS adotados pela CETESB desde 2013.

---
---

### Talvez seja interessante: 

## Exemplo 3 — Emissão total anual de CO₂ de uma frota (método Bottom-up)

**Dado:**
- Frota circulante: 1.000.000 de automóveis
- Intensidade de uso ajustada: 13.500 km/ano
- Fator de emissão CO₂ (gasolina C): 130 gCO₂/km

**Fórmula (Equação 1 da CETESB):**
```
E = Iu × Fe × Fr
E = 13.500 km/ano × 130 gCO₂/km × 1.000.000 veículos
E = 1,755 × 10¹² g CO₂/ano
E = 1.755.000 toneladas CO₂/ano
```

> 📌 **Fonte:** CETESB, *Metodologia*, 2024, p. 14 (Equação 1).

---
## 🚦 Fluxo da Calculadora de Emissão de CO₂

A calculadora recebe **3 entradas**: `distância (km)`, `tipo do veículo` e `combustível`. O combustível define **qual fator de emissão** usar (todos os combustíveis que queimam são contabilizados — inclusive o etanol).

```
            ┌─────────────────────────────┐
            │  ENTRADA                     │
            │  distância · tipo · combust. │
            └──────────────┬──────────────┘
                           │
            ┌──────────────▼───────────────┐
            │  Buscar FE_CO₂ do combustível │
            │  (Tabela 4.1.1.1.1.c, kg/L)   │
            │  gasolina 2,23 · etanol 1,51  │
            │  diesel 2,63 · biodiesel 2,46 │
            └──────────────┬───────────────┘
                           │
                  ┌────────▼────────┐
                  │  Tipo do veículo?│
                  └───┬─────────┬────┘
              Otto    │         │   Diesel
          (leve/médio)│         │   (pesado)
                      │         │
       ┌──────────────▼──┐   ┌──▼──────────────────┐
       │ FE_CO₂ em g/km  │   │ Converter g/kWh→g/km │
       │ = FE_comb ÷     │   │ (motor → autonomia)  │
       │   autonomia     │   │                      │
       └──────────────┬──┘   └──────────┬───────────┘
                      │                 │
                ┌─────▼─────────────────▼─────┐
                │  Emissão = FE_CO₂ × Distância │
                └──────────────┬───────────────┘
                               │
                  ┌────────────▼────────────┐
                  │  RESULTADO: massa de CO₂ │
                  │  (kg CO₂)                │
                  └──────────────────────────┘
```


---

## ⛽ Cálculo de CO₂ por Tipo de Combustível (REALISTA — CO₂ de combustão)

> ⚠️ **Decisão de projeto:** esta calculadora usa o **CO₂ real de combustão**, ou seja, todo combustível que queima e emite CO₂ é contabilizado — **inclusive o etanol e o biodiesel**. Não usamos a convenção regulatória que zera os renováveis, pois o objetivo é refletir a realidade física da emissão pelo escapamento.

### Fatores de Emissão de CO₂ por combustível (kgCO₂/L)

Valores oficiais da Tabela 4.1.1.1.1.c do Inventário Nacional. **Note que etanol e biodiesel têm fator real, não zero.**

| Combustível | Fator de Emissão (kgCO₂/L) | Observação |
|-------------|----------------------------|------------|
| Gasolina automotiva (gasolina C) | **2,23** | valor para 2004–2024; varia ligeiramente por ano |
| Etanol anidro | **1,58** | valor fixo (misturado à gasolina C) |
| **Etanol hidratado** | **1,51** | valor fixo — **NÃO é zero** |
| Diesel mineral | **2,63** | valor para 2004–2024 |
| Biodiesel | **2,46** | misturado ao diesel (B-fração) |

> 📌 **Fonte:** Inventário Nacional de Emissões Atmosféricas por Veículos Automotores Rodoviários, ano-base 2024 (IEMA/MMA/MT), Tabela 4.1.1.1.1.c — https://energiaeambiente.org.br/wp-content/uploads/2025/12/IEMA_inventariorodoviario.pdf

#### Evolução histórica dos fatores (kgCO₂/L)

Gasolina e diesel mudaram ao longo dos anos (variação na composição); etanol é fixo:

| Ano-calendário | Gasolina | Diesel Mineral |
|----------------|----------|----------------|
| 1980–1982 | 2,23 | 2,66–2,68 |
| 1983–1987 | 2,28–2,30 | 2,68–2,72 |
| 1988–1997 | 2,28–2,30 | 2,70–2,71 |
| 1998–2000 | 2,24–2,27 | 2,64–2,67 |
| 2001–2024 | 2,23 | 2,63 |

> 📌 Etanol anidro = 1,58 e etanol hidratado = 1,51 (constantes em toda a série). Biodiesel = 2,46 (a partir de 2004).
> 📌 **Fonte:** mesma Tabela 4.1.1.1.1.c.

---

### Fórmula geral (todos os combustíveis, todos os veículos)

**Por volume de combustível (mais direto para CO₂):**
```
Emissão CO₂ (kg) = Volume de combustível (L) × FE_CO₂ (kgCO₂/L)
```

**Por distância percorrida:**
```
FE_CO₂ (gCO₂/km) = FE_CO₂ (gCO₂/L) ÷ Autonomia (km/L)
Emissão CO₂ (g)  = FE_CO₂ (gCO₂/km) × Distância (km)
```

---

### 🚗 Veículos Leves e Médios (ciclo Otto)

```
Emissão = Fator de Emissão × Distância
        = FE_CO₂ (g/km) × Distância (km)
```

**Exemplo — Gasolina C, 200 km, autonomia 13 km/L:**
- FE = 2,23 kgCO₂/L = 2.230 gCO₂/L
- FE_CO₂ = 2.230 ÷ 13 ≈ **171,5 gCO₂/km**
- Emissão = 171,5 × 200 = **34.300 g ≈ 34,3 kg CO₂**

**Exemplo — Etanol hidratado, 200 km, autonomia 9 km/L:**
- FE = 1,51 kgCO₂/L = 1.510 gCO₂/L
- FE_CO₂ = 1.510 ÷ 9 ≈ **167,8 gCO₂/km**
- Emissão = 167,8 × 200 = **33.560 g ≈ 33,6 kg CO₂**  ✅ **contabilizado, não zero**

> 📌 Note que a autonomia do etanol é menor (~9 km/L vs ~13 km/L da gasolina) porque o etanol tem menor poder calorífico. Isso aproxima as emissões por km dos dois combustíveis, apesar do fator por litro do etanol ser menor.

---

### 🚌 Veículos Pesados (ciclo Diesel)

```
1) gCO₂/gDiesel = (gCO₂/kWh) ÷ (gDiesel/kWh)
2) FE_CO₂ (g/km) = (gCO₂/gDiesel) × (gDiesel/L) ÷ (km/L)
3) Emissão = FE_CO₂ (g/km) × Distância (km)
```

Ou, se você já tem o volume de diesel consumido:
```
Emissão CO₂ (kg) = Volume de diesel (L) × 2,63 kgCO₂/L
```
- Se o diesel tem biodiesel misturado (ex.: B14), some também a parcela de biodiesel × 2,46 kgCO₂/L — **ambos contabilizados**.

**Exemplo — Diesel, ônibus urbano, 200 km, autonomia 1,8 km/L:**
- Consumo = 200 ÷ 1,8 ≈ 111 L
- Emissão = 111 × 2,63 ≈ **292 kg CO₂**

> 📌 **Fonte:** CETESB, *Metodologia*, 2024, p. 15–16 (Equações 3 e 4); fatores: Tabela 4.1.1.1.1.c.

---

### 🔵 GNV (Gás Natural Veicular)

Combustível fóssil, fator expresso por volume (kgCO₂/m³), conforme ano-calendário (base BEN/EPE).
```
Emissão CO₂ (kg) = Volume de GNV (m³) × FE_GNV (kgCO₂/m³)
```

---

### 📋 Resumo: cálculo realista por combustível

| Combustível | FE (kgCO₂/L) | Contabilizado? | Cálculo |
|-------------|--------------|----------------|---------|
| Gasolina C | 2,23 | ✅ Sim | `Volume × 2,23` ou `FE/autonomia × dist` |
| Etanol anidro | 1,58 | ✅ Sim | idem |
| **Etanol hidratado** | **1,51** | ✅ **Sim (não zero)** | idem |
| Diesel mineral | 2,63 | ✅ Sim | `Volume × 2,63` |
| Biodiesel | 2,46 | ✅ Sim | parcela misturada × 2,46 |
| GNV | por m³ | ✅ Sim | `Volume × FE_GNV` |

---

### ℹ️ Nota sobre as duas formas de contabilizar

Existem **duas convenções** — escolha conforme o objetivo do relatório:

1. **CO₂ de combustão (REALISTA — usado neste projeto):** conta todo o CO₂ que sai do escapamento, inclusive renováveis. Etanol hidratado = 1,51 kgCO₂/L.
2. **CO₂ fóssil (regulatório — IPCC/CETESB):** zera os renováveis por considerar o carbono biogênico (a cana reabsorve o CO₂). Usado em inventários oficiais de mudança climática.

> 📌 Em qualquer das convenções, **CH₄ e N₂O do etanol são sempre contabilizados**.
> Fonte da convenção fóssil: CETESB, *Metodologia*, 2024, p. 23.

---
