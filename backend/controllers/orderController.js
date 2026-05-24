import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate prices
    const itemsPrice = cart.products.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    const taxPrice = itemsPrice * 0.1; // 10% tax
    const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over $100
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    // Create order products array
    const orderProducts = cart.products.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image
    }));

    // Update product stock
    for (const item of cart.products) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      products: orderProducts,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    // Clear cart
    cart.products = [];
    await cart.save();

    const createdOrder = await order.populate('user');
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user').sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user');
    if (order) {
      // Check if user is admin or order owner
      if (order.user._id.toString() === req.user._id.toString() || req.user.isAdmin) {
        res.json(order);
      } else {
        res.status(403).json({ message: 'Not authorized' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (order) {
      order.status = status;
      
      if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
