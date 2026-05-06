from typing import dict

EMISSION_FACTORS = {
    "gasoline": 2.31,
    "diesel": 2.68,
    "ethanol": 1.50,
    "eletric": 0.05
}

async def calculate_co2(model: str, fuel: str, args: dict) -> float:
    if fuel not in EMISSION_FACTORS:
        raise ValueError("Combustível inválido")

    factor = EMISSION_FACTORS[fuel]

    if model == "car":
        distance = args.get("distance_km")
        consumption = args.get("consumption_km_per_l")

        if distance is None or consumption is None:
            raise ValueError("Parâmetros inválidos para carro")

        return (distance / consumption) * factor

    elif model == "flight":
        distance = args.get("distance_km")

        if distance is None:
            raise ValueError("Parâmetro distância obrigatório")

        return distance * 0.115

    elif model == "electric_car":
        distance = args.get("distance_km")
        kwh_per_km = args.get("kwh_per_km")

        if distance is None or kwh_per_km is None:
            raise ValueError("Parâmetros inválidos")

        return distance * kwh_per_km * factor

    else:
        raise ValueError("Modelo não suportado")