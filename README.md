# Financial Data Filtering App

Deployed App: [https://financial-data-filtering-app-frontend.onrender.com/](https://financial-data-filtering-app-frontend.onrender.com/)

## How to Run Locally

First create `.env` files for both the frontend and backend following the examples in the `.env.example` files.

### With Docker

The simplest way to run this app locally is by using Docker. Simply run, in the root directory,

```shell
docker compose up --build
```

and the frontend and backend of the app should be ready on ports 3000 and 8080 respectively.

### Without Docker

Without Docker, Redis must be installed on the host machine as it is used for caching the API calls made by the backend
to reduce usage. The only other requirements are to have both NPM and Python installed.

#### Frontend

Run the following from the root directory:

```shell
cd frontend
npm i
npm run dev
```

### Backend

Run the following from the root directory:

```shell
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
flask run -p 8080
```