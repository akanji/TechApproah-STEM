import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Book, Play, Globe, Cpu, ArrowRight, Command, Sparkles, RefreshCcw, Brain } from 'lucide-react';
import { MODULES, SUBJECTS, RESOURCES, LAB_CATALOG } from '../constants';
import resourcesData from '../resources.json';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { ai, MODELS } from '../lib/gemini';
import Markdown from 'react-markdown';

interface SearchResult {
  id: string;
  title: string;
  type: 'module' | 'video' | 'resource' | 'lab';
  category?: string;
  description: string;
  action: () => void;
}

export function GlobalSearch({ onClose, onNavigate }: { onClose: () => void, onNavigate: (page: string, params?: any) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const { playSound } = useSoundEffects();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAIInquiry = async () => {
    if (!query.trim()) return;
    setIsThinking(true);
    setAiResponse(null);
    try {
      const response = await ai.models.generateContent({
        model: MODELS.flash,
        contents: [{
          role: "user",
          parts: [{ text: `The user is searching for "${query}" in an engineering lab app. 
          If it's a specific technical question, answer it deeply. If it's a request for a lab that doesn't exist, provide a detailed theoretical procedure for such a lab.` }]
        }],
        config: {
          systemInstruction: "You are the TechApproach AI Search Engine. Provide authoritative engineering insights when exact local matches are missing.",
        }
      });
      setAiResponse(response.text || "No insights found.");
    } catch (e) {
      console.error("AI Search Error:", e);
    } finally {
      setIsThinking(false);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setAiResponse(null);
      return;
    }

    const q = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Labs Catalog (50+ Labs)
    LAB_CATALOG.forEach(lab => {
      if (lab.name.toLowerCase().includes(q) || lab.category.toLowerCase().includes(q)) {
        searchResults.push({
          id: lab.id,
          title: lab.name,
          type: 'lab',
          category: lab.category.toUpperCase(),
          description: `Virtual ${lab.type.toUpperCase()} Lab Component`,
          action: () => {
            onNavigate('subjects', { subject: lab.category });
            onClose();
          }
        });
      }
    });

    // Modules
    Object.entries(MODULES).forEach(([subjectId, modules]) => {
      modules.forEach(m => {
        const fullText = `${m.title} ${m.content?.title || ''} ${m.content?.ai_notes?.definition || ''} ${m.content?.ai_notes?.technical_breakdown?.join(' ') || ''}`.toLowerCase();
        if (fullText.includes(q)) {
          searchResults.push({
            id: `mod-${m.id}-${subjectId}`,
            title: m.title,
            type: 'module',
            category: subjectId.toUpperCase(),
            description: m.content?.ai_notes?.definition || 'Course Module',
            action: () => {
              onNavigate('subjects', { subject: subjectId, module: m.id });
              onClose();
            }
          });
        }
      });
    });

    // Videos
    resourcesData.forEach(v => {
      if (v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)) {
        searchResults.push({
          id: v.id,
          title: v.title,
          type: 'video',
          category: 'STUDY HUB',
          description: v.description,
          action: () => {
            onNavigate('resources');
            onClose();
          }
        });
      }
    });

    // External Resources
    RESOURCES.forEach(r => {
      if (r.name.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q)) {
        searchResults.push({
          id: r.name,
          title: r.name,
          type: 'resource',
          category: 'EXTERNAL',
          description: r.desc,
          action: () => {
            window.open(r.url, '_blank');
            onClose();
          }
        });
      }
    });

    setResults(searchResults.slice(0, 10));
  }, [query, onNavigate, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-[#0d1117]/80 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-full max-w-2xl bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
      >
        <div className="p-4 border-b border-[#30363d] flex items-center gap-3">
          <Search className="text-[#484f58]" size={20} />
          <input 
            ref={inputRef}
            placeholder="Search 50+ labs, specialists, and resources..." 
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setAiResponse(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && results.length === 0) handleAIInquiry();
            }}
            className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder-[#484f58]"
          />
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-[#0d1117] text-[#484f58] px-1.5 py-0.5 rounded border border-[#30363d] font-mono">ESC</span>
            <button onClick={onClose} className="p-1 hover:bg-[#30363d] rounded-md transition-colors text-[#8b949e]">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {query.trim() === '' ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-12 h-12 bg-[#0d1117] rounded-xl flex items-center justify-center mx-auto border border-[#30363d]">
                <Command className="text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-white font-bold">Comprehensive Engineering Search</p>
                <p className="text-[#8b949e] text-sm">Access 55+ Virtual Labs and Unlimited AI Experts.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-4">
                {['Bridge Stress', 'Ohm\'s Law', 'Logic Gates', 'Physics', 'Aero Dynamics'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => {
                      setQuery(tag);
                      playSound('click');
                    }}
                    className="px-3 py-1 bg-[#0d1117] border border-[#30363d] rounded-full text-[10px] text-[#8b949e] uppercase font-bold tracking-widest hover:border-blue-500/50 hover:text-white transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : (results.length > 0 || aiResponse || isThinking) ? (
            <div className="p-2 space-y-1">
              {results.map((res, i) => (
                <button
                  key={res.id}
                  onClick={() => {
                    playSound('transition');
                    res.action();
                  }}
                  className="w-full text-left p-3 hover:bg-[#1f2937] rounded-xl transition-all group flex items-center gap-4"
                >
                  <div className={`p-3 rounded-xl border transition-all ${
                    res.type === 'module' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                    res.type === 'lab' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                    res.type === 'video' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    'bg-purple-500/10 border-purple-500/20 text-purple-400'
                  }`}>
                    {res.type === 'module' ? <Book size={18} /> :
                     res.type === 'lab' ? <Cpu size={18} /> :
                     res.type === 'video' ? <Play size={18} /> :
                     <Globe size={18} />}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-[#484f58] uppercase tracking-widest">{res.category}</span>
                      <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 uppercase tracking-tighter">{res.type}</span>
                    </div>
                    <h4 className="text-white font-bold text-sm truncate">{res.title}</h4>
                    <p className="text-[#8b949e] text-xs truncate">{res.description}</p>
                  </div>
                  <ArrowRight size={16} className="text-[#484f58] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              ))}

              {(results.length === 0 || aiResponse || isThinking) && (
                <div className="p-4 mt-2 border-t border-[#30363d]/50">
                  <div className="flex items-center gap-2 text-blue-400 mb-3 px-2">
                    <Sparkles size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Global AI Inquiry Engine</span>
                  </div>
                  
                  {isThinking ? (
                    <div className="p-8 text-center bg-[#0d1117] rounded-2xl border border-[#30363d] space-y-3">
                      <RefreshCcw size={24} className="text-blue-500 animate-spin mx-auto" />
                      <p className="text-[10px] text-blue-400 font-bold uppercase animate-pulse">Analyzing specialized datasets...</p>
                    </div>
                  ) : aiResponse ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-[#0d1117] rounded-2xl border border-blue-500/20 text-[#c9d1d9] prose prose-invert prose-sm max-w-none prose-p:leading-relaxed"
                    >
                      <Markdown>{aiResponse}</Markdown>
                    </motion.div>
                  ) : (
                    <button 
                      onClick={handleAIInquiry}
                      className="w-full p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-blue-400 font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Brain size={16} /> Seek Insights from Specialists
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-[#8b949e]">
              <p>No local results found for "{query}"</p>
              <button 
                onClick={handleAIInquiry}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest"
              >
                Ask Specialized AI
              </button>
            </div>
          )}
        </div>

        <div className="p-3 bg-[#0d1117] border-t border-[#30363d] flex items-center justify-between">
          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-[10px] text-[#484f58] font-bold uppercase tracking-wider">
              <span className="px-1 py-0.5 bg-[#161b22] border border-[#30363d] rounded text-[8px] mr-1">↵</span> Select
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#484f58] font-bold uppercase tracking-wider">
              <span className="px-1 py-0.5 bg-[#161b22] border border-[#30363d] rounded text-[8px] mr-1">↑↓</span> Navigate
            </div>
          </div>
          <p className="text-[9px] text-blue-500/40 font-mono italic">Specialist Ensemble Active</p>
        </div>
      </motion.div>
    </div>
  );
}
