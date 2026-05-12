import React, { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

export function BioLabSimple() {
  const dnaSequence = ["A", "C", "G", "T", "A", "G", "T"];
  const transcriptionMap: { [key: string]: string } = {
    "A": "U",
    "T": "A",
    "C": "G",
    "G": "C"
  };

  const [rnaSequence, setRnaSequence] = useState<(string | null)[]>(new Array(dnaSequence.length).fill(null));
  const [isComplete, setIsComplete] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const placeBase = (base: string) => {
    if (activeIndex >= dnaSequence.length || isComplete) return;

    if (base === transcriptionMap[dnaSequence[activeIndex]]) {
      const newSeq = [...rnaSequence];
      newSeq[activeIndex] = base;
      setRnaSequence(newSeq);
      
      if (activeIndex === dnaSequence.length - 1) {
        setIsComplete(true);
      } else {
        setActiveIndex(prev => prev + 1);
      }
    } else {
      const el = document.getElementById(`rna-slot-${activeIndex}`);
      el?.classList.add('animate-shake');
      setTimeout(() => el?.classList.remove('animate-shake'), 400);
    }
  };

  const reset = () => {
    setRnaSequence(new Array(dnaSequence.length).fill(null));
    setIsComplete(false);
    setActiveIndex(0);
  };

  return (
    <div className="space-y-6">
      <div className="bg-black/40 rounded-2xl border border-[#30363d] p-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-evenly">
            {dnaSequence.map((base, i) => (
              <div key={`dna-${i}`} className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-600 border border-blue-400 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                  {base}
                </div>
                <div className={`h-4 w-0.5 ${i <= activeIndex ? "bg-white/20" : "bg-[#30363d]"}`} />
                <div 
                  id={`rna-slot-${i}`}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border-2 transition-all ${
                    rnaSequence[i] 
                      ? "bg-fuchsia-600 border-fuchsia-400 text-white shadow-[0_0_20px_rgba(192,38,211,0.4)]" 
                      : activeIndex === i 
                        ? "bg-fuchsia-900/20 border-fuchsia-500/50 border-dashed animate-pulse" 
                        : "bg-[#161b22] border-[#30363d] border-dashed opacity-30"
                  }`}
                >
                  {rnaSequence[i] || "?"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isComplete ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-green-500/10 border border-green-500/30 rounded-2xl text-center space-y-3"
        >
          <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest">Transcription Successful!</h3>
          <p className="text-xs text-[#8b949e]">mRNA is fully synthesized and ready for <strong>Translation</strong>.</p>
          <button onClick={reset} className="mt-2 text-[10px] text-white/50 hover:text-white underline uppercase font-bold px-4 py-2">Reset Synthesis</button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-[10px] text-[#8b949e] uppercase font-bold tracking-[0.2em] mb-4">Select mRNA Complement</p>
          </div>
          <div className="grid grid-cols-4 gap-3 px-4">
            {["A", "U", "C", "G"].map(base => (
              <button
                key={base}
                onClick={() => placeBase(base)}
                className={`py-4 rounded-xl font-bold transition-all transform active:scale-90 ${
                  base === "U" 
                    ? "bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-900/20" 
                    : "bg-[#161b22] border border-[#30363d] text-[#c9d1d9] hover:border-blue-500/50"
                }`}
              >
                {base}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
