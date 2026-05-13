import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Share2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useUser } from "./UserContext";
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
        {type === "physics" && (
          labId === "phys_002" ? <KineticEnergyLab /> : 
          labId === "phys_003" ? <RampLab /> : 
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
