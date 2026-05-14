import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Settings, 
  Cpu, 
  ShieldAlert, 
  Thermometer, 
  BarChart, 
  Wind,
  Box,
  FileText,
  Play,
  RotateCw,
  Activity,
  Layers,
  Save,
  Trash2,
  ChevronDown,
  ChevronUp,
  Database,
  History
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { db, auth, OperationType, handleFirestoreError } from "../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const MATERIALS = [
  { id: "steel", name: "Steel (AISI 1045)", yieldStrength: 530, modulus: 200, thermalConductivity: 45, kFactor: 1.0, color: "text-zinc-300" },
  { id: "aluminum", name: "Aluminum (6061)", yieldStrength: 275, modulus: 69, thermalConductivity: 167, kFactor: 0.6, color: "text-blue-300" },
  { id: "titanium", name: "Titanium (Gr 5)", yieldStrength: 880, modulus: 114, thermalConductivity: 6.7, kFactor: 2.2, color: "text-purple-400" },
  { id: "carbide", name: "Tungsten Carbide", yieldStrength: 5000, modulus: 600, thermalConductivity: 110, kFactor: 5.0, color: "text-orange-400" },
  { id: "copper", name: "Copper (Pure)", yieldStrength: 70, modulus: 117, thermalConductivity: 401, kFactor: 0.5, color: "text-orange-300" },
  { id: "castiron", name: "Gray Cast Iron", yieldStrength: 240, modulus: 100, thermalConductivity: 52, kFactor: 0.8, color: "text-zinc-500" }
];

export function MechanicalLab() {
  const [cuttingSpeed, setCuttingSpeed] = useState(150); // m/min
  const [feedRate, setFeedRate] = useState(0.2); // mm/rev
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [history, setHistory] = useState<{time: number, stress: number, temp: number}[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Taylor's Tool Life Equation constant (simplified)
  // V * T^n = C -> T = (C/V)^(1/n)
  const n = 0.25;
  const C = 400;
  const toolLife = Math.pow(C / (cuttingSpeed * selectedMaterial.kFactor), 1 / n) * (1 - feedRate);
  
  // Revised Stress Calculation: Force = Kc * b * h (Kc = specific cutting energy)
  const cuttingForce = 2000 * selectedMaterial.kFactor * feedRate * 2.0; // 2.0 = depth of cut
  const currentStress = cuttingForce / 4.0; // dummy area

  // Surface Roughness Ra approx proportional to f^2 / (32 * r)
  const surfaceRoughness = (Math.pow(feedRate, 2) * 1000) / (32 * 0.8);

  const isFailing = currentStress > selectedMaterial.yieldStrength;

  // Firebase: Load last config
  useEffect(() => {
    const loadConfig = async () => {
      if (!auth.currentUser) return;
      try {
        const docRef = doc(db, "users", auth.currentUser.uid, "labConfigs", "mechanical");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCuttingSpeed(data.cuttingSpeed ?? 150);
          setFeedRate(data.feedRate ?? 0.2);
          const mat = MATERIALS.find(m => m.id === data.materialId);
          if (mat) setSelectedMaterial(mat);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, "labConfigs/mechanical");
      }
    };
    loadConfig();
  }, []);

  // Firebase: Save config
  const saveConfig = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    try {
      const docRef = doc(db, "users", auth.currentUser.uid, "labConfigs", "mechanical");
      await setDoc(docRef, {
        cuttingSpeed,
        feedRate,
        materialId: selectedMaterial.id,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "labConfigs/mechanical");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setCuttingSpeed(150);
    setFeedRate(0.2);
    setSelectedMaterial(MATERIALS[0]);
    setIsSimulating(false);
    setHistory([]);
  };

  useEffect(() => {
    if (isSimulating) {
      timerRef.current = setInterval(() => {
        setHistory(prev => {
          const nextTime = prev.length > 0 ? prev[prev.length - 1].time + 1 : 0;
          const fluctuation = (Math.random() - 0.5) * 20;
          const tempVal = (cuttingSpeed * 2.5) / (selectedMaterial.thermalConductivity / 50);
          const newEntry = {
            time: nextTime,
            stress: Math.max(0, currentStress + fluctuation),
            temp: Math.max(20, tempVal + (Math.random() - 0.5) * 50)
          };
          const newHistory = [...prev, newEntry];
          return newHistory.slice(-20); // Keep last 20 points
        });
      }, 500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isSimulating, currentStress, cuttingSpeed]);

  return (
    <div className="space-y-6">
      {/* Simulation Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#161b22] border border-[#30363d] rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Settings size={120} className="animate-spin-slow" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Cpu size={18} />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#8b949e]">Production Dynamics Console</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest flex items-center gap-2">
                    <Layers size={12} className="text-blue-400" />
                    Material Profile
                  </span>
                  <span className={`text-[10px] font-mono font-bold ${selectedMaterial.color}`}>
                    {selectedMaterial.yieldStrength} MPa Yield
                  </span>
                </div>
                <select 
                  value={selectedMaterial.id}
                  onChange={(e) => {
                    const mat = MATERIALS.find(m => m.id === e.target.value);
                    if (mat) setSelectedMaterial(mat);
                  }}
                  className="w-full bg-[#30363d] border border-[#484f58] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
                >
                  {MATERIALS.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#8b949e] uppercase tracking-widest">
                    <span>Speed (V)</span>
                    <span className="text-white">{cuttingSpeed}</span>
                  </div>
                  <input 
                    type="range" min="50" max="300" step="5" value={cuttingSpeed} 
                    onChange={(e) => setCuttingSpeed(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-[#30363d] h-2 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#8b949e] uppercase tracking-widest">
                    <span>Feed (f)</span>
                    <span className="text-white">{feedRate.toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" min="0.05" max="0.5" step="0.01" value={feedRate} 
                    onChange={(e) => setFeedRate(Number(e.target.value))}
                    className="w-full accent-blue-500 bg-[#30363d] h-2 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-black/40 border border-[#30363d] p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="text-[9px] uppercase font-bold text-[#8b949e] mb-1">Tool Life</div>
                  <div className="text-xl font-mono text-emerald-400 font-bold">{toolLife.toFixed(0)}<span className="text-[10px] ml-1">min</span></div>
                </div>
              </div>
              <div className="bg-black/40 border border-[#30363d] p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="text-[9px] uppercase font-bold text-[#8b949e] mb-1">Current Stress</div>
                  <div className={`text-xl font-mono font-bold ${isFailing ? "text-red-500" : "text-blue-400"}`}>
                    {currentStress.toFixed(0)}<span className="text-[10px] ml-1">MPa</span>
                  </div>
                </div>
              </div>
              <div className="bg-black/40 border border-[#30363d] p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="text-[9px] uppercase font-bold text-[#8b949e] mb-1">Surface Ra</div>
                  <div className="text-xl font-mono text-purple-400 font-bold">{surfaceRoughness.toFixed(3)}<span className="text-[10px] ml-1">µm</span></div>
                </div>
              </div>
              <div className="bg-black/40 border border-[#30363d] p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="text-[9px] uppercase font-bold text-[#8b949e] mb-1">Safety Margin</div>
                  <div className={`text-xs font-black uppercase tracking-tighter ${isFailing ? "text-red-500" : "text-green-500"}`}>
                    {isFailing ? "FAILURE IMMINENT" : `${((1 - currentStress/selectedMaterial.yieldStrength) * 100).toFixed(0)}% OK`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Stack / Toolkit */}
        <div className="bg-[#0b0e14] border border-[#30363d] rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">
              <Settings size={14} className="text-emerald-500" />
              Machine AI Stack
            </h4>
            
            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-help group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-white group-hover:text-emerald-400 transition-colors">SimScale Lab</span>
                  <ShieldAlert size={12} className="text-emerald-500" />
                </div>
                <p className="text-[9px] text-[#8b949e] leading-tight">Physics-based design validation and thermal analysis.</p>
              </div>
              
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-help group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-white group-hover:text-blue-400 transition-colors">Siemens NX AI</span>
                  <Wind size={12} className="text-blue-500" />
                </div>
                <p className="text-[9px] text-[#8b949e] leading-tight">Generative design for high-strength, low-weight parts.</p>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-help group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-white group-hover:text-purple-400 transition-colors">MechiAI Tutors</span>
                  <FileText size={12} className="text-purple-500" />
                </div>
                <p className="text-[9px] text-[#8b949e] leading-tight">Technical interview prep and real-world case studies.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#30363d] mt-4">
             <div className="flex items-center gap-2 text-[9px] font-mono text-[#484f58]">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               NotebookLM Protocols Active
             </div>
          </div>
        </div>
      </div>

      {/* Material Intelligence Table */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl">
        <button 
          onClick={() => setIsTableOpen(!isTableOpen)}
          className="w-full px-8 py-5 flex items-center justify-between hover:bg-white/5 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Database size={20} />
            </div>
            <div className="text-left">
              <h3 className="text-white font-bold text-sm uppercase tracking-widest">Material Intelligence Repository</h3>
              <p className="text-[10px] text-[#8b949e] font-mono mt-0.5">V{MATERIALS.length}.0 Protocol • Synchronized with AI Engine</p>
            </div>
          </div>
          <div className={`p-2 rounded-lg bg-white/5 border border-white/10 text-white transition-all ${isTableOpen ? "rotate-180" : ""}`}>
            <ChevronDown size={16} />
          </div>
        </button>

        <AnimatePresence>
          {isTableOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-8 pb-8"
            >
              <div className="overflow-x-auto border border-white/5 rounded-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/40">
                      <th className="px-6 py-4 text-[10px] font-bold text-[#8b949e] uppercase tracking-widest border-b border-white/5">Grade</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-[#8b949e] uppercase tracking-widest border-b border-white/5">Yield [MPa]</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-[#8b949e] uppercase tracking-widest border-b border-white/5">Elastic Modulus [GPa]</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-[#8b949e] uppercase tracking-widest border-b border-white/5">Thermal [W/m·K]</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-[#8b949e] uppercase tracking-widest border-b border-white/5">K-Factor</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-center text-[#8b949e] uppercase tracking-widest border-b border-white/5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {MATERIALS.map(m => (
                      <tr key={m.id} className={`hover:bg-white/5 transition-colors ${selectedMaterial.id === m.id ? "bg-emerald-500/5" : ""}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${m.id === "carbide" ? "bg-orange-500" : m.id === "titanium" ? "bg-purple-500" : m.id === "copper" ? "bg-orange-300" : "bg-zinc-400"}`} />
                            <span className="text-xs font-bold text-white">{m.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-[#c9d1d9]">{m.yieldStrength}</td>
                        <td className="px-6 py-4 text-xs font-mono text-[#c9d1d9]">{m.modulus}</td>
                        <td className="px-6 py-4 text-xs font-mono text-[#c9d1d9]">{m.thermalConductivity}</td>
                        <td className="px-6 py-4 text-xs font-mono text-[#c9d1d9]">{m.kFactor.toFixed(1)}</td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={(e) => {
                              setSelectedMaterial(m);
                              setIsTableOpen(false);
                            }}
                            className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-white hover:bg-emerald-500 hover:text-white transition-all uppercase tracking-widest"
                          >
                            Set Active
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e] flex items-center gap-2">
              <Thermometer size={14} className="text-red-500" />
              Real-Time Thermal Profile
            </h4>
            <div className="text-[10px] font-mono text-[#484f58]">AVG: {cuttingSpeed * 2.5} °C</div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#161b22" />
                <XAxis dataKey="time" stroke="#484f58" fontSize={10} hide />
                <YAxis stroke="#484f58" fontSize={10} domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="temp" stroke="#ef4444" fillOpacity={1} fill="url(#colorTemp)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e] flex items-center gap-2">
              <Activity size={14} className="text-blue-500" />
              Dynamic Stress History (FEA)
            </h4>
            <div className="text-[10px] font-mono text-[#484f58]">LIMIT: {selectedMaterial.yieldStrength} MPa</div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#161b22" />
                <XAxis dataKey="time" stroke="#484f58" fontSize={10} hide />
                <YAxis stroke="#484f58" fontSize={10} domain={[0, Math.max(1000, currentStress + 200)]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', fontSize: '10px' }}
                />
                <Line type="monotone" dataKey="stress" stroke="#3b82f6" strokeWidth={3} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Production Workspace / 3D Visualization Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 relative group">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Box size={16} className="text-emerald-500" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Digital Machine Interface</h4>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={saveConfig}
                disabled={isSaving}
                className="text-[10px] font-bold text-blue-400/50 hover:text-blue-400 transition-colors flex items-center gap-1 bg-blue-500/5 px-2 py-1 rounded border border-blue-500/10 disabled:opacity-50"
              >
                <Save size={12} />
                {isSaving ? "Saving..." : "Save State"}
              </button>
              <button 
                onClick={handleReset}
                className="text-[10px] font-bold text-white/50 hover:text-white transition-colors flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/10"
              >
                <RotateCw size={12} />
                Reset Engine
              </button>
            </div>
          </div>

          <div className="aspect-video w-full rounded-xl bg-black border border-[#30363d] overflow-hidden relative flex items-center justify-center">
             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
             
             <AnimatePresence>
               {isFailing && isSimulating && (
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="absolute inset-0 bg-red-500/10 z-10 pointer-events-none flex flex-col items-center justify-center border-2 border-red-500/50 rounded-xl"
                 >
                   <ShieldAlert size={48} className="text-red-500 mb-2 animate-bounce" />
                   <p className="text-sm font-black text-red-500 tracking-tighter">STRUCTURAL FAILURE</p>
                 </motion.div>
               )}
             </AnimatePresence>

             {/* Simple Visualization of Machine Head */}
             <div className="relative w-full h-full flex items-center justify-center">
                <motion.div 
                  animate={{ 
                    x: isSimulating ? [-50, 50, -50] : 0,
                    y: isSimulating ? [-20, 20, -20] : 0,
                  }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-24 bg-[#30363d] border border-white/20 rounded-b-lg relative z-20"
                >
                  {/* Tool Stress Heatmap */}
                  <div 
                    className="absolute inset-x-0 bottom-0 top-1/2 transition-colors duration-300 rounded-b-lg opacity-40"
                    style={{ 
                      backgroundColor: isFailing && isSimulating ? "#ef4444" : "#10b981",
                      filter: `blur(${isSimulating ? 10 : 0}px)`
                    }}
                  />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-full bg-emerald-500/20 blur-sm animate-pulse" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-zinc-300" />
                </motion.div>
                
                <div 
                  className="w-1/2 h-4 rounded-lg translate-y-12 transition-colors duration-500" 
                  style={{ backgroundColor: selectedMaterial.id === "titanium" ? "#4c1d95" : selectedMaterial.id === "aluminum" ? "#4b5563" : "#1f2937" }}
                />
                
                {isSimulating && (
                  <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ opacity: 0, y: 100, x: (i - 2) * 20 }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1 h-1 bg-yellow-500 rounded-full"
                      />
                    ))}
                  </div>
                )}
             </div>

             <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-30">
                <div className="flex gap-2">
                   <div className="px-2 py-1 bg-black/80 rounded border border-white/10 text-[9px] font-mono text-[#8b949e]">
                     X: {isSimulating ? (Math.random() * 100).toFixed(2) : "0.00"}
                   </div>
                   <div className="px-2 py-1 bg-black/80 rounded border border-white/10 text-[9px] font-mono text-[#8b949e]">
                     Y: {isSimulating ? (Math.random() * 100).toFixed(2) : "0.00"}
                   </div>
                </div>
                <button 
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`px-6 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${isSimulating ? "bg-red-500 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)]" : "bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.4)]"} text-white`}
                >
                  {isSimulating ? "Stop Production" : "Start Production"}
                </button>
             </div>
          </div>
        </div>

        {/* Video Resources */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Play size={16} className="text-emerald-500" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Mechanical Masterclass</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a href="https://youtu.be/kDJ3QzTCgXM" target="_blank" className="bg-[#0b0e14] border border-[#30363d] rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all group">
              <div className="aspect-video bg-[#161b22] relative flex items-center justify-center">
                <Play size={24} className="text-white/20 group-hover:text-emerald-500 group-hover:scale-125 transition-all" />
              </div>
              <div className="p-3">
                <div className="text-[10px] font-bold text-white mb-1">CNC Machining Process</div>
                <div className="text-[8px] text-[#484f58] uppercase">Technical Guide</div>
              </div>
            </a>
            <a href="https://youtu.be/Lu76Ua2AR4w" target="_blank" className="bg-[#0b0e14] border border-[#30363d] rounded-xl overflow-hidden hover:border-blue-500/50 transition-all group">
              <div className="aspect-video bg-[#161b22] relative flex items-center justify-center">
                <Play size={24} className="text-white/20 group-hover:text-blue-500 group-hover:scale-125 transition-all" />
              </div>
              <div className="p-3">
                <div className="text-[10px] font-bold text-white mb-1">Mechanical Fundamentals</div>
                <div className="text-[8px] text-[#484f58] uppercase">Basics & Physics</div>
              </div>
            </a>
            <a href="https://youtu.be/m9pQvF6N7zM" target="_blank" className="bg-[#0b0e14] border border-[#30363d] rounded-xl overflow-hidden hover:border-orange-500/50 transition-all group">
              <div className="aspect-video bg-[#161b22] relative flex items-center justify-center">
                <Play size={24} className="text-white/20 group-hover:text-orange-500 group-hover:scale-125 transition-all" />
              </div>
              <div className="p-3">
                <div className="text-[10px] font-bold text-white mb-1">Tool Life Mastery</div>
                <div className="text-[8px] text-[#484f58] uppercase">Taylor's Equations</div>
              </div>
            </a>
          </div>

          <div className="p-6 bg-[#161b22] border border-[#30363d] rounded-2xl">
             <h5 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">Thermodynamics Briefing</h5>
             <div className="flex gap-4">
                <div className="w-20 h-20 rounded-xl bg-black border border-white/5 flex items-center justify-center shrink-0">
                  <Thermometer size={32} className="text-red-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-[#8b949e] leading-relaxed">
                    Analyzing energy transfer and state changes in high-speed machining environments. AI sync enabled for real-time heat dissipation modeling.
                  </p>
                  <button className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                    Launch Thermal Solver →
                  </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
