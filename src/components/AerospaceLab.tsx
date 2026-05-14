import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Settings2, Play, RefreshCcw, Rocket, Plane, Gauge, Thermometer, Wind, AlertCircle, TrendingUp, Info } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from "recharts";

interface HistoryData {
  time: number;
  val1: number; // e.g., lift, pressure jump, thrust
  val2?: number; // e.g., drag, temp jump, isp
}

export function AerospaceLab({ labId = "aero_006" }: { labId?: string }) {
  const [active, setActive] = useState(false);
  const [history, setHistory] = useState<HistoryData[]>([]);
  
  // Scenarios:
  // 1. Incompressible: NACA 0012 Airfoil (Alpha vs Cl/Cd)
  // 2. Compressible: Mach Shock (Mach vs P2/P1)
  // 3. Propulsion: Brayton Cycle (PR vs Efficiency)
  // 4. Rocketry: Nozzle Expansion (Ae/At vs Thrust)

  const [param1, setParam1] = useState(0); // Generic parameter (Angle of attack, Mach, PR, etc)
  const [param2, setParam2] = useState(1); // Alt parameter

  useEffect(() => {
    if (active) {
      const data: HistoryData[] = [];
      
      if (labId === "aero_006") {
        // Airfoil Lift/Drag sweep with STALL
        for (let alpha = -5; alpha <= 22; alpha += 0.5) {
          let cl;
          if (alpha < 15) {
            cl = 2 * Math.PI * (alpha * Math.PI / 180);
          } else {
            // Stall behavior: Drop in lift after 15 deg
            cl = (2 * Math.PI * (15 * Math.PI / 180)) * Math.exp(-(alpha - 15) * 0.1);
          }
          const cd = 0.01 + 0.05 * Math.pow(cl, 2);
          data.push({ time: alpha, val1: cl, val2: cd });
        }
      } else if (labId === "aero_007") {
        // Compressible Normal Shock Ratios
        const gamma = 1.4;
        for (let M = 1; M <= 5; M += 0.1) {
          const pRatio = 1 + (2 * gamma / (gamma + 1)) * (M * M - 1);
          const rhoRatio = ((gamma + 1) * M * M) / ((gamma - 1) * M * M + 2);
          data.push({ time: M, val1: pRatio, val2: rhoRatio });
        }
      } else if (labId === "aero_008") {
        // Brayton Cycle Efficiency vs Pressure Ratio
        const gamma = 1.4;
        for (let pr = 1; pr <= 40; pr += 1) {
          const eff = 1 - (1 / Math.pow(pr, (gamma - 1) / gamma));
          data.push({ time: pr, val1: eff * 100 });
        }
      } else if (labId === "aero_009") {
        // Rocket Equation Delta V vs Mass Ratio
        const isp = param1 || 300; // Isp as param
        const g0 = 9.81;
        for (let massRatio = 1; massRatio <= 10; massRatio += 0.2) {
          // Delta V = Isp * g * ln(m0/mf)
          const dv = isp * g0 * Math.log(massRatio);
          data.push({ time: massRatio, val1: dv });
        }
      }
      
      setHistory(data);
      setActive(false);
    }
  }, [active, labId, param1]);

  const getLabels = () => {
    switch(labId) {
      case "aero_006": return { title: "Airfoil Performance (NACA 0012)", x: "Alpha (deg)", y1: "Lift (Cl)", y2: "Drag (Cd)", p1: "Flow Sensitivity" };
      case "aero_007": return { title: "Normal Shock Ratios", x: "Mach Number (M1)", y1: "P2/P1 (Pressure)", y2: "ρ2/ρ1 (Density)", p1: "Shock Intensity" };
      case "aero_008": return { title: "Brayton Cycle Efficiency", x: "Pressure Ratio", y1: "Thermal Efficiency (%)", p1: "Turbine Comp." };
      case "aero_009": return { title: "Rocket Equation Performance", x: "Mass Ratio (m0/mf)", y1: "Δv (m/s)", p1: "Propellant Isp (s)" };
      default: return { title: "Aerospace Simulation", x: "Input", y1: "Result", p1: "Param" };
    }
  };

  const labels = getLabels();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            {labId === "aero_009" ? <Rocket size={120} /> : <Plane size={120} />}
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Settings2 size={18} className="text-cyan-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{labels.title} Config</h4>
            </div>

            <div className="space-y-6">
              {labId === "aero_009" && (
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] uppercase font-bold text-[#8b949e]">
                    <span>Specific Impulse (Isp)</span>
                    <span className="text-cyan-400 font-mono">{param1 || 300} s</span>
                  </div>
                  <input 
                    type="range" min="150" max="450" step="10" 
                    value={param1 || 300}
                    onChange={(e) => setParam1(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#30363d] rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              )}

              <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-[#8b949e] uppercase">{labels.p1}</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-mono border border-cyan-500/20">Analysis</span>
                </div>
                <p className="text-[11px] text-[#8b949e] leading-relaxed">
                  {labId === "aero_006" && "Visualizing the non-linear relationship between Angle of Attack and Lift. Observe the critical 'Stall' point where lift drops rapidly."}
                  {labId === "aero_007" && "Analyzing discontinuity across a normal shock wave. P2/P1 and ρ2/ρ1 increase monotonically with upstream Mach number."}
                  {labId === "aero_008" && "Calculating Brayton cycle efficiency. Higher pressure ratios generally lead to better thermal performance."}
                  {labId === "aero_009" && "Solving the Tsiolkovsky Rocket Equation. Adjust Isp to see how propellant quality impacts velocity gain."}
                </p>
              </div>

              <button 
                onClick={() => setActive(true)}
                className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 transition-all border border-cyan-400/20 shadow-inner"
              >
                <Play size={16} />
                Generate Performance Plot
              </button>
            </div>
          </div>
        </div>

        {/* Viz */}
        <div className="space-y-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 h-80 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-cyan-400" />
                <h5 className="text-[10px] font-bold text-white uppercase tracking-wider">{labels.title} Plot</h5>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span className="text-[10px] text-[#8b949e]">{labels.y1}</span>
                </div>
                {labels.y2 && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-[10px] text-[#8b949e]">{labels.y2}</span>
                  </div>
                )}
              </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                <XAxis dataKey="time" stroke="#484f58" fontSize={9} label={{ value: labels.x, position: 'bottom', fontSize: 10, fill: '#8b949e' }} />
                <YAxis stroke="#484f58" fontSize={9} />
                <Tooltip contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', fontSize: '10px' }} />
                <Line type="monotone" dataKey="val1" stroke="#06b6d4" strokeWidth={2} dot={false} isAnimationActive={true} />
                {labels.y2 && <Line type="monotone" dataKey="val2" stroke="#f87171" strokeWidth={2} dot={false} isAnimationActive={true} />}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Gauge size={20} />
              </div>
              <div>
                <div className="text-[9px] uppercase font-bold text-[#8b949e]">Peak Value</div>
                <div className="text-lg font-mono font-bold text-white">
                  {history.length > 0 ? Math.max(...history.map(d => d.val1)).toFixed(2) : "--"}
                </div>
              </div>
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex items-center gap-3 relative overflow-hidden">
              {labId === "aero_006" && history.some(d => d.time > 15) && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-red-500/5 flex items-center justify-center"
                >
                  <AlertCircle className="text-red-500/20 w-12 h-12" />
                </motion.div>
              )}
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 relative z-10">
                <Thermometer size={20} />
              </div>
              <div className="relative z-10">
                <div className="text-[9px] uppercase font-bold text-[#8b949e]">State Focus</div>
                <div className="text-lg font-mono font-bold text-white">
                  {labId === "aero_006" ? "Stall Path" : labId === "aero_007" ? "Hypersonic" : "Efficiency"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warnings & Notices */}
      <AnimatePresence>
        {labId === "aero_006" && history.some(d => d.time > 15) && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 flex items-center gap-4"
          >
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 animate-pulse">
              <AlertCircle size={18} />
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Aerodynamic Warning: Flow Separation</h4>
              <p className="text-[11px] text-red-200/60">Flow separation occurring at α &gt; 15°. Lift generation collapsing due to massive pressure drag increase.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lab Insight */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-cyan-900/10 border border-cyan-500/20 rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Info size={18} className="text-cyan-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-widest text-[#e6edf3]">Engineering Insight</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-[#8b949e] leading-relaxed">
          <div className="space-y-2">
            <div className="font-bold text-cyan-400 uppercase">Governing Equation</div>
            <div className="bg-black/40 p-2 rounded-lg font-mono text-white text-[10px] overflow-x-auto">
              {labId === "aero_006" && "Cl = 2π * α"}
              {labId === "aero_007" && "P2/P1 = 1 + (2γ/(γ+1))(M1^2 - 1)"}
              {labId === "aero_008" && "η = 1 - (1/PR^((γ-1)/γ))"}
              {labId === "aero_009" && "Δv = Isp * g * ln(m0/mf)"}
            </div>
          </div>
          <div className="md:col-span-2">
            <p>
              This simulation leverages {labId === "aero_006" || labId === "aero_007" ? "Fluid Mechanics" : "Propulsion"} models to predict system behavior. 
              {labId === "aero_009" && " Note that specific impulse (Isp) is the primary driver for rocket performance, where high exhaust velocity translates to greater efficiency."}
              {labId === "aero_006" && " The 2π slope is an idealization for thin airfoils; real-world viscous effects cause stall at high angles of attack."}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
