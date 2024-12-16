import requests
import pytest
def test_day_create_unauthorized():
    url = "http://localhost:8000/days"
    data = {
        "date": "2021-01-01"
    }
    response = requests.post(url, json=data)
    assert response.status_code == 401

def test_day_create_baddata():
    url = "http://localhost:8000/days"
    data = {
        "no": "data"
    }
    response = requests.post(url, json=data, headers = pytest.header)
    assert response.status_code == 400

def test_day_create():
    url = "http://localhost:8000/days"
    data = {
        "date": "2021-01-01"
    }
    response = requests.post(url, json=data, headers = pytest.header)
    assert response.status_code == 201
    assert "id" in response.json()

def test_day_create_duplicte():
    url = "http://localhost:8000/days"
    data = {
        "date": "2021-01-01"
    }
    response = requests.post(url, json=data, headers = pytest.header)
    assert response.status_code == 400