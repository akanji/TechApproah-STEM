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
  Save,
  Sun,
  Moon
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  ReferenceLine
} from "recharts";
import { db, auth, OperationType, handleFirestoreError } from "../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useUser } from "./UserContext";

interface LoadData {
  name: string;
  value: number;
  factor: number;
  color: string;
}

const BRIDGE_MATERIALS = [
  { id: "concrete", name: "Reinforced Concrete", capacity: 1800, color: "text-zinc-400" },
  { id: "steel", name: "Structural Steel", capacity: 3200, color: "text-blue-400" },
  { id: "carbon", name: "Carbon Fiber Composite", capacity: 5000, color: "text-emerald-400" },
  { id: "wood", name: "Glulam Timber", capacity: 1200, color: "text-orange-900" }
];

export function BridgeDesignLab() {
  const [selectedMaterial, setSelectedMaterial] = useState(BRIDGE_MATERIALS[1]); // Default to Steel
  const [deadLoad, setDeadLoad] = useState(600); // kN
  const [liveLoad, setLiveLoad] = useState(300); // kN
  
  const [gammaD, setGammaD] = useState(1.25);
  const [gammaL, setGammaL] = useState(1.50);
  
  const [activeTab, setActiveTab] = useState<"simulator" | "fea">("simulator");
  const [simulationActive, setSimulationActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { theme, setTheme } = useUser();
  const [history, setHistory] = useState<{ time: number; load: number }[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Ultimate Design Value U = γD * D + γL * L
  const ultimateLoad = (gammaD * deadLoad) + (gammaL * liveLoad);
  
  // Safety Factor = Capacity / Ultimate Load
  const safetyFactor = selectedMaterial.capacity / ultimateLoad;

  // Failure Condition
  const isFailed = ultimateLoad > selectedMaterial.capacity;

  // Firebase: Load saved config
  useEffect(() => {
    const loadConfig = async () => {
      if (!auth.currentUser) return;
      try {
        const docRef = doc(db, "users", auth.currentUser.uid, "labConfigs", "bridge");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDeadLoad(data.deadLoad ?? 600);
          setLiveLoad(data.liveLoad ?? 300);
          setGammaD(data.gammaD ?? 1.25);
          setGammaL(data.gammaL ?? 1.50);
          const mat = BRIDGE_MATERIALS.find(m => m.id === data.materialId);
          if (mat) setSelectedMaterial(mat);
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
        liveLoad,
        gammaD,
        gammaL,
        materialId: selectedMaterial.id,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "labConfigs/bridge");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (simulationActive && !isFailed) {
      timerRef.current = setInterval(() => {
        setHistory(prev => {
          const next = [...prev, { time: prev.length, load: ultimateLoad + (Math.random() - 0.5) * 10 }];
          return next.slice(-20); // Keep last 20 points
        });
      }, 500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [simulationActive, ultimateLoad, isFailed]);

  const resetSimulator = () => {
    setDeadLoad(600);
    setLiveLoad(300);
    setGammaD(1.25);
    setGammaL(1.50);
    setSelectedMaterial(BRIDGE_MATERIALS[1]);
    setHistory([]);
    setSimulationActive(false);
  };

  const loadData: LoadData[] = [
    { name: "Dead Load (D)", value: deadLoad, factor: gammaD, color: "#3b82f6" },
    { name: "Live Load (L)", value: liveLoad, factor: gammaL, color: "#8b5cf6" }
  ];

  const designData = loadData.map(d => ({
    name: d.name,
    designValue: d.value * d.factor,
    color: d.color
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Module Header */}
      <div className="flex justify-between items-center bg-[#161b22] border border-[#30363d] px-6 py-3 rounded-2xl">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Bridge Architecture Lab</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-[#484f58] uppercase">Theme:</span>
            <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
              {(["dark", "blue", "emerald"] as const).map(t => (
                <button 
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-all ${theme === t ? "bg-white/10 text-white" : "text-[#484f58] hover:text-[#8b949e]"}`}
                >
                  {t}
                </button>
              ))}
            </div>
         </div>
      </div>

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
              
              {/* Bridge Deck with Stress Heatmap Overlay */}
              <motion.div 
                animate={{ 
                  y: simulationActive ? [0, 2, 0] : 0,
                  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className={`relative w-full h-4 rounded-sm border z-20 flex justify-around items-center transition-colors duration-500 overflow-hidden ${
                  isFailed ? "bg-red-950 border-red-500" : "bg-[#30363d] border-white/10"
                }`}
              >
                {/* Stress Distribution Overlay */}
                <div 
                  className="absolute inset-0 opacity-40 transition-all duration-500"
                  style={{
                    background: `linear-gradient(to right, transparent, ${
                      safetyFactor < 1.1 ? '#ef4444' : safetyFactor < 1.5 ? '#f59e0b' : '#10b981'
                    }, transparent)`
                  }}
                />

                {/* Localized Stress Visual (Center usually highest moment) */}
                <div 
                  className="absolute top-0 bottom-0 transition-all duration-700 blur-md"
                  style={{
                    left: '25%', 
                    right: '25%',
                    backgroundColor: safetyFactor < 1.2 ? '#ef444422' : 'transparent'
                  }}
                />

                {/* Visual Load Indicators (Forces) */}
                {!isFailed && [...Array(8)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ 
                      height: simulationActive ? [10, 25, 10] : 15,
                      opacity: [0.3, 0.8, 0.3],
                      y: simulationActive ? [0, 5, 0] : 0
                    }}
                    transition={{ duration: 1.2, delay: i * 0.15, repeat: Infinity }}
                    className={`w-0.5 ${ultimateLoad > 1000 ? "bg-red-400" : "bg-blue-400"}`}
                    style={{ position: 'absolute', top: -20, left: `${(i + 1) * 11}%` }}
                  />
                ))}
                
                {isFailed && (
                  <div className="absolute -top-10 inset-0 flex items-center justify-center">
                    <Zap size={32} className="text-yellow-500 animate-pulse" />
                  </div>
                )}
              </motion.div>

              {/* Piers */}
              <div className="absolute left-10 bottom-0 w-8 h-20 bg-[#161b22] border-x border-t border-[#30363d]" />
              <div className="absolute right-10 bottom-0 w-8 h-20 bg-[#161b22] border-x border-t border-[#30363d]" />
              
              {/* Foundation/Soil */}
              <div className="absolute bottom-0 inset-x-0 h-4 bg-[#0d1117] border-t border-[#30363d] z-10" />
              
              {/* AI Insight Info */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${simulationActive ? "bg-green-500 animate-pulse" : "bg-[#30363d]"}`} />
                <span className="text-[10px] font-mono text-[#484f58] uppercase">Equilibrium Engine</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/40 border border-[#30363d] p-4 rounded-xl">
                <div className="text-[9px] uppercase font-bold text-[#8b949e] mb-1">Safety Factor</div>
                <div className={`text-lg font-mono font-bold ${safetyFactor < 1 ? "text-red-500" : safetyFactor < 1.5 ? "text-yellow-500" : "text-emerald-400"}`}>
                  {safetyFactor.toFixed(2)}
                </div>
              </div>
              <div className="bg-black/40 border border-[#30363d] p-4 rounded-xl">
                <div className="text-[9px] uppercase font-bold text-[#8b949e] mb-1">γ_D Factor</div>
                <div className={`text-lg font-mono font-bold text-blue-400`}>{gammaD.toFixed(2)}</div>
              </div>
              <div className="bg-black/40 border border-[#30363d] p-4 rounded-xl">
                <div className="text-[9px] uppercase font-bold text-[#8b949e] mb-1">γ_L Factor</div>
                <div className={`text-lg font-mono font-bold text-purple-400`}>{gammaL.toFixed(2)}</div>
              </div>
              <div className="bg-black/40 border border-[#30363d] p-4 rounded-xl">
                <div className="text-[9px] uppercase font-bold text-[#8b949e] mb-1">Status</div>
                <div className={`text-[10px] font-bold ${isFailed ? "text-red-500" : "text-green-500"} uppercase tracking-tighter`}>
                  {isFailed ? "STRUCTURE COLLAPSED" : "Stable State"}
                </div>
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
                      <span className="text-[#8b949e]">Structural Material</span>
                      <span className={selectedMaterial.color}>{selectedMaterial.capacity} kN Yield</span>
                    </div>
                    <select 
                      value={selectedMaterial.id}
                      onChange={(e) => {
                        const mat = BRIDGE_MATERIALS.find(m => m.id === e.target.value);
                        if (mat) setSelectedMaterial(mat);
                      }}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded-xl p-3 text-xs text-white"
                    >
                      {BRIDGE_MATERIALS.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      )  )}
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-blue-400">Dead Load (D)</span>
                      <span className="text-[#8b949e] font-mono">{deadLoad} kN</span>
                    </div>
                    <input 
                      type="range" min="100" max="1500" step="50" value={deadLoad} 
                      onChange={(e) => setDeadLoad(Number(e.target.value))}
                      className="w-full h-2 bg-[#30363d] rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-purple-400">Live Load (L)</span>
                      <span className="text-[#8b949e] font-mono">{liveLoad} kN</span>
                    </div>
                    <input 
                      type="range" min="50" max="1000" step="10" value={liveLoad} 
                      onChange={(e) => setLiveLoad(Number(e.target.value))}
                      className="w-full h-2 bg-[#30363d] rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSimulationActive(!simulationActive)}
                      disabled={isFailed}
                      className={`flex-1 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${simulationActive ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-blue-600 text-white"} disabled:opacity-50`}
                    >
                      <Activity size={16} />
                      {simulationActive ? "Stop Analysis" : "Initialize FEA Solver"}
                    </button>
                    <button 
                      onClick={resetSimulator}
                      className="px-4 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest bg-[#161b22] text-[#8b949e] border border-[#30363d] hover:text-white transition-all"
                    >
                      Reset
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
                    <p className="mb-2">U = (γD * D) + (γL * L)</p>
                    <p className="text-white font-bold">
                      U = ({gammaD.toFixed(2)} * {deadLoad}) + ({gammaL.toFixed(2)} * {liveLoad})
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
                        <option value={1.50}>1.50 (Extreme)</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-[#484f58] uppercase">γL Load Factor</label>
                      <select 
                        value={gammaL} 
                        onChange={(e) => setGammaL(Number(e.target.value))}
                        className="w-full bg-[#161b22] border border-[#30363d] rounded-xl p-3 text-xs text-white"
                      >
                        <option value={1.50}>1.50 (Standard)</option>
                        <option value={1.75}>1.75 (Dense Traffic)</option>
                        <option value={2.00}>2.00 (Maximum)</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Analytics Distribution & History */}
        <div className="bg-[#0b0e14] border border-[#30363d] rounded-2xl p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Load Contribution & Force History</h4>
            <div className="text-[9px] font-mono text-[#484f58]">CAPACITY: {selectedMaterial.capacity} kN</div>
          </div>
          
          <div className="flex-1 space-y-8">
            <div className="h-[180px]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-bold text-[#484f58] uppercase">Component Load Share</span>
                <span className={`${selectedMaterial.color} text-[10px] font-mono`}>{selectedMaterial.name}</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={designData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#161b22" />
                  <XAxis dataKey="name" stroke="#484f58" fontSize={9} axisLine={false} tickLine={false} />
                  <YAxis stroke="#484f58" fontSize={9} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0b0e14', border: '1px solid #30363d', borderRadius: '12px', fontSize: '9px' }} />
                  <Bar dataKey="designValue" radius={[4, 4, 0, 0]} barSize={30}>
                    {designData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="h-[180px]">
              <div className="text-[9px] font-bold text-[#484f58] uppercase mb-4 tracking-widest">Real-time Stress History</div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#161b22" />
                  <XAxis hide dataKey="time" />
                  <YAxis stroke="#484f58" fontSize={9} axisLine={false} tickLine={false} domain={[0, Math.max(selectedMaterial.capacity + 500, ultimateLoad + 100)]} />
                  <Tooltip labelStyle={{ display: 'none' }} contentStyle={{ backgroundColor: '#0b0e14', border: '1px solid #30363d', borderRadius: '12px', fontSize: '9px' }} />
                  <ReferenceLine y={selectedMaterial.capacity} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: 'Failure', fill: '#ef4444', fontSize: 8 }} />
                  <Line type="monotone" dataKey="load" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
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
