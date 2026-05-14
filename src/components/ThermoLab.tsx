import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Thermometer, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function ThermoLab() {
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

  const getCalorimeterColor = () => {
    const ratio = Math.min(1, (currentTemp - 20) / 80);
    return `rgba(${30 + ratio * 123}, ${64 - ratio * 37}, ${175 - ratio * 148}, 0.2)`;
  };

  const getGlowColor = () => {
    const ratio = Math.min(1, (currentTemp - 20) / 80);
    return `rgba(${239}, ${68 + ratio * 100}, ${68 - ratio * 100}, ${0.2 + ratio * 0.5})`;
  };

  const [grid, setGrid] = useState<number[][]>(() => 
    Array.from({ length: 10 }, () => Array(10).fill(20))
  );

  useEffect(() => {
    let interval: number;
    if (isHeating) {
      interval = window.setInterval(() => {
        setElapsedTime(prev => {
          const nextTime = Math.round((prev + 0.5) * 10) / 10;
          const nextHeatTotal = power * nextTime;
          const nextTemp = initialTemp + (nextHeatTotal / (mass * material.c));
          
          setData(d => [...d, { time: nextTime, temp: Number(nextTemp.toFixed(1)) }].slice(-50));

          // Update 2D Grid (simulating heat conduction)
          setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => [...row]);
            const center = 5;
            newGrid[center][center] = nextTemp; // Primary heat source at center
            
            // simple relaxation/diffusion
            for (let i = 1; i < 9; i++) {
              for (let j = 1; j < 9; j++) {
                if (i === center && j === center) continue;
                const neighbors = [
                  prevGrid[i-1][j], prevGrid[i+1][j],
                  prevGrid[i][j-1], prevGrid[i][j+1]
                ];
                const avg = neighbors.reduce((a, b) => a + b, 0) / 4;
                newGrid[i][j] = prevGrid[i][j] + (avg - prevGrid[i][j]) * 0.1;
              }
            }
            return newGrid;
          });

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div 
          className="relative h-48 rounded-2xl border border-[#30363d] overflow-hidden flex flex-col items-center justify-center transition-colors duration-1000"
          style={{ backgroundColor: getCalorimeterColor() }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_100%)] px-2" />
          
          <motion.div 
            animate={{ scale: isHeating ? [1, 1.05, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center"
            style={{ 
              boxShadow: isHeating ? `0 0 40px ${getGlowColor()}` : 'none',
              backgroundColor: isHeating ? getGlowColor() : 'rgba(255,255,255,0.05)'
            }}
          >
            <Thermometer size={24} className={isHeating ? "text-white" : "text-[#484f58]"} />
          </motion.div>

          <div className="relative z-10 mt-2 text-center">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e] mb-1">Core Temp</div>
            <div className="text-3xl font-mono text-white font-bold tracking-tight">
              {currentTemp.toFixed(1)}°<span className="text-xl">C</span>
            </div>
          </div>
        </div>

        <div className="h-48 bg-[#0d1117] border border-[#30363d] rounded-2xl p-2 flex flex-col items-center justify-center">
          <div className="text-[8px] font-bold text-[#484f58] uppercase tracking-widest mb-2">2D Heat Diffusion Analysis</div>
          <div className="grid grid-cols-10 gap-px bg-[#30363d] border border-[#30363d] p-1 rounded-sm">
            {grid.map((row, i) => 
              row.map((temp, j) => {
                const ratio = Math.min(1, (temp - 20) / 80);
                return (
                  <div 
                    key={`${i}-${j}`} 
                    className="w-3.5 h-3.5"
                    style={{ backgroundColor: `rgb(${30 + ratio * 225}, ${40 + (1-ratio) * 100}, ${100 + (1-ratio) * 155})` }}
                  />
                )
              })
            )}
          </div>
        </div>
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
}
