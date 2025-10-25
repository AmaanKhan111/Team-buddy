// backend.js - Complete Backend with MongoDB Authentication
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ==================== MODELS ====================

// User Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  currency: { type: String, default: 'USD' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Expense Model
const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  paymentMethod: { type: String, default: 'Cash' },
  createdAt: { type: Date, default: Date.now }
});

const Expense = mongoose.model('Expense', expenseSchema);

// Income Model
const incomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  source: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Income = mongoose.model('Income', incomeSchema);

// Budget Model
const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  limit: { type: Number, required: true },
  period: { type: String, enum: ['monthly', 'weekly', 'yearly'], default: 'monthly' },
  createdAt: { type: Date, default: Date.now }
});

const Budget = mongoose.model('Budget', budgetSchema);

// Goal Model
const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  target: { type: Number, required: true },
  current: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  category: { type: String, default: 'Savings' },
  createdAt: { type: Date, default: Date.now }
});

const Goal = mongoose.model('Goal', goalSchema);

// ==================== MIDDLEWARE ====================

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.userId = user.id;
    next();
  });
};

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '30d'
    });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '30d'
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get User Profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== EXPENSE ROUTES ====================

app.get('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const expense = new Expense({
      userId: req.userId,
      ...req.body
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== INCOME ROUTES ====================

app.get('/api/income', authenticateToken, async (req, res) => {
  try {
    const income = await Income.find({ userId: req.userId }).sort({ date: -1 });
    res.json(income);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/income', authenticateToken, async (req, res) => {
  try {
    const income = new Income({
      userId: req.userId,
      ...req.body
    });
    await income.save();
    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/income/:id', authenticateToken, async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    if (!income) {
      return res.status(404).json({ error: 'Income not found' });
    }
    res.json({ message: 'Income deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== BUDGET ROUTES ====================

app.get('/api/budgets', authenticateToken, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.userId });
    
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const expenses = await Expense.find({
          userId: req.userId,
          category: budget.category,
          date: { $gte: new Date(new Date().setDate(1)) }
        });
        const spent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        return {
          ...budget.toObject(),
          spent
        };
      })
    );
    
    res.json(budgetsWithSpent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/budgets', authenticateToken, async (req, res) => {
  try {
    const budget = new Budget({
      userId: req.userId,
      ...req.body
    });
    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/budgets/:id', authenticateToken, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== GOAL ROUTES ====================

app.get('/api/goals', authenticateToken, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.userId }).sort({ deadline: 1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/goals', authenticateToken, async (req, res) => {
  try {
    const goal = new Goal({
      userId: req.userId,
      ...req.body
    });
    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/goals/:id', authenticateToken, async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/goals/:id', authenticateToken, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ANALYTICS ROUTES ====================

app.get('/api/analytics/summary', authenticateToken, async (req, res) => {
  try {
    const startOfMonth = new Date(new Date().setDate(1));
    
    const expenses = await Expense.find({
      userId: req.userId,
      date: { $gte: startOfMonth }
    });
    
    const income = await Income.find({
      userId: req.userId,
      date: { $gte: startOfMonth }
    });
    
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
    
    const expensesByCategory = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});
    
    res.json({
      totalExpenses,
      totalIncome,
      netSavings: totalIncome - totalExpenses,
      expensesByCategory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 API available at: http://localhost:${PORT}/api`);
  console.log(`💾 Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting...'}`);
});