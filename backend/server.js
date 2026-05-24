import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from './models/User.js';
import Product from './models/Product.js';
import Cart from './models/Cart.js';
import Order from './models/Order.js';
import { products } from '../frontend/src/data/products.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shophub')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '30d'
  });
};

// Auth middleware
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Products routes
app.get('/api/products', async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

app.get('/api/products/:id', async (req, res) => {
  const product = await Product.findOne({ id: parseInt(req.params.id) });
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Seller-specific product routes
app.post('/api/products', protect, async (req, res) => {
  const { name, price, image, category, description, stock } = req.body;
  const maxIdProduct = await Product.findOne().sort({ id: -1 });
  const newId = maxIdProduct ? maxIdProduct.id + 1 : 1;

  const product = await Product.create({
    id: newId,
    name,
    price,
    image,
    category,
    description,
    stock,
    seller: req.user._id
  });

  res.status(201).json(product);
});

app.put('/api/products/:id', protect, async (req, res) => {
  const product = await Product.findOne({ id: parseInt(req.params.id) });

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // Check if user is the seller of this product
  if (product.seller && product.seller.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to update this product' });
  }

  const { name, price, image, category, description, stock } = req.body;

  if (name) product.name = name;
  if (price) product.price = price;
  if (image) product.image = image;
  if (category) product.category = category;
  if (description) product.description = description;
  if (stock) product.stock = stock;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

app.delete('/api/products/:id', protect, async (req, res) => {
  const product = await Product.findOne({ id: parseInt(req.params.id) });

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // Check if user is the seller of this product
  if (product.seller && product.seller.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this product' });
  }

  await Product.deleteOne({ id: parseInt(req.params.id) });
  res.json({ message: 'Product removed' });
});

app.get('/api/products/seller/myproducts', protect, async (req, res) => {
  const products = await Product.find({ seller: req.user._id });
  res.json(products);
});

app.get('/api/products/seller/stats', protect, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    const orders = await Order.find({});

    // Filter orders that contain seller's products
    const sellerOrders = orders.filter(order =>
      order.products.some(p => {
        const product = products.find(prod => prod.id === p.product);
        return product !== undefined;
      })
    );

    // Calculate total revenue from seller's products
    let totalRevenue = 0;
    let totalSales = 0;

    sellerOrders.forEach(order => {
      order.products.forEach(p => {
        const product = products.find(prod => prod.id === p.product);
        if (product) {
          totalRevenue += p.price * p.quantity;
          totalSales += p.quantity;
        }
      });
    });

    // Calculate today's sales
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = sellerOrders.filter(order => new Date(order.createdAt) >= today);
    let todayRevenue = 0;
    todayOrders.forEach(order => {
      order.products.forEach(p => {
        const product = products.find(prod => prod.id === p.product);
        if (product) {
          todayRevenue += p.price * p.quantity;
        }
      });
    });

    // Calculate this week's sales
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekOrders = sellerOrders.filter(order => new Date(order.createdAt) >= weekAgo);
    let weekRevenue = 0;
    weekOrders.forEach(order => {
      order.products.forEach(p => {
        const product = products.find(prod => prod.id === p.product);
        if (product) {
          weekRevenue += p.price * p.quantity;
        }
      });
    });

    // Calculate this month's sales
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthOrders = sellerOrders.filter(order => new Date(order.createdAt) >= monthAgo);
    let monthRevenue = 0;
    monthOrders.forEach(order => {
      order.products.forEach(p => {
        const product = products.find(prod => prod.id === p.product);
        if (product) {
          monthRevenue += p.price * p.quantity;
        }
      });
    });

    res.json({
      totalProducts: products.length,
      totalRevenue,
      totalSales,
      todayRevenue,
      weekRevenue,
      monthRevenue,
      totalOrders: sellerOrders.length
    });
  } catch (error) {
    console.error('Error fetching seller stats:', error);
    res.status(500).json({ message: 'Error fetching seller stats' });
  }
});

// User routes
app.post('/api/users/register', async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const user = await User.create({
    name,
    email,
    password,
    isAdmin: false,
    isSeller: false
  });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    isSeller: user.isSeller,
    token: generateToken(user._id)
  });
});

app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await user.matchPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller || false,
      token: generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

app.get('/api/users/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller || false
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.put('/api/users/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { name, isSeller } = req.body;
    if (name) user.name = name;
    if (typeof isSeller === 'boolean') user.isSeller = isSeller;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isSeller: updatedUser.isSeller
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Cart routes
app.get('/api/cart', protect, async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    res.json(cart);
  } else {
    res.json({ user: req.user._id, products: [] });
  }
});

app.post('/api/cart', protect, async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, products: [] });
  }
  const existingIndex = cart.products.findIndex(p => p.product === parseInt(productId));
  if (existingIndex !== -1) {
    cart.products[existingIndex].quantity += quantity;
  } else {
    cart.products.push({ product: parseInt(productId), quantity });
  }
  await cart.save();
  const updatedCart = await Cart.findById(cart._id);
  res.json(updatedCart);
});

app.delete('/api/cart/:productId', protect, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.products = cart.products.filter(p => p.product !== parseInt(req.params.productId));
    await cart.save();
    const updatedCart = await Cart.findById(cart._id);
    res.json(updatedCart);
  } else {
    res.status(404).json({ message: 'Cart not found' });
  }
});

// Order routes
app.post('/api/orders', protect, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const products = await Product.find({});
    const orderProducts = cart.products.map(item => {
      const product = products.find(p => p.id === item.product);
      if (!product) {
        console.error(`Product with ID ${item.product} not found in database`);
        return null;
      }
      return {
        product: item.product,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      };
    }).filter(item => item !== null);

    if (orderProducts.length === 0) {
      console.error('No valid products found in cart. Cart products:', cart.products);
      console.error('Available products:', products.map(p => ({ id: p.id, name: p.name })));
      return res.status(400).json({
        message: 'No valid products in cart. Please clear your cart and try again.',
        cartProducts: cart.products,
        availableProducts: products.map(p => ({ id: p.id, name: p.name }))
      });
    }

    const itemsPrice = orderProducts.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const taxPrice = itemsPrice * 0.1;
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const order = await Order.create({
      user: req.user._id,
      products: orderProducts,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: false,
      isDelivered: false,
      status: 'Pending'
    });

    cart.products = [];
    await cart.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

app.get('/api/orders/myorders', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// Seller order routes
app.get('/api/orders/seller/myorders', protect, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    const orders = await Order.find({}).sort({ createdAt: -1 });

    // Filter orders that contain seller's products
    const sellerOrders = orders.filter(order =>
      order.products.some(p => {
        const product = products.find(prod => prod.id === p.product);
        return product !== undefined;
      })
    );

    res.json(sellerOrders);
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ message: 'Error fetching seller orders' });
  }
});

app.put('/api/orders/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is a seller and if the order contains their products
    if (req.user.isSeller) {
      const products = await Product.find({ seller: req.user._id });
      const hasSellerProduct = order.products.some(p => {
        const product = products.find(prod => prod.id === p.product);
        return product !== undefined;
      });

      if (!hasSellerProduct) {
        return res.status(403).json({ message: 'Not authorized to update this order' });
      }
    }

    order.status = status;

    // Update isDelivered based on status
    if (status === 'Delivered') {
      order.isDelivered = true;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
