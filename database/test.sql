-- Insert test users
INSERT INTO Users (id, email, name, weight) VALUES
('user1', 'alice@example.com', 'Alice', 65.5),
('user2', 'bob@example.com', 'Bob', 82.3);

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