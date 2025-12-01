import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DollarSign, Plus } from 'lucide-react';
import { Transaction } from '../types';

const FinanceTracker: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', amount: 120, category: 'Food', date: '2023-10-01', type: 'expense' },
    { id: '2', amount: 450, category: 'Rent', date: '2023-10-01', type: 'expense' },
    { id: '3', amount: 80, category: 'Transport', date: '2023-10-02', type: 'expense' },
  ]);

  const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'];

  const handleAdd = () => {
    if (!amount) return;
    const newTx: Transaction = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString(),
      type: 'expense'
    };
    setTransactions([...transactions, newTx]);
    setAmount('');
  };

  const data = transactions.reduce((acc, curr) => {
    const found = acc.find(i => i.name === curr.category);
    if (found) {
      found.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">Finance</h2>
        <p className="text-gray-400">Simple spending overview.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Transaction */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-xl font-medium mb-6">Add Expense</h3>
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-400">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none [&>option]:bg-gray-800"
            >
              <option value="Food">🍔 Food</option>
              <option value="Transport">🚗 Transport</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Entertainment">🎬 Entertainment</option>
              <option value="Rent">🏠 Rent</option>
            </select>
            <button
              onClick={handleAdd}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Add Transaction
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative">
          <h3 className="absolute top-6 left-6 text-lg font-medium text-gray-300">Spending Breakdown</h3>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <span className="text-gray-400 text-xs">Total</span>
            <div className="text-2xl font-bold">${totalSpent}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceTracker;