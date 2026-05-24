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

    // Insert products
    await Product.insertMany(products);
    console.log('Products seeded successfully');

    process.exit();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
