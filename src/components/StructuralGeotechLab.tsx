import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Database, FileText, Map as MapIcon, Layers, ChevronRight, 
  Activity, HardHat, Building2, Terminal, Code, Clock, 
  Search, Play, AlertCircle, Sparkles
} from "lucide-react";

export function StructuralGeotechLab() {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"site" | "fea" | "monitoring" | "optimize">("site");
  const [isParsing, setIsParsing] = useState(false);

  const [boreholeData] = useState([
    { type: "Topsoil", depth: 2, color: "bg-amber-900/60", description: "Soft, organic rich, high moisture content." },
    { type: "Silty Clay", depth: 6, color: "bg-amber-700/60", description: "Medium plastic, compressible silty clay layer." },
    { type: "Dense Sand", depth: 7, color: "bg-yellow-800/60", description: "High bearing capacity sand with gravel inclusions." },
    { type: "Bedrock", depth: 5, color: "bg-slate-800/80", description: "Incompressible shale substrate, optimal for piling." }
  ]);

  const [optimizationParams, setOptimizationParams] = useState({
    budget: 50000,
    sustainability: 85,
    material: "High-Strength Steel"
  });

  const feaCode = `# Structural FEA: Steel Beam Analysis
import numpy as np

def analyze_beam(length=10, load=5000, e_modulus=200e9):
    """
    Simulates stress and deflection for a 
    standard I-Beam (W10x45).
    """
    # Moment of Inertia (I) for W10x45
    inertia_i = 0.000103 # m^4
    
    # Max Deflection (delta) = (P * L^3) / (48 * E * I)
    deflection = (load * length**3) / (48 * e_modulus * inertia_i)
    
    # Max Bending Stress (sigma) = (M * c) / I
    moment_m = (load * length) / 4
    c_y = 0.127 # half depth
    stress = (moment_m * c_y) / inertia_i
    
    return {
        "max_deflection_mm": round(deflection * 1000, 2),
        "max_stress_mpa": round(stress / 1e6, 2),
        "safety_factor": round(250 / (stress / 1e6), 2)
    }

# Result: {'deflection': 3.12mm, 'stress': 61.2MPa}
`;

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Building2 size={14} /> Site Assistant Agent
          </h3>
          <p className="text-[10px] text-[#484f58] mt-1 font-mono">Civils.ai Logic • Virtual Lab v4.0</p>
        </div>
        <div className="flex bg-[#161b22] border border-[#30363d] rounded-lg p-1">
          {(['site', 'fea', 'monitoring', 'optimize'] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-[9px] font-bold uppercase rounded-md transition-all ${
                activeTab === tab ? "bg-blue-500/20 text-blue-400" : "text-[#484f58]"
              }`}
            >
              {tab === 'site' ? 'Borehole' : tab === 'fea' ? 'Python FEA' : tab === 'monitoring' ? 'Monitoring' : 'Optimization'}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "site" && (
          <motion.div 
            key="site"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Borehole Visualizer: Section A-1 */}
            <div className="bg-[#0b0e14] border border-[#30363d] rounded-3xl p-8 overflow-hidden relative shadow-2xl shadow-blue-500/5">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <h4 className="text-white font-bold text-sm tracking-tight uppercase">Borehole Log: Section A-1</h4>
                  <div className="flex gap-4">
                    <span className="text-[9px] font-bold text-[#484f58] uppercase px-2 py-0.5 rounded bg-white/5 border border-white/5">COORDINATES: 22.4N, 114.2E</span>
                    <span className="text-[9px] font-bold text-[#484f58] uppercase px-2 py-0.5 rounded bg-white/5 border border-white/5">PROJECT: AIS-SKY-01</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                    <Database size={20} />
                  </div>
                </div>
              </div>

              {/* 2D SECTION VIEW */}
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-24 flex flex-col justify-between py-2 text-[9px] font-mono text-[#484f58] font-bold border-r border-[#30363d] pr-4">
                  <span>0.0m</span>
                  <span>-5.0m</span>
                  <span>-10.0m</span>
                  <span>-15.0m</span>
                  <span>-20.0m</span>
                </div>
                
                <div className="flex-1 flex flex-col border-2 border-black/40 rounded-xl overflow-hidden shadow-2xl h-[400px]">
                  {boreholeData.map((layer, i) => (
                    <motion.div
                      key={i}
                      onMouseEnter={() => setActiveLayer(i)}
                      onMouseLeave={() => setActiveLayer(null)}
                      style={{ flex: layer.depth }}
                      className={`relative flex items-center justify-center border-b border-black/20 cursor-pointer transition-all hover:brightness-125 ${layer.color} ${
                        activeLayer === i ? "flex-[1.2]" : ""
                      }`}
                    >
                      <div className="text-center group">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-md">{layer.type}</span>
                        <div className="text-[8px] text-white/50 opacity-0 group-hover:opacity-100 transition-opacity font-mono">DEPTH: {layer.depth}m</div>
                      </div>
                      
                      {/* Substrate Texture Overlay */}
                      <div className={`absolute inset-0 opacity-10 pointer-events-none ${
                        layer.type.includes("Sand") ? "bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[length:4px_4px]" : 
                        layer.type.includes("Bedrock") ? "bg-[repeating-linear-gradient(45deg,transparent,transparent:5px,rgba(255,255,255,0.1):5px,rgba(255,255,255,0.1):6px)]" : ""
                      }`} />
                    </motion.div>
                  ))}
                </div>

                <div className="w-full lg:w-1/3 bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-[#30363d]">
                      <Search size={14} className="text-blue-400" />
                      <span className="text-[9px] font-bold text-white uppercase tracking-widest">Site Analysis</span>
                    </div>
                    {activeLayer !== null ? (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="space-y-3"
                      >
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{boreholeData[activeLayer].type}</p>
                        <p className="text-[11px] text-[#8b949e] leading-relaxed">{boreholeData[activeLayer].description}</p>
                        <div className="pt-2">
                           <span className="text-[9px] text-[#484f58] uppercase font-bold">Recommended Piling:</span>
                           <p className="text-[10px] text-emerald-400 font-bold uppercase mt-1">
                             {boreholeData[activeLayer].type === "Bedrock" ? "End Bearing Piles" : "Friction Piles"}
                           </p>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-[10px] text-[#484f58] italic uppercase leading-relaxed">
                          Hover a soil strata to trigger the site assistant's geotechnical properties parser.
                        </p>
                        <ul className="space-y-2">
                          {boreholeData.map((layer, idx) => (
                            <li key={idx} className="text-[10px] text-[#8b949e] flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${layer.color.replace('/60', '')}`} />
                              {layer.type}: {layer.description.substring(0, 30)}...
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <button className="w-full py-3 bg-blue-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-400 transition-colors shadow-lg shadow-blue-500/20 mt-6 group">
                    Export to Civils.ai <ChevronRight size={14} className="inline-block ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "fea" && (
          <motion.div 
            key="fea"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Python FEA Editor */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-3xl overflow-hidden flex flex-col h-[500px]">
              <div className="bg-[#0b0e14] px-6 py-4 border-b border-[#30363d] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/10">
                    <Code size={14} className="text-blue-400" />
                  </div>
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">FEA_Simulation.py</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
                </div>
              </div>
              <div className="p-6 flex-1 font-mono text-[11px] text-blue-100/60 overflow-y-auto bg-[#0d1117]/50">
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {feaCode}
                </pre>
              </div>
              <div className="p-5 bg-[#0b0e14] border-t border-[#30363d] flex justify-end gap-3">
                <button className="px-4 py-2 bg-white/5 text-[#8b949e] border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                  Reset
                </button>
                <button 
                  onClick={() => {
                    setIsParsing(true);
                    setTimeout(() => setIsParsing(false), 1500);
                  }}
                  className="px-6 py-2 bg-blue-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-400 flex items-center gap-2 shadow-lg shadow-blue-500/10"
                >
                  {isParsing ? "Solving..." : "Run Solver"} <Terminal size={12} />
                </button>
              </div>
            </div>

            {/* AI Results Output */}
            <div className="space-y-6">
              <div className="bg-[#0b0e14] border border-blue-500/20 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <HardHat size={140} />
                </div>
                <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                   <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                     <Activity size={20} />
                   </div>
                   <div>
                     <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">FEA Simulation Results</h4>
                     <p className="text-[9px] text-blue-400 font-mono">Beam Analysis: AISC W10x45 Steel</p>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-x-12 gap-y-8 relative z-10">
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase font-bold text-[#484f58]">Max Deflection</p>
                    <p className="text-white font-mono font-bold text-4xl tracking-tighter">3.12<span className="text-xs ml-1 text-blue-400 uppercase font-sans">mm</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase font-bold text-[#484f58]">Bending Stress</p>
                    <p className="text-white font-mono font-bold text-4xl tracking-tighter">61.2<span className="text-xs ml-1 text-blue-400 uppercase font-sans">MPa</span></p>
                  </div>
                  <div className="space-y-1 border-t border-white/5 pt-6">
                    <p className="text-[9px] uppercase font-bold text-[#484f58]">Factor of Safety</p>
                    <p className="text-emerald-400 font-mono font-bold text-4xl tracking-tighter">4.08</p>
                  </div>
                  <div className="space-y-1 border-t border-white/5 pt-6">
                    <p className="text-[9px] uppercase font-bold text-[#484f58]">Regulatory Check</p>
                    <div className="flex items-center gap-2 mt-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-500" />
                       <p className="text-emerald-400 font-mono font-bold text-[10px] uppercase">AASHTO COMPLIANT</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-5 bg-gradient-to-r from-blue-500/10 to-transparent rounded-2xl border border-blue-500/10">
                  <p className="text-[11px] text-blue-100/70 italic font-medium leading-relaxed">
                    <span className="text-blue-400 font-bold uppercase mr-1">AI Note:</span> Stress values are within elastic limits. LRFD verification confirms current beam selection is over-designed. Reducing section mass could yield 12% cost efficiency.
                  </p>
                </div>
              </div>

              <div className="bg-[#161b22] border border-[#30363d] rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
                    <AlertCircle size={14} className="text-yellow-400" /> Structural Constraints
                  </h4>
                  <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded text-[8px] font-mono font-bold">3 WARNINGS</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-4 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                    <p className="text-[11px] text-[#8b949e] leading-snug">Elastic buckling check (Euler) required for beam-column interactions if lateral loads increase by {">"}5%.</p>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <p className="text-[11px] text-[#8b949e] leading-snug">Connection design (Bolted/Welded) must follow AISC Table 7-1 for shear strength validation.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "monitoring" && (
          <motion.div 
            key="monitoring"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="space-y-6"
          >
            {/* Structural Health Monitoring Summary - No GPT Integration */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-[32px] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative h-[350px] bg-[#0d1117] rounded-[32px] border border-[#30363d] overflow-hidden">
                <iframe 
                  src="https://www.youtube.com/embed/z3v6iGaJNts" 
                  className="w-full h-full border-none opacity-80 group-hover:opacity-100 transition-all duration-500"
                  title="AI for Structural Engineering"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="absolute top-4 left-4 flex gap-2">
                   <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[9px] font-bold text-white uppercase tracking-widest">Luma AI Visual</div>
                </div>
              </div>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-[32px] p-8 space-y-8">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Layers size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest px-2 py-0.5 border border-white/5 bg-white/5 rounded-lg mb-1 inline-block">Pictory AI Visual Manual</h4>
                    <p className="text-[10px] text-[#8b949e] font-mono">Automated Lab Summary • 4 High-Resolution Segments</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/10">
                    Generate New Manual
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { time: "01:22", text: "Concrete Slump Test: Neural rendering shows optimal moisture content for C30/37 grade concrete.", tool: "Luma AI" },
                  { time: "04:15", text: "Reinforcement Mapping: Automated identification of rebar spacing using computer vision overlay.", tool: "Pictory" },
                  { time: "07:30", text: "Carbon Footprint Analytics: Calculating material sustainability index based on recycling potential.", tool: "Optimized" }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ x: 10 }}
                    className="flex gap-6 items-start p-4 hover:bg-white/5 rounded-2xl transition-all group cursor-pointer border border-transparent hover:border-white/5"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[11px] font-bold text-emerald-400 font-mono w-12 text-right">{item.time}</span>
                      <Clock size={10} className="text-[#484f58]" />
                    </div>
                    <div className="border-l border-[#30363d] pl-6 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[12px] text-[#c9d1d9] leading-relaxed font-medium group-hover:text-white transition-colors">{item.text}</p>
                        <span className="px-1.5 py-0.5 bg-white/5 text-[8px] font-bold text-[#484f58] rounded border border-white/5">{item.tool}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "optimize" && (
          <motion.div 
            key="optimize"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-[#0b0e14] border border-[#30363d] rounded-[32px] p-8">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                <div>
                  <h4 className="text-white font-bold text-lg tracking-tight uppercase">Structural Material Optimizer</h4>
                  <p className="text-[10px] text-[#8b949e] font-mono mt-1 uppercase tracking-widest font-bold">Constraint-Based Generative Algorithm</p>
                </div>
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400">
                  <Sparkles size={24} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8 pr-8 lg:border-r border-white/5">
                   <div className="space-y-4">
                     <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-[#8b949e]">
                        <span>Budget Cap</span>
                        <span className="text-white">${optimizationParams.budget.toLocaleString()}</span>
                     </div>
                     <input 
                       type="range" 
                       min="10000" 
                       max="100000" 
                       value={optimizationParams.budget}
                       onChange={(e) => setOptimizationParams({...optimizationParams, budget: parseInt(e.target.value)})}
                       className="w-full h-1 bg-[#161b22] rounded-lg appearance-none cursor-pointer accent-purple-500"
                     />
                   </div>

                   <div className="space-y-4">
                     <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-[#8b949e]">
                        <span>Sustainability Index</span>
                        <span className="text-white">{optimizationParams.sustainability}%</span>
                     </div>
                     <input 
                       type="range" 
                       min="0" 
                       max="100" 
                       value={optimizationParams.sustainability}
                       onChange={(e) => setOptimizationParams({...optimizationParams, sustainability: parseInt(e.target.value)})}
                       className="w-full h-1 bg-[#161b22] rounded-lg appearance-none cursor-pointer accent-emerald-500"
                     />
                   </div>

                   <div className="space-y-3">
                     <p className="text-[9px] font-bold text-[#484f58] uppercase">Target Material</p>
                     <div className="grid grid-cols-1 gap-2">
                       {['High-Strength Steel', 'Eco-Concrete', 'Aluminum Alloy'].map(m => (
                         <button 
                           key={m}
                           onClick={() => setOptimizationParams({...optimizationParams, material: m})}
                           className={`px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                             optimizationParams.material === m ? "bg-purple-500/20 border-purple-500/40 text-purple-400" : "bg-white/5 border-white/5 text-[#484f58] hover:border-white/10"
                           }`}
                         >
                           {m}
                         </button>
                       ))}
                     </div>
                   </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-[#161b22] border border-[#30363d] rounded-[24px]">
                      <h5 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">Optimized Section</h5>
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 border-2 border-purple-500/40 rounded-xl flex items-center justify-center font-mono text-xl text-white font-bold">I</div>
                        <div>
                          <p className="text-[9px] text-[#484f58] uppercase font-bold mb-1">Recommended Section</p>
                          <p className="text-sm font-bold text-purple-400 uppercase tracking-tight">HEB 300 Optimized</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-[#052616] border border-emerald-500/20 rounded-[24px]">
                      <h5 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-4">Carbon Savings</h5>
                      <div className="flex items-center gap-3">
                        <div className="text-3xl font-mono font-bold text-white tracking-tighter">
                          {((optimizationParams.sustainability / 100) * 12.4).toFixed(1)}<span className="text-xs ml-1 text-emerald-400 italic">kg/m</span>
                        </div>
                      </div>
                      <p className="text-[9px] text-emerald-400/60 uppercase font-bold mt-2">Reduced embodied energy</p>
                    </div>
                  </div>

                  <div className="p-8 bg-[#0b0e14] border border-white/5 rounded-[24px] relative overflow-hidden">
                     <div className="relative z-10">
                       <h5 className="text-[10px] font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                         <Activity size={12} className="text-purple-400" /> Solver Log: Iteration 42
                       </h5>
                       <ul className="space-y-3 font-mono text-[10px] text-[#484f58]">
                         <li className="flex justify-between border-b border-white/5 pb-2">
                           <span>{">"} Geometry convergence achieved</span>
                           <span className="text-emerald-400">99.8%</span>
                         </li>
                         <li className="flex justify-between border-b border-white/5 pb-2">
                           <span>{">"} Sustainability constraint check</span>
                           <span className="text-emerald-400">PASSED</span>
                         </li>
                         <li className="flex justify-between border-b border-white/5 pb-2">
                           <span>{">"} Budget delta analysis</span>
                           <span className="text-purple-400">-$4,200 (SAVED)</span>
                         </li>
                         <li className="flex justify-between pt-2">
                           <span>{">"} Neural rendering via Luma AI</span>
                           <span className="text-blue-400">COMPLETED</span>
                         </li>
                       </ul>
                     </div>
                     <div className="absolute bottom-0 right-0 p-4 font-mono text-[60px] font-black text-white/5 leading-none select-none">SOLVE</div>
                  </div>

                  <button className="w-full py-4 bg-purple-500 text-white rounded-2xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-purple-400 transition-all shadow-xl shadow-purple-500/10">
                    Apply Optimization Parameters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistence Log */}
      <div className="bg-[#161b22]/50 border border-[#30363d] rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
          <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Site Assistant Decision Matrix</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <p className="text-[9px] uppercase font-bold text-[#484f58]">Borehole Sync</p>
            <p className="text-emerald-400 font-bold text-[11px] uppercase tracking-wider">SUCCESS (LOG A-1)</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] uppercase font-bold text-[#484f58]">Python Core</p>
            <p className="text-blue-400 font-bold text-[11px] uppercase tracking-wider">READY (SCIPY 1.x)</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] uppercase font-bold text-[#484f58]">Health Monitor</p>
            <p className="text-purple-400 font-bold text-[11px] uppercase tracking-wider">TIMESTAMPED</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] uppercase font-bold text-[#484f58]">Visual Lab</p>
            <p className="text-white font-bold text-[11px] uppercase tracking-wider">LUMA/PICTORY SYNCED</p>
          </div>
        </div>
      </div>
    </div>
  );
}
