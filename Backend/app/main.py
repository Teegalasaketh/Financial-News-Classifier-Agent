from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.classify import router as classify_router
from app.routes.signals import router as signal_router
from app.routes.news import router as news_router
from app.routes.websocket import router as ws_router

app = FastAPI(title="Financial News Classifier Agent", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(classify_router)
app.include_router(signal_router)
app.include_router(news_router)
app.include_router(ws_router)

@app.get("/")
def home():
    return {"message": "Financial News Classifier API Running"}