
import React, { useState, useRef } from 'react';
import { 
  Briefcase, 
  FileText, 
  Sparkles, 
  Copy, 
  Download, 
  Printer, 
  AlertCircle,
  Upload,
  X,
  FileCheck,
  AlignLeft,
  Check,
  ChevronRight
} from 'lucide-react';
import { CoverLetterState, TONE_OPTIONS } from '../types';
import { generateCoverLetter } from '../services/geminiService';

const CoverLetterBuilder: React.FC = () => {
  const [state, setState] = useState<CoverLetterState>({
    cvText: '',
    jobDescription: '',
    tone: 'Professional',
    minWords: undefined,
    generatedLetter: '',
    isGenerating: false
  });
  
  const [copied, setCopied] = useState(false);

  const outputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    // Validation: Require Job Description AND (CV Text OR CV File)
    if (!state.jobDescription.trim() || (!state.cvText.trim() && !state.cvFile)) {
      setState(prev => ({ ...prev, error: 'Please provide both your CV (Text or File) and the Job Description.' }));
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true, error: undefined }));

    try {
      // Pass the file data if it exists
      const letter = await generateCoverLetter(
        state.cvText, 
        state.jobDescription, 
        state.tone,
        state.cvFile,
        state.minWords
      );
      setState(prev => ({ ...prev, generatedLetter: letter, isGenerating: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred.' 
      }));
    }
  };

  const copyToClipboard = async () => {
    if (!state.generatedLetter) return;
    
    try {
      await navigator.clipboard.writeText(state.generatedLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Navigator clipboard failed, using fallback', err);
      // Fallback for some browsers/contexts
      const textArea = document.createElement("textarea");
      textArea.value = state.generatedLetter;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error('Fallback copy failed', e);
      }
      document.body.removeChild(textArea);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Allowed types: PDF, Text, Markdown
    const allowedTypes = ['application/pdf', 'text/plain', 'text/markdown'];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.md')) {
      setState(prev => ({ ...prev, error: 'Unsupported file format. Please upload PDF or Text.' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Extract base64 data (remove dataURL prefix)
      const base64Data = result.split(',')[1];
      
      setState(prev => ({
        ...prev,
        error: undefined,
        cvFile: {
          name: file.name,
          data: base64Data,
          mimeType: file.type || 'text/plain'
        },
        cvText: '' // Clear text if file is uploaded
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setState(prev => ({ ...prev, cvFile: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 min-h-[calc(100vh-140px)]">
      
      {/* LEFT PANEL - INPUTS */}
      <div className="w-full xl:w-[40%] flex flex-col gap-6 no-print">
        
        {/* CV Input */}
        <div className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm flex flex-col gap-4 min-h-[280px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-blue-400">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText size={18} />
              </div>
              <h2 className="font-semibold text-slate-100">Your Resume</h2>
            </div>
            {!state.cvFile && (
              <button 
                onClick={triggerFileUpload}
                className="flex items-center gap-2 text-xs font-medium bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-slate-200 transition-all border border-slate-600"
              >
                <Upload size={14} />
                Upload PDF
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,.txt,.md"
              onChange={handleFileUpload}
            />
          </div>

          {state.cvFile ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-600 rounded-xl bg-slate-800/50 transition-all hover:border-slate-500">
              <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                <FileCheck size={28} className="text-blue-400" />
              </div>
              <p className="font-medium text-slate-200 text-sm mb-1">{state.cvFile.name}</p>
              <p className="text-xs text-slate-400 mb-6">Resume Loaded Successfully</p>
              <button 
                onClick={removeFile}
                className="text-xs flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 rounded-md hover:bg-red-500/10"
              >
                <X size={14} /> Remove
              </button>
            </div>
          ) : (
            <textarea
              className="w-full h-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none text-sm text-slate-300 placeholder-slate-500 resize-none font-mono leading-relaxed transition-all"
              placeholder="Paste your Resume/CV text here, or upload a PDF..."
              value={state.cvText}
              onChange={(e) => setState(prev => ({ ...prev, cvText: e.target.value }))}
            />
          )}
        </div>

        {/* Job Input */}
        <div className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm flex flex-col gap-4 min-h-[280px]">
          <div className="flex items-center gap-2.5 text-purple-400 mb-1">
             <div className="p-2 bg-purple-500/10 rounded-lg">
                <Briefcase size={18} />
             </div>
            <h2 className="font-semibold text-slate-100">Job Description</h2>
          </div>
          <textarea
            className="w-full h-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none text-sm text-slate-300 placeholder-slate-500 resize-none font-mono leading-relaxed transition-all"
            placeholder="Paste the job description and requirements here..."
            value={state.jobDescription}
            onChange={(e) => setState(prev => ({ ...prev, jobDescription: e.target.value }))}
          />
        </div>

        {/* Controls */}
        <div className="bg-slate-800/80 border border-slate-700 backdrop-blur-sm p-6 rounded-2xl shadow-lg space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300 block">Tone of Voice</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TONE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setState(prev => ({ ...prev, tone: opt.value }))}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                    state.tone === opt.value
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-400/50'
                      : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:border-slate-600 hover:text-slate-200'
                  }`}
                  title={opt.description}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
             <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
               <AlignLeft size={16} className="text-slate-500" /> 
               Target Word Count
               <span className="text-xs text-slate-500 font-normal ml-auto">Default: 400 words</span>
            </label>
            <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="2000"
                  placeholder="e.g. 350"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none placeholder-slate-600 transition-all"
                  value={state.minWords || ''}
                  onChange={(e) => {
                     const val = parseInt(e.target.value);
                     setState(prev => ({ ...prev, minWords: isNaN(val) ? undefined : val }));
                  }}
                />
            </div>
          </div>

          {state.error && (
            <div className="flex items-start gap-3 text-red-400 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{state.error}</p>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={state.isGenerating}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-600/20 hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            {state.isGenerating ? (
              <>
                <Sparkles className="animate-spin" size={20} />
                <span className="animate-pulse">Writing your letter...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} className="group-hover:scale-110 transition-transform duration-300" />
                <span>Generate Cover Letter</span>
                <ChevronRight size={18} className="opacity-70 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* RIGHT PANEL - OUTPUT (DOCUMENT PREVIEW) */}
      <div className="w-full xl:w-[60%] flex flex-col h-full relative group">
         <div className="bg-zinc-900/50 rounded-2xl border border-white/5 h-full flex flex-col overflow-hidden shadow-2xl relative">
          
          {/* Toolbar */}
          <div className="flex justify-between items-center p-4 border-b border-white/5 bg-zinc-900/80 backdrop-blur-xl sticky top-0 z-10">
            <h3 className="font-semibold text-slate-300 flex items-center gap-2 pl-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              Live Preview
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={copyToClipboard}
                disabled={!state.generatedLetter}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    copied 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-transparent'
                } disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              
              <div className="w-px h-6 bg-white/10 mx-1 self-center"></div>

              <button 
                 onClick={handlePrint}
                 disabled={!state.generatedLetter}
                 className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium"
              >
                <Download size={16} />
                PDF
              </button>
            </div>
          </div>

          {/* Document Editor Area (Gray Backdrop) */}
          <div className="flex-1 bg-zinc-900/80 overflow-y-auto p-4 md:p-8 flex justify-center custom-scrollbar">
             {/* Print Content (Hidden) */}
             <div className="print-only hidden">
                {state.generatedLetter}
             </div>

             {state.generatedLetter ? (
                /* Paper Sheet */
                <div className="w-full max-w-[21cm] min-h-[29.7cm] bg-white text-slate-900 shadow-2xl rounded-sm relative animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <textarea 
                      ref={outputRef}
                      className="w-full h-full min-h-[29.7cm] p-[2.54cm] bg-transparent border-none resize-none focus:outline-none font-serif text-[11pt] leading-relaxed selection:bg-blue-100"
                      value={state.generatedLetter}
                      onChange={(e) => setState(prev => ({...prev, generatedLetter: e.target.value}))}
                      spellCheck={true}
                    />
                </div>
             ) : (
                /* Empty State */
                <div className="w-full max-w-[21cm] min-h-[500px] md:min-h-[29.7cm] border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center text-slate-600 gap-4 bg-zinc-900/30">
                  <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center shadow-inner">
                    <Printer size={32} className="text-zinc-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400 font-medium">Ready to write</p>
                    <p className="text-slate-600 text-sm mt-1">Fill out the details on the left to start</p>
                  </div>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterBuilder;
