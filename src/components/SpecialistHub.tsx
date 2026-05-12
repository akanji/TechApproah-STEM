import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  Building2
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
  "Structural & Geotechnical AI": Building2
};

export function SpecialistHub() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  return (
    <div className="space-y-8 pb-32">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Zap className="text-emerald-400 fill-emerald-400/20" size={24} /> Expert AI Hub
        </h2>
        <p className="text-[#8b949e] text-sm max-w-md">
          Advanced professional-tier AI tools to complement your Virtual Lab experiments.
        </p>
      </header>

      <div className="space-y-10">
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

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setSelectedTool(null)}
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
