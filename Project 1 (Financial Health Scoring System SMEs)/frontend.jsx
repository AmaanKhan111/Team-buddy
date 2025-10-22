import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Target, CreditCard, Wallet, PiggyBank, AlertCircle } from 'lucide-react';

const FinancialHealthApp = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [user, setUser] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [income, setIncome] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [goals, setGoals] = useState([]);
    const [showModal, setShowModal] = useState(null);

    // Initialize with demo data
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
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option>Food</option>
                        <option>Transport</option>
                        <option>Entertainment</option>
                        <option>Utilities</option>
                        <option>Healthcare</option>
                        <option>Shopping</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                    />
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">
                        Add Expense
                    </button>
                    <button type="button" onClick={() => setShowModal(null)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">
                        Cancel
                    </button>
                </div>
            </form>
        );
    };

    const AddGoalForm = () => {
        const [formData, setFormData] = useState({
            name: '',
            target: '',
            current: '',
            deadline: ''
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            const newGoal = {
                id: goals.length + 1,
                ...formData,
                target: parseFloat(formData.target),
                current: parseFloat(formData.current)
            };
            setGoals([...goals, newGoal]);
            setShowModal(null);
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.target}
                        onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.current}
                        onChange={(e) => setFormData({ ...formData, current: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                    <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                    />
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">
                        Add Goal
                    </button>
                    <button type="button" onClick={() => setShowModal(null)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">
                        Cancel
                    </button>
                </div>
            </form>
        );
    };

    const Dashboard = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <TrendingUp size={32} />
                        <span className="text-sm opacity-90">This Month</span>
                    </div>
                    <div className="text-3xl font-bold mb-1">${totalIncome.toFixed(2)}</div>
                    <div className="text-sm opacity-90">Total Income</div>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <TrendingDown size={32} />
                        <span className="text-sm opacity-90">This Month</span>
                    </div>
                    <div className="text-3xl font-bold mb-1">${totalExpenses.toFixed(2)}</div>
                    <div className="text-sm opacity-90">Total Expenses</div>
                </div>

                <div className={`bg-gradient-to-br ${netSavings >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} rounded-xl p-6 text-white`}>
                    <div className="flex items-center justify-between mb-4">
                        <PiggyBank size={32} />
                        <span className="text-sm opacity-90">This Month</span>
                    </div>
                    <div className="text-3xl font-bold mb-1">${Math.abs(netSavings).toFixed(2)}</div>
                    <div className="text-sm opacity-90">{netSavings >= 0 ? 'Net Savings' : 'Deficit'}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Expense Distribution</h3>
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
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Budget Overview</h3>
                    <div className="space-y-4">
                        {budgets.map(budget => {
                            const percentage = (budget.spent / budget.limit) * 100;
                            const isOverBudget = percentage > 100;
                            return (
                                <div key={budget.id}>
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium text-gray-700">{budget.category}</span>
                                        <span className="text-sm text-gray-600">
                                            ${budget.spent} / ${budget.limit}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className={`h-3 rounded-full transition-all ${isOverBudget ? 'bg-red-500' : 'bg-purple-600'}`}
                                            style={{ width: `${Math.min(percentage, 100)}%` }}
                                        ></div>
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
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Financial Goals</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {goals.map(goal => {
                        const percentage = (goal.current / goal.target) * 100;
                        return (
                            <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Target className="text-purple-600" size={20} />
                                    <h4 className="font-semibold text-gray-800">{goal.name}</h4>
                                </div>
                                <div className="mb-3">
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
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

    const TransactionsView = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
                <button
                    onClick={() => setShowModal('expense')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                >
                    <DollarSign size={20} />
                    Add Expense
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {expenses.map(expense => (
                                <tr key={expense.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {new Date(expense.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{expense.description}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-red-600 text-right">
                                        -${expense.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const GoalsView = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Financial Goals</h2>
                <button
                    onClick={() => setShowModal('goal')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                >
                    <Target size={20} />
                    Add Goal
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goals.map(goal => {
                    const percentage = (goal.current / goal.target) * 100;
                    const remaining = goal.target - goal.current;
                    return (
                        <div key={goal.id} className="bg-white rounded-xl p-6 shadow-lg">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">{goal.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {percentage.toFixed(0)}%
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>Current: ${goal.current.toFixed(2)}</span>
                                    <span>Target: ${goal.target.toFixed(2)}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className="h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-sm text-gray-600">Remaining Amount</div>
                                <div className="text-lg font-bold text-gray-800">${remaining.toFixed(2)}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Wallet className="text-purple-600" size={32} />
                            <h1 className="text-2xl font-bold text-gray-800">FinHealth</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-700">Welcome, {user?.name}</span>
                            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                {user?.name?.charAt(0)}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 flex gap-4">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-6 py-2 rounded-lg font-medium transition ${activeTab === 'dashboard'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('transactions')}
                        className={`px-6 py-2 rounded-lg font-medium transition ${activeTab === 'transactions'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Transactions
                    </button>
                    <button
                        onClick={() => setActiveTab('goals')}
                        className={`px-6 py-2 rounded-lg font-medium transition ${activeTab === 'goals'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Goals
                    </button>
                </div>

                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'transactions' && <TransactionsView />}
                {activeTab === 'goals' && <GoalsView />}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">
                            {showModal === 'expense' ? 'Add New Expense' : 'Add New Goal'}
                        </h3>
                        {showModal === 'expense' ? <AddExpenseForm /> : <AddGoalForm />}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinancialHealthApp;

