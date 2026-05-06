# Documentação de Contratos da API

Este documento mapeia as entradas e saídas esperadas para a API do sistema, baseando-se nas telas do aplicativo (Mobile) e da plataforma web (Dashboard). Os dados estão mapeados no formato `chave: tipo`, utilizando dicionários (objetos).

---

## 📱 Mobile App (Motorista)

1) ### Dashboard de Impacto (Telas 1 a 3)
Retorna as métricas de sustentabilidade e impacto do motorista.
```json
{
  "days_saved_without_queues": "int",
  "saved_tree": "int",
  "total_carbon": "float",
  "wg": "int",
  "total_water_saved": "float",
  "paper_saved": "float"
}
```

2) ### Histórico de Passagens (Tela 4)
```json
{
  "total_carbon": "float",
  "hours_saved": "float",
  "total_passages": "int",
  "last_passages": {
    "time": "int",
    "carbon": "int",
    "water_saved": "int",
    "local_name": "string",
    "passage_datetime": "string"
  }
}
```
3) ### Perfil do Motorista (Tela 6)
```json
{
  "driver_name": "string",
  "driver_role": "string",
  "plate": "string",
  "fleet_id": "string",
  "status": "boolean"
}
```
4) ### Eco-Routing / Sistema de Rotas (Telas 7 e 8)
```json
{
  "destination": "string",
  "carbon_estimate": "int",
  "eco_time": "int",
  "route_coordinates": {
    "origin_lat": "float",
    "origin_lng": "float",
    "destination_lat": "float",
    "destination_lng": "float"
  }
}
```

## 💻 Web Platform (Gestor de Frota)

5) ### Dashboard Principal e Gráficos (Tela 9)
```json
{
  "period_filter": "string",
  "vehicle_plate_filter": "string",
  "total_co2_avoided_kg": "float",
  "total_fuel_saved_liters": "float",
  "accumulated_economy": "float",
  "active_tags": "int",
  // Emissões de CO2 por estado (Representando em Mapa do Brasil)
  "emissions_by_state_map": {
    "state_uf": "string",
    "co2_emission_value": "float"
  }
},
{
  //Analise de gastos grafico Com vs Sem tag
  "monthly_expenses_chart": {
    "month": "string",
    "expenses_with_tag": "float",
    "expenses_without_tag": "float"
  }
},
{
  "top_efficient_vehicles": {
    "rank": "int",
    "plate": "string",
    "driver_name": "string",
    "efficiency_score_percentage": "float",
    "total_economy": "float"
  }
}
```

6) ### Gestão de Frota (Telas 10 e 11)
```json
{
  "search": "string",
  "filter_1": "string",
  "filter_2": "string",
  "total_results": "int",
  "vehicles_list": {
    "tag_series": "string",
    "plate": "string",
    "vehicle_model": "string",
    "fuel_type": "string",
    "installation_date": "string"
  }
}
```

7) ### Configurações da Conta (Tela 12)
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "new_password": "string",
  "last_password_change_date": "string",
  "two_factor_auth": "boolean"
}
```
