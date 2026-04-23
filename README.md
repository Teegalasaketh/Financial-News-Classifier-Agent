# 📊 Financial News Classifier Agent

A modern web-based application that analyzes financial news articles using **Groq-powered AI**, classifies them, and generates insights like sentiment, sector impact, and trading signals.

Built with **React + TypeScript + Vite**, and powered by **Groq LLM API** for fast inference.

---

## 🚀 Features

* 📰 **News Analysis (AI-Powered)**

  * Input financial news text
  * Processed using Groq LLMs for intelligent classification

* 😊 **Sentiment Analysis**

  * Positive / Negative / Neutral detection
  * AI-driven interpretation of tone

* 🏭 **Sector Classification**

  * Identifies impacted industries (e.g., Tech, Banking, Energy)

* 📈 **Trading Signals**

  * Generates insights like Buy / Sell / Hold based on sentiment

* ⚡ **Ultra-fast Inference**

  * Powered by **Groq API** for low-latency responses

* 📊 **Visualization**

  * Charts and dashboards using Recharts

---

## 🛠️ Tech Stack

* **Frontend:** React 18 + TypeScript
* **Build Tool:** Vite
* **UI:** Tailwind CSS + shadcn/ui
* **Charts:** Recharts
* **API / AI Engine:** Groq LLM API
* **Optional Backend:** Supabase / Serverless Functions

---

## 📂 Project Structure

```
Financial-News-Classifier-Agent/
│
├── public/
├── src/
│   ├── components/
│   │   ├── NewsAnalyzer.tsx
│   │   ├── SentimentChart.tsx
│   │   ├── SectorHeatmap.tsx
│   │   ├── TradingSignals.tsx
│   │   └── ui/
│   │
│   ├── App.tsx
│   └── App.css
│
├── index.html
├── package.json
```

---

## ⚙️ Setup & Installation

### 1. Clone repo

```bash
git clone <repo-url>
cd Financial-News-Classifier-Agent
```

### 2. Install dependencies

```bash
npm install
```

---

## 🔑 Groq API Setup

1. Go to Groq and create an account
2. Generate an API key
3. Create a `.env` file in the root:

```
VITE_GROQ_API_KEY=your_api_key_here
```

---

## ▶️ Run the App

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

---

## 🧠 How It Works

1. User inputs financial news text
2. The app sends the text to **Groq LLM API**
3. AI processes:

   * Sentiment
   * Sector classification
   * Trading signal
4. Results are displayed via charts and UI components

---

## 📦 Build

```bash
npm run build
npm run preview
```

---

## 🔮 Future Improvements

* 🔍 Live financial news API integration
* 🤖 Fine-tuned financial ML models
* 📊 Portfolio impact analysis
* 📱 Mobile optimization
* 🧠 Multi-agent AI reasoning

---

## 📄 License

For educational and experimental use.

---

## 👨‍💻 Author

AI + Finance project using Groq inference engine.

---

## ⭐ Contributing

Pull requests are welcome!
