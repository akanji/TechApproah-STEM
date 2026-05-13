import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, 
  ArrowDown, 
  Weight, 
  Zap, 
  ShieldCheck, 
  Info, 
  Settings2,
  HardHat,
  Waves,
  Activity,
  PlayCircle,
  Save
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { db, auth, OperationType, handleFirestoreError } from "../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

interface LoadData {
  name: string;
  value: number;
  factor: number;
  color: string;
}

export function BridgeDesignLab() {
  const [deadLoad, setDeadLoad] = useState(500); // kN
  const [superDeadLoad, setSuperDeadLoad] = useState(150); // kN
  const [hydrostaticLoad, setHydrostaticLoad] = useState(50); // kN
  
  const [gammaD, setGammaD] = useState(1.25);
  const [gammaSD, setGammaSD] = useState(1.50);
  
  const [activeTab, setActiveTab] = useState<"simulator" | "fea">("simulator");
  const [simulationActive, setSimulationActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Firebase: Load saved config
  useEffect(() => {
    const loadConfig = async () => {
      if (!auth.currentUser) return;
      try {
        const docRef = doc(db, "users", auth.currentUser.uid, "labConfigs", "bridge");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDeadLoad(data.deadLoad ?? 500);
          setSuperDeadLoad(data.superDeadLoad ?? 150);
          setHydrostaticLoad(data.hydrostaticLoad ?? 50);
          setGammaD(data.gammaD ?? 1.25);
          setGammaSD(data.gammaSD ?? 1.50);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, "labConfigs/bridge");
      }
    };
    loadConfig();
  }, []);

  // Firebase: Save config
  const saveConfig = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    try {
      const docRef = doc(db, "users", auth.currentUser.uid, "labConfigs", "bridge");
      await setDoc(docRef, {
        deadLoad,
        superDeadLoad,
        hydrostaticLoad,
        gammaD,
        gammaSD,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "labConfigs/bridge");
    } finally {
      setIsSaving(false);
    }
  };

  // Ultimate Design Value U = γD * D + γSD * SD
  const ultimateLoad = (gammaD * deadLoad) + (gammaSD * superDeadLoad) + hydrostaticLoad;
  
  // Total Static Load for Equilibrium visualization
  const totalStaticLoad = deadLoad + superDeadLoad + hydrostaticLoad;

  const loadData: LoadData[] = [
    { name: "Dead (D)", value: deadLoad, factor: gammaD, color: "#3b82f6" },
    { name: "Super Dead (SD)", value: superDeadLoad, factor: gammaSD, color: "#8b5cf6" },
    { name: "Hydrostatic (H)", value: hydrostaticLoad, factor: 1.0, color: "#ef4444" }
  ];

  const designData = loadData.map(d => ({
    name: d.name,
    designValue: d.value * d.factor,
    color: d.color
  }));

  return (
    <div className="space-y-6">
      {/* Simulation Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#161b22] border border-[#30363d] rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Building2 size={120} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <HardHat size={18} />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#8b949e]">Bridge Static Analyzer</h2>
            </div>

            <div className="flex items-baseline gap-4 mb-8">
              <div className="text-6xl font-mono text-white font-black tracking-tighter">
                {ultimateLoad.toFixed(1)}
              </div>
              <div className="flex flex-col">
                <span className="text-blue-400 font-bold font-mono">kN</span>
                <span className="text-[10px] text-[#484f58] uppercase font-bold tracking-widest">Ultimate Load (U)</span>
              </div>
            </div>

            {/* Dynamic Bridge Visualization */}
            <div className="relative h-40 bg-black/40 rounded-xl border border-white/5 mb-8 flex items-end justify-center px-10 pb-10 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
              
              {/* Bridge Deck */}
              <motion.div 
                animate={{ 
                  y: simulationActive ? [0, 2, 0] : 0,
                  scaleY: 1 + (ultimateLoad / 5000)
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full h-4 bg-[#30363d] rounded-sm border border-[#484f58] z-20 flex justify-around"
              >
                {/* Visual Load Indicators */}
                {[...Array(5)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ 
                      height: simulationActive ? [10, 20, 10] : 15,
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                    className="w-0.5 bg-red-400"
                    style={{ marginTop: -15 }}
                  />
                ))}
              </motion.div>

              {/* Piers */}
              <div className="absolute left-10 bottom-0 w-8 h-20 bg-[#161b22] border-x border-t border-[#30363d]" />
              <div className="absolute right-10 bottom-0 w-8 h-20 bg-[#161b22] border-x border-t border-[#30363d]" />
              
              {/* Foundation/Soil */}
              <div className="absolute bottom-0 inset-x-0 h-4 bg-[#0d1117] border-t border-[#30363d] z-10" />
              
              {/* Lateral Pressure Visual */}
              <AnimatePresence>
                {hydrostaticLoad > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute left-2 bottom-6 flex flex-col gap-1 items-start"
                  >
                    <Waves size={16} className="text-blue-500 animate-pulse" />
                    <div className="text-[8px] font-bold text-blue-500 uppercase">H-Pressure</div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${simulationActive ? "bg-green-500 animate-pulse" : "bg-[#30363d]"}`} />
                <span className="text-[10px] font-mono text-[#484f58] uppercase">Equilibrium Engine</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/40 border border-[#30363d] p-4 rounded-xl">
                <div className="text-[9px] uppercase font-bold text-[#8b949e] mb-1">Σ Force</div>
                <div className="text-lg font-mono text-white font-bold">0.00</div>
              </div>
              <div className="bg-black/40 border border-[#30363d] p-4 rounded-xl">
                <div className="text-[9px] uppercase font-bold text-[#8b949e] mb-1">γ_D Factor</div>
                <div className="text-lg font-mono text-blue-400 font-bold">{gammaD.toFixed(2)}</div>
              </div>
              <div className="bg-black/40 border border-[#30363d] p-4 rounded-xl">
                <div className="text-[9px] uppercase font-bold text-[#8b949e] mb-1">γ_SD Factor</div>
                <div className="text-lg font-mono text-purple-400 font-bold">{gammaSD.toFixed(2)}</div>
              </div>
              <div className="bg-black/40 border border-[#30363d] p-4 rounded-xl">
                <div className="text-[9px] uppercase font-bold text-[#8b949e] mb-1">Status</div>
                <div className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Stable State</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Toolset Sidebar */}
        <div className="bg-[#0b0e14] border border-[#30363d] rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">
              <Zap size={14} className="text-yellow-500" />
              Civil AI Toolset
            </h4>
            
            <div className="space-y-3">
              {[
                { name: "SimScale", desc: "FEA mesh configuration & validation.", color: "text-blue-400" },
                { name: "Mechi", desc: "Interview prep & feedback engine.", color: "text-emerald-400" },
                { name: "NoteGPT", desc: "Technical lecture summarization.", color: "text-purple-400" }
              ].map((tool, i) => (
                <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-help">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[10px] font-bold ${tool.color}`}>{tool.name}</span>
                    <ShieldCheck size={12} className="text-[#30363d]" />
                  </div>
                  <p className="text-[9px] text-[#8b949e] leading-tight">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#30363d] mt-4">
             <div className="flex items-center gap-3 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
               <Info size={14} className="text-blue-500 shrink-0" />
               <p className="text-[10px] text-[#c9d1d9] leading-snug font-mono italic">
                 Sum of Reactions must equal Total Static Load for stability.
               </p>
             </div>
          </div>
        </div>
      </div>

      {/* Control Panel & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Load Control Panel */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl overflow-hidden">
          <div className="border-b border-[#30363d] flex">
            <button 
              onClick={() => setActiveTab("simulator")}
              className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "simulator" ? "bg-[#161b22] text-white border-b-2 border-blue-500" : "text-[#484f58] hover:text-[#8b949e]"}`}
            >
              Control Panel
            </button>
            <button 
              onClick={() => setActiveTab("fea")}
              className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "fea" ? "bg-[#161b22] text-white border-b-2 border-blue-500" : "text-[#484f58] hover:text-[#8b949e]"}`}
            >
              LSD Formulation
            </button>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === "simulator" ? (
                <motion.div 
                  key="sim"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-blue-400">Dead Load (D)</span>
                      <span className="text-[#8b949e] font-mono">{deadLoad} kN</span>
                    </div>
                    <input 
                      type="range" min="100" max="1000" step="50" value={deadLoad} 
                      onChange={(e) => setDeadLoad(Number(e.target.value))}
                      className="w-full h-2 bg-[#30363d] rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-purple-400">Super Dead Load (SD)</span>
                      <span className="text-[#8b949e] font-mono">{superDeadLoad} kN</span>
                    </div>
                    <input 
                      type="range" min="50" max="500" step="10" value={superDeadLoad} 
                      onChange={(e) => setSuperDeadLoad(Number(e.target.value))}
                      className="w-full h-2 bg-[#30363d] rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-red-400">Hydrostatic (H)</span>
                      <span className="text-[#8b949e] font-mono">{hydrostaticLoad} kN</span>
                    </div>
                    <input 
                      type="range" min="0" max="200" step="10" value={hydrostaticLoad} 
                      onChange={(e) => setHydrostaticLoad(Number(e.target.value))}
                      className="w-full h-2 bg-[#30363d] rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSimulationActive(!simulationActive)}
                      className={`flex-1 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${simulationActive ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-blue-600 text-white"}`}
                    >
                      <Activity size={16} />
                      {simulationActive ? "Stop Analysis" : "Initialize FEA Solver"}
                    </button>
                    <button 
                      onClick={saveConfig}
                      disabled={isSaving}
                      className="px-6 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest bg-white/5 text-[#8b949e] border border-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Save size={16} />
                      {isSaving ? "..." : "Save"}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="fea"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-8"
                >
                  <div className="bg-black/50 p-6 rounded-2xl border border-white/5 font-mono text-[#8b949e] text-xs">
                    <div className="flex items-center gap-2 mb-4 text-[#484f58] font-bold uppercase tracking-widest text-[10px]">
                      <Settings2 size={14} />
                      Governing Formulation
                    </div>
                    <p className="mb-2">U = (γD * D) + (γSD * SD) + H</p>
                    <p className="text-white font-bold">
                      U = ({gammaD.toFixed(2)} * {deadLoad}) + ({gammaSD.toFixed(2)} * {superDeadLoad}) + {hydrostaticLoad}
                    </p>
                    <div className="mt-4 pt-4 border-t border-[#30363d] flex justify-between items-center">
                      <span className="text-blue-400">U_output = {ultimateLoad.toFixed(2)} kN</span>
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded text-[9px]">SOLVED</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-[#484f58] uppercase">γD Load Factor</label>
                      <select 
                        value={gammaD} 
                        onChange={(e) => setGammaD(Number(e.target.value))}
                        className="w-full bg-[#161b22] border border-[#30363d] rounded-xl p-3 text-xs text-white"
                      >
                        <option value={1.25}>1.25 (Standard)</option>
                        <option value={1.40}>1.40 (Aggressive)</option>
                        <option value={1.60}>1.60 (Extreme)</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-[#484f58] uppercase">γSD Load Factor</label>
                      <select 
                        value={gammaSD} 
                        onChange={(e) => setGammaSD(Number(e.target.value))}
                        className="w-full bg-[#161b22] border border-[#30363d] rounded-xl p-3 text-xs text-white"
                      >
                        <option value={1.50}>1.50 (Standard)</option>
                        <option value={1.75}>1.75 (Dense Asphalt)</option>
                        <option value={2.00}>2.00 (Maximum)</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Analytics Distribution */}
        <div className="bg-[#0b0e14] border border-[#30363d] rounded-2xl p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Load Contribution Spectrum</h4>
            <div className="text-[9px] font-mono text-[#484f58]">TOTAL: {totalStaticLoad} kN</div>
          </div>
          
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={designData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#161b22" />
                <XAxis 
                  dataKey="name" 
                  stroke="#484f58" 
                  fontSize={10} 
                  tick={{ fill: "#484f58" }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <YAxis 
                  stroke="#484f58" 
                  fontSize={10} 
                  tick={{ fill: "#484f58" }} 
                  axisLine={false} 
                  tickLine={false} 
                  label={{ value: 'Design kN', angle: -90, position: 'insideLeft', fill: '#484f58', fontSize: 10 }}
                />
                <Tooltip 
                  cursor={{ fill: '#161b22' }}
                  contentStyle={{ backgroundColor: '#0b0e14', border: '1px solid #30363d', borderRadius: '12px', fontSize: '10px' }}
                />
                <Bar dataKey="designValue" radius={[4, 4, 0, 0]} barSize={40}>
                  {designData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="https://youtu.be/SbCVRr5eANA" 
              target="_blank" 
              className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl flex items-center gap-4 group hover:bg-[#30363d]/30 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                <PlayCircle size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-white uppercase tracking-tight">Bridge Basics</span>
                <span className="text-[9px] text-[#484f58]">Visual Theory</span>
              </div>
            </a>
            <a 
              href="https://youtu.be/IqCIX76eBks" 
              target="_blank" 
              className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl flex items-center gap-4 group hover:bg-[#30363d]/30 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <PlayCircle size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-white uppercase tracking-tight">Static Loading</span>
                <span className="text-[9px] text-[#484f58]">Expert Breakdown</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
