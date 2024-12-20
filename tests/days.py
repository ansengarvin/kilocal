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

def test_day_food_delete_unauthorized():
    # Creates a user
    url = "http://localhost:8000/users"
    data = {
        "name": "Bad Actor",
        "email": "unauthorized@ansengarvin.com",
        "password": "password",
    }
    response = requests.post(url, json=data)

    # Log in as user
    url = "http://localhost:8000/users/login"
    data = {
        "email": "unauthorized@ansengarvin.com",
        "password": "password"
    }
    response = requests.post(url, json=data)
    wrong_header = {'Authorization': 'Bearer ' + response.json()["token"]}

    # Create a day and food entry in the day
    day = Day("2004-11-11")
    url = "http://localhost:8000/days/" + day.date + "/food"
    data = day.food[0]
    response = requests.post(url, json=data, headers = pytest.header)
    food_id = response.json()["id"]

    # Try to delete food as unauthorized user.
    # Returns 404 instead of 401 because it references the user's day id associated with the date with the food id.
    # If that food id isn't a part of that day, then 404.
    url = "http://localhost:8000/days/" + day.date + "/food/" + str(food_id)
    response = requests.delete(url, headers = wrong_header)
    assert response.status_code == 404

def test_setup_manual():
    ## Re-post some day stuff for manual testing
    url = "http://localhost:8000/days/" + "2024-12-19" + "/food"
    data = {"name": "Cookie", "calories": 180}
    response = requests.post(url, json=data, headers = pytest.header)
    assert response.status_code == 201, "manual test days food POST returned wrong status code"
    assert "id" in response.json(), "manual test days food ID not present in return body"

    url = "http://localhost:8000/days/" + "2024-12-19" + "/food"
    data = {"name": "Milk", "calories": 170}
    response = requests.post(url, json=data, headers = pytest.header)
    assert response.status_code == 201, "manual test days food POST returned wrong status code"
    assert "id" in response.json(), "manual test days food ID not present in return body"

    url = "http://localhost:8000/days/" + "2024-12-18" + "/food"
    data = {"name": "Apple", "calories": 20}
    response = requests.post(url, json=data, headers = pytest.header)
    assert response.status_code == 201, "manual test days food POST returned wrong status code"
    assert "id" in response.json(), "manual test days food ID not present in return body"

    url = "http://localhost:8000/days/" + "2024-12-17" + "/food"
    data = {"name": "Cake", "calories": 2000}
    response = requests.post(url, json=data, headers = pytest.header)
    assert response.status_code == 201, "manual test days food POST returned wrong status code"
    assert "id" in response.json(), "manual test days food ID not present in return body"


