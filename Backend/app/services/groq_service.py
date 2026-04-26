import os
import json
import re
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY not found in .env")

client = Groq(api_key=api_key)

VALID_SENTIMENTS = {"bullish", "bearish", "neutral"}
VALID_SIGNALS    = {"buy", "sell", "hold"}
VALID_IMPACTS    = {"low", "medium", "high"}


def classify_news(article: str) -> dict:
    """
    Call Groq and return a dict with keys matching the frontend ClassifiedNews type.
    Now includes a 'summary' field — a 2-3 sentence analyst-style explanation.
    """
    prompt = f"""You are a senior financial news analyst. Analyze the news below and return ONLY valid JSON — no markdown, no explanation, no extra text outside the JSON.

Required JSON (use these EXACT keys):
{{
  "summary": "A 2-3 sentence analyst-style summary explaining what happened, why it matters to markets, and what investors should watch.",
  "sentiment": "bullish" | "bearish" | "neutral",
  "tradingSignal": "buy" | "sell" | "hold",
  "impactLevel": "low" | "medium" | "high",
  "affectedSectors": ["Technology"],
  "entities": ["AAPL", "Apple Inc"],
  "confidenceScore": 0.85,
  "priceMovement": "+2% to +4%"
}}

Rules:
- summary: 2-3 sentences, written like a Bloomberg analyst note. Explain the event, its market implications, and what to watch. Do NOT repeat the headline verbatim.
- confidenceScore: float 0.0-1.0 (NOT 0-100)
- affectedSectors: choose from [Technology, Finance, Energy, Healthcare, Consumer, Industrial, Real Estate, Utilities, Materials, Crypto, General]
- entities: ticker symbols or company/person names mentioned; empty list [] if none
- priceMovement: short-term expected move e.g. "+1% to +3%", "-2% to -5%", "flat", "N/A"
- tradingSignal: "buy" if bullish + confidence > 0.6, "sell" if bearish + confidence > 0.6, else "hold"

News to classify:
{article}
"""

    raw = ""
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=400,
        )
        raw = response.choices[0].message.content.strip()

        # Strip markdown code fences if model wraps output
        raw = re.sub(r"^```(?:json)?\s*", "", raw, flags=re.MULTILINE)
        raw = re.sub(r"\s*```$", "", raw, flags=re.MULTILINE)
        raw = raw.strip()

        data = json.loads(raw)

        # ── Normalise & validate each field ──────────────────────────────
        summary = str(data.get("summary", "")).strip()
        if not summary:
            summary = article  # fallback to original if Groq skipped it

        sentiment = str(data.get("sentiment", "neutral")).lower()
        if sentiment not in VALID_SENTIMENTS:
            sentiment = "neutral"

        signal = str(data.get("tradingSignal", "hold")).lower()
        if signal not in VALID_SIGNALS:
            signal = "hold"

        impact = str(data.get("impactLevel", "medium")).lower()
        if impact not in VALID_IMPACTS:
            impact = "medium"

        sectors = data.get("affectedSectors", ["General"])
        if not isinstance(sectors, list) or len(sectors) == 0:
            sectors = ["General"]

        entities = data.get("entities", [])
        if not isinstance(entities, list):
            entities = []

        raw_conf = data.get("confidenceScore", 0.5)
        try:
            conf = float(raw_conf)
            if conf > 1.0:
                conf = conf / 100.0
            conf = round(max(0.0, min(1.0, conf)), 4)
        except (TypeError, ValueError):
            conf = 0.5

        price_move = str(data.get("priceMovement", "N/A")) or "N/A"

        return {
            "summary":         summary,
            "sentiment":       sentiment,
            "tradingSignal":   signal,
            "impactLevel":     impact,
            "affectedSectors": sectors,
            "entities":        entities,
            "confidenceScore": conf,
            "priceMovement":   price_move,
        }

    except json.JSONDecodeError as e:
        print(f"[groq_service] JSON parse error: {e} | raw: {raw!r}")
        return _fallback(article)
    except Exception as e:
        print(f"[groq_service] Error: {e}")
        return _fallback(article)


def _fallback(article: str = "") -> dict:
    return {
        "summary":         article or "Summary unavailable.",
        "sentiment":       "neutral",
        "tradingSignal":   "hold",
        "impactLevel":     "medium",
        "affectedSectors": ["General"],
        "entities":        [],
        "confidenceScore": 0.0,
        "priceMovement":   "N/A",
    }