CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    weight FLOAT
);

CREATE TABLE Recipes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id) NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE Foods (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id) NOT NULL,
    recipe_id INTEGER REFERENCES Recipes(id),
    date DATE,
    CONSTRAINT check_day_recipe check (
        (date IS NOT NULL AND recipe_id IS NULL) OR
        (date IS NULL AND recipe_id IS NOT NULL)
    ),
    calories INTEGER NOT NULL,
    position INTEGER NOT NULL,
    name VARCHAR(255)
);

CREATE TABLE Days_Recipes (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    recipe_id INTEGER REFERENCES Recipes(id) NOT NULL,
    position INTEGER NOT NULL
);

