"""Labels PT-BR e ordem de exibição das metáforas ludic (US02). Valores numéricos vêm do BD."""

from __future__ import annotations

# Ordem por eixo (≥3 entradas por eixo, alinhado a engine-calculo.md §4).
METAPHOR_IDS_ORDER: dict[str, tuple[str, ...]] = {
    "carbon": ("tree_year", "burger", "km_car"),
    "water": ("shower_8min", "drinking_day", "flush"),
    "paper": ("ream_a4", "notebook", "toilet_roll"),
}

METAPHOR_LABELS: dict[str, dict[str, str]] = {
    "carbon": {
        "tree_year": "Árvores (absorção ~1 ano)",
        "burger": "Hambúrgueres (pegada média)",
        "km_car": "Km carro médio (120 g/km)",
    },
    "water": {
        "shower_8min": "Chuveiros (~8 min)",
        "drinking_day": "Dias de consumo humano (2 L/dia)",
        "flush": "Descargas de vaso sanitário (~6 L)",
    },
    "paper": {
        "ream_a4": "Resmas A4 (~500 folhas)",
        "notebook": "Cadernos escolares (~50 folhas)",
        "toilet_roll": "Rolos de papel higiênico (~equivalente folhas)",
    },
}

# Fallback técnico se a BD não tiver chave (seed deve preencher; evita lista vazia).
DEFAULT_METAPHOR_UNITS: dict[str, dict[str, float]] = {
    "carbon": {"tree_year": 15.0, "burger": 2.5, "km_car": 0.12},
    "water": {"shower_8min": 60.0, "drinking_day": 2.0, "flush": 6.0},
    "paper": {"ream_a4": 500.0, "notebook": 50.0, "toilet_roll": 150.0},
}
