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

    ## Testing day food get
    url_get = "http://localhost:8000/days/" + day.date
    response = requests.get(url_get, headers = pytest.header)
    assert response.status_code == 200, "days food GET returned wrong status code:"
    assert "food" in response.json(), "days food not present in return body"
    assert day.food[0]["name"] == response.json()["food"][0]["name"], "days food name does not match"
    assert day.food[0]["calories"] == response.json()["food"][0]["calories"], "days food calories does not match"
    
    food_id = response.json()["food"][0]["id"]
    
    ## Testing day food delete
    url = "http://localhost:8000/days/" + day.date + "/food/" + str(food_id)
    print(url)
    response = requests.delete(url, headers = pytest.header)
    assert response.status_code == 204, "days food DELETE returned wrong status code"
    response = requests.get(url_get, headers = pytest.header)
    assert response.json()["food"] == [], "days food not deleted"




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
