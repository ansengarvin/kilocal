CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    weight FLOAT
);

CREATE TABLE Days (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    user_id INTEGER REFERENCES Users(id)
);

CREATE TABLE Recipes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES Users(id) NOT NULL
);

CREATE TABLE Foods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    calories INTEGER NOT NULL,
    day_id INTEGER REFERENCES Days(id),
    recipe_id INTEGER REFERENCES Recipes(id),
    position INTEGER NOT NULL,
    CONSTRAINT check_day_recipe check (
        (day_id IS NOT NULL AND recipe_id IS NULL) OR
        (day_id IS NULL AND recipe_id IS NOT NULL)
    )
);

CREATE TABLE Days_Recipes (
    id SERIAL PRIMARY KEY,
    day_id INTEGER REFERENCES Days(id),
    recipe_id INTEGER REFERENCES Recipes(id),
    position INTEGER NOT NULL
);

