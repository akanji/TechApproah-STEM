import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Settings2, Play, RefreshCcw, FlaskConical, Thermometer, LineChart as ChartIcon, AlertCircle, Droplets, Gauge, Save, Table, Calculator } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, ScatterChart, Scatter, ZAxis } from "recharts";

interface HistoryData {
  time: number;
  concentration: number;
  temperature: number;
  p_val?: number; 
}

interface LogEntry {
  temp: number;
  k: number;
  invT: number;
  lnK: number;
}

export function ReactionKineticsLab({ labId = "chem_001" }: { labId?: string }) {
  // Common States
  const [active, setActive] = useState(false);
  const [history, setHistory] = useState<HistoryData[]>([]);
  const [time, setTime] = useState(0);
  const [mode, setMode] = useState<"live" | "analysis">("live");

  // Logged data for Arrhenius analysis
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // CSTR / PFR common states
  const [volume, setVolume] = useState(100); // L
  const [feedRate, setFeedRate] = useState(10); // L/min
  const [inletConc, setInletConc] = useState(2.0); // mol/L
  const [inletTemp, setInletTemp] = useState(300); // K
  
  // Calculation States
  const [ca, setCa] = useState(2.0);
  const [temp, setTemp] = useState(300);

  // Constants
  const Ea = 45000; // J/mol
  const R = 8.314; 
  const k0 = 1.5e8; 
  const deltaH = -55000; 
  const cp = 4.18; // kJ/kg.K
  const rho = 1.0; // kg/L (since water is 1000kg/m3)

  const currentK = useMemo(() => k0 * Math.exp(-Ea / (R * temp)), [temp]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (active) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);

        if (labId === "chem_001") {
          // CSTR: Dynamic accumulation
          // Mass Balance: V*dCa/dt = F(Ca0 - Ca) - k*Ca^2*V
          const dCa = (feedRate / volume) * (inletConc - ca) - currentK * Math.pow(ca, 2);
          
          // Energy Balance: rho*Cp*V*dT/dt = rho*Cp*F(T0 - T) + (-deltaH)*(k*Ca^2*V)
          // Simplified: dT/dt = (F/V)(T0 - T) + ((-deltaH)*k*Ca^2) / (rho*Cp)
          const dT = (feedRate / volume) * (inletTemp - temp) + ((-deltaH / 1000) * (currentK * Math.pow(ca, 2))) / (rho * cp);
          
          setCa(prev => Math.max(0, prev + dCa * 0.1));
          setTemp(prev => prev + dT * 0.1);
          setHistory(prev => [...prev, { time: time, concentration: ca, temperature: temp }].slice(-100));
        } else if (labId === "chem_002") {
          const pfrData = [];
          let currentCa = inletConc;
          const dz = volume / 20;
          for (let i = 0; i <= 20; i++) {
            const kStatic = k0 * Math.exp(-Ea / (R * inletTemp)); 
            const rA = kStatic * Math.pow(currentCa, 2);
            const dCaVal = -(rA / feedRate) * dz;
            currentCa += dCaVal;
            pfrData.push({ time: i, concentration: Math.max(0, currentCa), temperature: inletTemp });
          }
          setHistory(pfrData);
          setCa(currentCa);
          setActive(false);
        } else if (labId === "chem_004") {
          const K_A = 0.5;
          const k = 0.1;
          const k_cat = (k * K_A * inletConc) / (1 + K_A * inletConc);
          setCa(inletConc * Math.exp(-k_cat * time * 0.1));
          setHistory(prev => [...prev, { time: time, concentration: ca, temperature: 0 }].slice(-100));
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [active, time, ca, temp, volume, feedRate, inletConc, inletTemp, labId, currentK]);

  const logDataPoint = () => {
    const entry: LogEntry = {
      temp: temp,
      k: currentK,
      invT: 1 / temp,
      lnK: Math.log(currentK)
    };
    setLogs(prev => [...prev, entry].sort((a, b) => a.temp - b.temp));
  };

  const reset = () => {
    setActive(false);
    setTime(0);
    setCa(inletConc);
    setTemp(inletTemp);
    setHistory([]);
    setLogs([]);
  };

  const calcEa = () => {
    if (logs.length < 2) return "Need more data";
    const x = logs.map(l => l.invT);
    const y = logs.map(l => l.lnK);
    const n = logs.length;
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
    const sumX2 = x.reduce((a, b) => a + b * b, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const calculatedEa = -slope * R;
    return (calculatedEa / 1000).toFixed(2) + " kJ/mol";
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-1 bg-[#161b22] border border-[#30363d] p-1 rounded-xl w-fit">
        <button 
          onClick={() => setMode("live")}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === "live" ? "bg-blue-600 text-white" : "text-[#8b949e] hover:text-white"}`}
        >
          Live Simulation
        </button>
        <button 
          onClick={() => setMode("analysis")}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === "analysis" ? "bg-blue-600 text-white" : "text-[#8b949e] hover:text-white"}`}
        >
          Data Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Settings2 size={18} className="text-blue-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">CSTR Configuration</h4>
            </div>
            {labId === "chem_001" && (
              <button 
                onClick={logDataPoint}
                className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors"
                title="Log data point for analysis"
              >
                <Save size={16} />
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase text-[#8b949e]">
                <span>Reactor Volume (V)</span>
                <span className="text-blue-400 font-mono">{volume} L</span>
              </div>
              <input 
                type="range" min="10" max="500" step="10" value={volume} 
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-1.5 bg-[#30363d] rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase text-[#8b949e]">
                <span>Feed Rate (F)</span>
                <span className="text-blue-400 font-mono">{feedRate} L/min</span>
              </div>
              <input 
                type="range" min="1" max="50" step="1" value={feedRate} 
                onChange={(e) => setFeedRate(Number(e.target.value))}
                className="w-full h-1.5 bg-[#30363d] rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase text-[#8b949e]">
                <span>Inlet Conc (C_A0)</span>
                <span className="text-emerald-400 font-mono">{inletConc} mol/L</span>
              </div>
              <input 
                type="range" min="0.1" max="5.0" step="0.1" value={inletConc} 
                onChange={(e) => setInletConc(Number(e.target.value))}
                className="w-full h-1.5 bg-[#30363d] rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase text-[#8b949e]">
                <span>Inlet Temp (T0)</span>
                <span className="text-orange-400 font-mono">{inletTemp} K</span>
              </div>
              <input 
                type="range" min="273" max="500" step="1" value={inletTemp} 
                onChange={(e) => setInletTemp(Number(e.target.value))}
                className="w-full h-1.5 bg-[#30363d] rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setActive(!active)}
              className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${active ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-blue-600 text-white shadow-lg shadow-blue-900/20"}`}
            >
              {active ? <RefreshCcw className="animate-spin" size={16} /> : <Play size={16} />}
              {active ? "Running..." : "Start Reaction"}
            </button>
            <button 
              onClick={reset}
              className="px-4 bg-[#21262d] border border-[#30363d] text-[#8b949e] rounded-xl hover:text-white"
            >
              <RefreshCcw size={16} />
            </button>
          </div>
        </div>

        {/* Dashboard/Analysis */}
        <div className="space-y-4">
          {mode === "live" ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FlaskConical size={16} className="text-emerald-400" />
                    <span className="text-[10px] uppercase font-bold text-[#8b949e]">Outlet Conc</span>
                  </div>
                  <div className="text-2xl font-mono text-white font-bold">{ca.toFixed(3)}</div>
                  <div className="text-[9px] text-[#8b949e]">mol/L</div>
                </div>
                <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer size={16} className="text-orange-400" />
                    <span className="text-[10px] uppercase font-bold text-[#8b949e]">Reaction Temp</span>
                  </div>
                  <div className="text-2xl font-mono text-white font-bold">{temp.toFixed(1)}</div>
                  <div className="text-[9px] text-[#8b949e]">Kelvin</div>
                </div>
              </div>

              <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 h-64">
                <div className="flex items-center gap-2 mb-4">
                  <ChartIcon size={16} className="text-blue-400" />
                  <h5 className="text-[10px] font-bold text-white uppercase tracking-wider">Time Evolution</h5>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                    <XAxis dataKey="time" hide />
                    <YAxis yAxisId="left" stroke="#10b981" fontSize={8} />
                    <YAxis yAxisId="right" orientation="right" stroke="#f97316" fontSize={8} />
                    <Tooltip contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', fontSize: '10px' }} />
                    <Line yAxisId="left" type="monotone" dataKey="concentration" stroke="#10b981" strokeWidth={2} dot={false} name="Conc" />
                    <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={2} dot={false} name="Temp" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calculator size={16} className="text-purple-400" />
                  <h5 className="text-[10px] font-bold text-white uppercase tracking-wider">Arrhenius Plot</h5>
                </div>
                <div className="text-[10px] font-bold text-emerald-400">
                  Estimated Ea: {calcEa()}
                </div>
              </div>
              
              <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                    <XAxis type="number" dataKey="invT" name="1/T" stroke="#8b949e" fontSize={8} label={{ value: '1/T (K⁻¹)', position: 'bottom', fontSize: 10, fill: '#8b949e' }} domain={['auto', 'auto']} />
                    <YAxis type="number" dataKey="lnK" name="ln(k)" stroke="#8b949e" fontSize={8} label={{ value: 'ln(k)', angle: -90, position: 'left', fontSize: 10, fill: '#8b949e' }} domain={['auto', 'auto']} />
                    <ZAxis range={[60, 100]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', fontSize: '10px' }} />
                    <Scatter name="Kinetics data" data={logs} fill="#8b5cf6" line={{ stroke: '#8b5cf6', strokeWidth: 1 }} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 pt-4 border-t border-[#30363d]">
                <div className="flex items-center gap-2 mb-2">
                  <Table size={14} className="text-[#8b949e]" />
                  <span className="text-[9px] uppercase font-bold text-[#8b949e]">Captured Points</span>
                </div>
                <div className="space-y-1 max-h-24 overflow-y-auto pr-2 custom-scrollbar">
                  {logs.map((log, i) => (
                    <div key={i} className="flex justify-between text-[10px] font-mono text-[#8b949e] py-1 border-b border-white/5">
                      <span>T: {log.temp.toFixed(1)}K</span>
                      <span>k: {log.k.toFixed(4)}</span>
                      <span className="text-purple-400">ln(k): {log.lnK.toFixed(2)}</span>
                    </div>
                  ))}
                  {logs.length === 0 && <div className="text-[10px] text-[#484f58] italic py-2 text-center">No data points logged. Start reaction & click save icon.</div>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Equations */}
      <div className="bg-[#0d162d] border border-blue-500/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle size={16} className="text-blue-400" />
          <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Reactor Dynamics Model</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-bold text-blue-400/70">1. Mass Balance (CSTR)</div>
              <div className="bg-black/40 p-3 rounded-lg font-mono text-[11px] text-white overflow-x-auto">
                {"V(dC_A/dt) = F(C_A0 - C_A) - k * C_A^2 * V"}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-bold text-blue-400/70">2. Energy Balance</div>
              <div className="bg-black/40 p-3 rounded-lg font-mono text-[11px] text-white overflow-x-auto">
                {"ρCpV(dT/dt) = ρCpF(T_0 - T) + (-ΔH_r) * (k * C_A^2 * V)"}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-bold text-blue-400/70">3. Arrhenius Relation</div>
              <div className="bg-black/40 p-3 rounded-lg font-mono text-[11px] text-white overflow-x-auto">
                {"k = k_0 * exp(-E_a / (RT))"}
              </div>
              <p className="text-[10px] leading-relaxed text-blue-100/50 italic">
                From the plot of ln(k) vs 1/T, the slope (m) is equal to -Ea/R. 
                Saponification is typically exothermic (~ -55 kJ/mol).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

