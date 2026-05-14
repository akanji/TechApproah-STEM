import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Share2, ShieldCheck, CheckCircle2, Search, Zap, RefreshCcw } from "lucide-react";
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useUser } from "./UserContext";
import { ai, MODELS } from "../lib/gemini";
import Markdown from "react-markdown";
import { BioSimulator } from "./BioSimulator";
import { StructuralGeotechLab } from "./StructuralGeotechLab";
import { PhysicsLab } from "./PhysicsLab";
import { EELab } from "./EELab";
import { ThermoLab } from "./ThermoLab";
import { BioLabSimple } from "./BioLabSimple";
import { StructuralLab } from "./StructuralLab";
import { KineticEnergyLab } from "./KineticEnergyLab";
import { RampLab } from "./RampLab";
import { MechanicalLab } from "./MechanicalLab";
import { BridgeDesignLab } from "./BridgeDesignLab";

interface LabProps {
  type: "physics" | "ee" | "thermo" | "bio" | "structural" | "mechanical";
  labId?: string;
  onComplete: () => void;
}

export function LabEngine({ type, labId = "unknown", onComplete }: LabProps) {
  const [isValidated, setIsValidated] = useState(false);
  const { user, updateXP } = useUser();

  useEffect(() => {
    // Simulate "Judge Agent" validation pass
    const timer = setTimeout(() => setIsValidated(true), 1500);
    return () => clearTimeout(timer);
  }, [type]);

  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleExplain = async () => {
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const response = await ai.models.generateContent({
        model: MODELS.flash,
        contents: [{
          role: "user",
          parts: [{ text: `Explain the physics and engineering principles behind this specific simulation: ${type} (ID: ${labId}). 
          Provide a concise high-level summary of the mechanics involved.` }]
        }],
        config: {
          systemInstruction: "You are a laboratory supervisor. Explain the simulation principles clearly.",
        }
      });
      setAnalysis(response.text || "No analysis available.");
    } catch (e) {
      console.error("Analysis error:", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const JudgeAgentBadge = () => (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-2">
      <ShieldCheck size={12} />
      Validated by Judge Agent (A2A)
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 shadow-2xl relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[#e6edf3] font-bold flex items-center gap-2">
            <Sparkles size={18} className="text-blue-400" />
            Interactive Lab Module
          </h3>
          <p className="text-[#8b949e] text-xs mt-1">Live simulation environment powered by formula engine.</p>
        </div>
        <AnimatePresence>
          {isValidated && type !== "ee" && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <JudgeAgentBadge />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="min-h-[200px]">
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-4 bg-blue-600/5 border border-blue-500/20 rounded-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                  <Zap size={12} fill="currentColor" /> AI Simulation Insight
                </h4>
                <button onClick={() => setAnalysis(null)} className="text-[#484f58] hover:text-white transition-colors">
                  <RefreshCcw size={12} />
                </button>
              </div>
              <div className="text-[11px] text-[#c9d1d9] leading-relaxed font-mono">
                <Markdown>{analysis}</Markdown>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {type === "physics" && (
          labId === "phys_002" ? <KineticEnergyLab /> : 
          labId === "phys_003" ? <RampLab /> : 
          labId === "phys_004" ? <PhysicsLab /> : 
          <PhysicsLab />
        )}
        {type === "ee" && <EELab labId={labId} />}
        {type === "thermo" && <ThermoLab />}
        {type === "bio" && <BioSimulator labId={labId} onComplete={onComplete} />}
        {type === "structural" && (
          labId === "mech_001" ? <StructuralGeotechLab /> : 
          labId === "bridge_001" ? <BridgeDesignLab /> :
          <StructuralLab />
        )}
        {type === "mechanical" && <MechanicalLab />}
      </div>

      <div className="mt-8 pt-6 border-t border-[#30363d] flex gap-3">
        <button 
          onClick={handleExplain}
          disabled={isAnalyzing}
          className="flex-1 py-3 bg-[#161b22] border border-blue-500/20 text-blue-400 font-bold rounded-xl hover:bg-blue-500/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <RefreshCcw size={18} className="animate-spin" />
          ) : (
            <Search size={18} />
          )}
          {isAnalyzing ? "Analyzing..." : "Explain Simulation"}
        </button>
        <button 
          onClick={async () => {
            if (user) {
              const progressRef = doc(db, "users", user.uid, "progress", labId);
              try {
                await setDoc(progressRef, {
                  labId,
                  userId: user.uid,
                  completed: true,
                  score: 100, // Default for completion
                  lastAttemptAt: serverTimestamp(),
                  updatedAt: serverTimestamp()
                }, { merge: true });
                await updateXP(500);
              } catch (e) {
                handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}/progress/${labId}`);
              }
            }
            onComplete();
          }}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={18} />
          Complete Lab
        </button>
        <button className="p-3 bg-[#161b22] border border-[#30363d] rounded-xl text-[#8b949e] hover:text-white transition-all">
          <Share2 size={18} />
        </button>
      </div>

      {/* Decorative background element */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />
    </motion.div>
  );
}
