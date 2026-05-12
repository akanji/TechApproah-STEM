import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Zap, Activity, Cpu, FileText, Code, ChevronRight, 
  Terminal, Search, Play, AlertCircle, Sparkles, 
  Settings, Layers, TrendingUp, Microscope, Clock,
  CheckCircle2, XCircle
} from "lucide-react";

type ComplexNumber = { real: number; imag: number };

function SPlanePlotter({ poles, zeros }: { poles: ComplexNumber[], zeros: ComplexNumber[] }) {
  const isStable = useMemo(() => poles.every(p => p.real < 0), [poles]);
  const size = 300;
  const padding = 40;
  const center = size / 2;
  const scale = (size - padding * 2) / 10; // 10 units range

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h5 className="text-[10px] font-bold text-white uppercase tracking-widest">S-Domain Stability Plot</h5>
          <p className="text-[9px] text-[#484f58] uppercase font-bold">Predicting system response based on ROC</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full font-mono text-[9px] font-bold ${
          isStable ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
        }`}>
          {isStable ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
          {isStable ? "SYSTEM STABLE" : "SYSTEM UNSTABLE"}
        </div>
      </div>

      <div className="relative aspect-square w-full max-w-[300px] mx-auto bg-black/20 rounded-xl border border-white/5 overflow-hidden">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
          {/* Grid Lines */}
          {[...Array(11)].map((_, i) => {
            const pos = padding + i * scale;
            return (
              <React.Fragment key={i}>
                <line x1={pos} y1={padding} x2={pos} y2={size - padding} stroke="#30363d" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1={padding} y1={pos} x2={size - padding} y2={pos} stroke="#30363d" strokeWidth="0.5" strokeDasharray="2 2" />
              </React.Fragment>
            );
          })}

          {/* Axes */}
          <line x1={padding} y1={center} x2={size - padding} y2={center} stroke="#8b949e" strokeWidth="1.5" />
          <line x1={center} y1={padding} x2={center} y2={size - padding} stroke="#8b949e" strokeWidth="1.5" />
          
          {/* Axis Labels */}
          <text x={size - padding + 5} y={center + 4} fill="#484f58" fontSize="10" className="font-mono font-bold">σ</text>
          <text x={center - 15} y={padding - 5} fill="#484f58" fontSize="10" className="font-mono font-bold">jω</text>

          {/* Zeros (O) */}
          {zeros.map((z, i) => (
            <circle 
              key={`z-${i}`}
              cx={center + z.real * scale}
              cy={center - z.imag * scale}
              r="4"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="2"
            />
          ))}

          {/* Poles (X) */}
          {poles.map((p, i) => {
            const x = center + p.real * scale;
            const y = center - p.imag * scale;
            const s = 4;
            return (
              <g key={`p-${i}`}>
                <line x1={x - s} y1={y - s} x2={x + s} y2={y + s} stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
                <line x1={x + s} y1={y - s} x2={x - s} y2={y + s} stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            );
          })}
        </svg>

        {/* Stable Region Overlay */}
        <div className="absolute inset-y-0 left-0 right-1/2 bg-emerald-500/5 pointer-events-none border-r border-emerald-500/10" />
      </div>

      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
        <p className="text-[10px] text-[#8b949e] leading-relaxed italic">
          {isStable 
            ? "All poles are in the left-half plane. The impulse response will decay to zero as t → ∞." 
            : "One or more poles are in the right-half plane. The system exhibits exponential growth and is unstable."}
        </p>
      </div>
    </div>
  );
}

export function EECircuitLab() {
  const [activeTab, setActiveTab] = useState<"s-domain" | "opamp" | "signal">("s-domain");
  const [isSolving, setIsSolving] = useState(false);
  const [circuitType, setCircuitType] = useState<"RC" | "RLC" | "Active Filter">("RC");

  const [poles, setPoles] = useState<ComplexNumber[]>([
    { real: -2, imag: 2 },
    { real: -2, imag: -2 }
  ]);
  const [zeros] = useState<ComplexNumber[]>([
    { real: -5, imag: 0 }
  ]);

  const sDomainMapping = [
    { component: "Resistor (R)", domain: "Time Domain", math: "v(t) = R * i(t)", sMath: "V(s) = R * I(s)", color: "bg-blue-500" },
    { component: "Inductor (L)", domain: "Frequency Domain", math: "v(t) = L * di/dt", sMath: "V(s) = sL * I(s)", color: "bg-emerald-500" },
    { component: "Capacitor (C)", domain: "s-Plane", math: "i(t) = C * dv/dt", sMath: "V(s) = (1/sC) * I(s)", color: "bg-purple-500" }
  ];

  const opAmpRules = [
    { rule: "Rule 1: Virtual Short", description: "V+ = V- under negative feedback. The inputs track each other perfectly.", active: true },
    { rule: "Rule 2: Zero Current", description: "No current flows INTO the input terminals (Input impedance is infinite).", active: true },
    { rule: "Rule 3: Output Swing", description: "The output can change as much as needed to satisfy Rules 1 and 2.", active: false }
  ];

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Zap size={14} /> S-Domain Solver Agent
          </h3>
          <p className="text-[10px] text-[#484f58] mt-1 font-mono uppercase tracking-widest font-bold">Electric Pal Core • Nodal Analyzer v2.4</p>
        </div>
        <div className="flex bg-[#161b22] border border-[#30363d] rounded-xl p-1">
          {(['s-domain', 'opamp', 'signal'] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-[9px] font-bold uppercase rounded-lg transition-all ${
                activeTab === tab ? "bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/5" : "text-[#484f58] hover:text-[#8b949e]"
              }`}
            >
              {tab === 's-domain' ? 'Laplace' : tab === 'opamp' ? 'Op-Amp Engine' : 'Signal Processing'}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "s-domain" && (
          <motion.div 
            key="s-domain"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Laplace Transformation Visualizer */}
            <div className="bg-[#0b0e14] border border-[#30363d] rounded-[32px] p-8 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Settings size={120} className="animate-[spin_20s_linear_infinite]" />
              </div>
              
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="space-y-1">
                  <h4 className="text-white font-bold text-sm tracking-tight uppercase">S-Domain Mapping Table</h4>
                  <p className="text-[9px] font-bold text-[#484f58] uppercase tracking-widest">Converting Differential Equations to Algebra</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-mono text-[9px] font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  REAL-TIME SOLVER
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {sDomainMapping.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -5 }}
                    className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 hover:border-emerald-500/30 transition-all"
                  >
                    <div className={`w-8 h-8 rounded-lg ${item.color}/10 flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/10`}>
                      {idx === 0 ? <Layers size={18} /> : idx === 1 ? <TrendingUp size={18} /> : <Zap size={18} />}
                    </div>
                    <h5 className="text-[10px] font-bold text-white uppercase tracking-widest mb-2">{item.component}</h5>
                    <div className="space-y-3">
                      <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                        <div className="text-[8px] text-[#484f58] uppercase font-bold mb-1">Time Domain</div>
                        <div className="text-[11px] font-mono text-[#8b949e]">{item.math}</div>
                      </div>
                      <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                        <div className="text-[8px] text-emerald-400/80 uppercase font-bold mb-1">S-Domain</div>
                        <div className="text-[11px] font-mono text-emerald-400 font-bold">{item.sMath}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                        <Terminal size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-white uppercase tracking-widest">Nodal Equation Generator</p>
                        <p className="text-[9px] text-[#484f58] uppercase font-bold">Generated from uploaded schematic</p>
                      </div>
                    </div>
                    <div className="p-5 bg-black/40 rounded-2xl border border-white/5 font-mono text-[11px] leading-relaxed text-[#c9d1d9]">
                      <span className="text-emerald-400">Summing(Node A):</span> (V_A - V_in)/R1 + V_A*(sC1) + (V_A - V_out)/(1/sC2) = 0
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <button 
                      onClick={() => {
                        setIsSolving(true);
                        // Randomize poles for demo
                        setTimeout(() => {
                          setIsSolving(false);
                          setPoles([
                            { real: Math.random() > 0.3 ? -2 : 1, imag: 2 },
                            { real: Math.random() > 0.3 ? -2 : 1, imag: -2 }
                          ]);
                        }, 2000);
                      }}
                      className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10 relative overflow-hidden"
                    >
                      {isSolving ? "Analyzing Poles & Zeros..." : "Solve Algebraic Loop"}
                      {isSolving && <motion.div layoutId="solving" className="absolute inset-0 bg-white/20 animate-[pulse_1s_infinite]" />}
                    </button>
                    <p className="text-[10px] text-[#8b949e] italic leading-relaxed text-center px-4">
                      <Sparkles size={10} className="inline mr-1 text-emerald-400" />
                      Powered by Electric Pal Vision: Analyzing component footprints... 100% matched.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <SPlanePlotter poles={poles} zeros={zeros} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "opamp" && (
          <motion.div 
            key="opamp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Op-Amp Rules & Theory */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-[32px] p-8 space-y-8 h-full">
              <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Play size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest">Op-Amp Golden Rules</h4>
                  <p className="text-[10px] text-blue-400 font-mono font-bold uppercase">Ideal Approximation Logic</p>
                </div>
              </div>

              <div className="space-y-4">
                {opAmpRules.map((rule, i) => (
                  <div key={i} className={`p-5 rounded-2xl border transition-all ${rule.active ? "bg-blue-500/5 border-blue-500/20" : "bg-black/20 border-white/5 opacity-60"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${rule.active ? "text-blue-400" : "text-[#484f58]"}`}>{rule.rule}</span>
                      {rule.active && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
                    </div>
                    <p className="text-[11px] text-[#8b949e] leading-relaxed">{rule.description}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/10 rounded-2xl">
                  <h5 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Microscope size={12} /> Calculus Engine
                  </h5>
                  <p className="text-[11px] text-indigo-100/60 leading-relaxed italic">
                    By replacing feedback Resistors with Capacitors, we create an <span className="font-bold text-indigo-300 uppercase">Integrator</span>. The output becomes the rolling average of the input signal.
                  </p>
                </div>
              </div>
            </div>

            {/* Configurator & Simulation */}
            <div className="space-y-6">
              <div className="bg-[#0b0e14] border border-emerald-500/20 rounded-[32px] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group h-[340px]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)]" />
                <motion.div animate={{ rotate: [0, 90, 180, 270, 360] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="w-48 h-48 border border-emerald-500/10 rounded-full flex items-center justify-center absolute opacity-20">
                  <div className="w-40 h-40 border-2 border-dashed border-emerald-500/10 rounded-full" />
                </motion.div>
                
                <div className="relative z-10">
                  <div className="mb-6 mx-auto w-24 h-24 rounded-3xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                    <Activity size={48} className="text-emerald-400" />
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2 uppercase tracking-tight">Active Filter Sim</h4>
                  <p className="text-[10px] text-[#8b949e] uppercase font-bold tracking-widest mb-6">2nd Order Sallen-Key Low Pass</p>
                  <div className="flex gap-4">
                    <div className="px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      <p className="text-[9px] text-emerald-400 uppercase font-bold mb-1">Cutoff Frequency</p>
                      <p className="text-xl font-mono text-white font-bold">15.4<span className="text-xs ml-1">kHz</span></p>
                    </div>
                    <div className="px-4 py-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                      <p className="text-[9px] text-blue-400 uppercase font-bold mb-1">Gain (k)</p>
                      <p className="text-xl font-mono text-white font-bold">1.58<span className="text-xs ml-1">V/V</span></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#161b22] border border-[#30363d] rounded-[32px] p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h5 className="text-[10px] font-bold text-white uppercase tracking-widest">LTSpice Verification</h5>
                    <p className="text-[9px] font-bold text-[#484f58] uppercase mt-1 tracking-widest">Professional Integrity Check</p>
                  </div>
                  <button className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-all border border-emerald-500/20">
                    <FileText size={16} />
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      <span className="text-[10px] text-white font-mono uppercase font-bold tracking-widest">Netlist Generated</span>
                    </div>
                    <span className="text-[9px] text-[#484f58] font-bold uppercase">Ready to Export</span>
                  </div>
                  <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest border border-white/10 transition-all">
                    Download .asc Simulation File
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "signal" && (
          <motion.div 
            key="signal"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="space-y-6"
          >
            {/* NoteGPT Summary Section */}
            <div className="bg-[#0b0e14] border border-[#30363d] rounded-[32px] p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-xl shadow-indigo-500/5">
                    <FileText size={32} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white uppercase tracking-tight">NoteGPT Multimodal Summary</h4>
                    <p className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-[0.2em] mt-1">Condensed: Op-Amp Signal Conditioning Masterclass</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden md:block">
                    <p className="text-[9px] text-[#484f58] font-bold uppercase">Processing Time</p>
                    <p className="text-sm font-mono text-white font-bold tracking-tighter">4.2s</p>
                  </div>
                  <button className="px-6 py-3 bg-indigo-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/10">
                    Refresh Notes
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                       <Clock size={12} className="text-indigo-400" /> Executive Highlights
                    </h5>
                    {[
                      { title: "Gain Bandwidth Product (GBW)", text: "Ideal Op-Amps have infinite bandwidth, but real ones trade gain for speed. NoteGPT identified a 1MHz limit in typical hobbyist LM358s." },
                      { title: "Slew Rate Saturation", text: "NoteGPT flagged the 05:12 mark in the lecture: When the signal is too fast, the output turns into a ramp due to internal currents." },
                      { title: "Phase Margin Stability", text: "Analysis of the tutorial's stability section: Multi-stage filters risk oscillation if negative feedback becomes positive at high frequencies." }
                    ].map((h, i) => (
                      <div key={i} className="p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group">
                         <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">{h.title}</div>
                         <p className="text-[12px] text-[#8b949e] leading-relaxed group-hover:text-white transition-colors">{h.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-gradient-to-br from-indigo-500/10 to-transparent p-6 rounded-[28px] border border-indigo-500/10 h-full flex flex-col justify-between">
                     <div>
                       <h5 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">Mindgrasp AI Map</h5>
                       <p className="text-[11px] text-[#8b949e] leading-relaxed mb-6 italic">Visual concept map linking Laplace transforms to Filter design is currently being synthesized for your notebook.</p>
                       <div className="space-y-3">
                         <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                         </div>
                         <div className="flex justify-between text-[8px] font-bold text-[#484f58] uppercase">
                           <span>Synthesizing Components</span>
                           <span>85%</span>
                         </div>
                       </div>
                     </div>
                     <button className="mt-8 text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2 py-3 border border-indigo-500/20 rounded-xl hover:bg-indigo-500/10 transition-all">
                       Open Full Report <ChevronRight size={14} />
                     </button>
                   </div>
                </div>
              </div>
            </div>
            
            {/* VisCircuit Documentation Link */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-[32px] p-8 flex items-center justify-between group cursor-pointer hover:border-indigo-500/30 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[#484f58] group-hover:text-indigo-400 transition-colors border border-white/5">
                  <Code size={32} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-tight mb-1">VisCircuit Documentation Agent</h4>
                  <p className="text-[11px] text-[#8b949e] uppercase font-bold tracking-widest">Auto-generate Notion-style architecture docs</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#484f58] group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-all">
                <Sparkles size={20} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decision Matrix */}
      <div className="bg-[#161b22]/50 border border-[#30363d] rounded-[32px] p-8 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
          <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">S-Domain Solver Decision Matrix</h4>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-1 py-1 px-4 border-l border-white/5">
            <p className="text-[9px] uppercase font-bold text-[#484f58]">Solver Logic</p>
            <p className="text-emerald-400 font-bold text-[11px] uppercase tracking-wider">Electric Pal v2</p>
          </div>
          <div className="space-y-1 py-1 px-4 border-l border-white/5">
            <p className="text-[9px] uppercase font-bold text-[#484f58]">Summary Engine</p>
            <p className="text-indigo-400 font-bold text-[11px] uppercase tracking-wider">NoteGPT Sync</p>
          </div>
          <div className="space-y-1 py-1 px-4 border-l border-white/5">
            <p className="text-[9px] uppercase font-bold text-[#484f58]">Stability Check</p>
            <p className="text-blue-400 font-bold text-[11px] uppercase tracking-wider">Pole-Zero Plot</p>
          </div>
          <div className="space-y-1 py-1 px-4 border-l border-white/5">
            <p className="text-[9px] uppercase font-bold text-[#484f58]">Lab Status</p>
            <p className="text-white font-bold text-[11px] uppercase tracking-wider font-mono">ENERGIZED</p>
          </div>
        </div>
      </div>
    </div>
  );
}
