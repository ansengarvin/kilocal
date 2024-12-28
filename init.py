import requests
from datetime import datetime, timedelta
from dotenv import dotenv_values

today = datetime.today()
config = dotenv_values(".env")

entries = [
    {
        "date": (today).strftime("%Y-%m-%d"),
        "name": "Omlette",
        "calories": 450
    },
    {
        "date": (today).strftime("%Y-%m-%d"),
        "name": "Apple",
        "calories": 95
    },
    {
        "date": (today).strftime("%Y-%m-%d"),
        "name": "Banana",
        "calories": 105
    },
    {
        "date": (today).strftime("%Y-%m-%d"),
        "name": "Steak",
        "calories": 600
    },
    {
        "date": (today - timedelta(days=1)).strftime("%Y-%m-%d"),
        "name": "Toast",
        "calories": 200
    },
    {
        "date": (today - timedelta(days=1)).strftime("%Y-%m-%d"),
        "name": "Tuna Sandwich",
        "calories": 500
    },
    {
        "date": (today - timedelta(days=1)).strftime("%Y-%m-%d"),
        "name": "Pasta",
        "calories": 400
    },
    {
        "date": (today - timedelta(days=1)).strftime("%Y-%m-%d"),
        "name": "Chicken",
        "calories": 300
    },
    {
        "date": (today - timedelta(days=2)).strftime("%Y-%m-%d"),
        "name": "Cereal",
        "calories": 250
    },
    {
        "date": (today - timedelta(days=2)).strftime("%Y-%m-%d"),
        "name": "Salad",
        "calories": 150
    },  
    {
        "date": (today - timedelta(days=2)).strftime("%Y-%m-%d"),
        "name": "Burger",
        "calories": 700
    },
    {
        "date": (today - timedelta(days=3)).strftime("%Y-%m-%d"),
        "name": "Pancakes",
        "calories": 350
    },
    {
        "date": (today - timedelta(days=3)).strftime("%Y-%m-%d"),
        "name": "Pizza",
        "calories": 800
    }
]

print("Creating test user")
url = "http://localhost:8000/users"
data = {
    "name": config["TEST_NAME"],
    "email": config["TEST_EMAIL"],
    "password": config["TEST_PASSWORD"],
    "weight": float(config["TEST_WEIGHT"])
}
response = requests.post(url, json=data, timeout=10)
assert "id" in response.json()
assert response.json()["name"] == data["name"]
assert response.json()["email"] == data["email"]
assert response.json()["weight"] == data["weight"]
assert response.status_code == 201

# Logging in with test user
print("Logging in with test user")
url = "http://localhost:8000/users/login"
data = {
    "email": config["TEST_EMAIL"],
    "password": config["TEST_PASSWORD"]
}
response = requests.post(url, json=data, timeout=10)
assert "token" in response.json(), "No token in response"
token = response.json()["token"]

# Creating entries for manual testing
print("Creating entries:")
print("    ", end="")
for i in range(len(entries)):
    url = "http://localhost:8000/days/" + entries[i]["date"] + "/food"
    data = {
        "name": entries[i]["name"],
        "calories": entries[i]["calories"]
    }
    headers = {'Authorization': 'Bearer ' + token}
    response = requests.post(url, json=data, headers=headers, timeout=10)
    if response.status_code != 200:
        f"Failed to create entry: {data}, status code: {response.status_code}"
    print(i, end=" ")
print("")
