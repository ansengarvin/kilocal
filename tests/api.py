import requests
import pytest
import json
import jwt
from dotenv import dotenv_values

config = dotenv_values(".env")

def pytest_configure():
    pytest.user_id = None
    pytest.token = None
    pytest.header = None

@pytest.mark.skip("Helper function")
def test_token(token):
    try:
        contents = jwt.decode(token, config["SECRET_KEY"], algorithms="HS256")
        return "sub" in contents and "admin" in contents
    except:
        return False

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
    pytest.user_id = str(response.json()["id"])
    assert response.json()["name"] == data["name"]
    assert response.json()["email"] == data["email"]
    assert response.json()["weight"] == data["weight"]
    assert response.status_code == 201


# Testing a valid login.
def test_login():
    test_config()
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

def test_delete_unauthorized():
    test_config()
    url = "http://localhost:8000/users/" + pytest.user_id
    response = requests.delete(url)
    assert response.status_code == 401

def test_delete():
    test_config()
    url = "http://localhost:8000/users/" + pytest.user_id
    response = requests.delete(url, headers = pytest.header)
    assert response.status_code == 204

def test_delete_unauthorized_user():
    # Creates a generic user
    url = "http://localhost:8000/users"
    data = {
        "name": "Ansen Doe",
        "email": "a@ansengarvin.com",
        "password": "hunter2"
    }
    response = requests.post(url, json=data, timeout=10)
    assert response.status_code == 201
    id_a = response.json()["id"]
    data = {
        "name": "Bobby Doe",
        "email": "b@ansengarvin.com",
        "password": "hunter2"
    }
    response = requests.post(url, json=data, timeout=10)
    assert response.status_code == 201
    id_b = response.json()["id"]

    # Login with both users
    url = "http://localhost:8000/users/login"
    data = {
        "email": "a@ansengarvin.com",
        "password": "hunter2"
    }
    response = requests.post(url, json=data, timeout=10)
    assert response.status_code == 200
    token_a = response.json()["token"]
    data = {
        "email": "b@ansengarvin.com",
        "password": "hunter2"
    }
    response = requests.post(url, json=data, timeout=10)
    assert response.status_code == 200
    token_b = response.json()["token"]

    # First user tries to delete second user with their own token
    url = "http://localhost:8000/users/" + str(id_b)
    response = requests.delete(url, headers = {'Authorization': 'Bearer ' + token_a})
    assert response.status_code == 401

    # Database Cleanup
    url = "http://localhost:8000/users/" + str(id_a)
    response = requests.delete(url, headers = {'Authorization': 'Bearer ' + token_a})
    assert response.status_code == 204
    url = "http://localhost:8000/users/" + str(id_b)
    response = requests.delete(url, headers = {'Authorization': 'Bearer ' + token_b})
    assert response.status_code == 204


if __name__ == "__main__":
    test_create_user()

