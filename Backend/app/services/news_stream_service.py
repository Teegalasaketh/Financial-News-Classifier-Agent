"""
news_stream_service.py
- get_market_news()  → REST GET /live-news
- get_news_stream()  → WebSocket /ws/news (async generator)

Each Finnhub article is classified by Groq so sentiment / signal / confidence
are real AI values instead of hardcoded "neutral / hold / 0".
"""

import os
import asyncio
import datetime
import requests
from dotenv import load_dotenv

from app.services.groq_service import classify_news

load_dotenv()

FINNHUB_KEY = os.getenv("FINNHUB_API_KEY")

FALLBACK_NEWS = [
    {
        "id":              "fallback-1",
        "title":           "Markets update temporarily unavailable",
        "summary":         "Live news feed is experiencing issues. Please check back shortly.",
        "sentiment":       "neutral",
        "impactLevel":     "low",
        "tradingSignal":   "hold",
        "confidenceScore": 0.0,
        "affectedSectors": ["General"],
        "entities":        [],
        "priceMovement":   "N/A",
        "source":          "System",
        "publishedAt":     datetime.datetime.utcnow().isoformat() + "Z",
    }
]


def _safe_published(raw_dt) -> str:
    try:
        ts = int(raw_dt or 0)
        if ts == 0:
            return datetime.datetime.utcnow().isoformat() + "Z"
        return datetime.datetime.utcfromtimestamp(ts).isoformat() + "Z"
    except Exception:
        return datetime.datetime.utcnow().isoformat() + "Z"


def _enrich(item: dict) -> dict:
    """Attach Groq classification to a raw Finnhub item."""
    headline = item.get("headline", "")
    summary  = item.get("summary",  "") or headline
    related  = item.get("related",  "") or ""
    source   = item.get("source",   "Finnhub")

    # Feed headline + summary to Groq for richer context
    text_for_ai = f"{headline}. {summary}".strip(". ")

    ai = classify_news(text_for_ai)

    # Merge Finnhub's related ticker with Groq sectors
    merged_sectors = list(ai["affectedSectors"])
    if related and related not in merged_sectors:
        merged_sectors.append(related)

    return {
        "id":              str(item.get("id", "")),
        "title":           headline,
        "summary":         summary,
        "source":          source,
        "publishedAt":     _safe_published(item.get("datetime")),
        "sentiment":       ai["sentiment"],
        "tradingSignal":   ai["tradingSignal"],
        "impactLevel":     ai["impactLevel"],
        "affectedSectors": merged_sectors or ["General"],
        "entities":        ai["entities"],
        "confidenceScore": ai["confidenceScore"],
        "priceMovement":   ai["priceMovement"],
    }


def get_market_news() -> list:
    """
    REST endpoint /live-news.
    Returns up to 5 Groq-classified articles.
    Never raises — returns fallback on any error.
    """
    try:
        url = f"https://finnhub.io/api/v1/news?category=general&token={FINNHUB_KEY}"
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        result = []
        for item in r.json()[:5]:
            try:
                result.append(_enrich(item))
            except Exception as e:
                print(f"[get_market_news] enrich error: {e}")
        return result or FALLBACK_NEWS
    except Exception as e:
        print(f"[get_market_news] fetch error (returning fallback): {e}")
        return FALLBACK_NEWS


async def get_news_stream():
    """
    Async generator for WebSocket /ws/news.
    Polls Finnhub every 60 s, classifies each new article, yields it.
    Handles CancelledError cleanly so disconnect doesn't log a traceback.
    """
    seen_ids: set[str] = set()

    while True:
        try:
            url = f"https://finnhub.io/api/v1/news?category=general&token={FINNHUB_KEY}"
            r = requests.get(url, timeout=10)
            r.raise_for_status()

            for item in r.json()[:10]:
                item_id = str(item.get("id", ""))
                if not item_id or item_id in seen_ids:
                    continue
                seen_ids.add(item_id)
                try:
                    yield _enrich(item)
                except Exception as e:
                    print(f"[news_stream] enrich error: {e}")

        except asyncio.CancelledError:
            return
        except Exception as e:
            print(f"[news_stream] fetch error: {e}")

        try:
            await asyncio.sleep(60)   # 60s — respect Finnhub free-tier rate limit
        except asyncio.CancelledError:
            return