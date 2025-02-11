CREATE TABLE Users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    weight FLOAT
);

CREATE TABLE Recipes (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Days (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE

);

CREATE TABLE Foods (
    id SERIAL PRIMARY KEY,
    day_id INTEGER,
    recipe_id INTEGER,
    name VARCHAR(255),
    calories NUMERIC(10, 2) NOT NULL,
    amount INTEGER NOT NULL,
    carbs NUMERIC(10, 2) NOT NULL,
    fat NUMERIC(10, 2) NOT NULL,
    protein NUMERIC(10, 2) NOT NULL,
    position INTEGER,
    CONSTRAINT check_day_recipe check (
        (day_id IS NOT NULL AND recipe_id IS NULL) OR
        (day_id IS NULL AND recipe_id IS NOT NULL)
    ),
    FOREIGN KEY (day_id) REFERENCES Days(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES Recipes(id) ON DELETE CASCADE

);

CREATE TABLE Days_Recipes (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    recipe_id INTEGER NOT NULL,
    position INTEGER NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES Recipes(id) ON DELETE CASCADE
);