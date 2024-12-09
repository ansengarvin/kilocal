import requests
import json
from dotenv import dotenv_values

config = dotenv_values(".env")
token = None

def test_config():
    print("Secret Key:", config["SECRET_KEY"])
    print("Test Password:", config["TEST_PASSWORD"])
    assert config["SECRET_KEY"]
    assert config["TEST_EMAIL"]
    assert config["TEST_PASSWORD"]

# 404 Testing
def test_404():
    url = "http://localhost:8000/does_not_exist"
    response = requests.get(url)
    assert response.status_code == 404
    assert "error" in response.json()

# Testing user creation
def test_create_user():
    url = "http://localhost:8000/users"
    data = {
        "name": "John Doe",
        "email": config["TEST_EMAIL"],
        "password": config["TEST_PASSWORD"],
        "weight": 150
    }
    response = requests.post(url, json=data)
    assert response.status_code == 201
    assert "id" in response.json()
    assert response.json()["name"] == data["name"]
    assert response.json()["email"] == data["email"]
    assert response.json()["weight"] == data["weight"]

# Testing creation of a duplicate user
def test_duplicate_user():
    url = "http://localhost:8000/users"
    data = {
        "name": "John Doe",
        "email": "johndoe@ansengarvin.com",
        "password": "password",
        "weight": 150
    }
    response = requests.post(url, json=data)
    assert response.status_code == 403

def test_login():
    url = "http://localhost:8000/login"
    data = {
        "email": config["TEST_EMAIL"],
        "password": config["TEST_PASSWORD"]
    }
    response = requests.post(url, json=data)
    assert response.status_code == 200
    assert "token" in response.json()
    global token
    token = response.json()["token"]

def test_token():
    assert token
    print("Token:", token)

