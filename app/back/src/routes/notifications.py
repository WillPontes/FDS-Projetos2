"""Rota WebSocket para notificações em tempo real."""

from fastapi import APIRouter, Query, WebSocket, WebSocketDisconnect

from src.services.realtime_notifier import notifier

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    user_id: int = Query(...),
) -> None:
    """
    Canal unidirecional de notificações (server → client).

    O frontend conecta passando ?user_id=<id> e recebe toasts
    apenas das transações daquele usuário.
    """
    await notifier.connect(websocket, user_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        notifier.disconnect(websocket, user_id)
