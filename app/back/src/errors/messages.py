"""Mensagens de erro da API em português (campo HTTPException.detail)."""

GENERIC_INTERNAL = "Erro interno. Tente novamente."
VALIDATION_FAILED = "Verifique os dados enviados."
CALC_ENGINE_FAILED = "Não foi possível processar os dados técnicos. Verifique as especificações."

ACCESS_DENIED = "Acesso negado."

USER_NOT_FOUND = "Usuário não encontrado."
USER_EMAIL_EXISTS = "Já existe um usuário com este email."
DRIVER_VEHICLES_ONLY = "Apenas motoristas podem ter veículos vinculados."
DRIVER_SINGLE_VEHICLE = "Motorista de org só pode ter um veículo."

ORGANIZATION_NOT_FOUND = "Organização não encontrada."
USER_NOT_LINKED_TO_ORG = "Usuário não vinculado a esta organização."

FLEET_NOT_FOUND = "Frota não encontrada."
VEHICLE_NOT_FOUND = "Veículo não encontrado."
VEHICLE_NOT_LINKED_TO_FLEET = "Veículo não vinculado a esta frota."
VEHICLE_PLATE_EXISTS = "Já existe um veículo com esta placa."
VEHICLE_TAG_EXISTS = "Já existe um veículo com esta tag."
GESTOR_VEHICLE_SCOPE = "Gestor deve vincular veículo à própria org/frota."

GOAL_NOT_FOUND = "Meta não encontrada."
CURRENT_WEEKLY_GOAL_NOT_FOUND = "Meta semanal atual não encontrada."

TRANSACTION_NOT_FOUND = "Transação não encontrada."

FUEL_PRICES_NOT_FOUND = "Preços de combustível não encontrados."


def fuel_prices_uf_not_found(uf: str) -> str:
    return f"Preços de combustível para a UF {uf.upper()} não encontrados."


USER_STATS_NOT_FOUND = "Estatísticas do usuário não encontradas."

TOKEN_INVALID = "Token inválido ou expirado."
TOKEN_MISSING_SUB = "Token sem identificador (sub)."
