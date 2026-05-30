

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