import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import { products } from '../frontend/src/data/products.js';

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing products
    await Product.deleteMany();
    console.log('Existing products cleared');

    // Clear existing carts (to avoid invalid product IDs)
    const Cart = (await import('./models/Cart.js')).default;
    await Cart.deleteMany();
    console.log('Existing carts cleared');

    // Clear existing orders
    const Order = (await import('./models/Order.js')).default;
    await Order.deleteMany();
    console.log('Existing orders cleared');

    // Insert products with numeric IDs
    const productsWithIds = products.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.description,
      rating: product.rating,
      stock: product.stock,
      seller: null // Default seller is null for seeded products
    }));

    await Product.insertMany(productsWithIds);
    console.log('Products seeded successfully');

    process.exit();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
