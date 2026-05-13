import React, { useState } from "react";
import { motion } from "motion/react";
import { MoveDown, Zap, BarChart2, Info } from "lucide-react";

export function RampLab() {
  const [mass, setMass] = useState(1.0); // kg
  const [height, setHeight] = useState(0.5); // meters
  const gravity = 9.81; // m/s²

  // Potential Energy = mgh
  const pe = mass * gravity * height;
  
  // Final Velocity v = sqrt(2 * g * h)
  const vFinal = Math.sqrt(2 * gravity * height);
  
  // Kinetic Energy at bottom = 1/2 m v^2 (should equal PE)
  const keBottom = 0.5 * mass * Math.pow(vFinal, 2);

  return (
    <div className="space-y-6">
      {/* Visual Simulation Area */}
      <div className="relative h-64 bg-[#0b0e14] border border-[#30363d] rounded-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1)_0%,transparent_100%)]" />
        
        {/* Dynamic Ramp SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
          <defs>
            <linearGradient id="rampGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#30363d" />
              <stop offset="100%" stopColor="#161b22" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <g className="stroke-[#30363d]/30" strokeWidth="0.5">
            {[...Array(10)].map((_, i) => (
              <React.Fragment key={i}>
                <line x1={i * 40} y1="0" x2={i * 40} y2="200" />
                <line x1="0" y1={i * 20} x2="400" y2={i * 20} />
              </React.Fragment>
            ))}
          </g>

          {/* The Ramp */}
          <path 
            d={`M 0 200 L 400 200 L 0 ${200 - (height * 80)} Z`} 
            fill="url(#rampGradient)"
            className="stroke-[#30363d] transition-all duration-500"
          />

          {/* The Sliding Object */}
          <motion.rect
            width="20"
            height="20"
            rx="4"
            fill="#3b82f6"
            stroke="#60a5fa"
            strokeWidth="2"
            animate={{ 
              x: [0, 360],
              y: [180 - (height * 80), 180],
              rotate: [0, Math.atan2(height * 80, 400) * (180/Math.PI)]
            }}
            transition={{ 
              duration: Math.max(0.5, 2 / (vFinal || 1)),
              repeat: Infinity,
              ease: "easeIn",
              repeatDelay: 1
            }}
          />
        </svg>

        {/* Floating Labels */}
        <div className="absolute top-4 left-4 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            Initial State (Top)
          </span>
          <span className="text-[9px] text-[#8b949e] font-mono">PE = {pe.toFixed(2)} J</span>
        </div>

        <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1 text-right">
          <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
            Terminal State (Bottom)
          </span>
          <span className="text-[9px] text-[#8b949e] font-mono">KE = {keBottom.toFixed(2)} J</span>
          <span className="text-[9px] text-white font-mono">v = {vFinal.toFixed(2)} m/s</span>
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-4">
          <div className="flex justify-between items-center text-[10px] font-bold text-[#8b949e] uppercase tracking-widest">
            <span>Release Height (m)</span>
            <span className="text-white font-mono">{height.toFixed(2)} m</span>
          </div>
          <input 
            type="range" min="0.1" max="2.0" step="0.05" value={height} 
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full accent-blue-500 bg-[#30363d] h-2 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-[9px] text-[#484f58] italic leading-tight">
            Higher elevation increases Potential Energy linearly according to m·g·h.
          </p>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-4">
          <div className="flex justify-between items-center text-[10px] font-bold text-[#8b949e] uppercase tracking-widest">
            <span>Object Mass (kg)</span>
            <span className="text-white font-mono">{mass.toFixed(1)} kg</span>
          </div>
          <input 
            type="range" min="0.5" max="10.0" step="0.5" value={mass} 
            onChange={(e) => setMass(Number(e.target.value))}
            className="w-full accent-yellow-500 bg-[#30363d] h-2 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-[9px] text-[#484f58] italic leading-tight">
            Mass scales both PE and target KE, but terminal velocity remains height-dependent.
          </p>
        </div>
      </div>

      {/* Metrics Card */}
      <div className="bg-[#0b0e14] border border-[#30363d] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 text-[#30363d]">
          <BarChart2 size={40} />
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <Zap size={16} className="text-yellow-500" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#8b949e]">Work-Energy Conservation Engine</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-center">
            <span className="text-[9px] font-bold text-[#484f58] uppercase mb-1">Peak Potential (U)</span>
            <div className="text-2xl font-mono text-blue-400 font-bold">{pe.toFixed(2)}<span className="text-xs ml-1">J</span></div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-center">
            <span className="text-[9px] font-bold text-[#484f58] uppercase mb-1">Impact Kinetic (K)</span>
            <div className="text-2xl font-mono text-green-400 font-bold">{keBottom.toFixed(2)}<span className="text-xs ml-1">J</span></div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-center">
            <span className="text-[9px] font-bold text-[#484f58] uppercase mb-1">Impact Velocity (v)</span>
            <div className="text-2xl font-mono text-white font-bold">{vFinal.toFixed(2)}<span className="text-[xs] ml-1">m/s</span></div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 p-3 bg-yellow-500/5 rounded-xl border border-yellow-500/10">
          <Info size={14} className="text-yellow-500 shrink-0" />
          <p className="text-[10px] text-[#c9d1d9] leading-snug">
            In this idealized vacuum simulation, all <strong className="text-blue-400">Gravitational Potential Energy</strong> is converted into <strong className="text-green-400">Kinetic Energy</strong>. Velocity depends only on height.
          </p>
        </div>
      </div>
    </div>
  );
}
