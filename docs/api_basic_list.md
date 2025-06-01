# List of basic API paths

This is the most basic list of possible paths for the RESTful API here.

## Paths

### User Entries
* /users
    * POST (create new user)

* /users/sync
    * POST (sync)

* /users/{id}
    * GET (information from a single user acct)
    * PUT (edit user info)
    * DELETE (deletes the user and all associated data)

* /users/{id}/recipes/
    * GET (all recipes that the user has)

* /users/{id}/days/
    * GET (all information for a users' days)

* /users/{id}/days/{date}
    * GET (all information for a users' day)

### Day Entries
All of these operations are authenticated and will take the user's ID from the token.

* /days
    * POST
        * Creates a new day with the given date.

* /days/{date}
    * GET (get a single day)
        * Creates a new day if the day doesn't already exist.

* /days/{date}/food
    * POST
        * Adds a non-recipe calorie entry into the user's day.
        * Creates day if does not exist.

* /days/{date}/food/{food_id}
    * DELETE
        * Deletes the food item from the day.

* /days/{date}/recipes
    * POST
        * Adds a recipe from the user's list of recipes into the day.
        * Returns the ID of the recipe-day entry
        * Creates day if does not exist

* /days/{date}/recipes/{day_recipe_id}
    * DELETE
        * Deletes the recipe from the day.
        * Requires the id of the day_recipes table, NOT the recipe itself.