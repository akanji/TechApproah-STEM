import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Box, Info, ChevronDown, ChevronUp, Scale, Settings2, BarChart2, Zap } from "lucide-react";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useUser } from "./UserContext";
import { db, auth, handleFirestoreError, OperationType } from "../lib/firebase";
import { Save, RefreshCcw } from "lucide-react";

interface PhysicsLabProps {
  onComplete?: () => void;
}

type UnitSystem = "metric" | "imperial";

export function PhysicsLab({ onComplete }: PhysicsLabProps) {
  const [mass, setMass] = useState(5);
  const [force, setForce] = useState(20);
  const [friction, setFriction] = useState(0.1);
  const [drag, setDrag] = useState(0); // Air Resistance
  const [gravityType, setGravityType] = useState<"earth" | "moon" | "mars" | "zero">("earth");
  const [velocity, setVelocity] = useState(0);
  const [position, setPosition] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  const [showTheory, setShowTheory] = useState(false);
  const [graphData, setGraphData] = useState<{force: number, velocity: number}[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { theme, setTheme } = useUser();

  // Persistence: Load
  useEffect(() => {
    const loadConfig = async () => {
      if (!auth.currentUser) return;
      try {
        const docRef = doc(db, "users", auth.currentUser.uid, "labConfigs", "physics");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setMass(data.mass ?? 5);
          setForce(data.force ?? 20);
          setFriction(data.friction ?? 0.1);
          setDrag(data.drag ?? 0);
          setGravityType(data.gravityType ?? "earth");
          setUnitSystem(data.unitSystem ?? "metric");
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, "labConfigs/physics");
      }
    };
    loadConfig();
  }, []);

  // Persistence: Save
  const saveConfig = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    try {
      const docRef = doc(db, "users", auth.currentUser.uid, "labConfigs", "physics");
      await setDoc(docRef, {
        mass,
        force,
        friction,
        drag,
        gravityType,
        unitSystem,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "labConfigs/physics");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Constants
  const GRAVITY_MAP = { earth: 9.81, moon: 1.62, mars: 3.71, zero: 0 };
  const baseG = GRAVITY_MAP[gravityType];
  const gravity = unitSystem === "metric" ? baseG : baseG * 3.2808;
  
  const netForce = Math.max(0, force - friction * mass * baseG - drag * velocity * velocity);
  const accel = netForce / mass;
  
  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();

    const tick = (time: number) => {
      if (!isSimulating) return;
      
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const fFriction = friction * mass * baseG;
      const fDrag = drag * velocity * velocity;
      const fNet = Math.max(0, force - fFriction - fDrag);
      const a = fNet / mass;
      
      const newVelocity = velocity + a * dt;
      setVelocity(newVelocity);
      setPosition(p => (p + newVelocity * dt) % 100);

      // Collect data point every ~100ms or so for graph
      if (Math.round(time) % 10 === 0) {
        setGraphData(prev => {
          const newData = [...prev, { force, velocity: newVelocity }];
          return newData.slice(-50); // Keep last 50 points
        });
      }

      frameId = requestAnimationFrame(tick);
    };

    if (isSimulating) {
      frameId = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(frameId);
  }, [isSimulating, force, mass, friction, drag, velocity, baseG]);

  const reset = () => {
    setVelocity(0);
    setPosition(0);
    setIsSimulating(false);
    setGraphData([]);
  };

  const convertValue = (val: number, type: "force" | "mass" | "velocity" | "accel") => {
    if (unitSystem === "metric") return val;
    switch (type) {
      case "force": return val * 0.2248; // N to lbf
      case "mass": return val * 2.2046; // kg to lb (mass)
      case "velocity": return val * 3.2808; // m/s to ft/s
      case "accel": return val * 3.2808; // m/s2 to ft/s2
      default: return val;
    }
  };

  const unitLabels = {
    force: unitSystem === "metric" ? "N" : "lbf",
    mass: unitSystem === "metric" ? "kg" : "lb",
    velocity: unitSystem === "metric" ? "m/s" : "ft/s",
    accel: unitSystem === "metric" ? "m/s²" : "ft/s²",
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Module Header */}
      <div className="flex justify-between items-center bg-[#161b22] border border-[#30363d] px-6 py-3 rounded-2xl">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Physics Dynamics Lab</span>
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

      {/* Header with Unit Toggle */}
      <div className="flex justify-between items-center bg-[#161b22] border border-[#30363d] p-3 rounded-xl shadow-lg">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Settings2 size={16} className="text-blue-400" />
          <span>Simulation Controls</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={saveConfig}
            disabled={isSaving}
            className="flex items-center gap-2 px-3 py-1 bg-[#21262d] border border-[#30363d] rounded-lg text-xs font-bold text-[#8b949e] hover:text-white transition-all disabled:opacity-50"
          >
            {isSaving ? <RefreshCcw size={12} className="animate-spin" /> : <Save size={12} />}
            {isSaving ? "Saving..." : "Save State"}
          </button>
          <button 
            onClick={() => setUnitSystem(u => u === "metric" ? "imperial" : "metric")}
            className="flex items-center gap-2 px-3 py-1 bg-[#21262d] border border-[#30363d] rounded-lg text-xs font-bold text-[#8b949e] hover:text-white transition-all"
          >
          <Scale size={14} />
          {unitSystem === "metric" ? "Metric (SI)" : "Imperial"}
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Controls */}
        <div className="space-y-4 col-span-1">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            <div className="text-[10px] uppercase font-bold text-blue-400 mb-2">Mass ({unitLabels.mass})</div>
            <div className="text-2xl font-mono text-white mb-2">{convertValue(mass, "mass").toFixed(1)}</div>
            <input type="range" min="1" max="20" step="0.5" value={mass} onChange={(e) => { setMass(Number(e.target.value)); reset(); }} className="w-full accent-blue-500 bg-[#30363d] h-1.5 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            <div className="text-[10px] uppercase font-bold text-orange-400 mb-2">Applied Force ({unitLabels.force})</div>
            <div className="text-2xl font-mono text-white mb-2">{convertValue(force, "force").toFixed(1)}</div>
            <input type="range" min="0" max="100" value={force} onChange={(e) => setForce(Number(e.target.value))} className="w-full accent-orange-500 bg-[#30363d] h-1.5 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            <div className="text-[10px] uppercase font-bold text-yellow-400 mb-2">Friction Coeff (μ)</div>
            <div className="text-2xl font-mono text-white mb-2">{friction.toFixed(2)}</div>
            <input type="range" min="0" max="1" step="0.01" value={friction} onChange={(e) => setFriction(Number(e.target.value))} className="w-full accent-yellow-500 bg-[#30363d] h-1.5 rounded-lg appearance-none cursor-pointer" />
            <div className="text-[9px] text-[#8b949e] mt-1">Simulates kinetic friction.</div>
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            <div className="text-[10px] uppercase font-bold text-emerald-400 mb-2">Air Resistance (Drag)</div>
            <div className="text-2xl font-mono text-white mb-2">{drag.toFixed(3)}</div>
            <input type="range" min="0" max="0.1" step="0.005" value={drag} onChange={(e) => setDrag(Number(e.target.value))} className="w-full accent-emerald-500 bg-[#30363d] h-1.5 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            <div className="text-[10px] uppercase font-bold text-purple-400 mb-2">Gravity Presets</div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {(['earth', 'moon', 'mars', 'zero'] as const).map(g => (
                <button 
                  key={g}
                  onClick={() => setGravityType(g)}
                  className={`py-1.5 text-[8px] font-bold uppercase rounded border transition-all ${gravityType === g ? "bg-purple-500/20 text-purple-400 border-purple-500/30" : "bg-[#0d162d] text-[#484f58] border-[#30363d]"}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visualization & Graph */}
        <div className="md:col-span-2 space-y-4">
          {/* Main Visualizer */}
          <div className="relative h-24 bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden flex items-center px-2">
            <div className="absolute inset-0 opacity-10 flex justify-between px-1">
              {[...Array(20)].map((_, i) => <div key={i} className="w-px h-full bg-white" />)}
            </div>
            
            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#21262d]" />

            <motion.div 
              style={{ x: `${position}%` }}
              className="w-14 h-14 bg-blue-500 rounded-lg flex flex-col items-center justify-center text-white border-2 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] z-10"
            >
              <Box size={24} />
              <span className="text-[9px] font-bold mt-0.5">{convertValue(mass, "mass").toFixed(0)}{unitLabels.mass}</span>
            </motion.div>

            {/* Force Vector */}
            <motion.div 
               style={{ x: `${position}%` }}
               animate={{ width: isSimulating ? (force * 1.5) : 0 }}
               className="h-1 bg-orange-500 absolute ml-16 origin-left transition-none"
            >
              <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-orange-500 rotate-45" />
            </motion.div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-3 text-center">
              <div className="text-[9px] uppercase font-bold text-[#8b949e] mb-1">Net Accel</div>
              <div className="text-lg font-mono text-green-400 font-bold">{convertValue(accel, "accel").toFixed(2)}<span className="text-[10px] ml-0.5">{unitLabels.accel}</span></div>
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-3 text-center">
              <div className="text-[9px] uppercase font-bold text-[#8b949e] mb-1">Velocity</div>
              <div className="text-lg font-mono text-blue-400 font-bold">{convertValue(velocity, "velocity").toFixed(1)}<span className="text-[10px] ml-0.5">{unitLabels.velocity}</span></div>
            </div>
            <div className="flex flex-col gap-1">
              <button 
                onClick={() => setIsSimulating(!isSimulating)}
                className={`flex-1 rounded-xl font-bold text-xs transition-all ${isSimulating ? "bg-red-500/10 text-red-500 border border-red-500/30" : "bg-green-600 hover:bg-green-500 text-white shadow-lg"}`}
              >
                {isSimulating ? "Pause" : "Start Simulation"}
              </button>
              <button onClick={reset} className="py-1 text-[9px] uppercase font-bold text-[#484f58] hover:text-[#8b949e] border border-[#30363d] rounded-lg">Reset</button>
            </div>
          </div>

          {/* Force-Velocity Scatter Plot */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 h-48">
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 size={14} className="text-purple-400" />
              <span className="text-[10px] uppercase font-bold text-[#8b949e]">Force-Velocity Dynamics</span>
            </div>
            <ResponsiveContainer width="100%" height="90%">
              <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis 
                  type="number" 
                  dataKey="force" 
                  name="Force" 
                  unit={unitLabels.force} 
                  stroke="#8b949e" 
                  fontSize={10}
                />
                <YAxis 
                  type="number" 
                  dataKey="velocity" 
                  name="Velocity" 
                  unit={unitLabels.velocity} 
                  stroke="#8b949e" 
                  fontSize={10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0d1117", borderColor: "#30363d", fontSize: "10px" }}
                  itemStyle={{ color: "#e6edf3" }}
                />
                <Scatter name="Points" data={graphData} fill="#8b5cf6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Theory Explanation */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
        <button 
          onClick={() => setShowTheory(!showTheory)}
          className="w-full p-4 flex items-center justify-between text-[#8b949e] hover:text-white transition-all"
        >
          <div className="flex items-center gap-2">
            <Info size={18} className="text-blue-400" />
            <span className="font-bold text-sm">Theory: Newton's Second Law & Friction</span>
          </div>
          {showTheory ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        <AnimatePresence>
          {showTheory && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4 border-t border-[#30363d] space-y-3"
            >
              <div className="mt-4 text-[#8b949e] text-xs leading-relaxed space-y-2">
                <p>
                  <strong className="text-white">Newton's Second Law (F = ma):</strong> The acceleration of an object as produced by a net force is directly proportional to the magnitude of the net force, in the same direction as the net force, and inversely proportional to the mass of the object.
                </p>
                <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] font-mono text-center">
                  <span className="text-orange-400">F<sub>net</sub></span> = <span className="text-blue-400">m</span> × <span className="text-green-400">a</span>
                </div>
                <p>
                  <strong className="text-white">Applied Friction:</strong> In this lab, we introduce a kinetic friction force F_f = μ · m · g. The net force F_net becomes F_applied - F_f. Acceleration only occurs when the applied force exceeds the friction limit.
                </p>
                <p>
                  <strong className="text-white">Wait, why the graph?</strong> The scatter plot visualizes the relationship between the force you apply and the resulting instantaneous velocity of the object. Over time, higher forces lead to steeper curves in velocity gain.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
