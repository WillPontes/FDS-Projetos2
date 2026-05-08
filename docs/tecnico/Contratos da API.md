# Documentação de Contratos da API

>Este documento mapeia as entradas e saídas esperadas para a API do sistema, baseando-se nas telas da versão mobile e da versão desktop. Os dados estão mapeados no formato `chave: tipo`, utilizando dicionários (objetos).

---

## 📱 Versão Mobile — Motorista

---

### 1. Dashboard de Impacto (Telas 1 a 3)

Retorna as métricas de sustentabilidade e impacto ambiental do motorista, organizadas por carbono, água e papel.

#### 1.1 Métricas de Impacto

`Method GET `

**Response 200 OK**
```json
{
  "days_saved_without_queues": "int",
  "tree_saved":                "int",
  "total_carbon":              "float",
  "total_water_saved":         "float",
  "paper_saved":               "float"
}
```

#### 1.2 Meta Semanal

`Method GET `

**Response 200 OK**
```json
{
  "weekly_goal":       "int",
  "weekly_percentage": "int"
}
```

---

### 2. Histórico de Passagens (Tela 4)

#### 2.1 Resumo Total

`Method GET `

**Response 200 OK**
```json
{
  "total_passages": "int",
  "total_carbon":   "float",
  "hours_saved":    "float"
}
```

#### 2.2 Últimas Passagens

`Method GET `

**Query Params**
```json
{
  "page":      "int | optional",
  "page_size": "int | optional"
}
```

**Response 200 OK**
```json
{
  "total_results": "int",
  "last_passages": [
    {
      "local_name":       "string",
      "passage_datetime": "string",
      "carbon":           "int",
      "water_saved":      "int",
      "time":             "int"
    }
  ]
}
```

---

### 3. Perfil do Usuário (Tela 6)

`Method GET `

**Response 200 OK**
```json
{
  "name":     "string",
  "role":     "driver | manager | admin",
  "plate":    "string | optional",
  "fleet_id": "string | optional",
  "status":   "boolean"
}
```

---

### 4. Eco-Routing / Sistema de Rotas (Telas 7 e 8)

#### 4.1 Pesquisar Destino e Eco-Estimativa

`Method POST `

**Request Body**
```json
{
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

**Response 200 OK**
```json
{
  "carbon_estimate": "int",
  "time_estimate":   "int"
}
```

---

## 💻 Plataforma Web — Gestor de Frota

---

### 5. Dashboard Principal e Gráficos (Tela 9)

> Cada endpoint abaixo aceita os seguintes query params opcionais como filtro:
> - `period_filter[start_date]`: string
> - `period_filter[end_date]`: string
> - `vehicle_plate_filter`: string

#### 5.1 Indicadores da Frota

`Method GET `

**Response 200 OK**
```json
{
  "total_co2_avoided_kg":    "float",
  "total_fuel_saved_liters": "float",
  "accumulated_economy":     "float",
  "active_tags":             "int"
}
```

#### 5.2 Emissões por Estado (Mapa de Calor)

`Method GET `

**Response 200 OK**
```json
{
  "emissions_by_state_map": [
    {
      "state_uf":           "string",
      "co2_emission_value": "float"
    }
  ]
}
```

#### 5.3 Análise de Gastos com Combustível

`Method GET `

**Response 200 OK**
```json
{
  "monthly_expenses_chart": [
    {
      "month":                "string",
      "expenses_with_tag":    "float",
      "expenses_without_tag": "float"
    }
  ]
}
```

#### 5.4 Top 5 Veículos/Motoristas Mais Eficientes

`Method GET `

**Response 200 OK**
```json
{
  "top_efficient_vehicles": [
    {
      "rank":                        "int",
      "plate":                       "string",
      "driver_name":                 "string",
      "efficiency_score_percentage": "float",
      "total_economy":               "float"
    }
  ]
}
```

---

### 6. Gestão de Registro de Frota (Telas 10 e 11)

#### 6.1 Listar Veículos

`Method GET `

**Query Params**
```json
{
  "search":      "string | optional",
  "fuel_filter": "gasolina | diesel | flex | etanol | optional",
  "start_date":  "string | optional",
  "end_date":    "string | optional",
  "page":        "int | optional",
  "page_size":   "int | optional"
}
```

**Response 200 OK**
```json
{
  "total_results": "int",
  "vehicles_list": [
    {
      "tag_series":        "string",
      "plate":             "string",
      "vehicle_model":     "string",
      "fuel_type":         "string",
      "installation_date": "string"
    }
  ]
}
```

#### 6.2 Adicionar Veículo

`Method POST `

**Request Body**
```json
{
  "plate":             "string",
  "vehicle_model":     "string",
  "fuel_type":         "gasolina | diesel | flex | etanol",
  "installation_date": "string"
}
```

**Response 201 Created**
```json
{
  "vehicle_id": "string",
  "message":    "Veículo cadastrado com sucesso"
}
```

**Response 422 Unprocessable Entity**
```json
{
  "message": "Erro ao cadastrar veículo"
}
```

#### 6.3 Editar Veículo

`Method PUT `

**Path Params**
```
vehicle_id: string
```

**Request Body**
```json
{
  "plate":             "string | optional",
  "vehicle_model":     "string | optional",
  "fuel_type":         "gasolina | diesel | flex | etanol | optional",
  "installation_date": "string | optional"
}
```

**Response 200 OK**
```json
{
  "vehicle_id": "string",
  "message":    "Veículo editado com sucesso"
}
```

**Response 422 Unprocessable Entity**
```json
{
  "message": "Erro ao editar veículo"
}
```

#### 6.4 Excluir Veículo

`Method DELETE `

**Path Params**
```
vehicle_id: string
```

**Response 200 OK**
```json
{
  "message": "Veículo excluído com sucesso"
}
```

**Response 422 Unprocessable Entity**
```json
{
  "message": "Erro ao excluir veículo"
}
```

#### 6.5 Importar Veículos em Lote

`Method POST `

**Request Body** `multipart/form-data`
```
file: File   // .csv com colunas: plate, vehicle_model, fuel_type, installation_date
```

**Response 200 OK**
```json
{
  "imported_count": "int",
  "errors": [
    {
      "row":     "int",
      "message": "string"
    }
  ]
}
```

#### 6.6 Painel de Relatórios — Gerar Relatório

`Method GET `

**Query Params**
```json
{
  "filter_1": "string | optional",
  "filter_2": "string | optional",
  "filter_3": "string | optional"
}
```

**Response 200 OK**
```json
{
  "total_results": "int",
  "vehicles_list": [
    {
      "tag_series":        "string",
      "plate":             "string",
      "vehicle_model":     "string",
      "fuel_type":         "string",
      "installation_date": "string"
    }
  ]
}
```

---

### 7. Configurações da Conta (Tela 12)

#### 7.1 Exibir Configurações

`Method GET `

**Response 200 OK**
```json
{
  "name":            "string",
  "email":           "string",
  "two_factor_auth": "boolean"
}
```

#### 7.2 Atualizar Configurações

`Method PUT `

**Request Body**
```json
{
  "name":            "string | optional",
  "email":           "string | optional",
  "two_factor_auth": "boolean | optional"
}
```

**Response 200 OK**
```json
{
  "message": "Configurações atualizadas com sucesso"
}
```

**Response 422 Unprocessable Entity**
```json
{
  "message": "Erro ao atualizar configurações"
}
```

#### 7.3 Alterar Senha

`Method PUT `

**Request Body**
```json
{
  "current_password": "string",
  "new_password":     "string"
}
```

**Response 200 OK**
```json
{
  "message": "Senha alterada com sucesso"
}
```

**Response 422 Unprocessable Entity**
```json
{
  "message": "Erro ao alterar senha"
}
```

---
