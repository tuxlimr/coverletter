import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { MoodLog } from '../types';

const MoodTracker: React.FC = () => {
  // Mock initial data
  const [logs, setLogs] = useState<MoodLog[]>([
    { id: '1', value: 3, date: 'Mon' },
    { id: '2', value: 4, date: 'Tue' },
    { id: '3', value: 2, date: 'Wed' },
    { id: '4', value: 5, date: 'Thu' },
    { id: '5', value: 4, date: 'Fri' },
    { id: '6', value: 4, date: 'Sat' },
    { id: '7', value: 5, date: 'Sun' },
  ]);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const moods = [
    { val: 1, emoji: '😫', label: 'Terrible', color: 'bg-red-500' },
    { val: 2, emoji: '😕', label: 'Bad', color: 'bg-orange-500' },
    { val: 3, emoji: '😐', label: 'Okay', color: 'bg-yellow-500' },
    { val: 4, emoji: '🙂', label: 'Good', color: 'bg-lime-500' },
    { val: 5, emoji: '🤩', label: 'Amazing', color: 'bg-green-500' },
  ];

  const handleLog = () => {
    if (!selectedMood) return;
    const newLog: MoodLog = {
      id: Date.now().toString(),
      value: selectedMood,
      date: 'Today', // Simplified for chart
    };
    // Update chart data - shift out first, add new
    setLogs([...logs.slice(1), newLog]);
    setSelectedMood(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-orange-400">Mood & Wellness</h2>
        <p className="text-gray-400">Track your emotional rhythm.</p>
      </header>

      <div className="glass-panel p-8 rounded-2xl flex flex-col items-center gap-6">
        <h3 className="text-xl font-medium">How are you feeling right now?</h3>
        <div className="flex gap-4 md:gap-8 flex-wrap justify-center">
          {moods.map((m) => (
            <button
              key={m.val}
              onClick={() => setSelectedMood(m.val)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all transform hover:scale-110 ${
                selectedMood === m.val ? 'bg-white/10 ring-2 ring-white/50 scale-110' : 'hover:bg-white/5'
              }`}
            >
              <span className="text-4xl drop-shadow-lg">{m.emoji}</span>
              <span className="text-xs text-gray-400">{m.label}</span>
            </button>
          ))}
        </div>
        {selectedMood && (
          <button
            onClick={handleLog}
            className="mt-4 px-8 py-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full text-white font-bold hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all"
          >
            Log Mood
          </button>
        )}
      </div>

      <div className="glass-panel p-6 rounded-2xl h-[300px]">
        <h3 className="text-lg font-medium mb-4 text-gray-300">Weekly Trend</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={logs}>
            <defs>
              <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#6b7280" tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} />
            <YAxis hide domain={[1, 5]} />
            <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                itemStyle={{ color: '#fbbf24' }}
            />
            <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#fbbf24" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorMood)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoodTracker;