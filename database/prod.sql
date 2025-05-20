CREATE TABLE Users (
    id NVARCHAR(255) PRIMARY KEY,
    email NVARCHAR(255) NOT NULL UNIQUE,
    name NVARCHAR(255),
    weight FLOAT
);

CREATE TABLE Recipes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id NVARCHAR(255) NOT NULL,
    name NVARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Days (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id NVARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Foods (
    id INT IDENTITY(1,1) PRIMARY KEY,
    day_id INT,
    recipe_id INT,
    name NVARCHAR(255),
    calories DECIMAL(10, 2) NOT NULL,
    amount INT NOT NULL,
    carbs DECIMAL(10, 2) NOT NULL,
    fat DECIMAL(10, 2) NOT NULL,
    protein DECIMAL(10, 2) NOT NULL,
    position INT,
    CONSTRAINT check_day_recipe CHECK (
        (day_id IS NOT NULL AND recipe_id IS NULL) OR
        (day_id IS NULL AND recipe_id IS NOT NULL)
    ),
    FOREIGN KEY (day_id) REFERENCES Days(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES Recipes(id) ON DELETE CASCADE
);

CREATE TABLE Days_Recipes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    date DATE NOT NULL,
    recipe_id INT NOT NULL,
    position INT NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES Recipes(id) ON DELETE CASCADE
);