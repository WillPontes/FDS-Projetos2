"""
Constrói mensagens de notificação personalizadas para toasts.

Seleciona aleatoriamente uma metáfora lúdica dentre todos os eixos
que tiveram economia na transação, tornando as notificações variadas.
Sem fallbacks — sempre dados reais ou None.
"""

from __future__ import annotations

import random
from typing import Any

from src.constants.ludic_metaphors import (
    DEFAULT_METAPHOR_UNITS,
    METAPHOR_LABELS,
)


def _extract_savings(result: dict[str, Any]) -> dict[str, float]:
    """
    Extrai os valores de economia relevantes do resultado da transação.
    Retorna apenas os eixos com valor > 0.
    """
    mappings = {
        "carbon": result.get("co2_avoided_kg", 0.0),
        "water": result.get("water_saved_liters", 0.0),
        "paper": result.get("environmental", {}).get("paper_tickets", 0.0),
    }
    return {axis: value for axis, value in mappings.items() if value and value > 0}


def _format_metaphor(axis: str, raw_value: float) -> str | None:
    """
    Escolhe aleatoriamente uma metáfora dentro do eixo e monta a frase.
    Retorna None se não houver metáforas configuradas para o eixo.
    """
    units = DEFAULT_METAPHOR_UNITS.get(axis, {})
    labels = METAPHOR_LABELS.get(axis, {})

    if not units or not labels:
        return None

    metaphor_id = random.choice(list(units.keys()))
    divisor = units[metaphor_id]
    label = labels.get(metaphor_id, metaphor_id)

    converted = raw_value / divisor if divisor > 0 else 0

    return f" Você economizou o equivalente a {converted:.1f} {label}!"


def build_message(result: dict[str, Any]) -> str | None:
    """
    Constrói uma mensagem personalizada com base nos resultados da transação.

    Seleciona aleatoriamente um eixo que teve economia (carbono, água ou papel)
    e gera uma frase usando uma metáfora lúdica aleatória daquele eixo.
    Retorna None se não houver dados reais de economia.
    """
    savings = _extract_savings(result)

    if not savings:
        return None

    # Escolhe um eixo aleatório dentre os que tiveram economia
    axis = random.choice(list(savings.keys()))
    raw_value = savings[axis]

    return _format_metaphor(axis, raw_value)
