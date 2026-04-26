import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.news_stream_service import get_news_stream

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active: list[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)
        print(f"[WS] Client connected. Total: {len(self.active)}")

    def disconnect(self, ws: WebSocket):
        self.active = [c for c in self.active if c is not ws]
        print(f"[WS] Client disconnected. Total: {len(self.active)}")

    async def send(self, ws: WebSocket, data: dict):
        try:
            await ws.send_text(json.dumps(data))
        except Exception:
            self.disconnect(ws)


manager = ConnectionManager()


@router.websocket("/ws/news")
async def news_stream(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        async for news_item in get_news_stream():
            await manager.send(websocket, news_item)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"[WS] Error: {e}")
        manager.disconnect(websocket)