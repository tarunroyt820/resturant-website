-- Create Database
CREATE DATABASE IF NOT EXISTS biteswift;
USE biteswift;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'restaurant') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restaurants Table
CREATE TABLE IF NOT EXISTS restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image TEXT,
  rating DECIMAL(2,1) DEFAULT 4.5,
  reviewsCount VARCHAR(50) DEFAULT '100+',
  deliveryTime VARCHAR(50) DEFAULT '20-30 min',
  priceLevel VARCHAR(10) DEFAULT '$$',
  deliveryFee DECIMAL(5,2) DEFAULT 0.00,
  owner_id INT,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image TEXT,
  category VARCHAR(100),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  restaurant_id INT NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status ENUM('Placed', 'Preparing', 'Delivering', 'Delivered') NOT NULL DEFAULT 'Placed',
  delivery_address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  menu_item_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- Insert Sample Restaurants
INSERT INTO restaurants (name, category, image, rating, reviewsCount, deliveryTime, priceLevel, deliveryFee) VALUES
('La Piazza Pizzeria', 'Pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', 4.9, '1.2k+', '15-25 min', '$$', 0.00),
('Burger & Co. Craft House', 'Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', 4.8, '800+', '20-30 min', '$$', 1.99),
('Sakura Sushi Roll', 'Sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80', 4.7, '950+', '25-35 min', '$$$', 0.00),
('Sweet Bliss Dessert Lab', 'Desserts', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80', 4.6, '640+', '10-20 min', '$', 0.99),
('The Green Garden Bistro', 'Healthy', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', 4.9, '1.5k+', '20-30 min', '$$', 0.00),
('Lotus Wok Asian Express', 'Asian', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80', 4.7, '450+', '30-40 min', '$$', 2.49);

-- Insert Sample Menu Items for La Piazza Pizzeria (ID 1)
INSERT INTO menu_items (restaurant_id, name, description, price, image, category) VALUES
(1, 'Margherita Classic Pizza', 'Fresh tomatoes, mozzarella cheese, fresh basil, and extra virgin olive oil.', 14.99, 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=400&q=80', 'Pizza'),
(1, 'Spicy Pepperoni Feast', 'Double pepperoni, hot honey drizzle, fresh mozzarella, and tomato base.', 17.99, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80', 'Pizza'),
(1, 'Truffle Mushroom Pizza', 'White sauce, wild mushroom blend, white truffle oil, and shaved parmesan.', 19.99, 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?auto=format&fit=crop&w=400&q=80', 'Pizza'),
(1, 'Caprese Salad', 'Buffalo mozzarella, heirloom tomatoes, balsamic glaze, and pesto sauce.', 9.99, 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=400&q=80', 'Sides');

-- Insert Sample Menu Items for Burger & Co. Craft House (ID 2)
INSERT INTO menu_items (restaurant_id, name, description, price, image, category) VALUES
(2, 'Signature Bacon Cheese Burger', 'Angus beef patty, crispy smoked bacon, cheddar cheese, caramelized onions, house burger sauce.', 13.49, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80', 'Burgers'),
(2, 'Truffle Garlic Fries', 'Crisp double-fried potatoes tossed in white truffle oil, parsley, and garlic aioli.', 5.99, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80', 'Sides'),
(2, 'Crispy Hot Chicken Burger', 'Crispy buttermilk chicken breast, sweet pickles, spicy coleslaw, cayenne butter sauce.', 12.99, 'https://images.unsplash.com/photo-1627662236973-4f8259fa2441?auto=format&fit=crop&w=400&q=80', 'Burgers');
