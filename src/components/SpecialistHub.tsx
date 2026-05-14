import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import { ai, MODELS } from "../lib/gemini";
import { 
  ShieldCheck, 
  ExternalLink, 
  Cpu, 
  Wind, 
  Database, 
  Info, 
  ChevronRight,
  ArrowUpRight,
  Zap,
  Globe,
  Dna,
  Building2,
  RefreshCcw,
  Sparkles,
  Video,
  X,
  Atom,
  FlaskConical,
  Activity,
  History,
  MessageSquareQuote,
  Brain
} from "lucide-react";
import toolsData from "../specialist_tools.json";

interface Tool {
  name: string;
  description: string;
  capability: string;
  use_case: string;
  url: string;
  secure: boolean;
  internal_lab_bridge: string;
}

const CATEGORY_ICONS: Record<string, any> = {
  "Data Titan (Enterprise)": Database,
  "Physics & Bridge Master": Wind,
  "Circuit & Productivity": Cpu,
  "Bio-Engineering & CRISPR": Dna,
  "Structural & Geotechnical AI": Building2,
  "Chemical Kinetics AI": FlaskConical,
  "Aerospace Dynamics": Atom,
  "Biomedical Diagnostics": Activity
};

import { VeoPrompter } from "./VeoPrompter";

export function SpecialistHub() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showVeoPrompter, setShowVeoPrompter] = useState(false);
  const [toolSummary, setToolSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showDeepThought, setShowDeepThought] = useState(false);
  const [deepThoughtQuery, setDeepThoughtQuery] = useState("");
  const [deepThoughtResult, setDeepThoughtResult] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const handleDeepThought = async () => {
    if (!deepThoughtQuery.trim()) return;
    setIsThinking(true);
    setDeepThoughtResult(null);
    try {
      const response = await ai.models.generateContent({
        model: MODELS.flash,
        contents: [{
          role: "user",
          parts: [{ text: `Act as a Specialist AI Expert. Solve/Explain this complex engineering challenge with unlimited thinking capacity: ${deepThoughtQuery}` }]
        }],
        config: {
          systemInstruction: "You are an elite ensemble of engineering specialists. Provide deep, multi-disciplinary insights.",
        }
      });
      setDeepThoughtResult(response.text || "Calculation complete.");
    } catch (e) {
      console.error("Deep thought error:", e);
    } finally {
      setIsThinking(false);
    }
  };

  const handleGenerateSummary = async (tool: Tool) => {
    setIsSummarizing(true);
    setToolSummary(null);
    try {
      const response = await ai.models.generateContent({
        model: MODELS.flash,
        contents: [{
          role: "user",
          parts: [{ text: `Provide a professional justification for using "${tool.name}" in a modern engineering lab. 
          Focus on its unique capability: ${tool.capability} and technical use case: ${tool.use_case}.` }]
        }],
        config: {
          systemInstruction: "You are a senior technical advisor. Summarize the value proposition of specialized AI tools.",
        }
      });
      setToolSummary(response.text || "No summary available.");
    } catch (e) {
      console.error("Summary error:", e);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="space-y-8 pb-32">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Zap className="text-emerald-400 fill-emerald-400/20" size={24} /> Expert AI Hub
            </h2>
            <p className="text-[#8b949e] text-sm max-w-md">
              Unlimited access to 50+ professional-tier specialist modules.
            </p>
          </div>
          <button 
            onClick={() => setShowDeepThought(true)}
            className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-900/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Brain size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block">Deep Thinking</span>
          </button>
        </div>

        {/* Dynamic Thinking Search */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Sparkles className="text-blue-400 opacity-50" size={16} />
          </div>
          <input 
            placeholder="Ask a specialist ANY engineering problem..."
            className="w-full bg-[#161b22] border border-[#30363d] rounded-2xl py-4 pl-12 pr-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-[#484f58]"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setDeepThoughtQuery(e.currentTarget.value);
                setShowDeepThought(true);
                handleDeepThought();
              }
            }}
          />
        </div>
      </header>

      <div className="space-y-10">
        {/* Deep Thought Modal Overlay */}
        <AnimatePresence>
          {showDeepThought && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#0d1117]/95 backdrop-blur-xl">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-2xl bg-[#161b22] border border-[#30363d] rounded-[32px] overflow-hidden flex flex-col max-h-[80vh]"
              >
                <div className="p-6 border-b border-[#30363d] flex justify-between items-center bg-[#0d1117]/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Brain size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-tight">Unlimited Specialist Thinking</h3>
                      <p className="text-[10px] text-blue-400 uppercase font-bold tracking-widest">Multi-Disciplinary Synthesis Active</p>
                    </div>
                  </div>
                  <button onClick={() => setShowDeepThought(false)} className="p-2 hover:bg-white/5 rounded-xl text-[#484f58] transition-colors"><X size={20}/></button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  {!deepThoughtResult && (
                    <div className="space-y-4">
                      <textarea 
                        value={deepThoughtQuery}
                        onChange={(e) => setDeepThoughtQuery(e.target.value)}
                        placeholder="Define your complex project parameters, material constraints, or mathematical derivations..."
                        className="w-full h-40 bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 text-sm text-white resize-none outline-none focus:border-blue-500/30"
                      />
                      <button 
                        onClick={handleDeepThought}
                        disabled={isThinking}
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                      >
                        {isThinking ? <RefreshCcw size={16} className="animate-spin" /> : <Zap size={16} />}
                        {isThinking ? "Consulting Ensemble..." : "Initiate Unlimited Thinking"}
                      </button>
                    </div>
                  )}

                  {deepThoughtResult && (
                    <div className="space-y-6">
                      <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 prose prose-invert prose-sm max-w-none prose-p:leading-relaxed">
                        <div className="flex items-center gap-2 mb-4 text-blue-400">
                          <MessageSquareQuote size={18} />
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Specialist Consensus Report</span>
                        </div>
                        <Markdown>{deepThoughtResult}</Markdown>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => setDeepThoughtResult(null)}
                          className="py-3 bg-[#0d1117] border border-[#30363d] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest"
                        >
                          Refine Query
                        </button>
                        <button 
                          onClick={() => {
                            const blob = new Blob([deepThoughtResult], { type: 'text/markdown' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = "specialist_engine_report.md";
                            a.click();
                          }}
                          className="py-3 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest"
                        >
                          Export Report
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Veo Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1 text-indigo-400">
            <Video size={14} />
            <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Next-Gen Media Synthesis</h3>
          </div>
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-r from-indigo-600/10 to-blue-600/10 border border-indigo-500/30 rounded-[2.5rem] p-8 relative overflow-hidden group cursor-pointer"
            onClick={() => setShowVeoPrompter(true)}
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Video size={120} className="text-white" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 mb-1">
                  <Sparkles size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Veo Prompt Lab</span>
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Google Veo Synthesis Engine</h3>
                <p className="text-[#8b949e] text-xs max-w-md leading-relaxed capitalize">
                  Craft high-fidelity technical prompts for cinematic scientific visualizations.
                </p>
              </div>
              <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/20">
                Launch Assistant
              </button>
            </div>
          </motion.div>
        </section>

        {Object.entries(toolsData).map(([category, tools]) => {
          const Icon = CATEGORY_ICONS[category] || Globe;
          return (
            <section key={category} className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <div className="p-1.5 rounded-lg bg-[#161b22] border border-[#30363d] text-blue-400">
                  <Icon size={14} />
                </div>
                <h3 className="text-xs font-bold text-[#f0f6fc] uppercase tracking-[0.2em]">{category}</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {(tools as Tool[]).map((tool) => (
                  <motion.div
                    key={tool.name}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedTool(tool)}
                    className="p-5 bg-[#161b22] border border-[#30363d] rounded-2xl cursor-pointer hover:border-blue-500/30 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <h4 className="text-white font-bold text-sm tracking-tight">{tool.name}</h4>
                          {tool.secure && (
                            <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase tracking-tighter">
                              <ShieldCheck size={8} /> Secure Data
                            </span>
                          )}
                        </div>
                        <p className="text-[#8b949e] text-xs leading-relaxed max-w-sm">{tool.description}</p>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-[10px] text-[#484f58] font-mono uppercase bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d]">
                             {tool.capability}
                          </div>
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-[#0d1117] border border-[#30363d] text-[#484f58] group-hover:text-blue-400 group-hover:border-blue-500/20 transition-all">
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <AnimatePresence>
        {showVeoPrompter && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0d1117]/95 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl relative"
            >
              <button 
                onClick={() => setShowVeoPrompter(false)}
                className="absolute -top-12 right-0 p-3 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all z-10"
              >
                <X size={20} />
              </button>
              <VeoPrompter />
            </motion.div>
          </div>
        )}

        {selectedTool && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-[#0d1117]/80 backdrop-blur-sm">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-lg bg-[#161b22] border border-[#30363d] rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold text-white">{selectedTool.name}</h3>
                      {selectedTool.secure && (
                        <ShieldCheck className="text-emerald-400" size={20} />
                      )}
                    </div>
                    <p className="text-[#8b949e] text-sm leading-relaxed">
                      {selectedTool.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <AnimatePresence>
                    {toolSummary && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-5 bg-blue-600/5 border border-blue-500/20 rounded-2xl"
                      >
                        <h5 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Zap size={12} fill="currentColor" /> Strategic Justification
                        </h5>
                        <div className="text-xs text-[#c9d1d9] leading-relaxed font-mono">
                          <Markdown>{toolSummary}</Markdown>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="p-5 bg-[#0d1117] border border-[#30363d] rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 text-blue-500/20 group-hover:text-blue-500/40 transition-colors">
                      <Zap size={40} fill="currentColor" />
                    </div>
                    <h5 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Internal Lab Bridge</h5>
                    <p className="text-xs text-white leading-relaxed relative z-10">{selectedTool.internal_lab_bridge}</p>
                  </div>

                  <div className="p-5 bg-[#0d1117] border border-[#30363d] rounded-2xl">
                    <h5 className="text-[10px] font-bold text-[#484f58] uppercase tracking-widest mb-3">Professional Metadata</h5>
                    <div className="space-y-3">
                      <div>
                        <span className="text-[9px] font-bold text-[#8b949e] uppercase">Primary Use Case:</span>
                        <p className="text-[11px] text-[#8b949e] mt-0.5">{selectedTool.use_case}</p>
                      </div>
                      <div className="pt-3 border-t border-[#30363d]">
                         <span className="text-[9px] font-bold text-[#8b949e] uppercase">AI Framework:</span>
                         <p className="text-[11px] text-[#8b949e] mt-0.5">{selectedTool.capability}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  {!toolSummary && (
                    <button 
                      onClick={() => handleGenerateSummary(selectedTool)}
                      disabled={isSummarizing}
                      className="w-full py-4 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-2xl hover:bg-emerald-600/20 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                    >
                      {isSummarizing ? <RefreshCcw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                      {isSummarizing ? "Synthesizing Value Prop..." : "Generate AI Strategic Case"}
                    </button>
                  )}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        setSelectedTool(null);
                        setToolSummary(null);
                      }}
                      className="flex-1 py-4 bg-[#21262d] text-white font-bold rounded-2xl hover:bg-[#30363d] transition-all uppercase tracking-widest text-[10px]"
                    >
                      Keep Exploring
                    </button>
                    <a 
                      href={selectedTool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                    >
                      Open Platform <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                {selectedTool.name.includes("Titan") && (
                  <p className="text-[9px] text-[#484f58] text-center font-mono uppercase">
                    Requires Enterprise SSO • Governance Disclaimer Active
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
