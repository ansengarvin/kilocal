import pytest
import requests

# Delete the test user
def test_delete():
    url = "http://localhost:8000/users/" + pytest.user_id
    response = requests.delete(url, headers = pytest.header)
    assert response.status_code == 204