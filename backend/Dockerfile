FROM python:latest

WORKDIR /app

COPY requirements.txt .

RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 8080

CMD [ "python3", "-m" , "flask", "run", "--host", "0.0.0.0", "--port", "8080" ]