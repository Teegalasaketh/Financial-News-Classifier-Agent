import uuid
import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.groq_service import classify_news

router = APIRouter()


class NewsInput(BaseModel):
    article: str


@router.post("/classify-news")
def classify(data: NewsInput):
    article = data.article.strip()
    if not article:
        raise HTTPException(status_code=400, detail="article is required")

    result = classify_news(article)

    # Use the first sentence of the article as the card title (clean, not truncated mid-word)
    first_sentence = article.split('.')[0].strip()
    title = (first_sentence[:100] + '…') if len(first_sentence) > 100 else first_sentence

    return {
        "id":              str(uuid.uuid4()),
        # Title = first sentence of the input (clean headline)
        "title":           title,
        # Summary = Groq-generated analyst note (NOT a repeat of the title)
        "summary":         result.get("summary", article),
        "source":          "Manual",
        "publishedAt":     datetime.datetime.utcnow().isoformat() + "Z",
        # ── AI classification fields ────────────────────────────
        "sentiment":       result.get("sentiment",       "neutral"),
        "tradingSignal":   result.get("tradingSignal",   "hold"),
        "impactLevel":     result.get("impactLevel",     "medium"),
        "affectedSectors": result.get("affectedSectors", ["General"]),
        "entities":        result.get("entities",        []),
        "confidenceScore": result.get("confidenceScore", 0.0),
        "priceMovement":   result.get("priceMovement",   "N/A"),
    }