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

def test_user_get():
    url = f"http://localhost:8000/users"
    response = requests.get(url, headers=pytest.header, timeout=10)
    assert response.status_code == 200
    assert response.json()["id"] == int(pytest.user_id)

