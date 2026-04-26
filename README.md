# README.md — Financial News Classifier Agent

# 📈 Financial News Classifier Agent

## Abstract
Financial analysts, traders, and portfolio managers struggle to process breaking economic news across thousands of sources in real time, often failing to separate market-moving events from noise due to sensational headlines, delayed reporting, and information overload.

Traditional news aggregators provide limited actionable intelligence, lacking:
- Market impact prediction
- Sector and asset effect mapping
- Real-time trading signals
- Event causality analysis

This project proposes an AI-powered Financial News Classifier Agent that ingests real-time financial news streams, classifies market sentiment, predicts affected sectors and assets, generates trading signals, and measures prediction accuracy using actual market outcomes.

The system combines:
- Real-time news ingestion
- Large Language Models (Groq API)
- Causal NLP analysis
- Historical market correlation engine
- Reinforcement learning from outcomes
- FastAPI backend + TypeScript frontend

--------------------------------------------------

# 🎯 Objectives

1. Classify financial news:
   - Bullish
   - Bearish
   - Neutral

2. Determine:
   - Impact level
   - Affected sectors
   - Affected assets

3. Generate:
   - Buy / Hold / Sell signals
   - Confidence scores
   - Price movement ranges

4. Detect:
   - Breaking news clusters
   - Historical analogs

5. Track:
   - 1-hour prediction accuracy
   - 1-day prediction accuracy

--------------------------------------------------

# 🚀 Key Features

## Real-Time News Monitoring
Sources:
- Alpha Vantage
- Finnhub
- NewsAPI
- Yahoo Finance

Features:
- Streaming ingestion
- Duplicate filtering
- Breaking-news detection
- Event clustering

--------------------------------------------------

## AI News Classification Agent

Classifies:

Sentiment:
- Bullish
- Bearish
- Neutral

Impact:
- Low
- Medium
- High

Sectors:
- Technology
- Banking
- Energy
- Crypto
- Commodities

Assets:
- Stocks
- ETFs
- Forex
- Crypto

Powered By:
- Groq LLM
- Prompt engineering
- Causal NLP

--------------------------------------------------

## Trading Signal Generator

Sample Output:

{
 signal: BUY
 confidence: 87%
 expected_move: +2.4%
 horizon: 1D
}

Signals use:
- News sentiment
- Historical analogs
- Volatility
- Sector correlations

--------------------------------------------------

## Market Reaction Predictor

Predicts:
- Price direction
- Volatility probability
- Spillover effects

Uses:
- Correlation engine
- Similar event retrieval
- Reinforcement feedback

--------------------------------------------------

## Accuracy Tracker

Tracks:
- Hit ratio
- False signals
- Simulated PnL
- Confidence calibration

--------------------------------------------------

# 🧠 Tech Stack

Frontend:
- React
- TypeScript
- Tailwind
- WebSockets
- Recharts

Backend:
- FastAPI
- Python
- Groq API
- SQLite/PostgreSQL

AI:
- Groq LLM
- FinBERT optional
- Sentence Transformers
- RL feedback loop

--------------------------------------------------

# 📂 Project Structure

Financial-News-Classifier-Agent/
│
├── frontend/
│   ├── src/
│   │
│   ├── components/
│   │   ├── NewsAnalyzer.tsx
│   │   ├── TradingSignals.tsx
│   │   ├── SectorHeatmap.tsx
│   │   └── AccuracyTracker.tsx
│   │
│   ├── pages/
│   │   └── Dashboard.tsx
│   │
│   ├── api/
│   │   └── api.ts
│   │
│   ├── App.tsx
│   └── package.json
│
├── backend/
│   ├── app/
│   │
│   ├── main.py
│   │
│   ├── routes/
│   │   ├── classify.py
│   │   ├── signals.py
│   │   └── websocket.py
│   │
│   ├── services/
│   │   ├── groq_service.py
│   │   ├── news_stream_service.py
│   │   └── impact_tracker.py
│   │
│   ├── models/
│   │   └── prediction_model.py
│   │
│   └── requirements.txt
│
├── database/
│   └── news_predictions.db
│
└── README.md

--------------------------------------------------

# Backend Modules

main.py
- FastAPI app startup
- Registers routes
- Middleware
- WebSocket handling

--------------------------------------------------

routes/classify.py

POST /classify-news

Returns:
- Sentiment
- Impact
- Sector predictions
- Asset mapping

--------------------------------------------------

routes/signals.py

POST /generate-signal
GET /signals/live

Outputs:
- Buy/Hold/Sell
- Confidence score
- Price estimate

--------------------------------------------------

routes/websocket.py

Streams:
- Breaking news
- Live signals
- Accuracy updates

--------------------------------------------------

services/groq_service.py

Responsibilities:
- Groq prompting
- Financial reasoning
- Causal extraction
- Signal generation

Prompt Example:

Analyze this news:
Classify sentiment
Predict impacted sectors
Generate trading signal
Return confidence score

--------------------------------------------------

services/news_stream_service.py

Handles:
- News APIs
- Deduplication
- Event clustering

--------------------------------------------------

services/impact_tracker.py

Pipeline:

Prediction
↓
Actual market movement
↓
Accuracy score

Stores:
- 1 hr results
- 1 day results
- Reinforcement feedback

--------------------------------------------------

models/prediction_model.py

Hybrid model:
- Similarity matching
- Confidence scoring
- Market reaction prediction

--------------------------------------------------

# Frontend Dashboard

Dashboard Includes:

1 News Analyzer
- Incoming articles
- Sentiment labels
- Impact score

2 Trading Signals
Example:

BUY TSLA
Confidence 82%
Expected Move +3.1%

3 Sector Heatmap
Shows sector reactions:
- Green bullish
- Red bearish

4 Accuracy Tracker
Displays:
- Hit rate
- Sharpe ratio
- Confidence calibration

--------------------------------------------------

# API Endpoints

POST /api/classify

Input:

{
 "headline":"Fed signals interest rate cuts"
}

Output:

{
 "sentiment":"bullish",
 "impact":"high",
 "sectors":["Banking","Tech"],
 "assets":["SPY","QQQ"],
 "confidence":91
}

--------------------------------

POST /api/signal

Response:

{
 "signal":"BUY",
 "confidence":87,
 "expected_move":"+2.4%"
}

--------------------------------

GET /api/accuracy

--------------------------------------------------

# Groq Integration

Why Groq:
- Ultra low latency
- Fast inference
- Financial reasoning

.env

GROQ_API_KEY=your_key
NEWS_API_KEY=your_news_key
DATABASE_URL=sqlite:///database/news_predictions.db

--------------------------------------------------

# Installation

Clone:

git clone https://github.com/yourrepo/Financial-News-Classifier-Agent.git

cd Financial-News-Classifier-Agent

--------------------------------------------------

Backend:

cd backend

pip install -r requirements.txt

uvicorn app.main:app --reload

--------------------------------------------------

Frontend:

cd frontend

npm install

npm run dev

--------------------------------------------------

requirements.txt

fastapi
uvicorn
groq
sqlalchemy
requests
websockets
pydantic
python-dotenv
scikit-learn
pandas
numpy

--------------------------------------------------

# Workflow

News Feed
↓
Stream Processor
↓
Groq Classification
↓
Sector Mapping
↓
Signal Generator
↓
Accuracy Tracker
↓
RL Feedback Loop

--------------------------------------------------

# Reinforcement Learning Feedback

Prediction
↓
Store signal
↓
Observe market outcome
↓
Reward or penalty
↓
Adjust future confidence

Improves:
- Reliability
- Event analog detection
- Risk calibration

--------------------------------------------------

# Example Use Cases

Example 1

News:
NVIDIA beats earnings expectations

Output:
Bullish
High Impact

Affected:
- Semiconductors
- Nasdaq

Signal:
BUY NVDA
Confidence 89%

--------------------------------------------------

Example 2

News:
Oil supply disruption

Output:
Bullish Energy
Bearish Airlines

Signals:
BUY XOM
SELL Airline ETF

--------------------------------------------------

# Evaluation Metrics

Classification:
- Precision
- Recall
- F1 Score

Trading:
- Signal Hit Rate
- Sharpe Ratio
- Drawdown

Prediction:
- 1hr Accuracy
- 1day Accuracy

--------------------------------------------------

# Future Enhancements

- Multi-agent debate
- Vector DB memory
- RAG historical event retrieval
- Autonomous trading bot
- Portfolio optimizer
- Options signal generation