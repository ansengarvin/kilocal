import pytest
import requests

class Day:
    def __init__(self, date):
        self.date = date
        self.food = [
            {
                "calories": 80,
                "name": "Banana" 
            }
        ]
        self.recipes = [
            {
                "id": 1,
                "name": "PB Sandwich",
                "food": [
                    {
                        "name": "PB",
                        "calories": 90
                    },
                    {
                        "name": "Bread",
                        "calories": 180
                    }
                ]
            }
        ]

        url = "http://localhost:8000/days"
        data = {
            "date": self.date
        }
        response = requests.post(url, json=data, headers = pytest.header)
        self.id = response.json()["id"]

        assert response.status_code == 201
        assert "id" in response.json()
 
def test_day():
    # Testing day create
    day = Day("2003-11-11")

    ## Testing day food post
    print(day.date)
    url = "http://localhost:8000/days/" + day.date + "/food"
    data = day.food[0]

    response = requests.post(url, json=data, headers = pytest.header)
    assert response.status_code == 201, "days food POST returned wrong status code"
    assert "id" in response.json(), "days food ID not present in return body"


#####################
# Edge Case Testing #
#####################
def test_day_create_duplicate():
    # Creates a day
    day = Day("2001-11-11")

    # Duplicates the above day
    url = "http://localhost:8000/days"
    data = {
        "date": "2001-11-11"
    }
    response = requests.post(url, json=data, headers = pytest.header)
    assert response.status_code == 400

def test_day_create_unauthorized():
    url = "http://localhost:8000/days"
    data = {
        "date": "2002-11-11"
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
