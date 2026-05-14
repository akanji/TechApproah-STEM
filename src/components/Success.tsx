import React, { useEffect } from "react";
import { CheckCircle2, ArrowRight, PartyPopper } from "lucide-react";
import { motion } from "motion/react";
import { useUser } from "./UserContext";

export function Success() {
  const { updateProfile, setPage } = useUser();

  useEffect(() => {
    // In a real app, this would be verified server-side via webhook.
    // For this prototype, we'll simulate the successful subscription.
    updateProfile({ isSubscribed: true });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 px-4">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/10"
      >
        <PartyPopper size={48} />
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white tracking-tight">Welcome to Pro!</h2>
        <p className="text-[#8b949e] max-w-md mx-auto">
          Your subscription is now active. You have full access to all virtual labs, premium tools, and AI study partners.
        </p>
      </div>

      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-xl">
        <div className="flex items-center gap-3 text-emerald-400 text-sm font-medium">
          <CheckCircle2 size={18} /> Membership Activated
        </div>
        <p className="text-[10px] text-[#484f58] uppercase tracking-widest leading-relaxed">
          You can manage your subscription settings from your profile at any time.
        </p>
      </div>

      <button
        onClick={() => setPage('home')}
        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group uppercase tracking-widest text-xs"
      >
        Go to Dashboard
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
