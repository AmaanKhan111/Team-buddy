import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Target, Wallet, PiggyBank, AlertCircle } from 'lucide-react';

const FinancialHealthApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(null);

  useEffect(() => {
    const demoUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      currency: 'USD'
    };

    const demoExpenses = [
      { id: 1, category: 'Food', amount: 450, date: '2025-10-15', description: 'Groceries' },
      { id: 2, category: 'Transport', amount: 120, date: '2025-10-18', description: 'Uber rides' },
      { id: 3, category: 'Entertainment', amount: 80, date: '2025-10-19', description: 'Movie tickets' },
      { id: 4, category: 'Utilities', amount: 200, date: '2025-10-10', description: 'Electricity bill' },
      { id: 5, category: 'Healthcare', amount: 150, date: '2025-10-12', description: 'Doctor visit' },
    ];

    const demoIncome = [
      { id: 1, source: 'Salary', amount: 5000, date: '2025-10-01', description: 'Monthly salary' },
      { id: 2, source: 'Freelance', amount: 800, date: '2025-10-15', description: 'Project payment' },
    ];

    const demoBudgets = [
      { id: 1, category: 'Food', limit: 600, spent: 450, period: 'monthly' },
      { id: 2, category: 'Transport', limit: 200, spent: 120, period: 'monthly' },
      { id: 3, category: 'Entertainment', limit: 150, spent: 80, period: 'monthly' },
      { id: 4, category: 'Utilities', limit: 250, spent: 200, period: 'monthly' },
    ];

    const demoGoals = [
      { id: 1, name: 'Emergency Fund', target: 10000, current: 6500, deadline: '2025-12-31' },
      { id: 2, name: 'Vacation', target: 3000, current: 1200, deadline: '2025-11-30' },
      { id: 3, name: 'New Laptop', target: 1500, current: 900, deadline: '2025-11-15' },
    ];

    setUser(demoUser);
    setExpenses(demoExpenses);
    setIncome(demoIncome);
    setBudgets(demoBudgets);
    setGoals(demoGoals);
  }, []);

  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const netSavings = totalIncome - totalExpenses;

  const expenseByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

  const AddExpenseForm = () => {
    const [formData, setFormData] = useState({
      category: 'Food',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const newExpense = {
        id: expenses.length + 1,
        ...formData,
        amount: parseFloat(formData.amount)
      };
      setExpenses([...expenses, newExpense]);
      setShowModal(null);
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option>Food</option>
            <option>Transport</option>
            <option>Entertainment</option>
            <option>Utilities</option>
            <option>Healthcare</option>
            <option>Shopping</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="flex gap-2">
          <button onClick={handleSubmit} className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
            Add Expense
          </button>
          <button onClick={() => setShowModal(null)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg">
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const Dashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <TrendingUp size={32} />
          <div className="text-3xl font-bold mt-4">${totalIncome.toFixed(2)}</div>
          <div className="text-sm opacity-90">Total Income</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
          <TrendingDown size={32} />
          <div className="text-3xl font-bold mt-4">${totalExpenses.toFixed(2)}</div>
          <div className="text-sm opacity-90">Total Expenses</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <PiggyBank size={32} />
          <div className="text-3xl font-bold mt-4">${netSavings.toFixed(2)}</div>
          <div className="text-sm opacity-90">Net Savings</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Expense Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Budget Overview</h3>
        <div className="space-y-4">
          {budgets.map(budget => {
            const percentage = (budget.spent / budget.limit) * 100;
            return (
              <div key={budget.id}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{budget.category}</span>
                  <span className="text-sm">${budget.spent} / ${budget.limit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-purple-600"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Financial Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map(goal => {
            const percentage = (goal.current / goal.target) * 100;
            return (
              <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">{goal.name}</h4>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>${goal.current}</span>
                    <span>${goal.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Deadline: {new Date(goal.deadline).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Wallet className="text-purple-600" size={32} />
              <h1 className="text-2xl font-bold">FinHealth</h1>
            </div>
            <div className="flex items-center gap-4">
              <span>Welcome, {user?.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-2 rounded-lg font-medium ${
              activeTab === 'dashboard' ? 'bg-purple-600 text-white' : 'bg-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setShowModal('expense')}
            className="px-6 py-2 rounded-lg font-medium bg-white"
          >
            Add Expense
          </button>
        </div>

        <Dashboard />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add New Expense</h3>
            <AddExpenseForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialHealthApp;