import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');
    if (cart) {
      res.json(cart);
    } else {
      // Create empty cart if doesn't exist
      const newCart = await Cart.create({
        user: req.user._id,
        products: []
      });
      res.json(newCart);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add product to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Check if product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        products: []
      });
    }

    // Check if product already in cart
    const existingProductIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (existingProductIndex !== -1) {
      // Update quantity
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Add new product
      cart.products.push({ product: productId, quantity });
    }

    const updatedCart = await cart.save();
    await updatedCart.populate('products.product');
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove product from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== req.params.productId
    );

    const updatedCart = await cart.save();
    await updatedCart.populate('products.product');
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart product quantity
// @route   PUT /api/cart/:productId
// @access  Private
export const updateCartQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === req.params.productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not in cart' });
    }

    // Check stock
    const product = await Product.findById(req.params.productId);
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    cart.products[productIndex].quantity = quantity;
    const updatedCart = await cart.save();
    await updatedCart.populate('products.product');
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products = [];
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
