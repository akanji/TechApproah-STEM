import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Waves, 
  Wind, 
  Settings2, 
  Zap, 
  Activity, 
  Thermometer, 
  Gauge,
  Droplets,
  RotateCcw,
  Save,
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { useUser } from "./UserContext";
import { db, auth, handleFirestoreError, OperationType } from "../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const LIQUIDS = [
  { id: "water", name: "Pure Water", density: 1000, viscosity: 0.001, color: "text-blue-400" },
  { id: "oil", name: "SAE 30 Oil", density: 890, viscosity: 0.25, color: "text-yellow-600" },
  { id: "mercury", name: "Mercury", density: 13546, viscosity: 0.0015, color: "text-zinc-400" },
  { id: "honey", name: "Honey", density: 1420, viscosity: 10, color: "text-orange-500" }
];

export function FluidDynamicsLab() {
  const [inletVelocity, setInletVelocity] = useState(2.0); // m/s
  const [pipeDiameter, setPipeDiameter] = useState(100); // mm
  const [pipeLength, setPipeLength] = useState(10); // m
  const [selectedLiquid, setSelectedLiquid] = useState(LIQUIDS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showTheory, setShowTheory] = useState(false);
  const [history, setHistory] = useState<{ time: number; pressure: number }[]>([]);
  const { theme, setTheme } = useUser();

  // Bernoulli + Darcy-Weisbach Logic
  const area = Math.PI * Math.pow(pipeDiameter / 2000, 2);
  const flowRate = inletVelocity * area * 3600; // m3/h
  
  const reynoldsNumber = (selectedLiquid.density * inletVelocity * (pipeDiameter / 1000)) / selectedLiquid.viscosity;
  const flowType = reynoldsNumber < 2300 ? "Laminar" : reynoldsNumber < 4000 ? "Transitional" : "Turbulent";
  
  // Friction factor f (simplified Swamee-Jain)
  const f = reynoldsNumber < 2300 ? 64 / reynoldsNumber : 0.3164 / Math.pow(reynoldsNumber, 0.25);
  const headLoss = f * (pipeLength / (pipeDiameter / 1000)) * (Math.pow(inletVelocity, 2) / (2 * 9.81));
  const pressureDrop = headLoss * selectedLiquid.density * 9.81 / 1000; // kPa

  // Persistence: Load
  useEffect(() => {
    const loadConfig = async () => {
      if (!auth.currentUser) return;
      try {
        const docRef = doc(db, "users", auth.currentUser.uid, "labConfigs", "fluid");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setInletVelocity(data.inletVelocity ?? 2.0);
          setPipeDiameter(data.pipeDiameter ?? 100);
          const liq = LIQUIDS.find(l => l.id === data.liquidId);
          if (liq) setSelectedLiquid(liq);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, "labConfigs/fluid");
      }
    };
    loadConfig();
  }, []);

  const saveConfig = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    try {
      const docRef = doc(db, "users", auth.currentUser.uid, "labConfigs", "fluid");
      await setDoc(docRef, {
        inletVelocity,
        pipeDiameter,
        liquidId: selectedLiquid.id,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "labConfigs/fluid");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating) {
      interval = setInterval(() => {
        setHistory(prev => {
          const nextTime = prev.length;
          const fluctuation = (Math.random() - 0.5) * (pressureDrop * 0.05);
          const newEntry = { time: nextTime, pressure: pressureDrop + fluctuation };
          return [...prev, newEntry].slice(-30);
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isSimulating, pressureDrop]);

  const reset = () => {
    setInletVelocity(2.0);
    setPipeDiameter(100);
    setHistory([]);
    setIsSimulating(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Module Header */}
      <div className="flex justify-between items-center bg-[#161b22] border border-[#30363d] px-6 py-3 rounded-2xl shadow-xl">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Fluid Dynamics Prototyper</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-[#484f58] uppercase">Subsurface Theme:</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6 text-cyan-400">
              <Settings2 size={16} />
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#8b949e]">Flow Parameters</span>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-[#8b949e]">Velocity (v)</span>
                  <span className="text-white">{inletVelocity.toFixed(1)} m/s</span>
                </div>
                <input type="range" min="0.1" max="10" step="0.1" value={inletVelocity} onChange={(e) => setInletVelocity(Number(e.target.value))} className="w-full accent-cyan-500 bg-[#30363d] h-1.5 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-[#8b949e]">Diameter (D)</span>
                  <span className="text-white">{pipeDiameter} mm</span>
                </div>
                <input type="range" min="10" max="500" step="10" value={pipeDiameter} onChange={(e) => setPipeDiameter(Number(e.target.value))} className="w-full accent-blue-500 bg-[#30363d] h-1.5 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-[#8b949e]">Fluid Selection</span>
                  <span className={selectedLiquid.color}>{selectedLiquid.density} kg/m³</span>
                </div>
                <select 
                  value={selectedLiquid.id}
                  onChange={(e) => {
                    const liq = LIQUIDS.find(l => l.id === e.target.value);
                    if (liq) setSelectedLiquid(liq);
                  }}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-500/50"
                >
                  {LIQUIDS.map(liq => (
                    <option key={liq.id} value={liq.id}>{liq.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-8">
              <button 
                onClick={() => setIsSimulating(!isSimulating)}
                className={`py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${isSimulating ? "bg-red-500/10 text-red-500 border border-red-500/30" : "bg-cyan-600 text-white shadow-lg shadow-cyan-900/20 hover:bg-cyan-500"}`}
              >
                {isSimulating ? "Cut Flow" : "Inject Flow"}
              </button>
              <button onClick={reset} className="py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest bg-white/5 text-[#8b949e] border border-white/5 hover:text-white">Reset</button>
            </div>
            
            <button 
              onClick={saveConfig}
              disabled={isSaving}
              className="w-full mt-2 py-2 rounded-xl font-bold text-[9px] uppercase tracking-widest bg-blue-500/5 text-blue-400 border border-blue-500/10 hover:bg-blue-500/10 transition-all flex items-center justify-center gap-2"
            >
              <Save size={12} /> {isSaving ? "Syncing..." : "Commit State"}
            </button>
          </div>
        </div>

        {/* Visualization & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                 <Droplets className="text-cyan-400" size={18} />
                 <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Laminar-Turbulent Visualizer</h4>
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${flowType === "Turbulent" ? "bg-red-500/10 text-red-400 border border-red-400/20" : "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20"}`}>
                {flowType} Regime
              </div>
            </div>

            {/* Pipe Visualization */}
            <div className="relative h-20 bg-black/40 rounded-lg border border-white/5 flex items-center px-4 overflow-hidden">
               <motion.div 
                 animate={{ 
                   x: isSimulating ? [0, 40, 0] : 0,
                   opacity: isSimulating ? 1 : 0.2
                 }}
                 transition={{ duration: 1 / Math.max(0.1, inletVelocity), repeat: Infinity, ease: "linear" }}
                 className="flex gap-4"
               >
                 {[...Array(15)].map((_, i) => (
                   <div key={i} className={`w-8 h-1 rounded-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent`} />
                 ))}
               </motion.div>
               
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-[40px] font-black italic opacity-5 text-white tracking-widest uppercase">
                   RE = {Math.round(reynoldsNumber)}
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                 <div className="text-[9px] uppercase font-bold text-[#484f58] mb-1">Flow Rate</div>
                 <div className="text-lg font-mono font-bold text-white">{flowRate.toFixed(1)}<span className="text-[10px] ml-1">m³/h</span></div>
              </div>
              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                 <div className="text-[9px] uppercase font-bold text-[#484f58] mb-1">Head Loss</div>
                 <div className="text-lg font-mono font-bold text-orange-400">{headLoss.toFixed(2)}<span className="text-[10px] ml-1">m</span></div>
              </div>
              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                 <div className="text-[9px] uppercase font-bold text-[#484f58] mb-1">Press. Drop</div>
                 <div className="text-lg font-mono font-bold text-red-400">{pressureDrop.toFixed(2)}<span className="text-[10px] ml-1">kPa</span></div>
              </div>
              <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-center flex flex-col items-center justify-center">
                 <Gauge className="text-cyan-400 mb-1" size={14} />
                 <div className="text-[8px] uppercase font-black text-cyan-400 tracking-tighter">Sensor Online</div>
              </div>
            </div>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
               <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e] flex items-center gap-2">
                 <Activity size={14} className="text-blue-500" />
                 Delta-P Temporal Stream
               </h4>
               <div className="text-[9px] font-mono text-[#484f58]">UNITS: KPA / SEC</div>
            </div>
            <div className="h-48 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={history}>
                    <defs>
                      <linearGradient id="colorPress" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#30363d55" />
                    <XAxis hide dataKey="time" />
                    <YAxis stroke="#484f58" fontSize={9} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', fontSize: '10px' }}
                    />
                    <Area type="monotone" dataKey="pressure" stroke="#06b6d4" fillOpacity={1} fill="url(#colorPress)" isAnimationActive={false} />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Theory Explanation */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-lg">
        <button 
          onClick={() => setShowTheory(!showTheory)}
          className="w-full p-4 flex items-center justify-between text-[#8b949e] hover:text-white transition-all bg-[#161b22]"
        >
          <div className="flex items-center gap-2">
            <Info size={18} className="text-cyan-400" />
            <span className="font-bold text-sm">Governing Equations: Reynolds & Darcy</span>
          </div>
          {showTheory ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        <AnimatePresence>
          {showTheory && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-6 pb-6 border-t border-[#30363d] space-y-3"
            >
              <div className="mt-6 text-[#8b949e] text-xs leading-relaxed space-y-4">
                <p>
                  <strong className="text-white">Reynolds Number (Re):</strong> A dimensionless quantity used to help predict flow patterns in different fluid flow situations. At low Reynolds numbers, flows tend to be dominated by laminar (sheet-like) flow, while at high Reynolds numbers flows tend to be turbulent.
                </p>
                <div className="p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-center">
                  Re = (ρ · v · D) / μ
                </div>
                <p>
                  <strong className="text-white">Darcy-Weisbach Equation:</strong> Relates the head loss, or pressure loss, due to friction along a given length of pipe to the average velocity of the fluid flow for an incompressible fluid.
                </p>
                <div className="p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-center space-y-2">
                   <div>h_L = f · (L/D) · (v² / 2g)</div>
                   <div className="text-[10px] text-cyan-400/60 mt-2">f ≈ 0.3164 / Re^0.25 (Blasius relation)</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
