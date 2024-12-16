import requests
import pytest

###
# NOTE:
# test_delete() is inside of the cleanup test folder, so we can delete the test user last (once all other tests are complete).
###

def test_user_delete_unauthorized():
    url = "http://localhost:8000/users/" + pytest.user_id
    response = requests.delete(url)
    assert response.status_code == 401


def test_user_delete_forbidden():
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

    # Tries to delete generic user with test user
    url = "http://localhost:8000/users/" + str(id_a)
    response = requests.delete(url, headers = pytest.header)
    assert response.status_code == 403

    # Cleanup generic user
    url = "http://localhost:8000/users/login"
    data = {
        "email": "a@ansengarvin.com",
        "password": "hunter2"
    }
    response = requests.post(url, json=data, timeout=10)
    assert response.status_code == 200
    token_a = response.json()["token"]
    url = "http://localhost:8000/users/" + str(id_a)
    response = requests.delete(url, headers = {"Authorization": "Bearer " + token_a})
    assert response.status_code == 204