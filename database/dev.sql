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

-- Insert test users
INSERT INTO Users (id, email, name, weight) VALUES
('user1', 'ansengarvin@gmail.com', 'Ansen', 65.5),

-- Insert test recipes
INSERT INTO Recipes (user_id, name) VALUES
('user1', 'Chicken Salad'),
('user2', 'Oatmeal Bowl');

-- Insert test days
INSERT INTO Days (user_id, date) VALUES
('user1', '2025-05-20'),
('user2', '2025-05-20');

-- Insert test foods (linked to a day)
INSERT INTO Foods (day_id, name, calories, amount, carbs, fat, protein, position)
VALUES
(1, 'Apple', 95, 1, 25, 0.3, 0.5, 1),
(1, 'Egg', 78, 2, 1.1, 5.3, 6.3, 2);

-- Insert test foods (linked to a recipe)
INSERT INTO Foods (recipe_id, name, calories, amount, carbs, fat, protein, position)
VALUES
(1, 'Chicken Breast', 165, 1, 0, 3.6, 31, 1),
(1, 'Lettuce', 15, 1, 2.9, 0.2, 1.4, 2);

-- Insert test Days_Recipes
INSERT INTO Days_Recipes (date, recipe_id, position)
VALUES
('2025-05-20', 1, 1),
('2025-05-20', 2, 2);