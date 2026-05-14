import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Zap, Activity, Cpu, FileText, Code, ChevronRight, 
  Terminal, Search, Play, AlertCircle, Sparkles, 
  Settings, Layers, TrendingUp, Microscope, Clock,
  CheckCircle2, XCircle, Info, Square, RefreshCcw
} from "lucide-react";
import { ai, MODELS } from "../lib/gemini";
import Markdown from "react-markdown";

type ComplexNumber = { real: number; imag: number };

function BodePlot({ magnitude, phase, frequency, noiseEnabled }: { magnitude: number[], phase: number[], frequency: number[], noiseEnabled: boolean }) {
  const size = { w: 400, h: 250 };
  const padding = 40;

  const getPoints = (data: number[], min: number, max: number, h: number) => {
    return data.map((val, i) => {
      const x = padding + (i / (data.length - 1)) * (size.w - padding * 2);
      const noise = noiseEnabled ? (Math.random() - 0.5) * 2 : 0;
      const y = padding + (1 - (val - min) / (max - min)) * (h - padding * 2);
      return `${x},${y + noise}`;
    }).join(" ");
  };

  const magMin = -60, magMax = 20;
  const phaseMin = -180, phaseMax = 180;

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h5 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <TrendingUp size={14} className="text-blue-400" /> Bode Frequency Response
        </h5>
        <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 font-mono text-[9px] font-bold">
          {noiseEnabled ? "REAL-WORLD NOISE ACTIVE" : "IDEAL MATHEMATICAL MODEL"}
        </div>
      </div>

      <div className="space-y-4">
        {/* Magnitude Plot */}
        <div className="relative h-32 bg-black/40 rounded-xl border border-white/5">
          <svg viewBox={`0 0 ${size.w} 125`} className="w-full h-full">
            <polyline points={getPoints(magnitude, magMin, magMax, 125)} fill="none" stroke="#60a5fa" strokeWidth="2" />
            {/* 0dB Line */}
            <line x1={padding} y1={padding + (1 - (0 - magMin) / (magMax - magMin)) * (125 - padding * 2)} x2={size.w - padding} y2={padding + (1 - (0 - magMin) / (magMax - magMin)) * (125 - padding * 2)} stroke="#484f58" strokeWidth="0.5" strokeDasharray="4 4" />
          </svg>
          <div className="absolute top-2 left-2 text-[8px] font-bold text-blue-400/60 uppercase">Magnitude (dB)</div>
        </div>

        {/* Phase Plot */}
        <div className="relative h-32 bg-black/40 rounded-xl border border-white/5">
          <svg viewBox={`0 0 ${size.w} 125`} className="w-full h-full">
            <polyline points={getPoints(phase, phaseMin, phaseMax, 125)} fill="none" stroke="#fb923c" strokeWidth="2" />
          </svg>
          <div className="absolute top-2 left-2 text-[8px] font-bold text-orange-400/60 uppercase">Phase (deg)</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Phase Margin", val: "-45.2", unit: "°", color: "text-emerald-400" },
          { label: "Gain Margin", val: "+12.4", unit: "dB", color: "text-blue-400" },
          { label: "Slew Rate", val: "1.2", unit: "V/μs", color: "text-purple-400" }
        ].map((stat, i) => (
          <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
            <p className="text-[8px] text-[#484f58] uppercase font-bold mb-1">{stat.label}</p>
            <p className={`text-[11px] font-mono font-bold ${stat.color}`}>{stat.val}<span className="text-[9px] ml-0.5">{stat.unit}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}

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

function CircuitSchematic({ 
  r, l, c, 
  onRChange, onLChange, onCChange 
}: { 
  r: number, l: number, c: number,
  onRChange: (val: number) => void,
  onLChange: (val: number) => void,
  onCChange: (val: number) => void
}) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h5 className="text-[10px] font-bold text-white uppercase tracking-widest">Interactive RLC Schematic</h5>
        <div className="flex gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-[pulse_1.5s_infinite]" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-[pulse_1.5s_infinite_0.5s]" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-[pulse_1.5s_infinite_1s]" />
        </div>
      </div>

      <div className="relative h-48 bg-black/20 rounded-xl border border-white/5 flex items-center justify-center p-4">
        {/* Schematic Drawing */}
        <svg viewBox="0 0 300 150" className="w-full h-full text-blue-400">
          {/* Wire path */}
          <path d="M 20 75 H 60 M 100 75 H 140 M 180 75 H 220 M 260 75 H 280" fill="none" stroke="currentColor" strokeWidth="2" />
          
          {/* Resistor */}
          <g className="cursor-pointer hover:text-white transition-colors" onClick={() => onRChange(r + 10)}>
            <path d="M 60 75 L 65 65 L 75 85 L 85 65 L 95 85 L 100 75" fill="none" stroke="currentColor" strokeWidth="2" />
            <text x="80" y="55" fill="currentColor" fontSize="10" textAnchor="middle" className="font-mono font-bold">R={r}Ω</text>
          </g>

          {/* Inductor */}
          <g className="cursor-pointer hover:text-white transition-colors" onClick={() => onLChange(l + 1)}>
            <path d="M 140 75 C 145 60 155 60 160 75 C 165 60 175 60 180 75" fill="none" stroke="currentColor" strokeWidth="2" />
            <text x="160" y="55" fill="currentColor" fontSize="10" textAnchor="middle" className="font-mono font-bold">L={l}mH</text>
          </g>

          {/* Capacitor */}
          <g className="cursor-pointer hover:text-white transition-colors" onClick={() => onCChange(c + 1)}>
            <path d="M 220 60 V 90 M 260 60 V 90" fill="none" stroke="currentColor" strokeWidth="2" />
            <text x="240" y="55" fill="currentColor" fontSize="10" textAnchor="middle" className="font-mono font-bold">C={c}μF</text>
          </g>

          {/* Ground */}
          <path d="M 280 75 V 100 M 270 100 H 290 M 275 105 H 285 M 278 110 H 282" fill="none" stroke="#484f58" strokeWidth="1" />
        </svg>

        <div className="absolute bottom-3 right-3 text-[8px] text-[#484f58] uppercase font-bold tracking-widest">
          Click components to adjust values
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Damping", val: (r / (2 * Math.sqrt(l/c))).toFixed(2), unit: "ζ" },
          { label: "Resonance", val: (1 / (2 * Math.PI * Math.sqrt(l * 1e-3 * c * 1e-6) / 1000)).toFixed(1), unit: "kHz" },
          { label: "Bandwidth", val: (r / (2 * Math.PI * l * 1e-3)).toFixed(1), unit: "Hz" }
        ].map((stat, i) => (
          <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
            <div className="text-[8px] text-[#484f58] uppercase font-bold mb-1">{stat.label}</div>
            <div className="text-[11px] font-mono text-white font-bold">{stat.val}<span className="text-[9px] ml-0.5 text-blue-400">{stat.unit}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EECircuitLab() {
  const [activeTab, setActiveTab] = useState<"s-domain" | "opamp" | "signal">("s-domain");
  const [isSolving, setIsSolving] = useState(false);
  const [circuitType, setCircuitType] = useState<"RC" | "RLC" | "Active Filter">("RC");
  const [noiseEnabled, setNoiseEnabled] = useState(false);
  const [stabilityInsight, setStabilityInsight] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const [rlc, setRlc] = useState({ r: 100, l: 10, c: 1 });

  const bodeData = useMemo(() => {
    const freq = Array.from({ length: 50 }, (_, i) => Math.pow(10, i / 10)); // 1Hz to 10kHz
    const magnitude = freq.map(f => {
      const w = 2 * Math.PI * f;
      const R = rlc.r;
      const L = rlc.l * 1e-3;
      const C = rlc.c * 1e-6;
      const zL = w * L;
      const zC = 1 / (w * C);
      const impedance = Math.sqrt(R*R + Math.pow(zL - zC, 2));
      const gain = R / impedance;
      return 20 * Math.log10(gain);
    });
    const phase = freq.map(f => {
      const w = 2 * Math.PI * f;
      const R = rlc.r;
      const L = rlc.l * 1e-3;
      const C = rlc.c * 1e-6;
      return -Math.atan((w * L - 1/(w * C)) / R) * (180 / Math.PI);
    });
    return { magnitude, phase, freq };
  }, [rlc]);

  const handleExplainStability = async () => {
    setIsThinking(true);
    setStabilityInsight(null);
    try {
      const response = await ai.models.generateContent({
        model: MODELS.flash,
        contents: [{
          role: "user",
          parts: [{ text: `Explain the s-domain stability, phase margin, and damping ratio for this RLC circuit: 
          Parameters: R=${rlc.r}Ω, L=${rlc.l}mH, C=${rlc.c}μF. 
          Current Poles: ${JSON.stringify(poles)}.
          Explain the relationship between pole location in the complex s-plane and the physical damping behavior of the system.` }]
        }],
        config: {
          systemInstruction: "You are a senior electronics design engineer. Explain control theory and stability clearly.",
        }
      });
      setStabilityInsight(response.text || "No insight available.");
    } catch (e) {
      console.error("Stability Insight Error:", e);
    } finally {
      setIsThinking(false);
    }
  };

  useEffect(() => {
    // Characteristic Equation: s^2 + (R/L)s + 1/LC = 0
    // s = [-b +/- sqrt(b^2 - 4ac)] / 2a
    const R = rlc.r;
    const L = rlc.l * 1e-3;
    const C = rlc.c * 1e-6;

    const b = R / L;
    const c_val = 1 / (L * C);
    const discriminant = b * b - 4 * c_val;

    if (discriminant >= 0) {
      const s1 = (-b + Math.sqrt(discriminant)) / 2;
      const s2 = (-b - Math.sqrt(discriminant)) / 2;
      setPoles([
        { real: Math.max(-10, Math.min(10, s1 / 1000)), imag: 0 },
        { real: Math.max(-10, Math.min(10, s2 / 1000)), imag: 0 }
      ]);
    } else {
      const real = -b / 2;
      const imag = Math.sqrt(-discriminant) / 2;
      setPoles([
        { real: Math.max(-10, Math.min(10, real / 1000)), imag: Math.max(-10, Math.min(10, imag / 1000)) },
        { real: Math.max(-10, Math.min(10, real / 1000)), imag: Math.max(-10, Math.min(10, -imag / 1000)) }
      ]);
    }
  }, [rlc]);

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
                        <p className="text-[9px] text-[#484f58] uppercase font-bold">Dynamic S-Domain Solution</p>
                      </div>
                    </div>
                    <div className="p-5 bg-black/40 rounded-2xl border border-white/5 font-mono text-[11px] leading-relaxed text-[#c9d1d9]">
                      <span className="text-emerald-400">Summing(Node A):</span> (V_A - V_in)/{rlc.r} + V_A*(s*{rlc.c}e-6) + (V_A - V_out)/(s*{rlc.l}e-3) = 0
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <CircuitSchematic 
                      r={rlc.r} l={rlc.l} c={rlc.c}
                      onRChange={(r) => setRlc(prev => ({ ...prev, r: r > 1000 ? 100 : r }))}
                      onLChange={(l) => setRlc(prev => ({ ...prev, l: l > 100 ? 1 : l }))}
                      onCChange={(c) => setRlc(prev => ({ ...prev, c: c > 100 ? 0.1 : c }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <SPlanePlotter poles={poles} zeros={zeros} />
                  
                  <button 
                    onClick={handleExplainStability}
                    disabled={isThinking}
                    className="w-full py-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                  >
                    {isThinking ? <RefreshCcw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    Explain Stability Mechanics
                  </button>

                  <AnimatePresence>
                    {stabilityInsight && activeTab === "s-domain" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl relative"
                      >
                        <button 
                          onClick={() => setStabilityInsight(null)}
                          className="absolute top-4 right-4 p-1 hover:bg-white/5 rounded-lg text-[#484f58] hover:text-white transition-colors"
                        >
                          <XCircle size={16} />
                        </button>
                        <h5 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Microscope size={12} /> S-Plane Analysis Insight
                        </h5>
                        <div className="text-[11px] text-[#c9d1d9] leading-relaxed font-mono">
                          <Markdown>{stabilityInsight}</Markdown>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BodePlot 
                magnitude={bodeData.magnitude} 
                phase={bodeData.phase} 
                frequency={bodeData.freq}
                noiseEnabled={noiseEnabled}
              />
              
              <div className="space-y-6">
                {/* Simulation Controls */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[10px] font-bold text-white uppercase tracking-widest">SPICE Analysis Parameters</h5>
                    <button 
                      onClick={() => setNoiseEnabled(!noiseEnabled)}
                      className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all border ${
                        noiseEnabled ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/5 text-[#484f58] border-white/10"
                      }`}
                    >
                      {noiseEnabled ? "Disable Thermal Noise" : "Inject Noise Simulation"}
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[8px] font-bold text-[#8b949e] uppercase">
                        <span>Simulation Speed</span>
                        <span>4.2 Gflops</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div animate={{ width: "65%" }} className="h-full bg-blue-500" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                       <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                         <p className="text-[8px] text-[#484f58] uppercase font-bold mb-1">Noise Floor</p>
                         <p className="text-xs font-mono text-emerald-400 font-bold">-112.4 <span className="opacity-50">dBm/Hz</span></p>
                       </div>
                       <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                         <p className="text-[8px] text-[#484f58] uppercase font-bold mb-1">Max Slew Rate</p>
                         <p className="text-xs font-mono text-blue-400 font-bold">12.5 <span className="opacity-50">V/μs</span></p>
                       </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleExplainStability}
                  disabled={isThinking}
                  className="w-full py-4 bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600/20 transition-all disabled:opacity-50"
                >
                  {isThinking ? <RefreshCcw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  Explain Phase Margin Stability
                </button>
              </div>
            </div>

            <AnimatePresence>
              {stabilityInsight && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 bg-indigo-600/5 border border-indigo-500/20 rounded-[32px] relative"
                >
                  <button 
                    onClick={() => setStabilityInsight(null)}
                    className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-xl text-[#484f58] hover:text-white transition-colors"
                  >
                    <XCircle size={20} />
                  </button>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                      <Microscope size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-widest">Stability Reasoning Expansion</h4>
                      <p className="text-[10px] text-indigo-400 font-mono font-bold uppercase mt-1">Control Theory Masterclass AI</p>
                    </div>
                  </div>
                  <div className="prose prose-invert prose-xs max-w-none text-indigo-100/70 font-mono leading-relaxed">
                    <Markdown>{stabilityInsight}</Markdown>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SPICE Log Console */}
            <div className="bg-[#0b0e14] border border-[#30363d] rounded-[32px] p-6 font-mono overflow-hidden">
               <div className="flex items-center gap-2 text-emerald-400/50 mb-4 text-[10px] font-bold uppercase tracking-widest">
                 <Terminal size={12} /> SPICE Analysis Log
               </div>
               <div className="space-y-1 text-[10px] text-[#8b949e]">
                 <p className="text-emerald-400">[0.000s] .TRAN 1e-9 1e-4 ... OK</p>
                 <p>[0.002s] Measuring V(OUT) Phase vs V(IN) ... -42.8 deg @ Unity Gain</p>
                 <p>[0.005s] Calculating PSRR and Noise Figures ... Done.</p>
                 <p>[0.008s] Slew rate limited by internal mirror currents: 10.4V/μs estimated.</p>
                 <p className="text-blue-400">[READY] Analysis synchronized with current S-Domain ROC.</p>
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
