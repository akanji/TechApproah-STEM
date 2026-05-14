import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Flame, 
  Thermometer, 
  Wind, 
  Settings, 
  Activity, 
  Save, 
  Info,
  Waves,
  Cpu
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
import { useUser } from "./UserContext";
import { db, auth, handleFirestoreError, OperationType } from "../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

interface Material {
  id: string;
  name: string;
  thermalConductivity: number; // W/(m·K)
  color: string;
}

const THERMAL_MATERIALS: Material[] = [
  { id: "copper", name: "Copper", thermalConductivity: 401, color: "text-orange-400" },
  { id: "aluminum", name: "Aluminum", thermalConductivity: 237, color: "text-blue-200" },
  { id: "steel", name: "Structural Steel", thermalConductivity: 50, color: "text-blue-400" },
  { id: "poly", name: "Polyethylene", thermalConductivity: 0.33, color: "text-emerald-400" }
];

export function ThermodynamicsLab() {
  const [tHot, setTHot] = useState(100); // °C
  const [tCold, setTCold] = useState(25); // °C
  const [thickness, setThickness] = useState(0.05); // m
  const [area, setArea] = useState(0.1); // m^2
  const [selectedMaterial, setSelectedMaterial] = useState(THERMAL_MATERIALS[0]);
  const [history, setHistory] = useState<{ time: number, heatFlux: number, tempGradient: number }[]>([]);
  const [simulationActive, setSimulationActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { theme, setTheme } = useUser();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fourier's Law of Heat Conduction: q = -k * A * (dT / dx)
  const tempDiff = tHot - tCold;
  const heatFlux = (selectedMaterial.thermalConductivity * area * tempDiff) / thickness;
  const thermalResistance = thickness / (selectedMaterial.thermalConductivity * area);

  useEffect(() => {
    const loadConfig = async () => {
      if (!auth.currentUser) return;
      try {
        const docRef = doc(db, "users", auth.currentUser.uid, "labConfigs", "thermo");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTHot(data.tHot ?? 100);
          setTCold(data.tCold ?? 25);
          setThickness(data.thickness ?? 0.05);
          setArea(data.area ?? 0.1);
          const mat = THERMAL_MATERIALS.find(m => m.id === data.materialId);
          if (mat) setSelectedMaterial(mat);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, "labConfigs/thermo");
      }
    };
    loadConfig();
  }, []);

  const saveConfig = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    try {
      const docRef = doc(db, "users", auth.currentUser.uid, "labConfigs", "thermo");
      await setDoc(docRef, {
        tHot,
        tCold,
        thickness,
        area,
        materialId: selectedMaterial.id,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "labConfigs/thermo");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (simulationActive) {
      timerRef.current = setInterval(() => {
        setHistory(prev => {
          const noise = (Math.random() - 0.5) * (heatFlux * 0.02);
          const next = [...prev, { 
            time: prev.length, 
            heatFlux: heatFlux + noise,
            tempGradient: tempDiff / thickness 
          }];
          return next.slice(-30);
        });
      }, 500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [simulationActive, heatFlux, tempDiff, thickness]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#161b22] border border-[#30363d] px-6 py-3 rounded-2xl">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Thermodynamics Lab Engine</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-[#484f58] uppercase">Active Theme:</span>
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
        {/* Main Display */}
        <div className="lg:col-span-2 bg-[#161b22] border border-[#30363d] rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Flame size={120} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Thermometer size={18} className="text-orange-500" />
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#8b949e]">Fourier Conduction Analyzer</h2>
            </div>

            <div className="flex items-baseline gap-4 mb-8">
              <div className="text-6xl font-mono text-white font-black tracking-tighter">
                {heatFlux > 1000 ? (heatFlux/1000).toFixed(2) : heatFlux.toFixed(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-orange-400 font-bold font-mono">{heatFlux > 1000 ? "kW" : "W"}</span>
                <span className="text-[10px] text-[#484f58] uppercase font-bold tracking-widest">Heat Transfer Rate (q)</span>
              </div>
            </div>

            {/* Visualizer */}
            <div className="h-48 bg-black/40 rounded-2xl border border-white/5 relative flex items-center justify-center p-6 mb-8">
               <div className="absolute inset-0 flex justify-center items-center">
                 <div className="w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-blue-500 opacity-20" />
               </div>
               
               <div className="flex items-center gap-4 relative z-10">
                 {/* Hot Side */}
                 <div className="flex flex-col items-center">
                   <div className="w-16 h-24 bg-red-900/40 border border-red-500/30 rounded-xl flex items-center justify-center relative overflow-hidden">
                     <motion.div 
                       animate={{ y: [-10, 10] }}
                       transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                       className="absolute inset-0 bg-red-500/10 blur-xl"
                     />
                     <span className="text-xs font-mono font-bold text-red-400">{tHot}°C</span>
                   </div>
                   <span className="text-[8px] font-bold text-red-500/60 uppercase mt-2">Source (T_h)</span>
                 </div>

                 {/* Material Barrier */}
                 <div className="relative">
                   <motion.div 
                     style={{ width: thickness * 1000 }}
                     className="h-24 bg-[#30363d] border border-white/10 rounded-sm flex items-center justify-center relative overflow-hidden"
                   >
                     <div className="absolute inset-0 flex flex-col justify-around py-4">
                       {[...Array(3)].map((_, i) => (
                         <motion.div 
                           key={i}
                           animate={{ x: [-20, 20] }}
                           transition={{ duration: 1 / selectedMaterial.thermalConductivity * 100, repeat: Infinity }}
                           className="w-full h-px bg-white/10"
                         />
                       ))}
                     </div>
                   </motion.div>
                   <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-mono text-[#484f58] uppercase whitespace-nowrap">
                     {selectedMaterial.name} ({thickness}m)
                   </div>
                 </div>

                 {/* Cold Side */}
                 <div className="flex flex-col items-center">
                   <div className="w-16 h-24 bg-blue-900/40 border border-blue-500/30 rounded-xl flex items-center justify-center">
                     <span className="text-xs font-mono font-bold text-blue-400">{tCold}°C</span>
                   </div>
                   <span className="text-[8px] font-bold text-blue-500/60 uppercase mt-2">Sink (T_c)</span>
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/40 border border-[#30363d] p-4 rounded-xl">
                <div className="text-[9px] uppercase font-bold text-[#8b949e] mb-1">ΔT Gradient</div>
                <div className="text-sm font-mono text-white font-bold">{(tempDiff/thickness).toFixed(0)} <span className="text-[10px]">K/m</span></div>
              </div>
              <div className="bg-black/40 border border-[#30363d] p-4 rounded-xl">
                <div className="text-[9px] uppercase font-bold text-[#8b949e] mb-1">Resistance (R_th)</div>
                <div className="text-sm font-mono text-emerald-400 font-bold">{thermalResistance.toFixed(3)} <span className="text-[10px]">K/W</span></div>
              </div>
              <div className="bg-black/40 border border-[#30363d] p-4 rounded-xl">
                <div className="text-[9px] uppercase font-bold text-[#8b949e] mb-1">Conductiviy (k)</div>
                <div className="text-sm font-mono text-blue-400 font-bold">{selectedMaterial.thermalConductivity}</div>
              </div>
              <div className="bg-black/40 border border-[#30363d] p-4 rounded-xl">
                <div className="text-[9px] uppercase font-bold text-[#8b949e] mb-1">Status</div>
                <div className={`text-[10px] font-bold uppercase tracking-tight ${heatFlux > 5000 ? "text-red-500" : "text-green-500"}`}>
                  {heatFlux > 5000 ? "HEAT OVERLOAD" : "Equilibrium"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Settings size={14} className="text-blue-400" />
              Thermal Parameters
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] uppercase font-bold text-[#8b949e]">
                  <span>Source Temp</span>
                  <span className="text-red-400">{tHot}°C</span>
                </div>
                <input type="range" min="30" max="500" step="1" value={tHot} onChange={(e) => setTHot(Number(e.target.value))} className="w-full accent-red-500 bg-[#30363d] h-1.5 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] uppercase font-bold text-[#8b949e]">
                  <span>Sink Temp</span>
                  <span className="text-blue-400">{tCold}°C</span>
                </div>
                <input type="range" min="-50" max="50" step="1" value={tCold} onChange={(e) => setTCold(Number(e.target.value))} className="w-full accent-blue-500 bg-[#30363d] h-1.5 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] uppercase font-bold text-[#8b949e]">
                  <span>Wall Thickness</span>
                  <span className="text-white">{thickness}m</span>
                </div>
                <input type="range" min="0.001" max="0.5" step="0.005" value={thickness} onChange={(e) => setThickness(Number(e.target.value))} className="w-full accent-emerald-500 bg-[#30363d] h-1.5 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] uppercase font-bold text-[#8b949e]">
                  <span>Material Selection</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {THERMAL_MATERIALS.map(m => (
                    <button 
                      key={m.id}
                      onClick={() => setSelectedMaterial(m)}
                      className={`p-2 rounded-xl border text-[9px] font-bold uppercase transition-all ${selectedMaterial.id === m.id ? "bg-white/5 border-blue-500 text-blue-400" : "bg-black/20 border-white/5 text-[#484f58]"}`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button 
                  onClick={() => setSimulationActive(!simulationActive)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${simulationActive ? "bg-red-500/10 text-red-500" : "bg-blue-600 text-white"}`}
                >
                  {simulationActive ? "Stop Simulation" : "Run Transient Solver"}
                </button>
                <button 
                  onClick={saveConfig}
                  disabled={isSaving}
                  className="p-3 bg-[#161b22] border border-[#30363d] rounded-xl text-[#8b949e] hover:text-white"
                >
                  <Save size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#0b0e14] border border-[#30363d] rounded-2xl p-6">
            <h4 className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity size={14} className="text-emerald-400" />
              Heat Flux Dynamics
            </h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="fluxGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                  <XAxis hide dataKey="time" />
                  <YAxis stroke="#484f58" fontSize={8} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0d1117", border: "1px solid #30363d" }} labelStyle={{ display: "none" }} />
                  <Area type="monotone" dataKey="heatFlux" stroke="#f97316" fillOpacity={1} fill="url(#fluxGradient)" strokeWidth={2} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
          <Info size={20} />
        </div>
        <div>
          <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Scientific Context: Conduction</h4>
          <p className="text-xs text-[#8b949e] leading-relaxed">
            Fourier's Law states that the rate of heat transfer through a material is proportional to the negative gradient in the temperature and to the area, at right angles to that gradient, through which the heat flows. In this simulation, we assume steady-state conduction through a plane wall.
          </p>
        </div>
      </div>
    </div>
  );
}
