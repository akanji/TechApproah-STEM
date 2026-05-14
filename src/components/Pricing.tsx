import React, { useState } from "react";
import { CheckCircle2, Zap, Shield, Sparkles, ArrowRight } from "lucide-react";
import { useUser } from "./UserContext";

export function Pricing() {
  const { user, setPage } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
    setLoading(true);
    setError(null);

    if (!user) {
      setError("Please log in to subscribe.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          customerEmail: user.email,
        }),
      });

      const session = await response.json();

      if (session.error) {
        throw new Error(session.error);
      }

      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error("Subscription Error: No redirect URL found");
      }
    } catch (err: any) {
      console.error("Subscription Error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-24 h-full flex flex-col justify-center max-w-lg mx-auto">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
          <Sparkles size={12} /> Premium Access
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Unlock Your Potential</h2>
        <p className="text-[#8b949e] text-sm">Get full access to all virtual labs, AI-powered study aids, and specialist engineering tools.</p>
      </div>

      <div className="bg-[#161b22] border border-blue-500/30 rounded-[32px] p-8 space-y-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Zap size={120} fill="currentColor" className="text-blue-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Pro Subscription</div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">$19.99</span>
              <span className="text-[#8b949e] text-lg">/mo</span>
            </div>
            <p className="text-[#8b949e] text-[10px] leading-relaxed">Perfect for individual researchers and engineering students.</p>
            <button
              onClick={() => handleSubscribe("price_1TWUtuBMbxh6jv0Ca30P5IY1")}
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all uppercase tracking-widest text-[10px] mt-2"
            >
              Start Free Trial
            </button>
          </div>

          <div className="space-y-4 p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 relative overflow-hidden">
            <div className="absolute top-2 right-2 px-2 py-0.5 bg-blue-500 text-white text-[8px] font-bold rounded uppercase tracking-tighter shadow-lg">Save 20%</div>
            <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Premium Access</div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">$199.99</span>
              <span className="text-[#8b949e] text-lg">/yr</span>
            </div>
            <p className="text-[#8b949e] text-[10px] leading-relaxed">Full annual access with priority specialized lab updates.</p>
            <button
              onClick={() => handleSubscribe("price_1TWUtuBMbxh6jv0CcbXIuQZF")}
              disabled={loading}
              className="w-full py-3 bg-white text-[#0d162d] hover:bg-blue-50 text-[#0d162d] font-black rounded-xl transition-all uppercase tracking-widest text-[10px] mt-2"
            >
              Start Free Trial
            </button>
          </div>
        </div>

        <div className="relative z-10 p-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500">
          <button
            onClick={() => setPage('success')}
            className="w-full py-5 bg-[#0d162d] hover:bg-[#161b22] text-white font-bold rounded-[14px] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent uppercase tracking-[0.2em] text-sm font-black">
              Simulate Pro Upgrade (Demo)
            </span>
            <ArrowRight size={18} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="space-y-4 relative z-10">
          <h4 className="text-[10px] font-bold text-[#484f58] uppercase tracking-[0.2em]">Unlimited Capabilities:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {[
              "50+ Virtual Engineering Labs",
              "Unlimited AI Thinking Chat",
              "Specialist AI Hub Access",
              "Priority Expert Support",
              "Exportable Lab Reports",
              "Offline Study Mode"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] text-[#8b949e]">
                <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-[10px] text-[#484f58] uppercase tracking-widest">
          <Shield size={12} /> Secure Checkout powered by Stripe
        </div>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-[#484f58] uppercase tracking-widest leading-relaxed">
          Cancel anytime before trial ends. <br />
          No charges will be applied until the trial period is over.
        </p>
      </div>
    </div>
  );
}
