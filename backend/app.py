from os import environ

import requests
from flask import Flask, request
from flask_cors import CORS
from flask_caching import Cache

app = Flask(__name__)
cache = Cache(app, config={
    "CACHE_TYPE": "RedisCache",
    "CACHE_REDIS_HOST": environ.get("REDIS_HOST"),
    "CACHE_REDIS_PORT": environ.get("REDIS_PORT"),
    "CACHE_REDIS_DB": environ.get("REDIS_DB")
})

CORS(app, origins="*")


@app.route("/")
@cache.cached(timeout=100, query_string=True)
def index():
    response = requests.get(
        f"https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey={environ.get("API_KEY")}")
    data = response.json()

    column = request.args.get("column")

    # Filter
    argmin = request.args.get("min")
    argmax = request.args.get("max")
    if column and argmin and argmax:
        data = list(
            filter(lambda x: int(argmin) <= (int(x["calendarYear"]) if column == "date" else x[column]) <= int(argmax),
                   list(data)))

    # Sort
    asc = request.args.get("asc")
    if column and asc:
        data.sort(key=lambda x: x[column], reverse=(asc == "false"))

    return data
