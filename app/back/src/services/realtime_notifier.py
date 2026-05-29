"""
Serviço de notificações em tempo real via WebSocket.

Gerencia conexões ativas e faz broadcast de mensagens
para todos os clientes conectados.
"""

from __future__ import annotations

import asyncio
import logging

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class RealtimeNotifier:
    """Gerencia conexões WebSocket e realiza broadcast de notificações."""

    def __init__(self) -> None:
        self._connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self._connections.append(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self._connections:
            self._connections.remove(websocket)

    async def broadcast(self, message: str) -> None:
        for connection in list(self._connections):
            try:
                await connection.send_text(message)
            except Exception:
                self.disconnect(connection)

    def schedule_broadcast(self, message: str) -> None:
        """Agenda o broadcast sem bloquear a resposta HTTP."""
        try:
            asyncio.create_task(self.broadcast(message))
        except Exception as exc:
            logger.warning("Falha ao agendar broadcast: %s", exc)


# Instância global (singleton de módulo)
notifier = RealtimeNotifier()
