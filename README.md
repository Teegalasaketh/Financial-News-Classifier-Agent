# 📊 Financial News Classifier Agent

A modern web-based application that analyzes financial news articles, classifies them, and provides insights such as sentiment, sector impact, and trading signals.

Built using **React + TypeScript + Vite**, with a clean UI powered by **Tailwind CSS** and **shadcn/ui components**.

---

## 🚀 Features

* 📰 **News Analysis**

  * Input financial news text
  * Automatic classification and processing

* 😊 **Sentiment Analysis**

  * Detects positive, negative, or neutral sentiment
  * Visualized using charts

* 🏭 **Sector Classification**

  * Identifies affected market sectors
  * Displays sector-wise heatmaps

* 📈 **Trading Signals**

  * Generates actionable insights based on news sentiment

* 📊 **Data Visualization**

  * Interactive charts (Recharts)
  * Stats dashboard and summaries

---

## 🛠️ Tech Stack

* **Frontend:** React 18 + TypeScript
* **Build Tool:** Vite
* **UI Framework:** Tailwind CSS + shadcn/ui
* **State/Data Handling:** React Query
* **Charts:** Recharts
* **Backend Integration (optional):** Supabase

---

## 📂 Project Structure

```
Financial-News-Classifier-Agent/
│
├── public/                # Static assets
├── src/
│   ├── components/        # UI & feature components
│   │   ├── NewsAnalyzer.tsx
│   │   ├── NewsCard.tsx
│   │   ├── SentimentChart.tsx
│   │   ├── SectorHeatmap.tsx
│   │   ├── TradingSignals.tsx
│   │   └── ui/            # Reusable UI components
│   │
│   ├── App.tsx            # Main app entry
│   └── App.css            # Styles
│
├── index.html
├── package.json
└── vite.config (implicit)
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Financial-News-Classifier-Agent
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run development server

```bash
npm run dev
```

App will run at:

```
http://localhost:5173
```

---

## 🧪 Testing

```bash
npm run test
```

---

## 📦 Build for Production

```bash
npm run build
npm run preview
```

---

## 🔐 Environment Variables

Create a `.env` file if using Supabase or APIs:

```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

---

## 💡 Future Improvements

* 🔍 Real-time news API integration
* 🤖 Advanced ML/NLP models for classification
* 📱 Mobile responsiveness improvements
* 🧠 AI-based trading recommendations
* 🌐 Multi-language support

---

## 📄 License

This project is for educational and development purposes.

---

## 👨‍💻 Author

Developed as part of a financial analytics and AI-based classification project.

---

## ⭐ Contributing

Feel free to fork, improve, and submit pull requests!

---
