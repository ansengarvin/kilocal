# List of basic API paths

This is the most basic list of possible paths for the RESTful API here.

For more detail, look at [api.yaml](./api.yaml) (Recommended to copy/paste it into the [Swagger.IO Editor](https://editor.swagger.io/) for the best viewing experience)

## Paths

### User Entries
* /users
    * POST (create new user)

* /users/login
    * POST (login)

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

### Recipes
* /recipes
    * POST (post a new recipe to a user's book)

* /recipes/{recipe_id}
    * GET (get all foods for a single recipe)q
    * PUT (edit the name of a single recipe)

* /recipes/{recipe_id}/foods
    * POST (post a food in an existing recipe)

* /recipes/{recipe_id}/foods/{food_id}
    * PUT (edit the recipe for a single food)
    * DELETE (delete a food from a recipe book)

### Day Entries
* /days/
    * POST (add a new day)

* /days/{day_id}/
    * GET (get a single day)
    * PUT (edit a day)
    * DELETE (delete a day's entry)

* /days/{day_id}/recipes
    * POST (add a user's recipe to a day)

* /days/{day_id}/recipes/{recipe_id}
    * DELETE

* /days/{day_id}/foods
    * POST

* /days/{day_id}/foods/{food_id}
    * DELETE