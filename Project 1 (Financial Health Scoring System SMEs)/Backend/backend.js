// backend.js - Server WITHOUT Database (In-Memory Storage)
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

console.log('✅ Server starting WITHOUT database (using in-memory storage)...');

// ==================== IN-MEMORY DATA STORAGE ====================

let users = [];
let expenses = [];
let income = [];
let budgets = [];
let goals = [];

// Counter for IDs
let userIdCounter = 1;
let expenseIdCounter = 1;
let incomeIdCounter = 1;
let budgetIdCounter = 1;
let goalIdCounter = 1;

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
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.userId = user.id;
    next();
  });
};

// ==================== ROUTES ====================

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: userIdCounter++,
      name,
      email,
      password: hashedPassword,
      currency: 'USD',
      createdAt: new Date()
    };

    users.push(user);

    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '7d'
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '7d'
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Expense Routes
app.get('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const userExpenses = expenses.filter(e => e.userId === req.userId);
    res.json(userExpenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const expense = {
      id: expenseIdCounter++,
      userId: req.userId,
      ...req.body,
      createdAt: new Date()
    };
    expenses.push(expense);
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    const expenseIndex = expenses.findIndex(e => e.id === parseInt(req.params.id) && e.userId === req.userId);
    if (expenseIndex === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    expenses[expenseIndex] = { ...expenses[expenseIndex], ...req.body };
    res.json(expenses[expenseIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    const expenseIndex = expenses.findIndex(e => e.id === parseInt(req.params.id) && e.userId === req.userId);
    if (expenseIndex === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    expenses.splice(expenseIndex, 1);
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Income Routes
app.get('/api/income', authenticateToken, async (req, res) => {
  try {
    const userIncome = income.filter(i => i.userId === req.userId);
    res.json(userIncome);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/income', authenticateToken, async (req, res) => {
  try {
    const incomeItem = {
      id: incomeIdCounter++,
      userId: req.userId,
      ...req.body,
      createdAt: new Date()
    };
    income.push(incomeItem);
    res.status(201).json(incomeItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/income/:id', authenticateToken, async (req, res) => {
  try {
    const incomeIndex = income.findIndex(i => i.id === parseInt(req.params.id) && i.userId === req.userId);
    if (incomeIndex === -1) {
      return res.status(404).json({ error: 'Income not found' });
    }
    income.splice(incomeIndex, 1);
    res.json({ message: 'Income deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Budget Routes
app.get('/api/budgets', authenticateToken, async (req, res) => {
  try {
    const userBudgets = budgets.filter(b => b.userId === req.userId);
    
    // Calculate spent amount for each budget
    const budgetsWithSpent = userBudgets.map(budget => {
      const categoryExpenses = expenses.filter(e => 
        e.userId === req.userId && 
        e.category === budget.category &&
        new Date(e.date) >= new Date(new Date().setDate(1))
      );
      const spent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      return { ...budget, spent };
    });
    
    res.json(budgetsWithSpent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/budgets', authenticateToken, async (req, res) => {
  try {
    const budget = {
      id: budgetIdCounter++,
      userId: req.userId,
      ...req.body,
      createdAt: new Date()
    };
    budgets.push(budget);
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/budgets/:id', authenticateToken, async (req, res) => {
  try {
    const budgetIndex = budgets.findIndex(b => b.id === parseInt(req.params.id) && b.userId === req.userId);
    if (budgetIndex === -1) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    budgets[budgetIndex] = { ...budgets[budgetIndex], ...req.body };
    res.json(budgets[budgetIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/budgets/:id', authenticateToken, async (req, res) => {
  try {
    const budgetIndex = budgets.findIndex(b => b.id === parseInt(req.params.id) && b.userId === req.userId);
    if (budgetIndex === -1) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    budgets.splice(budgetIndex, 1);
    res.json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Goal Routes
app.get('/api/goals', authenticateToken, async (req, res) => {
  try {
    const userGoals = goals.filter(g => g.userId === req.userId);
    res.json(userGoals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/goals', authenticateToken, async (req, res) => {
  try {
    const goal = {
      id: goalIdCounter++,
      userId: req.userId,
      ...req.body,
      createdAt: new Date()
    };
    goals.push(goal);
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/goals/:id', authenticateToken, async (req, res) => {
  try {
    const goalIndex = goals.findIndex(g => g.id === parseInt(req.params.id) && g.userId === req.userId);
    if (goalIndex === -1) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    goals[goalIndex] = { ...goals[goalIndex], ...req.body };
    res.json(goals[goalIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/goals/:id', authenticateToken, async (req, res) => {
  try {
    const goalIndex = goals.findIndex(g => g.id === parseInt(req.params.id) && g.userId === req.userId);
    if (goalIndex === -1) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    goals.splice(goalIndex, 1);
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics Routes
app.get('/api/analytics/summary', authenticateToken, async (req, res) => {
  try {
    const startOfMonth = new Date(new Date().setDate(1));
    
    const userExpenses = expenses.filter(e => 
      e.userId === req.userId && 
      new Date(e.date) >= startOfMonth
    );
    
    const userIncome = income.filter(i => 
      i.userId === req.userId && 
      new Date(i.date) >= startOfMonth
    );
    
    const totalExpenses = userExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalIncome = userIncome.reduce((sum, inc) => sum + inc.amount, 0);
    
    // Group expenses by category
    const expensesByCategory = userExpenses.reduce((acc, exp) => {
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
    message: 'Server running without database (in-memory storage)',
    dataCount: {
      users: users.length,
      expenses: expenses.length,
      income: income.length,
      budgets: budgets.length,
      goals: goals.length
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📝 Using IN-MEMORY storage (data will be lost on restart)`);
  console.log(`🌐 API available at: http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});