import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Box } from "lucide-react";

interface PhysicsLabProps {
  onComplete?: () => void;
}

export function PhysicsLab({ onComplete }: PhysicsLabProps) {
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
}
