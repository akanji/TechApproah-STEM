import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Dna, 
  Wind, 
  Zap, 
  Activity, 
  Terminal, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  Code,
  FileText,
  Scissors,
  AlertTriangle,
  Database,
  Save,
  ExternalLink
} from "lucide-react";

interface BioSimulatorProps {
  labId: string;
  onComplete: () => void;
}

export function BioSimulator({ labId, onComplete }: BioSimulatorProps) {
  const [mode, setMode] = useState<"sim" | "code" | "protocol">("sim");

  if (labId === "bio_001") {
    return <CellSignalingLab onComplete={onComplete} />;
  }

  if (labId === "bio_002") {
    return <CrisprRoboticsLab onComplete={onComplete} />;
  }

  return (
    <div className="p-8 text-center text-[#484f58] uppercase font-bold text-[10px] tracking-widest">
      Select a Bio-Engineering Module to begin
    </div>
  );
}

// 1. Cell Signaling and Signal Transductions Lab
function CellSignalingLab({ onComplete }: { onComplete: () => void }) {
  const [ligandConcentration, setLigandConcentration] = useState(10);
  const [receptorDensity, setReceptorDensity] = useState(5); 
  const [isSimulating, setIsSimulating] = useState(false);
  const [signalIntensity, setSignalIntensity] = useState(0);
  const [activeView, setActiveView] = useState<"simulator" | "dashboard">("simulator");

  useEffect(() => {
    if (isSimulating) {
      const target = (receptorDensity * ligandConcentration) / 5;
      const interval = setInterval(() => {
        setSignalIntensity(prev => {
          if (prev < target) return Math.min(20, prev + 0.2);
          if (prev > target) return Math.max(0, prev - 0.2);
          return prev;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isSimulating, ligandConcentration, receptorDensity]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
            <Activity size={14} /> Cell Signaling and Signal Transductions
          </h3>
          <p className="text-[10px] text-[#484f58] mt-1">Intercellular Communication • Signal Transduction Pathways</p>
        </div>
        <div className="flex bg-[#161b22] border border-[#30363d] rounded-lg p-1">
          <button 
            onClick={() => setActiveView("simulator")}
            className={`px-3 py-1 text-[9px] font-bold uppercase rounded-md transition-all ${activeView === "simulator" ? "bg-emerald-500/20 text-emerald-400" : "text-[#484f58]"}`}
          > Simulation </button>
          <button 
            onClick={() => setActiveView("dashboard")}
            className={`px-3 py-1 text-[9px] font-bold uppercase rounded-md transition-all ${activeView === "dashboard" ? "bg-emerald-500/20 text-emerald-400" : "text-[#484f58]"}`}
          > Dashboard </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeView === "simulator" ? (
          <motion.div 
            key="sim"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="space-y-6"
          >
            <div className="relative h-48 bg-black rounded-2xl border border-[#30363d] overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.3)_0%,transparent_100%)]" />
              
              <motion.div 
                animate={{ 
                  scale: 1 + ligandConcentration / 100,
                  boxShadow: `0 0 ${signalIntensity * 5}px rgba(52,211,153,${signalIntensity / 20})`
                }}
                className="relative w-32 h-32 rounded-full border-2 border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center p-4 transition-all duration-500"
              >
                <motion.div 
                  animate={{ 
                    opacity: 0.3 + (signalIntensity / 20),
                    scale: 0.8 + (signalIntensity / 40)
                  }}
                  className="w-12 h-12 rounded-full bg-emerald-400 border border-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.5)]"
                />
                <div className="absolute inset-0 animate-pulse opacity-20 bg-[repeating-conic-gradient(from_0deg,transparent_0deg_10deg,rgba(16,185,129,0.5)_11deg_12deg)]" />
              </motion.div>

              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[9px] font-bold text-[#8b949e] uppercase tracking-widest">
                <span>Ligand Conc: {ligandConcentration} nM</span>
                <span>Signal Intensity: {(signalIntensity * 5).toFixed(1)}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
                <div className="flex justify-between items-center mb-2 text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">
                  <span>Ligand Concentration</span>
                  <span className="text-white">{ligandConcentration} nM</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={ligandConcentration}
                  onChange={(e) => setLigandConcentration(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-[#30363d] rounded-full appearance-none cursor-pointer"
                />
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
                <div className="flex justify-between items-center mb-2 text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">
                  <span>Receptor Density</span>
                  <span className="text-white">{receptorDensity} /um²</span>
                </div>
                <input 
                  type="range" min="1" max="50" value={receptorDensity}
                  onChange={(e) => setReceptorDensity(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-[#30363d] rounded-full appearance-none cursor-pointer"
                />
              </div>
            </div>

            <button 
              onClick={() => setIsSimulating(!isSimulating)}
              className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${
                isSimulating ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-emerald-600 text-white"
              }`}
            >
              {isSimulating ? "Stop Cascade" : "Initiate Signal <Zap size={14} />"}
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="dash"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* WebView Integration for Cell Signaling Video */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative h-64 bg-[#0d1117] rounded-2xl border border-[#30363d] overflow-hidden">
                <iframe 
                  src="https://www.youtube.com/embed/dS6jn0gMSZ0"
                  className="w-full h-full border-none opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  title="Cell Signaling and Signal Transductions"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <h4 className="text-white font-bold text-[10px] uppercase">Interactive Resource</h4>
                  <p className="text-[#8b949e] text-[8px]">Cell Signaling and Signal Transductions</p>
                </div>
              </div>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 border-b border-[#30363d] pb-3">
                <Dna size={16} />
                <h4 className="text-[10px] font-bold uppercase tracking-widest">AI Notes: Signal Transduction</h4>
              </div>
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                <p className="text-xs text-white font-medium leading-relaxed">
                  <span className="text-emerald-400 font-bold">Focus:</span> Intracellular relay systems and secondary messengers.
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-start gap-2 text-[10px] text-[#8b949e]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
                    <span>Ligand binding triggers G-protein coupled receptors or receptor tyrosine kinases.</span>
                  </div>
                  <div className="flex items-start gap-2 text-[10px] text-[#8b949e]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
                    <span>Secondary messengers like cAMP or Ca2+ amplify the signal for a rapid cellular response.</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#161b22]/50 border border-[#30363d] rounded-xl p-4">
        <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
          <FileText size={12} className="text-emerald-400" /> Observation Pass
        </h4>
        <p className="text-[#8b949e] text-[11px] leading-relaxed italic">
          Ligand-receptor kinetics determine the downstream activation threshold, essential for regulating gene expression and metabolic shifts.
        </p>
      </div>
    </div>
  );
}

// 2. CRISPR-Cas9 Robotics Lab (Code Execution Style)
function CrisprRoboticsLab({ onComplete }: { onComplete: () => void }) {
  const [targetSequence, setTargetSequence] = useState("GCTAGCTAGCTAGCTA");
  const [pamSite, setPamSite] = useState("NGG");
  const [cellType, setCellType] = useState("HEK293");
  const [isCutting, setIsCutting] = useState(false);
  const [cutSuccess, setCutSuccess] = useState<boolean | null>(null);

  const [code, setCode] = useState(`# CRISPR-GPT Efficiency Calculator
def simulate_crispr(g_rna, target_dna):
    # CRISPR-Cas9 typically requires an 'NGG' PAM site
    pam_site = target_dna[-3:]
    has_pam = pam_site.endswith("GG")

    # Calculate mismatches (Seed region focus)
    mismatches = sum(1 for a, b in zip(g_rna, target_dna[:20]) if a != b)
    seed_mismatches = sum(1 for a, b in zip(g_rna[10:], target_dna[10:20]) if a != b)
    
    # Calculate Efficiency (Penalize seed mismatches)
    base_eff = max(0, 1.0 - (mismatches * 0.1) - (seed_mismatches * 0.15))
    efficiency = base_eff if has_pam else 0.0

    return {
        "efficiency": round(efficiency, 4),
        "off_target": round((1.0 / (mismatches + 1)) * 0.8 if 0 < mismatches <= 3 else 0, 4),
        "pam_found": has_pam
    }`);

  const [output, setOutput] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runSimulation = () => {
    setIsRunning(true);
    setCutSuccess(null);
    setIsCutting(false);
    
    // Approximate JSON simulation logic
    setTimeout(() => {
      const g_rna = targetSequence.substring(0, 20).padEnd(20, "A");
      const target = targetSequence.substring(0, 20).padEnd(20, "A") + pamSite;
      
      const has_pam = pamSite.endsWith("GG");
      // Simulate some mismatches just for the UI feel if sequence was modified
      const mismatches = targetSequence.length < 16 ? 2 : 0; 
      const efficiency = has_pam ? Math.max(0, 1.0 - (mismatches * 0.15)) : 0;
      const offTarget = mismatches > 0 ? 0.35 : 0.042;
      
      const wasSuccessful = efficiency > 0.6;
      
      setOutput({
        efficiency: `${(efficiency * 100).toFixed(1)}%`,
        off_target_risk: offTarget.toFixed(3),
        pam_found: has_pam ? "DETECTED" : "MISSING",
        mismatches: mismatches,
        status: wasSuccessful ? "VALIDATED" : "FAILED"
      });
      setIsRunning(false);
      
      // Trigger visual cut after code execution
      setTimeout(() => {
        setIsCutting(true);
        setTimeout(() => {
          setCutSuccess(wasSuccessful);
          if (wasSuccessful) onComplete();
        }, 2000);
      }, 500);
    }, 1500);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-fuchsia-400 uppercase tracking-widest flex items-center gap-2">
          <Code size={14} /> CRISPR-GPT Execution Environment
        </h3>
        <div className="text-[9px] font-mono text-[#484f58]">KERNEL: BIO-PYTHON v3.1</div>
      </div>

      {/* Visual Simulation Stage */}
      <div className="relative h-32 bg-[#0d1117] rounded-2xl border border-[#30363d] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,#d946ef_0%,transparent_70%)]" />
        
        <div className="relative flex items-center gap-1 font-mono text-sm tracking-widest">
          {targetSequence.split('').map((base, i) => (
            <motion.span 
              key={i}
              animate={isCutting && i === 8 ? { 
                y: cutSuccess ? [0, -20, 0] : [0, -5, 0],
                opacity: cutSuccess ? [1, 0, 1] : 1
              } : {}}
              className={`font-bold transition-all duration-300 ${
                base === 'A' ? 'text-blue-400' :
                base === 'T' ? 'text-red-400' :
                base === 'G' ? 'text-emerald-400' :
                'text-yellow-400'
              }`}
            >
              {base}
            </motion.span>
          ))}

          {/* Cas9 Complex Visualization */}
          <AnimatePresence>
            {isCutting && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, x: -20 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute left-1/2 top-11 p-2 bg-fuchsia-500/20 border border-fuchsia-500/50 rounded-full text-fuchsia-400"
              >
                <Scissors size={20} className={cutSuccess === null ? "animate-pulse" : ""} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="absolute top-2 right-4 flex gap-3">
          <span className="text-[8px] font-mono text-[#484f58] uppercase">PAM: {pamSite}</span>
          <span className="text-[8px] font-mono text-[#484f58] uppercase">Line: {cellType}</span>
        </div>

        {cutSuccess !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10`}
          >
            <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border ${
              cutSuccess ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}>
              {cutSuccess ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {cutSuccess ? "Genomic Cleavage Successful" : "Cleavage Probability Failed"}
              </span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-3 space-y-1">
          <label className="text-[8px] text-[#484f58] font-bold uppercase tracking-widest">Target DNA</label>
          <input 
            value={targetSequence}
            onChange={(e) => setTargetSequence(e.target.value.toUpperCase().slice(0, 20))}
            className="w-full bg-transparent border-none text-[11px] text-white font-mono focus:outline-none"
          />
        </div>
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-3 space-y-1">
          <label className="text-[8px] text-[#484f58] font-bold uppercase tracking-widest">PAM Motif</label>
          <select 
            value={pamSite}
            onChange={(e) => setPamSite(e.target.value)}
            className="w-full bg-transparent border-none text-[11px] text-white font-mono focus:outline-none"
          >
            <option value="NGG">NGG (Cas9)</option>
            <option value="TTN">TTN (Cas12a)</option>
            <option value="NGH">NGH (Cas12b)</option>
          </select>
        </div>
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-3 space-y-1">
          <label className="text-[8px] text-[#484f58] font-bold uppercase tracking-widest">Cell Line</label>
          <select 
            value={cellType}
            onChange={(e) => setCellType(e.target.value)}
            className="w-full bg-transparent border-none text-[11px] text-white font-mono focus:outline-none"
          >
            <option value="HEK293">HEK293</option>
            <option value="CHO">CHO</option>
            <option value="iPSC">iPSC</option>
          </select>
        </div>
      </div>

      <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/30" />
          </div>
          <span className="text-[10px] text-[#484f58] font-mono">crispr_simulator.py</span>
        </div>
        <textarea 
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-40 bg-[#0d1117] p-6 font-mono text-xs text-blue-400 focus:outline-none resize-none spellcheck-false"
        />
        <div className="p-4 bg-[#0d1117] border-t border-[#30363d] flex justify-between items-center">
          <button 
            onClick={runSimulation}
            disabled={isRunning}
            className="px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-xl flex items-center gap-2 transition-all text-[10px] uppercase tracking-widest disabled:opacity-30"
          >
            {isRunning ? <RefreshCw className="animate-spin" size={12} /> : <Play size={12} />}
            Execute Bio-Sim
          </button>
        </div>
      </div>

      <AnimatePresence>
        {output && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#161b22] border border-fuchsia-500/30 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#30363d] pb-3 mb-3">
              <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest">Protocol Results</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                output.status === "VALIDATED" 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}>
                {output.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-1">
                <p className="text-[9px] uppercase font-bold text-[#484f58]">Editing Efficiency</p>
                <p className="text-white font-mono font-bold text-lg">{output.efficiency}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] uppercase font-bold text-[#484f58]">Off-Target Risk</p>
                <p className={`font-mono font-bold text-lg ${Number(output.off_target_risk) > 0.1 ? "text-yellow-400" : "text-white"}`}>
                  {output.off_target_risk}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] uppercase font-bold text-[#484f58]">PAM Site (NGG)</p>
                <p className={`font-mono font-bold text-xs ${output.pam_found === "DETECTED" ? "text-emerald-400" : "text-red-400"}`}>
                  {output.pam_found}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] uppercase font-bold text-[#484f58]">Mismatches</p>
                <p className="text-white font-mono font-bold text-xs">{output.mismatches}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl space-y-2">
        <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
          <Terminal size={12} /> Lab Protocol Snippet
        </h4>
        <p className="text-[#8b949e] text-[10px] leading-relaxed">
          <strong>Validation:</strong> Perform Surveyor assay 48h post-transfection. Use NGS to quantify HDR efficiency if introducing specific mutations.
        </p>
      </div>
    </div>
  );
}
