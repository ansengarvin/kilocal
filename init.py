import requests
from datetime import datetime, timedelta
from dotenv import dotenv_values
import firebase_admin

today = datetime.today()
config = dotenv_values(".env")

entries = [
    {
        "date": (today).strftime("%Y-%m-%d"),
        "name": "Omlette",
        "amount": 1,
        "calories": 450,
        "carbs": 5,
        "protein": 20,
        "fat": 30
    },
    {
        "date": (today).strftime("%Y-%m-%d"),
        "name": "Apple",
        "amount": 3,
        "calories": 95,
        "carbs": 25,
        "protein": 1,
        "fat": 0
    },
    {
        "date": (today).strftime("%Y-%m-%d"),
        "name": "Banana",
        "amount": 2,
        "calories": 105,
        "carbs": 27,
        "protein": 1,
        "fat": 0.5
    },
    {
        "date": (today).strftime("%Y-%m-%d"),
        "name": "Steak",
        "amount": 1,
        "calories": 600,
        "carbs": 0,
        "protein": 60,
        "fat": 40
    },
    {
        "date": (today - timedelta(days=1)).strftime("%Y-%m-%d"),
        "name": "Toast",
        "amount": 1,
        "calories": 200,
        "carbs": 30,
        "protein": 5,
        "fat": 5
    },
    {
        "date": (today - timedelta(days=1)).strftime("%Y-%m-%d"),
        "name": "Tuna Sandwich",
        "amount": 1,
        "calories": 500,
        "carbs": 40,
        "protein": 30,
        "fat": 20
    },
    {
        "date": (today - timedelta(days=1)).strftime("%Y-%m-%d"),
        "name": "Pasta",
        "amount": 1,
        "calories": 400,
        "carbs": 70,
        "protein": 15,
        "fat": 5
    },
    {
        "date": (today - timedelta(days=1)).strftime("%Y-%m-%d"),
        "name": "Chicken",
        "amount": 2,
        "calories": 300,
        "carbs": 0,
        "protein": 30,
        "fat": 20
    },
    {
        "date": (today - timedelta(days=2)).strftime("%Y-%m-%d"),
        "name": "Cereal",
        "amount": 1,
        "calories": 250,
        "carbs": 50,
        "protein": 5,
        "fat": 2
    },
    {
        "date": (today - timedelta(days=2)).strftime("%Y-%m-%d"),
        "name": "Salad",
        "amount": 1,
        "calories": 150,
        "carbs": 10,
        "protein": 5,
        "fat": 10
    },  
    {
        "date": (today - timedelta(days=2)).strftime("%Y-%m-%d"),
        "name": "Burger",
        "amount": 1,
        "calories": 700,
        "carbs": 50,
        "protein": 30,
        "fat": 40
    },
    {
        "date": (today - timedelta(days=3)).strftime("%Y-%m-%d"),
        "name": "Pancakes",
        "amount": 1,
        "calories": 350,
        "carbs": 50,
        "protein": 10,
        "fat": 10

    },
    {
        "date": (today - timedelta(days=3)).strftime("%Y-%m-%d"),
        "name": "Pizza",
        "amount": 1,
        "calories": 800,
        "carbs": 100,
        "protein": 30,
        "fat": 40
    }
]

credential = firebase_admin.credentials.Certificate('./backend/lib/keys/service.json')
default_app = firebase_admin.initialize_app()

# Creating entries for manual testing
print("Creating entries:")
print("    ", end="")
for i in range(len(entries)):
    url = "http://localhost:8000/days/" + entries[i]["date"] + "/food"
    data = {
        "name": entries[i]["name"],
        "calories": entries[i]["calories"],
        "amount": entries[i]["amount"],
        "carbs": entries[i]["carbs"],
        "protein": entries[i]["protein"],
        "fat": entries[i]["fat"]
    }
    headers = {'Authorization': 'Bearer ' + token}
    response = requests.post(url, json=data, headers=headers, timeout=10)
    if response.status_code != 200:
        f"Failed to create entry: {data}, status code: {response.status_code}"
    print(i, end=" ")
print("")
