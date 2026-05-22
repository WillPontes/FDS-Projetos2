from __future__ import annotations

from typing import Any, Dict, Optional

from src.engine.calc_engine import CalcEngine


class TransactionOrchestrator:
    """Coordena payload de passagem → CalcEngine (specs já resolvidos e validados)."""

    def __init__(self, engine: CalcEngine):
        self.engine = engine

    def handle_tag_event(self, webhook_payload: Dict[str, Any]) -> Dict[str, Any]:
        vehicle = webhook_payload["vehicle"]
        payback: Optional[Dict[str, Any]] = webhook_payload.get("payback")
        context = webhook_payload["context"]
        uf_passagem = str(webhook_payload.get("uf_passagem") or "").strip()

        vehicle_data: Dict[str, Any] = {
            "plate": webhook_payload["plate"],
            "category": vehicle["category"],
            "fuel_type": vehicle["fuel_type"],
            "model": vehicle.get("model", ""),
        }

        return self.engine.process_transaction(
            real_time_sec=int(webhook_payload["elapsed_time"]),
            vehicle_data=vehicle_data,
            context=context,
            uf_passagem=uf_passagem,
            is_digital=bool(webhook_payload.get("is_digital", True)),
            payback=payback,
        )
