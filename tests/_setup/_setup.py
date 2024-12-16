import pytest
import requests
from dotenv import dotenv_values
import jwt

@pytest.mark.skip("Helper function")
def test_token(token):
    try:
        contents = jwt.decode(token, config["SECRET_KEY"], algorithms="HS256")
        return "sub" in contents and "admin" in contents
    except:
        return False

config = dotenv_values(".env")

def pytest_configure():
    pytest.user_id = None
    pytest.token = None
    pytest.header = None
    pytest.date_increment = 0

# Testing user creation
def test_create_user():
    url = "http://localhost:8000/users"
    data = {
        "name": "John Doe",
        "email": config["TEST_EMAIL"],
        "password": config["TEST_PASSWORD"],
        "weight": 150
    }
    response = requests.post(url, json=data, timeout=10)
    assert "id" in response.json()
    pytest.user_id = str(response.json()["id"])
    assert response.json()["name"] == data["name"]
    assert response.json()["email"] == data["email"]
    assert response.json()["weight"] == data["weight"]
    assert response.status_code == 201

# Testing a valid login.
def test_login():
    assert config["TEST_EMAIL"]
    assert config["TEST_PASSWORD"]
    url = "http://localhost:8000/users/login"
    data = {
        "email": config["TEST_EMAIL"],
        "password": config["TEST_PASSWORD"]
    }
    response = requests.post(url, json=data, timeout=10)
    assert "id" in response.json()
    assert "token" in response.json()
    assert response.status_code == 200
    assert test_token(response.json()["token"])
    pytest.user_id = str(response.json()["id"])
    pytest.token = response.json()["token"]
    pytest.header = {'Authorization': 'Bearer ' + pytest.token}