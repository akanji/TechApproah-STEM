import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, RefreshCcw, ArrowRightLeft, Search, Copy, Check,
  Ruler, Weight, Thermometer, Zap, Activity
} from "lucide-react";

type UnitCategory = "length" | "mass" | "temperature" | "force";

const CATEGORY_ICONS: Record<UnitCategory, React.ElementType> = {
  length: Ruler,
  mass: Weight,
  temperature: Thermometer,
  force: Zap
};

const CONVERSIONS: Record<UnitCategory, { units: string[]; factor: (val: number, from: string, to: string) => number }> = {
  length: {
    units: ["Meters (m)", "Kilometers (km)", "Miles (mi)", "Feet (ft)", "Nautical Miles (nmi)", "Inches (in)", "Yards (yd)", "Centimeters (cm)", "Millimeters (mm)", "Nanometers (nm)"],
    factor: (val, from, to) => {
      const toMeters: Record<string, number> = { 
        "Meters (m)": 1, 
        "Kilometers (km)": 1000, 
        "Miles (mi)": 1609.34, 
        "Feet (ft)": 0.3048,
        "Nautical Miles (nmi)": 1852,
        "Inches (in)": 0.0254,
        "Yards (yd)": 0.9144,
        "Centimeters (cm)": 0.01,
        "Millimeters (mm)": 0.001,
        "Nanometers (nm)": 1e-9
      };
      const meters = val * toMeters[from];
      return meters / toMeters[to];
    }
  },
  mass: {
    units: ["Kilograms (kg)", "Grams (g)", "Pounds (lb)", "Ounces (oz)", "Tonnes (t)", "Milligrams (mg)", "Micrograms (µg)", "Stones (st)"],
    factor: (val, from, to) => {
      const toKg: Record<string, number> = { 
        "Kilograms (kg)": 1, 
        "Grams (g)": 0.001, 
        "Pounds (lb)": 0.453592, 
        "Ounces (oz)": 0.0283495,
        "Tonnes (t)": 1000,
        "Milligrams (mg)": 0.000001,
        "Micrograms (µg)": 0.000000001,
        "Stones (st)": 6.35029
      };
      const kg = val * toKg[from];
      return kg / toKg[to];
    }
  },
  temperature: {
    units: ["Celsius (°C)", "Fahrenheit (°F)", "Kelvin (K)", "Rankine (°R)"],
    factor: (val, from, to) => {
      let c;
      if (from === "Celsius (°C)") c = val;
      else if (from === "Fahrenheit (°F)") c = (val - 32) * 5/9;
      else if (from === "Kelvin (K)") c = val - 273.15;
      else c = (val - 491.67) * 5/9; // Rankine

      if (to === "Celsius (°C)") return c;
      if (to === "Fahrenheit (°F)") return (c * 9/5) + 32;
      if (to === "Kelvin (K)") return c + 273.15;
      return (c * 9/5) + 491.67; // Rankine
    }
  },
  force: {
    units: ["Newtons (N)", "Pound-force (lbf)", "Kilonewtons (kN)", "Dynes (dyn)", "Kilogram-force (kgf)"],
    factor: (val, from, to) => {
      const toN: Record<string, number> = { 
        "Newtons (N)": 1, 
        "Pound-force (lbf)": 4.44822, 
        "Kilonewtons (kN)": 1000,
        "Dynes (dyn)": 0.00001,
        "Kilogram-force (kgf)": 9.80665
      };
      const n = val * toN[from];
      return n / toN[to];
    }
  }
};

export function UnitConverter({ onClose }: { onClose: () => void }) {
  const [category, setCategory] = useState<UnitCategory>(() => 
    (localStorage.getItem("unit_category") as UnitCategory) || "length"
  );
  const [value, setValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState(() => 
    localStorage.getItem(`unit_from_${category}`) || CONVERSIONS[category].units[0]
  );
  const [toUnit, setToUnit] = useState(() => 
    localStorage.getItem(`unit_to_${category}`) || CONVERSIONS[category].units[1]
  );
  const [unitSearch, setUnitSearch] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem("unit_category", category);
    localStorage.setItem(`unit_from_${category}`, fromUnit);
    localStorage.setItem(`unit_to_${category}`, toUnit);
  }, [category, fromUnit, toUnit]);

  const result = CONVERSIONS[category].factor(Number(value) || 0, fromUnit, toUnit);
  const displayResult = result.toFixed(6).replace(/\.?0+$/, "");

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const savedFrom = localStorage.getItem(`unit_from_${cat}`);
    const savedTo = localStorage.getItem(`unit_to_${cat}`);
    setFromUnit(savedFrom || CONVERSIONS[cat].units[0]);
    setToUnit(savedTo || CONVERSIONS[cat].units[1]);
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(displayResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredUnits = useMemo(() => {
    return CONVERSIONS[category].units.filter(u => 
      u.toLowerCase().includes(unitSearch.toLowerCase())
    );
  }, [category, unitSearch]);

  const Icon = CATEGORY_ICONS[category];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-brand-bg/95 backdrop-blur-md flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-sm bg-brand-surface border border-brand-border rounded-[2.5rem] overflow-hidden shadow-2xl relative"
      >
        <div className="p-8 border-b border-brand-border flex justify-between items-center bg-brand-surface">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <Icon size={20} />
            </div>
            <div>
              <h2 className="text-text-primary font-bold text-sm uppercase tracking-widest">Converter</h2>
              <p className="text-[10px] text-text-secondary font-mono uppercase">{category} Analysis</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-brand-border rounded-xl transition-colors">
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {(Object.keys(CONVERSIONS) as UnitCategory[]).map(cat => {
              const CatIcon = CATEGORY_ICONS[cat];
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 border ${
                    category === cat 
                      ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40" 
                      : "bg-brand-tertiary border-brand-border text-text-secondary hover:text-text-primary hover:border-blue-500/30"
                  }`}
                >
                  <CatIcon size={12} />
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Unit Search (Optional but helpful if many units) */}
          {CONVERSIONS[category].units.length > 8 && (
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text"
                placeholder="Search units..."
                value={unitSearch}
                onChange={(e) => setUnitSearch(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border rounded-xl py-2 pl-9 pr-3 text-[10px] uppercase font-bold text-text-primary outline-none focus:border-blue-500/40 transition-all"
              />
            </div>
          )}

          {/* Inputs */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Input Value</label>
                <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border rounded-2xl px-5 py-4 text-text-primary text-lg font-mono outline-none focus:border-blue-500/50 transition-all shadow-inner"
                  placeholder="0.00"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full bg-brand-tertiary border border-brand-border rounded-2xl px-4 py-3 text-text-primary text-xs font-bold uppercase tracking-widest outline-none focus:border-blue-500/50 appearance-none transition-all cursor-pointer hover:bg-brand-border"
                >
                  {filteredUnits.length > 0 ? filteredUnits.map(u => <option key={u} value={u} className="bg-brand-surface">{u}</option>) : <option disabled>No units found</option>}
                </select>
              </div>
            </div>

            <div className="flex justify-center relative py-2">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-[1px] bg-brand-border" />
              </div>
              <button 
                onClick={swapUnits}
                className="p-3 bg-brand-surface border border-brand-border rounded-2xl text-blue-400 hover:text-white hover:bg-blue-600 transition-all shadow-xl active:scale-90 relative z-10"
              >
                <ArrowRightLeft size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest px-1">Calculated Output</label>
              <div className="flex flex-col gap-2">
                <div className="w-full bg-blue-500/5 border border-blue-500/20 rounded-2xl px-5 py-4 text-blue-400 text-lg font-mono flex items-center justify-between group">
                  <span className="truncate">{displayResult}</span>
                  <button 
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                </div>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full bg-brand-tertiary border border-brand-border rounded-2xl px-4 py-3 text-text-primary text-xs font-bold uppercase tracking-widest outline-none focus:border-blue-500/50 appearance-none transition-all cursor-pointer hover:bg-brand-border"
                >
                  {filteredUnits.length > 0 ? filteredUnits.map(u => <option key={u} value={u} className="bg-brand-surface">{u}</option>) : <option disabled>No units found</option>}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-brand-bg/50 border-t border-brand-border flex gap-3">
          <button 
            onClick={copyToClipboard}
            className="flex-1 py-4 bg-brand-tertiary hover:bg-brand-border text-text-primary text-[10px] font-bold rounded-2xl transition-all uppercase tracking-widest flex items-center justify-center gap-2 border border-brand-border"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            Copy result
          </button>
          <button 
            onClick={onClose}
            className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-2xl transition-all uppercase tracking-widest shadow-lg shadow-blue-900/20"
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
