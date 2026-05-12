import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Zap, Save, Download, Play, Activity, Clock, ShieldCheck, AlertTriangle } from "lucide-react";
import { EECircuitLab } from "./EECircuitLab";
import { GoogleGenAI } from "@google/genai";
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useUser } from "./UserContext";

interface EELabProps {
  labId: string;
}

export function EELab({ labId }: EELabProps) {
  const [subTab, setSubTab] = useState<"logic" | "circuits" | "advanced">(
    labId === "ee_002" ? "circuits" : "logic"
  );
  const { user } = useUser();
  
  // Ohm's Law & Impedance State
  const [voltage, setVoltage] = useState(5);
  const [resistance, setResistance] = useState(100);
  const [inductance, setInductance] = useState(10); // mH
  const [capacitance, setCapacitance] = useState(100); // µF
  const [frequency, setFrequency] = useState(60); // Hz
  const [isSwitchClosed, setIsSwitchClosed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // AI Video State
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generationProgress, setGenerationProgress] = useState("");

  // Derived AC Metrics
  const omega = 2 * Math.PI * frequency;
  const xl = omega * (inductance / 1000); // Inductive Reactance
  const xc = 1 / (omega * (capacitance / 1000000)); // Capacitive Reactance
  const reactance = xl - xc;
  const impedance = Math.sqrt(Math.pow(resistance, 2) + Math.pow(reactance, 2));
  const current = (isSwitchClosed && impedance > 0 ? (voltage / impedance) : 0);
  const phaseAngle = Math.atan2(reactance, resistance) * (180 / Math.PI);
  const powerFactor = Math.cos(phaseAngle * (Math.PI / 180));
  const activePower = voltage * current * powerFactor;
  const reactivePower = voltage * current * Math.sin(phaseAngle * (Math.PI / 180));
  
  // Logic Gate State
  const [gateType, setGateType] = useState<"AND" | "OR" | "XOR" | "NAND" | "NOR">("AND");
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);
  
  const getGateOutput = () => {
    switch(gateType) {
      case "AND": return inputA && inputB;
      case "OR": return inputA || inputB;
      case "XOR": return inputA !== inputB;
      case "NAND": return !(inputA && inputB);
      case "NOR": return !(inputA || inputB);
      default: return false;
    }
  };

  const handleSaveCircuit = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const circuitRef = doc(db, "users", user.uid, "saved_circuits", labId);
      await setDoc(circuitRef, {
        voltage,
        resistance,
        inductance,
        capacitance,
        frequency,
        gateType,
        updatedAt: serverTimestamp()
      }, { merge: true });
      alert("Circuit configuration saved successfully!");
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}/saved_circuits/${labId}`);
    } finally {
      setIsSaving(false);
    }
  };

  const generateCircuitAnimation = async () => {
    const aistudio = (window as any).aistudio;
    if (!aistudio) return;

    const hasKey = await aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await aistudio.openSelectKey();
      // Assume selection successful as per guidelines
    }

    setIsGeneratingVideo(true);
    setVideoUrl(null);
    setGenerationProgress("Synthesizing prompt based on circuit parameters...");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      const prompt = `A cinematic, ultra-high-quality 3D scientific visualization of an AC circuit. 
      Parameters: Voltage ${voltage}V, Resistance ${resistance}Ω, Impedance ${impedance.toFixed(2)}Ω. 
      The video shows a frequency sweep from 0Hz to 10kHz, visualizing the resonance and impedance curve 
      with glowing holographic elements, electric arcs, and moving charge carriers in a futuristic lab setting. 4k resolution.`;

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        setGenerationProgress("Veo is rendering the impedance visualization... This may take up to a minute.");
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setGenerationProgress("Finalizing video stream...");
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: { 'x-goog-api-key': process.env.API_KEY || "" },
        });
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
      }
    } catch (error) {
      console.error("Video generation failed", error);
      alert("AI Video generation failed. Please check your API key and try again.");
    } finally {
      setIsGeneratingVideo(false);
      setGenerationProgress("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-[#161b22] border border-[#30363d] rounded-xl p-1 mb-4">
        <button 
          onClick={() => setSubTab("logic")}
          className={`flex-1 py-1.5 text-[9px] font-bold uppercase rounded-lg transition-all ${subTab === "logic" ? "bg-blue-500/20 text-blue-400" : "text-[#484f58] hover:text-[#8b949e]"}`}
        >
          Logic Gates
        </button>
        <button 
          onClick={() => setSubTab("circuits")}
          className={`flex-1 py-1.5 text-[9px] font-bold uppercase rounded-lg transition-all ${subTab === "circuits" ? "bg-yellow-500/20 text-yellow-400" : "text-[#484f58] hover:text-[#8b949e]"}`}
        >
          Circuits
        </button>
        {labId === "ee_002" && (
          <button 
            onClick={() => setSubTab("advanced")}
            className={`flex-1 py-1.5 text-[9px] font-bold uppercase rounded-lg transition-all ${subTab === "advanced" ? "bg-emerald-500/20 text-emerald-400" : "text-[#484f58] hover:text-[#8b949e]"}`}
          >
            Advanced Signals
          </button>
        )}
      </div>

      {subTab === "logic" ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-[#0b0e14] border border-[#30363d] rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]" />
            
            <div className="flex items-center gap-12 relative z-10">
              {/* Inputs */}
              <div className="flex flex-col gap-8">
                {[
                  { label: "Input A", state: inputA, set: setInputA },
                  { label: "Input B", state: inputB, set: setInputB }
                ].map((inp, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                     <button 
                      onClick={() => inp.set(!inp.state)}
                      className={`w-10 h-10 rounded-xl border-2 transition-all flex items-center justify-center font-mono font-bold ${
                        inp.state ? "bg-blue-500 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-black border-[#30363d] text-[#484f58]"
                      }`}
                    >
                      {inp.state ? "1" : "0"}
                    </button>
                    <span className="text-[8px] font-bold text-[#484f58] uppercase tracking-widest">{inp.label}</span>
                  </div>
                ))}
              </div>

              {/* Gate Shape */}
              <div className="relative group">
                <div className={`w-28 h-20 rounded-r-full border-2 flex items-center justify-center relative ${
                  getGateOutput() ? "bg-blue-500/10 border-blue-500" : "bg-black/40 border-[#30363d]"
                }`}>
                  <div className="absolute -left-1 w-1 h-full bg-[#0d1117]" />
                  <span className={`text-xl font-black italic tracking-tighter ${getGateOutput() ? "text-blue-400" : "text-[#484f58]"}`}>
                    {gateType}
                  </span>
                </div>
                {/* Connection Lines */}
                <div className="absolute top-1/4 -left-12 w-12 h-px bg-[#30363d]" />
                <div className="absolute bottom-1/4 -left-12 w-12 h-px bg-[#30363d]" />
                <div className="absolute top-1/2 -right-8 w-8 h-px bg-[#30363d]" />
              </div>

              {/* Output */}
              <div className="flex flex-col items-center gap-2">
                <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-mono text-xl font-black transition-all ${
                  getGateOutput() ? "bg-yellow-400 border-yellow-300 text-black shadow-[0_0_20px_rgba(250,204,21,0.6)]" : "bg-black border-[#30363d] text-[#484f58]"
                }`}>
                  {getGateOutput() ? "1" : "0"}
                </div>
                <span className="text-[8px] font-bold text-[#484f58] uppercase tracking-widest">Output Y</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
             {(["AND", "OR", "XOR", "NAND", "NOR"] as const).map((type) => (
               <button
                key={type}
                onClick={() => setGateType(type)}
                className={`py-2 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                  gateType === type ? "bg-blue-500 text-white border-blue-400 shadow-lg" : "bg-[#161b22] border-[#30363d] text-[#484f58] hover:text-white"
                }`}
               >
                 {type}
               </button>
             ))}
          </div>

          <div className="p-4 bg-[#161b22] rounded-xl border border-[#30363d] relative overflow-hidden group">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Sparkles size={16} />
               </div>
               <div className="flex-1">
                 <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-0.5">Electric Pal Logic Parser</p>
                 <p className="text-[9px] text-[#484f58] uppercase font-bold">A·B = Y for {gateType} Gate simulation</p>
               </div>
               <div className="text-right">
                 <p className="text-[10px] font-mono text-blue-400 font-bold">{inputA ? "1" : "0"} {gateType === "AND" ? "·" : gateType === "OR" ? "+" : "⊕"} {inputB ? "1" : "0"} = {getGateOutput() ? "1" : "0"}</p>
               </div>
             </div>
          </div>
        </div>
      ) : subTab === "circuits" ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="relative h-48 bg-black rounded-2xl border border-[#30363d] overflow-hidden flex flex-col items-center justify-center group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1a1a_0%,#000_100%)]" />
            
            <AnimatePresence>
              {isSwitchClosed && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: Math.min(0.8, Math.min(1.5, current * 10)),
                    scale: 0.5 + (Math.min(1.5, current * 10) * 0.5),
                    filter: `blur(${10 + Math.min(1.5, current * 10) * 20}px)`
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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-[10px] uppercase font-bold text-yellow-400">Voltage (V)</div>
                <div className="text-xs font-mono text-white">{voltage}V</div>
              </div>
              <input type="range" min="0" max="24" step="0.5" value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} className="w-full accent-yellow-500 bg-[#30363d] h-1.5 rounded-lg appearance-none cursor-pointer" />
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-[10px] uppercase font-bold text-purple-400">Resistance (Ω)</div>
                <div className="text-xs font-mono text-white">{resistance}Ω</div>
              </div>
              <input type="range" min="10" max="1000" step="10" value={resistance} onChange={(e) => setResistance(Number(e.target.value))} className="w-full accent-purple-500 bg-[#30363d] h-1.5 rounded-lg appearance-none cursor-pointer" />
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-[10px] uppercase font-bold text-blue-400">Inductance (mH)</div>
                <div className="text-xs font-mono text-white">{inductance}mH</div>
              </div>
              <input type="range" min="0" max="100" step="1" value={inductance} onChange={(e) => setInductance(Number(e.target.value))} className="w-full accent-blue-500 bg-[#30363d] h-1.5 rounded-lg appearance-none cursor-pointer" />
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-[10px] uppercase font-bold text-emerald-400">Capacitance (µF)</div>
                <div className="text-xs font-mono text-white">{capacitance}µF</div>
              </div>
              <input type="range" min="1" max="1000" step="1" value={capacitance} onChange={(e) => setCapacitance(Number(e.target.value))} className="w-full accent-emerald-500 bg-[#30363d] h-1.5 rounded-lg appearance-none cursor-pointer" />
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-[10px] uppercase font-bold text-orange-400">Frequency (Hz)</div>
                <div className="text-xs font-mono text-white">{frequency}Hz</div>
              </div>
              <input type="range" min="1" max="1000" step="1" value={frequency} onChange={(e) => setFrequency(Number(e.target.value))} className="w-full accent-orange-500 bg-[#30363d] h-1.5 rounded-lg appearance-none cursor-pointer" />
            </div>
            <div className="flex items-center gap-4 bg-[#161b22] p-4 rounded-xl border border-[#30363d]">
              <div className="flex-1 text-center">
                 <div className="text-[10px] uppercase font-bold text-[#8b949e] mb-1">Safety Switch</div>
                 <button 
                  onClick={() => setIsSwitchClosed(!isSwitchClosed)}
                  className={`mx-auto w-12 h-6 rounded-full relative transition-colors ${isSwitchClosed ? "bg-yellow-500" : "bg-[#30363d]"}`}
                >
                  <motion.div animate={{ x: isSwitchClosed ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-center">
              <div className="text-[10px] uppercase font-bold text-[#8b949e] mb-1">Total Impedance (Z)</div>
              <div className="text-xl font-mono text-blue-400 font-bold">{impedance.toFixed(2)}<span className="text-xs ml-1">Ω</span></div>
            </div>
            <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-center">
              <div className="text-[10px] uppercase font-bold text-[#8b949e] mb-1">Phase Angle (θ)</div>
              <div className="text-xl font-mono text-purple-400 font-bold">{phaseAngle.toFixed(1)}<span className="text-xs ml-1">°</span></div>
            </div>
            <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-center">
              <div className="text-[10px] uppercase font-bold text-[#8b949e] mb-1">Active Power (P)</div>
              <div className="text-xl font-mono text-pink-500 font-bold">{activePower.toFixed(2)}<span className="text-xs ml-1">W</span></div>
            </div>
            <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-center">
              <div className="text-[10px] uppercase font-bold text-[#8b949e] mb-1">Reactive Power (Q)</div>
              <div className="text-xl font-mono text-orange-400 font-bold">{reactivePower.toFixed(2)}<span className="text-xs ml-1">VAR</span></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleSaveCircuit}
              disabled={isSaving || !user}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                isSaving ? "bg-[#30363d] text-[#8b949e]" : "bg-[#161b22] border border-[#30363d] text-white hover:bg-[#30363d]"
              }`}
            >
              <Save size={16} className={isSaving ? "animate-spin" : ""} />
              {isSaving ? "Saving..." : "Save Circuit Config"}
            </button>
            <button 
              onClick={generateCircuitAnimation}
              disabled={isGeneratingVideo}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                isGeneratingVideo ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20"
              }`}
            >
              <Play size={16} className={isGeneratingVideo ? "animate-pulse" : ""} />
              {isGeneratingVideo ? "Generating..." : "Generate Circuit Animation"}
            </button>
          </div>

          {/* AI Video Display */}
          <AnimatePresence>
            {(isGeneratingVideo || videoUrl) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0b0e14] border border-[#30363d] rounded-2xl p-6 overflow-hidden relative"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-blue-400" />
                    <h5 className="text-[10px] font-bold text-white uppercase tracking-widest">AI Impedance Visualization (Veo)</h5>
                  </div>
                  {videoUrl && (
                    <a href={videoUrl} download="circuit_animation.mp4" className="text-blue-400 hover:text-blue-300">
                      <Download size={14} />
                    </a>
                  )}
                </div>

                {isGeneratingVideo ? (
                  <div className="aspect-video w-full rounded-xl bg-black border border-[#30363d] flex flex-col items-center justify-center gap-4">
                    <Activity size={32} className="text-blue-400 animate-bounce" />
                    <p className="text-[10px] font-mono text-[#8b949e] animate-pulse px-8 text-center">{generationProgress}</p>
                  </div>
                ) : videoUrl ? (
                  <video src={videoUrl} controls autoPlay loop className="w-full rounded-xl border border-[#30363d]" />
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4 pt-4 border-t border-[#30363d]/50">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b949e]">Experimental Physics Briefing</h4>
            </div>
            <div className="aspect-video w-full rounded-2xl border border-[#30363d] overflow-hidden bg-black shadow-2xl">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/INEtYZqtjTo"
                title="Physics Simulation Briefing"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
            <p className="text-[9px] text-[#484f58] uppercase font-bold text-center tracking-widest leading-loose">
              Reference protocol: INEtYZqtjTo // Circuit resonance & charge distribution
            </p>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
           <EECircuitLab />
        </div>
      )}
    </div>
  );
}
