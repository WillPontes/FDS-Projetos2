"""
Serviço de notificações em tempo real via WebSocket.

Gerencia conexões por usuário, garantindo que cada notificação
seja entregue apenas ao usuário correspondente.
"""

from __future__ import annotations

import asyncio
import logging

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class RealtimeNotifier:
    """Gerencia conexões WebSocket por usuário e envia notificações direcionadas."""

    def __init__(self) -> None:
        self._connections: dict[int, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: int) -> None:
        await websocket.accept()
        if user_id not in self._connections:
            self._connections[user_id] = []
        self._connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: int) -> None:
        if user_id in self._connections:
            self._connections[user_id] = [
                ws for ws in self._connections[user_id] if ws is not websocket
            ]
            if not self._connections[user_id]:
                del self._connections[user_id]

    async def send_to_user(self, user_id: int, message: str) -> None:
        """Envia mensagem apenas para as conexões do usuário especificado."""
        connections = self._connections.get(user_id, [])
        for connection in list(connections):
            try:
                await connection.send_text(message)
            except Exception:
                self.disconnect(connection, user_id)

    def schedule_send(self, user_id: int, message: str) -> None:
        """Agenda o envio direcionado sem bloquear a resposta HTTP."""
        try:
            asyncio.create_task(self.send_to_user(user_id, message))
        except Exception as exc:
            logger.warning("Falha ao agendar envio para user %d: %s", user_id, exc)


# Instância global (singleton de módulo)
notifier = RealtimeNotifier()
