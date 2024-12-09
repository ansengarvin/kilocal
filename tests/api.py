import requests
import pytest
import json
import jwt
from dotenv import dotenv_values

config = dotenv_values(".env")
token = None

@pytest.mark.skip("Helper function")
def test_token(token):
    try:
        contents = jwt.decode(token, config["SECRET_KEY"], algorithms="HS256")
        assert "sub" in contents
        assert "admin" in contents
    except:
        assert "JWT decoding failed" == False

def test_config():
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
    test_config()
    url = "http://localhost:8000/users"
    data = {
        "name": "John Doe",
        "email": config["TEST_EMAIL"],
        "password": config["TEST_PASSWORD"],
        "weight": 150
    }
    response = requests.post(url, json=data, timeout=10)
    assert "id" in response.json()
    assert response.json()["name"] == data["name"]
    assert response.json()["email"] == data["email"]
    assert response.json()["weight"] == data["weight"]
    assert response.status_code == 201


# Testing a valid login.
def test_login():
    test_config()
    url = "http://localhost:8000/login"
    data = {
        "email": config["TEST_EMAIL"],
        "password": config["TEST_PASSWORD"]
    }
    response = requests.post(url, json=data, timeout=10)
    assert "token" in response.json()
    assert response.status_code == 200
    test_token(response.json()["token"])
    global token
    token = response.json()["token"]

if __name__ == "__main__":
    test_create_user()

