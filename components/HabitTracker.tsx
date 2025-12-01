import React, { useState } from 'react';
import { Plus, Check, Trash2, Flame, Calendar } from 'lucide-react';
import { Habit } from '../types';

const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', title: 'Morning Meditation', streak: 12, completedDates: [], icon: '🧘', color: 'bg-purple-500' },
    { id: '2', title: 'Read 30 mins', streak: 5, completedDates: [], icon: '📚', color: 'bg-blue-500' },
    { id: '3', title: 'Drink Water', streak: 42, completedDates: [], icon: '💧', color: 'bg-cyan-500' },
  ]);
  const [newHabit, setNewHabit] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => {
      if (h.id === id) {
        const isCompleted = h.completedDates.includes(today);
        return {
          ...h,
          completedDates: isCompleted 
            ? h.completedDates.filter(d => d !== today)
            : [...h.completedDates, today],
          streak: isCompleted ? Math.max(0, h.streak - 1) : h.streak + 1
        };
      }
      return h;
    }));
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const habit: Habit = {
      id: Date.now().toString(),
      title: newHabit,
      streak: 0,
      completedDates: [],
      icon: '✨',
      color: 'bg-pink-500'
    };
    setHabits([...habits, habit]);
    setNewHabit('');
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">Habits</h2>
        <p className="text-gray-400">Build your consistency, one day at a time.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map(habit => {
          const isDone = habit.completedDates.includes(today);
          return (
            <div key={habit.id} className="glass-panel p-4 rounded-xl flex items-center justify-between group hover:bg-white/5 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${habit.color} bg-opacity-20 text-white ring-2 ring-white/10`}>
                  {habit.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{habit.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Flame size={12} className="text-orange-400" />
                    <span>{habit.streak} day streak</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isDone 
                      ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]' 
                      : 'bg-white/10 text-gray-500 hover:bg-white/20'
                  }`}
                >
                  <Check size={20} />
                </button>
                <button 
                  onClick={() => deleteHabit(habit.id)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Habit */}
      <div className="glass-panel p-2 rounded-xl flex items-center gap-2 pl-4 mt-6">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Add a new habit..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-600"
          onKeyDown={(e) => e.key === 'Enter' && addHabit()}
        />
        <button 
          onClick={addHabit}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
      
      {/* Simple Heatmap Visual */}
      <div className="glass-panel p-6 rounded-xl mt-8">
        <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-aura-400" />
            <h3 className="font-semibold">Consistency Heatmap</h3>
        </div>
        <div className="flex gap-1 flex-wrap justify-center">
            {Array.from({ length: 28 }).map((_, i) => (
                <div 
                    key={i} 
                    className={`w-8 h-8 rounded-md ${
                        Math.random() > 0.4 ? 'bg-aura-500/80' : 'bg-white/5'
                    }`} 
                />
            ))}
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;