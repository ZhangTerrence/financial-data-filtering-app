from flask import Flask, request
from flask_cors import CORS
from flask_caching import Cache
import os
import requests

app = Flask(__name__)
cache = Cache(app, config={
    "CACHE_TYPE": "RedisCache",
    "CACHE_REDIS_HOST": os.environ.get("REDIS_HOST"),
    "CACHE_REDIS_PORT": os.environ.get("REDIS_PORT"),
    "CACHE_REDIS_DB": os.environ.get("REDIS_DB")
})
CORS(app, origins="*")


@app.route("/")
@cache.cached(timeout=600, query_string=True)
def index():
    url = "https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey="
    response = requests.get(f"{url}{os.environ.get("API_KEY")}")
    data = response.json()

    arg_column = request.args.get("column")

    # Filter
    arg_min = request.args.get("min")
    arg_max = request.args.get("max")
    if arg_column and arg_min and arg_max:
        if arg_column == "date":
            data = list(filter(lambda x: int(arg_min) <= int(x["calendarYear"]) <= int(arg_max), list(data)))
        else:
            data = list(filter(lambda x: int(arg_min) <= x[arg_column] <= int(arg_max), list(data)))

    # Sort
    asc = request.args.get("asc")
    if arg_column and asc:
        data.sort(key=lambda x: x[arg_column], reverse=(asc == "false"))

    return data
