const mongoose = require('mongoose');
const dotenv = require('dotenv');
const UserModel = require('./models/Users');

dotenv.config();

const url = process.env.URL || 'mongodb://localhost:27017/finance_dev';

const seedData = [
  { Transaction: 'Cybersecurity Audit Retainer', TransactionType: 'Income', Catagory: 'Consulting', Amount: 120000 },
  { Transaction: 'Bug Bounty Reward (Critical)', TransactionType: 'Income', Catagory: 'Security Bounty', Amount: 45000 },
  { Transaction: 'Cloud Infrastructure (AWS/Vercel)', TransactionType: 'Expense', Catagory: 'Infrastructure', Amount: 14500 },
  { Transaction: 'Hardware Security Keys (YubiKey)', TransactionType: 'Expense', Catagory: 'Hardware', Amount: 6200 },
  { Transaction: 'Ergonomic Workspace & Display', TransactionType: 'Expense', Catagory: 'Office', Amount: 28000 },
  { Transaction: 'High-Speed Fiber Internet', TransactionType: 'Expense', Catagory: 'Utilities', Amount: 2800 },
  { Transaction: 'Software Engineering Salary', TransactionType: 'Income', Catagory: 'Salary', Amount: 95000 },
  { Transaction: 'Apartment Lease Payment', TransactionType: 'Expense', Catagory: 'Housing', Amount: 22000 }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB at:', url);
    await mongoose.connect(url);
    console.log('Connected! Clearing existing transactions...');
    await UserModel.deleteMany({});
    console.log('Inserting seed transactions...');
    await UserModel.insertMany(seedData);
    console.log(`Successfully seeded ${seedData.length} transactions!`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err.message);
    process.exit(1);
  }
}

seedDatabase();
