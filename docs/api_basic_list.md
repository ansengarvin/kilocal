# List of basic API paths

This is the most basic list of possible paths for the RESTful API here.

For more detail, look at [api.yaml](./api.yaml) (Recommended to copy/paste it into the [Swagger.IO Editor](https://editor.swagger.io/) for the best viewing experience)

## Paths

### User Entries
* /users
    * POST

* /users/{id}
    * GET
    * PUT

### Recipe Entries
* /users/{id}/recipes/
    * POST
    * GET

* /users/{id}/recipes/{recipe_id}
    * GET
    * PUT
    * DELETE

* /users/{id}/recipes/{recipe_id}/food
    * GET
    * POST

* /users/{id}/recipes/{recipe_id}/food/{food_id}
    * PUT
    * DELETE

### Day Entries
* /users/{id}/days/{date}/
    * GET

* /users/{id}/days/{date}/recipes
    * POST

* /users/{id}/days/{date}/recipes/{recipe_id}
    * DELETE

* /users/{id}/days/{date}/food
    * POST

* /users{id}/days/{date}/food/{food_id}
    * PUT
    * DELETE


