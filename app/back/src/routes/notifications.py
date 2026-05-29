"""Rota WebSocket para notificações em tempo real."""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from src.services.realtime_notifier import notifier

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    """
    Canal unidirecional de notificações (server → client).

    O frontend conecta aqui e recebe toasts de forma automática
    sempre que uma transação é processada.
    """
    await notifier.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        notifier.disconnect(websocket)
