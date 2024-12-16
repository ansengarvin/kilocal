import pytest
import requests

class TestDays:
    def test_day_create(self):
        url = "http://localhost:8000/days"
        data = {
            "date": "2021-01-01"
        }
        response = requests.post(url, json=data, headers = pytest.header)
        assert response.status_code == 201
        assert "id" in response.json()
        self.day_id = response.json()["id"]

    def test_day_create_duplicte(self):
        print(self.day_id)
        url = "http://localhost:8000/days"
        data = {
            "date": "2021-01-01"
        }
        response = requests.post(url, json=data, headers = pytest.header)
        assert response.status_code == 400

    def test_day_create_unauthorized(self):
        url = "http://localhost:8000/days"
        data = {
            "date": "2021-01-01"
        }
        response = requests.post(url, json=data)
        assert response.status_code == 401

    def test_day_create_baddata(self):
        url = "http://localhost:8000/days"
        data = {
            "no": "data"
        }
        response = requests.post(url, json=data, headers = pytest.header)
        assert response.status_code == 400

    

    