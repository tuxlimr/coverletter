import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Save, Hash, FileText, Wand2 } from 'lucide-react';
import { JournalEntry } from '../types';
import { summarizeJournal } from '../services/geminiService';

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentContent, setCurrentContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Mock Speech Recognition for Demo (since generic API might flakiness without extensive permission handling code)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      const phrases = [
        "Today was a productive day.",
        " I managed to finish the project.",
        " Feeling a bit tired but satisfied.",
        " Need to remember to call Mom tomorrow."
      ];
      let i = 0;
      interval = setInterval(() => {
        if (i < phrases.length) {
          setCurrentContent(prev => prev + phrases[i]);
          i++;
        } else {
            setIsRecording(false);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const saveEntry = async () => {
    if (!currentContent.trim()) return;

    setIsSummarizing(true);
    const tagsRaw = await summarizeJournal(currentContent);
    const tags = tagsRaw.split(',').map(t => t.trim());
    setIsSummarizing(false);

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      content: currentContent,
      date: new Date().toISOString(),
      tags: tags,
      isVoiceEntry: false // In a real app, track if source was audio
    };

    setEntries([newEntry, ...entries]);
    setCurrentContent('');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto h-full flex flex-col">
      <header className="mb-6 flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Journal</h2>
            <p className="text-gray-400 text-sm">Capture your thoughts.</p>
        </div>
      </header>

      <div className="glass-panel p-4 rounded-2xl mb-8 relative">
        <textarea
          value={currentContent}
          onChange={(e) => setCurrentContent(e.target.value)}
          placeholder="What's on your mind? Type or tap the mic..."
          className="w-full bg-transparent border-none focus:ring-0 text-gray-100 placeholder-gray-500 min-h-[150px] resize-none text-lg leading-relaxed"
        />
        
        <div className="flex justify-between items-center mt-4 border-t border-white/10 pt-4">
          <button
            onClick={toggleRecording}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              isRecording 
                ? 'bg-red-500/20 text-red-400 animate-pulse' 
                : 'bg-white/5 hover:bg-white/10 text-gray-400'
            }`}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            <span className="text-sm">{isRecording ? 'Listening...' : 'Dictate'}</span>
          </button>

          <button
            onClick={saveEntry}
            disabled={!currentContent.trim() || isSummarizing}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full text-white font-medium hover:shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all disabled:opacity-50"
          >
            {isSummarizing ? (
              <>
                <Wand2 size={18} className="animate-spin" />
                <span>AI Processing...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Note</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {entries.length === 0 && (
            <div className="text-center text-gray-600 mt-10">
                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                <p>No entries yet. Start writing your story.</p>
            </div>
        )}
        {entries.map(entry => (
          <div key={entry.id} className="glass-panel p-5 rounded-xl hover:bg-white/5 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-gray-400 font-mono">
                {new Date(entry.date).toLocaleString()}
              </span>
              <div className="flex gap-2">
                {entry.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] uppercase tracking-wider bg-white/5 px-2 py-1 rounded text-cyan-300">
                        {tag}
                    </span>
                ))}
              </div>
            </div>
            <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journal;