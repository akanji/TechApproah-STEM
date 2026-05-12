import React, { useState } from "react";
import { motion } from "motion/react";

export function StructuralLab() {
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

  const getIntegrityColor = () => {
    if (isFailing) return "bg-black shadow-[0_0_50px_rgba(239,68,68,0.3)]";
    const risk = Math.min(1, 1 / safetyFactor);
    if (risk < 0.3) return "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]";
    if (risk < 0.7) return "bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]";
    return "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]";
  };

  return (
    <div className="space-y-6">
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
          
          <div className="absolute -left-20 top-4 w-32 h-20 bg-[#161b22] border-r border-[#30363d] rounded-r-3xl" />
          <div className="absolute -right-20 top-4 w-32 h-20 bg-[#161b22] border-l border-[#30363d] rounded-l-3xl" />
        </div>
      </div>

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
}
