import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Target, Wallet, PiggyBank, AlertCircle, Plus, Edit2, Trash2, Calendar, Filter, Download, Upload, CreditCard, Receipt, Settings, User, LogOut, Menu, X, MessageCircle, Send, Bot, Minimize2 } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState({ name: 'Mr. Tasmir Khan', email: 'tasmir@finhealth.com', currency: 'USD' });
  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Food', amount: 450, date: '2025-10-15', description: 'Groceries', paymentMethod: 'Credit Card' },
    { id: 2, category: 'Transport', amount: 120, date: '2025-10-18', description: 'Uber rides', paymentMethod: 'Debit Card' },
    { id: 3, category: 'Entertainment', amount: 80, date: '2025-10-19', description: 'Movie tickets', paymentMethod: 'Cash' },
    { id: 4, category: 'Utilities', amount: 200, date: '2025-10-10', description: 'Electricity', paymentMethod: 'Bank Transfer' },
    { id: 5, category: 'Healthcare', amount: 150, date: '2025-10-12', description: 'Doctor visit', paymentMethod: 'Credit Card' },
    { id: 6, category: 'Shopping', amount: 300, date: '2025-10-20', description: 'Clothes', paymentMethod: 'Credit Card' },
  ]);
  const [income, setIncome] = useState([
    { id: 1, source: 'Salary', amount: 5000, date: '2025-10-01', description: 'Monthly salary' },
    { id: 2, source: 'Freelance', amount: 800, date: '2025-10-15', description: 'Project payment' },
    { id: 3, source: 'Investment', amount: 150, date: '2025-10-22', description: 'Stock dividends' },
  ]);
  const [budgets, setBudgets] = useState([
    { id: 1, category: 'Food', limit: 600, period: 'monthly' },
    { id: 2, category: 'Transport', limit: 200, period: 'monthly' },
    { id: 3, category: 'Entertainment', limit: 150, period: 'monthly' },
    { id: 4, category: 'Utilities', limit: 250, period: 'monthly' },
  ]);
  const [goals, setGoals] = useState([
    { id: 1, name: 'Emergency Fund', target: 10000, current: 6500, deadline: '2025-12-31', category: 'Savings' },
    { id: 2, name: 'Vacation', target: 3000, current: 1200, deadline: '2025-11-30', category: 'Travel' },
    { id: 3, name: 'New Laptop', target: 1500, current: 900, deadline: '2025-11-15', category: 'Technology' },
  ]);
  const [showModal, setShowModal] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hi Mr. Tasmir Khan! 👋 I\'m your personal finance assistant. How can I help you today?', timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : 0;

  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other'];
  const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Digital Wallet'];

  const expenseByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));
  const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#6366f1'];

  const monthlyData = [
    { month: 'Jul', income: 4800, expenses: 3200 },
    { month: 'Aug', income: 5200, expenses: 3500 },
    { month: 'Sep', income: 4900, expenses: 3100 },
    { month: 'Oct', income: 5950, expenses: 1300 },
  ];

  const budgetsWithSpent = budgets.map(budget => {
    const spent = expenses
      .filter(e => e.category === budget.category)
      .reduce((sum, e) => sum + e.amount, 0);
    return { ...budget, spent };
  });

  // AI Chatbot Logic
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: chatInput,
      timestamp: new Date()
    };

    setChatMessages([...chatMessages, userMessage]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(chatInput.toLowerCase());
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const generateBotResponse = (input) => {
    // Financial insights based on user data
    const insights = {
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
      topCategory: Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0],
      budgetAlerts: budgetsWithSpent.filter(b => (b.spent / b.limit) > 1).length,
      goalsProgress: goals.map(g => ({ name: g.name, progress: ((g.current / g.target) * 100).toFixed(0) }))
    };

    // AI Response Logic
    if (input.includes('income') || input.includes('earning')) {
      return `Your total income this month is ${insights.totalIncome.toFixed(2)}. You have ${income.length} income sources. Your main source is ${income.sort((a, b) => b.amount - a.amount)[0].source} with ${income[0].amount.toFixed(2)}. 💰`;
    }
    
    if (input.includes('expense') || input.includes('spending') || input.includes('spent')) {
      return `You've spent ${insights.totalExpenses.toFixed(2)} this month. Your highest spending category is ${insights.topCategory[0]} at ${insights.topCategory[1].toFixed(2)}. ${insights.budgetAlerts > 0 ? `⚠️ Warning: You're over budget in ${insights.budgetAlerts} categories!` : '✅ You\'re within budget in all categories!'}`;
    }
    
    if (input.includes('saving') || input.includes('save')) {
      return `Great question! Your net savings this month is ${insights.netSavings.toFixed(2)}, which is a ${insights.savingsRate}% savings rate. ${insights.savingsRate > 20 ? '🎉 Excellent job! You\'re saving well!' : insights.savingsRate > 10 ? '👍 Good savings rate, keep it up!' : '💡 Try to increase your savings rate to at least 20%.'} `;
    }
    
    if (input.includes('budget')) {
      const overBudget = budgetsWithSpent.filter(b => (b.spent / b.limit) > 1);
      if (overBudget.length > 0) {
        return `You're currently over budget in ${overBudget.length} categories: ${overBudget.map(b => `${b.category} (${((b.spent / b.limit) * 100).toFixed(0)}%)`).join(', ')}. Consider reducing spending in these areas. 📊`;
      }
      return `Good news! You're within budget in all categories. Keep up the good financial discipline! ✅`;
    }
    
    if (input.includes('goal') || input.includes('target')) {
      const goalsSummary = insights.goalsProgress.map(g => `${g.name}: ${g.progress}%`).join(', ');
      return `You have ${goals.length} active financial goals: ${goalsSummary}. ${goals.some(g => (g.current / g.target) > 0.8) ? '🎯 You\'re very close to achieving some goals!' : '💪 Keep contributing regularly to reach your targets!'}`;
    }
    
    if (input.includes('advice') || input.includes('tip') || input.includes('suggest')) {
      const tips = [
        `💡 Your highest expense is ${insights.topCategory[0]}. Try reducing it by 10% to save an extra ${(insights.topCategory[1] * 0.1).toFixed(2)} this month!`,
        `🎯 You could reach your goals faster by increasing your savings rate to 25%. This would give you an extra ${((totalIncome * 0.25) - netSavings).toFixed(2)} per month.`,
        `📊 Consider setting up automatic transfers to your savings account right after receiving income.`,
        `💳 Track your daily expenses to identify unnecessary spending. Small savings add up!`,
        `🏆 Challenge yourself to a "no-spend day" once a week to boost your savings.`
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return `Hello Mr. Tasmir Khan! 👋 How can I help you manage your finances today? You can ask me about your income, expenses, savings, budgets, or goals!`;
    }
    
    if (input.includes('help') || input.includes('what can you do')) {
      return `I can help you with:\n\n💰 Income analysis\n📊 Expense tracking\n💵 Savings insights\n🎯 Goal progress\n📈 Budget monitoring\n💡 Financial advice\n\nJust ask me anything about your finances!`;
    }
    
    if (input.includes('report') || input.includes('summary')) {
      return `📊 Financial Summary:\n\n💰 Income: ${insights.totalIncome.toFixed(2)}\n📉 Expenses: ${insights.totalExpenses.toFixed(2)}\n💵 Net Savings: ${insights.netSavings.toFixed(2)}\n📈 Savings Rate: ${insights.savingsRate}%\n🎯 Active Goals: ${goals.length}\n\n${insights.budgetAlerts > 0 ? '⚠️ ' + insights.budgetAlerts + ' budget alerts!' : '✅ All budgets on track!'}`;
    }

    // Default response
    return `I understand you're asking about "${input}". I can help you with income, expenses, savings, budgets, and financial goals. Try asking specific questions like "How much did I spend?" or "What's my savings rate?" 💬`;
  };

  const quickQuestions = [
    "How much did I spend this month?",
    "What's my savings rate?",
    "Show my budget status",
    "How are my goals doing?",
    "Give me financial advice"
  ];

  const ExpenseForm = ({ expense, onClose }) => {
    const [formData, setFormData] = useState(expense || {
      category: 'Food',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      paymentMethod: 'Cash'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (expense) {
        setExpenses(expenses.map(exp => exp.id === expense.id ? { ...formData, id: expense.id, amount: parseFloat(formData.amount) } : exp));
      } else {
        setExpenses([...expenses, { ...formData, id: Date.now(), amount: parseFloat(formData.amount) }]);
      }
      onClose();
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            {categories.map(cat => <option key={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <select value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            {paymentMethods.map(method => <option key={method}>{method}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
        </div>
        <div className="flex gap-2">
          <button onClick={handleSubmit} className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
            {expense ? 'Update' : 'Add'} Expense
          </button>
          <button onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
        </div>
      </div>
    );
  };

  const IncomeForm = ({ incomeItem, onClose }) => {
    const [formData, setFormData] = useState(incomeItem || {
      source: 'Salary',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (incomeItem) {
        setIncome(income.map(inc => inc.id === incomeItem.id ? { ...formData, id: incomeItem.id, amount: parseFloat(formData.amount) } : inc));
      } else {
        setIncome([...income, { ...formData, id: Date.now(), amount: parseFloat(formData.amount) }]);
      }
      onClose();
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
          <select value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option>Salary</option>
            <option>Freelance</option>
            <option>Investment</option>
            <option>Business</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
        </div>
        <div className="flex gap-2">
          <button onClick={handleSubmit} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            {incomeItem ? 'Update' : 'Add'} Income
          </button>
          <button onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
        </div>
      </div>
    );
  };

  const GoalForm = ({ goal, onClose }) => {
    const [formData, setFormData] = useState(goal || {
      name: '',
      target: '',
      current: '',
      deadline: '',
      category: 'Savings'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (goal) {
        setGoals(goals.map(g => g.id === goal.id ? { ...formData, id: goal.id, target: parseFloat(formData.target), current: parseFloat(formData.current) } : g));
      } else {
        setGoals([...goals, { ...formData, id: Date.now(), target: parseFloat(formData.target), current: parseFloat(formData.current) }]);
      }
      onClose();
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option>Savings</option>
            <option>Travel</option>
            <option>Technology</option>
            <option>Education</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
          <input type="number" step="0.01" value={formData.target} onChange={(e) => setFormData({...formData, target: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Amount</label>
          <input type="number" step="0.01" value={formData.current} onChange={(e) => setFormData({...formData, current: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
          <input type="date" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
        </div>
        <div className="flex gap-2">
          <button onClick={handleSubmit} className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
            {goal ? 'Update' : 'Create'} Goal
          </button>
          <button onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
        </div>
      </div>
    );
  };

  const Dashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <TrendingUp size={28} />
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">+12.5%</span>
          </div>
          <div className="text-3xl font-bold">${totalIncome.toFixed(2)}</div>
          <div className="text-sm opacity-90 mt-1">Total Income</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <TrendingDown size={28} />
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">-5.2%</span>
          </div>
          <div className="text-3xl font-bold">${totalExpenses.toFixed(2)}</div>
          <div className="text-sm opacity-90 mt-1">Total Expenses</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <PiggyBank size={28} />
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">{savingsRate}%</span>
          </div>
          <div className="text-3xl font-bold">${netSavings.toFixed(2)}</div>
          <div className="text-sm opacity-90 mt-1">Net Savings</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <Target size={28} />
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">{goals.length} Active</span>
          </div>
          <div className="text-3xl font-bold">${goals.reduce((sum, g) => sum + g.target, 0).toFixed(0)}</div>
          <div className="text-sm opacity-90 mt-1">Goals Target</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <PieChart size={24} className="text-purple-600" />
            Expense Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={100} dataKey="value">
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={24} className="text-green-600" />
            Income vs Expenses
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <AlertCircle size={24} className="text-orange-600" />
            Budget Overview
          </h3>
          <button onClick={() => setActiveTab('budgets')} className="text-sm text-purple-600 hover:text-purple-700">View All</button>
        </div>
        <div className="space-y-4">
          {budgetsWithSpent.slice(0, 4).map(budget => {
            const percentage = (budget.spent / budget.limit) * 100;
            const isOverBudget = percentage > 100;
            return (
              <div key={budget.id}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700">{budget.category}</span>
                  <span className={`text-sm ${isOverBudget ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                    ${budget.spent.toFixed(2)} / ${budget.limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                  <div className={`h-3 rounded-full transition-all ${isOverBudget ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-purple-500 to-purple-600'}`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                </div>
                {isOverBudget && (
                  <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
                    <AlertCircle size={12} />
                    <span>Over budget by ${(budget.spent - budget.limit).toFixed(2)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Target size={24} className="text-blue-600" />
            Financial Goals Progress
          </h3>
          <button onClick={() => setActiveTab('goals')} className="text-sm text-purple-600 hover:text-purple-700">Manage Goals</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map(goal => {
            const percentage = (goal.current / goal.target) * 100;
            return (
              <div key={goal.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{goal.name}</h4>
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">{goal.category}</span>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>${goal.current}</span>
                    <span>${goal.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                  </div>
                  <div className="text-center mt-1 text-sm font-semibold text-purple-600">{percentage.toFixed(0)}%</div>
                </div>
                <div className="text-xs text-gray-500">Deadline: {new Date(goal.deadline).toLocaleDateString()}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const TransactionsView = () => {
    const filteredExpenses = filterCategory === 'all' ? expenses : expenses.filter(e => e.category === filterCategory);
    
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Receipt size={28} className="text-purple-600" />
            Transactions
          </h2>
          <div className="flex gap-2">
            <button onClick={() => { setEditingItem(null); setShowModal('expense'); }} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2">
              <Plus size={18} />
              Add Expense
            </button>
            <button onClick={() => { setEditingItem(null); setShowModal('income'); }} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
              <Plus size={18} />
              Add Income
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-600" />
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
              <option value="all">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-gray-600" />
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-red-50 px-6 py-4 border-b border-red-100">
              <h3 className="text-lg font-bold text-red-800 flex items-center gap-2">
                <TrendingDown size={20} />
                Recent Expenses
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredExpenses.slice(0, 5).map(expense => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{new Date(expense.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">{expense.category}</span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-red-600 text-right">-${expense.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => { setEditingItem(expense); setShowModal('expense'); }} className="text-blue-600 hover:text-blue-800">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => setExpenses(expenses.filter(e => e.id !== expense.id))} className="text-red-600 hover:text-red-800">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-green-50 px-6 py-4 border-b border-green-100">
              <h3 className="text-lg font-bold text-green-800 flex items-center gap-2">
                <TrendingUp size={20} />
                Recent Income
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {income.map(inc => (
                    <tr key={inc.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{new Date(inc.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{inc.source}</span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-600 text-right">+${inc.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => { setEditingItem(inc); setShowModal('income'); }} className="text-blue-600 hover:text-blue-800">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => setIncome(income.filter(i => i.id !== inc.id))} className="text-red-600 hover:text-red-800">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BudgetsView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CreditCard size={28} className="text-purple-600" />
          Budget Management
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgetsWithSpent.map(budget => {
          const percentage = (budget.spent / budget.limit) * 100;
          const isOverBudget = percentage > 100;
          const remaining = budget.limit - budget.spent;
          
          return (
            <div key={budget.id} className={`bg-white rounded-xl p-6 shadow-lg border-2 ${isOverBudget ? 'border-red-200' : 'border-gray-100'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{budget.category}</h3>
                  <p className="text-sm text-gray-500 capitalize">{budget.period} Budget</p>
                </div>
                <span className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-purple-600'}`}>
                  {percentage.toFixed(0)}%
                </span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Spent: ${budget.spent.toFixed(2)}</span>
                  <span>Limit: ${budget.limit.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div className={`h-4 rounded-full transition-all ${isOverBudget ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-purple-500 to-purple-600'}`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                </div>
              </div>

              <div className={`${isOverBudget ? 'bg-red-50' : 'bg-gray-50'} rounded-lg p-3`}>
                {isOverBudget ? (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle size={16} />
                    <div>
                      <div className="text-sm font-semibold">Over Budget!</div>
                      <div className="text-xs">Exceeded by ${Math.abs(remaining).toFixed(2)}</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm text-gray-600">Remaining</div>
                    <div className="text-lg font-bold text-gray-800">${remaining.toFixed(2)}</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const GoalsView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Target size={28} className="text-purple-600" />
          Financial Goals
        </h2>
        <button onClick={() => { setEditingItem(null); setShowModal('goal'); }} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
          <Plus size={18} />
          Add Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => {
          const percentage = (goal.current / goal.target) * 100;
          const remaining = goal.target - goal.current;
          const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
          
          return (
            <div key={goal.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{goal.name}</h3>
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">{goal.category}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingItem(goal); setShowModal('goal'); }} className="text-blue-600 hover:text-blue-800">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => setGoals(goals.filter(g => g.id !== goal.id))} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Current: ${goal.current.toFixed(2)}</span>
                  <span>Target: ${goal.target.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div className="h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                </div>
                <div className="text-center mt-2">
                  <span className="text-2xl font-bold text-purple-600">{percentage.toFixed(1)}%</span>
                  <span className="text-sm text-gray-500 ml-2">Complete</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-blue-600 mb-1">Remaining</div>
                  <div className="text-lg font-bold text-blue-800">${remaining.toFixed(2)}</div>
                </div>
                <div className={`${daysLeft < 30 ? 'bg-orange-50' : 'bg-gray-50'} rounded-lg p-3`}>
                  <div className={`text-xs ${daysLeft < 30 ? 'text-orange-600' : 'text-gray-600'} mb-1`}>Days Left</div>
                  <div className={`text-lg font-bold ${daysLeft < 30 ? 'text-orange-800' : 'text-gray-800'}`}>{daysLeft > 0 ? daysLeft : 'Overdue'}</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">Deadline: {new Date(goal.deadline).toLocaleDateString()}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const ReportsView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Financial Reports</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
          <Download size={18} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Income</span>
              <span className="font-bold text-green-600">${totalIncome.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Expenses</span>
              <span className="font-bold text-red-600">${totalExpenses.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t">
              <span className="text-gray-800 font-semibold">Net Savings</span>
              <span className="font-bold text-blue-600">${netSavings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Savings Rate</span>
              <span className="font-bold text-purple-600">{savingsRate}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Top Spending Categories</h3>
          <div className="space-y-3">
            {Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-gray-600">{category}</span>
                <span className="font-semibold text-gray-800">${amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Goals Progress</h3>
          <div className="space-y-3">
            {goals.map(goal => {
              const percentage = (goal.current / goal.target) * 100;
              return (
                <div key={goal.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{goal.name}</span>
                    <span className="font-semibold text-purple-600">{percentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Monthly Trend</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#10b981" />
            <Bar dataKey="expenses" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Wallet className="text-purple-600" size={32} />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">FinHealth Pro</h1>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'dashboard' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                Dashboard
              </button>
              <button onClick={() => setActiveTab('transactions')} className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'transactions' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                Transactions
              </button>
              <button onClick={() => setActiveTab('budgets')} className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'budgets' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                Budgets
              </button>
              <button onClick={() => setActiveTab('goals')} className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'goals' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                Goals
              </button>
              <button onClick={() => setActiveTab('reports')} className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'reports' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                Reports
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 hidden md:block">Welcome, {user.name}</span>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {sidebarOpen && (
        <div className="md:hidden bg-white shadow-lg p-4 space-y-2">
          <button onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">Dashboard</button>
          <button onClick={() => { setActiveTab('transactions'); setSidebarOpen(false); }} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">Transactions</button>
          <button onClick={() => { setActiveTab('budgets'); setSidebarOpen(false); }} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">Budgets</button>
          <button onClick={() => { setActiveTab('goals'); setSidebarOpen(false); }} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">Goals</button>
          <button onClick={() => { setActiveTab('reports'); setSidebarOpen(false); }} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">Reports</button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'transactions' && <TransactionsView />}
        {activeTab === 'budgets' && <BudgetsView />}
        {activeTab === 'goals' && <GoalsView />}
        {activeTab === 'reports' && <ReportsView />}
      </div>

      {/* AI Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen ? (
          <button
            onClick={() => setChatOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
          >
            <MessageCircle size={28} />
          </button>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold">FinHealth AI Assistant</h3>
                  <p className="text-xs opacity-90">Always here to help</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition">
                <Minimize2 size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'} rounded-2xl px-4 py-2`}>
                    <p className="text-sm whitespace-pre-line">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-purple-200' : 'text-gray-500'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Questions */}
            <div className="px-4 py-2 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setChatInput(q);
                      setTimeout(() => {
                        const fakeEvent = { preventDefault: () => {}, target: { value: q } };
                        handleChatSubmit(fakeEvent);
                      }, 100);
                    }}
                    className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full whitespace-nowrap hover:bg-purple-200 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about your finances..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-full hover:shadow-lg transition"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {editingItem ? 'Edit' : 'Add'} {showModal === 'expense' ? 'Expense' : showModal === 'income' ? 'Income' : 'Goal'}
            </h3>
            {showModal === 'expense' && <ExpenseForm expense={editingItem} onClose={() => { setShowModal(null); setEditingItem(null); }} />}
            {showModal === 'income' && <IncomeForm incomeItem={editingItem} onClose={() => { setShowModal(null); setEditingItem(null); }} />}
            {showModal === 'goal' && <GoalForm goal={editingItem} onClose={() => { setShowModal(null); setEditingItem(null); }} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;