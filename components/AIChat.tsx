import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Loader2, Bot, User, Sparkles } from 'lucide-react';
import { Message } from '../types';
import { generateTextResponse, generateImageResponse } from '../services/geminiService';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello, I'm Aura. How can I help you organize your life or spark your creativity today?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState<'chat' | 'image'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      if (mode === 'image') {
        const result = await generateImageResponse(userMsg.text);
        if (result.imageUrl) {
          const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: `Here is the image you requested based on: "${userMsg.text}"`,
            image: result.imageUrl,
            timestamp: Date.now()
          };
          setMessages(prev => [...prev, aiMsg]);
        } else {
          throw new Error(result.error || "Image generation failed");
        }
      } else {
        // Prepare history for context
        const history = messages.slice(-10).map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));
        
        const responseText = await generateTextResponse(userMsg.text, history);
        
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: responseText,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I apologize, but I encountered an error processing your request.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      setMode('chat'); // Reset to chat after image gen
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-aura-500 to-indigo-600 text-white rounded-tr-none'
                  : 'glass-panel text-gray-100 rounded-tl-none border border-white/10'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 opacity-50 text-xs">
                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                <span>{msg.role === 'user' ? 'You' : 'Aura'}</span>
              </div>
              
              {msg.image ? (
                <div className="mt-2 rounded-lg overflow-hidden border border-white/20">
                  <img src={msg.image} alt="Generated" className="w-full h-auto object-cover" />
                </div>
              ) : null}
              
              <div className="whitespace-pre-wrap leading-relaxed">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start w-full">
            <div className="glass-panel p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <Loader2 className="animate-spin text-aura-400" size={16} />
              <span className="text-sm text-gray-400">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 glass-panel border-t border-white/10">
        <div className="max-w-3xl mx-auto flex items-end gap-2 bg-aura-900/50 p-2 rounded-xl border border-white/10 ring-1 ring-white/5 focus-within:ring-aura-400/50 transition-all">
          <button
            onClick={() => setMode(mode === 'chat' ? 'image' : 'chat')}
            className={`p-2 rounded-lg transition-colors ${
              mode === 'image' ? 'bg-pink-500/20 text-pink-400' : 'hover:bg-white/10 text-gray-400'
            }`}
            title="Toggle Image Generation"
          >
            {mode === 'image' ? <Sparkles size={20} /> : <ImageIcon size={20} />}
          </button>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode === 'image' ? "Describe an image to generate..." : "Ask Aura anything..."}
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 resize-none max-h-32 py-2"
            rows={1}
          />
          
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-2 bg-aura-500 hover:bg-aura-400 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
        {mode === 'image' && (
          <div className="text-xs text-center mt-2 text-pink-300">
            Image generation mode active. Describe what you want to see.
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChat;