import pytest
import requests

class Day:
    def __init__(self, date):
        self.date = date
        self.food = [
            {
                "name": "Banana",
                "amount": 2,
                "calories": 80,
                "carbs": 27,
                "protein": 1.3,
                "fat": 0.4
            }
        ]
        self.recipes = [
            {
                "id": 1,
                "name": "PB Sandwich",
                "food": [
                    {
                        "name": "PB",
                        "amount": 1,
                        "calories": 90,
                        "carbs": 3,
                        "protein": 4,
                        "fat": 8
                    },
                    {
                        "name": "Bread",
                        "amount": 2,
                        "calories": 180,
                        "carbs": 30,
                        "protein": 6,
                        "fat": 2
                    }
                ]
            }
        ]
        self.food_calorie_total = 180
        self.food_carb_total = 54
        self.food_protein_total = 2.6
        self.food_fat_total = 0.8

        self.recipe_calorie_total = 450
        self.recipe_carb_total = 66
        self.recipe_protein_total = 14
        self.recipe_fat_total = 10

        self.total_calorie_total = 630
        self.total_carb_total = 120
        self.total_protein_total = 16.6
        self.total_fat_total = 10.8

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
    assert day.food[0]["amount"] == response.json()["food"][0]["amount"], "days food amount does not match"
    assert day.food[0]["calories"] == response.json()["food"][0]["calories"], "days food calories does not match"
    assert day.food[0]["carbs"] == response.json()["food"][0]["carbs"], "days food carbs does not match"
    assert day.food[0]["protein"] == response.json()["food"][0]["protein"], "days food protein does not match"
    assert day.food[0]["fat"] == response.json()["food"][0]["fat"], "days food fat does not match"

    ## TODO: Total will eventually reflect both food and recipe totals. This test will need to be changed.
    assert day.food_total == response.json()["total"], "days food total does not match"
    
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
