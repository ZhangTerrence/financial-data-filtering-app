from os import environ

import requests
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

app.config["API_KEY"] = environ.get("API_KEY")

CORS(app, origins="*")

@app.route('/')
def index():
    response = requests.get(f"https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey={app.config['API_KEY']}")
    data = response.json()

    return data