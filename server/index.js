const express = require('express');
const app = express();
const mongoose = require('mongoose');
const UserModel = require('./models/Users');
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');

app.use(express.json());
app.use(cors());

// In-memory seed data for pre-remediation testing and immediate localhost verification
const sampleUsers = [
  { id: 'usr_parth', name: 'Parth Pandey', email: 'parth@finance.local', role: 'Security Architect' },
  { id: 'usr_alice', name: 'Alice Sharma', email: 'alice@finance.local', role: 'Standard User' },
  { id: 'usr_bob', name: 'Bob Patel', email: 'bob@finance.local', role: 'Standard User' }
];

let initialTransactions = [
  { _id: 'tx_101', Transaction: 'Cybersecurity Audit Retainer', TransactionType: 'Income', Catagory: 'Consulting', Amount: 120000, user: 'parth@finance.local' },
  { _id: 'tx_102', Transaction: 'Bug Bounty Reward (Critical)', TransactionType: 'Income', Catagory: 'Security Bounty', Amount: 45000, user: 'parth@finance.local' },
  { _id: 'tx_103', Transaction: 'Cloud Infrastructure (AWS/Vercel)', TransactionType: 'Expense', Catagory: 'Infrastructure', Amount: 14500, user: 'parth@finance.local' },
  { _id: 'tx_104', Transaction: 'Hardware Security Keys (YubiKey)', TransactionType: 'Expense', Catagory: 'Hardware', Amount: 6200, user: 'parth@finance.local' },
  { _id: 'tx_105', Transaction: 'Ergonomic Workspace & Display', TransactionType: 'Expense', Catagory: 'Office', Amount: 28000, user: 'parth@finance.local' },
  { _id: 'tx_106', Transaction: 'High-Speed Fiber Internet', TransactionType: 'Expense', Catagory: 'Utilities', Amount: 2800, user: 'parth@finance.local' },
  { _id: 'tx_107', Transaction: 'Software Engineering Salary', TransactionType: 'Income', Catagory: 'Salary', Amount: 95000, user: 'alice@finance.local' },
  { _id: 'tx_108', Transaction: 'Apartment Lease Payment', TransactionType: 'Expense', Catagory: 'Housing', Amount: 22000, user: 'alice@finance.local' }
];

let isDbConnected = false;
const url = process.env.URL;

if (url) {
  mongoose
    .connect(url, { bufferCommands: false, serverSelectionTimeoutMS: 4000 })
    .then(() => {
      isDbConnected = true;
      console.log('Database connected successfully..');
    })
    .catch((err) => {
      console.log('Database connection error (falling back to local memory store):', err.message);
    });
} else {
  console.log('Notice: URL environment variable not provided. Running with in-memory seed store for localhost testing.');
}

// Endpoint to retrieve test user accounts
app.get('/api/users', (req, res) => {
  res.json({ users: sampleUsers });
});

// GET /getUsers (VULN: Returns all data without authentication or tenancy isolation)
app.get('/getUsers', async (req, res) => {
  try {
    if (isDbConnected) {
      const users = await UserModel.find();
      return res.json(users);
    }
    // Return sample seeded transactions
    res.json(initialTransactions);
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST /createUser (VULN: Accepts unvalidated input directly into store)
app.post('/createUser', async (req, res) => {
  try {
    if (isDbConnected) {
      const user = new UserModel(req.body);
      const savedUser = await user.save();
      return res.json(savedUser);
    }

    const newTx = {
      _id: 'tx_' + Date.now(),
      Transaction: req.body.Transaction,
      TransactionType: req.body.TransactionType,
      Catagory: req.body.Catagory,
      Amount: Number(req.body.Amount) || 0,
      user: req.body.user || 'parth@finance.local',
      ...req.body // Demonstrates mass assignment vulnerability
    };

    initialTransactions.push(newTx);
    res.json(newTx);
  } catch (err) {
    res.status(500).send(err);
  }
});

// DELETE /deleteUser/:id (Allows deleting a transaction)
app.delete('/deleteUser/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected) {
      await UserModel.findByIdAndDelete(id);
      return res.json({ success: true, id });
    }
    initialTransactions = initialTransactions.filter((tx) => tx._id !== id);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(3001, () => {
  console.log(`Server listening at 3001`);
});