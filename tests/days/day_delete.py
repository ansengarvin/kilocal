import requests
import pytest

def test_day_delete():
    url = "http://localhost:8000/days"
    data = {
        "date": "2024-12-10"
    }
    response = requests.post(url, json=data, headers = pytest.header)
    assert response.status_code == 201
    day_id = response.json()["id"]

    # Deletes the day
    url = "http://localhost:8000/days/" + day_id
    response = requests.delete(url, headers = pytest.header)
    assert response.status_code == 204

    # TODO Checks if day still exists


def test_day_delete_unauthorized():
    url = "http://localhost:8000/days/"
