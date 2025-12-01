

export type Tone = 'Professional' | 'Confident' | 'Friendly' | 'Creative';

export interface CoverLetterState {
  cvText: string;
  cvFile?: {
    name: string;
    data: string; // base64 string without header
    mimeType: string;
  };
  jobDescription: string;
  tone: Tone;
  minWords?: number;
  generatedLetter: string;
  isGenerating: boolean;
  error?: string;
}

export const TONE_OPTIONS: { value: Tone; label: string; description: string }[] = [
  { value: 'Professional', label: 'Professional', description: 'Standard, respectful, and polished.' },
  { value: 'Confident', label: 'Confident', description: 'Assertive, highlighting achievements strongly.' },
  { value: 'Friendly', label: 'Friendly', description: 'Warm, approachable, and team-oriented.' },
  { value: 'Creative', label: 'Creative', description: 'Unique, engaging, and out-of-the-box.' },
];

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  image?: string;
}

export interface Habit {
  id: string;
  title: string;
  streak: number;
  completedDates: string[];
  icon: string;
  color: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  date: string;
  tags: string[];
  isVoiceEntry: boolean;
}

export interface MoodLog {
  id: string;
  value: number;
  date: string;
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  type: 'expense' | 'income';
}