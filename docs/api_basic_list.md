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


### User Day Entries
* /users/{id}/days/{date}
    * GET (all foods and recipes for that day)

### Recipes
* /recipes
    * POST (post a new recipe to a user's book)

* /recipes/{recipe_id}
    * GET (get all foods for a single recipe)
    * PUT (edit the name of a single recipe)

* /recipes/{recipe_id}/foods
    * POST (post a food in an existing recipe)

* /recipes/{recipe_id}/foods/{food_id}
    * PUT (edit the recipe for a single food)
    * DELETE (delete a food from a recipe book)


### Foods
/

### Day Entries


* /users/{id}/days/{date}/recipes
    * POST

* /users/{id}/days/{date}/recipes/{recipe_id}
    * DELETE

* /users/{id}/days/{date}/food
    * POST

* /users{id}/days/{date}/food/{food_id}
    * PUT
    * DELETE


