import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';
import authRouter, { verifyToken } from './auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Authentication Router
app.use('/api/auth', authRouter);

// PUBLIC: Get all restaurants
app.get('/api/restaurants', async (req, res) => {
  try {
    const [restaurants] = await db.query('SELECT * FROM restaurants');
    res.json(restaurants);
  } catch (error) {
    console.error('Fetch restaurants error:', error);
    res.status(500).json({ message: 'Failed to fetch restaurants' });
  }
});

// PUBLIC: Get menu items for a restaurant
app.get('/api/menu/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const [items] = await db.query('SELECT * FROM menu_items WHERE restaurant_id = ?', [restaurantId]);
    res.json(items);
  } catch (error) {
    console.error('Fetch menu error:', error);
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
});

// PROTECTED: Place a new order (customer)
app.post('/api/orders', verifyToken, async (req, res) => {
  const { restaurantId, totalPrice, deliveryAddress, items } = req.body;
  const userId = req.user.id;

  if (!restaurantId || !totalPrice || !deliveryAddress || !items || items.length === 0) {
    return res.status(400).json({ message: 'Incomplete order details' });
  }

  try {
    // 1. Insert into orders table
    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, restaurant_id, total_price, delivery_address, status) VALUES (?, ?, ?, ?, ?)',
      [userId, restaurantId, totalPrice, deliveryAddress, 'Placed']
    );

    const orderId = orderResult.insertId;

    // 2. Insert order items
    for (const item of items) {
      await db.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.id, item.quantity, item.price]
      );
    }

    res.status(201).json({ 
      message: 'Order placed successfully!', 
      orderId 
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ message: 'Failed to process order' });
  }
});

// PROTECTED: Get active orders for a customer (for tracker/history)
app.get('/api/orders/customer', verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
    res.json(orders);
  } catch (error) {
    console.error('Fetch customer orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// PROTECTED: Get single order status tracker details
app.get('/api/orders/:orderId', verifyToken, async (req, res) => {
  const { orderId } = req.params;
  try {
    // Fetch order
    const [orders] = await db.query('SELECT o.* FROM orders o WHERE o.id = ?', [orderId]);
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const order = orders[0];

    // Fetch items
    const [items] = await db.query('SELECT oi.* FROM order_items oi WHERE oi.order_id = ?', [orderId]);
    
    // Fetch restaurant name
    const [restaurants] = await db.query('SELECT name FROM restaurants WHERE id = ?', [order.restaurant_id]);
    const restaurantName = restaurants && restaurants.length > 0 ? restaurants[0].name : 'Unknown Restaurant';

    res.json({
      ...order,
      restaurantName,
      items
    });
  } catch (error) {
    console.error('Fetch single order status error:', error);
    res.status(500).json({ message: 'Failed to fetch order status details' });
  }
});

// PROTECTED RESTAURANT: Get profile for logged-in restaurant owner
app.get('/api/restaurant/profile', verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const [restaurants] = await db.query('SELECT * FROM restaurants WHERE owner_id = ?', [userId]);
    if (!restaurants || restaurants.length === 0) {
      return res.status(404).json({ message: 'Restaurant profile not found for this user' });
    }
    res.json(restaurants[0]);
  } catch (error) {
    console.error('Fetch restaurant profile error:', error);
    res.status(500).json({ message: 'Failed to fetch restaurant profile' });
  }
});

// PROTECTED RESTAURANT: Fetch incoming orders for specific restaurant
app.get('/api/restaurant/orders', verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    // 1. Get restaurant belonging to owner
    const [restaurants] = await db.query('SELECT id FROM restaurants WHERE owner_id = ?', [userId]);
    if (!restaurants || restaurants.length === 0) {
      return res.status(404).json({ message: 'Restaurant profile not found' });
    }
    const restaurantId = restaurants[0].id;

    // 2. Fetch orders
    const [orders] = await db.query('SELECT * FROM orders WHERE restaurant_id = ?', [restaurantId]);
    
    // 3. For each order, fetch items
    const populatedOrders = [];
    for (const order of orders) {
      const [items] = await db.query('SELECT oi.* FROM order_items oi WHERE oi.order_id = ?', [order.id]);
      populatedOrders.push({
        ...order,
        items
      });
    }

    res.json(populatedOrders);
  } catch (error) {
    console.error('Fetch restaurant orders error:', error);
    res.status(500).json({ message: 'Failed to fetch restaurant orders' });
  }
});

// PROTECTED RESTAURANT: Update order status (Accept, Reject, etc.)
app.put('/api/orders/:orderId/status', verifyToken, async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body; // e.g. 'Preparing', 'Delivering', 'Delivered', or 'Rejected' (handled by status flag)

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  try {
    // Perform update
    const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: `Order status updated to: ${status}` });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

// PROTECTED RESTAURANT: Fetch menu items owned by this restaurant
app.get('/api/restaurant/menu', verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const [restaurants] = await db.query('SELECT id FROM restaurants WHERE owner_id = ?', [userId]);
    if (!restaurants || restaurants.length === 0) {
      return res.status(404).json({ message: 'Restaurant profile not found' });
    }
    const restaurantId = restaurants[0].id;

    const [items] = await db.query('SELECT * FROM menu_items WHERE restaurant_id = ?', [restaurantId]);
    res.json(items);
  } catch (error) {
    console.error('Fetch owner menu error:', error);
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
});

// PROTECTED RESTAURANT: Add new menu item
app.post('/api/restaurant/menu', verifyToken, async (req, res) => {
  const { name, description, price, image, category } = req.body;
  const userId = req.user.id;

  if (!name || !price || !category) {
    return res.status(400).json({ message: 'Name, price, and category are required' });
  }

  try {
    const [restaurants] = await db.query('SELECT id FROM restaurants WHERE owner_id = ?', [userId]);
    if (!restaurants || restaurants.length === 0) {
      return res.status(404).json({ message: 'Restaurant profile not found' });
    }
    const restaurantId = restaurants[0].id;

    const [result] = await db.query(
      'INSERT INTO menu_items (restaurant_id, name, description, price, image, category) VALUES (?, ?, ?, ?, ?, ?)',
      [restaurantId, name, description || '', price, image || '', category]
    );

    res.status(201).json({
      message: 'Menu item added successfully',
      itemId: result.insertId
    });
  } catch (error) {
    console.error('Add menu item error:', error);
    res.status(500).json({ message: 'Failed to add menu item' });
  }
});

// PROTECTED RESTAURANT: Update menu item
app.put('/api/restaurant/menu/:itemId', verifyToken, async (req, res) => {
  const { itemId } = req.params;
  const { name, description, price, category } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ message: 'Name, price, and category are required' });
  }

  try {
    const [result] = await db.query(
      'UPDATE menu_items SET name = ?, price = ?, description = ?, category = ? WHERE id = ?',
      [name, price, description || '', category, itemId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Menu item not found or unauthorized' });
    }

    res.json({ message: 'Menu item updated successfully' });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ message: 'Failed to update menu item' });
  }
});

// PROTECTED RESTAURANT: Delete menu item
app.delete('/api/restaurant/menu/:itemId', verifyToken, async (req, res) => {
  const { itemId } = req.params;

  try {
    const [result] = await db.query('DELETE FROM menu_items WHERE id = ?', [itemId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Menu item not found or unauthorized' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ message: 'Failed to delete menu item' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 BiteSwift API Server is running on http://localhost:${PORT}`);
});
