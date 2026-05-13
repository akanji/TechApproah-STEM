import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, RefreshCcw, ArrowRightLeft } from "lucide-react";

type UnitCategory = "length" | "mass" | "temperature" | "force";

const CONVERSIONS: Record<UnitCategory, { units: string[]; factor: (val: number, from: string, to: string) => number }> = {
  length: {
    units: ["Meters (m)", "Kilometers (km)", "Miles (mi)", "Feet (ft)"],
    factor: (val, from, to) => {
      const toMeters: Record<string, number> = { "Meters (m)": 1, "Kilometers (km)": 1000, "Miles (mi)": 1609.34, "Feet (ft)": 0.3048 };
      const meters = val * toMeters[from];
      return meters / toMeters[to];
    }
  },
  mass: {
    units: ["Kilograms (kg)", "Grams (g)", "Pounds (lb)", "Ounces (oz)"],
    factor: (val, from, to) => {
      const toKg: Record<string, number> = { "Kilograms (kg)": 1, "Grams (g)": 0.001, "Pounds (lb)": 0.453592, "Ounces (oz)": 0.0283495 };
      const kg = val * toKg[from];
      return kg / toKg[to];
    }
  },
  temperature: {
    units: ["Celsius (°C)", "Fahrenheit (°F)", "Kelvin (K)"],
    factor: (val, from, to) => {
      let c;
      if (from === "Celsius (°C)") c = val;
      else if (from === "Fahrenheit (°F)") c = (val - 32) * 5/9;
      else c = val - 273.15;

      if (to === "Celsius (°C)") return c;
      if (to === "Fahrenheit (°F)") return (c * 9/5) + 32;
      return c + 273.15;
    }
  },
  force: {
    units: ["Newtons (N)", "Pound-force (lbf)", "Kilonewtons (kN)"],
    factor: (val, from, to) => {
      const toN: Record<string, number> = { "Newtons (N)": 1, "Pound-force (lbf)": 4.44822, "Kilonewtons (kN)": 1000 };
      const n = val * toN[from];
      return n / toN[to];
    }
  }
};

export function UnitConverter({ onClose }: { onClose: () => void }) {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [value, setValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState(CONVERSIONS.length.units[0]);
  const [toUnit, setToUnit] = useState(CONVERSIONS.length.units[1]);

  const result = CONVERSIONS[category].factor(Number(value) || 0, fromUnit, toUnit);

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    setFromUnit(CONVERSIONS[cat].units[0]);
    setToUnit(CONVERSIONS[cat].units[1]);
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#0d1117]/95 backdrop-blur-md flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-sm bg-[#161b22] border border-[#30363d] rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-[#30363d] flex justify-between items-center">
          <h2 className="text-white font-bold flex items-center gap-2">
            <RefreshCcw size={18} className="text-blue-400" />
            Unit Converter
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[#30363d] rounded-xl transition-colors">
            <X size={20} className="text-[#8b949e]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {(Object.keys(CONVERSIONS) as UnitCategory[]).map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                  category === cat ? "bg-blue-600 text-white" : "bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest">From</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50"
                  placeholder="Value"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="bg-[#0d1117] border border-[#30363d] rounded-xl px-2 py-3 text-white text-xs outline-none focus:border-blue-500/50"
                >
                  {CONVERSIONS[category].units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={swapUnits}
                className="p-2 bg-[#21262d] border border-[#30363d] rounded-full text-blue-400 hover:bg-[#30363d] transition-all"
              >
                <ArrowRightLeft size={16} />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest">To</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white font-mono flex items-center">
                  {result.toFixed(4).replace(/\.?0+$/, "")}
                </div>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="bg-[#0d1117] border border-[#30363d] rounded-xl px-2 py-3 text-white text-xs outline-none focus:border-blue-500/50"
                >
                  {CONVERSIONS[category].units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#0d1117]/50 border-t border-[#30363d]">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all uppercase tracking-widest"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
