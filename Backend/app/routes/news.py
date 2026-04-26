from fastapi import APIRouter
from app.services.news_stream_service import get_market_news

router=APIRouter()

@router.get("/live-news")
def live_news():
    return get_market_news()