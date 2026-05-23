import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool = null;
let useMock = false;

// Mock Data Arrays
const mockUsers = [];
const mockRestaurants = [
  {
    id: 1,
    name: 'La Piazza Pizzeria',
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: '1.2k+',
    deliveryTime: '15-25 min',
    priceLevel: '$$',
    deliveryFee: 0.00,
    owner_id: null
  },
  {
    id: 2,
    name: 'Burger & Co. Craft House',
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: '800+',
    deliveryTime: '20-30 min',
    priceLevel: '$$',
    deliveryFee: 1.99,
    owner_id: null
  },
  {
    id: 3,
    name: 'Sakura Sushi Roll',
    category: 'Sushi',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewsCount: '950+',
    deliveryTime: '25-35 min',
    priceLevel: '$$$',
    deliveryFee: 0.00,
    owner_id: null
  },
  {
    id: 4,
    name: 'Sweet Bliss Dessert Lab',
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    reviewsCount: '640+',
    deliveryTime: '10-20 min',
    priceLevel: '$',
    deliveryFee: 0.99,
    owner_id: null
  },
  {
    id: 5,
    name: 'The Green Garden Bistro',
    category: 'Healthy',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: '1.5k+',
    deliveryTime: '20-30 min',
    priceLevel: '$$',
    deliveryFee: 0.00,
    owner_id: null
  },
  {
    id: 6,
    name: 'Lotus Wok Asian Express',
    category: 'Asian',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewsCount: '450+',
    deliveryTime: '30-40 min',
    priceLevel: '$$',
    deliveryFee: 2.49,
    owner_id: null
  }
];

const mockMenuItems = [
  // La Piazza Pizzeria (ID 1)
  { id: 1, restaurant_id: 1, name: 'Margherita Classic Pizza', description: 'Fresh tomatoes, mozzarella cheese, fresh basil, and extra virgin olive oil.', price: 14.99, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=400&q=80', category: 'Pizza' },
  { id: 2, restaurant_id: 1, name: 'Spicy Pepperoni Feast', description: 'Double pepperoni, hot honey drizzle, fresh mozzarella, and tomato base.', price: 17.99, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80', category: 'Pizza' },
  { id: 3, restaurant_id: 1, name: 'Truffle Mushroom Pizza', description: 'White sauce, wild mushroom blend, white truffle oil, and shaved parmesan.', price: 19.99, image: 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?auto=format&fit=crop&w=400&q=80', category: 'Pizza' },
  { id: 4, restaurant_id: 1, name: 'Caprese Salad', description: 'Buffalo mozzarella, heirloom tomatoes, balsamic glaze, and pesto sauce.', price: 9.99, image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=400&q=80', category: 'Sides' },

  // Burger & Co. (ID 2)
  { id: 5, restaurant_id: 2, name: 'Signature Bacon Cheese Burger', description: 'Angus beef patty, crispy smoked bacon, cheddar cheese, caramelized onions, house burger sauce.', price: 13.49, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80', category: 'Burgers' },
  { id: 6, restaurant_id: 2, name: 'Truffle Garlic Fries', description: 'Crisp double-fried potatoes tossed in white truffle oil, parsley, and garlic aioli.', price: 5.99, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80', category: 'Sides' },
  { id: 7, restaurant_id: 2, name: 'Crispy Hot Chicken Burger', description: 'Crispy buttermilk chicken breast, sweet pickles, spicy coleslaw, cayenne butter sauce.', price: 12.99, image: 'https://images.unsplash.com/photo-1627662236973-4f8259fa2441?auto=format&fit=crop&w=400&q=80', category: 'Burgers' }
];

const mockOrders = [];
const mockOrderItems = [];

// Try to initialize the MySQL Pool
try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'biteswift',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  
  // Test connection
  const conn = await pool.getConnection();
  console.log('✅ Connected to MySQL database successfully!');
  conn.release();
} catch (error) {
  console.warn('⚠️  MySQL Database connection failed or is not available:', error.message);
  console.warn('⚡ Fallback: Switching to in-memory Mock SQL database engine.');
  useMock = true;
}

// Query Executor
async function query(sql, params = []) {
  if (!useMock) {
    try {
      const [results] = await pool.query(sql, params);
      return [results];
    } catch (error) {
      console.error('MySQL Query error:', error);
      throw error;
    }
  }

  // --- MOCK IN-MEMORY SQL DB PARSER ---
  const sqlTrimmed = sql.trim().replace(/\s+/g, ' ');
  console.log(`[MockDB Query]: "${sqlTrimmed}" with params:`, params);

  // 1. SELECT FROM users WHERE email = ?
  if (sqlTrimmed.match(/SELECT \* FROM users WHERE email = \?/i)) {
    const email = params[0];
    const user = mockUsers.find(u => u.email === email);
    return [user ? [user] : []];
  }

  // 2. INSERT INTO users (name, email, password, role)
  if (sqlTrimmed.match(/INSERT INTO users/i)) {
    const [name, email, password, role] = params;
    const newUser = {
      id: mockUsers.length + 1,
      name,
      email,
      password,
      role: role || 'customer',
      created_at: new Date()
    };
    mockUsers.push(newUser);
    return [{ insertId: newUser.id }];
  }

  // 3. SELECT FROM restaurants
  if (sqlTrimmed.match(/SELECT \* FROM restaurants/i)) {
    // If it queries by owner_id
    if (sqlTrimmed.includes('owner_id = ?')) {
      const ownerId = params[0];
      const owned = mockRestaurants.filter(r => r.owner_id === ownerId);
      return [owned];
    }
    return [mockRestaurants];
  }

  // 4. SELECT FROM menu_items WHERE restaurant_id = ?
  if (sqlTrimmed.match(/SELECT \* FROM menu_items WHERE restaurant_id = \?/i)) {
    const rId = Number(params[0]);
    const items = mockMenuItems.filter(item => item.restaurant_id === rId);
    return [items];
  }

  // 5. INSERT INTO menu_items
  if (sqlTrimmed.match(/INSERT INTO menu_items/i)) {
    const [restaurant_id, name, description, price, image, category] = params;
    const newItem = {
      id: mockMenuItems.length + 1,
      restaurant_id: Number(restaurant_id),
      name,
      description,
      price: Number(price),
      image,
      category
    };
    mockMenuItems.push(newItem);
    return [{ insertId: newItem.id }];
  }

  // 6. UPDATE menu_items SET
  if (sqlTrimmed.match(/UPDATE menu_items/i)) {
    // Expect: name = ?, price = ?, description = ?, category = ? WHERE id = ?
    const [name, price, description, category, id] = params;
    const itemIndex = mockMenuItems.findIndex(item => item.id === Number(id));
    if (itemIndex !== -1) {
      mockMenuItems[itemIndex] = {
        ...mockMenuItems[itemIndex],
        name,
        price: Number(price),
        description,
        category
      };
      return [{ affectedRows: 1 }];
    }
    return [{ affectedRows: 0 }];
  }

  // 7. DELETE FROM menu_items
  if (sqlTrimmed.match(/DELETE FROM menu_items WHERE id = \?/i)) {
    const id = Number(params[0]);
    const index = mockMenuItems.findIndex(item => item.id === id);
    if (index !== -1) {
      mockMenuItems.splice(index, 1);
      return [{ affectedRows: 1 }];
    }
    return [{ affectedRows: 0 }];
  }

  // 8. INSERT INTO orders (user_id, restaurant_id, total_price, delivery_address)
  if (sqlTrimmed.match(/INSERT INTO orders/i)) {
    const [user_id, restaurant_id, total_price, delivery_address] = params;
    const newOrder = {
      id: mockOrders.length + 1,
      user_id: Number(user_id),
      restaurant_id: Number(restaurant_id),
      total_price: Number(total_price),
      status: 'Placed',
      delivery_address,
      created_at: new Date()
    };
    mockOrders.push(newOrder);
    return [{ insertId: newOrder.id }];
  }

  // 9. INSERT INTO order_items (order_id, menu_item_id, quantity, price)
  if (sqlTrimmed.match(/INSERT INTO order_items/i)) {
    const [order_id, menu_item_id, quantity, price] = params;
    const newOrderItem = {
      id: mockOrderItems.length + 1,
      order_id: Number(order_id),
      menu_item_id: Number(menu_item_id),
      quantity: Number(quantity),
      price: Number(price)
    };
    mockOrderItems.push(newOrderItem);
    return [{ insertId: newOrderItem.id }];
  }

  // 10. SELECT FROM orders (For restaurant owners or customers)
  if (sqlTrimmed.match(/SELECT \* FROM orders WHERE/i) || sqlTrimmed.match(/SELECT o\.\* FROM orders o/i)) {
    // If selecting by user_id for tracking
    if (sqlTrimmed.includes('user_id = ?')) {
      const uId = Number(params[0]);
      // Sort orders descending
      const uOrders = mockOrders.filter(o => o.user_id === uId).sort((a,b) => b.id - a.id);
      return [uOrders];
    }
    // If selecting by restaurant_id for incoming dashboard
    if (sqlTrimmed.includes('restaurant_id = ?')) {
      const rId = Number(params[0]);
      const rOrders = mockOrders.filter(o => o.restaurant_id === rId).sort((a,b) => b.id - a.id);
      return [rOrders];
    }
    // Fetch specific order by id
    if (sqlTrimmed.includes('o.id = ?') || sqlTrimmed.includes('id = ?')) {
      const oId = Number(params[0]);
      const order = mockOrders.find(o => o.id === oId);
      return [order ? [order] : []];
    }
  }

  // 11. Fetch order details (items join)
  if (sqlTrimmed.match(/SELECT oi\.\* /i)) {
    // Expect: WHERE oi.order_id = ?
    const oId = Number(params[0]);
    const items = mockOrderItems.filter(oi => oi.order_id === oId).map(oi => {
      const originalItem = mockMenuItems.find(mi => mi.id === oi.menu_item_id);
      return {
        ...oi,
        name: originalItem ? originalItem.name : 'Unknown Dish'
      };
    });
    return [items];
  }

  // 12. UPDATE orders SET status = ? WHERE id = ?
  if (sqlTrimmed.match(/UPDATE orders SET status = \? WHERE id = \?/i)) {
    const [status, id] = params;
    const orderIndex = mockOrders.findIndex(o => o.id === Number(id));
    if (orderIndex !== -1) {
      mockOrders[orderIndex].status = status;
      return [{ affectedRows: 1 }];
    }
    return [{ affectedRows: 0 }];
  }

  // 13. SELECT FROM users WHERE id = ?
  if (sqlTrimmed.match(/SELECT \* FROM users WHERE id = \?/i)) {
    const id = params[0];
    const user = mockUsers.find(u => u.id === Number(id));
    return [user ? [user] : []];
  }

  // 14. Find restaurant owner ID or register owner
  if (sqlTrimmed.match(/INSERT INTO restaurants/i)) {
    // Handled when owner adds restaurant
    const [name, category, image, rating, reviewsCount, deliveryTime, priceLevel, deliveryFee, owner_id] = params;
    const newRestaurant = {
      id: mockRestaurants.length + 1,
      name,
      category,
      image,
      rating: Number(rating) || 4.5,
      reviewsCount: reviewsCount || '100+',
      deliveryTime: deliveryTime || '20-30 min',
      priceLevel: priceLevel || '$$',
      deliveryFee: Number(deliveryFee) || 0,
      owner_id: Number(owner_id)
    };
    mockRestaurants.push(newRestaurant);
    return [{ insertId: newRestaurant.id }];
  }

  throw new Error(`Unsupported Mock SQL Query: "${sqlTrimmed}"`);
}

export default {
  query
};
