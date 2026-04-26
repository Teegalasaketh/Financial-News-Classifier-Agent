from fastapi import APIRouter
from app.services.impact_tracker import track_prediction

router=APIRouter()


@router.get("/signals")
def get_signals():

    return {
      "signals":[
        {
         "asset":"AAPL",
         "signal":"BUY",
         "confidence":87
        }
      ]
    }


@router.get("/accuracy/{ticker}/{signal}")
def check_accuracy(
 ticker:str,
 signal:str
):
    return track_prediction(
      ticker,
      signal
    )