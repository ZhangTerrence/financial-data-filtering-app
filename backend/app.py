from os import environ

import requests
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)

app.config["API_KEY"] = environ.get("API_KEY")

CORS(app, origins="*")


@app.route("/")
def index():
    response = requests.get(
        f"https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey={app.config["API_KEY"]}")
    data = response.json()

    column = request.args.get("column")

    # Filter
    argmin = request.args.get("min")
    argmax = request.args.get("max")
    if column and argmin and argmax:
        data = list(filter(lambda x: int(argmin) <= (int(x["calendarYear"]) if column == "date" else x[column]) <= int(argmax),
                      list(data)))

    # Sort
    asc = request.args.get("asc")
    if column and asc:
        data.sort(key=lambda x: x[column], reverse=(asc == "false"))

    return data
