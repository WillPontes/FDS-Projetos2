# Documentação de Contratos da API

Este documento mapeia as entradas e saídas esperadas para a API do sistema, baseando-se nas telas da versão mobile e da versão desktop. Os dados estão mapeados no formato `chave: tipo`, utilizando dicionários (objetos).

---

## 📱 Mobile Version (Motorista)

1) ### Dashboard de Impacto (Telas 1 a 3)
Retorna as métricas de sustentabilidade e impacto do motorista.
```json
{ 
  //Method GET
  //Response
  "days_saved_without_queues": "int",
  "tree_saved": "int",
  "total_carbon": "float",
  "weekly_goal": "int",
  "total_water_saved": "float",
  "paper_saved": "float"
},
{
  //Method GET
  //Response
  "weekly_goal": "int",
  "weekly_percentage": "int"
}  

```

2) ### Histórico de Passagens (Tela 4)
```json
{
  //Method GET
  //Response
  "total_carbon": "float",
  "hours_saved": "float",
  "total_passages": "int",
  //Method GET
  //Response
  "last_passages": {
    "time": "int",
    "carbon": "int",
    "water_saved": "int",
    "local_name": "string",
    "passage_datetime": "string"
  }
}
```
3)  ### Perfil Usuario (Tela 6)
```json
//Method GET
//Response
{
  "name": "string",
  "role": "driver" || "manager" || "admin",
  "plate"?: "string",
  "fleet_id"?: "string",
  "status": "boolean"
}
```
4) ### Eco-Routing / Sistema de Rotas (Telas 7 e 8)
```json
//Method GET
{
  //Response
  "carbon_estimate": "int",
  "time_estimate": "int",
}
{
  //Method POST
  //Params  
  "destination": "string",
  "route_coordinates_origin": {
    "origin_lat": "float",
    "origin_lng": "float"
  },
  "route_coordinates_destination": {
    "destination_lat": "float",
    "destination_lng": "float"
  }
}
```

## 💻 Web Platform (Gestor de Frota)

5) ### Dashboard Principal e Gráficos (Tela 9)
```json
{
  //Filtros de datas
  //Method GET
  //Params
  "period_filter":{
    "start_date": "string",
    "end_date": "string"
  },
  "vehicle_plate_filter": "string",
  //Date_Fleet
  //Method GET
  //Response
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
  //Method GET
  //Response
  "monthly_expenses_chart": {
    "month": "string",
    "expenses_with_tag": "float",
    "expenses_without_tag": "float"
  }
},
{
  //Method GET
  //Response
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
  //Method GET(para listar)/ PUT para Editar algum veiculo
  // Method DELETE para a ação de excluir // POST para Adicionar Veiculo
  //Params
  "search": "string",
  "period_filter":{
    "start_date": "string",
    "end_date": "string"
  },
  "filter_fuel": "gasolina"|| "Diesel" || "Flex" || "Etanol",
  //Response
  "total_results": "int",
  "vehicles_list": {
    "tag_series": "string",
    "plate": "string",
    "vehicle_model": "string",
    "fuel_type": "string",
    "installation_date": "string"
    {
      //Mensagem de Conclusão ou Erro, caso o veiculo tenha sido cadastrado ou editado || POST || PUT
      //Response
      "success": "boolean",
      "vehicle_id": "string",
      "message": "Veículo cadastrado com sucesso" || "Erro ao cadastrar veículo" || "Veículo editado com sucesso" || "Erro ao editar veículo"
    }
  }
}
```

7) ### Configurações da Conta (Tela 12)
```json
{
  //Method GET (exibir nome e email pro usuario)
  //Method PUT (caso o usuario queira alterar nome e email)
  //Response
  "name": "string",
  "email": "string",
  "two_factor_auth": "boolean"
}
```
