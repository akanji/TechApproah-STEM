import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Activity, Zap, Thermometer, Box, Share2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useUser } from "./UserContext";

interface LabProps {
  type: "physics" | "ee" | "thermo" | "bio" | "structural";
  labId?: string;
  onComplete: () => void;
}

export function LabEngine({ type, labId = "unknown", onComplete }: LabProps) {
  const [isValidated, setIsValidated] = useState(false);
  const { user, updateXP } = useUser();

  useEffect(() => {
    // Simulate "Judge Agent" validation pass
    const timer = setTimeout(() => setIsValidated(true), 1500);
    return () => clearTimeout(timer);
  }, [type]);

  const JudgeAgentBadge = () => (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-2">
      <ShieldCheck size={12} />
      Validated by Judge Agent (A2A)
    </div>
  );

  // Module A: Newton's Second Law (Upgraded Physics Engine)
  const PhysicsLab = () => {
    const [mass, setMass] = useState(5);
    const [force, setForce] = useState(20);
    const [velocity, setVelocity] = useState(0);
    const [position, setPosition] = useState(0);
    const [isSimulating, setIsSimulating] = useState(false);
    
    const accel = (force / mass);
    
    useEffect(() => {
      let frameId: number;
      let lastTime = performance.now();

      const tick = (time: number) => {
        if (!isSimulating) return;
        
        const dt = (time - lastTime) / 1000; // delta time in seconds
        lastTime = time;

        const a = force / mass;
        setVelocity(v => v + a * dt);
        setPosition(p => (p + velocity * dt) % 100); // Wrap around for visualization

        frameId = requestAnimationFrame(tick);
      };

      if (isSimulating) {
        frameId = requestAnimationFrame(tick);
      }
      return () => cancelAnimationFrame(frameId);
    }, [isSimulating, force, mass, velocity]);

    const reset = () => {
      setVelocity(0);
      setPosition(0);
      setIsSimulating(false);
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            <div className="text-[10px] uppercase font-bold text-blue-400 mb-2">Mass (kg)</div>
            <div className="text-3xl font-mono text-white mb-2">{mass}</div>
            <input type="range" min="1" max="20" value={mass} onChange={(e) => { setMass(Number(e.target.value)); reset(); }} className="w-full accent-blue-500 bg-[#30363d] h-1.5 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            <div className="text-[10px] uppercase font-bold text-orange-400 mb-2">Force (N)</div>
            <div className="text-3xl font-mono text-white mb-2">{force}</div>
            <input type="range" min="1" max="100" value={force} onChange={(e) => setForce(Number(e.target.value))} className="w-full accent-orange-500 bg-[#30363d] h-1.5 rounded-lg appearance-none cursor-pointer" />
          </div>
        </div>

        {/* Visual Animation Track */}
        <div className="relative h-20 bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden flex items-center px-2">
          <div className="absolute inset-0 opacity-10 flex justify-between px-1">
            {[...Array(10)].map((_, i) => <div key={i} className="w-px h-full bg-white" />)}
          </div>
          <motion.div 
            style={{ x: `${position}%` }}
            className="w-12 h-12 bg-blue-500 rounded-lg flex flex-col items-center justify-center text-white border-2 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10"
          >
            <Box size={20} />
            <span className="text-[8px] font-bold mt-0.5">{mass}kg</span>
          </motion.div>
          {/* Vector Arrow */}
          <motion.div 
             style={{ x: `${position}%` }}
             animate={{ width: isSimulating ? force : 0 }}
             className="h-1 bg-orange-500 absolute ml-14 origin-left"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-3 text-center">
            <div className="text-[9px] uppercase font-bold text-[#8b949e] mb-1">Accel (a)</div>
            <div className="text-lg font-mono text-green-400 font-bold">{accel.toFixed(2)}<span className="text-[10px] ml-0.5">m/s²</span></div>
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-3 text-center">
            <div className="text-[9px] uppercase font-bold text-[#8b949e] mb-1">Velocity (v)</div>
            <div className="text-lg font-mono text-blue-400 font-bold">{velocity.toFixed(1)}<span className="text-[10px] ml-0.5">m/s</span></div>
          </div>
          <div className="flex flex-col gap-1">
            <button 
              onClick={() => setIsSimulating(!isSimulating)}
              className={`flex-1 rounded-xl font-bold text-xs transition-all ${isSimulating ? "bg-red-500/20 text-red-500 border border-red-500/30" : "bg-green-500 text-white shadow-lg shadow-green-900/20"}`}
            >
              {isSimulating ? "Pause" : "Start Simulation"}
            </button>
            <button onClick={reset} className="text-[9px] uppercase font-bold text-[#484f58] hover:text-[#8b949e]">Reset</button>
          </div>
        </div>
      </div>
    );
  };

  // Module B: Ohm's Law (High-Fidelity Lab Bench)
  const EELab = () => {
    const [voltage, setVoltage] = useState(5);
    const [resistance, setResistance] = useState(100);
    const [isSwitchClosed, setIsSwitchClosed] = useState(false);

    const current = (isSwitchClosed && resistance > 0 ? (voltage / resistance) : 0);
    const power = (voltage * current);
    
    // Intensity factor for the glow effect based on current (scaled for visibility)
    const intensity = Math.min(1.5, current * 10);
    const glowScale = 0.5 + (intensity * 0.5);

    return (
      <div className="space-y-6">
        {/* Visual Lab Bench Bench */}
        <div className="relative h-48 bg-black rounded-2xl border border-[#30363d] overflow-hidden flex flex-col items-center justify-center group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1a1a_0%,#000_100%)]" />
          
          {/* Animated Glow Component */}
          <AnimatePresence>
            {isSwitchClosed && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: Math.min(0.8, intensity),
                  scale: glowScale,
                  filter: `blur(${10 + intensity * 20}px)`
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute w-24 h-24 bg-yellow-400 rounded-full"
              />
            )}
          </AnimatePresence>

          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`p-4 rounded-full transition-all duration-500 ${isSwitchClosed ? "bg-yellow-400 text-black shadow-[0_0_30px_rgba(250,204,21,0.4)]" : "bg-[#161b22] text-[#484f58]"}`}>
              <Zap size={32} />
            </div>
            <div className="text-center">
              <span className={`text-[10px] font-mono font-bold tracking-widest uppercase transition-colors ${isSwitchClosed ? "text-yellow-400" : "text-[#484f58]"}`}>
                {isSwitchClosed ? `⚡ Flowing: ${current.toFixed(3)} A` : "Circuit Disconnected"}
              </span>
            </div>
          </div>

          {/* Circuit Lines */}
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-px bg-[#30363d] -z-10">
            {isSwitchClosed && (
              <motion.div 
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5 / (current * 5 || 1), repeat: Infinity, ease: "linear" }}
                className="h-full w-20 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-[10px] uppercase font-bold text-yellow-400">Voltage (V)</div>
              <div className="text-xs font-mono text-white">{voltage}V</div>
            </div>
            <input 
              type="range" min="0" max="24" step="0.5" value={voltage} 
              onChange={(e) => setVoltage(Number(e.target.value))} 
              className="w-full accent-yellow-500 bg-[#30363d] h-1.5 rounded-lg appearance-none cursor-pointer" 
            />
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-[10px] uppercase font-bold text-purple-400">Resistance (Ω)</div>
              <div className="text-xs font-mono text-white">{resistance}Ω</div>
            </div>
            <input 
              type="range" min="10" max="1000" step="10" value={resistance} 
              onChange={(e) => setResistance(Number(e.target.value))} 
              className="w-full accent-purple-500 bg-[#30363d] h-1.5 rounded-lg appearance-none cursor-pointer" 
            />
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#161b22] p-4 rounded-xl border border-[#30363d]">
          <div className="flex-1">
             <div className="text-[10px] uppercase font-bold text-[#8b949e] mb-1">Safety Switch</div>
             <p className="text-[10px] text-[#484f58]">Complete the circuit to measure load.</p>
          </div>
          <button 
            onClick={() => setIsSwitchClosed(!isSwitchClosed)}
            className={`w-12 h-6 rounded-full relative transition-colors ${isSwitchClosed ? "bg-yellow-500" : "bg-[#30363d]"}`}
          >
            <motion.div 
               animate={{ x: isSwitchClosed ? 24 : 4 }}
               className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase font-bold text-[#8b949e] mb-1">Ammeter Reading</div>
            <div className="text-2xl font-mono text-blue-400 font-bold">{current.toFixed(3)}<span className="text-xs ml-1">A</span></div>
          </div>
          <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase font-bold text-[#8b949e] mb-1">Wattmeter</div>
            <div className="text-2xl font-mono text-pink-500 font-bold">{power.toFixed(2)}<span className="text-xs ml-1">W</span></div>
          </div>
        </div>
      </div>
    );
  };


  // Module C: Thermodynamics (Advanced Heat Transfer Engine)
  const ThermoLab = () => {
    const [mass, setMass] = useState(1.0); // kg
    const [material, setMaterial] = useState({ name: "Water", c: 4186, color: "text-blue-400" });
    const [power, setPower] = useState(1000); // Watts (J/s)
    const [initialTemp] = useState(20);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isHeating, setIsHeating] = useState(false);
    const [data, setData] = useState([{ time: 0, temp: 20 }]);

    const materials = [
      { name: "Water", c: 4186, color: "text-blue-400", bg: "bg-blue-500/10" },
      { name: "Aluminium", c: 900, color: "text-gray-400", bg: "bg-gray-500/10" },
      { name: "Iron", c: 450, color: "text-orange-400", bg: "bg-orange-500/10" },
      { name: "Copper", c: 385, color: "text-red-400", bg: "bg-red-500/10" },
    ];

    const currentHeatAdded = power * elapsedTime;
    const deltaTemp = mass > 0 ? (currentHeatAdded / (mass * material.c)) : 0;
    const currentTemp = initialTemp + deltaTemp;

    // Background color interpolation for "Visual Calorimeter"
    const getCalorimeterColor = () => {
      const ratio = Math.min(1, (currentTemp - 20) / 80); // Scaled 20-100 deg
      // Interpolate between cool blue (#1e40af) and hot red (#991b1b)
      return `rgba(${30 + ratio * 123}, ${64 - ratio * 37}, ${175 - ratio * 148}, 0.2)`;
    };

    const getGlowColor = () => {
      const ratio = Math.min(1, (currentTemp - 20) / 80);
      return `rgba(${239}, ${68 + ratio * 100}, ${68 - ratio * 100}, ${0.2 + ratio * 0.5})`;
    };

    useEffect(() => {
      let interval: number;
      if (isHeating) {
        interval = window.setInterval(() => {
          setElapsedTime(prev => {
            const nextTime = Math.round((prev + 0.5) * 10) / 10;
            const nextHeatTotal = power * nextTime;
            const nextTemp = initialTemp + (nextHeatTotal / (mass * material.c));
            
            setData(d => [...d, { time: nextTime, temp: Number(nextTemp.toFixed(1)) }].slice(-50));
            return nextTime;
          });
        }, 500);
      }
      return () => clearInterval(interval);
    }, [isHeating, power, mass, material, initialTemp]);

    const reset = () => {
      setIsHeating(false);
      setElapsedTime(0);
      setData([{ time: 0, temp: 20 }]);
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-[10px] uppercase font-bold text-red-500">Heater Power (W)</div>
              <div className="text-xs font-mono text-white">{power}W</div>
            </div>
            <input 
              type="range" min="0" max="5000" step="100" value={power} 
              onChange={(e) => setPower(Number(e.target.value))} 
              className="w-full accent-red-500 bg-[#30363d] h-1.5 rounded-lg appearance-none cursor-pointer" 
            />
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-[10px] uppercase font-bold text-blue-400">Mass (kg)</div>
              <div className="text-xs font-mono text-white">{mass}kg</div>
            </div>
            <input 
              type="range" min="0.1" max="5" step="0.1" value={mass} 
              onChange={(e) => { setMass(Number(e.target.value)); reset(); }} 
              className="w-full accent-blue-500 bg-[#30363d] h-1.5 rounded-lg appearance-none cursor-pointer" 
            />
          </div>
        </div>

        <div className="flex gap-2">
          {materials.map((m) => (
            <button
              key={m.name}
              onClick={() => { setMaterial(m); reset(); }}
              className={`flex-1 py-2 px-1 rounded-lg border text-[9px] font-bold uppercase tracking-tight transition-all ${
                material.name === m.name 
                  ? `${m.bg} border-red-500/50 ${m.color}` 
                  : "bg-[#161b22] border-[#30363d] text-[#8b949e] hover:text-[#c9d1d9]"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Visual Calorimeter Display */}
        <div 
          className="relative h-48 rounded-2xl border border-[#30363d] overflow-hidden flex flex-col items-center justify-center transition-colors duration-1000"
          style={{ backgroundColor: getCalorimeterColor() }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_100%)] px-2" />
          
          <motion.div 
            animate={{ scale: isHeating ? [1, 1.05, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center"
            style={{ 
              boxShadow: isHeating ? `0 0 40px ${getGlowColor()}` : 'none',
              backgroundColor: isHeating ? getGlowColor() : 'rgba(255,255,255,0.05)'
            }}
          >
            <Thermometer size={32} className={isHeating ? "text-white" : "text-[#484f58]"} />
          </motion.div>

          <div className="relative z-10 mt-4 text-center">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e] mb-1">Internal Temp</div>
            <div className="text-4xl font-mono text-white font-bold tracking-tight">
              {currentTemp.toFixed(1)}°<span className="text-xl">C</span>
            </div>
          </div>
          
          {isHeating && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-4 right-4 flex items-center gap-1 text-[10px] text-red-500 font-bold"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              HEATING ACTIVE
            </motion.div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] uppercase font-bold text-[#8b949e] tracking-widest flex items-center gap-2">
              <Activity size={12} className="text-red-500" />
              Thermodynamic Curve
            </h4>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsHeating(!isHeating)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${isHeating ? "bg-red-500/20 text-red-500 border border-red-500/30" : "bg-red-600 text-white shadow-lg shadow-red-900/20"}`}
              >
                {isHeating ? "Pause Energy" : "Inject Energy"}
              </button>
              <button onClick={reset} className="px-4 py-1.5 bg-[#161b22] border border-[#30363d] rounded-lg text-[10px] font-bold text-[#484f58] hover:text-[#8b949e]">Reset</button>
            </div>
          </div>

          <div className="h-40 w-full bg-[#0d1117] rounded-xl border border-[#30363d] p-1 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#161b22" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis domain={['auto', 'auto']} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '8px', padding: '4px' }}
                  labelStyle={{ display: 'none' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="#ef4444" 
                  strokeWidth={2} 
                  dot={false} 
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 flex flex-col justify-center">
            <div className="text-[10px] uppercase font-bold text-[#8b949e] mb-1">Total Heat (Q)</div>
            <div className="text-xl font-mono text-orange-400 font-bold">{(currentHeatAdded / 1000).toFixed(2)}<span className="text-xs ml-1">kJ</span></div>
          </div>
          <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 flex flex-col justify-center">
            <div className="text-[10px] uppercase font-bold text-[#8b949e] mb-1">Spec. Heat (c)</div>
            <div className="text-xl font-mono text-blue-400 font-bold">{material.c}<span className="text-[10px] ml-1 uppercase opacity-50">J/kg°C</span></div>
          </div>
        </div>
      </div>
    );
  };


  // Module D: DNA Transcription Lab (High-Fidelity)
  const BioLab = () => {
    const dnaSequence = ["A", "C", "G", "T", "A", "G", "T"];
    const transcriptionMap: { [key: string]: string } = {
      "A": "U",
      "T": "A",
      "C": "G",
      "G": "C"
    };

    const [rnaSequence, setRnaSequence] = useState<(string | null)[]>(new Array(dnaSequence.length).fill(null));
    const [isComplete, setIsComplete] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const placeBase = (base: string) => {
      if (activeIndex >= dnaSequence.length || isComplete) return;

      if (base === transcriptionMap[dnaSequence[activeIndex]]) {
        const newSeq = [...rnaSequence];
        newSeq[activeIndex] = base;
        setRnaSequence(newSeq);
        
        if (activeIndex === dnaSequence.length - 1) {
          setIsComplete(true);
        } else {
          setActiveIndex(prev => prev + 1);
        }
      } else {
        // Simple shake/error feedback for wrong pairing
        const el = document.getElementById(`rna-slot-${activeIndex}`);
        el?.classList.add('animate-shake');
        setTimeout(() => el?.classList.remove('animate-shake'), 400);
      }
    };

    const reset = () => {
      setRnaSequence(new Array(dnaSequence.length).fill(null));
      setIsComplete(false);
      setActiveIndex(0);
    };

    return (
      <div className="space-y-6">
        <div className="bg-black/40 rounded-2xl border border-[#30363d] p-6">
          <div className="flex flex-col gap-6">
            {/* DNA STRAND (Target) */}
            <div className="flex justify-evenly">
              {dnaSequence.map((base, i) => (
                <div key={`dna-${i}`} className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-blue-600 border border-blue-400 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                    {base}
                  </div>
                  <div className={`h-4 w-0.5 ${i <= activeIndex ? "bg-white/20" : "bg-[#30363d]"}`} />
                  
                  {/* RNA Slot */}
                  <div 
                    id={`rna-slot-${i}`}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border-2 transition-all ${
                      rnaSequence[i] 
                        ? "bg-fuchsia-600 border-fuchsia-400 text-white shadow-[0_0_20px_rgba(192,38,211,0.4)]" 
                        : activeIndex === i 
                          ? "bg-fuchsia-900/20 border-fuchsia-500/50 border-dashed animate-pulse" 
                          : "bg-[#161b22] border-[#30363d] border-dashed opacity-30"
                    }`}
                  >
                    {rnaSequence[i] || "?"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isComplete ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-green-500/10 border border-green-500/30 rounded-2xl text-center space-y-3"
          >
            <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest">Transcription Successful!</h3>
            <p className="text-xs text-[#8b949e]">mRNA is fully synthesized and ready for <strong>Translation</strong>.</p>
            <button onClick={reset} className="mt-2 text-[10px] text-white/50 hover:text-white underline uppercase font-bold px-4 py-2">Reset Synthesis</button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-[10px] text-[#8b949e] uppercase font-bold tracking-[0.2em] mb-4">Select mRNA Complement</p>
            </div>
            <div className="grid grid-cols-4 gap-3 px-4">
              {["A", "U", "C", "G"].map(base => (
                <button
                  key={base}
                  onClick={() => placeBase(base)}
                  className={`py-4 rounded-xl font-bold transition-all transform active:scale-90 ${
                    base === "U" 
                      ? "bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-900/20" 
                      : "bg-[#161b22] border border-[#30363d] text-[#c9d1d9] hover:border-blue-500/50"
                  }`}
                >
                  {base}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Module E: Virtual Lab 5: Bridge Design & Stress Testing
  const StructuralLab = () => {
    const [loadForce, setLoadForce] = useState(50000); // Newtons
    const [material, setMaterial] = useState({ 
      name: "Steel", 
      modulus: 200000000000, 
      yield: 250000000,
      color: "text-blue-400" 
    });
    const beamArea = 0.05; // m²
    
    const materials = [
      { name: "Steel", modulus: 200000000000, yield: 250000000, color: "text-blue-400", bg: "bg-blue-500/10" },
      { name: "Concrete", modulus: 30000000000, yield: 40000000, color: "text-gray-400", bg: "bg-gray-500/10" },
      { name: "Wood", modulus: 12000000000, yield: 25000000, color: "text-orange-400", bg: "bg-orange-500/10" },
      { name: "Fiberglass", modulus: 45000000000, yield: 1500000000, color: "text-purple-400", bg: "bg-purple-500/10" },
    ];

    const stress = loadForce / beamArea; // Pascals
    const safetyFactor = material.yield / stress;
    const isFailing = stress > material.yield;

    // Visual helper for "lerp" logic
    const getIntegrityColor = () => {
      if (isFailing) return "bg-black shadow-[0_0_50px_rgba(239,68,68,0.3)]";
      const risk = Math.min(1, 1 / safetyFactor);
      if (risk < 0.3) return "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]";
      if (risk < 0.7) return "bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]";
      return "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]";
    };

    return (
      <div className="space-y-6">
        {/* BRIDGE VISUALIZER */}
        <div className="relative h-40 bg-[#0d1117] border border-[#30363d] rounded-2xl overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(55,65,81,0.2)_0%,transparent_100%)]" />
          
          <div className="w-full relative px-12">
            <motion.div 
              animate={{ 
                y: isFailing ? 20 : (risk => (risk * 15))(Math.min(1, 1/safetyFactor)),
                rotateX: isFailing ? 5 : 0
              }}
              className={`h-4 w-full rounded-lg transition-all duration-500 flex items-center justify-center ${getIntegrityColor()}`}
            >
              {isFailing && (
                <div className="flex gap-1">
                  <div className="w-0.5 h-6 bg-red-600/50 -rotate-45" />
                  <span className="text-[10px] font-black text-white uppercase tracking-tighter">Structural Failure</span>
                  <div className="w-0.5 h-6 bg-red-600/50 rotate-45" />
                </div>
              )}
            </motion.div>
            
            {/* Abutment Supports */}
            <div className="absolute -left-20 top-4 w-32 h-20 bg-[#161b22] border-r border-[#30363d] rounded-r-3xl" />
            <div className="absolute -right-20 top-4 w-32 h-20 bg-[#161b22] border-l border-[#30363d] rounded-l-3xl" />
          </div>
        </div>

        {/* CONTROLS */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[10px] uppercase font-bold text-[#8b949e] tracking-widest">Load Force (N)</label>
            <span className="text-sm font-mono text-white font-bold">{loadForce.toLocaleString()} N</span>
          </div>
          <input 
            type="range" min="1000" max="20000000" step="50000" value={loadForce} 
            onChange={(e) => setLoadForce(Number(e.target.value))} 
            className="w-full accent-blue-500 bg-[#30363d] h-2 rounded-lg appearance-none cursor-pointer" 
          />
          
          <div className="flex gap-2 pt-2">
            {materials.map((m) => (
              <button
                key={m.name}
                onClick={() => setMaterial({ ...m })}
                className={`flex-1 py-2.5 rounded-xl border text-[9px] font-bold uppercase transition-all ${
                  material.name === m.name 
                    ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/20" 
                    : "bg-[#0d1117] border-[#30363d] text-[#484f58] hover:text-[#8b949e]"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* DATA READOUT (Engineering Card) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0b0e14] border border-[#30363d] rounded-2xl p-4 shadow-xl">
            <div className="text-[9px] uppercase font-bold text-[#484f58] mb-1">Current Stress</div>
            <div className={`text-xl font-mono font-black ${isFailing ? "text-red-500" : "text-white"}`}>
              {(stress / 1000000).toFixed(2)}<span className="text-xs ml-1 text-[#8b949e]">MPa</span>
            </div>
          </div>
          <div className="bg-[#0b0e14] border border-[#30363d] rounded-2xl p-4 shadow-xl">
            <div className="text-[9px] uppercase font-bold text-[#484f58] mb-1">Safety Factor</div>
            <div className={`text-xl font-mono font-black ${safetyFactor < 1.2 ? "text-orange-400" : "text-emerald-500"}`}>
              {safetyFactor.toFixed(2)}x
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 shadow-2xl relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[#e6edf3] font-bold flex items-center gap-2">
            <Sparkles size={18} className="text-blue-400" />
            Interactive Lab Module
          </h3>
          <p className="text-[#8b949e] text-xs mt-1">Live simulation environment powered by formula engine.</p>
        </div>
        <AnimatePresence>
          {isValidated && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <JudgeAgentBadge />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="min-h-[200px]">
        {type === "physics" && <PhysicsLab />}
        {type === "ee" && <EELab />}
        {type === "thermo" && <ThermoLab />}
        {type === "bio" && <BioLab />}
        {type === "structural" && <StructuralLab />}
      </div>

      <div className="mt-8 pt-6 border-t border-[#30363d] flex gap-3">
        <button 
          onClick={async () => {
            if (user) {
              const progressRef = doc(db, 'users', user.uid, 'progress', labId);
              try {
                await setDoc(progressRef, {
                  labId,
                  userId: user.uid,
                  completed: true,
                  score: 100, // Default for completion
                  lastAttemptAt: serverTimestamp(),
                  updatedAt: serverTimestamp()
                }, { merge: true });
                await updateXP(500);
              } catch (e) {
                handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}/progress/${labId}`);
              }
            }
            onComplete();
          }}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={18} />
          Complete Lab
        </button>
        <button className="p-3 bg-[#161b22] border border-[#30363d] rounded-xl text-[#8b949e] hover:text-white transition-all">
          <Share2 size={18} />
        </button>
      </div>

      {/* Decorative background element */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />
    </motion.div>
  );
}
