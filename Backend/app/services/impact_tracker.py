import yfinance as yf


def track_prediction(ticker, predicted_direction):

    stock = yf.Ticker(ticker)

    hist = stock.history(period="2d")

    if len(hist) < 2:
        return {
            "error":"Not enough market data"
        }

    open_price=float(hist["Close"].iloc[-2])
    latest=float(hist["Close"].iloc[-1])

    pct=((latest-open_price)/open_price)*100

    actual="up" if pct>0 else "down"

    if predicted_direction.lower()=="buy":
        predicted="up"
    elif predicted_direction.lower()=="sell":
        predicted="down"
    else:
        predicted="neutral"

    accuracy=(
        "Correct"
        if predicted==actual
        else "Incorrect"
    )

    return {
      "ticker":ticker,
      "predicted":predicted,
      "actual":actual,
      "price_change_percent":round(pct,2),
      "accuracy":accuracy
    }